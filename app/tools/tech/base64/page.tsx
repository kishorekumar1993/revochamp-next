// app/tools/base64/page.tsx
import { Metadata } from 'next';
import Base64Client from './Base64Client';


export const metadata: Metadata = {
  title: 'Base64 Encoder & Decoder - Convert Text to Base64 Online | DevTools',
  description: 'Free online Base64 encoder and decoder. Convert text to Base64 or decode Base64 to plain text. Supports Unicode characters, copy to clipboard, and sample data.',
  keywords: 'base64 encoder, base64 decoder, base64 converter, text to base64, base64 to text, online base64 tool, base64 encode decode',
  openGraph: {
    title: 'Free Base64 Encoder & Decoder',
    description: 'Encode plain text to Base64 or decode Base64 strings instantly. A fast, privacy-first tool for developers.',
    url: 'https://revochamp.site/tools/base64',
    type: 'website',
  },
  alternates: {
    canonical: '/tools/base64',
  },
};

// JSON-LD Structured Data
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Base64 Encoder & Decoder',
  description: 'A free, online tool to encode text to Base64 and decode Base64 back to plain text.',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'All',
  url: 'https://revochamp.site/tools/base64',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

export default function Base64Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Base64Client />
    </>
  );
}