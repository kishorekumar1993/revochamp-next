import { Metadata } from "next";
import Script from "next/script";
import KeywordDensityChecker from "./KeywordDensityChecker";

export const metadata: Metadata = {
  title: "Free Keyword Density Checker – Analyze SEO Keyword Frequency | MarketTools",
  description:
    "Check keyword density in your content. Analyze word frequency, avoid keyword stuffing, and optimize for SEO. Free online tool for writers and marketers.",
  keywords: [
    "keyword density checker",
    "keyword frequency analyzer",
    "SEO keyword tool",
    "keyword density calculator",
    "content optimizer",
    "word frequency counter",
    "avoid keyword stuffing",
    "MarketTools",
  ],
  openGraph: {
    title: "Keyword Density Checker | MarketTools",
    description:
      "Analyze keyword frequency and density in your text. Optimize your content for SEO without keyword stuffing.",
    url: "https://revochamp.site/tools/marketing/keyword-density",
    siteName: "MarketTools",
    images: [
      {
        url: "https://revochamp.site/og-keyword-density.png",
        width: 1200,
        height: 630,
        alt: "Keyword Density Checker Tool",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Keyword Density Checker | MarketTools",
    description:
      "Free online tool to check keyword density and frequency in your content.",
    images: ["https://revochamp.site/og-keyword-density.png"],
  },
  alternates: {
    canonical: "/tools/marketing/keyword-density",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Keyword Density Checker",
  "description":
    "Analyze the frequency and density of keywords in your text to optimize SEO content and avoid keyword stuffing.",
  "url": "https://revochamp.site/tools/marketing/keyword-density",
  "applicationCategory": "UtilityApplication",
  "operatingSystem": "All",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
  },
  "creator": {
    "@type": "Organization",
    "name": "MarketTools",
  },
};

export default function KeywordDensityPage() {
  return (
    <>
      <Script
        id="json-ld-keyword-density"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <KeywordDensityChecker />
    </>
  );
}