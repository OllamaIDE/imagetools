import { Helmet } from 'react-helmet-async'
import { SITE_CONFIG } from '@/config/site'

interface SEOHeadProps {
  title?: string
  description?: string
  keywords?: string
  canonical?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  schemaType?: 'WebApplication' | 'WebPage'
}

export function SEOHead({
  title,
  description,
  keywords,
  canonical,
  ogTitle,
  ogDescription,
  ogImage,
  schemaType = 'WebApplication'
}: SEOHeadProps) {
  const siteTitle = title ? `${title} | ${SITE_CONFIG.name}` : SITE_CONFIG.name;
  const siteDescription = description || SITE_CONFIG.description;
  const siteCanonical = canonical ? (canonical.startsWith('http') ? canonical : `${SITE_CONFIG.url}${canonical}`) : SITE_CONFIG.url;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": schemaType,
    "name": title || SITE_CONFIG.name,
    "description": siteDescription,
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  }

  return (
    <Helmet>
      <title>{siteTitle}</title>
      <meta name="description" content={siteDescription} />
      <meta name="keywords" content={keywords || ""} />
      <link rel="canonical" href={siteCanonical} />
      
      <meta property="og:title" content={ogTitle || siteTitle} />
      <meta property="og:description" content={ogDescription || siteDescription} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      <meta property="og:type" content="website" />

      <script type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </script>
    </Helmet>
  )
}
