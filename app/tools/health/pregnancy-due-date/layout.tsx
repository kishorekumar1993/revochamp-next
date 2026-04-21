import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pregnancy Due Date Calculator: Estimate Your Delivery Date',
  description:
    'Calculate your estimated due date, track your pregnancy week, see baby size comparisons, and get trimester info. Free and private.',
  keywords: [
    'due date calculator',
    'pregnancy calculator',
    'pregnancy week by week',
    'baby size',
    'trimester tracker',
  ],
  openGraph: {
    title: 'Pregnancy Due Date Calculator | Track Your Pregnancy',
    description: 'Find your due date and follow your baby’s growth week by week.',
    type: 'website',
  },
};

export default function DueDateLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
