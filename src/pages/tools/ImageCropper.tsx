import { useState, useCallback, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import ReactCrop, { 
  centerCrop, 
  makeAspectCrop, 
  convertToPixelCrop,
  type Crop, 
  type PixelCrop,
} from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Upload, Download, Crop as CropIcon, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ToolPageLayout } from '@/components/ToolPageLayout';
import { TOOLS } from '@/config/tools';
import { canvasToBlob } from '@/utils/imageProcessing';
import { SEOHead } from '@/components/SEOHead';
import { ScrollArea } from '@/components/ui/scroll-area';

const tool = TOOLS.find(t => t.id === 'image-cropper')!;

// Helper to center the crop
function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number | undefined,
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect || 1, // Fallback to 1 if undefined for initial calculation
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  )
}

export default function ImageCropper() {
  const [file, setFile] = useState<File | null>(null);
  const [imgSrc, setImgSrc] = useState('');
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [aspect, setAspect] = useState<number | undefined>(undefined);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ blob: Blob; url: string } | null>(null);
  
  const imgRef = useRef<HTMLImageElement>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      setResult(null);
      setCrop(undefined); // Reset crop
      
      const reader = new FileReader();
      reader.addEventListener('load', () => setImgSrc(reader.result?.toString() || ''));
      reader.readAsDataURL(selectedFile);
    }
  }, []);

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
    }
  };

  const handleAspectChange = (newAspect: number | undefined) => {
    setAspect(newAspect);
    if (imgRef.current) {
      const { width, height } = imgRef.current;
      setCrop(centerAspectCrop(width, height, newAspect));
    }
  };

  // Real-time preview generation
  useEffect(() => {
    if (!completedCrop || !imgRef.current) return;

    const timer = setTimeout(async () => {
      await generateResult();
    }, 150);

    return () => clearTimeout(timer);
  }, [completedCrop]);

  const generateResult = async () => {
    if (!completedCrop || !imgRef.current) return;

    const image = imgRef.current;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;

    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height,
    );

    const blob = await canvasToBlob(canvas);
    if (result?.url) URL.revokeObjectURL(result.url);
    const url = URL.createObjectURL(blob);
    setResult({ blob, url });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false
  });

  const handleDownload = () => {
    if (!result) return;
    const a = document.createElement('a');
    a.href = result.url;
    a.download = `cropped-${file?.name}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <ToolPageLayout
      toolId={tool.id}
      title={tool.name}
      description={tool.description}
      icon={tool.icon}
    >
      <SEOHead
        title="Free Online Image Cropper — Crop Photos to Any Size or Ratio"
        description="Crop images online with preset aspect ratios or custom dimensions. No signup, no upload. 100% browser-based image cropping tool using pro-grade features."
        keywords="image cropper, crop image online, crop photo, crop picture, react image crop"
        canonical="/tools/image-cropper"
      />

      <div className="space-y-8">
        <div {...getRootProps()} className={`border-2 border-dashed rounded-xl p-8 sm:p-12 text-center cursor-pointer transition-all ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-zinc-200 hover:border-blue-400 bg-zinc-50/50'}`}>
          <input {...getInputProps()} />
          <div className="flex flex-col items-center space-y-4">
            <div className={`p-4 bg-white rounded-full shadow-sm transition-transform ${isDragActive ? 'scale-110' : ''}`}>
              <Upload className={`h-8 w-8 ${isDragActive ? 'text-blue-600' : 'text-zinc-400'}`} />
            </div>
            {file ? (
              <div className="space-y-1">
                <p className="font-bold text-zinc-900">{file.name}</p>
                <p className="text-sm text-zinc-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="font-bold text-zinc-900">Click or drag image to crop</p>
                <p className="text-sm text-zinc-500">Supports JPG, PNG, WebP & more</p>
              </div>
            )}
          </div>
        </div>

        {imgSrc && (
          <Card className="border-zinc-200 shadow-none overflow-hidden">
            <CardContent className="p-0">
              <div className="p-4 border-b border-zinc-100 bg-zinc-50/50">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-3 block px-1">Quick Presets</label>
                <ScrollArea className="w-full">
                  <div className="flex space-x-2 pb-2">
                    {[
                      { label: 'Free', value: undefined },
                      { label: '1:1 Square', value: 1 },
                      { label: '4:3 Standard', value: 4/3 },
                      { label: '16:9 Cinematic', value: 16/9 },
                      { label: '9:16 Story', value: 9/16 },
                      { label: '3:2 Photo', value: 3/2 },
                    ].map((preset) => (
                      <Button
                        key={preset.label}
                        variant={aspect === preset.value ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleAspectChange(preset.value)}
                        className={`rounded-full px-4 h-8 text-xs font-semibold whitespace-nowrap ${aspect === preset.value ? 'bg-blue-600' : 'border-zinc-200'}`}
                      >
                        {preset.label}
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              <div className="p-4 sm:p-8 bg-zinc-100 flex justify-center min-h-[300px] items-center">
                <ReactCrop
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={aspect}
                  className="max-h-[60vh] shadow-2xl rounded-lg overflow-hidden border-4 border-white"
                >
                  <img
                    ref={imgRef}
                    alt="Crop me"
                    src={imgSrc}
                    onLoad={onImageLoad}
                    className="max-w-full h-auto block"
                  />
                </ReactCrop>
              </div>

              {result && (
                <div className="p-6 bg-white border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-lg border border-zinc-200 overflow-hidden bg-zinc-50 shrink-0">
                      <img src={result.url} className="w-full h-full object-contain" alt="Preview" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-zinc-900">Crop Ready</p>
                      <p className="text-xs text-zinc-500">Preview generated instantly</p>
                    </div>
                  </div>
                  <div className="flex space-x-2 w-full sm:w-auto">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setImgSrc('');
                        setFile(null);
                        setResult(null);
                      }}
                      className="flex-1 sm:flex-none"
                    >
                      <RefreshCcw className="h-4 w-4 mr-2" />
                      Reset
                    </Button>
                    <Button onClick={handleDownload} className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 space-x-2">
                      <Download className="h-4 w-4" />
                      <span>Download</span>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </ToolPageLayout>
  );
}
