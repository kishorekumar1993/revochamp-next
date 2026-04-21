import type { Metadata } from "next";
import FertilityAssessment from "@/components/health/components/FertilityAssessment";

export const metadata: Metadata = {
  title: "Free Fertility Test for Couples (2-Min Assessment) | Revochamp",
  description:
    "Take a free 2-minute fertility test for couples. Get your fertility score, identify risk factors, and receive personalized tips to improve your chances of conception.",
  keywords: [
    "free fertility test",
    "fertility test online free",
    "fertility calculator for couples",
    "chances of getting pregnant tool",
    "ovulation + conception calculator",
    "fertility assessment",
    "fertility quiz",
    "female fertility",
    "male fertility",
    "TTC tool",
    "reproductive health",
    "Revochamp",
  ],
  openGraph: {
    title: "Free Fertility Test for Couples – Instant Score & Tips",
    description:
      "Answer 21 questions about your health, lifestyle, and timing. Get a personalized fertility risk report in 2 minutes.",
    url: "https://revochamp.com/tools/health/fertility-assessment",
    siteName: "Revochamp",
    images: [
      {
        url: "https://revochamp.com/tools/health/og-fertility.png",
        width: 1200,
        height: 630,
        alt: "Free Fertility Test for Couples – Revochamp",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Fertility Test for Couples (2-Min) | Revochamp",
    description:
      "Check your fertility risk level with our science‑backed questionnaire. For women and men trying to conceive.",
    images: ["https://revochamp.com/tools/health/og-fertility.png"],
  },
  alternates: {
    canonical: "https://revochamp.com/tools/health/fertility-assessment",
  },
};

export default function FertilityPage() {
  return <FertilityAssessment />;
}