import { BlogSummary, BlogPost } from '@/types/blog';

// ============================================
// Component for BLOG LISTING page (e.g., /blog)
// ============================================
export function BlogStructuredDataList({ posts }: { posts: BlogSummary[] }) {
  const itemListElement = posts.map((post, idx) => ({
    '@type': 'ListItem',
    position: idx + 1,
    item: {
      '@type': 'BlogPosting',
      url: `https://revochamp.site/blog/${post.slug}`,
      name: post.title,
    },
  }));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement,
    numberOfItems: posts.length,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// ============================================
// Component for SINGLE BLOG POST page (e.g., /blog/:slug)
// ============================================
export function BlogPostStructuredData({ post }: { post: BlogPost }) {
  // Ensure image is absolute URL
  const absoluteImage = post.image?.startsWith('http')
    ? post.image
    : `https://revochamp.site${post.image}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.summary,
    image: absoluteImage,
    url: `https://revochamp.site/blog/${post.slug}`,
    datePublished: post.date,
    dateModified: post.updatedAt || post.date,  // add updatedAt to your type
    author: {
      '@type': 'Person',
      name: post.author || 'RevoChamp',
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
      '@id': `https://revochamp.site/blog/${post.slug}`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// import { BlogSummary, BlogPost } from '@/types/blog';

// export function BlogStructuredDataList({ posts }: { posts: BlogSummary[] }) {
//   const itemListElement = posts.map((post, idx) => ({
//     '@type': 'ListItem',
//     position: idx + 1,
//     url: `https://revochamp.site/blog/${post.slug}`,
//     name: post.title,
//   }));
//   const jsonLd = {
//     '@context': 'https://schema.org',
//     '@type': 'ItemList',
//     itemListElement,
//     numberOfItems: posts.length,
//   };
//   return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
// }

// export function BlogPostStructuredData({ post }: { post: BlogPost }) {
//   const jsonLd = {
//     '@context': 'https://schema.org',
//     '@type': 'BlogPosting',
//     headline: post.title,
//     description: post.summary,
//     image: post.image,
//     datePublished: post.date,
//     author: { '@type': 'Person', name: post.author || 'RevoChamp' },
//     publisher: { '@type': 'Organization', name: 'RevoChamp', logo: { '@type': 'ImageObject', url: 'https://revochamp.site/logo.png' } },
//     mainEntityOfPage: { '@type': 'WebPage', '@id': `https://revochamp.site/blog/${post.slug}` },
//   };
//   return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
// }