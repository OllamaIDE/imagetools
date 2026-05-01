import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Info } from 'lucide-react';
import { AdSlot } from './AdSlot';
import { getAdCode } from '@/config/ads';
import { TOOLS } from '@/config/tools';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface ToolPageLayoutProps {
  toolId: string;
  title: string;
  description: string;
  icon: React.ElementType;
  children: React.ReactNode;
}

export function ToolPageLayout({ toolId, title, description, icon: Icon, children }: ToolPageLayoutProps) {
  const currentTool = TOOLS.find(t => t.id === toolId);
  const relatedTools = TOOLS.filter(t => t.category === currentTool?.category && t.id !== toolId).slice(0, 5);

  return (
    <div className="space-y-8 py-4">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-sm text-zinc-500 mb-4">
        <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-zinc-900 font-medium">{title}</span>
      </nav>

      {/* Tool Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4 mb-8 text-center sm:text-left px-2 sm:px-0">
        <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100 shrink-0">
          <Icon className="h-8 w-8 text-blue-600" />
        </div>
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 leading-tight truncate sm:whitespace-normal">{title}</h1>
          <p className="text-sm sm:text-base text-zinc-500 leading-relaxed">{description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Tool Area */}
        <div className="lg:col-span-8 space-y-8 w-full max-w-full">
          {children}
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-8">
          <AdSlot slot="sidebar" adCode={getAdCode('sidebar')} className="mb-8" width={300} height={250} />
          
          <Card className="border-zinc-200 shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold flex items-center">
                <Info className="h-4 w-4 mr-2 text-zinc-400" />
                Related Tools
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {relatedTools.map(tool => (
                <Link
                  key={tool.id}
                  to={`/tools/${tool.id}`}
                  className="block p-2 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-blue-600 rounded-md transition-colors"
                >
                  {tool.name}
                </Link>
              ))}
            </CardContent>
          </Card>

          <Card className="border-zinc-200 shadow-none bg-zinc-50/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold">Privacy Guaranteed</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-zinc-500 leading-relaxed">
                All image processing happens locally in your browser. We never upload your files to any server. Your privacy is our priority.
              </p>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
