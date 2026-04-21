import type { Metadata } from "next";
import FertilityAssessment from "@/components/health/components/FertilityAssessment";

export const metadata: Metadata = {
  title: "Fertility Health Assessment | Revochamp",
  description:
    "Take our free interactive fertility assessment for both partners. Get personalized insights into potential fertility factors and evidence‑based recommendations.",
  keywords: [
    "fertility assessment",
    "fertility quiz",
    "female fertility",
    "male fertility",
    "conception help",
    "ovulation tracking",
    "fertility risk factors",
    "TTC tool",
    "reproductive health",
    "Revochamp",
  ],
  openGraph: {
    title: "Fertility Health Assessment | Revochamp",
    description:
      "Discover your fertility risk level with our comprehensive, science‑backed questionnaire. For women and men trying to conceive.",
    url: "https://revochamp.com/health/fertility-assessment",
    siteName: "Revochamp",
    images: [
      {
        url: "https://revochamp.com/health/og-fertility.png",
        width: 1200,
        height: 630,
        alt: "Revochamp Fertility Assessment",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fertility Health Assessment | Revochamp",
    description:
      "Interactive fertility quiz for couples – get personalized recommendations in 5 minutes.",
    images: ["https://revochamp.com/health/og-fertility.png"],
  },
};

export default function FertilityPage() {
  return <FertilityAssessment />;
}