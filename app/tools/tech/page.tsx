import ToolsHub from "@/components/tech/tools/ToolsHub";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Developer Tools & Utilities | DevTools by Revochamp",
  description:
    "Free online developer tools and utilities. JSON formatter, Base64 encoder, JWT debugger, regex tester, hash generator, QR code creator, and more. All client-side and privacy-first.",

  alternates: {
    canonical: "https://revochamp.site/tools/tech/",
  },

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
      "Boost your productivity with free online developer tools.",
    url: "https://revochamp.site/tools/tech/",
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
      "Free online tools for developers.",
    images: ["https://revochamp.site/og-dev-tools.png"],
  },
};

export default function TechToolsPage() {
  return <ToolsHub />;
}

// // app/tools/tech/page.tsx
// import ToolsHub from "@/components/tech/tools/ToolsHub";
// import { Metadata } from "next";

// export const metadata: Metadata = {
//   title: "Free Developer Tools & Utilities | DevTools by Revochamp",
//   description:
//     "Free online developer tools and utilities. JSON formatter, Base64 encoder, JWT debugger, regex tester, hash generator, QR code creator, and more. All client-side and privacy-first.",
//   keywords: [
//     "developer tools",
//     "devtools",
//     "json formatter",
//     "base64 encoder",
//     "jwt debugger",
//     "regex tester",
//     "hash generator",
//     "qr code generator",
//     "url parser",
//     "unit converter",
//     "online dev tools",
//     "free developer utilities",
//     "Revochamp",
//   ],
//   openGraph: {
//     title: "Free Developer Tools & Utilities | DevTools",
//     description:
//       "Boost your productivity with free online developer tools. JSON formatter, Base64, JWT, regex, hash generators, and more. 100% client-side and secure.",
//     url: "https://revochamp.site/tools/tech",
//     siteName: "Revochamp",
//     images: [
//       {
//         url: "https://revochamp.site/og-dev-tools.png",
//         width: 1200,
//         height: 630,
//         alt: "Revochamp Developer Tools",
//       },
//     ],
//     type: "website",
//   },
//   twitter: {
//     card: "summary_large_image",
//     title: "Developer Tools & Utilities | Revochamp",
//     description:
//       "Free online tools for developers. JSON, Base64, JWT, regex, hashing, QR codes, and more.",
//     images: ["https://revochamp.site/og-dev-tools.png"],
//   },
//   alternates: {
//     canonical: "/tools/tech",
//   },
// };

// export default function TechToolsPage() {
//   return <ToolsHub />;
// }
