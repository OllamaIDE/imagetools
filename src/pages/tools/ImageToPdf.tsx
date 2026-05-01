import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Download, FilePlus, X } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { ToolPageLayout } from '@/components/ToolPageLayout';
import { TOOLS } from '@/config/tools';
import { SEOHead } from '@/components/SEOHead';

const tool = TOOLS.find(t => t.id === 'image-to-pdf')!;

export default function ImageToPdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [pageSize, setPageSize] = useState('a4');
  const [orientation, setOrientation] = useState<'p' | 'l'>('p');
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/*': [] } });

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleProcess = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    try {
      const doc = new jsPDF({
        orientation: orientation,
        unit: 'mm',
        format: pageSize
      });

      for (let i = 0; i < files.length; i++) {
        if (i > 0) doc.addPage(pageSize, orientation);
        const imgData = await fileToDataUrl(files[i]);
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        doc.addImage(imgData, 'JPEG', 0, 0, pageWidth, pageHeight);
      }

      doc.save('images-to-pdf.pdf');
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  return (
    <ToolPageLayout toolId={tool.id} title={tool.name} description={tool.description} icon={tool.icon}>
      <SEOHead title="Images to PDF Converter Online Free — Combine Photos into PDF" description="Convert multiple images to a single PDF online. Control page size, orientation and margins. Free browser-based image to PDF converter." keywords="image to pdf, jpg to pdf, png to pdf, combine images to pdf" canonical="/tools/image-to-pdf" />
      <div className="space-y-8">
        <div {...getRootProps()} className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-zinc-200 hover:border-zinc-300 bg-zinc-50/50'}`}>
          <input {...getInputProps()} />
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-white rounded-full shadow-sm"><FilePlus className="h-8 w-8 text-zinc-400" /></div>
            <p className="font-medium text-zinc-900">Click or drag images to combine into PDF</p>
          </div>
        </div>

        {files.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            {files.map((f, i) => (
              <div key={i} className="relative group aspect-[1/1.4] rounded-lg border border-zinc-200 bg-zinc-50 overflow-hidden">
                <img src={URL.createObjectURL(f)} className="w-full h-full object-cover" alt="" />
                <button onClick={() => removeFile(i)} className="absolute top-1 right-1 p-1 bg-white/80 hover:bg-white text-zinc-600 rounded-full shadow-sm">
                  <X className="h-3 w-3" />
                </button>
                <div className="absolute bottom-1 left-1 bg-black/50 text-white text-[10px] px-1.5 rounded">{i + 1}</div>
              </div>
            ))}
          </div>
        )}

        {files.length > 0 && (
          <Card className="border-zinc-200 shadow-none">
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Page Size</label>
                  <Select value={pageSize} onValueChange={setPageSize}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="a4">A4</SelectItem>
                      <SelectItem value="a3">A3</SelectItem>
                      <SelectItem value="letter">Letter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Orientation</label>
                  <Select value={orientation} onValueChange={(val: any) => setOrientation(val)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="p">Portrait</SelectItem>
                      <SelectItem value="l">Landscape</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={handleProcess} disabled={isProcessing} className="w-full h-12 bg-blue-600 hover:bg-blue-700">
                {isProcessing ? 'Generating PDF...' : `Download PDF (${files.length} Pages)`}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </ToolPageLayout>
  );
}
