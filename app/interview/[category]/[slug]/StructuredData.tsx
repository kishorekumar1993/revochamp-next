import { TestSession } from '@/lib/testService';

interface Props {
  session: TestSession;
  category: string;
  slug: string;
}

export default function StructuredData({ session, category, slug }: Props) {
  const quizSchema = {
    '@context': 'https://schema.org',
    '@type': 'Quiz',
    name: session.title,
    description: session.description,
    educationalLevel: getEducationalLevel(session),
    timeRequired: `PT${session.timeLimitMinutes}M`,
    about: {
      '@type': 'Thing',
      name: category,
      description: `Technical interview preparation for ${category}`,
    },
    hasPart: session.questions.slice(0, 10).map(q => ({
      '@type': 'Question',
      name: q.text.length > 100 ? q.text.substring(0, 97) + '...' : q.text,
      suggestedAnswer: {
        '@type': 'Answer',
        text: q.options[q.correctAnswerIndex],
      },
      educationalLevel: q.difficulty,
    })),
    provider: {
      '@type': 'Organization',
      name: 'RevoChamp',
      url: 'https://revochamp.site',
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://revochamp.site' },
      { '@type': 'ListItem', position: 2, name: 'Mock Interview', item: 'https://revochamp.site/tech/mock-interview' },
      { '@type': 'ListItem', position: 3, name: category, item: `https://revochamp.site/tech/mock-interview/${category}` },
      { '@type': 'ListItem', position: 4, name: session.title, item: `https://revochamp.site/interview/${category}/${slug}` },
    ],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What is this ${category} mock test?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `This is a comprehensive ${category} mock test with ${session.questions.length} questions covering ${session.topics.slice(0, 3).join(', ')}. It simulates real technical interviews with timed conditions and provides detailed explanations.`,
        },
      },
      {
        '@type': 'Question',
        name: 'How long does the test take?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: `The test has a time limit of ${session.timeLimitMinutes} minutes. You can pause and resume, but we recommend completing it in one sitting.`,
        },
      },
      {
        '@type': 'Question',
        name: 'Will I get feedback on my answers?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! After each question, you receive immediate feedback with detailed explanations. At the end, you get a comprehensive report showing your strengths and areas for improvement.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is this test suitable for FAANG interview preparation?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Absolutely! Our questions are curated by FAANG interviewers and cover the exact topics and difficulty levels you\'ll encounter in top tech company interviews.',
        },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(quizSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </>
  );
}

function getEducationalLevel(session: TestSession): string {
  if (session.advancedCount > session.beginnerCount) return 'Advanced';
  if (session.intermediateCount > session.beginnerCount) return 'Intermediate';
  return 'Beginner';
}