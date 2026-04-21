import ToolsHub from "@/components/health/tools/ToolsHub";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pregnancy & Parenting Health Tools | Revochamp",
  description:
    "Free health calculators and trackers for fertility, pregnancy, baby care, and postpartum. Period tracker, ovulation calculator, due date, baby sleep, and more.",
  keywords: [
    "health tools",
    "pregnancy calculator",
    "fertility tracker",
    "ovulation calculator",
    "baby tracker",
    "period tracker",
    "parenting tools",
    "Revochamp",
  ],
  openGraph: {
    title: "Health Tools for Pregnancy & Parenting | Revochamp",
    description:
      "Discover free, evidence-based tools to support your journey from fertility to parenthood.",
    url: "https://revochamp.com/health-tools",
    siteName: "Revochamp",
    images: [
      {
        url: "https://revochamp.com/og-tools.png",
        width: 1200,
        height: 630,
        alt: "Revochamp Health Tools",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Health Tools | Revochamp",
    description:
      "Free calculators and trackers for fertility, pregnancy, and baby care.",
    images: ["https://revochamp.com/og-tools.png"],
  },
};

export default function HealthToolsPage() {
  return <ToolsHub />;
}