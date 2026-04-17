import { Suspense } from 'react';
import BlogListClient from './BlogListClient';
import { BlogStructuredDataList } from '@/components/blog/BlogStructuredData';
import { getMinimalBlogList } from '@/lib/blog-service'; // new helper

interface PageProps {
  searchParams?: Promise<{ page?: string; category?: string; q?: string }>;
}

// Server component: only fetches minimal data for structured data (titles + slugs)
export default async function BlogPage({ searchParams }: PageProps) {
  const params = await searchParams || {};
  const category = params.category || null;

  // Fetch only what's needed for schema: titles, slugs, and maybe dates
  // This is a lightweight API call, not the full post content.
  let minimalPosts: { slug: string; title: string; date: string; }[] = [];
  try {
    minimalPosts = await getMinimalBlogList(category); // returns { slug, title, date }[]
  } catch (err) {
    console.error('Failed to fetch minimal blog list for schema:', err);
  }

  return (
    <>
      {/* Structured data uses only minimal data – no heavy content */}
      <BlogStructuredDataList posts={minimalPosts} />
      {/* Client component will fetch actual posts on mount */}
      <BlogListClient
        initialCategory={category}
        initialQuery={params.q || ''}
        initialPage={parseInt(params.page || '1')}
      />
    </>
  );
}

