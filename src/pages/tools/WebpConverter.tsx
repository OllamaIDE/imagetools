import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Download, ImagePlay } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { ToolPageLayout } from '@/components/ToolPageLayout';
import { TOOLS } from '@/config/tools';
import { convertImage } from '@/utils/imageProcessing';
import { SEOHead } from '@/components/SEOHead';

const tool = TOOLS.find(t => t.id === 'webp-converter')!;

export default function WebpConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState([80]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ url: string; size: number } | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setResult(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/*': [] }, multiple: false });

  const handleProcess = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const blob = await convertImage(file, 'image/webp', quality[0]);
      setResult({ url: URL.createObjectURL(blob), size: blob.size });
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <ToolPageLayout toolId={tool.id} title={tool.name} description={tool.description} icon={tool.icon}>
      <SEOHead title="WebP Converter Online Free — Convert Images to WebP Format" description="Convert JPG, PNG and GIF to WebP format online. Control quality and lossless mode. Free browser-based WebP converter." keywords="webp converter, convert to webp, jpg to webp, png to webp" canonical="/tools/webp-converter" />
      <div className="space-y-8">
        <div {...getRootProps()} className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-zinc-200 hover:border-zinc-300 bg-zinc-50/50'}`}>
          <input {...getInputProps()} />
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-white rounded-full shadow-sm"><ImagePlay className="h-8 w-8 text-zinc-400" /></div>
            {file ? <p className="font-medium">{file.name}</p> : <p className="font-medium text-zinc-900">Click or drag image to convert to WebP</p>}
          </div>
        </div>
        {file && (
          <Card className="border-zinc-200 shadow-none">
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <label className="text-sm font-medium">Quality ({quality}%)</label>
                <Slider value={quality} onValueChange={setQuality} min={1} max={100} step={1} />
              </div>
              <Button onClick={handleProcess} disabled={isProcessing} className="w-full h-12 bg-blue-600 hover:bg-blue-700">
                {isProcessing ? 'Converting...' : 'Convert to WebP'}
              </Button>
            </CardContent>
          </Card>
        )}
        {result && (
          <div className="space-y-6 text-center">
            <div className="rounded-xl border border-zinc-200 overflow-hidden bg-zinc-50 inline-block p-4"><img src={result.url} alt="WebP" className="max-h-96 object-contain" /></div>
            <div className="text-sm text-zinc-500">New Size: {formatSize(result.size)}</div>
            <Button onClick={() => { const a = document.createElement('a'); a.href = result.url; a.download = `converted.webp`; a.click(); }} className="w-full space-x-2"><Download className="h-4 w-4" /><span>Download WebP</span></Button>
          </div>
        )}
      </div>
    </ToolPageLayout>
  );
}
