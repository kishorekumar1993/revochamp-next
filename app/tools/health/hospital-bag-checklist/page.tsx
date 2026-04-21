import HospitalBagChecklist from "@/components/health/hospital-bag/HospitalBagChecklist";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Hospital Bag Checklist | Pack for Delivery | Revochamp",
  description:
    "Prepare your hospital bag with our comprehensive checklist. Track what's packed for mom, baby, partner, and documents. Free, simple, and organized.",
  keywords: [
    "hospital bag checklist",
    "what to pack for hospital delivery",
    "maternity bag checklist",
    "baby hospital bag",
    "labor and delivery packing list",
    "pregnancy checklist",
    "Revochamp",
  ],
  openGraph: {
    title: "Hospital Bag Checklist | Revochamp",
    description:
      "Get ready for delivery! Track your packing progress with our interactive checklist for mom, baby, partner, and documents.",
    url: "https://revochamp.site/hospital-bag-checklist",
    siteName: "Revochamp",
    images: [
      {
        url: "https://revochamp.site/og-hospital-bag.png",
        width: 1200,
        height: 630,
        alt: "Revochamp Hospital Bag Checklist",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hospital Bag Checklist | Revochamp",
    description:
      "Pack with confidence! Interactive checklist for your hospital stay.",
    images: ["https://revochamp.site/og-hospital-bag.png"],
  },
};

export default function HospitalBagPage() {
  return <HospitalBagChecklist />;
}