export interface MockTutorialTopic {
  slug: string;
  title: string;
  emoji: string;
  category: string;
  level: string;
  estimatedHours?: number;
}

export interface ScreenConfig {
  hero?: { chips?: string[] };
  difficulties?: { name: string; color: string; icon: string }[];
  seo?: { emoji: string; title: string; description: string; tags: string[] };
  features?: {
    showHeroSection: boolean;
    showProgressSection: boolean;
    showStatsSection: boolean;
    showContinueBanner: boolean;
    showSearchFilters: boolean;
    showFloatingButton: boolean;
    enableAnimations: boolean;
    showCategorySection: boolean;
  };
}

export async function fetchTopics(category: string): Promise<MockTutorialTopic[]> {
  const res = await fetch(
    `https://json.revochamp.site/mockinterview/${category}/topics.json`,
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) throw new Error('Failed to fetch topics');
  const data = await res.json();
  return data.map((item: any) => ({
    slug: item.slug,
    title: item.title,
    emoji: item.emoji || '📘',
    category: item.category || 'Other',
    level: item.level || 'All Levels',
    estimatedHours: item.estimatedHours ? Number(item.estimatedHours) : undefined,
  }));
}

export async function fetchConfig(category: string): Promise<ScreenConfig | null> {
  const res = await fetch(
    `https://json.revochamp.site/mockinterview/${category}/config.json`,
    { next: { revalidate: 86400 } }
  );
  if (!res.ok) return null;
  return res.json();
}