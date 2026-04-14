import { BlogSummary, BlogPost } from '@/types/blog';

// components/blog/BlogStructuredData.tsx
export function BlogStructuredDataList({ posts }: { posts: { slug: string; title: string; date?: string }[] }) {
  if (!posts?.length) return null;

  const itemListElement = posts.map((post, idx) => ({
    '@type': 'ListItem',
    position: idx + 1,
    url: `https://revochamp.site/blog/${post.slug}`,
    name: post.title,
  }));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement,
    numberOfItems: posts.length,
  };

  return (
    <script
      id="blog-itemlist-schema"   // fixed ID, no duplicate
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// export function BlogStructuredDataList({ posts }: { posts: BlogSummary[] }) {
//     if (!posts || posts.length === 0) return null; // ✅ prevent empty duplicate


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
//   return (
//     <script
//       id="blog-itemlist-schema"   // <-- ADD THIS LINE
//       type="application/ld+json"
//       dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
//     />
//   );
// }

export function BlogPostStructuredData({ post }: { post: BlogPost }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.summary,
    image: post.image,
    datePublished: post.date,
    author: { '@type': 'Person', name: post.author || 'RevoChamp' },
    publisher: { '@type': 'Organization', name: 'RevoChamp', logo: { '@type': 'ImageObject', url: 'https://revochamp.site/logo.png' } },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://revochamp.site/blog/${post.slug}` },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
}