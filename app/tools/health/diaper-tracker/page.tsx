import DiaperTracker from "@/components/health/diaper/DiaperTracker";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "Diaper Tracker | Log Wet & Dirty Diapers | Revochamp",
  description:
    "Track your baby's diaper changes easily. Monitor wet and dirty diapers to ensure proper hydration and digestion. Free, simple, and private.",
  keywords: [
    "diaper tracker",
    "baby diaper log",
    "wet diaper tracker",
    "dirty diaper tracker",
    "newborn diaper tracker",
    "baby health",
    "Revochamp",
  ],
  openGraph: {
    title: "Diaper Tracker | Revochamp",
    description:
      "Log wet and dirty diapers with one tap. Track daily totals and spot changes in your baby's health.",
    url: "https://revochamp.com/diaper-tracker",
    siteName: "Revochamp",
    images: [
      {
        url: "https://revochamp.com/og-diaper.png",
        width: 1200,
        height: 630,
        alt: "Revochamp Diaper Tracker",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Diaper Tracker | Revochamp",
    description:
      "Track diaper changes easily. Free, private, and designed for new parents.",
    images: ["https://revochamp.com/og-diaper.png"],
  },
};

export default function DiaperPage() {
  return <DiaperTracker />;
}