import { Metadata } from "next";
import PeriodCalculatorClient from "./PeriodCalculatorClient";

export const metadata: Metadata = {
  title: "Period Calculator | Track Menstrual Cycle & Ovulation | Revochamp",
  description:
    "Predict your next period, ovulation day, and fertile window based on your last menstrual period and cycle length. Free, private, and evidence‑based.",
  keywords:
    "period calculator, menstrual cycle tracker, ovulation calculator, fertile window, next period prediction, cycle length",
  openGraph: {
    title: "Period Calculator – Predict Your Next Period & Ovulation",
    description:
      "Plan ahead with accurate period and fertility predictions. Save your cycle history.",
    type: "website",
    locale: "en_US",
    url: "https://revochamp.com/health/period-calculator",
  },
  twitter: {
    card: "summary_large_image",
    title: "Period Calculator | Revochamp",
    description:
      "Track your cycle, predict ovulation, and never be surprised by your next period.",
  },
  alternates: {
    canonical: "https://revochamp.com/health/period-calculator",
  },
};

export default function Page() {
  return <PeriodCalculatorClient />;
}