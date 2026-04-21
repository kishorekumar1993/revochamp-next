import React from "react";

// types/news.ts
export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  image: string;
  date: string;
  author: string;
  readTime: string;
  featured?: boolean;
}

export interface NewsDetail extends NewsArticle {
  subtitle: string;
  authorImage: string;
  authorBio: string;
  content: string;
  tags: string[];
  relatedArticles: Array<{
    slug: string;
    title: string;
    category: string;
    image: string;
  }>;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  totalPages: number;
  totalItems: number;
}

// lib/news-utils.ts
export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatTimeAgo(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const seconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (const [key, value] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / value);
    if (interval >= 1) {
      return interval === 1 ? `1 ${key} ago` : `${interval} ${key}s ago`;
    }
  }

  return 'Just now';
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function truncateText(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length).trim() + '...';
}

export function calculateReadTime(content: string): string {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

export function extractExcerpt(content: string, length: number = 150): string {
  // Remove HTML tags if present
  const cleanContent = content.replace(/<[^>]*>/g, '');
  return truncateText(cleanContent, length);
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    'Technology': 'bg-blue-100 text-blue-700',
    'Business': 'bg-purple-100 text-purple-700',
    'Finance': 'bg-green-100 text-green-700',
    'Startups': 'bg-orange-100 text-orange-700',
    'AI & ML': 'bg-pink-100 text-pink-700',
    'Markets': 'bg-indigo-100 text-indigo-700',
    'Trends': 'bg-cyan-100 text-cyan-700',
  };
  return colors[category] || 'bg-gray-100 text-gray-700';
}

// lib/news-api.ts (Example with mock data)
export const MOCK_ARTICLES = {
  'ai-revolution-2024': {
    id: '1',
    slug: 'ai-revolution-2024',
    title: 'The AI Revolution: How Machine Learning is Reshaping Industries',
    excerpt: 'Artificial intelligence continues to transform business landscapes at an unprecedented pace.',
    subtitle: 'From healthcare to finance, artificial intelligence is transforming every sector of the economy.',
    category: 'AI & ML',
    image: 'https://images.unsplash.com/photo-1677442d019cecf8dc0b47dc1d4d27c0?w=1200&h=630&fit=crop',
    date: 'January 15, 2024',
    author: 'Sarah Chen',
    authorImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop',
    authorBio: 'Technology correspondent with 10 years of experience.',
    readTime: '8 min read',
    featured: true,
    content: 'Article content here...',
    tags: ['AI', 'Machine Learning', 'Technology', 'Innovation'],
    relatedArticles: [
      {
        slug: 'startup-funding-surge',
        title: 'Startup Funding Reaches $50B',
        category: 'Startups',
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
      },
    ],
  },
};

// Example API functions (replace with real API calls)
export async function fetchNewsList(
  page: number = 1,
  category?: string | null,
  query?: string
) {
  // TODO: Replace with real API call
  // const params = new URLSearchParams({
  //   page: page.toString(),
  //   ...(category && { category }),
  //   ...(query && { q: query }),
  // });
  // const response = await fetch(`${API_URL}/news?${params}`);
  // return response.json();

  // Mock implementation
  const articles = Object.values(MOCK_ARTICLES);
  return {
    data: articles,
    page,
    totalPages: 3,
    totalItems: articles.length,
  };
}

export async function fetchNewsDetail(slug: string) {
  // TODO: Replace with real API call
  // const response = await fetch(`${API_URL}/news/${slug}`);
  // return response.json();

  // Mock implementation
  return MOCK_ARTICLES[slug as keyof typeof MOCK_ARTICLES] || null;
}

export async function fetchNewsSlugs() {
  // TODO: Replace with real API call
  // const response = await fetch(`${API_URL}/news/slugs`);
  // return response.json();

  // Mock implementation
  return Object.keys(MOCK_ARTICLES);
}

// Composable hooks examples (for future use)
export function useNewsSearch(initialQuery: string = '') {
  // Example hook for search functionality
  const [query, setQuery] = React.useState(initialQuery);
  
  return {
    query,
    setQuery,
    handleSearch: (newQuery: string) => setQuery(newQuery),
  };
}

export function useNewsPagination(initialPage: number = 1) {
  // Example hook for pagination
  const [page, setPage] = React.useState(initialPage);
  
  return {
    page,
    setPage,
    nextPage: () => setPage(p => p + 1),
    prevPage: () => setPage(p => Math.max(p - 1, 1)),
  };
}