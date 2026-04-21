// app/tools/ip-lookup/page.tsx
import { Metadata } from 'next';
import Script from 'next/script';
import IpLookupClient from './IpLookupClient';

export const metadata: Metadata = {
  title: 'IP Lookup - Find IP Location, ISP & More | DevTools',
  description: 'Free online IP lookup tool. Get detailed information about any IP address including location, ISP, timezone, and ASN. Check your own IP or any public IP.',
  keywords: 'ip lookup, ip location, ip address lookup, ip geolocation, ip info, what is my ip, ip checker',
  openGraph: {
    title: 'Free IP Lookup & Geolocation',
    description: 'Find detailed information about any IP address. Location, ISP, timezone, and more.',
    url: 'https://yourdomain.com/tools/ip-lookup',
    type: 'website',
  },
  alternates: {
    canonical: '/tools/ip-lookup',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'IP Lookup',
  description: 'A free, online tool to lookup geolocation and information for any IP address.',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'All',
  url: 'https://yourdomain.com/tools/ip-lookup',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

export default function IpLookupPage() {
  return (
    <>
      <Script
        id="json-ld-ip-lookup"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <IpLookupClient />
    </>
  );
}