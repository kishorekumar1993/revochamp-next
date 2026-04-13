"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MockTutorialTopic, ScreenConfig } from "@/lib/mockInterview";
import QuizTopicCard from "@/components/mock-interview/QuizTopicCard";
import {
  ArrowUpRight,
  ChevronLeft,
  Command,
  Info,
  MoreHorizontal,
  MoreVertical,
  Search,
  Share,
  Share2,
} from "lucide-react";
// import { TutorialTopic, ScreenConfig } from '@/lib/mockInterview';
// import QuizTopicCard from '@/components/QuizTopicCard';

interface Props {
  category: string;
  initialTopics: MockTutorialTopic[];
  config: ScreenConfig | null;
}

export default function MockInterviewClient({
  category,
  initialTopics,
  config,
}: Props) {
  const router = useRouter();
  const [allTopics] = useState<MockTutorialTopic[]>(initialTopics);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [displayCount, setDisplayCount] = useState(20);
  const [completedTopics, setCompletedTopics] = useState<Set<string>>(
    new Set(),
  );
  const [lastTopicSlug, setLastTopicSlug] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const capitalizedCategory =
    category.charAt(0).toUpperCase() + category.slice(1);

  // Load saved progress from localStorage
  useEffect(() => {
    const savedCompleted = localStorage.getItem(`completed_${category}`);
    if (savedCompleted) {
      setCompletedTopics(new Set(JSON.parse(savedCompleted)));
    }
    const savedLast = localStorage.getItem(`last_topic_${category}`);
    if (savedLast) {
      setLastTopicSlug(savedLast);
    }
  }, [category]);

  // Save completed topics to localStorage
  const saveCompletedTopics = (newCompleted: Set<string>) => {
    localStorage.setItem(
      `completed_${category}`,
      JSON.stringify([...newCompleted]),
    );
  };

  const saveLastTopic = (slug: string) => {
    localStorage.setItem(`last_topic_${category}`, slug);
    setLastTopicSlug(slug);
  };

  const markTopicCompleted = (slug: string) => {
    setCompletedTopics((prev) => {
      const newSet = new Set(prev);
      newSet.add(slug);
      saveCompletedTopics(newSet);
      return newSet;
    });
  };

  // Filter topics
  const filteredTopics = useMemo(() => {
    let filtered = allTopics;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          t.category.toLowerCase().includes(query),
      );
    }

    if (selectedDifficulty !== "All") {
      filtered = filtered.filter((t) => t.level === selectedDifficulty);
    }

    return filtered;
  }, [allTopics, searchQuery, selectedDifficulty]);

  // Group by category
  const groupedTopics = useMemo(() => {
    const groups: Record<string, MockTutorialTopic[]> = {};
    filteredTopics.forEach((topic) => {
      const cat = topic.category || "Mock Interview Tests";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(topic);
    });
    // Sort topics within each group alphabetically
    Object.keys(groups).forEach((key) => {
      groups[key].sort((a, b) => a.title.localeCompare(b.title));
    });
    return groups;
  }, [filteredTopics]);

  // Topics to display with pagination
  const displayTopics = useMemo(() => {
    const allFiltered = filteredTopics;
    return allFiltered.slice(0, displayCount);
  }, [filteredTopics, displayCount]);

  const hasMore = displayTopics.length < filteredTopics.length;

  // Progress percentage
  const progress = allTopics.length
    ? completedTopics.size / allTopics.length
    : 0;
  const progressPercent = Math.round(progress * 100);

  // Last topic object
  const lastTopic = useMemo(() => {
    return allTopics.find((t) => t.slug === lastTopicSlug);
  }, [allTopics, lastTopicSlug]);

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!scrollRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      if (scrollHeight - scrollTop <= clientHeight + 300 && hasMore) {
        setDisplayCount((prev) => prev + 20);
      }
    };

    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
      return () => scrollContainer.removeEventListener("scroll", handleScroll);
    }
  }, [hasMore]);

  // Clear search
  const clearSearch = () => setSearchQuery("");

  // Difficulty filters
  const difficulties = config?.difficulties || [
    { name: "All", color: "#64748b", icon: "🎯" },
    { name: "Beginner", color: "#11998E", icon: "🌱" },
    { name: "Intermediate", color: "#1e40af", icon: "⚡" },
    { name: "Advanced", color: "#FF416C", icon: "🚀" },
  ];

  // Handle topic click
  const handleTopicClick = (topic: MockTutorialTopic) => {
    markTopicCompleted(topic.slug);
    saveLastTopic(topic.slug);
    router.push(`/interview/${category}/${topic.slug}`);
  };

  // Share functionality
  const handleShare = async () => {
    const url = `https://revochamp.site/mock-interview/${category}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${capitalizedCategory} Mock Interview Tests`,
          text: `Practice ${capitalizedCategory} interviews with AI feedback!`,
          url,
        });
      } catch (e) {
        // Fallback
      }
    } else {
      navigator.clipboard?.writeText(url);
      alert("Link copied to clipboard!");
    }
  };

  const features = config?.features || {
    showHeroSection: true,
    showProgressSection: true,
    showStatsSection: true,
    showContinueBanner: true,
    showSearchFilters: true,
    showFloatingButton: true,
    enableAnimations: true,
    showCategorySection: true,
  };

  return (
    <div className="min-h-screen bg-white" ref={scrollRef}>
      {/* Header / App Bar */}
      <header className="sticky top-0 z-50 bg-[var(--studio-bg)] border-b border-[var(--studio-border)]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* 🔶 Section 1: Brand & Context */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/")}
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--studio-text)] text-white hover:bg-[var(--studio-accent)] transition-colors"
            >
              <Command size={16} />
            </button>

            <div className="h-4 w-[1px] bg-[var(--studio-border)]" />

            <div className="flex items-baseline gap-2">
              <span className="font-serif font-black text-lg tracking-tighter text-[var(--studio-text)]">
                REVOCHAMP
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--studio-accent)]">
                {capitalizedCategory || "Studio"}
              </span>
            </div>
          </div>

          {/* 🔶 Section 2: Actions */}
          <div className="flex items-center gap-3">
            {/* Status - Minimalist version */}
            <div className="hidden md:flex items-center gap-2 mr-4">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--studio-accent)] animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-[var(--studio-muted)]">
                AI Scoring
              </span>
            </div>

            <button
              className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--studio-border)] text-[11px] font-bold uppercase tracking-wider hover:bg-gray-50 transition-all"
              onClick={() => {
                /* share logic */
              }}
            >
              Share
              <ArrowUpRight size={14} />
            </button>

            <button className="p-2 text-[var(--studio-muted)] hover:text-[var(--studio-text)]">
              <MoreHorizontal size={20} />
            </button>
          </div>
        </div>

        {/* 🔶 Invisible Progress Line (Only shows 1px) */}
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-transparent">
          <div
            className="h-full bg-[var(--studio-accent)] transition-all duration-1000"
            style={{ width: "40%" }}
          />
        </div>
      </header>
      <main>
        {/* Hero Section */}
        {/* {features.showHeroSection && (
          <section className="py-12 md:py-16 bg-gradient-to-br from-orange-50 via-white to-soft-gray">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <span className="inline-block px-4 py-1.5 bg-orange-600 text-white text-sm font-semibold rounded-full shadow-md shadow-orange-600/30">
                🎯 {allTopics.length}+ Mock Tests Available
              </span>
              <h1 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-extrabold text-text-dark tracking-tight leading-tight">
                Master {capitalizedCategory}
                <br />
                <span className="bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent">
                  Technical Interviews
                </span>
              </h1>
              <p className="mt-4 max-w-2xl text-base md:text-lg text-text-muted font-medium">
                Practice with {allTopics.length}+ realistic {category} interview scenarios. 
                Get instant AI feedback, detailed explanations, and track your progress. 
                Prepare for FAANG interviews with confidence.
              </p>
              {config?.hero?.chips && (
                <div className="mt-6 flex flex-wrap gap-3">
                  {config.hero.chips.map((chip: string) => (
                    <span key={chip} className="px-4 py-2 bg-light-gray rounded-full text-sm text-text-muted">
                      {chip}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </section>
        )} */}
        {features.showHeroSection && (
          <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24 bg-[#FBFBFA]">
            {/* 🔶 Sophisticated Background Texture */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[#C8401E]/5 to-transparent pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
              <div className="flex flex-col items-start">
                {/* 🔶 Precision Badge */}
                <div className="flex items-center gap-3 px-4 py-1.5 bg-white border border-[#DDD9D2] rounded-full shadow-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C8401E] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C8401E]"></span>
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#1A1A1A]">
                    {allTopics.length}+ Adaptive Modules Available
                  </span>
                </div>

                {/* 🔶 Authoritative Header */}
                <h1 className="mt-8 text-5xl md:text-7xl font-serif font-black text-[#1A1A1A] tracking-tight leading-[1.1]">
                  Master{" "}
                  <span className="italic text-[#C8401E]">
                    {capitalizedCategory}
                  </span>{" "}
                  <br />
                  Engineering{" "}
                  <span className="font-light text-[#8C867A]">Protocols.</span>
                </h1>

                {/* 🔶 Descriptive Intelligence Brief */}
                <p className="mt-8 max-w-2xl text-lg md:text-xl text-[#5A5752] leading-relaxed font-medium">
                  Deploy into {allTopics.length}+ high-fidelity {category}{" "}
                  scenarios. RevoChamp AI evaluates your response architectural
                  depth, behavioral logic, and technical execution against{" "}
                  <span className="text-[#1A1A1A] font-bold">
                    FAANG-grade benchmarks.
                  </span>
                </p>

                {/* 🔶 Modern Capability Chips */}
                {config?.hero?.chips && (
                  <div className="mt-10 flex flex-wrap gap-2">
                    {config.hero.chips.map((chip: string) => (
                      <span
                        key={chip}
                        className="px-4 py-1.5 border border-[#DDD9D2] hover:border-[#C8401E] rounded-lg text-[11px] font-bold uppercase tracking-wider text-[#8C867A] hover:text-[#C8401E] transition-all cursor-default bg-white"
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 🔶 Elegant Footer Divider */}
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#DDD9D2] to-transparent opacity-50" />
          </section>
        )}
        {/* Stats Section */}
        {features.showStatsSection && (
          <section className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-soft-gray border border-light-gray rounded-xl py-5 px-6 flex justify-around items-center">
                <div className="text-center">
                  <div className="text-xl md:text-2xl font-extrabold text-text-dark">
                    {allTopics.length}
                  </div>
                  <div className="text-xs text-text-muted font-medium mt-1">
                    Tests
                  </div>
                </div>
                <div className="w-px h-8 bg-light-gray" />
                <div className="text-center">
                  <div className="text-xl md:text-2xl font-extrabold text-text-dark">
                    {completedTopics.size}
                  </div>
                  <div className="text-xs text-text-muted font-medium mt-1">
                    Completed
                  </div>
                </div>
                <div className="w-px h-8 bg-light-gray" />
                <div className="text-center">
                  <div className="text-xl md:text-2xl font-extrabold text-text-dark">
                    ~30
                  </div>
                  <div className="text-xs text-text-muted font-medium mt-1">
                    Min/Test
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Progress Section */}
        {features.showProgressSection && (
          <section className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-white border border-light-gray rounded-xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-text-dark">
                    Your Practice Progress
                  </h3>
                  <span className="px-3 py-1 bg-gradient-to-r from-orange-600 to-orange-800 text-white text-xs font-semibold rounded-full">
                    {progressPercent}% • {completedTopics.size}/
                    {allTopics.length}
                  </span>
                </div>
                <div className="h-2 bg-light-gray rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-orange-600 to-orange-800 transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-text-muted">
                  {progress > 0.8
                    ? "🎉 You're almost interview-ready! Keep practicing!"
                    : progress > 0.3
                      ? "💪 Great progress! Continue building your confidence."
                      : "🚀 Start practicing to ace your technical interviews!"}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Continue Banner */}
        {features.showContinueBanner && lastTopic && (
          <section className="py-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <button
                onClick={() => handleTopicClick(lastTopic)}
                className="w-full bg-gradient-to-r from-orange-50 to-orange-100/50 border border-orange-200 rounded-xl p-4 flex items-center gap-4 hover:shadow-md transition"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-orange-800 rounded-full flex items-center justify-center shadow-lg shadow-orange-600/30">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <div className="flex-1 text-left">
                  <p className="font-bold text-text-dark">
                    Continue: {lastTopic.title}
                  </p>
                  <p className="text-sm text-text-muted">
                    Resume your mock interview practice
                  </p>
                </div>
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-orange-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </button>
            </div>
          </section>
        )}

        {/* Search and Filters */}
        {features.showSearchFilters && (
          <>
            <section className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center bg-white border border-light-gray rounded-xl shadow-sm overflow-hidden">
                  <span className="pl-4 text-text-light">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={`Search ${allTopics.length}+ interview tests...`}
                    className="w-full text-sm border-0 outline-none focus:outline-none focus:ring-0 focus:border-0"
                  />
                  {searchQuery && (
                    <button
                      onClick={clearSearch}
                      className="px-2 text-text-light hover:text-text-dark"
                    >
                      ✕
                    </button>
                  )}
                  <button className="bg-orange-600 text-white px-5 py-2 m-1.5 rounded-lg text-sm font-semibold">
                    Search
                  </button>
                </div>
              </div>
            </section>

            <section className="py-4">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-wrap gap-2">
                  {difficulties.map((diff: any) => {
                    const isSelected = selectedDifficulty === diff.name;
                    return (
                      <button
                        key={diff.name}
                        onClick={() => setSelectedDifficulty(diff.name)}
                        className={`px-4 py-2 rounded-full text-sm font-medium border transition flex items-center gap-2 ${
                          isSelected
                            ? "text-white shadow-md"
                            : "bg-white border-light-gray text-text-muted hover:border-orange-300"
                        }`}
                        style={
                          isSelected
                            ? {
                                backgroundColor: diff.color,
                                borderColor: diff.color,
                              }
                            : {}
                        }
                      >
                        <span>{diff.icon}</span>
                        <span>{diff.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>

            {(searchQuery || selectedDifficulty !== "All") && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
                <p className="text-sm text-text-muted">
                  Showing {filteredTopics.length} test
                  {filteredTopics.length !== 1 ? "s" : ""}
                </p>
              </div>
            )}
          </>
        )}

        {/* Topics Grid
        <section className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {Object.keys(groupedTopics).length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-text-dark mb-2">No interview tests found</h3>
                <p className="text-text-muted">Try adjusting your search or filter</p>
              </div>
            ) : (
              Object.entries(groupedTopics).map(([groupName, topics]) => {
                // Filter topics for display (pagination applied globally, but we'll just show all within each group)
                const visibleTopics = topics.filter(t => displayTopics.includes(t));
                if (visibleTopics.length === 0) return null;
                
                return (
                  <div key={groupName} className="mb-10">
                    <div className="mb-4">
                      <h2 className="text-2xl font-extrabold text-text-dark">{groupName}</h2>
                      <div className="w-12 h-1 bg-gradient-to-r from-orange-600 to-orange-800 rounded-full mt-1" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {visibleTopics.map(topic => (
                        <QuizTopicCard
                          key={topic.slug}
                          topic={topic}
                          isCompleted={completedTopics.has(topic.slug)}
                          onClick={() => handleTopicClick(topic)}
                        />
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section> */}
        {/* 🔶 Topics Navigation Grid */}
        <section className="py-12 md:py-20 bg-[var(--surface-cream)]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            {Object.keys(groupedTopics).length === 0 ? (
              /* 🟢 Elite Empty State */
              <div className="flex flex-col items-center justify-center py-24 px-6 rounded-[40px] border border-dashed border-[var(--border-light)] bg-white/50">
                <div className="w-16 h-16 rounded-2xl bg-[var(--surface-accent)] flex items-center justify-center text-[var(--brand-muted)] mb-6">
                  <Search size={32} strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-serif font-bold text-[var(--brand-dark)] mb-2">
                  Evaluation Module Not Found
                </h3>
                <p className="text-[var(--brand-muted)] text-sm max-w-xs text-center leading-relaxed">
                  No simulations match your current parameters. Try
                  recalibrating your search or filters.
                </p>
              </div>
            ) : (
              /* 🟢 Grouped Topics Narrative */
              Object.entries(groupedTopics).map(([groupName, topics]) => {
                const visibleTopics = topics.filter((t) =>
                  displayTopics.includes(t),
                );
                if (visibleTopics.length === 0) return null;

                return (
                  <div key={groupName} className="mb-20 last:mb-0">
                    {/* Group Header: Clinical & Clean */}
                    <div className="flex items-center gap-4 mb-8">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--brand-primary)] mb-1">
                          Category Block
                        </span>
                        <h2 className="text-2xl md:text-3xl font-serif font-black text-[var(--brand-dark)] tracking-tight">
                          {groupName}
                        </h2>
                      </div>
                      <div className="h-[1px] flex-1 bg-gradient-to-r from-[var(--border-light)] to-transparent mt-6" />
                    </div>

                    {/* Grid Layout: Precision Spacing */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {visibleTopics.map((topic) => (
                        <QuizTopicCard
                          key={topic.slug}
                          topic={topic}
                          isCompleted={completedTopics.has(topic.slug)}
                          onClick={() => handleTopicClick(topic)}
                          // className="hover:shadow-2xl hover:shadow-[var(--brand-primary)]/5 transition-all duration-500"
                        />
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
        {/* Load More Indicator */}
        {hasMore && (
          <div className="py-8 text-center">
            <div className="inline-block w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Related Categories
        {config?.seo?.tags && (
          <section className="py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-soft-gray rounded-xl p-6">
                <h3 className="font-bold text-text-dark mb-3">
                  Explore More Interview Topics
                </h3>
                <div className="flex flex-wrap gap-2">
                  {config.seo.tags.map((tag: string) => (
                    <Link
                      key={tag}
                      href={`/mock-interview/${tag.toLowerCase().replace(/\s+/g, "-")}`}
                      className="px-4 py-2 bg-white border border-light-gray rounded-full text-sm hover:border-orange-300 transition"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )} */}

        {/* Last Updated */}
        {/* <div className="text-center py-4 text-text-light text-xs">
          Last updated:{" "}
          {new Date().toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          })}
        </div> */}

        {/* SEO Footer
        {config?.seo && (
          <section className="py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-soft-gray border border-light-gray rounded-xl p-6 text-center">
                <div className="text-3xl mb-3">{config.seo.emoji}</div>
                <h3 className="text-lg font-bold text-text-dark mb-2">
                  {config.seo.title.replace("{category}", capitalizedCategory)}
                </h3>
                <p className="text-sm text-text-muted max-w-2xl mx-auto">
                  {config.seo.description.replace("{category}", category)}
                </p>
                {config.seo.tags && (
                  <div className="flex flex-wrap justify-center gap-2 mt-4">
                    {config.seo.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-white rounded-full text-xs text-text-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        )} */}
    {config?.seo && (
  <section className="py-20 border-t border-slate-100 bg-white/50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
        
        {/* Main Content: 2/3 Width */}
        <div className="flex-1">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-orange-50 text-2xl mb-6 ring-1 ring-orange-100">
            {config.seo.emoji}
          </div>
          
          <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-4">
            {config.seo.title.replace("{category}", capitalizedCategory)}
          </h3>
          
          <p className="text-lg text-slate-600 leading-relaxed max-w-3xl">
            {config.seo.description.replace("{category}", category)}
          </p>
        </div>

        {/* Sidebar Tags: 1/3 Width */}
        <div className="lg:w-80 shrink-0">
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-5 flex items-center">
              <span className="w-4 h-[1px] bg-slate-300 mr-2"></span>
              Related Expertise
            </h4>
            
            <div className="flex flex-wrap gap-2">
              {config.seo.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 bg-white border border-slate-200/60 rounded-lg text-xs font-semibold text-slate-700 shadow-sm hover:border-orange-300 hover:text-orange-600 transition-all cursor-default"
                >
                  {tag}
                </span>
              ))}
            </div>
            
            {/* Subtle Call to Action or Hint */}
            <p className="mt-6 text-[11px] text-slate-400 italic">
              Curated mock interviews for {category} professionals.
            </p>
          </div>
        </div>

      </div>
    </div>
  </section>
)}
      </main>

      {/* Scroll to top FAB */}
      {features.showFloatingButton && allTopics.length > 10 && (
        <button
          onClick={() =>
            scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" })
          }
          className="fixed bottom-6 right-6 w-10 h-10 bg-orange-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-orange-700 transition"
          aria-label="Scroll to top"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 15l7-7 7 7"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
