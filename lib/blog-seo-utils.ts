// lib/blog-seo-utils.ts
import { BlogPost } from '@/types/blog-detail';  // change import


// Helper to safely get ISO string from either Date or string
function toIsoDate(date: Date | string): string {
  if (date instanceof Date) return date.toISOString();
  return new Date(date).toISOString();
}
export function generateArticleJsonLd(post: BlogPost, slug: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.subtitle || post.meta?.description || '',
    image: post.featuredImage,
    datePublished:  toIsoDate(post.date),
    dateModified: toIsoDate(post.date),
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'RevoChamp',
      logo: {
        '@type': 'ImageObject',
        url: 'https://revochamp.site/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://revochamp.site/blog/${slug}`,
    },
  };
}

// Similarly adjust generateBreadcrumbJsonLd and generateFaqJsonLd if they use other fields
export function generateBreadcrumbJsonLd(title: string, slug: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Blog',
        item: 'https://revochamp.site/blog',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: title,
        item: `https://revochamp.site/blog/${slug}`,
      },
    ],
  };
}

export function generateFaqJsonLd(faqs: Array<{ question: string; answer: string }>) {
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
