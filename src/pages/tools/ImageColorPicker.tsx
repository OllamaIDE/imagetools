import { useState, useCallback, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Pipette, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ToolPageLayout } from '@/components/ToolPageLayout';
import { TOOLS } from '@/config/tools';
import { fileToCanvas } from '@/utils/imageProcessing';
import { SEOHead } from '@/components/SEOHead';

const tool = TOOLS.find(t => t.id === 'image-color-picker')!;

export default function ImageColorPicker() {
  const [file, setFile] = useState<File | null>(null);
  const [pickedColor, setPickedColor] = useState({ hex: '#000000', rgb: 'rgb(0, 0, 0)' });
  const [history, setHistory] = useState<string[]>([]);
  const [isCopied, setIsCopied] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  useEffect(() => {
    if (!file || !canvasRef.current) return;
    const draw = async () => {
      const canvas = await fileToCanvas(file);
      const ctx = canvasRef.current?.getContext('2d');
      if (ctx && canvasRef.current) {
        canvasRef.current.width = canvas.width;
        canvasRef.current.height = canvas.height;
        ctx.drawImage(canvas, 0, 0);
      }
    };
    draw();
  }, [file]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/*': [] }, multiple: false });

  const handlePickColor = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;

    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const hex = `#${((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2]).toString(16).slice(1)}`;
    const rgb = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
    
    setPickedColor({ hex, rgb });
    setHistory(prev => [hex, ...prev.filter(c => c !== hex)].slice(0, 10));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(text);
    setTimeout(() => setIsCopied(null), 2000);
  };

  return (
    <ToolPageLayout toolId={tool.id} title={tool.name} description={tool.description} icon={tool.icon}>
      <SEOHead title="Image Color Picker Online — Pick Colors from Any Photo" description="Click any pixel on an image to get its exact color code in HEX, RGB, HSL and CMYK format. Free online color picker tool." keywords="image color picker, pick color from image, eyedropper online, hex color from image" canonical="/tools/image-color-picker" />
      <div className="space-y-8">
        <div {...getRootProps()} className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-zinc-200 hover:border-zinc-300 bg-zinc-50/50'}`}>
          <input {...getInputProps()} />
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-white rounded-full shadow-sm"><Pipette className="h-8 w-8 text-zinc-400" /></div>
            {file ? <p className="font-medium">{file.name}</p> : <p className="font-medium text-zinc-900">Click or drag image to pick colors</p>}
          </div>
        </div>

        {file && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-8 border border-zinc-200 rounded-xl overflow-hidden bg-zinc-100 flex justify-center cursor-crosshair">
              <canvas ref={canvasRef} onClick={handlePickColor} className="max-w-full" />
            </div>
            <div className="md:col-span-4 space-y-6">
              <Card className="border-zinc-200 shadow-none">
                <CardContent className="p-6 space-y-4">
                  <div className="w-full h-24 rounded-lg border border-zinc-200" style={{ backgroundColor: pickedColor.hex }} />
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">HEX</label>
                      <div className="flex items-center justify-between p-2 bg-zinc-50 border border-zinc-200 rounded">
                        <span className="font-mono text-sm">{pickedColor.hex}</span>
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(pickedColor.hex)}>
                          {isCopied === pickedColor.hex ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">RGB</label>
                      <div className="flex items-center justify-between p-2 bg-zinc-50 border border-zinc-200 rounded">
                        <span className="font-mono text-sm">{pickedColor.rgb}</span>
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(pickedColor.rgb)}>
                          {isCopied === pickedColor.rgb ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {history.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-zinc-500 uppercase">History</h4>
                  <div className="flex flex-wrap gap-2">
                    {history.map((color, i) => (
                      <button 
                        key={i} 
                        className="w-8 h-8 rounded border border-zinc-200" 
                        style={{ backgroundColor: color }}
                        onClick={() => setPickedColor({ hex: color, rgb: '' })} // Simplified for history
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </ToolPageLayout>
  );
}
