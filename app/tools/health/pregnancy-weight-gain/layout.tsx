import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pregnancy Weight Gain Calculator: Track Healthy Gain by Week',
  description:
    'Calculate recommended weight gain during pregnancy based on your pre-pregnancy BMI. Includes twin pregnancy support, weekly timeline, and healthy tips.',
  keywords: [
    'pregnancy weight gain',
    'pregnancy calculator',
    'BMI pregnancy',
    'twin pregnancy weight',
    'healthy weight gain',
    'pregnancy week by week',
  ],
  openGraph: {
    title: 'Pregnancy Weight Gain Calculator | Healthy Gain Guide',
    description: 'Find your personalized pregnancy weight gain range based on BMI and week.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pregnancy Weight Gain Calculator',
    description: 'Recommended weight gain for a healthy pregnancy.',
  },
};

export default function PregnancyWeightGainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}