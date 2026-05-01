import imageCompression from 'browser-image-compression';

export async function compressImage(file: File, quality: number, maxWidth?: number, maxHeight?: number): Promise<Blob> {
  const options = {
    maxSizeMB: 10,
    maxWidthOrHeight: maxWidth || maxHeight || 4096,
    useWebWorker: true,
    initialQuality: quality / 100,
  };
  return await imageCompression(file, options);
}

export async function fileToCanvas(file: File): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject('Failed to get canvas context');
      ctx.drawImage(img, 0, 0);
      resolve(canvas);
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

export async function canvasToBlob(canvas: HTMLCanvasElement, format: string = 'image/png', quality: number = 0.92): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject('Failed to convert canvas to blob');
    }, format, quality);
  });
}

export async function resizeImage(file: File, width: number, height: number, fit: 'contain' | 'cover' | 'fill'): Promise<Blob> {
  const canvas = await fileToCanvas(file);
  const img = new Image();
  img.src = canvas.toDataURL();
  await img.decode();

  const targetCanvas = document.createElement('canvas');
  targetCanvas.width = width;
  targetCanvas.height = height;
  const ctx = targetCanvas.getContext('2d');
  if (!ctx) throw new Error('Failed to get context');

  if (fit === 'fill') {
    ctx.drawImage(img, 0, 0, width, height);
  } else {
    const scale = fit === 'contain' 
      ? Math.min(width / img.width, height / img.height)
      : Math.max(width / img.width, height / img.height);
    
    const x = (width - img.width * scale) / 2;
    const y = (height - img.height * scale) / 2;
    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
  }

  return await canvasToBlob(targetCanvas);
}

export async function convertImage(file: File, format: string, quality: number = 90): Promise<Blob> {
  const canvas = await fileToCanvas(file);
  return await canvasToBlob(canvas, format, quality / 100);
}

export async function applyBrightness(file: File, brightness: number, contrast: number, saturation: number, hue: number): Promise<Blob> {
  const canvas = await fileToCanvas(file);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Failed to get context');

  ctx.filter = `brightness(${100 + brightness}%) contrast(${100 + contrast}%) saturate(${100 + saturation}%) hue-rotate(${hue}deg)`;
  ctx.drawImage(canvas, 0, 0);
  
  return await canvasToBlob(canvas);
}

export async function flipImage(file: File, horizontal: boolean, vertical: boolean): Promise<Blob> {
  const canvas = await fileToCanvas(file);
  const targetCanvas = document.createElement('canvas');
  targetCanvas.width = canvas.width;
  targetCanvas.height = canvas.height;
  const ctx = targetCanvas.getContext('2d');
  if (!ctx) throw new Error('Failed to get context');

  ctx.translate(horizontal ? canvas.width : 0, vertical ? canvas.height : 0);
  ctx.scale(horizontal ? -1 : 1, vertical ? -1 : 1);
  ctx.drawImage(canvas, 0, 0);

  return await canvasToBlob(targetCanvas);
}

export async function rotateImage(file: File, degrees: number, bgColor: string): Promise<Blob> {
  const canvas = await fileToCanvas(file);
  const radians = (degrees * Math.PI) / 180;
  
  const width = Math.abs(canvas.width * Math.cos(radians)) + Math.abs(canvas.height * Math.sin(radians));
  const height = Math.abs(canvas.width * Math.sin(radians)) + Math.abs(canvas.height * Math.cos(radians));

  const targetCanvas = document.createElement('canvas');
  targetCanvas.width = width;
  targetCanvas.height = height;
  const ctx = targetCanvas.getContext('2d');
  if (!ctx) throw new Error('Failed to get context');

  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);
  ctx.translate(width / 2, height / 2);
  ctx.rotate(radians);
  ctx.drawImage(canvas, -canvas.width / 2, -canvas.height / 2);

  return await canvasToBlob(targetCanvas);
}

export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function base64ToBlob(base64: string): Promise<Blob> {
  const res = await fetch(base64);
  return await res.blob();
}

