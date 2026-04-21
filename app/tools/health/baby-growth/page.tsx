import { Metadata } from "next";
import BabyGrowthClient from "./BabyGrowthClient";

export const metadata: Metadata = {
  title: "Baby Growth Tracker | WHO Percentile Calculator & Charts | Revochamp",
  description:
    "Track your baby's growth with WHO‑based weight and height percentiles. Save growth records, visualise trends, and get expert advice. Free tool for 0‑24 months.",
  keywords:
    "baby growth tracker, infant percentile calculator, WHO growth chart, baby weight percentile, baby height percentile, child development, growth record, baby health",
  openGraph: {
    title: "Baby Growth Tracker – Monitor Development with WHO Standards",
    description:
      "Free, evidence‑based tool. Save multiple measurements, track percentiles over time, and receive personalised growth insights.",
    type: "website",
    locale: "en_US",
    url: "https://revochamp.site/health/baby-growth",
  },
  twitter: {
    card: "summary_large_image",
    title: "Baby Growth Tracker | Revochamp",
    description:
      "Track weight and height percentiles for babies 0‑24 months. Save history and see trends.",
  },
  alternates: {
    canonical: "https://revochamp.site/health/baby-growth",
  },
};

export default function Page() {
  return <BabyGrowthClient />;
}