import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Download, FlipHorizontal, FlipVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ToolPageLayout } from '@/components/ToolPageLayout';
import { TOOLS } from '@/config/tools';
import { flipImage } from '@/utils/imageProcessing';
import { SEOHead } from '@/components/SEOHead';

const tool = TOOLS.find(t => t.id === 'image-flip')!;

export default function ImageFlip() {
  const [file, setFile] = useState<File | null>(null);
  const [horizontal, setHorizontal] = useState(false);
  const [vertical, setVertical] = useState(false);
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
      const blob = await flipImage(file, horizontal, vertical);
      setResult(URL.createObjectURL(blob));
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolPageLayout toolId={tool.id} title={tool.name} description={tool.description} icon={tool.icon}>
      <SEOHead title="Flip Image Online — Mirror Image Horizontally or Vertically Free" description="Flip or mirror images horizontally or vertically online for free. Instant preview and download. No signup required." keywords="flip image online, mirror image, flip photo horizontally" canonical="/tools/image-flip" />
      <div className="space-y-8">
        <div {...getRootProps()} className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-zinc-200 hover:border-zinc-300 bg-zinc-50/50'}`}>
          <input {...getInputProps()} />
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-white rounded-full shadow-sm"><Upload className="h-8 w-8 text-zinc-400" /></div>
            {file ? <p className="font-medium">{file.name}</p> : <p className="font-medium text-zinc-900">Click or drag image to flip</p>}
          </div>
        </div>
        {file && (
          <Card className="border-zinc-200 shadow-none">
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  variant={horizontal ? 'default' : 'outline'} 
                  onClick={() => setHorizontal(!horizontal)}
                  className="space-x-2"
                >
                  <FlipHorizontal className="h-4 w-4" />
                  <span>Flip Horizontal</span>
                </Button>
                <Button 
                  variant={vertical ? 'default' : 'outline'} 
                  onClick={() => setVertical(!vertical)}
                  className="space-x-2"
                >
                  <FlipVertical className="h-4 w-4" />
                  <span>Flip Vertical</span>
                </Button>
              </div>
              <Button onClick={handleProcess} disabled={isProcessing} className="w-full h-12 bg-blue-600 hover:bg-blue-700">
                {isProcessing ? 'Processing...' : 'Apply Flip'}
              </Button>
            </CardContent>
          </Card>
        )}
        {result && (
          <div className="space-y-6 text-center">
            <div className="rounded-xl border border-zinc-200 overflow-hidden bg-zinc-50 inline-block p-4"><img src={result} alt="Flipped" className="max-h-96 object-contain" /></div>
            <Button onClick={() => { const a = document.createElement('a'); a.href = result; a.download = `flipped-${file?.name}`; a.click(); }} className="w-full space-x-2"><Download className="h-4 w-4" /><span>Download Flipped Image</span></Button>
          </div>
        )}
      </div>
    </ToolPageLayout>
  );
}
