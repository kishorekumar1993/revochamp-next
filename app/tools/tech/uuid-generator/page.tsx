// app/tools/uuid-generator/page.tsx
import { Metadata } from 'next';
import UuidGeneratorClient from './UuidGeneratorClient';

export const metadata: Metadata = {
  title: 'UUID Generator - Generate Unique Identifiers Online | DevTools',
  description: 'Free online UUID generator. Create random UUID v4 identifiers. Batch generate, copy, and download. Privacy‑first, all generated in your browser.',
  keywords: 'uuid generator, guid generator, uuid v4, unique identifier, random uuid, generate uuid, online uuid tool',
  openGraph: {
    title: 'Free UUID Generator',
    description: 'Generate random UUID v4 identifiers. Supports batch generation, formatting options, and copy to clipboard.',
    url: 'https://revochamp.site/tools/uuid-generator',
    type: 'website',
  },
  alternates: {
    canonical: '/tools/uuid-generator',
  },
};

// JSON-LD Structured Data
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'UUID Generator',
  description: 'A free, online tool to generate random UUID v4 identifiers.',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'All',
  url: 'https://revochamp.site/tools/uuid-generator',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

export default function UuidGeneratorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <UuidGeneratorClient />
    </>
  );
}