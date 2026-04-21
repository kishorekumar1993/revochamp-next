import { Metadata } from "next";
import DueDateCalculatorClient from "./DueDateCalculatorClient";

export const metadata: Metadata = {
  title: "Due Date Calculator | Estimate Your Baby's Arrival | Revochamp",
  description:
    "Calculate your estimated due date based on last menstrual period, conception date, or IVF transfer. Free, evidence‑based pregnancy tool.",
  keywords:
    "due date calculator, pregnancy due date, estimated due date, EDD, LMP calculator, conception date, IVF due date",
  openGraph: {
    title: "Due Date Calculator – Know Your Baby's Due Date",
    description:
      "Quickly estimate your pregnancy due date using multiple methods. Trusted by expectant parents.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Due Date Calculator | Revochamp",
    description:
      "Free due date calculator based on LMP, conception, or IVF transfer.",
  },
};

export default function Page() {
  return <DueDateCalculatorClient />;
}