export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'RevoChamp',
    url: 'https://revochamp.site',
    logo: 'https://revochamp.site/logo.png',
    description: 'Free technology tutorials and comprehensive learning resources for modern developers',
    sameAs: [
      'https://twitter.com/revochamp',
      'https://linkedin.com/company/revochamp',
      'https://github.com/revochamp',
    ],
  };
}

export function generateCollectionPageSchema(
  category: string,
  topics: any[],
  description: string,
  canonicalUrl: string
) {
  const itemListElement = topics.slice(0, 20).map((topic, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'Article',
      name: topic.title,
      url: `https://revochamp.site/tech/${category.toLowerCase()}/${topic.slug}`,
      description: `Learn ${topic.title} - ${topic.emoji} tutorial with practical examples`,
    },
  }));

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${capitalize(category)} Tutorials Library`,
    headline: `Comprehensive ${capitalize(category)} Learning Resources`,
    description,
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
      itemListElement,
    },
    about: {
      '@type': 'Thing',
      name: category,
      description: `Technology tutorials and programming resources for ${category}`,
    },
    educationalLevel: ['Beginner', 'Intermediate', 'Advanced'],
    teaches: category,
  };
}

export function generateBreadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
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
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}