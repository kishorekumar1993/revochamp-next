// app/tools/password-generator/page.tsx
import { Metadata } from 'next';
import PasswordGeneratorClient from './PasswordGeneratorClient';

export const metadata: Metadata = {
  title: 'Password Generator - Create Strong Random Passwords | DevTools',
  description: 'Free online password generator. Create secure, random passwords with customizable length and character sets. Includes strength meter and privacy-first generation.',
  keywords: 'password generator, strong password, random password, secure password, password creator, online password tool',
  openGraph: {
    title: 'Free Strong Password Generator',
    description: 'Generate secure random passwords. Customize length, include numbers, symbols, and check strength instantly.',
    url: 'https://revochamp.site/tools/password-generator',
    type: 'website',
  },
  alternates: {
    canonical: '/tools/password-generator',
  },
};

// JSON-LD Structured Data
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Password Generator',
  description: 'A free, online tool to generate strong, random passwords.',
  applicationCategory: 'SecurityApplication',
  operatingSystem: 'All',
  url: 'https://revochamp.site/tools/password-generator',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

export default function PasswordGeneratorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PasswordGeneratorClient />
    </>
  );
}