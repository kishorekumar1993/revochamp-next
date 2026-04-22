// app/tools/marketing/page.tsx
import MarketingToolsHub from "@/components/marketing/tools/MarketingToolsHub";
import { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Free Digital Marketing Tools - SEO, Social Media, ROI & More | MarketTools",
  description:
    "Free online digital marketing calculators and utilities. Calculate ROI, CPC, engagement rates, analyze SEO, optimize content, and plan your marketing budget with confidence.",
  keywords: [
    "digital marketing tools",
    "ROI calculator",
    "CPC calculator",
    "SEO tools",
    "social media calculator",
    "engagement rate calculator",
    "marketing budget planner",
    "content optimizer",
    "MarketTools",
  ],
  openGraph: {
    title: "Free Digital Marketing Tools & Calculators | MarketTools",
    description:
      "Smart digital marketing tools for SEO, social media, email, and advertising. Free and easy to use.",
    url: "https://revochamp.site/tools/marketing",
    siteName: "MarketTools",
    images: [
      {
        url: "https://revochamp.site/og-marketing-tools.png",
        width: 1200,
        height: 630,
        alt: "MarketTools - Digital Marketing Calculators",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Digital Marketing Tools | MarketTools",
    description:
      "Free ROI, CPC, engagement, and SEO tools to optimize your marketing campaigns.",
    images: ["https://revochamp.site/og-marketing-tools.png"],
  },
  alternates: {
    canonical: "/tools/marketing",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "Free Digital Marketing Tools & Calculators",
  "description":
    "A collection of free online digital marketing tools including ROI, CPC, SEO, social media, and budget calculators.",
  "url": "https://revochamp.site/tools/marketing",
  "mainEntity": {
    "@type": "ItemList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "ROI Calculator",
        "url": "https://revochamp.site/tools/marketing/roi-calculator",
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "CPC Calculator",
        "url": "https://revochamp.site/tools/marketing/cpc-calculator",
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Engagement Rate Calculator",
        "url": "https://revochamp.site/tools/marketing/engagement-rate-calculator",
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": "Marketing Budget Optimizer",
        "url": "https://revochamp.site/tools/marketing/budget-optimizer",
      },
    ],
  },
};

export default function MarketingToolsPage() {
  return (
    <>
      <Script
        id="json-ld-marketing-tools"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MarketingToolsHub />
    </>
  );
}