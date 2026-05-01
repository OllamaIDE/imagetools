import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Download } from 'lucide-react';
import JSZip from 'jszip';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ToolPageLayout } from '@/components/ToolPageLayout';
import { TOOLS } from '@/config/tools';
import { fileToCanvas, canvasToBlob } from '@/utils/imageProcessing';
import { SEOHead } from '@/components/SEOHead';

const tool = TOOLS.find(t => t.id === 'image-splitter')!;

export default function ImageSplitter() {
  const [file, setFile] = useState<File | null>(null);
  const [rows, setRows] = useState(2);
  const [cols, setCols] = useState(2);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pieces, setPieces] = useState<string[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setPieces([]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/*': [] }, multiple: false });

  const handleProcess = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const canvas = await fileToCanvas(file);
      const pieceW = canvas.width / cols;
      const pieceH = canvas.height / rows;
      const newPieces: string[] = [];

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const pieceCanvas = document.createElement('canvas');
          pieceCanvas.width = pieceW;
          pieceCanvas.height = pieceH;
          const ctx = pieceCanvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(canvas, c * pieceW, r * pieceH, pieceW, pieceH, 0, 0, pieceW, pieceH);
            newPieces.push(pieceCanvas.toDataURL('image/png'));
          }
        }
      }
      setPieces(newPieces);
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadAll = async () => {
    const zip = new JSZip();
    for (let i = 0; i < pieces.length; i++) {
      const data = pieces[i].split(',')[1];
      zip.file(`piece-${i + 1}.png`, data, { base64: true });
    }
    const content = await zip.generateAsync({ type: 'blob' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(content);
    a.download = 'split-images.zip';
    a.click();
  };

  return (
    <ToolPageLayout toolId={tool.id} title={tool.name} description={tool.description} icon={tool.icon}>
      <SEOHead title="Split Image Online Free — Cut Image into Equal Grid Parts" description="Split any image into equal grid sections online. Download all parts as a ZIP file. Free browser-based image splitter." keywords="split image online, image splitter, cut image into parts, image grid cutter" canonical="/tools/image-splitter" />
      <div className="space-y-8">
        <div {...getRootProps()} className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-zinc-200 hover:border-zinc-300 bg-zinc-50/50'}`}>
          <input {...getInputProps()} />
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-white rounded-full shadow-sm"><Upload className="h-8 w-8 text-zinc-400" /></div>
            {file ? <p className="font-medium">{file.name}</p> : <p className="font-medium text-zinc-900">Click or drag image to split</p>}
          </div>
        </div>
        {file && (
          <Card className="border-zinc-200 shadow-none">
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Rows</label>
                  <Input type="number" value={rows} onChange={(e) => setRows(parseInt(e.target.value) || 1)} min={1} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Columns</label>
                  <Input type="number" value={cols} onChange={(e) => setCols(parseInt(e.target.value) || 1)} min={1} />
                </div>
              </div>
              <Button onClick={handleProcess} disabled={isProcessing} className="w-full h-12 bg-blue-600 hover:bg-blue-700">
                {isProcessing ? 'Splitting...' : 'Split Image'}
              </Button>
            </CardContent>
          </Card>
        )}
        {pieces.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xl">Pieces ({pieces.length})</h3>
              <Button onClick={handleDownloadAll} className="space-x-2">
                <Download className="h-4 w-4" />
                <span>Download All as ZIP</span>
              </Button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {pieces.map((src, i) => (
                <div key={i} className="aspect-square border border-zinc-200 rounded bg-zinc-50 overflow-hidden">
                  <img src={src} className="w-full h-full object-contain" alt="" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolPageLayout>
  );
}
