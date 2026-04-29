import { Metadata } from "next";
import CompoundInterestCalculatorClient from "./CompoundInterestCalculatorClient";

export const metadata: Metadata = {
  title: "Compound Interest Calculator | Grow Your Wealth with Power of Compounding",
  description:
    "Calculate compound interest with monthly additions. See how your investments grow over time with different compounding frequencies (yearly, half-yearly, quarterly, monthly). Plan your long-term wealth.",
  keywords:
    "compound interest calculator, compound interest formula, monthly investment calculator, wealth growth, compounding frequency, investment returns",
  openGraph: {
    title: "Compound Interest Calculator – See Your Money Grow Exponentially",
    description:
      "Use our free compound interest calculator to estimate the future value of your investments. Add monthly contributions and choose compounding frequency.",
    type: "website",
    url: "https://revochamp.site/tools/compound-interest-calculator",
  },
  alternates: {
    canonical: "https://revochamp.site/tools/compound-interest-calculator",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Page() {
  return <CompoundInterestCalculatorClient />;
}