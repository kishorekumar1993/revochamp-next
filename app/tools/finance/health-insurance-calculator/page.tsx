import { Metadata } from "next";
import HealthInsuranceCalculatorClient from "./HealthInsuranceCalculatorClient";

export const metadata: Metadata = {
  title: "Health Insurance Calculator | Find Your Ideal Sum Insured",
  description:
    "Estimate the right health cover for you and your family based on age, city, lifestyle, and existing policies. Get premium estimates instantly.",
  keywords:
    "health insurance calculator, mediclaim, family floater, sum insured, health cover, premium calculator",
  openGraph: {
    title: "Health Insurance Calculator – How Much Cover Do You Need?",
    description:
      "Use our free tool to calculate the ideal health insurance sum insured. Factors: age, city tier, family size, smoking, lifestyle.",
    type: "website",
    url: "https://revochamp.site/tools/health-insurance-calculator",
  },
};

export default function Page() {
  return <HealthInsuranceCalculatorClient />;
}