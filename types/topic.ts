export interface TopicSEOConfig {
  pageTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  ogImageUrl: string;
  keywords: string[];
}
export interface TutorialTopic {
  slug: string;
  title: string;
  emoji: string;
  description?: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedHours?: number;
  topics?: string[];
  color?: string;


  estimatedMinutes?: number; // ✅ renamed (correct meaning)

  difficulty?: string;       // ✅ add this
  tags?: string[];           // ✅ add this

  progress?: number;         // ✅ future-ready (0–100)
}

export interface ScreenConfig {
  hero: HeroConfig;
  difficulties: DifficultyConfig[];
  seo: SEOConfig;
  features: FeatureFlags;
}

export interface HeroConfig {
  badge: string;
  title: string;
  highlightedText: string;
  description: string;
  chips: string[];
}

export interface DifficultyConfig {
  name: string;
  color: string;
  icon: string;
}

export interface SEOConfig {
  emoji: string;
  title: string;
  description: string;
  tags: string[];
}

export interface FeatureFlags {
  showProgressSection: boolean;
  showContinueBanner: boolean;
  showSearchFilters: boolean;
  showFloatingButton: boolean;
  showHeroSection: boolean;
  showStatsSection: boolean;
}