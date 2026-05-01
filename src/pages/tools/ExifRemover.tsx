import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Download, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ToolPageLayout } from '@/components/ToolPageLayout';
import { TOOLS } from '@/config/tools';
import { removeExif } from '@/utils/imageProcessing';
import { SEOHead } from '@/components/SEOHead';

const tool = TOOLS.find(t => t.id === 'exif-remover')!;

export default function ExifRemover() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ url: string; size: number } | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setResult(null);
    }
  }, []);

  // Real-time EXIF removal
  useEffect(() => {
    if (file) {
      handleProcess();
    }
  }, [file]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/jpeg': ['.jpg', '.jpeg'] }, multiple: false });

  const handleProcess = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const blob = await removeExif(file);
      setResult({ url: URL.createObjectURL(blob), size: blob.size });
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolPageLayout toolId={tool.id} title={tool.name} description={tool.description} icon={tool.icon}>
      <SEOHead title="Remove EXIF Data from Images Online — Free Privacy Tool" description="Strip EXIF metadata from JPG photos online to protect your privacy. Remove GPS location, camera model and timestamps. Free browser-based tool." keywords="remove exif data, strip image metadata, exif remover, remove gps from photo" canonical="/tools/exif-remover" />
      <div className="space-y-8">
        <div {...getRootProps()} className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-zinc-200 hover:border-zinc-300 bg-zinc-50/50'}`}>
          <input {...getInputProps()} />
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-white rounded-full shadow-sm"><ShieldCheck className="h-8 w-8 text-zinc-400" /></div>
            {file ? <p className="font-medium">{file.name}</p> : <p className="font-medium text-zinc-900">Click or drag JPG to remove EXIF</p>}
          </div>
        </div>

        {file && !result && isProcessing && (
          <Card className="border-zinc-200 shadow-none">
            <CardContent className="p-6 text-center">
              <p className="text-sm text-zinc-500 animate-pulse">Removing EXIF Metadata...</p>
            </CardContent>
          </Card>
        )}

        {result && (
          <div className="space-y-6 text-center">
            <div className="p-8 bg-green-50 border border-green-100 rounded-xl space-y-4">
              <div className="p-3 bg-green-500 text-white rounded-full inline-block"><ShieldCheck className="h-6 w-6" /></div>
              <h3 className="font-bold text-green-800">EXIF Data Removed!</h3>
              <p className="text-sm text-green-600">Your image is now clean and private.</p>
              <Button onClick={() => { const a = document.createElement('a'); a.href = result.url; a.download = `clean-${file?.name}`; a.click(); }} className="w-full bg-green-600 hover:bg-green-700">Download Clean Image</Button>
            </div>
          </div>
        )}
      </div>
    </ToolPageLayout>
  );
}
