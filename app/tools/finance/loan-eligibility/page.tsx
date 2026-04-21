import { Metadata } from "next";
import LoanEligibilityClient from "./LoanEligibilityClient";

export const metadata: Metadata = {
  title: "Loan Eligibility Calculator | Check How Much Loan You Can Get",
  description:
    "Free online loan eligibility calculator based on income, existing EMIs, and tenure. Know your maximum loan amount instantly for home, car, or personal loans.",
  keywords:
    "loan eligibility, home loan eligibility, personal loan, car loan, EMI calculator, FOIR, loan amount calculator",
  openGraph: {
    title: "Loan Eligibility Calculator – Know Your Borrowing Capacity",
    description:
      "Calculate your maximum eligible loan amount based on monthly income, obligations, interest rate, and tenure.",
    type: "website",
    url: "https://yourdomain.com/tools/loan-eligibility",
  },
};

export default function Page() {
  return <LoanEligibilityClient />;
}