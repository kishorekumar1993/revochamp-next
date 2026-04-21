import { Metadata } from "next";
import EducationLoanCalculatorClient from "./EducationLoanCalculatorClient";

export const metadata: Metadata = {
  title: "Education Loan EMI Calculator | Interest & Amortization Schedule | FinTools",
  description:
    "Calculate your education loan EMI, total interest, and repayment schedule. Adjust loan amount, interest rate, tenure, and moratorium period. Plan your study finances.",
  keywords:
    "education loan calculator, student loan EMI, study loan calculator, education loan interest, moratorium period, amortization schedule",
  openGraph: {
    title: "Education Loan EMI Calculator – Plan Your Study Abroad or India Education",
    description:
      "Use our free education loan calculator to estimate monthly EMI, total interest, and repayment schedule. Compare different loan options and plan smartly.",
    type: "website",
    url: "https://yourdomain.com/tools/education-loan-calculator",
  },
  alternates: {
    canonical: "https://yourdomain.com/tools/education-loan-calculator",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Page() {
  return <EducationLoanCalculatorClient />;
}