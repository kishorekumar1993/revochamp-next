// app/tools/url-parser/page.tsx
import { Metadata } from 'next';
import UrlParserClient from './UrlParserClient';

export const metadata: Metadata = {
  title: 'URL Parser - Analyze and Extract URL Components Online | DevTools',
  description: 'Free online URL parser to break down any URL into protocol, hostname, port, path, query parameters, and hash. Understand URL structure instantly.',
  keywords: 'url parser, url analyzer, parse url, extract url components, query string parser, url decoder, online url tool',
  openGraph: {
    title: 'Free URL Parser & Analyzer',
    description: 'Break down any URL into its components: protocol, host, path, query params, and hash. Fast and privacy-first.',
    url: 'https://revochamp.site/tools/url-parser',
    type: 'website',
  },
  alternates: {
    canonical: '/tools/url-parser',
  },
};

// JSON-LD Structured Data
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'URL Parser',
  description: 'A free, online tool to parse and analyze URL components.',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'All',
  url: 'https://revochamp.site/tools/url-parser',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

export default function UrlParserPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <UrlParserClient />
    </>
  );
}