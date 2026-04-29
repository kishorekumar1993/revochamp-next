import { Metadata } from "next";
import LumpsumCalculatorClient from "./LumpsumCalculatorClient";

export const metadata: Metadata = {
  title: "Lump Sum Calculator | One‑Time Investment Growth & Returns",
  description:
    "Calculate the future value of a lump sum investment with compound interest. Choose compounding frequency, see year‑wise growth, and visualise principal vs interest.",
  keywords:
    "lump sum calculator, one-time investment, compound interest calculator, future value, lumpsum returns, investment growth",
  openGraph: {
    title: "Lump Sum Calculator – See Your One‑Time Investment Grow",
    description:
      "Use our free lump sum calculator to estimate the maturity value of a single investment with compound interest. Plan your long‑term goals.",
    type: "website",
    url: "https://revochamp.site/tools/lumpsum-calculator",
  },
};

export default function Page() {
  return <LumpsumCalculatorClient />;
}