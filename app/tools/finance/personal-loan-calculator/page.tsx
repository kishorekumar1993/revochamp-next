import { Metadata } from "next";
import PersonalLoanCalculatorClient from "./PersonalLoanCalculatorClient";

export const metadata: Metadata = {
  title: "Personal Loan EMI Calculator | Interest & Amortization Schedule | FinTools",
  description:
    "Calculate your personal loan EMI, total interest, and repayment schedule. Compare loan amounts, interest rates, and tenures. Plan your borrowing smartly.",
  keywords:
    "personal loan calculator, personal loan EMI, loan EMI calculator, interest rate, amortization schedule, debt consolidation loan",
  openGraph: {
    title: "Personal Loan EMI Calculator – Plan Your Borrowing",
    description:
      "Use our free personal loan calculator to estimate monthly EMI, total interest, and year-wise repayment schedule. Make informed borrowing decisions.",
    type: "website",
    url: "https://yourdomain.com/tools/personal-loan-calculator",
  },
  alternates: {
    canonical: "https://yourdomain.com/tools/personal-loan-calculator",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Page() {
  return <PersonalLoanCalculatorClient />;
}