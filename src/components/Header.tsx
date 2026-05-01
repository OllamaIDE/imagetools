import { Link } from 'react-router-dom';
import { Menu, Image as ImageIcon, ChevronDown, Home, Info, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { TOOLS } from '@/config/tools';
import { SITE_CONFIG } from '@/config/site';

export function Header() {
  const categories = Array.from(new Set(TOOLS.map(t => t.category)));

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 shrink-0">
          <ImageIcon className="h-6 w-6 text-blue-600 shrink-0" />
          <span className="text-lg sm:text-xl font-bold font-geist truncate">{SITE_CONFIG.name}</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-6">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-1 font-medium text-zinc-600 hover:text-zinc-900 transition-colors">
                <span>Tools</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="center" className="w-[calc(100vw-2rem)] md:w-[800px] lg:w-[1000px] p-0 mt-2">
              <ScrollArea className="max-h-[80vh] p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {categories.map((category) => (
                    <div key={category} className="space-y-4">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400 px-2 border-l-2 border-blue-500">{category}</h4>
                      <div className="flex flex-col space-y-1">
                        {TOOLS.filter(t => t.category === category).map((tool) => (
                          <Link
                            key={tool.id}
                            to={`/tools/${tool.id}`}
                            className="flex items-center space-x-3 rounded-lg p-2.5 transition-all hover:bg-blue-50 hover:text-blue-700 group"
                          >
                            <div className="p-2 bg-zinc-50 rounded-md group-hover:bg-blue-100 transition-colors shrink-0">
                              <tool.icon className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-semibold leading-none mb-1 truncate">{tool.name}</div>
                              <p className="text-[11px] text-zinc-500 line-clamp-1">{tool.description}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </PopoverContent>
          </Popover>
          <Link to="/about" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors">
            About
          </Link>
          <Link to="/contact" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors">
            Contact
          </Link>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0">
              <div className="flex flex-col h-full">
                <div className="p-6 border-b border-zinc-100">
                  <Link to="/" className="flex items-center space-x-2">
                    <ImageIcon className="h-6 w-6 text-blue-600 shrink-0" />
                    <span className="text-lg sm:text-xl font-bold font-geist">{SITE_CONFIG.name}</span>
                  </Link>
                </div>
                <ScrollArea className="flex-1 p-6">
                  <div className="flex flex-col space-y-6">
                    <div className="flex flex-col space-y-4">
                      <Link to="/" className="flex items-center space-x-3 text-sm font-semibold hover:text-blue-600 transition-colors">
                        <Home className="h-4 w-4" />
                        <span>Home</span>
                      </Link>
                      <Link to="/about" className="flex items-center space-x-3 text-sm font-semibold hover:text-blue-600 transition-colors">
                        <Info className="h-4 w-4" />
                        <span>About</span>
                      </Link>
                      <Link to="/contact" className="flex items-center space-x-3 text-sm font-semibold hover:text-blue-600 transition-colors">
                        <Mail className="h-4 w-4" />
                        <span>Contact</span>
                      </Link>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400 px-2 border-l-2 border-blue-500">Image Tools</h4>
                      <Accordion type="multiple" className="w-full">
                        {categories.map((category) => (
                          <AccordionItem key={category} value={category} className="border-none">
                            <AccordionTrigger className="hover:no-underline py-2 text-sm font-semibold text-zinc-700">
                              {category}
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="grid grid-cols-1 gap-1 pl-2">
                                {TOOLS.filter(t => t.category === category).map((tool) => (
                                  <Link
                                    key={tool.id}
                                    to={`/tools/${tool.id}`}
                                    className="flex items-center space-x-3 p-2 rounded-md hover:bg-zinc-50 transition-colors"
                                  >
                                    <div className="p-1.5 bg-zinc-100 rounded text-zinc-500">
                                      <tool.icon className="h-3.5 w-3.5" />
                                    </div>
                                    <span className="text-sm">{tool.name}</span>
                                  </Link>
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>
                  </div>
                </ScrollArea>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
