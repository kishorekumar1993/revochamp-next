import { Metadata } from "next";
import BreastfeedingTracker from "@/components/health/feeding/BreastfeedingTracker";

export const metadata: Metadata = {
  title: "Breastfeeding Tracker | Log Nursing Sessions | Revochamp",
  description:
    "Track breastfeeding sessions easily with our free timer. Log left/right sides, add notes, and view daily summaries. Perfect for new moms.",
  keywords: [
    "breastfeeding tracker",
    "nursing timer",
    "baby feeding log",
    "breastfeeding app",
    "newborn feeding tracker",
    "lactation tracker",
    "Revochamp",
  ],
  openGraph: {
    title: "Breastfeeding Tracker | Revochamp",
    description:
      "Track nursing sessions, monitor feeding patterns, and get reminders. Simple, private, and free for new parents.",
    url: "https://revochamp.com/breastfeeding-tracker",
    siteName: "Revochamp",
    images: [
      {
        url: "https://revochamp.com/og-breastfeeding.png",
        width: 1200,
        height: 630,
        alt: "Revochamp Breastfeeding Tracker",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Breastfeeding Tracker | Revochamp",
    description:
      "Log nursing sessions easily. Free timer with side tracking and daily summaries.",
    images: ["https://revochamp.com/og-breastfeeding.png"],
  },
};

export default function BreastfeedingPage() {
  return <BreastfeedingTracker />;
}