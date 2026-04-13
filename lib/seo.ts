import { ContentItem, TutorialData } from "./types";

export function generateStructuredData(
  tutorial: TutorialData,
  category: string,
  slug: string
) {
  const baseUrl = 'https://revochamp.site';
  const pageUrl = `${baseUrl}/tech/${category}/${slug}`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TechArticle',
        '@id': pageUrl,
        headline: tutorial.title,
        description: tutorial.subtitle,
        image: tutorial.meta?.image || `${baseUrl}/og-default.png`,
        author: { '@type': 'Organization', name: 'Revochamp', url: baseUrl },
        datePublished: tutorial.meta?.datePublished || new Date().toISOString(),
        dateModified: tutorial.meta?.dateModified || new Date().toISOString(),
        articleBody: extractArticleBody(tutorial.content),
        learningResourceType: 'Tutorial',
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
          { '@type': 'ListItem', position: 2, name: category.toUpperCase(), item: `${baseUrl}/tech/${category}` },
          { '@type': 'ListItem', position: 3, name: tutorial.title, item: pageUrl },
        ],
      },
      ...(tutorial.faq.length > 0 ? [{
        '@type': 'FAQPage',
        mainEntity: tutorial.faq.map(f => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: { '@type': 'Answer', text: f.answer },
        })),
      }] : []),
    ],
  };
}

function extractArticleBody(content: ContentItem[]): string {
  return content
    .filter(item => item.type === 'text')
    .map(item => item.value)
    .join('\n\n')
    .substring(0, 5000);
}