export default function MockInterviewStructuredData() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Mock Interviews',
    description:
      'Practice technical interviews with real‑world scenarios. FAANG‑level prep.',
    url: 'https://revochamp.site/tech/mock-interview',
    inLanguage: 'en',
    publisher: {
      '@type': 'Organization',
      name: 'RevoChamp',
    },
  };

  return (
    <script
      type="application/ld+json"
      id="mock-interview-schema"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}