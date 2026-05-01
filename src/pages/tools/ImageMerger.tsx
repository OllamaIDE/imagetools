import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { ToolPageLayout } from '@/components/ToolPageLayout';
import { TOOLS } from '@/config/tools';
import { fileToCanvas, mergeImages } from '@/utils/imageProcessing';
import { SEOHead } from '@/components/SEOHead';

const tool = TOOLS.find(t => t.id === 'image-merger')!;

export default function ImageMerger() {
  const [files, setFiles] = useState<File[]>([]);
  const [layout, setLayout] = useState<'horizontal' | 'vertical' | 'grid'>('horizontal');
  const [spacing, setSpacing] = useState([10]);
  const [result, setResult] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles]);
    setResult(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/*': [] } });

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setResult(null);
  };

  const [gridCols, setGridCols] = useState([2]);

  // Real-time merging
  useEffect(() => {
    if (files.length >= 2) {
      handleProcess();
    } else {
      setResult(null);
    }
  }, [files, layout, spacing, gridCols]);

  const handleProcess = async () => {
    if (files.length < 2) return;
    try {
      const canvases = await Promise.all(files.map(f => fileToCanvas(f)));
      const count = canvases.length;
      
      let totalWidth = 0;
      let totalHeight = 0;
      let actualCols = 1;
      let actualRows = 1;

      if (layout === 'horizontal') {
        totalWidth = canvases.reduce((acc, c) => acc + c.width + spacing[0], 0) - spacing[0];
        totalHeight = Math.max(...canvases.map(c => c.height));
      } else if (layout === 'vertical') {
        totalHeight = canvases.reduce((acc, c) => acc + c.height + spacing[0], 0) - spacing[0];
        totalWidth = Math.max(...canvases.map(c => c.width));
      } else if (layout === 'grid') {
        actualCols = gridCols[0];
        actualRows = Math.ceil(count / actualCols);
        const maxW = Math.max(...canvases.map(c => c.width));
        const maxH = Math.max(...canvases.map(c => c.height));
        totalWidth = actualCols * maxW + (actualCols - 1) * spacing[0];
        totalHeight = actualRows * maxH + (actualRows - 1) * spacing[0];
      }

      const targetCanvas = document.createElement('canvas');
      targetCanvas.width = totalWidth;
      targetCanvas.height = totalHeight;
      const ctx = targetCanvas.getContext('2d');
      if (ctx) {
        let currentX = 0;
        let currentY = 0;
        const maxW = Math.max(...canvases.map(c => c.width));
        const maxH = Math.max(...canvases.map(c => c.height));

        canvases.forEach((canvas, i) => {
          if (layout === 'grid') {
            const row = Math.floor(i / actualCols);
            const col = i % actualCols;
            ctx.drawImage(canvas, col * (maxW + spacing[0]), row * (maxH + spacing[0]));
          } else {
            ctx.drawImage(canvas, currentX, currentY);
            if (layout === 'horizontal') currentX += canvas.width + spacing[0];
            if (layout === 'vertical') currentY += canvas.height + spacing[0];
          }
        });
        setResult(targetCanvas.toDataURL('image/png'));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ToolPageLayout toolId={tool.id} title={tool.name} description={tool.description} icon={tool.icon}>
      <SEOHead title="Merge Images Online Free — Combine Multiple Photos Side by Side" description="Merge multiple images into one online. Arrange horizontally, vertically or in a grid layout. Free browser-based image merger tool." keywords="merge images online, combine photos, image merger, join images" canonical="/tools/image-merger" />
      <div className="space-y-8">
        <div {...getRootProps()} className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-zinc-200 hover:border-zinc-300 bg-zinc-50/50'}`}>
          <input {...getInputProps()} />
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-white rounded-full shadow-sm"><Upload className="h-8 w-8 text-zinc-400" /></div>
            <p className="font-medium text-zinc-900">Click or drag multiple images to merge</p>
            <p className="text-xs text-zinc-500">Selected: {files.length} images</p>
          </div>
        </div>

        {files.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {files.map((f, i) => (
              <div key={i} className="relative group aspect-square rounded-lg border border-zinc-200 bg-zinc-50 overflow-hidden">
                <img src={URL.createObjectURL(f)} className="w-full h-full object-cover" alt="" />
                <button onClick={() => removeFile(i)} className="absolute top-1 right-1 p-1 bg-white/80 hover:bg-white text-zinc-600 rounded-full shadow-sm">
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {files.length >= 2 && (
          <Card className="border-zinc-200 shadow-none">
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Layout</label>
                <Tabs value={layout} onValueChange={(val: any) => setLayout(val)}>
                  <TabsList className="w-full grid grid-cols-3">
                    <TabsTrigger value="horizontal">Horizontal</TabsTrigger>
                    <TabsTrigger value="vertical">Vertical</TabsTrigger>
                    <TabsTrigger value="grid">Grid</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              {layout === 'grid' && (
                <div className="space-y-4">
                  <label className="text-sm font-medium">Grid Columns ({gridCols[0]})</label>
                  <Slider value={gridCols} onValueChange={setGridCols} min={1} max={10} step={1} />
                </div>
              )}
              <div className="space-y-4">
                <label className="text-sm font-medium">Spacing ({spacing[0]}px)</label>
                <Slider value={spacing} onValueChange={setSpacing} min={0} max={100} step={1} />
              </div>
            </CardContent>
          </Card>
        )}

        {result && (
          <div className="space-y-6 text-center">
            <div className="rounded-xl border border-zinc-200 overflow-hidden bg-zinc-50 inline-block p-4"><img src={result} alt="Merged" className="max-h-96 object-contain" /></div>
            <Button onClick={() => { const a = document.createElement('a'); a.href = result; a.download = `merged-images.png`; a.click(); }} className="w-full space-x-2"><Download className="h-4 w-4" /><span>Download Merged Image</span></Button>
          </div>
        )}
      </div>
    </ToolPageLayout>
  );
}
