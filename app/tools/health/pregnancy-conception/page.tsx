import PregnancyConceptionClient from "@/components/health/pregnancy-conception/PregnancyConceptionClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pregnancy Conception Calculator | When Did I Conceive? | Revochamp",
  description:
    "Estimate your conception date and fertile window based on due date or last menstrual period. Free, evidence‑based tool for parents‑to‑be.",
  keywords:
    "pregnancy conception calculator, conception date, when did I conceive, fertile window, due date to conception, LMP conception",
  openGraph: {
    title: "Pregnancy Conception Calculator – Find Your Conception Window",
    description:
      "Quickly estimate when conception likely occurred using your due date or last period.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pregnancy Conception Calculator | Revochamp",
    description:
      "Free tool to estimate conception date and fertile window.",
  },
};

export default function Page() {
  return <PregnancyConceptionClient />;
}