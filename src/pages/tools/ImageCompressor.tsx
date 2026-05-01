import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Download, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ToolPageLayout } from '@/components/ToolPageLayout';
import { TOOLS } from '@/config/tools';
import { compressImage } from '@/utils/imageProcessing';
import { SEOHead } from '@/components/SEOHead';
import { AdSlot } from '@/components/AdSlot';
import { getAdCode } from '@/config/ads';

const tool = TOOLS.find(t => t.id === 'image-compressor')!;

export default function ImageCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [quality, setQuality] = useState([80]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ blob: Blob; url: string; size: number } | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResult(null);
    }
  }, []);

  // Real-time compression
  useEffect(() => {
    if (!file) return;
    const timer = setTimeout(() => {
      handleProcess();
    }, 300); // Debounce to avoid too many processes
    return () => clearTimeout(timer);
  }, [quality, file]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    multiple: false
  });

  const handleProcess = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const compressedBlob = await compressImage(file, quality[0]);
      const url = URL.createObjectURL(compressedBlob);
      setResult({
        blob: compressedBlob,
        url,
        size: compressedBlob.size
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const a = document.createElement('a');
    a.href = result.url;
    a.download = `compressed-${file?.name}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <ToolPageLayout
      toolId={tool.id}
      title={tool.name}
      description={tool.description}
      icon={tool.icon}
    >
      <SEOHead
        title="Free Online Image Compressor — Reduce Image Size Without Losing Quality"
        description="Compress JPG, PNG and WebP images online for free. Reduce file size by up to 90% with our browser-based image compressor. No upload to server."
        keywords="image compressor, compress image online, reduce image size, jpg compressor, png compressor"
        canonical="/tools/image-compressor"
      />

      <div className="space-y-8">
        {/* Upload Zone */}
        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors
            ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-zinc-200 hover:border-zinc-300 bg-zinc-50/50'}`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-white rounded-full shadow-sm">
              <Upload className="h-8 w-8 text-zinc-400" />
            </div>
            {file ? (
              <div className="space-y-1">
                <p className="font-medium text-zinc-900">{file.name}</p>
                <p className="text-sm text-zinc-500">{formatSize(file.size)}</p>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="font-medium text-zinc-900">Click or drag image to compress</p>
                <p className="text-sm text-zinc-500">Supports JPG, PNG, WebP (Max 10MB)</p>
              </div>
            )}
          </div>
        </div>

        <AdSlot slot="in-content" adCode={getAdCode('inContent')} />

        {/* Controls */}
        {file && (
          <Card className="border-zinc-200 shadow-none">
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">Quality ({quality}%)</label>
                  <span className="text-xs text-zinc-500">Lower quality = smaller file</span>
                </div>
                <Slider 
                  value={quality} 
                  onValueChange={setQuality} 
                  min={1} 
                  max={100} 
                  step={1} 
                  className="py-4"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">Lossless Compression</label>
                  <p className="text-xs text-zinc-500">Maintain original image data</p>
                </div>
                <Switch disabled />
              </div>

              <Button 
                onClick={handleProcess} 
                disabled={isProcessing}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700"
              >
                {isProcessing ? 'Compressing...' : 'Compress Image'}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Result Preview */}
        {file && (result || isProcessing) && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Original</p>
                <div className="aspect-video relative rounded-lg overflow-hidden border border-zinc-200 bg-zinc-100">
                  <img src={preview!} alt="Original" className="object-contain w-full h-full" />
                  <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/50 text-white text-[10px] rounded">
                    {formatSize(file!.size)}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Compressed Preview</p>
                <div className="aspect-video relative rounded-lg overflow-hidden border border-blue-200 bg-blue-50/30">
                  {isProcessing && !result ? (
                    <Skeleton className="w-full h-full" />
                  ) : result ? (
                    <>
                      <img src={result.url} alt="Compressed" className="object-contain w-full h-full" />
                      <div className="absolute bottom-2 right-2 px-2 py-1 bg-blue-600 text-white text-[10px] rounded">
                        {formatSize(result.size)}
                      </div>
                    </>
                  ) : null}
                </div>
              </div>
            </div>

            {result && (
              <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-lg border border-zinc-200">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-1 rounded-full">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Successfully compressed!</p>
                    <p className="text-xs text-zinc-500">
                      Saved {((file!.size - result.size) / file!.size * 100).toFixed(1)}% ({formatSize(file!.size - result.size)})
                    </p>
                  </div>
                </div>
                <Button onClick={handleDownload} className="space-x-2">
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </ToolPageLayout>
  );
}
