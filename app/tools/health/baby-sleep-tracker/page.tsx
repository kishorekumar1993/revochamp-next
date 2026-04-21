import BabySleepTracker from "@/components/health/sleep/BabySleepTracker";
import { Metadata } from "next";
// import BabySleepTracker from "@/components/health/sleep/BabySleepTracker";

export const metadata: Metadata = {
  title: "Baby Sleep Tracker | Track Naps & Night Sleep | Revochamp",
  description:
    "Track your baby's sleep patterns with our free sleep timer. Log naps, night sleep, and view daily summaries. Perfect for new parents.",
  keywords: [
    "baby sleep tracker",
    "infant sleep log",
    "newborn sleep timer",
    "nap tracker",
    "baby sleep patterns",
    "parenting tool",
    "Revochamp",
  ],
  openGraph: {
    title: "Baby Sleep Tracker | Revochamp",
    description:
      "Track your baby's naps and night sleep. Get daily summaries and identify sleep patterns. Free, easy-to-use timer for parents.",
    url: "https://revochamp.com/baby-sleep-tracker",
    siteName: "Revochamp",
    images: [
      {
        url: "https://revochamp.com/og-sleep-tracker.png",
        width: 1200,
        height: 630,
        alt: "Revochamp Baby Sleep Tracker",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Baby Sleep Tracker | Revochamp",
    description:
      "Log your baby's sleep easily. Free timer and daily summary for new parents.",
    images: ["https://revochamp.com/og-sleep-tracker.png"],
  },
};

export default function BabySleepPage() {
  return <BabySleepTracker />;
}