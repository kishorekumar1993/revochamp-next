// components/marketing/tools/MarketingToolsHub.tsx
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Playfair_Display, Poppins } from "next/font/google";
import Link from "next/link";
import {
  TrendingUp,
  MousePointerClick,
  Eye,
  BarChart3,
  Search,
  Hash,
  Type,
  Image,
  Mail,
  Target,
  Percent,
  Users,
  Calculator,
  FileText,
  Share2,
  Clock,
  PenTool,
  Sparkles,
  type LucideIcon,
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
  weight: ["400", "500", "600"],
});

// ----------------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------------
interface Tool {
  name: string;
  description: string;
  icon: LucideIcon;
  route: string;
  category: string;
  color: string;
}

// ----------------------------------------------------------------------------
// Digital Marketing Tools Data
// ----------------------------------------------------------------------------
const tools: Tool[] = [
  // ROI & Budget
  {
    name: "ROI Calculator",
    description: "Calculate return on investment for campaigns",
    icon: TrendingUp,
    route: "/tools/marketing/roi-calculator",
    category: "ROI & Budget",
    color: "from-emerald-500 to-green-500",
  },
  {
    name: "CPC Calculator",
    description: "Determine cost per click from ad spend",
    icon: MousePointerClick,
    route: "/tools/marketing/cpc-calculator",
    category: "ROI & Budget",
    color: "from-teal-500 to-emerald-500",
  },
  {
    name: "CPM Calculator",
    description: "Calculate cost per thousand impressions",
    icon: Eye,
    route: "/tools/marketing/cpm-calculator",
    category: "ROI & Budget",
    color: "from-cyan-500 to-blue-500",
  },
  {
    name: "Budget Allocation Tool",
    description: "Split marketing budget across channels",
    icon: Calculator,
    route: "/tools/marketing/budget-allocation",
    category: "ROI & Budget",
    color: "from-green-500 to-emerald-500",
  },
  {
    name: "LTV:CAC Ratio Calculator",
    description: "Compare lifetime value to acquisition cost",
    icon: Users,
    route: "/tools/marketing/ltv-cac-calculator",
    category: "ROI & Budget",
    color: "from-blue-500 to-indigo-500",
  },
  {
    name: "Break‑Even ROAS Calculator",
    description: "Find minimum ROAS to break even",
    icon: Target,
    route: "/tools/marketing/breakeven-roas",
    category: "ROI & Budget",
    color: "from-amber-500 to-orange-500",
  },

  // SEO & Content
  {
    name: "Keyword Density Checker",
    description: "Analyze keyword frequency in text",
    icon: Search,
    route: "/tools/marketing/keyword-density",
    category: "SEO & Content",
    color: "from-indigo-500 to-purple-500",
  },
  {
    name: "Readability Score Calculator",
    description: "Check Flesch-Kincaid reading ease",
    icon: FileText,
    route: "/tools/marketing/readability-score",
    category: "SEO & Content",
    color: "from-purple-500 to-pink-500",
  },
  {
    name: "Title Tag Length Checker",
    description: "Ensure SEO‑optimal title length",
    icon: Type,
    route: "/tools/marketing/title-length-checker",
    category: "SEO & Content",
    color: "from-violet-500 to-purple-500",
  },
  {
    name: "Meta Description Preview",
    description: "Simulate SERP snippet appearance",
    icon: Eye,
    route: "/tools/marketing/meta-preview",
    category: "SEO & Content",
    color: "from-pink-500 to-rose-500",
  },
  {
    name: "SERP Snippet Simulator",
    description: "Preview title, URL & description in Google",
    icon: Search,
    route: "/tools/marketing/serp-simulator",
    category: "SEO & Content",
    color: "from-amber-500 to-orange-500",
  },

  // Social Media
  {
    name: "Hashtag Generator",
    description: "Get relevant hashtags by keyword",
    icon: Hash,
    route: "/tools/marketing/hashtag-generator",
    category: "Social Media",
    color: "from-sky-500 to-blue-500",
  },
  {
    name: "Social Character Counter",
    description: "Count characters for Twitter/X, LinkedIn",
    icon: Type,
    route: "/tools/marketing/social-char-counter",
    category: "Social Media",
    color: "from-blue-500 to-cyan-500",
  },
  {
    name: "Engagement Rate Calculator",
    description: "Calculate post engagement percentage",
    icon: BarChart3,
    route: "/tools/marketing/engagement-rate",
    category: "Social Media",
    color: "from-indigo-500 to-blue-500",
  },
  {
    name: "Best Time to Post Suggestion",
    description: "Find optimal posting windows",
    icon: Clock,
    route: "/tools/marketing/best-time-to-post",
    category: "Social Media",
    color: "from-emerald-500 to-teal-500",
  },
  {
    name: "Instagram Grid Preview",
    description: "Simulate 3×3 Instagram grid",
    icon: Image,
    route: "/tools/marketing/instagram-grid-preview",
    category: "Social Media",
    color: "from-purple-500 to-indigo-500",
  },
  {
    name: "YouTube Thumbnail Preview",
    description: "Preview thumbnail in different sizes",
    icon: Image,
    route: "/tools/marketing/youtube-thumbnail-preview",
    category: "Social Media",
    color: "from-rose-500 to-pink-500",
  },

  // Email Marketing
  {
    name: "Subject Line Grader",
    description: "Score subject lines for effectiveness",
    icon: Mail,
    route: "/tools/marketing/subject-line-grader",
    category: "Email Marketing",
    color: "from-yellow-500 to-amber-500",
  },
  {
    name: "Email List Growth Calculator",
    description: "Project subscriber growth over time",
    icon: TrendingUp,
    route: "/tools/marketing/list-growth-calculator",
    category: "Email Marketing",
    color: "from-orange-500 to-red-500",
  },
  {
    name: "Spam Trigger Checker",
    description: "Flag words that trigger spam filters",
    icon: Mail,
    route: "/tools/marketing/spam-trigger-checker",
    category: "Email Marketing",
    color: "from-red-500 to-rose-500",
  },
  {
    name: "Email ROI Calculator",
    description: "Calculate return from email campaigns",
    icon: TrendingUp,
    route: "/tools/marketing/email-roi-calculator",
    category: "Email Marketing",
    color: "from-green-500 to-emerald-500",
  },

  // Conversion & Funnel
  {
    name: "Conversion Rate Calculator",
    description: "Calculate visitor conversion percentage",
    icon: Percent,
    route: "/tools/marketing/conversion-rate",
    category: "Conversion & Funnel",
    color: "from-blue-500 to-cyan-500",
  },
  {
    name: "A/B Test Sample Size",
    description: "Determine visitors needed for valid test",
    icon: Users,
    route: "/tools/marketing/ab-test-sample-size",
    category: "Conversion & Funnel",
    color: "from-sky-500 to-blue-500",
  },
  {
    name: "Revenue Per Visitor",
    description: "Calculate average revenue per visitor",
    icon: TrendingUp,
    route: "/tools/marketing/revenue-per-visitor",
    category: "Conversion & Funnel",
    color: "from-emerald-500 to-teal-500",
  },
  {
    name: "Funnel Drop‑Off Calculator",
    description: "Visualize where users drop off",
    icon: BarChart3,
    route: "/tools/marketing/funnel-dropoff",
    category: "Conversion & Funnel",
    color: "from-purple-500 to-indigo-500",
  },

  // Ad Campaign Tools
  {
    name: "Ad Copy A/B Test Significance",
    description: "Check if variation truly outperforms",
    icon: BarChart3,
    route: "/tools/marketing/ab-significance",
    category: "Ad Campaign Tools",
    color: "from-orange-500 to-amber-500",
  },
  {
    name: "Quality Score Simulator",
    description: "Estimate Google Ads Quality Score",
    icon: Target,
    route: "/tools/marketing/quality-score-simulator",
    category: "Ad Campaign Tools",
    color: "from-amber-500 to-orange-500",
  },
  {
    name: "Impression Share Calculator",
    description: "Calculate percentage of available impressions",
    icon: Eye,
    route: "/tools/marketing/impression-share",
    category: "Ad Campaign Tools",
    color: "from-green-500 to-emerald-500",
  },

  // Freelance & Agency
  {
    name: "Project Pricing Calculator",
    description: "Estimate cost based on hours and rate",
    icon: Calculator,
    route: "/tools/marketing/project-pricing",
    category: "Freelance & Agency",
    color: "from-indigo-500 to-purple-500",
  },
  {
    name: "Retainer Value Calculator",
    description: "Compare retainer vs hourly billing",
    icon: FileText,
    route: "/tools/marketing/retainer-value",
    category: "Freelance & Agency",
    color: "from-purple-500 to-pink-500",
  },
  {
    name: "Freelance Rate Calculator",
    description: "Determine minimum hourly rate needed",
    icon: Calculator,
    route: "/tools/marketing/freelance-rate",
    category: "Freelance & Agency",
    color: "from-pink-500 to-rose-500",
  },
];

