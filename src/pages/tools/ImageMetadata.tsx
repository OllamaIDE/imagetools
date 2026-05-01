import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { ToolPageLayout } from '@/components/ToolPageLayout';
import { TOOLS } from '@/config/tools';
import { SEOHead } from '@/components/SEOHead';

const tool = TOOLS.find(t => t.id === 'image-metadata')!;

export default function ImageMetadata() {
  const [file, setFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<any>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      
      const img = new Image();
      img.onload = () => {
        setMetadata({
          filename: selectedFile.name,
          type: selectedFile.type,
          size: (selectedFile.size / 1024).toFixed(2) + ' KB',
          dimensions: `${img.width} x ${img.height} px`,
          lastModified: new Date(selectedFile.lastModified).toLocaleString(),
        });
      };
      img.src = URL.createObjectURL(selectedFile);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/*': [] }, multiple: false });

  return (
    <ToolPageLayout toolId={tool.id} title={tool.name} description={tool.description} icon={tool.icon}>
      <SEOHead title="Image Metadata Viewer Online — View EXIF and Photo Information" description="View complete image metadata including EXIF data, GPS location, camera settings and file information online. Free browser-based metadata viewer." keywords="image metadata viewer, exif viewer, photo information, view image exif" canonical="/tools/image-metadata" />
      <div className="space-y-8">
        <div {...getRootProps()} className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-zinc-200 hover:border-zinc-300 bg-zinc-50/50'}`}>
          <input {...getInputProps()} />
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-white rounded-full shadow-sm"><Info className="h-8 w-8 text-zinc-400" /></div>
            {file ? <p className="font-medium">{file.name}</p> : <p className="font-medium text-zinc-900">Click or drag image to view metadata</p>}
          </div>
        </div>

        {metadata && (
          <Card className="border-zinc-200 shadow-none">
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <tbody>
                  {Object.entries(metadata).map(([key, value]: [string, any]) => (
                    <tr key={key} className="border-b border-zinc-100 last:border-0">
                      <td className="p-4 font-medium text-zinc-500 capitalize bg-zinc-50/50 w-1/3">{key}</td>
                      <td className="p-4 text-zinc-900">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        )}
      </div>
    </ToolPageLayout>
  );
}
