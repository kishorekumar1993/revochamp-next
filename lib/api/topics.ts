// lib/api/topics.ts
import { TutorialTopic, ScreenConfig } from '@/types/topic';

const JSON_BASE = 'https://json.revochamp.site';

interface Course {
  category: string;
  slug: string;
}

export async function getAllCategories(): Promise<{ slug: string }[]> {
  const res = await fetch('https://json.revochamp.site/tech/category.json', {
    next: { revalidate: 3600 }
  });
  if (!res.ok) throw new Error(`Failed to fetch categories: ${res.status}`);
  const data = await res.json() as { courses: Course[] };
  const uniqueCategories = [...new Set(data.courses.map(c => c.category))];
  return uniqueCategories.map(cat => ({ slug: cat.toLowerCase().replace(/\s+/g, '-') }));
}

export async function fetchTopics(category: string): Promise<TutorialTopic[]> {
  const res = await fetch(`${JSON_BASE}/${category.toLowerCase()}/topics.json`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`Failed to fetch topics for ${category}`);
  return res.json();
}

export async function fetchConfig(category: string): Promise<ScreenConfig> {
  try {
    const res = await fetch(`${JSON_BASE}/${category.toLowerCase()}/config.json`, {
      next: { revalidate: 86400 },
    });
    if (res.ok) return res.json();
  } catch (e) {
    console.warn('Config not found, using defaults');
  }
  return getDefaultConfig();
}

function getDefaultConfig(): ScreenConfig {
  return {
    hero: {
      badge: '🎯 Learning Hub',
      title: 'Master',
      highlightedText: 'with confidence',
      description: 'Start your learning journey today.',
      chips: ['📱 Cross-platform', '⚡ Fast Development'],
    },
    difficulties: [
      { name: 'All', color: '#64748b', icon: '🎯' },
      { name: 'Beginner', color: '#11998E', icon: '🌱' },
      { name: 'Intermediate', color: '#1e40af', icon: '⚡' },
      { name: 'Advanced', color: '#FF416C', icon: '🚀' },
    ],
    seo: {
      emoji: '📚',
      title: 'About This Tutorial Series',
      description: 'Learn programming with our comprehensive tutorials.',
      tags: [],
    },
    features: {
      showProgressSection: true,
      showContinueBanner: true,
      showSearchFilters: true,
      showFloatingButton: true,
      showHeroSection: true,
      showStatsSection: true,
    },
  };
}