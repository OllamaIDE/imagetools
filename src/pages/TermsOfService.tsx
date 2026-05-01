import { SEOHead } from '@/components/SEOHead';
import { SITE_CONFIG } from '@/config/site';

export default function TermsOfService() {
  return (
    <div className="max-w-3xl mx-auto py-12 space-y-8">
      <SEOHead 
        title="Terms of Service"
        description={`Terms of service for using ${SITE_CONFIG.name}.`}
        canonical="/terms"
      />
      
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Terms of Service</h1>
        <p className="text-zinc-500">Last updated: {new Date().toLocaleDateString()}</p>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">1. Acceptance of Terms</h2>
        <p className="text-zinc-600 leading-relaxed">
          By accessing or using {SITE_CONFIG.name}, you agree to be bound by these Terms of Service. If you do not agree, you may not use the service.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">2. Use of Service</h2>
        <p className="text-zinc-600 leading-relaxed">
          You may use our tools for personal or commercial purposes. You are responsible for any content you process using our tools. Since we do not store your data, we cannot recover any files for you.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">3. Disclaimer of Warranties</h2>
        <p className="text-zinc-600 leading-relaxed">
          The service is provided "as is" without any warranties. We do not guarantee that the tools will always be available or error-free.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">4. Limitation of Liability</h2>
        <p className="text-zinc-600 leading-relaxed">
          In no event shall {SITE_CONFIG.name} be liable for any damages arising out of the use or inability to use the tools.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">5. Changes to Terms</h2>
        <p className="text-zinc-600 leading-relaxed">
          We reserve the right to modify these terms at any time. Your continued use of the service constitutes acceptance of the new terms.
        </p>
      </section>
    </div>
  );
}
