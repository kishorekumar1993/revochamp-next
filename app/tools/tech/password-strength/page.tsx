// app/tools/password-strength/page.tsx
import { Metadata } from 'next';
import Script from 'next/script';
import PasswordStrengthClient from './PasswordStrengthClient';

export const metadata: Metadata = {
  title: 'Password Strength Meter - Check Password Security Online | DevTools',
  description: 'Free online password strength checker. Analyze password complexity, entropy, and estimated crack time. Get real-time feedback to create stronger passwords.',
  keywords: 'password strength meter, password checker, password security, password strength test, strong password checker, online password tool',
  openGraph: {
    title: 'Free Password Strength Meter',
    description: 'Check how strong your password is. Real-time analysis with entropy calculation and crack time estimation.',
    url: 'https://revochamp.site/tools/password-strength',
    type: 'website',
  },
  alternates: {
    canonical: '/tools/password-strength',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Password Strength Meter',
  description: 'A free, online tool to check password strength and security.',
  applicationCategory: 'SecurityApplication',
  operatingSystem: 'All',
  url: 'https://revochamp.site/tools/password-strength',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

export default function PasswordStrengthPage() {
  return (
    <>
      <Script
        id="json-ld-password-strength"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PasswordStrengthClient />
    </>
  );
}