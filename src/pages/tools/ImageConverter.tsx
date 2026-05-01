import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ToolPageLayout } from '@/components/ToolPageLayout';
import { TOOLS } from '@/config/tools';
import { convertImage } from '@/utils/imageProcessing';
import { SEOHead } from '@/components/SEOHead';

const tool = TOOLS.find(t => t.id === 'image-converter')!;

export default function ImageConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState('image/png');
  const [quality, setQuality] = useState([90]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ blob: Blob; url: string; format: string } | null>(null);

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
      const blob = await convertImage(file, format, quality[0]);
      const url = URL.createObjectURL(blob);
      setResult({ blob, url, format: format.split('/')[1].toUpperCase() });
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const ext = format.split('/')[1];
    const a = document.createElement('a');
    a.href = result.url;
    a.download = `${file?.name.split('.')[0]}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <ToolPageLayout toolId={tool.id} title={tool.name} description={tool.description} icon={tool.icon}>
      <SEOHead title="Free Image Converter Online — Convert JPG PNG WebP BMP GIF" description="Convert images between JPG, PNG, WebP, BMP, GIF formats online for free. Fast browser-based image converter with quality control." keywords="image converter, convert jpg to png, convert png to webp, image format converter" canonical="/tools/image-converter" />
      <div className="space-y-8">
        <div {...getRootProps()} className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-zinc-200 hover:border-zinc-300 bg-zinc-50/50'}`}>
          <input {...getInputProps()} />
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-white rounded-full shadow-sm"><Upload className="h-8 w-8 text-zinc-400" /></div>
            {file ? <p className="font-medium">{file.name}</p> : <p className="font-medium text-zinc-900">Click or drag image to convert</p>}
          </div>
        </div>
        {file && (
          <Card className="border-zinc-200 shadow-none">
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Output Format</label>
                <Select value={format} onValueChange={setFormat}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="image/jpeg">JPEG</SelectItem>
                    <SelectItem value="image/png">PNG</SelectItem>
                    <SelectItem value="image/webp">WebP</SelectItem>
                    <SelectItem value="image/bmp">BMP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {format === 'image/jpeg' && (
                <div className="space-y-4">
                  <label className="text-sm font-medium">Quality ({quality}%)</label>
                  <Slider value={quality} onValueChange={setQuality} min={1} max={100} step={1} />
                </div>
              )}
              <Button onClick={handleProcess} disabled={isProcessing} className="w-full h-12 bg-blue-600 hover:bg-blue-700">
                {isProcessing ? 'Converting...' : 'Convert Image'}
              </Button>
            </CardContent>
          </Card>
        )}
        {result && (
          <div className="space-y-6 text-center">
            <div className="rounded-xl border border-zinc-200 overflow-hidden bg-zinc-50 inline-block p-4"><img src={result.url} alt="Converted" className="max-h-96 object-contain" /></div>
            <Button onClick={handleDownload} className="w-full space-x-2"><Download className="h-4 w-4" /><span>Download as {result.format}</span></Button>
          </div>
        )}
      </div>
    </ToolPageLayout>
  );
}
