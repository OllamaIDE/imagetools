import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Download, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ToolPageLayout } from '@/components/ToolPageLayout';
import { TOOLS } from '@/config/tools';
import { resizeImage, fileToCanvas } from '@/utils/imageProcessing';
import { SEOHead } from '@/components/SEOHead';
import { AdSlot } from '@/components/AdSlot';
import { getAdCode } from '@/config/ads';

const tool = TOOLS.find(t => t.id === 'image-resizer')!;

export default function ImageResizer() {
  const [file, setFile] = useState<File | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });
  const [lockAspectRatio, setLockAspectRatio] = useState(true);
  const [unit, setUnit] = useState<'px' | '%'>('px');
  const [fit, setFit] = useState<'contain' | 'cover' | 'fill'>('contain');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ blob: Blob; url: string; width: number; height: number } | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      const canvas = await fileToCanvas(selectedFile);
      setDimensions({ width: canvas.width, height: canvas.height });
      setOriginalDimensions({ width: canvas.width, height: canvas.height });
      setResult(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false
  });

  const handleWidthChange = (val: string) => {
    const w = parseInt(val) || 0;
    if (lockAspectRatio && originalDimensions.width > 0) {
      const h = Math.round((w / originalDimensions.width) * originalDimensions.height);
      setDimensions({ width: w, height: h });
    } else {
      setDimensions(prev => ({ ...prev, width: w }));
    }
  };

  const handleHeightChange = (val: string) => {
    const h = parseInt(val) || 0;
    if (lockAspectRatio && originalDimensions.height > 0) {
      const w = Math.round((h / originalDimensions.height) * originalDimensions.width);
      setDimensions({ width: w, height: h });
    } else {
      setDimensions(prev => ({ ...prev, height: h }));
    }
  };

  const handleProcess = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      let targetW = dimensions.width;
      let targetH = dimensions.height;
      if (unit === '%') {
        targetW = Math.round((originalDimensions.width * dimensions.width) / 100);
        targetH = Math.round((originalDimensions.height * dimensions.height) / 100);
      }
      const resizedBlob = await resizeImage(file, targetW, targetH, fit);
      const url = URL.createObjectURL(resizedBlob);
      setResult({
        blob: resizedBlob,
        url,
        width: targetW,
        height: targetH
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
    a.download = `resized-${file?.name}`;
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
        title="Free Image Resizer Online — Resize Images to Exact Pixels"
        description="Resize images online to any dimension in pixels or percentage. Lock aspect ratio, choose fit mode. Free browser-based tool, no signup required."
        keywords="image resizer, resize image online, change image size, resize photo"
        canonical="/tools/image-resizer"
      />

      <div className="space-y-8">
        <div {...getRootProps()} className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-zinc-200 hover:border-zinc-300 bg-zinc-50/50'}`}>
          <input {...getInputProps()} />
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-white rounded-full shadow-sm"><Upload className="h-8 w-8 text-zinc-400" /></div>
            {file ? <div className="space-y-1"><p className="font-medium">{file.name}</p></div> : <p className="font-medium text-zinc-900">Click or drag image to resize</p>}
          </div>
        </div>

        {file && (
          <Card className="border-zinc-200 shadow-none">
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Width ({unit})</label>
                  <Input type="number" value={dimensions.width} onChange={(e) => handleWidthChange(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Height ({unit})</label>
                  <Input type="number" value={dimensions.height} onChange={(e) => handleHeightChange(e.target.value)} />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">Lock Aspect Ratio</label>
                </div>
                <Switch checked={lockAspectRatio} onCheckedChange={setLockAspectRatio} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Unit</label>
                <Select value={unit} onValueChange={(val: any) => setUnit(val)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="px">Pixels (px)</SelectItem>
                    <SelectItem value="%">Percentage (%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Fit Mode</label>
                <Tabs value={fit} onValueChange={(val: any) => setFit(val)}>
                  <TabsList className="w-full grid grid-cols-3">
                    <TabsTrigger value="contain">Contain</TabsTrigger>
                    <TabsTrigger value="cover">Cover</TabsTrigger>
                    <TabsTrigger value="fill">Fill</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <Button onClick={handleProcess} disabled={isProcessing} className="w-full h-12 bg-blue-600 hover:bg-blue-700">
                {isProcessing ? 'Resizing...' : 'Resize Image'}
              </Button>
            </CardContent>
          </Card>
        )}

        {(isProcessing || result) && (
          <div className="space-y-6">
            <h3 className="font-bold text-xl text-zinc-900">Result</h3>
            {isProcessing ? (
              <Skeleton className="h-96 w-full rounded-xl" />
            ) : result && (
              <div className="space-y-6">
                <div className="rounded-xl border border-zinc-200 overflow-hidden bg-zinc-50 flex items-center justify-center p-4">
                  <img src={result.url} alt="Resized" className="max-h-96 object-contain shadow-sm" />
                </div>
                <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-lg border border-zinc-200">
                  <p className="text-sm font-medium">New dimensions: {result.width} x {result.height} px</p>
                  <Button onClick={handleDownload} className="space-x-2">
                    <Download className="h-4 w-4" />
                    <span>Download</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </ToolPageLayout>
  );
}
