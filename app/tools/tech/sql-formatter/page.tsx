// app/tools/sql-formatter/page.tsx
import { Metadata } from 'next';
import Script from 'next/script';
import SqlFormatterClient from './SqlFormatterClient';

export const metadata: Metadata = {
  title: 'SQL Formatter - Beautify & Format SQL Queries Online | DevTools',
  description: 'Free online SQL formatter. Beautify, format, and minify SQL queries. Support for multiple SQL dialects (MySQL, PostgreSQL, SQLite). Copy, clear, and sample queries.',
  keywords: 'sql formatter, sql beautifier, format sql, sql prettier, sql minifier, online sql tool',
  openGraph: {
    title: 'Free SQL Formatter & Beautifier',
    description: 'Format and beautify SQL queries instantly. Supports MySQL, PostgreSQL, SQLite. Copy, clear, and sample queries.',
    url: 'https://revochamp.site/tools/sql-formatter',
    type: 'website',
  },
  alternates: {
    canonical: '/tools/sql-formatter',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'SQL Formatter',
  description: 'A free, online tool to format and beautify SQL queries.',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'All',
  url: 'https://revochamp.site/tools/sql-formatter',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

export default function SqlFormatterPage() {
  return (
    <>
      <Script
        id="json-ld-sql-formatter"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SqlFormatterClient />
    </>
  );
}