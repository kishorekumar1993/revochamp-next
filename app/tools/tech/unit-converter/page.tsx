// app/tools/unit-converter/page.tsx
import { Metadata } from 'next';
import UnitConverterClient from './UnitConverterClient';


export const metadata: Metadata = {
  title: 'Unit Converter - Length, Mass, Temperature, Volume & More | DevTools',
  description: 'Free online unit converter for length, mass, temperature, volume, area, speed, time, and digital storage. Real‑time conversion with support for metric and imperial units.',
  keywords: 'unit converter, length converter, weight converter, temperature converter, volume converter, metric converter, imperial converter, online conversion tool',
  openGraph: {
    title: 'Free Unit Converter',
    description: 'Convert between metric and imperial units for length, mass, temperature, volume, and more. Fast, accurate, and privacy‑first.',
    url: 'https://yourdomain.com/tools/unit-converter',
    type: 'website',
  },
  alternates: {
    canonical: '/tools/unit-converter',
  },
};

// JSON-LD Structured Data
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Unit Converter',
  description: 'A free, online tool to convert between various units of measurement.',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'All',
  url: 'https://yourdomain.com/tools/unit-converter',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

export default function UnitConverterPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <UnitConverterClient />
    </>
  );
}