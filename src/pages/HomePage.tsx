import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Wrench, DollarSign, UserX, Monitor, Shield, ArrowRight,
  Search, LayoutGrid, Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { TOOLS } from '@/config/tools';
import { SEOHead } from '@/components/SEOHead';
import { AdSlot } from '@/components/AdSlot';
import { getAdCode } from '@/config/ads';
import { SITE_CONFIG } from '@/config/site';

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', ...Array.from(new Set(TOOLS.map(t => t.category)))];

  const filteredTools = TOOLS.filter(tool => {
    const matchesCategory = activeCategory === 'All' || tool.category === activeCategory;
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-16 py-8">
      <SEOHead 
        title={`${SITE_CONFIG.name} — ${SITE_CONFIG.description}`}
        description={SITE_CONFIG.description}
        canonical="/"
      />

      {/* Hero Section */}
      <section className="text-center space-y-6 max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight text-zinc-900 leading-[1.15]">
          Free Online <span className="text-blue-600">Image Tools</span>
        </h1>
        <p className="text-lg sm:text-xl text-zinc-600">
          25+ powerful tools. No signup. No server upload. All processing in your browser.
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Button size="lg" className="h-12 px-8 text-base bg-blue-600 hover:bg-blue-700 space-x-2" asChild>
            <a href="#tools">
              <LayoutGrid className="h-5 w-5" />
              <span>Browse Tools</span>
            </a>
          </Button>
          <Button size="lg" variant="outline" className="h-12 px-8 text-base space-x-2 border-zinc-200 hover:bg-zinc-50" asChild>
            <Link to="/tools/image-compressor">
              <Zap className="h-5 w-5 text-blue-600" />
              <span>Try Compressor</span>
            </Link>
          </Button>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-8 border-y border-zinc-100 bg-zinc-50/50">
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-6 px-4">
          {[
            { icon: Wrench, label: '25+ Tools' },
            { icon: DollarSign, label: '100% Free' },
            { icon: UserX, label: 'No Signup' },
            { icon: Monitor, label: 'Browser-Based' },
            { icon: Shield, label: 'Privacy First' },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center space-y-1.5 flex-1 min-w-[70px] max-w-[100px]">
              <div className="p-2 bg-white rounded-full shadow-sm border border-zinc-100 shrink-0">
                <stat.icon className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold text-zinc-600 uppercase tracking-tight text-center">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      <AdSlot slot="in-content" adCode={getAdCode('inContent')} className="my-8" />

      {/* Tools Section */}
      <section id="tools" className="space-y-8">
        <div className="w-full border-b border-zinc-100 md:border-none pb-4 md:pb-0">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="w-full overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
              <Tabs defaultValue="All" onValueChange={setActiveCategory} className="w-full">
                <TabsList className="bg-zinc-100/80 p-1 inline-flex w-max md:w-auto min-w-full md:min-w-0">
                  {categories.map(cat => (
                    <TabsTrigger 
                      key={cat} 
                      value={cat} 
                      className="rounded-md px-4 py-2 text-xs sm:text-sm font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm whitespace-nowrap"
                    >
                      {cat}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            <div className="relative w-full md:w-72 shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input 
                placeholder="Search 25+ tools..." 
                className="pl-10 h-11 border-zinc-200 bg-white shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredTools.map((tool) => (
            <Link key={tool.id} to={`/tools/${tool.id}`}>
              <Card className="h-full border-zinc-200 hover:border-blue-600 transition-colors shadow-none group">
                <CardContent className="p-4 sm:p-6 flex flex-col h-full space-y-4">
                  <div className="p-2 sm:p-3 w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-zinc-50 text-zinc-900 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors shrink-0">
                    <tool.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-lg leading-tight">{tool.name}</h3>
                    <p className="text-sm text-zinc-500 leading-snug">{tool.description}</p>
                  </div>
                  <div className="mt-auto pt-2 flex items-center justify-between">
                    <Badge variant="secondary" className="bg-zinc-100 text-zinc-600 font-normal">
                      {tool.category}
                    </Badge>
                    <ArrowRight className="h-4 w-4 text-zinc-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <AdSlot slot="footer" adCode={getAdCode('footer')} className="my-8" />
    </div>
  );
}
