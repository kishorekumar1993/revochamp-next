import { Metadata } from "next";
import LifeInsuranceCalculatorClient from "./LifeInsuranceCalculatorClient";

export const metadata: Metadata = {
  title: "Life Insurance Calculator | Find the Right Cover for Your Family",
  description:
    "Estimate your life insurance need using Human Life Value (HLV) method. Calculate income replacement, liabilities, and future expenses instantly.",
  keywords:
    "life insurance calculator, HLV calculator, term insurance, life cover, human life value, insurance need analysis",
  openGraph: {
    title: "Life Insurance Calculator – How Much Cover Do You Need?",
    description:
      "Use our free tool to calculate the ideal life insurance sum assured based on your income, expenses, debts, and dependents.",
    type: "website",
    url: "https://yourdomain.com/tools/life-insurance-calculator",
  },
};

export default function Page() {
  return <LifeInsuranceCalculatorClient />;
}