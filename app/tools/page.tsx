// app/tools/page.tsx
import { Metadata } from "next";
import ToolsHubClient from "./ToolsHubClient";

export const metadata: Metadata = {
  title: "Free Online Tools Hub | Calculators, Converters & Utilities | FinTools",
  description:
    "100+ free online tools for finance, development, education, health, real estate, and everyday calculations. No signup, no API, instant results.",
  keywords:
    "online tools, calculators, financial tools, dev utilities, health calculators, real estate tools, free tools",
  openGraph: {
    title: "Free Tools Hub – Everything You Need in One Place",
    description:
      "Explore our collection of free, instant, client-side tools for finance, tech, education, health, and more.",
    type: "website",
    url: "https://revochamp.site/tools",
  },
  alternates: {
    canonical: "https://revochamp.site/tools",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolsPage() {
  return <ToolsHubClient />;
}