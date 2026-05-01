import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { ToolPageLayout } from '@/components/ToolPageLayout';
import { TOOLS } from '@/config/tools';
import { addWatermarkText } from '@/utils/imageProcessing';
import { SEOHead } from '@/components/SEOHead';

const tool = TOOLS.find(t => t.id === 'image-watermark')!;

export default function ImageWatermark() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState('Watermark');
  const [fontSize, setFontSize] = useState([48]);
  const [color, setColor] = useState('#ffffff');
  const [opacity, setOpacity] = useState([50]);
  const [position, setPosition] = useState('center');
  const [result, setResult] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setResult(null);
    }
  }, []);

  // Real-time watermark preview
  useEffect(() => {
    if (file) {
      handleProcess();
    }
  }, [file, text, fontSize, color, opacity, position]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/*': [] }, multiple: false });

  const handleProcess = async () => {
    if (!file) return;
    try {
      const blob = await addWatermarkText(file, text, { fontSize: fontSize[0], color, opacity: opacity[0], position });
      setResult(URL.createObjectURL(blob));
    } catch (error) {
      console.error(error);
    }
  };

  const positions = [
    { id: 'top-left', label: 'Top Left' }, { id: 'top-center', label: 'Top Center' }, { id: 'top-right', label: 'Top Right' },
    { id: 'middle-left', label: 'Middle Left' }, { id: 'center', label: 'Center' }, { id: 'middle-right', label: 'Middle Right' },
    { id: 'bottom-left', label: 'Bottom Left' }, { id: 'bottom-center', label: 'Bottom Center' }, { id: 'bottom-right', label: 'Bottom Right' },
  ];

  return (
    <ToolPageLayout toolId={tool.id} title={tool.name} description={tool.description} icon={tool.icon}>
      <SEOHead title="Free Online Image Watermark Tool — Add Text or Logo Watermark" description="Add text or image watermark to photos online. Control opacity, position, and font. Free browser-based watermark tool, no upload to server." keywords="add watermark to image, image watermark online, watermark photo" canonical="/tools/image-watermark" />
      <div className="space-y-8">
        <div {...getRootProps()} className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-zinc-200 hover:border-zinc-300 bg-zinc-50/50'}`}>
          <input {...getInputProps()} />
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-white rounded-full shadow-sm"><Upload className="h-8 w-8 text-zinc-400" /></div>
            {file ? <p className="font-medium">{file.name}</p> : <p className="font-medium text-zinc-900">Click or drag image to watermark</p>}
          </div>
        </div>
        {file && (
          <Card className="border-zinc-200 shadow-none">
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Watermark Text</label>
                <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter watermark text..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <label className="text-sm font-medium">Font Size ({fontSize}px)</label>
                  <Slider value={fontSize} onValueChange={setFontSize} min={10} max={200} step={1} />
                </div>
                <div className="space-y-4">
                  <label className="text-sm font-medium">Opacity ({opacity}%)</label>
                  <Slider value={opacity} onValueChange={setOpacity} min={1} max={100} step={1} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Text Color</label>
                <div className="flex items-center space-x-2">
                  <Input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-12 h-10 p-1" />
                  <Input type="text" value={color} onChange={(e) => setColor(e.target.value)} className="flex-1" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Position</label>
                <div className="grid grid-cols-3 gap-2">
                  {positions.map(pos => (
                    <Button 
                      key={pos.id} 
                      variant={position === pos.id ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setPosition(pos.id)}
                      className="text-xs px-1"
                    >
                      {pos.label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        {result && (
          <div className="space-y-6 text-center">
            <div className="rounded-xl border border-zinc-200 overflow-hidden bg-zinc-50 inline-block p-4"><img src={result} alt="Watermarked" className="max-h-96 object-contain" /></div>
            <Button onClick={() => { const a = document.createElement('a'); a.href = result; a.download = `watermarked-${file?.name}`; a.click(); }} className="w-full space-x-2"><Download className="h-4 w-4" /><span>Download Watermarked Image</span></Button>
          </div>
        )}
      </div>
    </ToolPageLayout>
  );
}
