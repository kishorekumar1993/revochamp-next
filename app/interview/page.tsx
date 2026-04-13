import { Metadata } from 'next';
import MockInterviewClient from './MockInterviewClient';
import MockInterviewStructuredData from '@/components/mock-interview/MockInterviewStructuredData';

export const metadata: Metadata = {
  title: 'Mock Interviews | Practice Technical Interviews & Get Hired',
  description:
    'Prepare for FAANG-level technical interviews with real‑world mock interviews. Instant AI feedback, system design, behavioral, and coding tracks.',
  openGraph: {
    title: 'Mock Interviews | RevoChamp',
    description: 'Practice real technical interviews and land your dream job.',
    url: 'https://revochamp.site/tech/mock-interview',
    images: ['https://revochamp.site/tech/mock-interview-og.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@revochamp',
    creator: '@revochamp',
    title: 'Mock Interviews | RevoChamp',
    description: 'Practice real technical interviews and land your dream job.',
    images: ['https://revochamp.site/tech/mock-interview-og.png'],
  },
  robots: 'index, follow, max-image-preview:large',
  alternates: {
    canonical: 'https://revochamp.site/tech/mock-interview',
  },
  keywords: [
    'mock interview',
    'technical interview practice',
    'FAANG interview prep',
    'coding interview',
    'system design mock',
    'behavioral interview',
  ],
};

export default function MockInterviewPage() {
  return (
    <>
      <MockInterviewStructuredData />
      <MockInterviewClient />
    </>
  );
}