import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Baby Kick Counter – Track Fetal Movement Safely',
  description:
    'Count your baby’s kicks accurately with medical guidelines. Know when to contact your doctor. Free, private, and easy to use.',
  keywords: [
    'kick counter',
    'fetal movement',
    'pregnancy kick count',
    'baby kicks',
    'reduced fetal movement',
  ],
  openGraph: {
    title: 'Baby Kick Counter | Medically Accurate Tracking',
    description: 'Track kicks with time‑based evaluation and early warnings.',
    type: 'website',
  },
};

export default function KickCounterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}