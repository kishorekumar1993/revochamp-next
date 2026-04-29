// app/tools/json-formatter/page.tsx
import { Metadata } from 'next';
import JsonFormatterClient from './JsonFormatterClient';
export const metadata: Metadata = {
  title: 'JSON Formatter & Validator - Beautify, Minify, Validate | DevTools',
  description: 'Free online JSON formatter to beautify, minify, and validate JSON data. Fix syntax errors, improve readability, and format code for debugging.',
  keywords: 'json formatter, json validator, json beautifier, json minifier, online json tool, json parser, json lint',
  openGraph: {
    title: 'Free JSON Formatter & Validator',
    description: 'Beautify, minify, and validate JSON data instantly. A fast, privacy-first tool for developers.',
    url: 'https://revochamp.site/tools/json-formatter',
    type: 'website',
  },
  alternates: {
    canonical: '/tools/json-formatter',
  },
};

// JSON-LD Structured Data for better SEO
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'JSON Formatter',
  description: 'A free, online tool to format, beautify, minify, and validate JSON data.',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'All',
  url: 'https://revochamp.site/tools/json-formatter',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

export default function JsonFormatterPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <JsonFormatterClient />
    </>
  );
}
