// app/tools/color-converter/page.tsx
import { Metadata } from 'next';
import ColorConverterClient from './ColorConverterClient';


export const metadata: Metadata = {
  title: 'Color Converter - HEX, RGB, HSL, CMYK Online | DevTools',
  description: 'Free online color converter. Convert between HEX, RGB, HSL, and CMYK formats. Real‑time preview, sliders, and copy to clipboard. Privacy‑first.',
  keywords: 'color converter, hex to rgb, rgb to hsl, cmyk converter, color picker, online color tool',
  openGraph: {
    title: 'Free Color Converter',
    description: 'Convert colors between HEX, RGB, HSL, and CMYK. Real‑time preview and easy copying.',
    url: 'https://yourdomain.com/tools/color-converter',
    type: 'website',
  },
  alternates: {
    canonical: '/tools/color-converter',
  },
};

// JSON-LD Structured Data
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Color Converter',
  description: 'A free, online tool to convert colors between HEX, RGB, HSL, and CMYK formats.',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'All',
  url: 'https://yourdomain.com/tools/color-converter',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

export default function ColorConverterPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ColorConverterClient />
    </>
  );
}