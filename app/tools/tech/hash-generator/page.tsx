// app/tools/hash-generator/page.tsx
import { Metadata } from 'next';
import Script from 'next/script';
import HashGeneratorClient from './HashGeneratorClient';

export const metadata: Metadata = {
  title: 'Hash Generator - MD5, SHA-1, SHA-256, SHA-512 Online | DevTools',
  description: 'Free online hash generator. Create MD5, SHA-1, SHA-256, SHA-384, SHA-512 hashes from text or files. Fast, secure, and privacy‑first.',
  keywords: 'hash generator, md5 generator, sha1 generator, sha256 generator, sha512 generator, file hash, online hash tool',
  openGraph: {
    title: 'Free Hash Generator',
    description: 'Generate MD5, SHA-1, SHA-256, SHA-384, SHA-512 hashes from text or files. 100% client‑side.',
    url: 'https://revochamp.site/tools/hash-generator',
    type: 'website',
  },
  alternates: {
    canonical: '/tools/hash-generator',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Hash Generator',
  description: 'A free, online tool to generate cryptographic hashes using MD5, SHA-1, SHA-256, SHA-384, and SHA-512 algorithms.',
  applicationCategory: 'SecurityApplication',
  operatingSystem: 'All',
  url: 'https://revochamp.site/tools/hash-generator',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

export default function HashGeneratorPage() {
  return (
    <>
      <Script
        id="json-ld-hash-generator"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HashGeneratorClient />
    </>
  );
}