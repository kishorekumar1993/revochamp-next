// app/tools/finance/rd-calculator/page.tsx
import { Metadata } from 'next';
import Script from 'next/script';
import RdCalculatorClient from './RdCalculatorClient';


export const metadata: Metadata = {
  title: 'RD Calculator - Calculate Recurring Deposit Returns Online | FinTools',
  description: 'Free online Recurring Deposit (RD) calculator. Calculate maturity amount, total investment, and interest earned. Supports monthly, quarterly, half-yearly, and yearly compounding.',
  keywords: 'RD calculator, recurring deposit calculator, rd returns calculator, monthly deposit calculator, rd maturity calculator, bank rd calculator',
  openGraph: {
    title: 'Free RD Calculator - Calculate Recurring Deposit Returns',
    description: 'Calculate your Recurring Deposit maturity amount and interest earned. Supports monthly, quarterly, half-yearly, and yearly compounding.',
    url: 'https://revochamp.site/tools/finance/rd-calculator',
    type: 'website',
  },
  alternates: {
    canonical: '/tools/finance/rd-calculator',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'RD Calculator',
  description: 'A free online tool to calculate Recurring Deposit returns and maturity amount.',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'All',
  url: 'https://revochamp.site/tools/finance/rd-calculator',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

export default function RdCalculatorPage() {
  return (
    <>
      <Script
        id="json-ld-rd-calculator"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <RdCalculatorClient />
    </>
  );
}