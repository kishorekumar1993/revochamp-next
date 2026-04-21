// app/tools/jwt-debugger/page.tsx
import { Metadata } from 'next';
import JwtDebuggerClient from './JwtDebuggerClient';

export const metadata: Metadata = {
  title: 'JWT Debugger - Decode and Inspect JSON Web Tokens Online | DevTools',
  description: 'Free online JWT debugger to decode and inspect JSON Web Tokens. View header, payload, signature, and validate expiration. Privacy-first, all processing done in your browser.',
  keywords: 'jwt debugger, jwt decoder, jwt inspector, decode jwt, json web token debugger, jwt parser, online jwt tool',
  openGraph: {
    title: 'Free JWT Debugger & Decoder',
    description: 'Decode and inspect JWT tokens instantly. View header, payload, signature, and validate timestamps. 100% client-side.',
    url: 'https://yourdomain.com/tools/jwt-debugger',
    type: 'website',
  },
  alternates: {
    canonical: '/tools/jwt-debugger',
  },
};

// JSON-LD Structured Data
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'JWT Debugger',
  description: 'A free, online tool to decode and inspect JSON Web Tokens (JWT).',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'All',
  url: 'https://yourdomain.com/tools/jwt-debugger',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

export default function JwtDebuggerPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <JwtDebuggerClient />
    </>
  );
}