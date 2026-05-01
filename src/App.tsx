import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Layout } from './components/Layout';
import HomePage from './pages/HomePage';

// Lazy load tools for better performance
import ImageCompressor from './pages/tools/ImageCompressor';
import ImageResizer from './pages/tools/ImageResizer';
import ImageCropper from './pages/tools/ImageCropper';
import ImageConverter from './pages/tools/ImageConverter';
import ImageToBase64 from './pages/tools/ImageToBase64';
import Base64ToImage from './pages/tools/Base64ToImage';
import ImageWatermark from './pages/tools/ImageWatermark';
import ImageBrightness from './pages/tools/ImageBrightness';
import ImageBlur from './pages/tools/ImageBlur';
import ImageGrayscale from './pages/tools/ImageGrayscale';
import ImageFlip from './pages/tools/ImageFlip';
import ImageRotate from './pages/tools/ImageRotate';
import ImageBorderAdder from './pages/tools/ImageBorderAdder';
import ImageMerger from './pages/tools/ImageMerger';
import ImageSplitter from './pages/tools/ImageSplitter';
import PdfToImage from './pages/tools/PdfToImage';
import ImageToPdf from './pages/tools/ImageToPdf';
import SvgToPng from './pages/tools/SvgToPng';
import PngToSvg from './pages/tools/PngToSvg';
import IcoConverter from './pages/tools/IcoConverter';
import WebpConverter from './pages/tools/WebpConverter';
import ImageColorPicker from './pages/tools/ImageColorPicker';
import ExifRemover from './pages/tools/ExifRemover';
import ImageMetadata from './pages/tools/ImageMetadata';
import BulkResize from './pages/tools/BulkResize';

import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import About from './pages/About';
import Contact from './pages/Contact';
import ThankYou from './pages/ThankYou';

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="privacy" element={<PrivacyPolicy />} />
            <Route path="terms" element={<TermsOfService />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="thank-you" element={<ThankYou />} />
            
            <Route path="tools">
              <Route path="image-compressor" element={<ImageCompressor />} />
              <Route path="image-resizer" element={<ImageResizer />} />
              <Route path="image-cropper" element={<ImageCropper />} />
              <Route path="image-converter" element={<ImageConverter />} />
              <Route path="image-to-base64" element={<ImageToBase64 />} />
              <Route path="base64-to-image" element={<Base64ToImage />} />
              <Route path="image-watermark" element={<ImageWatermark />} />
              <Route path="image-brightness" element={<ImageBrightness />} />
              <Route path="image-blur" element={<ImageBlur />} />
              <Route path="image-grayscale" element={<ImageGrayscale />} />
              <Route path="image-flip" element={<ImageFlip />} />
              <Route path="image-rotate" element={<ImageRotate />} />
              <Route path="image-border" element={<ImageBorderAdder />} />
              <Route path="image-merger" element={<ImageMerger />} />
              <Route path="image-splitter" element={<ImageSplitter />} />
              <Route path="pdf-to-image" element={<PdfToImage />} />
              <Route path="image-to-pdf" element={<ImageToPdf />} />
              <Route path="svg-to-png" element={<SvgToPng />} />
              <Route path="png-to-svg" element={<PngToSvg />} />
              <Route path="ico-converter" element={<IcoConverter />} />
              <Route path="webp-converter" element={<WebpConverter />} />
              <Route path="image-color-picker" element={<ImageColorPicker />} />
              <Route path="exif-remover" element={<ExifRemover />} />
              <Route path="image-metadata" element={<ImageMetadata />} />
              <Route path="bulk-resize" element={<BulkResize />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<HomePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
