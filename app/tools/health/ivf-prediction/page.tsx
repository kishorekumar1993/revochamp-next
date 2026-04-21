import { Metadata } from "next";
import IVFSuccessPredictionClient from "./IVFSuccessPredictionClient";

export const metadata: Metadata = {
  title: "IVF Success Predictor | Estimate Your IVF Chances | Revochamp",
  description:
    "Estimate your likelihood of a successful IVF cycle based on age, BMI, previous IVF attempts, and embryo quality. Evidence‑based tool to help you plan.",
  keywords:
    "IVF success predictor, IVF success rate calculator, IVF chances, fertility treatment, IVF outcome estimator",
  openGraph: {
    title: "IVF Success Predictor – Know Your Chances",
    description:
      "Personalized IVF success estimate based on key medical factors. Free and anonymous.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "IVF Success Predictor | Revochamp",
    description:
      "Estimate your IVF success rate using clinically‑relevant parameters.",
  },
};

export default function Page() {
  return <IVFSuccessPredictionClient />;
}