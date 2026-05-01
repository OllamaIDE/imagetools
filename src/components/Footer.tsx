import { Link } from 'react-router-dom';
import { Image as ImageIcon } from 'lucide-react';
import { TOOLS } from '@/config/tools';
import { SITE_CONFIG } from '@/config/site';

export function Footer() {
  const categories = Array.from(new Set(TOOLS.map(t => t.category)));

  return (
    <footer className="w-full border-t border-zinc-200 bg-zinc-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          <div className="md:col-span-4 space-y-4 text-center md:text-left">
            <Link to="/" className="flex items-center justify-center md:justify-start space-x-2">
              <ImageIcon className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-bold font-geist">{SITE_CONFIG.name}</span>
            </Link>
            <p className="text-sm text-zinc-500 max-w-xs mx-auto md:mx-0">
              {SITE_CONFIG.description}
            </p>
          </div>
          
          <div className="md:col-span-6 space-y-4">
            <h4 className="font-bold text-sm uppercase tracking-widest text-zinc-900 text-center md:text-left">Tools</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2 gap-x-4">
              {TOOLS.slice(0, 15).map((tool) => (
                <Link
                  key={tool.id}
                  to={`/tools/${tool.id}`}
                  className="text-sm text-zinc-500 hover:text-blue-600 transition-colors text-center md:text-left"
                >
                  {tool.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 space-y-4 text-center md:text-left">
            <h4 className="font-bold text-sm uppercase tracking-widest text-zinc-900">Legal</h4>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li><Link to="/privacy" className="hover:text-blue-600 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-blue-600 transition-colors">Terms of Service</Link></li>
              <li><Link to="/contact" className="hover:text-blue-600 transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-zinc-200 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-zinc-500">
            &copy; {new Date().getFullYear()} {SITE_CONFIG.name}. Made for privacy — no data stored.
          </p>
          <div className="flex space-x-6 text-sm text-zinc-500">
            <span>100% Client-Side</span>
            <span>No Cookies</span>
            <span>Open Source</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