export async function addWatermarkText(file: File, text: string, options: { fontSize: number; color: string; opacity: number; position: string }): Promise<Blob> {
  const canvas = await fileToCanvas(file);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Failed to get context');

  ctx.globalAlpha = options.opacity / 100;
  ctx.fillStyle = options.color;
  ctx.font = `${options.fontSize}px Geist, sans-serif`;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';

  let x = canvas.width / 2;
  let y = canvas.height / 2;

  if (options.position.includes('top')) y = options.fontSize;
  if (options.position.includes('bottom')) y = canvas.height - options.fontSize;
  if (options.position.includes('left')) x = options.fontSize * 2;
  if (options.position.includes('right')) x = canvas.width - options.fontSize * 2;

  ctx.fillText(text, x, y);

  return await canvasToBlob(canvas);
}

export async function addBorder(file: File, width: number, color: string, style: 'solid' | 'dashed' | 'dotted'): Promise<Blob> {
  const canvas = await fileToCanvas(file);
  const targetCanvas = document.createElement('canvas');
  targetCanvas.width = canvas.width + width * 2;
  targetCanvas.height = canvas.height + width * 2;
  const ctx = targetCanvas.getContext('2d');
  if (!ctx) throw new Error('Failed to get context');

  ctx.fillStyle = color;
  if (style === 'solid') {
    ctx.fillRect(0, 0, targetCanvas.width, targetCanvas.height);
  } else {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    if (style === 'dashed') ctx.setLineDash([20, 10]);
    if (style === 'dotted') ctx.setLineDash([5, 5]);
    ctx.strokeRect(width / 2, width / 2, targetCanvas.width - width, targetCanvas.height - width);
  }
  
  ctx.drawImage(canvas, width, width);
  return await canvasToBlob(targetCanvas);
}

export async function mergeImages(files: File[], layout: 'horizontal' | 'vertical' | 'grid', spacing: number): Promise<Blob> {
  const canvases = await Promise.all(files.map(f => fileToCanvas(f)));
  const totalWidth = layout === 'horizontal' 
    ? canvases.reduce((acc, c) => acc + c.width + spacing, 0) - spacing
    : Math.max(...canvases.map(c => c.width));
  const totalHeight = layout === 'vertical'
    ? canvases.reduce((acc, c) => acc + c.height + spacing, 0) - spacing
    : Math.max(...canvases.map(c => c.height));

  const targetCanvas = document.createElement('canvas');
  targetCanvas.width = totalWidth;
  targetCanvas.height = totalHeight;
  const ctx = targetCanvas.getContext('2d');
  if (!ctx) throw new Error('Failed to get context');

  let currentX = 0;
  let currentY = 0;

  for (const canvas of canvases) {
    ctx.drawImage(canvas, currentX, currentY);
    if (layout === 'horizontal') currentX += canvas.width + spacing;
    if (layout === 'vertical') currentY += canvas.height + spacing;
  }

  return await canvasToBlob(targetCanvas);
}

export async function removeExif(file: File): Promise<Blob> {
  // Redrawing on canvas strips EXIF
  const canvas = await fileToCanvas(file);
  return await canvasToBlob(canvas, file.type);
}

export async function generateIco(canvases: HTMLCanvasElement[]): Promise<Blob> {
  const header = new Uint8Array(6);
  const headerView = new DataView(header.buffer);
  headerView.setUint16(2, 1, true); // Type 1 for ICO
  headerView.setUint16(4, canvases.length, true); // Number of images

  const directoryEntries: Uint8Array[] = [];
  const imageData: Uint8Array[] = [];
  
  let currentOffset = 6 + (canvases.length * 16);

  for (const canvas of canvases) {
    const blob = await canvasToBlob(canvas, 'image/png');
    const buffer = await blob.arrayBuffer();
    const data = new Uint8Array(buffer);
    
    const entry = new Uint8Array(16);
    const entryView = new DataView(entry.buffer);
    
    entryView.setUint8(0, canvas.width >= 256 ? 0 : canvas.width);
    entryView.setUint8(1, canvas.height >= 256 ? 0 : canvas.height);
    entryView.setUint8(2, 0); // Palette
    entryView.setUint8(3, 0); // Reserved
    entryView.setUint16(4, 1, true); // Color planes
    entryView.setUint16(6, 32, true); // Bits per pixel
    entryView.setUint32(8, data.length, true); // Size of data
    entryView.setUint32(12, currentOffset, true); // Offset of data
    
    directoryEntries.push(entry);
    imageData.push(data);
    currentOffset += data.length;
  }

  const finalBlobParts: any[] = [header, ...directoryEntries, ...imageData];
  return new Blob(finalBlobParts, { type: 'image/vnd.microsoft.icon' });
}
