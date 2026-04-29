// app/tools/qr-generator/page.tsx
import { Metadata } from 'next';
import Script from 'next/script';
import QrGeneratorClient from './QrGeneratorClient';

export const metadata: Metadata = {
  title: 'QR Code Generator - Create Custom QR Codes Online | DevTools',
  description: 'Free online QR code generator. Create QR codes for URLs, text, WiFi, contact info. Customize size, colors, and error correction. Download as PNG.',
  keywords: 'qr code generator, qr generator, qr code maker, create qr code, custom qr code, online qr tool',
  openGraph: {
    title: 'Free QR Code Generator',
    description: 'Generate custom QR codes for URLs, text, and more. Download as PNG, customize colors and size.',
    url: 'https://revochamp.site/tools/qr-generator',
    type: 'website',
  },
  alternates: {
    canonical: '/tools/qr-generator',
  },
};

// JSON-LD Structured Data
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'QR Code Generator',
  description: 'A free, online tool to generate custom QR codes.',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'All',
  url: 'https://revochamp.site/tools/qr-generator',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

export default function QrGeneratorPage() {
  return (
    <>
      <Script
        id="json-ld-qr-generator"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <QrGeneratorClient />
    </>
  );
}