import { Metadata } from "next";
import SwpCalculatorClient from "./SwpCalculatorClient";

export const metadata: Metadata = {
  title: "SWP Calculator | Systematic Withdrawal Plan - Regular Income from Investments",
  description:
    "Calculate how long your lump sum investment will last with regular withdrawals. Plan your SWP for retirement income or regular cash flow. Adjust returns, withdrawal amount, and frequency.",
  keywords:
    "SWP calculator, systematic withdrawal plan, retirement income calculator, regular income from investments, corpus withdrawal, SWP sustainability",
  openGraph: {
    title: "SWP Calculator – Plan Your Regular Income from Investments",
    description:
      "Use our free SWP calculator to determine how long your investment corpus will last with fixed periodic withdrawals. Perfect for retirement planning.",
    type: "website",
    url: "https://revochamp.site/tools/swp-calculator",
  },
};

export default function Page() {
  return <SwpCalculatorClient />;
}