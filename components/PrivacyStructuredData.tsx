export default function PrivacyStructuredData() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Privacy Policy',
    description: 'Read RevoChamp privacy policy to understand how we collect, use, and protect your data securely.',
    url: 'https://revochamp.site/tech/privacy',
    inLanguage: 'en',
    dateModified: '2026-01-01',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': 'https://revochamp.site/tech/privacy',
    },
    publisher: {
      '@type': 'Organization',
      name: 'RevoChamp',
    },
  };

  return (
    <script
      type="application/ld+json"
      id="privacy-schema"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}