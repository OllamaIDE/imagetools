import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Download, FileType2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ToolPageLayout } from '@/components/ToolPageLayout';
import { TOOLS } from '@/config/tools';
import { SEOHead } from '@/components/SEOHead';

const tool = TOOLS.find(t => t.id === 'svg-to-png')!;

export default function SvgToPng() {
  const [file, setFile] = useState<File | null>(null);
  const [svgCode, setSvgCode] = useState('');
  const [dimensions, setDimensions] = useState({ width: 512, height: 512 });
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      const text = await selectedFile.text();
      setSvgCode(text);
      setResult(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/svg+xml': ['.svg'] }, multiple: false });

  const handleProcess = async () => {
    if (!svgCode) return;
    setIsProcessing(true);
    try {
      const img = new Image();
      const svgBlob = new Blob([svgCode], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = dimensions.width;
        canvas.height = dimensions.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, dimensions.width, dimensions.height);
          setResult(canvas.toDataURL('image/png'));
        }
        URL.revokeObjectURL(url);
      };
      img.src = url;
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolPageLayout toolId={tool.id} title={tool.name} description={tool.description} icon={tool.icon}>
      <SEOHead title="SVG to PNG Converter Online Free — Convert Vector to Image" description="Convert SVG files to PNG images online. Set custom dimensions and background. Free browser-based SVG to PNG converter." keywords="svg to png, convert svg to png, svg converter" canonical="/tools/svg-to-png" />
      <div className="space-y-8">
        <div {...getRootProps()} className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-zinc-200 hover:border-zinc-300 bg-zinc-50/50'}`}>
          <input {...getInputProps()} />
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-white rounded-full shadow-sm"><FileType2 className="h-8 w-8 text-zinc-400" /></div>
            {file ? <p className="font-medium">{file.name}</p> : <p className="font-medium text-zinc-900">Click or drag SVG file</p>}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Or Paste SVG Code</label>
          <textarea 
            value={svgCode} 
            onChange={(e) => setSvgCode(e.target.value)}
            className="w-full h-48 p-4 text-xs font-mono bg-zinc-50 border border-zinc-200 rounded-lg resize-none focus:outline-none"
            placeholder="<svg ...>...</svg>"
          />
        </div>

        {svgCode && (
          <Card className="border-zinc-200 shadow-none">
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Width</label>
                  <Input type="number" value={dimensions.width} onChange={(e) => setDimensions(p => ({...p, width: parseInt(e.target.value)||0}))} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Height</label>
                  <Input type="number" value={dimensions.height} onChange={(e) => setDimensions(p => ({...p, height: parseInt(e.target.value)||0}))} />
                </div>
              </div>
              <Button onClick={handleProcess} disabled={isProcessing} className="w-full h-12 bg-blue-600 hover:bg-blue-700">
                {isProcessing ? 'Converting...' : 'Convert to PNG'}
              </Button>
            </CardContent>
          </Card>
        )}

        {result && (
          <div className="space-y-6 text-center">
            <div className="rounded-xl border border-zinc-200 overflow-hidden bg-zinc-50 inline-block p-4"><img src={result} alt="Converted" className="max-h-96 object-contain" /></div>
            <Button onClick={() => { const a = document.createElement('a'); a.href = result; a.download = `converted.png`; a.click(); }} className="w-full space-x-2"><Download className="h-4 w-4" /><span>Download PNG</span></Button>
          </div>
        )}
      </div>
    </ToolPageLayout>
  );
}
