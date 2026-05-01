import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ToolPageLayout } from '@/components/ToolPageLayout';
import { TOOLS } from '@/config/tools';
import { SEOHead } from '@/components/SEOHead';

const tool = TOOLS.find(t => t.id === 'base64-to-image')!;

export default function Base64ToImage() {
  const [base64, setBase64] = useState('');
  const [result, setResult] = useState<{ url: string; format: string } | null>(null);

  // Real-time decoding
  useEffect(() => {
    if (base64.trim()) {
      handleConvert();
    } else {
      setResult(null);
    }
  }, [base64]);

  const handleConvert = () => {
    try {
      let b64 = base64.trim();
      if (!b64.startsWith('data:image')) {
        b64 = `data:image/png;base64,${b64}`;
      }
      setResult({ url: b64, format: 'PNG' });
    } catch (error) {
      alert('Invalid Base64 string');
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const a = document.createElement('a');
    a.href = result.url;
    a.download = `decoded-image.${result.format.toLowerCase()}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <ToolPageLayout toolId={tool.id} title={tool.name} description={tool.description} icon={tool.icon}>
      <SEOHead title="Base64 to Image Converter — Decode Base64 String to Image Online" description="Decode Base64 strings back to images online. Supports data URI and raw base64. Preview and download instantly." keywords="base64 to image, decode base64 image, base64 decoder" canonical="/tools/base64-to-image" />
      <div className="space-y-8">
        <Card className="border-zinc-200 shadow-none">
          <CardContent className="p-6 space-y-4">
            <label className="text-sm font-medium">Paste Base64 String</label>
            <textarea 
              value={base64} 
              onChange={(e) => setBase64(e.target.value)}
              placeholder="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="
              className="w-full h-64 p-4 text-xs font-mono bg-zinc-50 border border-zinc-200 rounded-lg resize-none focus:outline-none"
            />
          </CardContent>
        </Card>
        {result && (
          <div className="space-y-6 text-center">
            <div className="rounded-xl border border-zinc-200 overflow-hidden bg-zinc-50 inline-block p-4"><img src={result.url} alt="Decoded" className="max-h-96 object-contain" /></div>
            <Button onClick={handleDownload} className="w-full space-x-2"><Download className="h-4 w-4" /><span>Download Image</span></Button>
          </div>
        )}
      </div>
    </ToolPageLayout>
  );
}
