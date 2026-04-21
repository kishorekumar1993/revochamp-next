// app/tools/finance/page.tsx
import FinanceToolsHub from "@/components/finance/tools/FinanceToolsHub";
import { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Free Financial Calculators - EMI, SIP, Insurance, Tax | FinTools",
  description:
    "Free online financial calculators. Calculate EMI, SIP returns, insurance premiums, income tax, GST, and more. Plan your finances with confidence.",
  keywords: [
    "financial calculators",
    "EMI calculator",
    "SIP calculator",
    "insurance calculator",
    "tax calculator",
    "loan calculator",
    "FD calculator",
    "mutual fund calculator",
    "FinTools",
  ],
  openGraph: {
    title: "Free Financial Calculators & Tools | FinTools",
    description:
      "Smart financial planning tools for banking, insurance, mutual funds, and loans. Free and easy to use.",
    url: "https://revochamp.site/tools/finance",
    siteName: "FinTools",
    images: [
      {
        url: "https://revochamp.site/og-finance-tools.png",
        width: 1200,
        height: 630,
        alt: "FinTools - Financial Calculators",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Financial Calculators | FinTools",
    description:
      "Free EMI, SIP, insurance, and tax calculators to plan your finances better.",
    images: ["https://revochamp.site/og-finance-tools.png"],
  },
  alternates: {
    canonical: "/tools/finance",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "Free Financial Calculators & Tools",
  "description":
    "A collection of free online financial calculators including EMI, SIP, insurance, tax, and loan calculators.",
  "url": "https://revochamp.site/tools/finance",
  "mainEntity": {
    "@type": "ItemList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "EMI Calculator",
        "url": "https://revochamp.site/tools/finance/emi-calculator",
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "SIP Calculator",
        "url": "https://revochamp.site/tools/finance/sip-calculator",
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Income Tax Calculator",
        "url": "https://revochamp.site/tools/finance/income-tax-calculator",
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": "Home Loan Calculator",
        "url": "https://revochamp.site/tools/finance/home-loan-calculator",
      },
    ],
  },
};

export default function FinanceToolsPage() {
  return (
    <>
      <Script
        id="json-ld-finance-tools"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <FinanceToolsHub />
    </>
  );
}