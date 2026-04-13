import { MockTutorialTopic } from "@/lib/mockInterview";


interface Props {
  category: string;
  topics: MockTutorialTopic[];
  config: any;
}

export default function StructuredData({ category, topics, config }: Props) {
  const capitalizedCategory = category.charAt(0).toUpperCase() + category.slice(1);
  const canonicalUrl = `https://revochamp.site/mock-interview/${category}`;
  
  const faqs = [
    {
      question: `What ${capitalizedCategory} mock interview tests are available?`,
      answer: `We offer ${topics.length}+ ${capitalizedCategory} mock interview tests covering ${topics.slice(0, 5).map(t => t.title).join(', ')}. Each test simulates real technical interviews with timed questions, instant feedback, and detailed explanations.`,
    },
    {
      question: `How do I prepare for a ${capitalizedCategory} technical interview?`,
      answer: `Start with beginner-friendly mock tests, review the explanations for each answer, and gradually move to advanced tests. Practice regularly and use our AI feedback to identify weak areas.`,
    },
    {
      question: `Are these ${capitalizedCategory} interview questions similar to FAANG interviews?`,
      answer: `Yes! Our questions are curated by FAANG interviewers and cover the exact topics and difficulty levels used by top tech companies.`,
    },
    {
      question: 'How long does each mock interview test take?',
      answer: 'Test durations vary from 15-60 minutes depending on the topic. We recommend completing tests in one sitting to simulate real interview conditions.',
    },
    {
      question: 'Will I get a score and feedback after completing a test?',
      answer: 'Absolutely! After each test, you\'ll receive a comprehensive score report including percentage, points earned, accuracy rate, and detailed feedback on each question.',
    },
    {
      question: 'Can I retake the mock interview tests?',
      answer: 'Yes! You can retake any test unlimited times. We recommend spacing out retakes to measure improvement.',
    },
    {
      question: 'Is this mock interview preparation free?',
      answer: `Yes! All ${topics.length}+ ${capitalizedCategory} mock interview tests on RevoChamp are completely free.`,
    },
  ];

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${capitalizedCategory} Mock Interview Tests`,
    headline: `Practice ${capitalizedCategory} Technical Interviews`,
    description: `Prepare for ${capitalizedCategory} interviews with ${topics.length}+ mock tests.`,
    url: canonicalUrl,
    inLanguage: 'en',
    isPartOf: {
      '@type': 'WebSite',
      name: 'RevoChamp',
      url: 'https://revochamp.site',
    },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: topics.length,
      itemListElement: topics.slice(0, 20).map((topic, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Course',
          name: topic.title,
          url: `https://revochamp.site/tech/interview/${category}/${topic.slug}`,
          description: `Practice ${topic.title} - Mock interview test with AI feedback`,
          provider: {
            '@type': 'Organization',
            name: 'RevoChamp',
          },
        },
      })),
    },
    about: {
      '@type': 'Thing',
      name: `${category} Interview Preparation`,
      description: `Technical interview practice for ${category} roles`,
    },
    educationalLevel: ['Beginner', 'Intermediate', 'Advanced'],
    teaches: category,
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://revochamp.site/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Mock Interview',
        item: 'https://revochamp.site/mock-interview',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: `${capitalizedCategory} Mock Interview`,
        item: canonicalUrl,
      },
    ],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        id="collection-schema"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <script
        type="application/ld+json"
        id="breadcrumb-schema"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        id="faq-schema"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}