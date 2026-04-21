import VaccinationReminder from "@/components/health/vaccination/VaccinationReminder";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "Pregnancy Vaccination Reminder | India Guidelines | Revochamp",
  description:
    "Stay on track with recommended vaccines during pregnancy. Based on Indian government UIP guidelines. Check Td, COVID-19, and optional vaccines.",
  keywords: [
    "pregnancy vaccines",
    "vaccination reminder",
    "Td vaccine pregnancy",
    "India UIP vaccines",
    "pregnancy immunization",
    "maternal health",
    "Revochamp",
  ],
  openGraph: {
    title: "Pregnancy Vaccination Reminder | Revochamp",
    description:
      "Check which vaccines are due based on your pregnancy week. Follow Indian government recommendations for Td, COVID-19, and more.",
    url: "https://revochamp.com/vaccination-reminder",
    siteName: "Revochamp",
    images: [
      {
        url: "https://revochamp.com/og-vaccination.png",
        width: 1200,
        height: 630,
        alt: "Revochamp Vaccination Reminder",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pregnancy Vaccination Reminder | Revochamp",
    description:
      "Track recommended vaccines during pregnancy with India-specific guidelines.",
    images: ["https://revochamp.com/og-vaccination.png"],
  },
};

export default function VaccinationPage() {
  return <VaccinationReminder />;
}