const categories = ["All", ...Array.from(new Set(tools.map((t) => t.category)))];

// ----------------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------------
export default function MarketingToolsHub() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Remove any dark mode class on mount
  useEffect(() => {
    if (document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const filteredTools = useMemo(() => {
    let filtered = tools;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (tool) =>
          tool.name.toLowerCase().includes(q) ||
          tool.description.toLowerCase().includes(q) ||
          tool.category.toLowerCase().includes(q)
      );
    }
    if (selectedCategory !== "All") {
      filtered = filtered.filter((tool) => tool.category === selectedCategory);
    }
    return filtered;
  }, [searchQuery, selectedCategory]);

  const groupedTools = useMemo(() => {
    if (selectedCategory !== "All" || searchQuery.trim()) {
      return null;
    }
    const groups: Record<string, Tool[]> = {};
    tools.forEach((tool) => {
      if (!groups[tool.category]) groups[tool.category] = [];
      groups[tool.category].push(tool);
    });
    return groups;
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/20 via-white to-indigo-50/20 text-slate-800">
      <header className="bg-white/80 backdrop-blur-md border-b border-blue-100 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            href="/"
            className={`${playfair.className} text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent`}
          >
            MarketTools
          </Link>
          <span className={`${poppins.className} text-xs text-slate-500`}>
            Digital Marketing Calculators
          </span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <span>📊</span> Free Marketing Tools
          </div>
          <h1
            className={`${playfair.className} text-3xl sm:text-5xl font-extrabold text-slate-800 mb-3`}
          >
            Digital Marketing{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Calculators
            </span>
          </h1>
          <p
            className={`${poppins.className} text-base sm:text-lg text-slate-600 max-w-2xl mx-auto`}
          >
            Optimize your campaigns with confidence — ROI, CPC, SEO, social
            media, and budget calculators.
          </p>
        </motion.div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-6">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tools..."
              aria-label="Search marketing tools"
              className="w-full pl-12 pr-4 py-3.5 bg-white text-slate-800 border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base placeholder:text-slate-400"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              🔍
            </span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === cat
                  ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results Count */}
        {(searchQuery || selectedCategory !== "All") && (
          <div className="mb-6 text-center">
            <p className={`${poppins.className} text-sm text-slate-500`}>
              Found {filteredTools.length} tool
              {filteredTools.length !== 1 ? "s" : ""}
            </p>
          </div>
        )}

        {/* Tools Display */}
        {groupedTools && !searchQuery && selectedCategory === "All" ? (
          <div className="space-y-10">
            {Object.entries(groupedTools).map(([category, categoryTools]) => (
              <div key={category}>
                <h2
                  className={`${playfair.className} text-xl sm:text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2`}
                >
                  <span className="w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full"></span>
                  {category}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {categoryTools.map((tool, idx) => (
                    <ToolCard key={`${tool.route}-${tool.name}`} tool={tool} index={idx} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredTools.map((tool, idx) => (
              <ToolCard key={`${tool.route}-${tool.name}`} tool={tool} index={idx} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredTools.length === 0 && (
          <div className="text-center py-16">
            <p className={`${poppins.className} text-slate-500`}>
              No tools found. Try a different search.
            </p>
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-12 p-4 bg-blue-50 border border-blue-200 rounded-2xl text-center">
          <p className={`${poppins.className} text-xs text-blue-700`}>
            ⚠️ Disclaimer: These calculators provide estimates based on industry
            averages and user inputs. Results are for informational purposes
            only and should not replace professional marketing advice.
          </p>
        </div>
      </main>

      <footer className="border-t border-slate-200 py-6 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-slate-400">
          © {new Date().getFullYear()} MarketTools. Smart marketing planning
          for everyone.
        </div>
      </footer>
    </div>
  );
}

// ----------------------------------------------------------------------------
// Tool Card Component
// ----------------------------------------------------------------------------
function ToolCard({ tool, index }: { tool: Tool; index: number }) {
  const Icon = tool.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.03, 0.3) }}
      whileHover={{ y: -4 }}
      className="h-full"
    >
      <Link
        href={tool.route}
        className="block h-full bg-white rounded-2xl shadow-sm border border-slate-100 p-5 hover:shadow-lg transition-all duration-200 group"
      >
        <div className="flex items-start gap-3">
          <div
            className={`p-2.5 rounded-xl bg-gradient-to-br ${tool.color} text-white shadow-sm`}
          >
            <Icon size={20} />
          </div>
          <div className="flex-1">
            <h3
              className={`${poppins.className} font-semibold text-slate-800 group-hover:text-blue-600 transition-colors`}
            >
              {tool.name}
            </h3>
            <p
              className={`${poppins.className} text-xs text-slate-500 mt-0.5`}
            >
              {tool.description}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}