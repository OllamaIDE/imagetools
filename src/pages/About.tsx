import { SEOHead } from '@/components/SEOHead';
import { Shield, Zap, Globe, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { SITE_CONFIG } from '@/config/site';

export default function About() {
  return (
    <div className="max-w-4xl mx-auto py-12 space-y-12">
      <SEOHead 
        title="About Us"
        description={`Learn more about ${SITE_CONFIG.name}, our mission, and why we build browser-only privacy-first tools.`}
        canonical="/about"
      />
      
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">About {SITE_CONFIG.name}</h1>
        <p className="text-xl text-zinc-500 max-w-2xl mx-auto">
          We're building a world where powerful image processing tools are free, fast, and private by default.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[
          {
            icon: Shield,
            title: "Privacy First",
            description: "Your images never leave your browser. All processing happens locally on your device."
          },
          {
            icon: Zap,
            title: "Lightning Fast",
            description: "No upload or download wait times. Instant results using modern browser APIs."
          },
          {
            icon: Globe,
            title: "Always Free",
            description: "Our tools are 100% free to use. Supported by subtle, non-intrusive advertisements."
          },
          {
            icon: Heart,
            title: "Simple & Clean",
            description: "Minimalist design focused on getting your job done without any distractions."
          }
        ].map((item, i) => (
          <Card key={i} className="border-zinc-200 shadow-none">
            <CardContent className="p-6 flex space-x-4">
              <div className="p-3 bg-zinc-50 rounded-lg h-fit">
                <item.icon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold">{item.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{item.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <section className="space-y-6 text-center py-8">
        <h2 className="text-2xl font-bold">Our Technology</h2>
        <p className="text-zinc-600 leading-relaxed max-w-3xl mx-auto">
          We leverage the latest web technologies like <strong className="text-zinc-900 font-semibold">WebAssembly</strong>, <strong className="text-zinc-900 font-semibold">Canvas API</strong>, and <strong className="text-zinc-900 font-semibold">File System API</strong> to bring desktop-grade image editing to the web. By doing so, we eliminate the need for server-side processing, which means lower costs for us and 100% privacy for you.
        </p>
      </section>
    </div>
  );
}
