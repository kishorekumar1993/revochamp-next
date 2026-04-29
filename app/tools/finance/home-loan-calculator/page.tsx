import { Metadata } from "next";
import HomeLoanCalculatorClient from "./HomeLoanCalculatorClient";

export const metadata: Metadata = {
  title: "Home Loan EMI Calculator | Interest & Amortization Schedule | FinTools",
  description:
    "Calculate your home loan EMI, total interest payable, and get a year-wise amortization schedule. Plan your home loan with different tenures and interest rates.",
  keywords:
    "home loan calculator, EMI calculator, home loan EMI, amortization schedule, housing loan, mortgage calculator",
  openGraph: {
    title: "Home Loan EMI Calculator – Plan Your Dream Home",
    description:
      "Use our free home loan calculator to estimate monthly EMI, total interest, and repayment schedule. Compare different loan amounts and tenures.",
    type: "website",
    url: "https://revochamp.site/tools/home-loan-calculator",
  },
};

export default function Page() {
  return <HomeLoanCalculatorClient />;
}