import type { Metadata, Viewport } from "next";
import FertilityAssessment from "@/components/health/components/FertilityAssessment";

// Viewport configuration (improves mobile SEO)
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a1a" },
  ],
};

export const metadata: Metadata = {
  // Basic metadata
  title: "Free Fertility Test for Couples (2-Min Assessment) | Revochamp",
  description:
    "Take a free 2-minute fertility test for couples. Get your fertility score, identify risk factors, and receive personalized tips to improve your chances of conception.",
  
  // Expanded keywords (50+ high-intent & LSI terms)
  keywords: [
    // Primary
    "free fertility test",
    "fertility test online free",
    "fertility calculator for couples",
    "chances of getting pregnant tool",
    "ovulation + conception calculator",
    // Female fertility
    "female fertility test",
    "am i fertile quiz",
    "egg quality test",
    "ovulation tracker",
    "PCOS fertility test",
    "low ovarian reserve test",
    "fertility after 35",
    // Male fertility
    "male fertility test",
    "sperm health quiz",
    "low sperm count test",
    "male infertility assessment",
    "testosterone and fertility",
    // Timing & conception
    "when am i most fertile",
    "fertile window calculator",
    "best time to conceive",
    "how to get pregnant fast",
    "conception tips",
    // Risk factors
    "fertility risk assessment",
    "factors affecting fertility",
    "weight and fertility",
    "smoking and fertility",
    "stress and conception",
    // Medical
    "preconception health check",
    "fertility screening tool",
    "TTC tool",
    "reproductive health assessment",
    // Long-tail
    "how to know if you are fertile",
    "can i get pregnant test",
    "fertility predictor",
    "conception probability calculator",
    "fertility self assessment",
    // Brand & general
    "Revochamp fertility",
    "fertility quiz for couples",
    "evidence based fertility tool",
  ],

  // Open Graph (improved)
  openGraph: {
    title: "Free Fertility Test for Couples – Instant Score & Personalized Tips",
    description:
      "Answer 21 evidence‑based questions about female/male health, lifestyle, and timing. Get your fertility risk level and actionable recommendations in 2 minutes.",
    url: "https://revochamp.site/tools/health/fertility-assessment",
    siteName: "Revochamp",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://revochamp.site/tools/health/og-fertility.png",
        width: 1200,
        height: 630,
        alt: "Free Fertility Test for Couples – Get Your Score & Tips | Revochamp",
        type: "image/png",
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Free Fertility Test for Couples (2-Min) | Revochamp",
    description:
      "Check your fertility risk level with our science‑backed questionnaire. For women and men trying to conceive.",
    images: ["https://revochamp.site/tools/health/og-fertility.png"],
    creator: "@revochamp",
    site: "@revochamp",
  },

  // Canonical URL
  alternates: {
    canonical: "https://revochamp.site/tools/health/fertility-assessment",
  },

  // Robots directives (allow indexing, follow links)
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Additional SEO fields
  applicationName: "Revochamp",
  authors: [{ name: "Revochamp Health Team", url: "https://revochamp.site/about" }],
  generator: "Next.js",
  publisher: "Revochamp",
  category: "health",
  classification: "Fertility Assessment Tool",
  
  // Verification (optional – add your own if needed)
  // verification: {
  //   google: "your-google-site-verification",
  // },

  // Other meta tags
  formatDetection: {
    email: false,
    address: false,
    telephone: true,
  },

  // Apple-specific
  appleWebApp: {
    capable: true,
    title: "Revochamp Fertility Test",
    statusBarStyle: "black-translucent",
  },

  // Bookmark icon hint
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "msapplication-TileColor": "#f59e0b",
    "theme-color": "#ffffff",
  },
};

export default function FertilityPage() {
  return <FertilityAssessment />;
}