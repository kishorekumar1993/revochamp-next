// app/tools/csv-to-json/page.tsx
import { Metadata } from 'next';
import CsvToJsonClient from './CsvToJsonClient';


export const metadata: Metadata = {
  title: 'CSV to JSON Converter - Convert CSV Data to JSON Online | DevTools',
  description: 'Free online CSV to JSON converter. Convert comma-separated values to JSON format. Auto-detect delimiter, support header rows, pretty print, and copy output.',
  keywords: 'csv to json, convert csv to json, csv parser, json converter, csv to json online, delimiter converter',
  openGraph: {
    title: 'Free CSV to JSON Converter',
    description: 'Convert CSV data to JSON format instantly. Supports custom delimiters, header rows, and pretty printing.',
    url: 'https://yourdomain.com/tools/csv-to-json',
    type: 'website',
  },
  alternates: {
    canonical: '/tools/csv-to-json',
  },
};

// JSON-LD Structured Data
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'CSV to JSON Converter',
  description: 'A free, online tool to convert CSV data to JSON format.',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'All',
  url: 'https://yourdomain.com/tools/csv-to-json',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

export default function CsvToJsonPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CsvToJsonClient />
    </>
  );
}