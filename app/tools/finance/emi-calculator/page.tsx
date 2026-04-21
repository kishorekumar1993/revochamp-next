// app/tools/finance/emi-calculator/page.tsx
import { Metadata } from 'next';
import Script from 'next/script';
import EmiCalculatorClient from './EmiCalculatorClient';

export const metadata: Metadata = {
  title: 'EMI Calculator - Calculate Monthly Loan EMI Online | FinTools',
  description: 'Free online EMI calculator. Calculate monthly EMI for home loan, car loan, personal loan. See total interest, amortization schedule, and pie chart breakdown.',
  keywords: 'EMI calculator, loan EMI calculator, home loan EMI, car loan EMI, personal loan EMI, monthly payment calculator, loan repayment calculator',
  openGraph: {
    title: 'Free EMI Calculator - Calculate Loan EMI Instantly',
    description: 'Calculate your monthly loan EMI, total interest, and view complete amortization schedule. Supports home, car, and personal loans.',
    url: 'https://revochamp.com/tools/finance/emi-calculator',
    type: 'website',
  },
  alternates: {
    canonical: '/tools/finance/emi-calculator',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'EMI Calculator',
  description: 'A free online tool to calculate monthly EMI for loans.',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'All',
  url: 'https://revochamp.com/tools/finance/emi-calculator',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

export default function EmiCalculatorPage() {
  return (
    <>
      <Script
        id="json-ld-emi-calculator"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <EmiCalculatorClient />
    </>
  );
}