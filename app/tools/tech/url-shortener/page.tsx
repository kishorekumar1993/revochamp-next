// app/tools/url-shortener/page.tsx
import { Metadata } from 'next';
import Script from 'next/script';
import UrlShortenerClient from './UrlShortenerClient';

export const metadata: Metadata = {
  title: 'URL Shortener - Create Short Links Online | DevTools',
  description: 'Free online URL shortener. Create short, memorable links instantly. Track clicks, copy to clipboard, and generate QR codes. Privacy‑first.',
  keywords: 'url shortener, link shortener, shorten url, short link generator, free url shortener, tinyurl alternative',
  openGraph: {
    title: 'Free URL Shortener',
    description: 'Shorten long URLs instantly. Create short links for social media, emails, or anywhere.',
    url: 'https://yourdomain.com/tools/url-shortener',
    type: 'website',
  },
  alternates: {
    canonical: '/tools/url-shortener',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'URL Shortener',
  description: 'A free, online tool to shorten long URLs into compact links.',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'All',
  url: 'https://yourdomain.com/tools/url-shortener',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

export default function UrlShortenerPage() {
  return (
    <>
      <Script
        id="json-ld-url-shortener"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <UrlShortenerClient />
    </>
  );
}