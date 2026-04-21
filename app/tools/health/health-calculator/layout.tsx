import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Health Calculator: BMI, BMR, Body Fat & More | Revochamp',
  description:
    'Calculate your BMI, BMR, body fat percentage, healthy weight range, and daily water intake. Free, private, and based on WHO guidelines. Track your health journey.',
  keywords: [
    'BMI calculator',
    'BMR calculator',
    'body fat percentage',
    'healthy weight',
    'water intake',
    'health tracker',
  ],
  openGraph: {
    title: 'Free Health Calculator | BMI, BMR & Body Fat',
    description: 'Know your numbers: BMI, BMR, body fat, and more. Private and instant.',
    type: 'website',
    url: 'https://revochamp.com/health/health-calculator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Health Calculator',
    description: 'BMI, BMR, body fat, water intake — all in one place.',
  },
};

export default function HealthCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}