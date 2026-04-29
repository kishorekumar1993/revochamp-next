// app/tools/meta-analyzer/page.tsx
import { Metadata } from 'next';
import Script from 'next/script';
import MetaAnalyzerClient from './MetaAnalyzerClient';

export const metadata: Metadata = {
  title: 'Meta Tag Analyzer - Check SEO & Social Meta Tags | DevTools',
  description: 'Free online meta tag analyzer. Inspect title, description, Open Graph, Twitter Cards, and more. Improve your SEO and social sharing previews.',
  keywords: 'meta tag analyzer, meta tag checker, seo meta tags, open graph checker, twitter card validator, meta inspector',
  openGraph: {
    title: 'Free Meta Tag Analyzer',
    description: 'Analyze meta tags for any website. Check SEO, Open Graph, and Twitter Card tags.',
    url: 'https://revochamp.site/tools/meta-analyzer',
    type: 'website',
  },
  alternates: {
    canonical: '/tools/meta-analyzer',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Meta Tag Analyzer',
  description: 'A free, online tool to analyze and validate meta tags for any website.',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'All',
  url: 'https://revochamp.site/tools/meta-analyzer',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

export default function MetaAnalyzerPage() {
  return (
    <>
      <Script
        id="json-ld-meta-analyzer"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MetaAnalyzerClient />
    </>
  );
}