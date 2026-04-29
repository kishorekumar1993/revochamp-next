import { Metadata } from "next";
import MfReturnsCalculatorClient from "./MfReturnsCalculatorClient";


export const metadata: Metadata = {
  title: "Mutual Fund Returns Calculator | SIP & Lump Sum Returns | FinTools",
  description:
    "Calculate mutual fund returns for both SIP and lump sum investments. Estimate future value, CAGR/XIRR, and year-wise growth. Plan your wealth creation journey.",
  keywords:
    "mutual fund returns calculator, SIP returns, lump sum calculator, MF calculator, CAGR calculator, XIRR calculator, mutual fund growth",
  openGraph: {
    title: "Mutual Fund Returns Calculator – Estimate Your Investment Growth",
    description:
      "Use our free MF returns calculator to see how your SIP or lump sum investments grow over time. Get detailed year‑wise breakdown and return metrics.",
    type: "website",
    url: "https://revochamp.site/tools/mf-returns-calculator",
  },
};

export default function Page() {
  return <MfReturnsCalculatorClient />;
}