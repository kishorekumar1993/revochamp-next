// app/tools/finance/fd-calculator/page.tsx
import { Metadata } from 'next';
import Script from 'next/script';
import FdCalculatorClient from './FdCalculatorClient';

export const metadata: Metadata = {
  title: 'FD Calculator - Calculate Fixed Deposit Returns Online | FinTools',
  description: 'Free online Fixed Deposit (FD) calculator. Calculate maturity amount, interest earned, and compare different compounding frequencies. Plan your savings better.',
  keywords: 'FD calculator, fixed deposit calculator, fd returns calculator, maturity amount calculator, compound interest calculator, bank fd calculator',
  openGraph: {
    title: 'Free FD Calculator - Calculate Fixed Deposit Returns',
    description: 'Calculate your Fixed Deposit maturity amount and interest earned. Supports monthly, quarterly, half-yearly, and yearly compounding.',
    url: 'https://revochamp.com/tools/finance/fd-calculator',
    type: 'website',
  },
  alternates: {
    canonical: '/tools/finance/fd-calculator',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'FD Calculator',
  description: 'A free online tool to calculate Fixed Deposit returns and maturity amount.',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'All',
  url: 'https://revochamp.com/tools/finance/fd-calculator',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

export default function FdCalculatorPage() {
  return (
    <>
      <Script
        id="json-ld-fd-calculator"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <FdCalculatorClient />
    </>
  );
}