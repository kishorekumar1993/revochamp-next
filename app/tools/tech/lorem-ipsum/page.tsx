// app/tools/lorem-ipsum/page.tsx
import { Metadata } from 'next';
import Script from 'next/script';
import LoremIpsumClient from './LoremIpsumClient';

export const metadata: Metadata = {
  title: 'Lorem Ipsum Generator - Generate Placeholder Text Online | DevTools',
  description: 'Free online Lorem Ipsum generator. Create dummy text for designs and mockups. Generate paragraphs, sentences, or words. Customize count and copy instantly.',
  keywords: 'lorem ipsum generator, placeholder text, dummy text, filler text, lorem ipsum, text generator',
  openGraph: {
    title: 'Free Lorem Ipsum Generator',
    description: 'Generate Lorem Ipsum placeholder text for your designs. Customize paragraphs, sentences, or words.',
    url: 'https://yourdomain.com/tools/lorem-ipsum',
    type: 'website',
  },
  alternates: {
    canonical: '/tools/lorem-ipsum',
  },
};

// JSON-LD Structured Data
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Lorem Ipsum Generator',
  description: 'A free, online tool to generate Lorem Ipsum placeholder text.',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'All',
  url: 'https://yourdomain.com/tools/lorem-ipsum',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

export default function LoremIpsumPage() {
  return (
    <>
      <Script
        id="json-ld-lorem-ipsum"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LoremIpsumClient />
    </>
  );
}