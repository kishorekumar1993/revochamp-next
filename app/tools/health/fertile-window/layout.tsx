// app/fertile-window/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Fertile Window Calculator: Find Your Best Days to Conceive',
  description:
    'Discover when you\'re most likely to get pregnant. Our free calculator helps you pinpoint ovulation, fertile days, and pregnancy test timing.',
  keywords: ['fertile window', 'ovulation calculator', 'best days to conceive', 'fertility tracker'],
  openGraph: {
    title: 'Fertile Window Calculator | Know Your Most Fertile Days',
    description: 'Plan your pregnancy with confidence. Free, private, and accurate.',
    type: 'website',
    url: 'https://revochamp.site/health/fertile-window',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fertile Window Calculator',
    description: 'Calculate your fertile days instantly.',
  },
};

export default function FertileWindowLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}