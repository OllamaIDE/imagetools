import { 
  Minimize2, Maximize2, Crop, RefreshCw, Code2, Image, Stamp, Sun, 
  Blend, Contrast, FlipHorizontal2, RotateCw, Frame, Layers, Grid2X2, 
  FileImage, FilePlus, FileType2, Spline, AppWindow, ImagePlay, 
  Pipette, ShieldOff, Info, GalleryHorizontalEnd 
} from 'lucide-react';

export const TOOLS = [
  { id: 'image-compressor', name: 'Image Compressor', icon: Minimize2, description: 'Reduce image size without losing quality', category: 'Compress' },
  { id: 'image-resizer', name: 'Image Resizer', icon: Maximize2, description: 'Resize images to exact pixels or percentage', category: 'Edit' },
  { id: 'image-cropper', name: 'Image Cropper', icon: Crop, description: 'Crop images to any size or ratio', category: 'Edit' },
  { id: 'image-converter', name: 'Image Converter', icon: RefreshCw, description: 'Convert between JPG, PNG, WebP and more', category: 'Convert' },
  { id: 'image-to-base64', name: 'Image to Base64', icon: Code2, description: 'Encode images to Base64 string', category: 'Convert' },
  { id: 'base64-to-image', name: 'Base64 to Image', icon: Image, description: 'Decode Base64 string to image', category: 'Convert' },
  { id: 'image-watermark', name: 'Image Watermark', icon: Stamp, description: 'Add text or logo watermark to photos', category: 'Edit' },
  { id: 'image-brightness', name: 'Brightness/Contrast', icon: Sun, description: 'Adjust image brightness and contrast', category: 'Edit' },
  { id: 'image-blur', name: 'Image Blur', icon: Blend, description: 'Apply Gaussian, Box or Radial blur', category: 'Edit' },
  { id: 'image-grayscale', name: 'Image Grayscale', icon: Contrast, description: 'Convert images to black and white', category: 'Edit' },
  { id: 'image-flip', name: 'Image Flip', icon: FlipHorizontal2, description: 'Mirror images horizontally or vertically', category: 'Edit' },
  { id: 'image-rotate', name: 'Image Rotate', icon: RotateCw, description: 'Rotate photos any degree', category: 'Edit' },
  { id: 'image-border', name: 'Border Adder', icon: Frame, description: 'Add custom borders and frames', category: 'Edit' },
  { id: 'image-merger', name: 'Image Merger', icon: Layers, description: 'Combine multiple photos side by side', category: 'Edit' },
  { id: 'image-splitter', name: 'Image Splitter', icon: Grid2X2, description: 'Cut image into equal grid parts', category: 'Edit' },
  { id: 'pdf-to-image', name: 'PDF to Image', icon: FileImage, description: 'Convert PDF pages to PNG or JPG', category: 'Convert' },
  { id: 'image-to-pdf', name: 'Image to PDF', icon: FilePlus, description: 'Combine photos into a single PDF', category: 'Convert' },
  { id: 'svg-to-png', name: 'SVG to PNG', icon: FileType2, description: 'Convert vector SVG to PNG image', category: 'Convert' },
  { id: 'png-to-svg', name: 'PNG to SVG', icon: Spline, description: 'Trace raster images to vector SVG', category: 'Generate' },
  { id: 'ico-converter', name: 'ICO Converter', icon: AppWindow, description: 'Create Favicon ICO from PNG or JPG', category: 'Generate' },
  { id: 'webp-converter', name: 'WebP Converter', icon: ImagePlay, description: 'Convert images to WebP format', category: 'Convert' },
  { id: 'image-color-picker', name: 'Color Picker', icon: Pipette, description: 'Pick colors from any photo', category: 'Metadata' },
  { id: 'exif-remover', name: 'EXIF Remover', icon: ShieldOff, description: 'Strip metadata for privacy', category: 'Metadata' },
  { id: 'image-metadata', name: 'Metadata Viewer', icon: Info, description: 'View EXIF and photo information', category: 'Metadata' },
  { id: 'bulk-resize', name: 'Bulk Resizer', icon: GalleryHorizontalEnd, description: 'Resize multiple images at once', category: 'Edit' },
] as const;

export type ToolId = typeof TOOLS[number]['id'];
