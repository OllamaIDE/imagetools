import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Download, AppWindow } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { ToolPageLayout } from '@/components/ToolPageLayout';
import { TOOLS } from '@/config/tools';
import { fileToCanvas, generateIco } from '@/utils/imageProcessing';
import { SEOHead } from '@/components/SEOHead';

const tool = TOOLS.find(t => t.id === 'ico-converter')!;

export default function IcoConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [sizes, setSizes] = useState<number[]>([16, 32, 48, 64]);
  const [result, setResult] = useState<{ blob: Blob; url: string } | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setResult(null);
    }
  }, []);

  // Real-time ICO generation
  useEffect(() => {
    if (file && sizes.length > 0) {
      handleProcess();
    } else {
      setResult(null);
    }
  }, [file, sizes]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/png': ['.png'], 'image/jpeg': ['.jpg', '.jpeg'] }, multiple: false });

  const toggleSize = (size: number) => {
    setSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]);
  };

  const handleProcess = async () => {
    if (!file || sizes.length === 0) return;
    try {
      const sourceCanvas = await fileToCanvas(file);
      const canvases = await Promise.all(sizes.map(async (size) => {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(sourceCanvas, 0, 0, size, size);
        }
        return canvas;
      }));

      const icoBlob = await generateIco(canvases);
      const url = URL.createObjectURL(icoBlob);
      setResult({ blob: icoBlob, url });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ToolPageLayout toolId={tool.id} title={tool.name} description={tool.description} icon={tool.icon}>
      <SEOHead title="ICO Converter Online Free — Create Favicon ICO from PNG" description="Convert PNG or JPG to ICO favicon format online. Choose multiple sizes in one file. Free browser-based ICO converter." keywords="ico converter, png to ico, favicon converter, create favicon" canonical="/tools/ico-converter" />
      <div className="space-y-8">
        <div {...getRootProps()} className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-zinc-200 hover:border-zinc-300 bg-zinc-50/50'}`}>
          <input {...getInputProps()} />
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-white rounded-full shadow-sm"><AppWindow className="h-8 w-8 text-zinc-400" /></div>
            {file ? <p className="font-medium">{file.name}</p> : <p className="font-medium text-zinc-900">Click or drag image for Favicon</p>}
          </div>
        </div>
        {file && (
          <Card className="border-zinc-200 shadow-none">
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <label className="text-sm font-medium">Select Sizes</label>
                <div className="grid grid-cols-3 gap-4">
                  {[16, 32, 48, 64, 128, 256].map(size => (
                    <div key={size} className="flex items-center space-x-2">
                      <Checkbox id={`size-${size}`} checked={sizes.includes(size)} onCheckedChange={() => toggleSize(size)} />
                      <label htmlFor={`size-${size}`} className="text-sm">{size}x{size}</label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        {result && (
          <div className="space-y-6 text-center">
            <div className="p-8 bg-zinc-50 rounded-xl border border-zinc-200 inline-block">
              <img src={result.url} alt="ICO" className="w-16 h-16" />
              <p className="text-[10px] text-zinc-400 mt-2">ICO ({Math.round(result.blob.size / 1024)} KB)</p>
            </div>
            <Button onClick={() => { const a = document.createElement('a'); a.href = result.url; a.download = `favicon.ico`; a.click(); }} className="w-full h-12 space-x-2 bg-green-600 hover:bg-green-700">
              <Download className="h-4 w-4" />
              <span>Download .ico File</span>
            </Button>
          </div>
        )}
      </div>
    </ToolPageLayout>
  );
}
