import { TutorialTopic } from '@/types/topic';
import { TutorialData, ContentItem } from './types';

const BASE_URL = 'https://json.revochamp.site';



// Fetch all categories from API  
export async function getAllCategories(): Promise<{ slug: string }[]> {
  const res = await fetch(`${BASE_URL}/categories`, { cache: 'force-cache' });
  if (!res.ok) {
    throw new Error(`Failed to fetch categories: ${res.status}`);
  }
  const data = await res.json();
  // Assuming API returns an array of objects with a 'slug' property
  return data.map((cat: any) => ({ slug: cat.slug }));
}



export async function fetchTopics(category: string): Promise<TutorialTopic[]> {
  const res = await fetch(`${BASE_URL}/${category.toLowerCase()}/topics.json`, {
    next: {revalidate: 10 }, // Revalidate every hour
  });
  if (!res.ok) throw new Error('Failed to fetch topics');
  return res.json();
}


export async function fetchTutorial(category: string, slug: string): Promise<TutorialData> {
  const res = await fetch(`${BASE_URL}/${category}/${slug}.json`, { next: {revalidate: 10 } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();

  return {
    title: json.title,
    subtitle: json.subtitle,
    difficulty: json.difficulty,
    readTime: json.readTime,
    meta: json.meta,
    faq: json.faq || [],
    content: parseContent(json.content || []),
    quiz: (json.quiz || []).map((q: any) => ({
      question: q.question,
      options: q.options,
      answer: q.answer,
      explanation: q.explanation,
    })),
    defaultCode: json.tryEditor?.defaultCode || '',
    relatedSlugs: json.related || [],
  };
}

function parseContent(raw: any[]): ContentItem[] {
  return raw.map((item) => {
    switch (item.type) {
      case 'code':
        return { type: 'code', value: item.value, language: item.language };
      case 'list':
        const listItems = Array.isArray(item.value) ? item.value : item.value.split('\n');
        return { type: 'list', value: listItems };
      case 'table':
        return { type: 'table', value: '', tableData: item.value };
      case 'callout':
        return { type: 'callout', value: item.value, variant: item.variant || 'info' };
      default:
        return { type: item.type, value: item.value };
    }
  });
}

// lib/fetchTutorial.ts (add after your other exports)

export async function fetchAllTutorialPaths(): Promise<{ category: string; slug: string }[]> {
  // 1. Get all categories
  const categories = await getAllCategories();
  const allPaths: { category: string; slug: string }[] = [];

  // 2. For each category, fetch its topics and collect slugs
  for (const cat of categories) {
    try {
      const topics = await fetchTopics(cat.slug);
      for (const topic of topics) {
        allPaths.push({
          category: cat.slug,
          slug: topic.slug,
        });
      }
    } catch (error) {
      console.error(`Failed to fetch topics for category ${cat.slug}:`, error);
      // Continue with other categories even if one fails
    }
  }

  return allPaths;
}