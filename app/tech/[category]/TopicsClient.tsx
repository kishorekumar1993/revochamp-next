
'use client';

import { useState, useEffect, useMemo, useCallback, useRef, lazy, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { TutorialTopic, ScreenConfig } from '@/types/topic';
import TopicHero from '@/components/topics/TopicHero';
import TopicProgress from '@/components/topics/TopicProgress';
import TopicStats from '@/components/topics/TopicStats';
import TopicContinueBanner from '@/components/topics/TopicContinueBanner';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { motion, AnimatePresence } from 'framer-motion';
import React from 'react';

// Icons as simple inline SVGs
const Icons = {
  Back: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  ),
  Share: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
    </svg>
  ),
  Search: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  Clear: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  Refresh: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  ),
  Empty: () => (
    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  ChevronRight: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  ),
  Clock: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

// ----------------------------------------------------------------------------
// Toast notification (simple, replace with your preferred toast library)
// ----------------------------------------------------------------------------
function showToast(message: string, type: 'success' | 'error' = 'success') {
  // You can replace this with a proper toast library like react-hot-toast
  const toastDiv = document.createElement('div');
  toastDiv.className = `fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-lg shadow-lg text-white text-sm ${
    type === 'success' ? 'bg-green-600' : 'bg-red-600'
  }`;
  toastDiv.textContent = message;
  document.body.appendChild(toastDiv);
  setTimeout(() => {
    toastDiv.remove();
  }, 3000);
}

// ----------------------------------------------------------------------------
// localStorage helper (safe & reusable)
// ----------------------------------------------------------------------------
const storage = {
  get: <T,>(key: string, defaultValue: T): T => {
    if (typeof window === 'undefined') return defaultValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  set: <T,>(key: string, value: T): void => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Failed to save ${key}`, e);
    }
  },
};

// ----------------------------------------------------------------------------
// Memoized Topic Card Component (prevents unnecessary re-renders)
// ----------------------------------------------------------------------------
const TopicCard = React.memo(
  ({
    topic,
    isCompleted,
    onClick,
  }: {
    topic: TutorialTopic;
    isCompleted: boolean;
    onClick: (topic: TutorialTopic) => void;
  }) => {
    const handleClick = (e: React.MouseEvent) => {
      e.preventDefault();
      onClick(topic);
    };

    return (
      
      <Link
        href={`/tech/${topic.category.toLowerCase()}/${topic.slug}`}
        onClick={handleClick}

  className="block no-underline text-inherit hover:no-underline focus:no-underline"
        >
        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className={`group relative p-4 sm:p-5 bg-white border rounded-xl transition-all hover:shadow-lg ${
            isCompleted
              ? 'border-green-200 bg-green-50/30'
              : 'border-gray-200 hover:border-indigo-300'
          }`}
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl sm:text-3xl" aria-hidden="true">
              {topic.emoji}
            </span>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-800 text-sm sm:text-base mb-1 line-clamp-2">
                {topic.title}
              </h3>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span
                  className={`px-2 py-0.5 rounded-full ${
                    topic.level === 'Beginner'
                      ? 'bg-green-100 text-green-700'
                      : topic.level === 'Intermediate'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {topic.level}
                </span>
                {topic.estimatedHours && (
                  <span className="flex items-center gap-1 text-gray-500">
                    <Icons.Clock />
                    {topic.estimatedHours}h
                  </span>
                )}
              </div>
            </div>
            {isCompleted && (
              <div className="text-green-600 text-lg" aria-label="Completed">
                ✓
              </div>
            )}
          </div>
          {isCompleted && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-500 rounded-b-xl" />
          )}
        </motion.div>
      </Link>
    );
  }
);
TopicCard.displayName = 'TopicCard';










// Skeleton card for loading state
const SkeletonCard = () => (
  <div className="p-4 sm:p-5 bg-gray-50 border border-gray-100 rounded-xl animate-pulse">
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 bg-gray-200 rounded-full" />
      <div className="flex-1">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
      </div>
    </div>
  </div>
);

// ----------------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------------
interface Props {
  initialTopics: TutorialTopic[];
  initialConfig: ScreenConfig;
  category: string;
}

