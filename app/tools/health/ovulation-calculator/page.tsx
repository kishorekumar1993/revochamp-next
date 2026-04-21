// app/ovulation-calculator/page.tsx
import OvulationCalculator from "@/components/health/ovulation/OvulationCalculator";
import { Metadata } from "next";
// import OvulationCalculator from "@/components/health/ovulation/OvulationCalculator";

export const metadata: Metadata = {
  title: "Ovulation Calculator & Fertility Tracker | Revochamp",
  description:
    "Track your cycle, predict ovulation, and identify fertile windows with our advanced ovulation calculator. Get daily probability charts, multi‑cycle forecasts, and personalized TTC insights.",
  keywords: [
    "ovulation calculator",
    "fertility tracker",
    "period tracker",
    "ovulation predictor",
    "fertile window",
    "TTC",
    "conception calculator",
    "menstrual cycle",
    "Revochamp",
  ],
  openGraph: {
    title: "Ovulation & Fertility Calculator | Revochamp",
    description:
      "Accurately predict ovulation and fertile days. Get cycle predictions, probability charts, and expert tips to boost your chances of conception.",
    url: "https://revochamp.site/ovulation-calculator",
    siteName: "Revochamp",
    images: [
      {
        url: "https://revochamp.site/og-ovulation.png",
        width: 1200,
        height: 630,
        alt: "Revochamp Ovulation Calculator",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ovulation & Fertility Calculator | Revochamp",
    description:
      "Track ovulation, fertile windows, and cycle predictions. Free, accurate, and private.",
    images: ["https://revochamp.site/og-ovulation.png"],
  },
};

export default function OvulationPage() {
  return <OvulationCalculator />;
}