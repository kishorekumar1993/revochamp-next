// components/marketing/tools/KeywordDensityChecker.tsx
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Playfair_Display, Poppins } from "next/font/google";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  FileText,
  Copy,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Info,
  BarChart3,
  ChevronRight,
  Hash,
  Layers,
} from "lucide-react";

// ----------------------------------------------------------------------------
// Fonts
// ----------------------------------------------------------------------------
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700", "800"],
});
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// ----------------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------------
interface KeywordDensityItem {
  keyword: string;
  count: number;
  density: number;
  type: "1-word" | "2-word" | "3-word";
}

// ----------------------------------------------------------------------------
// Constants
// ----------------------------------------------------------------------------
const STOP_WORDS = new Set([
  "a", "an", "the", "and", "or", "but", "to", "of", "in", "is", "it", "this",
  "that", "these", "those", "for", "on", "with", "as", "by", "at", "from",
  "about", "into", "through", "during", "before", "after", "above", "below",
  "between", "under", "again", "further", "then", "once", "here", "there",
  "when", "where", "why", "how", "all", "any", "both", "each", "few", "more",
  "most", "other", "some", "such", "no", "nor", "not", "only", "own", "same",
  "so", "than", "too", "very", "s", "t", "can", "will", "just", "don", "should", "now",
  "be", "been", "being", "have", "has", "had", "do", "does", "did", "was", "were",
  "am", "are", "i", "you", "he", "she", "we", "they", "my", "your", "his", "her",
  "its", "our", "their", "me", "him", "us", "them"
]);

// ----------------------------------------------------------------------------
// Helper Functions
// ----------------------------------------------------------------------------
const cleanWord = (word: string): string => {
  return word.replace(/^[^\w]+|[^\w]+$/g, "").toLowerCase();
};

const normalizeWord = (word: string): string => {
  // Basic stemming: remove common suffixes
  return word
    .replace(/(ing|ed|s|es|ly)$/i, "")
    .toLowerCase();
};

const generateNGrams = (words: string[], n: number): string[] => {
  const grams: string[] = [];
  for (let i = 0; i <= words.length - n; i++) {
    grams.push(words.slice(i, i + n).join(" "));
  }
  return grams;
};

interface AnalysisResult {
  totalWords: number;
  keywordCount: number;
  density: number;
  keywordList: KeywordDensityItem[];
  singleWords: KeywordDensityItem[];
  twoWordPhrases: KeywordDensityItem[];
  threeWordPhrases: KeywordDensityItem[];
}

