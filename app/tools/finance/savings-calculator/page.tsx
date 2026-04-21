import { Metadata } from "next";
import SavingsCalculatorClient from "./SavingsCalculatorClient";

export const metadata: Metadata = {
  title: "Savings Calculator | Project Your Wealth Growth",
  description:
    "Use our free Savings Calculator to estimate returns on lump sum or monthly savings. Plan your financial goals with compound interest, multiple compounding frequencies, and year‑wise breakdown.",
  keywords:
    "savings calculator, compound interest calculator, monthly savings, lump sum calculator, financial planning, wealth growth",
  openGraph: {
    title: "Savings Calculator – See Your Money Grow",
    description:
      "Calculate future value of your savings with our easy tool. Compare lump sum vs monthly contributions.",
    type: "website",
    url: "https://yourdomain.com/tools/savings-calculator",
  },
};

export default function Page() {
  return <SavingsCalculatorClient />;
}