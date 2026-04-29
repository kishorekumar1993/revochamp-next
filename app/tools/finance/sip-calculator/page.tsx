import { Metadata } from "next";
import SipCalculatorClient from "./SipCalculatorClient";


export const metadata: Metadata = {
  title: "SIP Calculator | Systematic Investment Plan Returns & Growth",
  description:
    "Calculate the future value of your monthly SIP investments. See total corpus, wealth gain, year‑wise breakdown, and understand the power of compounding.",
  keywords:
    "SIP calculator, systematic investment plan, mutual fund SIP, SIP returns, monthly investment, compound interest calculator",
  openGraph: {
    title: "SIP Calculator – Plan Your Mutual Fund Investments",
    description:
      "Use our free SIP calculator to estimate the growth of your monthly investments over time. Compare different amounts, returns, and tenures.",
    type: "website",
    url: "https://revochamp.site/tools/sip-calculator",
  },
};

export default function Page() {
  return <SipCalculatorClient />;
}