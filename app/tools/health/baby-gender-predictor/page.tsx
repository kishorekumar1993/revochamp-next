import { Metadata } from "next";
import BabyGenderPredictor from "@/components/health/baby-gender/BabyGenderPredictor";

export const metadata: Metadata = {
  title: "Chinese Gender Predictor | Baby Gender Prediction Chart | Revochamp",
  description:
    "Try the ancient Chinese Gender Chart to predict if you're having a boy or girl. Fun, traditional tool based on mother's age and conception month. For entertainment only.",
  keywords: [
    "Chinese gender predictor",
    "baby gender prediction",
    "Chinese calendar gender",
    "boy or girl predictor",
    "pregnancy gender test",
    "Revochamp",
  ],
  openGraph: {
    title: "Chinese Gender Predictor | Revochamp",
    description:
      "Curious about your baby's gender? Use the traditional Chinese Gender Chart for a fun prediction based on mother's age and conception month.",
    url: "https://revochamp.site/baby-gender-predictor",
    siteName: "Revochamp",
    images: [
      {
        url: "https://revochamp.site/og-gender-predictor.png",
        width: 1200,
        height: 630,
        alt: "Revochamp Baby Gender Predictor",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chinese Gender Predictor | Revochamp",
    description:
      "Fun baby gender prediction using the ancient Chinese chart. Boy or girl? Find out now!",
    images: ["https://revochamp.site/og-gender-predictor.png"],
  },
};

export default function BabyGenderPage() {
  return <BabyGenderPredictor />;
}