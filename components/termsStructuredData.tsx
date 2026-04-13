export default function TermsStructuredData() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Terms of Service',
    description: 'Review RevoChamp terms and conditions to understand your rights and responsibilities.',
    url: 'https://revochamp.site/tech/terms',
    keywords:
      'terms of service RevoChamp, user agreement, platform terms, legal conditions, learning platform rules',
    dateModified: '2026-01-01',
    inLanguage: 'en',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': 'https://revochamp.site/tech/terms',
    },
    publisher: {
      '@type': 'Organization',
      name: 'RevoChamp',
      url: 'https://revochamp.site',
    },
  };

  const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://revochamp.site/tech',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Terms of Service',
      item: 'https://revochamp.site/tech/terms',
    },
  ],
};
  return (
    <script
      type="application/ld+json"
      id="terms-schema"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}