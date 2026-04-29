import { Metadata } from "next";
import UlipCalculatorClient from "./UlipCalculatorClient";

export const metadata: Metadata = {
  title: "ULIP Calculator | Compare Returns & Charges of Unit Linked Insurance Plans",
  description:
    "Calculate ULIP maturity value after all charges (allocation, fund management, mortality). Compare with alternative investments like mutual funds. Make informed decisions.",
  keywords:
    "ULIP calculator, unit linked insurance plan, ULIP returns, ULIP charges, ULIP vs mutual fund, insurance investment calculator",
  openGraph: {
    title: "ULIP Calculator – See Real Returns After Charges",
    description:
      "Estimate the final value of your ULIP after accounting for all charges. Compare with a pure investment alternative to decide if ULIP is right for you.",
    type: "website",
    url: "https://revochamp.site/tools/ulip-calculator",
  },
};

export default function Page() {
  return <UlipCalculatorClient />;
}