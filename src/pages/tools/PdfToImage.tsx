import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Download, FileImage } from 'lucide-react';
import JSZip from 'jszip';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { ToolPageLayout } from '@/components/ToolPageLayout';
import { TOOLS } from '@/config/tools';
import { SEOHead } from '@/components/SEOHead';

const tool = TOOLS.find(t => t.id === 'pdf-to-image')!;

export default function PdfToImage() {
  const [file, setFile] = useState<File | null>(null);
  const [dpi, setDpi] = useState('150');
  const [isProcessing, setIsProcessing] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    // Load pdf.js from CDN
    if (!(window as any).pdfjsLib) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      script.onload = () => {
        (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      };
      document.head.appendChild(script);
    }
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setImages([]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'application/pdf': ['.pdf'] }, multiple: false });

  const handleProcess = async () => {
    if (!file || !(window as any).pdfjsLib) return;
    setIsProcessing(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const loadingTask = (window as any).pdfjsLib.getDocument({ data: reader.result });
        const pdf = await loadingTask.promise;
        const newImages: string[] = [];
        const scale = parseInt(dpi) / 72;

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale });
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          if (context) {
            await page.render({ canvasContext: context, viewport }).promise;
            newImages.push(canvas.toDataURL('image/png'));
          }
        }
        setImages(newImages);
        setIsProcessing(false);
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error(error);
      setIsProcessing(false);
    }
  };

  const handleDownloadAll = async () => {
    const zip = new JSZip();
    images.forEach((src, i) => {
      zip.file(`page-${i + 1}.png`, src.split(',')[1], { base64: true });
    });
    const content = await zip.generateAsync({ type: 'blob' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(content);
    a.download = 'pdf-pages.zip';
    a.click();
  };

  return (
    <ToolPageLayout toolId={tool.id} title={tool.name} description={tool.description} icon={tool.icon}>
      <SEOHead title="PDF to Image Converter Online Free — Convert PDF Pages to PNG JPG" description="Convert PDF pages to PNG or JPG images online. Choose DPI quality, download individual pages or all as ZIP. Free browser-based converter." keywords="pdf to image, pdf to png, pdf to jpg, convert pdf pages to images" canonical="/tools/pdf-to-image" />
      <div className="space-y-8">
        <div {...getRootProps()} className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-zinc-200 hover:border-zinc-300 bg-zinc-50/50'}`}>
          <input {...getInputProps()} />
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-white rounded-full shadow-sm"><FileImage className="h-8 w-8 text-zinc-400" /></div>
            {file ? <p className="font-medium">{file.name}</p> : <p className="font-medium text-zinc-900">Click or drag PDF to convert</p>}
          </div>
        </div>
        {file && (
          <Card className="border-zinc-200 shadow-none">
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Quality (DPI)</label>
                <Select value={dpi} onValueChange={setDpi}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="72">72 DPI (Low)</SelectItem>
                    <SelectItem value="150">150 DPI (Standard)</SelectItem>
                    <SelectItem value="300">300 DPI (High)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleProcess} disabled={isProcessing} className="w-full h-12 bg-blue-600 hover:bg-blue-700">
                {isProcessing ? 'Converting PDF...' : 'Convert to Images'}
              </Button>
            </CardContent>
          </Card>
        )}
        {images.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xl">Converted Pages ({images.length})</h3>
              <Button onClick={handleDownloadAll} className="space-x-2">
                <Download className="h-4 w-4" />
                <span>Download All as ZIP</span>
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((src, i) => (
                <div key={i} className="space-y-2">
                  <div className="aspect-[1/1.4] border border-zinc-200 rounded-lg bg-zinc-50 overflow-hidden">
                    <img src={src} className="w-full h-full object-contain" alt="" />
                  </div>
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <a href={src} download={`page-${i + 1}.png`}>Download Page {i + 1}</a>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolPageLayout>
  );
}
