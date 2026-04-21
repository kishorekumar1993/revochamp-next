import HydrationCalculator from "@/components/health/hydration/HydrationCalculator";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daily Water Intake Calculator | Revochamp",
  description:
    "Calculate your optimal daily water intake based on weight, age, activity level, and climate. Stay hydrated with personalized recommendations and tips.",
  keywords: [
    "water intake calculator",
    "hydration calculator",
    "daily water requirement",
    "how much water to drink",
    "hydration tips",
    "water tracker",
    "Revochamp",
  ],
  openGraph: {
    title: "Daily Water Intake Calculator | Revochamp",
    description:
      "Find out exactly how much water you need each day. Personalized hydration calculator with workout and pregnancy adjustments.",
    url: "https://revochamp.com/hydration-calculator",
    siteName: "Revochamp",
    images: [
      {
        url: "https://revochamp.com/og-hydration.png",
        width: 1200,
        height: 630,
        alt: "Revochamp Hydration Calculator",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Daily Water Intake Calculator | Revochamp",
    description:
      "Calculate your optimal water intake in seconds. Stay healthy and hydrated.",
    images: ["https://revochamp.com/og-hydration.png"],
  },
};

export default function HydrationPage() {
  return <HydrationCalculator />;
}