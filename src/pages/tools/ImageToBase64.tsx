import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { ToolPageLayout } from '@/components/ToolPageLayout';
import { TOOLS } from '@/config/tools';
import { fileToBase64 } from '@/utils/imageProcessing';
import { SEOHead } from '@/components/SEOHead';

const tool = TOOLS.find(t => t.id === 'image-to-base64')!;

export default function ImageToBase64() {
  const [file, setFile] = useState<File | null>(null);
  const [base64, setBase64] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [includeDataUri, setIncludeDataUri] = useState(true);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      const b64 = await fileToBase64(selectedFile);
      setBase64(b64);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/*': [] }, multiple: false });

  const handleCopy = () => {
    const text = includeDataUri ? base64 : base64.split(',')[1];
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <ToolPageLayout toolId={tool.id} title={tool.name} description={tool.description} icon={tool.icon}>
      <SEOHead title="Image to Base64 Converter Online — Encode Images to Base64 String" description="Convert images to Base64 encoded strings online. Get data URI format for CSS or HTML embedding. Free, instant, browser-based tool." keywords="image to base64, base64 encoder, convert image base64" canonical="/tools/image-to-base64" />
      <div className="space-y-8">
        <div {...getRootProps()} className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-zinc-200 hover:border-zinc-300 bg-zinc-50/50'}`}>
          <input {...getInputProps()} />
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-white rounded-full shadow-sm"><Upload className="h-8 w-8 text-zinc-400" /></div>
            {file ? <p className="font-medium">{file.name}</p> : <p className="font-medium text-zinc-900">Click or drag image to encode</p>}
          </div>
        </div>
        {base64 && (
          <Card className="border-zinc-200 shadow-none">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch checked={includeDataUri} onCheckedChange={setIncludeDataUri} id="data-uri" />
                  <label htmlFor="data-uri" className="text-sm font-medium">Include Data URI Prefix</label>
                </div>
                <Button variant="outline" size="sm" onClick={handleCopy} className="space-x-2">
                  {isCopied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                  <span>{isCopied ? 'Copied!' : 'Copy String'}</span>
                </Button>
              </div>
              <textarea 
                readOnly 
                value={includeDataUri ? base64 : base64.split(',')[1]} 
                className="w-full h-64 p-4 text-xs font-mono bg-zinc-50 border border-zinc-200 rounded-lg resize-none focus:outline-none"
              />
              <div className="flex justify-between text-[10px] text-zinc-400 uppercase tracking-widest font-bold">
                <span>Format: {file?.type}</span>
                <span>Length: {base64.length.toLocaleString()} characters</span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ToolPageLayout>
  );
}
