// app/tools/image-compressor/page.tsx
import { Metadata } from 'next';
import Script from 'next/script';
import ImageCompressorClient from './ImageCompressorClient';

export const metadata: Metadata = {
  title: 'Image Compressor - Reduce Image Size Online | DevTools',
  description: 'Free online image compressor. Reduce JPEG and PNG file sizes while preserving quality. Compress images directly in your browser — no uploads, 100% private.',
  keywords: 'image compressor, compress image, reduce image size, jpeg compressor, png compressor, online image tool',
  openGraph: {
    title: 'Free Image Compressor',
    description: 'Compress JPEG and PNG images instantly in your browser. Adjust quality, preview results, and download optimized files.',
    url: 'https://yourdomain.com/tools/image-compressor',
    type: 'website',
  },
  alternates: {
    canonical: '/tools/image-compressor',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Image Compressor',
  description: 'A free, online tool to compress JPEG and PNG images directly in the browser.',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'All',
  url: 'https://yourdomain.com/tools/image-compressor',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

export default function ImageCompressorPage() {
  return (
    <>
      <Script
        id="json-ld-image-compressor"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ImageCompressorClient />
    </>
  );
}