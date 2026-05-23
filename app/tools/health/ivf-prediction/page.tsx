import { Metadata, Viewport } from "next";
import Script from "next/script";
import IVFSuccessPredictionClient from "./IVFSuccessPredictionClient";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "IVF Success Predictor | Estimate Your IVF Chances | Revochamp",
  description:
    "Estimate your likelihood of a successful IVF cycle based on age, BMI, previous IVF attempts, and embryo quality. Evidence‑based tool to help you plan.",
  keywords:
    "IVF success predictor, IVF success rate calculator, IVF chances, fertility treatment, IVF outcome estimator",
  authors: [{ name: "Revochamp" }],
  alternates: {
    canonical: "https://revochamp.site/tools/health/ivf-prediction",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "IVF Success Predictor – Know Your Chances",
    description:
      "Personalized IVF success estimate based on key medical factors. Free and anonymous.",
    type: "website",
    locale: "en_US",
    url: "https://revochamp.site/tools/health/ivf-prediction",
    siteName: "Revochamp",
    images: [
      {
        url: "https://revochamp.site/tools/health/og-fertility.png",
        width: 1200,
        height: 630,
        alt: "IVF Success Predictor – Estimate Your Chances",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "IVF Success Predictor | Revochamp",
    description:
      "Estimate your IVF success rate using clinically‑relevant parameters.",
    images: ["https://revochamp.site/tools/health/og-fertility.png"],
  },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: "IVF Success Predictor",
    description:
      "Estimate your likelihood of a successful IVF cycle based on age, BMI, previous IVF attempts, and embryo quality.",
    url: "https://revochamp.site/tools/health/ivf-prediction",
    medicalSpecialty: "Fertility",
    usageInfo: "https://revochamp.site/tools/health/ivf-prediction",
    about: {
      "@type": "Thing",
      name: "IVF success rate",
    },
    potentialAction: {
      "@type": "UseAction",
      target: "https://revochamp.site/tools/health/ivf-prediction",
    },
    mainEntity: {
      "@type": "WebApplication",
      name: "IVF Success Predictor",
      applicationCategory: "Health",
      operatingSystem: "Any",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    },
  };

  return (
    <>
      <Script
        id="ivf-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <IVFSuccessPredictionClient />
    </>
  );
}

// import { Metadata } from "next";
// import IVFSuccessPredictionClient from "./IVFSuccessPredictionClient";

// export const metadata: Metadata = {
//   title: "IVF Success Predictor | Estimate Your IVF Chances | Revochamp",
//   description:
//     "Estimate your likelihood of a successful IVF cycle based on age, BMI, previous IVF attempts, and embryo quality. Evidence‑based tool to help you plan.",
//   keywords:
//     "IVF success predictor, IVF success rate calculator, IVF chances, fertility treatment, IVF outcome estimator",
//   openGraph: {
//     title: "IVF Success Predictor – Know Your Chances",
//     description:
//       "Personalized IVF success estimate based on key medical factors. Free and anonymous.",
//     type: "website",
//     locale: "en_US",
//   },
//   twitter: {
//     card: "summary_large_image",
//     title: "IVF Success Predictor | Revochamp",
//     description:
//       "Estimate your IVF success rate using clinically‑relevant parameters.",
//   },
// };

// export default function Page() {
//   return <IVFSuccessPredictionClient />;
// }