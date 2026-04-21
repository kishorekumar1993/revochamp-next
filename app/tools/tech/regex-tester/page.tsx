// app/tools/regex-tester/page.tsx
import { Metadata } from 'next';
import RegexTesterClient from './RegexTesterClient';

export const metadata: Metadata = {
  title: 'Regex Tester - Test Regular Expressions Online | DevTools',
  description: 'Free online regex tester to build and test regular expressions. Real‑time matching, flag support, match highlighting, and group extraction. Privacy‑first, all in your browser.',
  keywords: 'regex tester, regex tool, regular expression tester, regex online, regex matcher, regex flags, regex debugger',
  openGraph: {
    title: 'Free Regex Tester & Debugger',
    description: 'Test regular expressions in real time. Highlight matches, extract groups, and debug patterns instantly.',
    url: 'https://yourdomain.com/tools/regex-tester',
    type: 'website',
  },
  alternates: {
    canonical: '/tools/regex-tester',
  },
};

// JSON-LD Structured Data
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Regex Tester',
  description: 'A free, online tool to test and debug regular expressions.',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'All',
  url: 'https://yourdomain.com/tools/regex-tester',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

export default function RegexTesterPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <RegexTesterClient />
    </>
  );
}