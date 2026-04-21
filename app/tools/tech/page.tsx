// app/tools/tech/page.tsx
import ToolsHub from "@/components/tech/tools/ToolsHub";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Developer Tools & Utilities | DevTools by Revochamp",
  description:
    "Free online developer tools and utilities. JSON formatter, Base64 encoder, JWT debugger, regex tester, hash generator, QR code creator, and more. All client-side and privacy-first.",
  keywords: [
    "developer tools",
    "devtools",
    "json formatter",
    "base64 encoder",
    "jwt debugger",
    "regex tester",
    "hash generator",
    "qr code generator",
    "url parser",
    "unit converter",
    "online dev tools",
    "free developer utilities",
    "Revochamp",
  ],
  openGraph: {
    title: "Free Developer Tools & Utilities | DevTools",
    description:
      "Boost your productivity with free online developer tools. JSON formatter, Base64, JWT, regex, hash generators, and more. 100% client-side and secure.",
    url: "https://revochamp.site/tools/tech",
    siteName: "Revochamp",
    images: [
      {
        url: "https://revochamp.site/og-dev-tools.png",
        width: 1200,
        height: 630,
        alt: "Revochamp Developer Tools",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Developer Tools & Utilities | Revochamp",
    description:
      "Free online tools for developers. JSON, Base64, JWT, regex, hashing, QR codes, and more.",
    images: ["https://revochamp.site/og-dev-tools.png"],
  },
  alternates: {
    canonical: "/tools/tech",
  },
};

export default function TechToolsPage() {
  return <ToolsHub />;
}

// import ToolsHub from "@/components/tech/tools/ToolsHub";
// import { Metadata } from "next";

// export const metadata: Metadata = {
//   title: "Pregnancy & Parenting Health Tools | Revochamp",
//   description:
//     "Free health calculators and trackers for fertility, pregnancy, baby care, and postpartum. Period tracker, ovulation calculator, due date, baby sleep, and more.",
//   keywords: [
//     "health tools",
//     "pregnancy calculator",
//     "fertility tracker",
//     "ovulation calculator",
//     "baby tracker",
//     "period tracker",
//     "parenting tools",
//     "Revochamp",
//   ],
//   openGraph: {
//     title: "Health Tools for Pregnancy & Parenting | Revochamp",
//     description:
//       "Discover free, evidence-based tools to support your journey from fertility to parenthood.",
//     url: "https://revochamp.site/health-tools",
//     siteName: "Revochamp",
//     images: [
//       {
//         url: "https://revochamp.site/og-tools.png",
//         width: 1200,
//         height: 630,
//         alt: "Revochamp Health Tools",
//       },
//     ],
//     type: "website",
//   },
//   twitter: {
//     card: "summary_large_image",
//     title: "Health Tools | Revochamp",
//     description:
//       "Free calculators and trackers for fertility, pregnancy, and baby care.",
//     images: ["https://revochamp.site/og-tools.png"],
//   },
// };

// export default function HealthToolsPage() {
//   return <ToolsHub />;
// }