export default function TopicsClient({ initialTopics, initialConfig, category }: Props) {
  const router = useRouter();
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // State
  const [completedTopics, setCompletedTopics] = useState<string[]>([]);
  const [lastTopicSlug, setLastTopicSlug] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [displayCount, setDisplayCount] = useState(20);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 250);

  // Load persisted data
  useEffect(() => {
    const storedCompleted = storage.get<string[]>(`completed_${category}`, []);
    const storedLast = storage.get<string>(`last_topic_${category}`, '');
    setCompletedTopics(storedCompleted);
    setLastTopicSlug(storedLast);
  }, [category]);

  // Save completed topics
  useEffect(() => {
    storage.set(`completed_${category}`, completedTopics);
  }, [completedTopics, category]);

  const updateLastTopic = useCallback(
    (slug: string) => {
      setLastTopicSlug(slug);
      storage.set(`last_topic_${category}`, slug);
    },
    [category]
  );

  // Filter topics
  const filteredTopics = useMemo(() => {
    let filtered = initialTopics;
    if (debouncedSearch.trim()) {
      const query = debouncedSearch.toLowerCase();
      filtered = filtered.filter(
        (t) => t.title.toLowerCase().includes(query) || t.category.toLowerCase().includes(query)
      );
    }
    if (selectedDifficulty !== 'All') {
      filtered = filtered.filter((t) => t.level === selectedDifficulty);
    }
    return filtered;
  }, [initialTopics, debouncedSearch, selectedDifficulty]);

  const totalFilteredCount = filteredTopics.length;
  const displayTopics = useMemo(
    () => filteredTopics.slice(0, displayCount),
    [filteredTopics, displayCount]
  );

  // Group topics by category
  const groupedDisplayTopics = useMemo(() => {
    const groups: Record<string, TutorialTopic[]> = {};
    displayTopics.forEach((topic) => {
      const cat = topic.category || 'General Topics';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(topic);
    });
    Object.keys(groups).forEach((key) => {
      groups[key].sort((a, b) => a.title.localeCompare(b.title));
    });
    return groups;
  }, [displayTopics]);

  const progress = useMemo(
    () => (initialTopics.length ? (completedTopics.length / initialTopics.length) * 100 : 0),
    [completedTopics.length, initialTopics.length]
  );

  const lastTopic = useMemo(() => {
    if (!lastTopicSlug) return null;
    return initialTopics.find((t) => t.slug === lastTopicSlug) || null;
  }, [initialTopics, lastTopicSlug]);

  // Reset display count when filters change
  useEffect(() => {
    setDisplayCount(20);
  }, [debouncedSearch, selectedDifficulty]);

  // IntersectionObserver for infinite scroll (replaces scroll listener)
  useEffect(() => {
    if (!loadMoreRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && displayCount < totalFilteredCount && !isLoadingMore) {
          setIsLoadingMore(true);
          // Simulate loading delay for smooth UX
          setTimeout(() => {
            setDisplayCount((prev) => Math.min(prev + 20, totalFilteredCount));
            setIsLoadingMore(false);
          }, 300);
        }
      },
      { threshold: 0.5, rootMargin: '0px 0px 200px 0px' }
    );
    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [displayCount, totalFilteredCount, isLoadingMore]);

  const handleTopicClick = useCallback(
    (topic: TutorialTopic) => {
      if (!completedTopics.includes(topic.slug)) {
        setCompletedTopics((prev) => [...prev, topic.slug]);
      }
      updateLastTopic(topic.slug);
      router.push(`/tech/${category.toLowerCase()}/${topic.slug}`);
    },
    [completedTopics, updateLastTopic, router, category]
  );

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedDifficulty('All');
  };

  const handleShare = async () => {
    const url = `https://revochamp.site/tech/${category.toLowerCase()}`;
    if (typeof navigator === 'undefined') return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${capitalize(category)} Tutorials - RevoChamp`,
          text: `Check out these free ${category} tutorials!`,
          url,
        });
      } catch (e) {
        // User cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        showToast('Link copied to clipboard!', 'success');
      } catch (e) {
        console.error('Clipboard failed', e);
        showToast('Failed to copy link', 'error');
      }
    }
  };

  const totalHours = useMemo(
    () => initialTopics.reduce((sum, t) => sum + (t.estimatedHours || 0), 0),
    [initialTopics]
  );

  // JSON-LD structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${capitalize(category)} Tutorials`,
    description: `Learn ${category} with free tutorials. ${initialTopics.length} topics from beginner to advanced.`,
    url: `https://revochamp.site/tech/${category.toLowerCase()}`,
    numberOfItems: initialTopics.length,
    about: {
      '@type': 'Thing',
      name: category,
    },
    educationalLevel: ['Beginner', 'Intermediate', 'Advanced'],
    teaches: initialTopics.slice(0, 5).map((t) => t.title),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-white" style={{ height: '100vh', overflowY: 'auto' }}>
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                aria-label="Go back"
              >
                <Icons.Back />
              </button> */}

              <button className="back-btn" onClick={() => router.back()}>
              <span className="material-icons">arrow_back_ios_new</span>
            </button>
            
              <div>
                <h1 className="text-base sm:text-lg font-bold text-gray-900">
                  {capitalize(category)} Tutorials
                </h1>
                <p className="text-xs text-gray-500">{initialTopics.length} topics</p>
              </div>
            </div>
            {/* <button
              onClick={handleShare}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              aria-label="Share this page"
            >
              <Icons.Share />
            </button> */}


              <button className="back-btn" onClick={handleShare}>
              <span className="material-icons">share</span>
            </button>
            
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-3 sm:px-6 pb-12">
          {/* Hero Section */}
          {initialConfig.features.showHeroSection && (
            <section className="mb-6 sm:mb-8" aria-label="Hero">
              <TopicHero
                category={category}
                topicCount={initialTopics.length}
                config={initialConfig.hero}
              />
            </section>
          )}

          {/* Stats & Progress */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-5 sm:mb-6">
            {initialConfig.features.showStatsSection && (
              <TopicStats
                topicCount={initialTopics.length}
                completedCount={completedTopics.length}
                totalHours={totalHours}
              />
            )}
            {initialConfig.features.showProgressSection && (
              <TopicProgress
                progress={progress}
                completed={completedTopics.length}
                total={initialTopics.length}
              />
            )}
          </div>

          {/* Continue Banner */}
          {initialConfig.features.showContinueBanner && lastTopic && (
            <section className="mb-5 sm:mb-6" aria-label="Continue where you left off">
              <TopicContinueBanner
                topic={lastTopic}
                onClick={() => router.push(`/tech/${category.toLowerCase()}/${lastTopic.slug}`)}
              />
            </section>
          )}

          {/* Search & Filters */}
          {initialConfig.features.showSearchFilters && (
            <section className="space-y-4 mb-6" aria-label="Search and filter topics">
              {/* Search Bar */}
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Icons.Search />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search ${initialTopics.length} ${category} topics...`}
                  className="w-full pl-10 pr-10 py-3 text-sm bg-white border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-shadow"
                  aria-label="Search topics"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label="Clear search"
                  >
                    <Icons.Clear />
                  </button>
                )}
              </div>

              {/* Difficulty Filters */}
              <div className="flex flex-wrap gap-2" role="group" aria-label="Difficulty filters">
                <button
                  onClick={() => setSelectedDifficulty('All')}
                  className={`px-3 py-1.5 text-xs sm:text-sm rounded-full border transition-all ${
                    selectedDifficulty === 'All'
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'
                  }`}
                  aria-pressed={selectedDifficulty === 'All'}
                >
                  All Levels
                </button>
                {initialConfig.difficulties.map((diff) => (
                  <button
                    key={diff.name}
                    onClick={() => setSelectedDifficulty(diff.name)}
                    className={`px-3 py-1.5 text-xs sm:text-sm rounded-full border transition-all flex items-center gap-1 ${
                      selectedDifficulty === diff.name
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'
                    }`}
                    aria-pressed={selectedDifficulty === diff.name}
                  >
                    <span>{diff.icon}</span>
                    <span>{diff.name}</span>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Filter Status */}
          {(searchQuery || selectedDifficulty !== 'All') && (
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs sm:text-sm text-gray-600">
                Found <strong>{totalFilteredCount}</strong> result{totalFilteredCount !== 1 ? 's' : ''}
              </span>
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 px-3 py-1.5 text-xs text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                aria-label="Clear all filters"
              >
                <Icons.Refresh />
                Clear filters
              </button>
            </div>
          )}

          {/* Topics Grid */}
          {totalFilteredCount === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="text-gray-300 mb-4">
                <Icons.Empty />
              </div>
              <h2 className="text-lg font-semibold text-gray-800 mb-2">No topics found</h2>
              <p className="text-sm text-gray-500 mb-4">Try adjusting your search or filter</p>
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Icons.Refresh />
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(groupedDisplayTopics).map(([groupName, topics]) => (
                <section key={groupName} aria-labelledby={`group-${groupName.replace(/\s/g, '-')}`}>
                  <h2
                    id={`group-${groupName.replace(/\s/g, '-')}`}
                    className="text-lg sm:text-xl font-bold text-gray-800 mb-3 flex items-center gap-2"
                  >
                    {groupName}
                    <span className="text-xs font-normal text-gray-400">({topics.length})</span>
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                    {topics.map((topic) => (
                      <TopicCard
                        key={topic.slug}
                        topic={topic}
                        isCompleted={completedTopics.includes(topic.slug)}
                        onClick={handleTopicClick}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}

          {/* Infinite scroll sentinel */}
          {displayCount < totalFilteredCount && (
            <div ref={loadMoreRef} className="flex justify-center py-8">
              {isLoadingMore ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-7 h-7 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs text-gray-400">Loading more topics...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 w-full">
                  {[...Array(6)].map((_, i) => (
                    <SkeletonCard key={i} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SEO Footer */}
          <section className="mt-12 sm:mt-16" aria-label="About these tutorials">
            <div className="bg-gray-50 border border-gray-200 rounded-xl sm:rounded-2xl p-5 sm:p-8 text-center">
              <span className="text-4xl sm:text-5xl mb-4 block" aria-hidden="true">
                {initialConfig.seo.emoji}
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
                {initialConfig.seo.title.replace('{category}', capitalize(category))}
              </h2>
              <p className="text-sm text-gray-600 max-w-2xl mx-auto">
                {initialConfig.seo.description.replace('{category}', category)}
              </p>
              {initialConfig.seo.tags.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2 mt-5" aria-label="Topics covered">
                  {initialConfig.seo.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs text-gray-600 shadow-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </>
  );
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}