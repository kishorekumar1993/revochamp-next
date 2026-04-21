import { Metadata } from "next";
import TermInsuranceCalculatorClient from "./TermInsuranceCalculatorClient";

export const metadata: Metadata = {
  title: "Term Insurance Calculator | Find Your Ideal Life Cover",
  description:
    "Calculate the right term insurance sum assured based on income, expenses, liabilities, and dependents. Get premium estimates instantly.",
  keywords:
    "term insurance calculator, life cover, term plan, income replacement, human life value, term premium",
  openGraph: {
    title: "Term Insurance Calculator – How Much Cover Do You Need?",
    description:
      "Use our free tool to calculate the ideal term insurance cover for your family. Based on financial goals and personal details.",
    type: "website",
    url: "https://yourdomain.com/tools/term-insurance-calculator",
  },
};

export default function Page() {
  return <TermInsuranceCalculatorClient />;
}