import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Download, RotateCw, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ToolPageLayout } from '@/components/ToolPageLayout';
import { TOOLS } from '@/config/tools';
import { rotateImage } from '@/utils/imageProcessing';
import { SEOHead } from '@/components/SEOHead';

const tool = TOOLS.find(t => t.id === 'image-rotate')!;

export default function ImageRotate() {
  const [file, setFile] = useState<File | null>(null);
  const [angle, setAngle] = useState(0);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);

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
      const blob = await rotateImage(file, angle, bgColor);
      setResult(URL.createObjectURL(blob));
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const rotate = (deg: number) => {
    setAngle(prev => (prev + deg) % 360);
  };

  return (
    <ToolPageLayout toolId={tool.id} title={tool.name} description={tool.description} icon={tool.icon}>
      <SEOHead title="Rotate Image Online Free — Rotate Photos Any Degree" description="Rotate images 90, 180, 270 degrees or any custom angle online. Choose background fill color. Free browser-based tool." keywords="rotate image online, rotate photo, image rotation tool" canonical="/tools/image-rotate" />
      <div className="space-y-8">
        <div {...getRootProps()} className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-zinc-200 hover:border-zinc-300 bg-zinc-50/50'}`}>
          <input {...getInputProps()} />
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-white rounded-full shadow-sm"><Upload className="h-8 w-8 text-zinc-400" /></div>
            {file ? <p className="font-medium">{file.name}</p> : <p className="font-medium text-zinc-900">Click or drag image to rotate</p>}
          </div>
        </div>
        {file && (
          <Card className="border-zinc-200 shadow-none">
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <Button variant="outline" onClick={() => rotate(-90)} className="space-x-2"><RotateCcw className="h-4 w-4" /><span>-90°</span></Button>
                <Button variant="outline" onClick={() => rotate(90)} className="space-x-2"><RotateCw className="h-4 w-4" /><span>+90°</span></Button>
                <Button variant="outline" onClick={() => rotate(180)} className="space-x-2"><RotateCw className="h-4 w-4" /><span>180°</span></Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Custom Angle (°)</label>
                  <Input type="number" value={angle} onChange={(e) => setAngle(parseInt(e.target.value) || 0)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Background Fill</label>
                  <div className="flex items-center space-x-2">
                    <Input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-12 h-10 p-1" />
                    <Input type="text" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="flex-1" />
                  </div>
                </div>
              </div>
              <Button onClick={handleProcess} disabled={isProcessing} className="w-full h-12 bg-blue-600 hover:bg-blue-700">
                {isProcessing ? 'Rotating...' : 'Apply Rotation'}
              </Button>
            </CardContent>
          </Card>
        )}
        {result && (
          <div className="space-y-6 text-center">
            <div className="rounded-xl border border-zinc-200 overflow-hidden bg-zinc-50 inline-block p-4"><img src={result} alt="Rotated" className="max-h-96 object-contain" /></div>
            <Button onClick={() => { const a = document.createElement('a'); a.href = result; a.download = `rotated-${file?.name}`; a.click(); }} className="w-full space-x-2"><Download className="h-4 w-4" /><span>Download Rotated Image</span></Button>
          </div>
        )}
      </div>
    </ToolPageLayout>
  );
}
