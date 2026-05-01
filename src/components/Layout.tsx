import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { AdSlot } from './AdSlot';
import { getAdCode } from '@/config/ads';

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col font-geist bg-white overflow-x-hidden w-full">
      <Header />
      
      <main className="flex-1 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <AdSlot slot="header" adCode={getAdCode('header')} className="mb-8" />
          <Outlet />
          <AdSlot slot="footer" adCode={getAdCode('footer')} className="mt-12" />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
