// components/mock-interview/MockInterviewStructuredData.tsx
export default function MockInterviewStructuredData() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://revochamp.site';
  const pageUrl = `${baseUrl}/tech/mock-interview`;

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': pageUrl,
        url: pageUrl,
        name: 'Mock Interviews | Practice Technical Interviews & Get Hired',
        description:
          'Ace your FAANG+ technical interviews with realistic mock interviews, instant AI feedback, and expert-curated questions.',
        isPartOf: {
          '@id': `${baseUrl}/#website`,
        },
        inLanguage: 'en-US',
        about: {
          '@type': 'Thing',
          name: 'Technical Interview Preparation',
          sameAs: 'https://en.wikipedia.org/wiki/Technical_interview',
        },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: `${baseUrl}/tech/mock-interview-og.png`,
          width: 1200,
          height: 630,
        },
        breadcrumb: {
          '@id': `${pageUrl}#breadcrumb`,
        },
        potentialAction: {
          '@type': 'UseAction',
          target: `${pageUrl}#start-mock-interview`,
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${pageUrl}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: baseUrl,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Tech',
            item: `${baseUrl}/tech`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Mock Interviews',
            item: pageUrl,
          },
        ],
      },
      // Optional: Add FAQ schema if you have common questions on this page
      {
        '@type': 'FAQPage',
        '@id': `${pageUrl}#faq`,
        mainEntity: [
          {
            '@type': 'Question',
            name: 'How do mock interviews work at RevoChamp?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'You choose a track (coding, system design, behavioral), answer questions in real-time, and receive AI-generated feedback on correctness, communication, and efficiency.',
            },
          },
          {
            '@type': 'Question',
            name: 'Is this free?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'We offer a free tier with basic mock interviews and premium plans with detailed feedback and unlimited attempts.',
            },
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

// export default function MockInterviewStructuredData() {
//   const jsonLd = {
//     '@context': 'https://schema.org',
//     '@type': 'CollectionPage',
//     name: 'Mock Interviews',
//     description:
//       'Practice technical interviews with real‑world scenarios. FAANG‑level prep.',
//     url: 'https://revochamp.site/tech/mock-interview',
//     inLanguage: 'en',
//     publisher: {
//       '@type': 'Organization',
//       name: 'RevoChamp',
//     },
//   };

//   return (
//     <script
//       type="application/ld+json"
//       id="mock-interview-schema"
//       dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
//     />
//   );
// }