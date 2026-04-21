import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pregnancy Symptom Checker: Understand Your Symptoms',
  description:
    'Check common pregnancy symptoms and get guidance. Know when to seek medical attention. Free, private, and based on medical guidelines.',
  keywords: [
    'pregnancy symptoms',
    'symptom checker',
    'pregnancy health',
    'morning sickness',
    'preeclampsia symptoms',
    'pregnancy warning signs',
  ],
  openGraph: {
    title: 'Pregnancy Symptom Checker | Know What Your Symptoms Mean',
    description: 'Select your symptoms and get instant, reliable guidance.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pregnancy Symptom Checker',
    description: 'Check symptoms and get advice.',
  },
};

export default function SymptomCheckerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}