const calculateKeywordDensity = (
  text: string,
  targetKeyword?: string
): AnalysisResult => {
  const emptyResult: AnalysisResult = {
    totalWords: 0,
    keywordCount: 0,
    density: 0,
    keywordList: [],
    singleWords: [],
    twoWordPhrases: [],
    threeWordPhrases: [],
  };

  if (!text.trim()) return emptyResult;

  // Split and clean words (excluding stop words)
  const rawWords = text.split(/\s+/);
  const cleanedWords = rawWords
    .map(cleanWord)
    .filter((word) => word.length > 0);

  // Filter out stop words for meaningful analysis
  const meaningfulWords = cleanedWords.filter((word) => !STOP_WORDS.has(word));
  const totalMeaningfulWords = meaningfulWords.length;

  if (totalMeaningfulWords === 0) return emptyResult;

  // Generate n-grams
  const singleWords = meaningfulWords;
  const bigrams = generateNGrams(meaningfulWords, 2);
  const trigrams = generateNGrams(meaningfulWords, 3);

  // Count frequencies for each type
  const singleFreq: Record<string, number> = {};
  const bigramFreq: Record<string, number> = {};
  const trigramFreq: Record<string, number> = {};

  singleWords.forEach((word) => {
    singleFreq[word] = (singleFreq[word] || 0) + 1;
  });
  bigrams.forEach((phrase) => {
    bigramFreq[phrase] = (bigramFreq[phrase] || 0) + 1;
  });
  trigrams.forEach((phrase) => {
    trigramFreq[phrase] = (trigramFreq[phrase] || 0) + 1;
  });

  // Total possible n-grams for accurate density
  const totalSinglePossible = singleWords.length;
  const totalBigramPossible = meaningfulWords.length - 1;
  const totalTrigramPossible = meaningfulWords.length - 2;

  // Build categorized lists
  const singleList: KeywordDensityItem[] = Object.entries(singleFreq)
    .map(([keyword, count]) => ({
      keyword,
      count,
      density: (count / totalSinglePossible) * 100,
      type: "1-word" as const,
    }))
    .sort((a, b) => b.count - a.count);

  const bigramList: KeywordDensityItem[] = Object.entries(bigramFreq)
    .map(([keyword, count]) => ({
      keyword,
      count,
      density: totalBigramPossible > 0 ? (count / totalBigramPossible) * 100 : 0,
      type: "2-word" as const,
    }))
    .sort((a, b) => b.count - a.count);

  const trigramList: KeywordDensityItem[] = Object.entries(trigramFreq)
    .map(([keyword, count]) => ({
      keyword,
      count,
      density: totalTrigramPossible > 0 ? (count / totalTrigramPossible) * 100 : 0,
      type: "3-word" as const,
    }))
    .sort((a, b) => b.count - a.count);

  // Combined list for general display (prioritize phrases)
  const combinedList: KeywordDensityItem[] = [
    ...trigramList,
    ...bigramList,
    ...singleList,
  ].sort((a, b) => b.count - a.count);

  // Target keyword handling (supports phrases)
  let keywordCount = 0;
  let density = 0;
  if (targetKeyword && targetKeyword.trim()) {
    const cleanTarget = targetKeyword.toLowerCase().trim();
    const targetWords = cleanTarget.split(/\s+/).filter(w => w.length > 0);
    
    if (targetWords.length === 1) {
      keywordCount = singleFreq[cleanTarget] || 0;
      density = totalSinglePossible > 0 ? (keywordCount / totalSinglePossible) * 100 : 0;
    } else if (targetWords.length === 2) {
      keywordCount = bigramFreq[cleanTarget] || 0;
      density = totalBigramPossible > 0 ? (keywordCount / totalBigramPossible) * 100 : 0;
    } else if (targetWords.length === 3) {
      keywordCount = trigramFreq[cleanTarget] || 0;
      density = totalTrigramPossible > 0 ? (keywordCount / totalTrigramPossible) * 100 : 0;
    } else {
      // Fallback to exact string matching in combined text
      const regex = new RegExp(cleanTarget.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      const matches = text.match(regex);
      keywordCount = matches ? matches.length : 0;
      density = totalMeaningfulWords > 0 ? (keywordCount / totalMeaningfulWords) * 100 : 0;
    }
  }

  return {
    totalWords: totalMeaningfulWords, // meaningful words only
    keywordCount,
    density,
    keywordList: combinedList,
    singleWords: singleList,
    twoWordPhrases: bigramList,
    threeWordPhrases: trigramList,
  };
};

// ----------------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------------
export default function KeywordDensityChecker() {
  const [text, setText] = useState("");
  const [targetKeyword, setTargetKeyword] = useState("");
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "1-word" | "2-word" | "3-word">("all");

  // Remove dark mode on mount
  useEffect(() => {
    if (document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const analysis = useMemo(
    () => calculateKeywordDensity(text, targetKeyword),
    [text, targetKeyword]
  );

  const {
    totalWords,
    keywordCount,
    density,
    keywordList,
    singleWords,
    twoWordPhrases,
    threeWordPhrases,
  } = analysis;

  const handleClear = () => {
    setText("");
    setTargetKeyword("");
  };

  const handleCopyResults = () => {
    let resultsText = "";
    if (activeTab === "all") {
      resultsText = keywordList
        .slice(0, 30)
        .map((item) => `${item.keyword}: ${item.count} (${item.density.toFixed(2)}%)`)
        .join("\n");
    } else {
      const list = activeTab === "1-word" ? singleWords : activeTab === "2-word" ? twoWordPhrases : threeWordPhrases;
      resultsText = list
        .map((item) => `${item.keyword}: ${item.count} (${item.density.toFixed(2)}%)`)
        .join("\n");
    }
    navigator.clipboard.writeText(resultsText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getDensityStatus = (densityValue: number) => {
    if (densityValue === 0) return { label: "Not Present", color: "text-slate-400" };
    if (densityValue < 1) return { label: "Low", color: "text-amber-500" };
    if (densityValue <= 3) return { label: "Optimal", color: "text-emerald-500" };
    if (densityValue <= 5) return { label: "High", color: "text-orange-500" };
    return { label: "Keyword Stuffing", color: "text-red-500" };
  };

  const status = getDensityStatus(density);

  const getDisplayList = () => {
    switch (activeTab) {
      case "1-word": return singleWords;
      case "2-word": return twoWordPhrases;
      case "3-word": return threeWordPhrases;
      default: return keywordList;
    }
  };

  const displayList = getDisplayList();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/20 via-white to-indigo-50/20 text-slate-800">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-blue-100 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            href="/tools/marketing"
            className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft size={18} />
            <span className={`${poppins.className} text-sm font-medium`}>
              Back to Tools
            </span>
          </Link>
          <Link
            href="/"
            className={`${playfair.className} text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent`}
          >
            MarketTools
          </Link>
          <div className="w-16" />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-4">
          <Link href="/tools/marketing" className="hover:text-blue-600">
            Marketing Tools
          </Link>
          <ChevronRight size={14} />
          <span className="text-slate-700 font-medium">Keyword Density Checker</span>
        </nav>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-1.5 rounded-full text-sm font-medium mb-4 shadow-sm">
            <Search size={16} /> SEO‑Grade Analysis
          </div>
          <h1
            className={`${playfair.className} text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-800 mb-3`}
          >
            Keyword Density{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Checker
            </span>
          </h1>
          <p
            className={`${poppins.className} text-base sm:text-lg text-slate-600 max-w-2xl mx-auto`}
          >
            Advanced keyword analysis with stop word filtering and phrase detection.
            Optimize for SEO without keyword stuffing.
          </p>
        </motion.div>

        {/* Main Tool Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Input */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-5 md:p-6">
              <div className="flex items-center justify-between mb-3">
                <label className={`${poppins.className} font-semibold text-slate-700 flex items-center gap-2`}>
                  <FileText size={18} className="text-blue-500" />
                  Paste Your Content
                </label>
                <button
                  onClick={handleClear}
                  className="text-slate-400 hover:text-red-500 transition-colors p-1"
                  aria-label="Clear text"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter or paste your article, blog post, or any text content here..."
                className={`${poppins.className} w-full h-64 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y text-slate-700 placeholder:text-slate-400`}
              />
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-4">
                  <div className="text-sm text-slate-500">
                    <span className="font-semibold text-slate-700">{totalWords}</span> meaningful words
                  </div>
                  <div className="text-sm text-slate-500">
                    <span className="font-semibold text-slate-700">{singleWords.length}</span> unique
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={targetKeyword}
                    onChange={(e) => setTargetKeyword(e.target.value)}
                    placeholder="Target keyword or phrase"
                    className={`${poppins.className} px-3 py-1.5 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-56`}
                  />
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-xl flex gap-3">
              <Info size={20} className="text-blue-500 flex-shrink-0 mt-0.5" />
              <div className={`${poppins.className} text-sm text-blue-700`}>
                <p className="font-medium mb-1">SEO‑Optimized Analysis</p>
                <p>
                  Stop words (a, the, and, etc.) are excluded. Density is calculated
                  based on meaningful words only. Ideal density: <strong>1% – 3%</strong>.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Results */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-5 md:p-6 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className={`${poppins.className} font-semibold text-slate-700 flex items-center gap-2`}>
                  <BarChart3 size={18} className="text-indigo-500" />
                  Density Analysis
                </h3>
                {displayList.length > 0 && (
                  <button
                    onClick={handleCopyResults}
                    className="text-slate-400 hover:text-blue-600 transition-colors p-1"
                    aria-label="Copy results"
                  >
                    {copied ? (
                      <CheckCircle size={18} className="text-emerald-500" />
                    ) : (
                      <Copy size={18} />
                    )}
                  </button>
                )}
              </div>

              {targetKeyword && (
                <div className="mb-4 p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200">
                  <p className={`${poppins.className} text-xs uppercase tracking-wider text-slate-500 mb-1`}>
                    Target Keyword
                  </p>
                  <p className={`${poppins.className} text-xl font-bold text-slate-800 mb-2`}>
                    {targetKeyword}
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-slate-800">
                        {keywordCount}
                      </p>
                      <p className="text-xs text-slate-500">occurrences</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-slate-800">
                        {density.toFixed(2)}%
                      </p>
                      <p className={`text-xs font-medium ${status.color}`}>
                        {status.label}
                      </p>
                    </div>
                  </div>
                  {/* Density Bar */}
                  <div className="mt-3 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        density > 5
                          ? "bg-red-500"
                          : density > 3
                          ? "bg-orange-500"
                          : density >= 1
                          ? "bg-emerald-500"
                          : "bg-amber-500"
                      }`}
                      style={{ width: `${Math.min(density * 10, 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Tabs for categories */}
              <div className="flex border-b border-slate-200 mb-3">
                {(["all", "1-word", "2-word", "3-word"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-2 text-xs font-medium transition-colors ${
                      activeTab === tab
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    {tab === "all" ? "All" : tab}
                  </button>
                ))}
              </div>

              <div className="mb-2 flex items-center justify-between">
                <h4 className={`${poppins.className} text-sm font-semibold text-slate-600`}>
                  Top Keywords
                </h4>
                <span className="text-xs text-slate-400">Count / Density</span>
              </div>

              {displayList.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <Search size={32} className="mx-auto mb-2 opacity-50" />
                  <p className={`${poppins.className} text-sm`}>
                    Enter text to see keyword density
                  </p>
                </div>
              ) : (
                <div className="max-h-96 overflow-y-auto pr-1 space-y-1">
                  {displayList.slice(0, 20).map((item) => (
                    <div
                      key={item.keyword}
                      className="flex items-center justify-between py-2 px-2 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <span className={`${poppins.className} text-sm font-medium text-slate-700 truncate max-w-[140px]`}>
                        {item.keyword}
                        {item.type && activeTab === "all" && (
                          <span className="ml-1 text-xs text-slate-400">({item.type})</span>
                        )}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-slate-600">{item.count}</span>
                        <span
                          className={`text-sm font-medium ${
                            item.density > 5
                              ? "text-red-500"
                              : item.density > 3
                              ? "text-orange-500"
                              : "text-emerald-500"
                          }`}
                        >
                          {item.density.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  ))}
                  {displayList.length > 20 && (
                    <p className="text-xs text-slate-400 text-center pt-2">
                      + {displayList.length - 20} more items
                    </p>
                  )}
                </div>
              )}

              {targetKeyword && density > 5 && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                  <AlertTriangle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
                  <p className={`${poppins.className} text-xs text-red-700`}>
                    Warning: Density above 5% may be considered keyword stuffing.
                    Consider reducing frequency.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* How to Use Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-12 bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8"
        >
          <h2 className={`${playfair.className} text-2xl font-bold text-slate-800 mb-4`}>
            How to Use the Keyword Density Checker
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm flex-shrink-0">
                1
              </div>
              <div>
                <h4 className={`${poppins.className} font-semibold text-slate-700 mb-1`}>
                  Paste Your Content
                </h4>
                <p className={`${poppins.className} text-sm text-slate-500`}>
                  Copy and paste your article, blog post, or any text content into the text area.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm flex-shrink-0">
                2
              </div>
              <div>
                <h4 className={`${poppins.className} font-semibold text-slate-700 mb-1`}>
                  Enter Target Keyword
                </h4>
                <p className={`${poppins.className} text-sm text-slate-500`}>
                  Optionally enter a specific keyword or phrase to see its exact count and density.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm flex-shrink-0">
                3
              </div>
              <div>
                <h4 className={`${poppins.className} font-semibold text-slate-700 mb-1`}>
                  Analyze Results
                </h4>
                <p className={`${poppins.className} text-sm text-slate-500`}>
                  Review density by word/phrase type. Adjust content if density is too high or low.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-100 p-6 md:p-8"
        >
          <h2 className={`${playfair.className} text-2xl font-bold text-slate-800 mb-4`}>
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <div>
              <h4 className={`${poppins.className} font-semibold text-slate-700`}>
                What is keyword density?
              </h4>
              <p className={`${poppins.className} text-sm text-slate-600 mt-1`}>
                Keyword density is the percentage of times a keyword appears in content relative to total meaningful words.
              </p>
            </div>
            <div>
              <h4 className={`${poppins.className} font-semibold text-slate-700`}>
                What is the ideal keyword density for SEO?
              </h4>
              <p className={`${poppins.className} text-sm text-slate-600 mt-1`}>
                Most SEO professionals recommend 1-3%. Focus on natural writing and user experience over exact percentages.
              </p>
            </div>
            <div>
              <h4 className={`${poppins.className} font-semibold text-slate-700`}>
                Does this tool consider stop words?
              </h4>
              <p className={`${poppins.className} text-sm text-slate-600 mt-1`}>
                No, stop words (a, the, and, etc.) are excluded from analysis to provide more accurate SEO insights.
              </p>
            </div>
            <div>
              <h4 className={`${poppins.className} font-semibold text-slate-700`}>
                Can I analyze multi-word phrases?
              </h4>
              <p className={`${poppins.className} text-sm text-slate-600 mt-1`}>
                Yes! The tool detects 2‑word and 3‑word phrases and shows separate density for each type.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Disclaimer */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-2xl text-center">
          <p className={`${poppins.className} text-xs text-blue-700`}>
            ⚠️ Disclaimer: This tool provides estimates based on text analysis.
            Search engine algorithms consider many factors beyond keyword density.
            Use this as a guide, not a definitive SEO rule.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-6 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-slate-400">
          © {new Date().getFullYear()} MarketTools. Smart marketing planning
          for everyone.
        </div>
      </footer>
    </div>
  );
}