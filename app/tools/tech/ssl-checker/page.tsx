// app/tools/ssl-checker/page.tsx
import { Metadata } from 'next';
import Script from 'next/script';
import SslCheckerClient from './SslCheckerClient';

export const metadata: Metadata = {
  title: 'SSL Certificate Checker - Verify SSL/TLS Certificates Online | DevTools',
  description: 'Free online SSL checker. Verify SSL/TLS certificates, check expiration dates, issuer details, and Subject Alternative Names. Ensure your website is secure.',
  keywords: 'ssl checker, ssl certificate checker, tls checker, ssl validator, certificate expiration, ssl test, ssl tools',
  openGraph: {
    title: 'Free SSL Certificate Checker',
    description: 'Verify SSL/TLS certificates for any domain. Check expiration, issuer, SANs, and more.',
    url: 'https://revochamp.site/tools/ssl-checker',
    type: 'website',
  },
  alternates: {
    canonical: '/tools/ssl-checker',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'SSL Certificate Checker',
  description: 'A free, online tool to verify SSL/TLS certificates for any domain.',
  applicationCategory: 'SecurityApplication',
  operatingSystem: 'All',
  url: 'https://revochamp.site/tools/ssl-checker',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

export default function SslCheckerPage() {
  return (
    <>
      <Script
        id="json-ld-ssl-checker"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SslCheckerClient />
    </>
  );
}