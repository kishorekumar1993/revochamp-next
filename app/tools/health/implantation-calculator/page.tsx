import { Metadata } from "next";
import ImplantationCalculatorClient from "./ImplantationCalculatorClient";

export const metadata: Metadata = {
  title: "Implantation Calculator | When Does Implantation Occur? | Revochamp",
  description:
    "Estimate your implantation window and when to take a pregnancy test based on ovulation, IVF transfer, or last menstrual period. Evidence‑based fertility tool.",
  keywords:
    "implantation calculator, implantation timing, pregnancy test date, ovulation calculator, IVF implantation, LMP calculator",
  openGraph: {
    title: "Implantation Calculator – Know Your Implantation Window",
    description:
      "Free tool to estimate implantation dates and pregnancy test timing. Used by thousands of women.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Implantation Calculator | Revochamp",
    description:
      "Estimate implantation and pregnancy test dates with this free, science‑based tool.",
  },
};

export default function Page() {
  return <ImplantationCalculatorClient />;
}