// lib/analytics.ts

// Simple analytics stub – replace with real Google Analytics / Firebase if needed
export const analytics = {
  trackTutorialView: (category: string, slug: string, title: string) => {
    console.log('[Analytics] Tutorial view:', { category, slug, title });
    // Example: gtag('event', 'view_tutorial', { category, slug, title });
  },
  trackSectionCompleted: (slug: string, section: string, progress: number) => {
    console.log('[Analytics] Section completed:', { slug, section, progress });
  },
  trackQuizSubmitted: (slug: string, score: number, total: number) => {
    console.log('[Analytics] Quiz submitted:', { slug, score, total });
  },
  trackCodeCopied: (slug: string, language: string) => {
    console.log('[Analytics] Code copied:', { slug, language });
  },
};