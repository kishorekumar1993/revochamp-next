'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation'; // App Router – or 'next/router' for Pages Router
import Link from 'next/link';
import Footer from '@/components/footer';
import MockInterviewCard from '@/components/mock-interview/MockInterviewCard';
import InterviewDetailModal from '@/components/mock-interview/InterviewDetailModal';
import {
  Interview,
  CategoryItem,
  fetchInterviews,
  getCategoryEmoji,
  getCategoryColor, // should return CSS string like '#64748b', not number
} from '@/lib/interviews';
import CategoryCard from '@/components/mock-interview/CategoryCard';

// Simple debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function MockInterviewClient() {
  const router = useRouter();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [filteredInterviews, setFilteredInterviews] = useState<Interview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Modal state
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load interviews
  useEffect(() => {
    fetchInterviews()
      .then((data) => {
        setInterviews(data);
        setFilteredInterviews(data);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  // Apply filters (using debounced search)
  useEffect(() => {
    let filtered = [...interviews];

    if (selectedCategory !== 'All') {
      filtered = filtered.filter((i) => i.category === selectedCategory);
    }

    if (selectedLevel) {
      filtered = filtered.filter((i) => i.level === selectedLevel);
    }

    if (debouncedSearch.trim()) {
      const query = debouncedSearch.toLowerCase();
      filtered = filtered.filter(
        (i) =>
          i.title.toLowerCase().includes(query) ||
          i.description.toLowerCase().includes(query) ||
          i.topics.some((t) => t.toLowerCase().includes(query))
      );
    }

    setFilteredInterviews(filtered);
  }, [interviews, selectedCategory, selectedLevel, debouncedSearch]);

  // Build categories
  const categories = useMemo(() => {
    const map = new Map<string, CategoryItem>();
    interviews.forEach((interview) => {
      const cat = interview.category;
      if (!map.has(cat)) {
        map.set(cat, {
          name: cat,
          emoji: getCategoryEmoji(cat),
          color: getCategoryColor(cat), // ensure this returns a string like '#FF5733'
          count: 0,
        });
      }
      map.get(cat)!.count++;
    });

    const allCategory: CategoryItem = {
      name: 'All',
      emoji: '🎯',
      color: 0XFF64748b,
      count: interviews.length,
    };

    const sorted = Array.from(map.values()).sort((a, b) => b.count - a.count);
    return [allCategory, ...sorted];
  }, [interviews]);

  const levelCounts = useMemo(() => {
    return {
      all: interviews.length,
      beginner: interviews.filter((i) => i.level === 'Beginner').length,
      intermediate: interviews.filter((i) => i.level === 'Intermediate').length,
      advanced: interviews.filter((i) => i.level === 'Advanced').length,
    };
  }, [interviews]);

  const clearFilters = () => {
    setSelectedCategory('All');
    setSelectedLevel(null);
    setSearchQuery('');
  };

  const openDetail = (interview: Interview) => {
    setSelectedInterview(interview);
    setIsModalOpen(true);
  };

  // ✅ Proper share function using Web Share API
  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'RevoChamp Live Interview Studio',
          text: 'Master high-stakes interviews with AI-powered mock sessions.',
          url: window.location.href,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Share failed:', err);
        }
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  }, []);

  // Stats (could be fetched from API, but kept as is for now)
  const totalSessions = 275;
  const successRate = 94;
  const faangHires = 1250;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-rich-blue border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-text-muted">Loading mock interviews...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center max-w-md p-8">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-text-dark mb-2">
            Failed to load mock interviews
          </h2>
          <p className="text-text-muted mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-rich-blue text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="bg-white">
      {/* Sticky Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              aria-label="Go back"
            >
              {/* Use a proper icon library or SVG; here inline SVG as fallback */}
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
            </button>
            <div>
              <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-[#1A1A1A] font-serif">
                RevoChamp <span className="text-[#C8401E]">Live</span> Interview Studio
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 rounded-full bg-[#C8401E] animate-pulse" />
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#8C867A]">
                  AI-Powered Assessment
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={handleShare}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            aria-label="Share this page"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32 bg-[#F9F8F6]">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#C8401E]/5 rounded-full blur-[100px]" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-2 px-3 py-1 bg-white border border-[#DDD9D2] rounded-full shadow-sm">
              <div className="w-2 h-2 rounded-full bg-[#C8401E] animate-pulse" />
              <span className="text-[10px] uppercase tracking-[0.2em] font-black text-[#1A1A1A]">
                AI Interview Simulation
              </span>
            </div>
            <h1 className="mt-8 text-5xl md:text-7xl font-serif font-bold text-[#1A1A1A] tracking-tight leading-[1.1]">
              Master the art of <br />
              <span className="italic text-[#C8401E]">high-stakes</span> interviews.
            </h1>
            <p className="mt-6 max-w-2xl text-lg md:text-xl text-[#5A5752] leading-relaxed font-medium">
              RevoChamp simulates the high-pressure environment of elite tech firms.
              Access 50+ specialized tracks in <span className="text-[#1A1A1A] font-bold">System Design, Behavioral, and SWE</span>
              with instant, objective AI feedback.
            </p>
            <div className="mt-10 w-full max-w-2xl group">
              <div className="hidden md:block mt-8 max-w-xl">
                <SearchBar
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Search your dream role (e.g. 'Senior Flutter Lead')..."
                />
              </div>
              <p className="mt-4 text-xs text-[#8C867A] font-medium italic">
                Popular: System Design at Google, Behavioral for Meta, Flutter Architect.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-soft-gray border border-light-gray rounded-xl py-5 px-6 flex justify-around items-center">
            <StatItem value={`${totalSessions}K+`} label="Practice Sessions" />
            <div className="w-px h-8 bg-light-gray" />
            <StatItem value={`${successRate}%`} label="Success Rate" />
            <div className="w-px h-8 bg-light-gray" />
            <StatItem value={`${faangHires}+`} label="FAANG Hires" />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-extrabold text-text-dark tracking-tight mb-6">
            Practice by Role
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <CategoryCard
                key={cat.name}
                category={cat}
                isSelected={selectedCategory === cat.name}
                onClick={() => setSelectedCategory(cat.name)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Mock Interviews Grid */}
      <section className="py-12 bg-soft-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-text-dark tracking-tight">
                All Mock Interviews
              </h2>
              <p className="text-text-muted text-sm mt-1">
                {filteredInterviews.length} interviews available
              </p>
            </div>
            {(selectedCategory !== 'All' || selectedLevel || searchQuery) && (
              <button
                onClick={clearFilters}
                className="text-text-muted text-sm flex items-center gap-1 hover:text-rich-blue"
              >
                Clear Filters ✕
              </button>
            )}
          </div>

          {/* Level Filters */}
          <div className="flex flex-wrap gap-3 mb-8">
            <LevelChip
              label={`All Levels (${levelCounts.all})`}
              isSelected={!selectedLevel}
              onClick={() => setSelectedLevel(null)}
            />
            <LevelChip
              label={`Beginner (${levelCounts.beginner})`}
              isSelected={selectedLevel === 'Beginner'}
              onClick={() => setSelectedLevel('Beginner')}
            />
            <LevelChip
              label={`Intermediate (${levelCounts.intermediate})`}
              isSelected={selectedLevel === 'Intermediate'}
              onClick={() => setSelectedLevel('Intermediate')}
            />
            <LevelChip
              label={`Advanced (${levelCounts.advanced})`}
              isSelected={selectedLevel === 'Advanced'}
              onClick={() => setSelectedLevel('Advanced')}
            />
          </div>

          {/* Mobile Search */}
          <div className="md:hidden mb-6">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search mock interviews..."
            />
          </div>

          {filteredInterviews.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-text-dark mb-2">
                No mock interviews found
              </h3>
              <p className="text-text-muted mb-4">
                Try adjusting your filters or search term
              </p>
              <button
                onClick={clearFilters}
                className="text-rich-blue font-medium"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredInterviews.map((interview) => (
                <MockInterviewCard
                  key={interview.id}
                  interview={interview}
                  onClick={() => openDetail(interview)}
                  onStart={() => console.log('Start interview:', interview.title)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[40px] bg-[#020617] p-8 md:p-20 text-center shadow-[0_30px_100px_-15px_rgba(30,58,138,0.3)] border border-slate-800/50">
            <div className="absolute -right-24 -top-24 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute -left-24 -bottom-24 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="relative z-10 max-w-3xl mx-auto">
              <div className="flex justify-center mb-10">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/5 backdrop-blur-md">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-300">
                    AI Calibration Active
                  </span>
                </div>
              </div>
              <h2 className="text-4xl md:text-6xl font-serif font-bold text-white leading-[1.1] tracking-tight mb-8">
                Unsure of your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300 italic">
                  optimal path?
                </span>
              </h2>
              <p className="text-slate-400 text-lg md:text-xl leading-relaxed mb-12 font-medium opacity-90">
                Our algorithm cross-references your target role with industry-specific
                behavioral benchmarks to curate a precision-focused simulation.
              </p>
              <button className="group relative inline-flex items-center gap-4 bg-blue-600 hover:bg-blue-500 text-white font-bold px-12 py-5 rounded-2xl transition-all duration-500 shadow-[0_20px_40px_-10px_rgba(37,99,235,0.4)]">
                Launch Intelligence Guide
                <span className="transition-transform duration-300 group-hover:translate-x-2">
                  →
                </span>
              </button>
              <div className="mt-12 flex items-center justify-center gap-6">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-[#020617] bg-slate-800 flex items-center justify-center text-[8px] font-bold text-slate-400">
                      AI_{i}
                    </div>
                  ))}
                </div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 border-l border-slate-800 pl-6">
                  Trusted by 5,000+ Professionals
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <InterviewDetailModal
        interview={selectedInterview}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </main>
  );
}

// ========== Subcomponents ==========

function SearchBar({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className="flex items-center bg-white border border-light-gray rounded-xl shadow-sm overflow-hidden">
      <span className="pl-4 text-text-light" aria-hidden="true">🔍</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 px-3 py-3 text-sm bg-transparent border-0 outline-none ring-0 focus:ring-0 focus:outline-none"
        aria-label="Search interviews"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="px-2 text-text-light hover:text-text-dark"
          aria-label="Clear search"
        >
          ✕
        </button>
      )}
      <button
        className="bg-rich-blue text-white px-5 py-2 m-1.5 rounded-lg text-sm font-semibold"
        aria-label="Submit search"
      >
        Search
      </button>
    </div>
  );
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-xl md:text-2xl font-extrabold text-text-dark">
        {value}
      </div>
      <div className="text-xs text-text-muted font-medium mt-1">{label}</div>
    </div>
  );
}

function LevelChip({
  label,
  isSelected,
  onClick,
}: {
  label: string;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
        isSelected
          ? 'bg-rich-blue/10 border-rich-blue/30 text-rich-blue'
          : 'bg-white border-light-gray text-text-muted hover:border-rich-blue/30'
      }`}
      aria-pressed={isSelected}
    >
      {label}
    </button>
  );
}
