import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { ToolPageLayout } from '@/components/ToolPageLayout';
import { TOOLS } from '@/config/tools';
import { addBorder } from '@/utils/imageProcessing';
import { SEOHead } from '@/components/SEOHead';

const tool = TOOLS.find(t => t.id === 'image-border')!;

export default function ImageBorderAdder() {
  const [file, setFile] = useState<File | null>(null);
  const [width, setWidth] = useState([20]);
  const [color, setColor] = useState('#000000');
  const [style, setStyle] = useState<'solid' | 'dashed' | 'dotted'>('solid');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setResult(null);
    }
  }, []);

  // Real-time border preview
  useEffect(() => {
    if (file) {
      handleProcess();
    }
  }, [file, width, color, style]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/*': [] }, multiple: false });

  const handleProcess = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const blob = await addBorder(file, width[0], color, style);
      setResult(URL.createObjectURL(blob));
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolPageLayout toolId={tool.id} title={tool.name} description={tool.description} icon={tool.icon}>
      <SEOHead title="Add Border to Image Online Free — Custom Photo Frame Tool" description="Add custom borders and frames to images online. Choose color, width, style and padding. Free browser-based border tool." keywords="add border to image, photo border online, image frame tool" canonical="/tools/image-border" />
      <div className="space-y-8">
        <div {...getRootProps()} className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-zinc-200 hover:border-zinc-300 bg-zinc-50/50'}`}>
          <input {...getInputProps()} />
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-white rounded-full shadow-sm"><Upload className="h-8 w-8 text-zinc-400" /></div>
            {file ? <p className="font-medium">{file.name}</p> : <p className="font-medium text-zinc-900">Click or drag image to add border</p>}
          </div>
        </div>
        {file && (
          <Card className="border-zinc-200 shadow-none">
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <label className="text-sm font-medium">Border Width ({width[0]}px)</label>
                <Slider value={width} onValueChange={setWidth} min={1} max={200} step={1} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Border Color</label>
                <div className="flex items-center space-x-2">
                  <Input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-12 h-10 p-1" />
                  <Input type="text" value={color} onChange={(e) => setColor(e.target.value)} className="flex-1" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Border Style</label>
                <Select value={style} onValueChange={(val: any) => setStyle(val)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solid">Solid</SelectItem>
                    <SelectItem value="dashed">Dashed</SelectItem>
                    <SelectItem value="dotted">Dotted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}
        {result && (
          <div className="space-y-6 text-center">
            <div className="rounded-xl border border-zinc-200 overflow-hidden bg-zinc-50 inline-block p-4"><img src={result} alt="Bordered" className="max-h-96 object-contain" /></div>
            <Button onClick={() => { const a = document.createElement('a'); a.href = result; a.download = `bordered-${file?.name}`; a.click(); }} className="w-full space-x-2"><Download className="h-4 w-4" /><span>Download Bordered Image</span></Button>
          </div>
        )}
      </div>
    </ToolPageLayout>
  );
}
