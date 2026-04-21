import TeethingCalculator from "@/components/health/teething/TeethingCalculator";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Baby Teething Calculator | Predict Teething Stages | Revochamp",
  description:
    "Enter your baby's age to see which teeth are coming in and get soothing tips. Understand teething timelines and care recommendations.",
  keywords: [
    "teething calculator",
    "baby teething stages",
    "teething timeline",
    "baby teeth eruption",
    "teething symptoms",
    "soothe teething baby",
    "Revochamp",
  ],
  openGraph: {
    title: "Baby Teething Calculator | Revochamp",
    description:
      "Find out what to expect during your baby's teething journey. Age-based stages with care tips for each phase.",
    url: "https://revochamp.site/teething-calculator",
    siteName: "Revochamp",
    images: [
      {
        url: "https://revochamp.site/og-teething.png",
        width: 1200,
        height: 630,
        alt: "Revochamp Teething Calculator",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Baby Teething Calculator | Revochamp",
    description:
      "Predict teething stages and get soothing tips. Free tool for parents.",
    images: ["https://revochamp.site/og-teething.png"],
  },
};

export default function TeethingPage() {
  return <TeethingCalculator />;
}