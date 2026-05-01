import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Download, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ToolPageLayout } from '@/components/ToolPageLayout';
import { TOOLS } from '@/config/tools';
import { applyBrightness } from '@/utils/imageProcessing';
import { SEOHead } from '@/components/SEOHead';

const tool = TOOLS.find(t => t.id === 'image-brightness')!;

export default function ImageBrightness() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [brightness, setBrightness] = useState([0]);
  const [contrast, setContrast] = useState([0]);
  const [saturation, setSaturation] = useState([0]);
  const [hue, setHue] = useState([0]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResult(null);
      setShowPreview(true);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/*': [] }, multiple: false });

  const handleProcess = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const blob = await applyBrightness(file, brightness[0], contrast[0], saturation[0], hue[0]);
      setResult(URL.createObjectURL(blob));
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setBrightness([0]);
    setContrast([0]);
    setSaturation([0]);
    setHue([0]);
  };

  return (
    <ToolPageLayout toolId={tool.id} title={tool.name} description={tool.description} icon={tool.icon}>
      <SEOHead title="Adjust Image Brightness and Contrast Online — Free Photo Editor" description="Adjust brightness, contrast, saturation and hue of images online. Real-time preview. No signup, 100% free browser-based photo editor." keywords="adjust image brightness, image contrast editor, photo brightness online" canonical="/tools/image-brightness" />
      <div className="space-y-8">
        <div {...getRootProps()} className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-zinc-200 hover:border-zinc-300 bg-zinc-50/50'}`}>
          <input {...getInputProps()} />
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-white rounded-full shadow-sm"><Upload className="h-8 w-8 text-zinc-400" /></div>
            {file ? <p className="font-medium">{file.name}</p> : <p className="font-medium text-zinc-900">Click or drag image to edit</p>}
          </div>
        </div>
        {file && (
          <Card className="border-zinc-200 shadow-none">
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between"><label className="text-sm font-medium">Brightness ({brightness}%)</label><Button variant="ghost" size="sm" onClick={() => setBrightness([0])}><RotateCcw className="h-3 w-3" /></Button></div>
                <Slider value={brightness} onValueChange={setBrightness} min={-100} max={100} step={1} />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between"><label className="text-sm font-medium">Contrast ({contrast}%)</label><Button variant="ghost" size="sm" onClick={() => setContrast([0])}><RotateCcw className="h-3 w-3" /></Button></div>
                <Slider value={contrast} onValueChange={setContrast} min={-100} max={100} step={1} />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between"><label className="text-sm font-medium">Saturation ({saturation}%)</label><Button variant="ghost" size="sm" onClick={() => setSaturation([0])}><RotateCcw className="h-3 w-3" /></Button></div>
                <Slider value={saturation} onValueChange={setSaturation} min={-100} max={100} step={1} />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between"><label className="text-sm font-medium">Hue Rotation ({hue}°)</label><Button variant="ghost" size="sm" onClick={() => setHue([0])}><RotateCcw className="h-3 w-3" /></Button></div>
                <Slider value={hue} onValueChange={setHue} min={0} max={360} step={1} />
              </div>
              <div className="flex gap-4">
                <Button variant="outline" onClick={handleReset} className="flex-1">Reset All</Button>
                <Button onClick={handleProcess} disabled={isProcessing} className="flex-1 bg-blue-600 hover:bg-blue-700">{isProcessing ? 'Processing...' : 'Apply Filters'}</Button>
              </div>
            </CardContent>
          </Card>
        )}
        {file && showPreview && (
          <div className="space-y-6">
            <div className="rounded-xl border border-zinc-200 overflow-hidden bg-zinc-100 flex justify-center p-4 min-h-[300px]">
              <img 
                src={preview!} 
                alt="Preview" 
                className="max-h-96 object-contain transition-all duration-75"
                style={{
                  filter: `brightness(${100 + brightness[0]}%) contrast(${100 + contrast[0]}%) saturate(${100 + saturation[0]}%) hue-rotate(${hue[0]}deg)`
                }}
              />
            </div>
            
            <div className="flex gap-4">
              <Button 
                onClick={handleProcess} 
                disabled={isProcessing} 
                className="flex-1 bg-blue-600 hover:bg-blue-700 h-12"
              >
                {isProcessing ? 'Processing...' : 'Download High Quality'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </ToolPageLayout>
  );
}
