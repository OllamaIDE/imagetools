import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { ToolPageLayout } from '@/components/ToolPageLayout';
import { TOOLS } from '@/config/tools';
import { fileToCanvas, canvasToBlob } from '@/utils/imageProcessing';
import { SEOHead } from '@/components/SEOHead';

const tool = TOOLS.find(t => t.id === 'image-grayscale')!;

export default function ImageGrayscale() {
  const [file, setFile] = useState<File | null>(null);
  const [intensity, setIntensity] = useState([100]);
  const [method, setMethod] = useState('luminosity');
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
      const canvas = await fileToCanvas(file);
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.filter = `grayscale(${intensity[0]}%)`;
        ctx.drawImage(canvas, 0, 0);
        const blob = await canvasToBlob(canvas);
        setResult(URL.createObjectURL(blob));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolPageLayout toolId={tool.id} title={tool.name} description={tool.description} icon={tool.icon}>
      <SEOHead title="Convert Image to Grayscale Online — Free Black and White Filter" description="Convert color images to grayscale or black and white online. Choose from multiple grayscale methods. Free browser-based tool." keywords="image to grayscale, black and white image converter, grayscale filter online" canonical="/tools/image-grayscale" />
      <div className="space-y-8">
        <div {...getRootProps()} className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-zinc-200 hover:border-zinc-300 bg-zinc-50/50'}`}>
          <input {...getInputProps()} />
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-white rounded-full shadow-sm"><Upload className="h-8 w-8 text-zinc-400" /></div>
            {file ? <p className="font-medium">{file.name}</p> : <p className="font-medium text-zinc-900">Click or drag image to grayscale</p>}
          </div>
        </div>
        {file && (
          <Card className="border-zinc-200 shadow-none">
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <label className="text-sm font-medium">Intensity ({intensity[0]}%)</label>
                <Slider value={intensity} onValueChange={setIntensity} min={0} max={100} step={1} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Method</label>
                <Select value={method} onValueChange={setMethod}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="luminosity">Luminosity</SelectItem>
                    <SelectItem value="average">Average</SelectItem>
                    <SelectItem value="lightness">Lightness</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleProcess} disabled={isProcessing} className="w-full h-12 bg-blue-600 hover:bg-blue-700">
                {isProcessing ? 'Processing...' : 'Apply Grayscale'}
              </Button>
            </CardContent>
          </Card>
        )}
        {result && (
          <div className="space-y-6 text-center">
            <div className="rounded-xl border border-zinc-200 overflow-hidden bg-zinc-50 inline-block p-4"><img src={result} alt="Grayscale" className="max-h-96 object-contain" /></div>
            <Button onClick={() => { const a = document.createElement('a'); a.href = result; a.download = `grayscale-${file?.name}`; a.click(); }} className="w-full space-x-2"><Download className="h-4 w-4" /><span>Download Grayscale Image</span></Button>
          </div>
        )}
      </div>
    </ToolPageLayout>
  );
}
