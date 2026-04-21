import { Metadata } from "next";
import IncomeTaxCalculatorClient from "./IncomeTaxCalculatorClient";

export const metadata: Metadata = {
  title: "Income Tax Calculator India | Calculate Tax for FY 2025-26 | FinTools",
  description:
    "Calculate your income tax for FY 2025-26 (AY 2026-27) with the latest new vs old regime slabs. Includes standard deduction, Section 87A rebate, surcharge, and cess.",
  keywords:
    "income tax calculator India, tax calculator FY 2025-26, new tax regime slabs, old tax regime, income tax slabs 2025, tax planning, ITR calculator",
  openGraph: {
    title: "Income Tax Calculator – New vs Old Regime for FY 2025-26",
    description:
      "Use our free income tax calculator to estimate your tax liability under both regimes. Updated with Budget 2025 changes: ₹12 lakh tax-free, ₹75,000 standard deduction.",
    type: "website",
    url: "https://yourdomain.com/tools/income-tax-calculator",
  },
  alternates: {
    canonical: "https://yourdomain.com/tools/income-tax-calculator",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Page() {
  return <IncomeTaxCalculatorClient />;
}