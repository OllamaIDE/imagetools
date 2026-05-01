import { SEOHead } from '@/components/SEOHead';
import { SITE_CONFIG } from '@/config/site';

export default function PrivacyPolicy() {
  return (
    <div className="max-w-3xl mx-auto py-12 space-y-8">
      <SEOHead 
        title="Privacy Policy"
        description={`Privacy policy for ${SITE_CONFIG.name}. Learn how we handle your data.`}
        canonical="/privacy"
      />
      
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Privacy Policy</h1>
        <p className="text-zinc-500">Last updated: {new Date().toLocaleDateString()}</p>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">1. 100% Client-Side Processing</h2>
        <p className="text-zinc-600 leading-relaxed">
          At {SITE_CONFIG.name}, your privacy is our top priority. Unlike other online image tools, we process all images locally in your browser. Your images are never uploaded to our servers, and we never have access to your data.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">2. Data Collection</h2>
        <p className="text-zinc-600 leading-relaxed">
          We do not collect any personal information or image data. Since everything runs on your computer (client-side), we don't have a database to store your files.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">3. Cookies and Analytics</h2>
        <p className="text-zinc-600 leading-relaxed">
          We use minimal cookies for site functionality and basic analytics to understand how many people use our tools. We do not use tracking cookies for advertising purposes.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">4. Advertisements</h2>
        <p className="text-zinc-600 leading-relaxed">
          We display advertisements to keep this service free. Our ad partners may collect non-personal information about your visit to show relevant ads.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">5. Contact Us</h2>
        <p className="text-zinc-600 leading-relaxed">
          If you have any questions about this Privacy Policy, please contact us at {SITE_CONFIG.contactEmail}.
        </p>
      </section>
    </div>
  );
}
