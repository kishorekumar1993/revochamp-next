import { BlogResponse, } from '@/types/blog';


const BASE_URL = 'https://json.revochamp.site/blog';

// Correct URL patterns based on your working links
const ALL_POSTS_URL = (page: number) => `${BASE_URL}/page/page-${page}.json`;
const CATEGORY_URL = (category: string, page: number) => `${BASE_URL}/category/${category}/page-${page}.json`;
const SINGLE_POST_URL = (slug: string) => `${BASE_URL}/${slug}.json`;

async function safeFetch<T>(url: string, fallback: T): Promise<T> {
  try {
    console.log(`[safeFetch] ${url}`);
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) {
      console.error(`[safeFetch] HTTP ${res.status} for ${url}`);
      return fallback;
    }
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      console.error(`[safeFetch] Invalid JSON: ${text.slice(0, 100)}`);
      return fallback;
    }
  } catch (err) {
    console.error(`[safeFetch] Network error: ${err}`);
    return fallback;
  }
}

function normalizeResponse(raw: any, page: number): BlogResponse {
  // If response already has { data, totalPages }
  if (raw && Array.isArray(raw.data)) {
    const posts = raw.data.map((p: any, i: number) => ({
      ...p,
      id: p.id || p.slug || `post-${page}-${i}`,
    }));
    return { data: posts, totalPages: raw.totalPages || 1, page };
  }
  // If response is a raw array
  if (Array.isArray(raw)) {
    const posts = raw.map((p: any, i: number) => ({
      ...p,
      id: p.id || p.slug || `post-${page}-${i}`,
    }));
    return { data: posts, totalPages: 1, page };
  }
  // Fallback
  return { data: [], totalPages: 1, page };
}

export async function fetchBlogPage(page: number): Promise<BlogResponse> {
  const url = ALL_POSTS_URL(page);
  const raw = await safeFetch<any>(url, null);
  if (!raw) return { data: [], totalPages: 1, page };
  return normalizeResponse(raw, page);
}

export async function fetchCategoryPage(category: string, page: number): Promise<BlogResponse> {
  const url = CATEGORY_URL(category.toLowerCase(), page);
  const raw = await safeFetch<any>(url, null);
  if (!raw) return { data: [], totalPages: 1, page };
  return normalizeResponse(raw, page);
}

