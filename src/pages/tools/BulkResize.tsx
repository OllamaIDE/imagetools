import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Download, GalleryHorizontalEnd, X, Check } from 'lucide-react';
import JSZip from 'jszip';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { ToolPageLayout } from '@/components/ToolPageLayout';
import { TOOLS } from '@/config/tools';
import { resizeImage } from '@/utils/imageProcessing';
import { SEOHead } from '@/components/SEOHead';

const tool = TOOLS.find(t => t.id === 'bulk-resize')!;

export default function BulkResize() {
  const [files, setFiles] = useState<File[]>([]);
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<{ blob: Blob; name: string }[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles].slice(0, 50));
    setResults([]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/*': [] } });

  const handleProcess = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setProgress(0);
    const newResults: { blob: Blob; name: string }[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const resizedBlob = await resizeImage(files[i], width, height, 'contain');
        newResults.push({ blob: resizedBlob, name: `resized-${files[i].name}` });
        setProgress(((i + 1) / files.length) * 100);
      }
      setResults(newResults);
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadAll = async () => {
    const zip = new JSZip();
    results.forEach((res) => {
      zip.file(res.name, res.blob);
    });
    const content = await zip.generateAsync({ type: 'blob' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(content);
    a.download = 'bulk-resized-images.zip';
    a.click();
  };

  return (
    <ToolPageLayout toolId={tool.id} title={tool.name} description={tool.description} icon={tool.icon}>
      <SEOHead title="Bulk Image Resizer Online Free — Resize Multiple Images at Once" description="Resize multiple images at once to the same dimensions online. Download all as ZIP. Free browser-based bulk image resizer with format conversion." keywords="bulk image resizer, resize multiple images, batch resize images, bulk photo resizer" canonical="/tools/bulk-resize" />
      <div className="space-y-8">
        <div {...getRootProps()} className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-zinc-200 hover:border-zinc-300 bg-zinc-50/50'}`}>
          <input {...getInputProps()} />
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-white rounded-full shadow-sm"><GalleryHorizontalEnd className="h-8 w-8 text-zinc-400" /></div>
            <p className="font-medium text-zinc-900">Click or drag up to 50 images</p>
          </div>
        </div>

        {files.length > 0 && !isProcessing && results.length === 0 && (
          <Card className="border-zinc-200 shadow-none">
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Target Width (px)</label>
                  <Input type="number" value={width} onChange={(e) => setWidth(parseInt(e.target.value) || 0)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Target Height (px)</label>
                  <Input type="number" value={height} onChange={(e) => setHeight(parseInt(e.target.value) || 0)} />
                </div>
              </div>
              <Button onClick={handleProcess} className="w-full h-12 bg-blue-600 hover:bg-blue-700">
                Resize {files.length} Images
              </Button>
            </CardContent>
          </Card>
        )}

        {isProcessing && (
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Processing images...</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-green-50 border border-green-100 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-1 rounded-full"><Check className="h-4 w-4 text-green-600" /></div>
                <span className="text-sm font-medium text-green-800">Processed {results.length} images successfully!</span>
              </div>
              <Button onClick={handleDownloadAll} className="space-x-2">
                <Download className="h-4 w-4" />
                <span>Download All as ZIP</span>
              </Button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {results.map((res, i) => (
                <div key={i} className="aspect-square border border-zinc-200 rounded overflow-hidden">
                  <img src={URL.createObjectURL(res.blob)} className="w-full h-full object-cover" alt="" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolPageLayout>
  );
}
