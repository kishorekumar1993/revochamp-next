import { Metadata } from "next";
import GstCalculatorClient from "./GstCalculatorClient";

export const metadata: Metadata = {
  title: "GST Calculator | Calculate GST Inclusive & Exclusive Amounts | FinTools",
  description:
    "Free GST calculator for India. Compute GST amount, net price, gross price with all standard tax rates (0%, 3%, 5%, 12%, 18%, 28%). Switch between exclusive and inclusive modes.",
  keywords:
    "GST calculator, goods and services tax, GST calculation, tax calculator, Indian GST, reverse GST calculator",
  openGraph: {
    title: "GST Calculator – Add or Remove Tax Instantly",
    description:
      "Calculate GST for any product or service. Enter net or gross amount, select a rate, and get accurate GST amounts.",
    type: "website",
    url: "https://yourdomain.com/tools/gst-calculator",
  },
  alternates: {
    canonical: "https://yourdomain.com/tools/gst-calculator",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Page() {
  return <GstCalculatorClient />;
}