// app/news/page.tsx
import { Suspense } from 'react';
// import NewsListClient from './NewsListClient';
import type { Metadata } from 'next';
import NewsListClient from './Newslistclient';

export const metadata: Metadata = {
  title: 'Latest News | NewsHub',
  description: 'Stay updated with the latest news on technology, business, finance, and more.',
  openGraph: {
    title: 'Latest News | NewsHub',
    description: 'Stay updated with the latest news on technology, business, finance, and more.',
    type: 'website',
  },
};

interface PageProps {
  searchParams?: Promise<{ page?: string; category?: string; q?: string }>;
}

export default async function NewsPage({ searchParams }: PageProps) {
  const params = await searchParams || {};
  const category = params.category || null;
  const query = params.q || '';
  const page = parseInt(params.page || '1');

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewsListClient
        initialCategory={category}
        initialQuery={query}
        initialPage={page}
      />
    </Suspense>
  );
}