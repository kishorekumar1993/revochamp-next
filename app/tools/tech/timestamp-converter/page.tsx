// app/tools/timestamp-converter/page.tsx
import { Metadata } from 'next';
import TimestampConverterClient from './TimestampConverterClient';

export const metadata: Metadata = {
  title: 'Unix Timestamp Converter - Epoch to Date & Date to Epoch | DevTools',
  description: 'Free online Unix timestamp converter. Convert epoch time to human-readable date and vice versa. Supports seconds, milliseconds, timezones, and current timestamp.',
  keywords: 'unix timestamp converter, epoch converter, timestamp to date, date to timestamp, unix time, epoch time, timezone converter',
  openGraph: {
    title: 'Free Unix Timestamp Converter',
    description: 'Convert Unix timestamps to dates and dates to timestamps. Supports seconds, milliseconds, and timezone selection.',
    url: 'https://yourdomain.com/tools/timestamp-converter',
    type: 'website',
  },
  alternates: {
    canonical: '/tools/timestamp-converter',
  },
};

// JSON-LD Structured Data
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Unix Timestamp Converter',
  description: 'A free, online tool to convert between Unix timestamps and human-readable dates.',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'All',
  url: 'https://yourdomain.com/tools/timestamp-converter',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

export default function TimestampConverterPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TimestampConverterClient />
    </>
  );
}