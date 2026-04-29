import { Metadata } from "next";
import CarLoanCalculatorClient from "./CarLoanCalculatorClient";

export const metadata: Metadata = {
  title: "Car Loan EMI Calculator | Interest & Amortization Schedule | FinTools",
  description:
    "Calculate your car loan EMI, total interest payable, and get a year-wise amortization schedule. Plan your car purchase with different loan amounts, interest rates, and tenures.",
  keywords:
    "car loan calculator, car loan EMI, auto loan calculator, vehicle loan EMI, car finance calculator, amortization schedule",
  openGraph: {
    title: "Car Loan EMI Calculator – Plan Your Car Purchase",
    description:
      "Use our free car loan calculator to estimate monthly EMI, total interest, and repayment schedule. Compare loan options and make an informed decision.",
    type: "website",
    url: "https://revochamp.site/tools/car-loan-calculator",
  },
  alternates: {
    canonical: "https://revochamp.site/tools/car-loan-calculator",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Page() {
  return <CarLoanCalculatorClient />;
}