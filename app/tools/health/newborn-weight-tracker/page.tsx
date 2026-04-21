import NewbornWeightTracker from "@/components/health/weight/NewbornWeightTracker";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Newborn Weight Tracker | Monitor Baby Growth | Revochamp",
  description:
    "Track your baby's weight gain over time. Log daily weights, view growth charts, and ensure healthy development. Free, simple, and private.",
  keywords: [
    "newborn weight tracker",
    "baby weight log",
    "infant growth chart",
    "weight gain tracker",
    "newborn growth",
    "baby health",
    "Revochamp",
  ],
  openGraph: {
    title: "Newborn Weight Tracker | Revochamp",
    description:
      "Monitor your baby's weight gain with easy logging and visual charts. Track progress and share with your pediatrician.",
    url: "https://revochamp.site/newborn-weight-tracker",
    siteName: "Revochamp",
    images: [
      {
        url: "https://revochamp.site/og-weight-tracker.png",
        width: 1200,
        height: 630,
        alt: "Revochamp Newborn Weight Tracker",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Newborn Weight Tracker | Revochamp",
    description:
      "Log baby's weight and see growth trends. Free, private tracker for new parents.",
    images: ["https://revochamp.site/og-weight-tracker.png"],
  },
}

export default function WeightTrackerPage() {
  return <NewbornWeightTracker />;
}