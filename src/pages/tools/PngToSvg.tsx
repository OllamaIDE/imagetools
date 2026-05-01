import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Download, Spline } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { ToolPageLayout } from '@/components/ToolPageLayout';
import { TOOLS } from '@/config/tools';
import { fileToCanvas } from '@/utils/imageProcessing';
import { SEOHead } from '@/components/SEOHead';

const tool = TOOLS.find(t => t.id === 'png-to-svg')!;

export default function PngToSvg() {
  const [file, setFile] = useState<File | null>(null);
  const [threshold, setThreshold] = useState([128]);
  const [svgCode, setSvgCode] = useState('');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setSvgCode('');
    }
  }, []);

  // Real-time tracing preview
  useEffect(() => {
    if (file) {
      const timer = setTimeout(() => {
        handleProcess();
      }, 500); // Debounce for expensive tracing
      return () => clearTimeout(timer);
    }
  }, [file, threshold]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/*': [] }, multiple: false });

  const handleProcess = async () => {
    if (!file) return;
    try {
      const canvas = await fileToCanvas(file);
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        let paths = '';
        
        // Very simple pixel-to-rect tracing for demo (not real tracing)
        // A real tracer would use Potrace or similar
        const step = 4; // Downsample for performance
        for (let y = 0; y < canvas.height; y += step) {
          for (let x = 0; x < canvas.width; x += step) {
            const i = (y * canvas.width + x) * 4;
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            if (avg < threshold[0]) {
              paths += `<rect x="${x}" y="${y}" width="${step}" height="${step}" />`;
            }
          }
        }
        const svg = `<svg viewBox="0 0 ${canvas.width} ${canvas.height}" xmlns="http://www.w3.org/2000/svg">${paths}</svg>`;
        setSvgCode(svg);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([svgCode], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vectorized.svg';
    a.click();
  };

  return (
    <ToolPageLayout toolId={tool.id} title={tool.name} description={tool.description} icon={tool.icon}>
      <SEOHead title="PNG to SVG Converter Online — Convert Raster Images to Vector" description="Trace PNG and JPG images to SVG vector format online. Adjust threshold and smoothing. Free browser-based image vectorizer." keywords="png to svg, image to vector, rasterize to svg, trace image online" canonical="/tools/png-to-svg" />
      <div className="space-y-8">
        <div {...getRootProps()} className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-zinc-200 hover:border-zinc-300 bg-zinc-50/50'}`}>
          <input {...getInputProps()} />
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-white rounded-full shadow-sm"><Spline className="h-8 w-8 text-zinc-400" /></div>
            {file ? <p className="font-medium">{file.name}</p> : <p className="font-medium text-zinc-900">Click or drag image to trace</p>}
          </div>
        </div>
        {file && (
          <Card className="border-zinc-200 shadow-none">
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <Slider value={threshold} onValueChange={setThreshold} min={1} max={255} step={1} />
              </div>
            </CardContent>
          </Card>
        )}
        {svgCode && (
          <div className="space-y-6">
            <div className="aspect-video border border-zinc-200 rounded-xl bg-white overflow-hidden p-4">
              <div dangerouslySetInnerHTML={{ __html: svgCode }} className="w-full h-full" />
            </div>
            <Button onClick={handleDownload} className="w-full space-x-2"><Download className="h-4 w-4" /><span>Download SVG</span></Button>
          </div>
        )}
      </div>
    </ToolPageLayout>
  );
}
