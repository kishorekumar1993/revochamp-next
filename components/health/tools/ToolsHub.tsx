"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Playfair_Display, Poppins } from "next/font/google";
import Link from "next/link";
import {
  Calendar,
  Egg,
  FlaskConical,
  Baby,
  Heart,
  Scale,
  Droplets,
  Syringe,
  Moon,
  Weight,
  Clock,
  Stethoscope,
  Shirt,
  Activity,
  FileText,
  Sparkles,
  Users,
  FileCheck,
  Apple,
  Footprints,
  LucideIcon,
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
// Tools Data
// ----------------------------------------------------------------------------
const tools: Tool[] = [
  // Period & Ovulation
  {
    name: "Period Calculator",
    description: "Track your menstrual cycle",
    icon: Calendar,
  route: "/tools/health/period-calculator",
    category: "Period & Ovulation",
    color: "from-pink-500 to-rose-500",
  },
  {
    name: "Fertile Window",
    description: "Find your most fertile days",
    icon: Egg,
  route: "/tools/health/fertile-window",
    category: "Period & Ovulation",
    color: "from-amber-500 to-orange-500",
  },
  {
    name: "Ovulation Calculator",
    description: "Predict ovulation dates",
    icon: FlaskConical,
  route: "/tools/health/ovulation-calculator",
    category: "Period & Ovulation",
    color: "from-blue-500 to-cyan-500",
  },
  {
    name: "Implantation Calculator",
    description: "Calculate implantation date",
    icon: Sparkles,
  route: "/tools/health/implantation-calculator",
    category: "Period & Ovulation",
    color: "from-purple-500 to-pink-500",
  },

  // Pregnancy
  {
    name: "Pregnancy Conception",
    description: "Estimate conception date",
    icon: Heart,
  route: "/tools/health/pregnancy-conception",
    category: "Pregnancy",
    color: "from-pink-500 to-purple-500",
  },
  {
    name: "Due Date Calculator",
    description: "Calculate your due date",
    icon: Calendar,
  route: "/tools/health/due-date-calculator",
    category: "Pregnancy",
    color: "from-indigo-500 to-blue-500",
  },
  {
    name: "Pregnancy Weight Gain",
    description: "Track healthy weight gain",
    icon: Scale,
  route: "/tools/health/pregnancy-weight-gain",
    category: "Pregnancy",
    color: "from-emerald-500 to-teal-500",
  },
  {
    name: "Baby Growth",
    description: "Monitor baby development",
    icon: Baby,
  route: "/tools/health/baby-growth",
    category: "Pregnancy",
    color: "from-orange-500 to-amber-500",
  },
  {
    name: "Pregnancy Symptom Checker",
    description: "Check pregnancy symptoms",
    icon: Stethoscope,
  route: "/tools/health/pregnancy-symptoms",
    category: "Pregnancy",
    color: "from-rose-500 to-pink-500",
  },

  // Fertility & IVF
  {
    name: "Fertility Assessment",
    description: "Assess your fertility health",
    icon: FileCheck,
  route: "/tools/health/fertility-assessment",
    category: "Fertility & IVF",
    color: "from-green-500 to-emerald-500",
  },
  {
    name: "IVF Success Prediction",
    description: "Estimate IVF success rates",
    icon: Activity,
  route: "/tools/health/ivf-prediction",
    category: "Fertility & IVF",
    color: "from-sky-500 to-blue-500",
  },
  {
    name: "Baby Gender Predictor",
    description: "Fun gender prediction",
    icon: Users,
  route: "/tools/health/baby-gender-predictor",
    category: "Fertility & IVF",
    color: "from-pink-400 to-rose-400",
  },

  // Health & Lifestyle
  {
    name: "BMI Calculator",
    description: "Calculate your BMI",
    icon: Scale,
  route: "/tools/health/health-calculator",
    category: "Health & Lifestyle",
    color: "from-blue-500 to-indigo-500",
  },
  {
    name: "Water Intake",
    description: "Track daily water intake",
    icon: Droplets,
  route: "/tools/health/hydration-calculator",
    category: "Health & Lifestyle",
    color: "from-cyan-500 to-blue-500",
  },
  {
    name: "Vaccination Reminder",
    description: "Never miss a vaccine",
    icon: Syringe,
  route: "/tools/health/vaccination-reminder",
    category: "Health & Lifestyle",
    color: "from-purple-500 to-violet-500",
  },
  {
    name: "Diet Planner",
    description: "Plan healthy meals",
    icon: Apple,
  route: "/tools/health/diet-planner",
    category: "Health & Lifestyle",
    color: "from-lime-500 to-green-500",
  },

  // Baby & Child
  {
    name: "Baby Kick Counter",
    description: "Count baby movements",
    icon: Footprints,
  route: "/tools/health/kick-counter",
    category: "Baby & Child",
    color: "from-teal-500 to-cyan-500",
  },
  {
    name: "Baby Sleep Tracker",
    description: "Monitor sleep patterns",
    icon: Moon,
  route: "/tools/health/baby-sleep-tracker",
    category: "Baby & Child",
    color: "from-indigo-500 to-purple-500",
  },
  {
    name: "Newborn Weight Tracker",
    description: "Track baby weight gain",
    icon: Weight,
  route: "/tools/health/newborn-weight-tracker",
    category: "Baby & Child",
    color: "from-emerald-500 to-green-500",
  },
  {
    name: "Teething Age Calculator",
    description: "Predict teething timeline",
    icon: Clock,
  route: "/tools/health/teething-calculator",
    category: "Baby & Child",
    color: "from-amber-500 to-yellow-500",
  },

  // Postpartum & Care
  {
    name: "Breastfeeding Tracker",
    description: "Track feeding sessions",
    icon: Baby,
  route: "/tools/health/breastfeeding-tracker",
    category: "Postpartum & Care",
    color: "from-pink-500 to-rose-500",
  },
  {
    name: "Diaper Tracker",
    description: "Monitor diaper changes",
    icon: Shirt,
  route: "/tools/health/diaper-tracker",
    category: "Postpartum & Care",
    color: "from-sky-500 to-blue-500",
  },
  {
    name: "Hospital Bag Checklist",
    description: "Prepare for hospital stay",
    icon: FileText,
  route: "/tools/health/hospital-bag-checklist",
    category: "Postpartum & Care",
    color: "from-purple-500 to-pink-500",
  },
];

const categories = ["All", ...Array.from(new Set(tools.map((t) => t.category)))];

// ----------------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------------
export default function ToolsHub() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // FIX: Remove any dark mode class or white text styles on mount/back navigation
  useEffect(() => {
    if (document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.remove("dark");
    }
    document.body.style.color = "";
    // Ensure no global white selection styles interfere (override in CSS if needed)
  }, []);

  // Filtered tools (with category search included)
  const filteredTools = useMemo(() => {
    let filtered = tools;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (tool) =>
          tool.name.toLowerCase().includes(q) ||
          tool.description.toLowerCase().includes(q) ||
          tool.category.toLowerCase().includes(q) // ✅ search includes category
      );
    }
    if (selectedCategory !== "All") {
      filtered = filtered.filter((tool) => tool.category === selectedCategory);
    }
    return filtered;
  }, [searchQuery, selectedCategory]);

  // Grouped tools (only for default view: no search, category = "All")
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
    <div className="min-h-screen bg-gradient-to-br from-amber-50/20 via-white to-pink-50/20 text-stone-800">
      <header className="bg-white/80 backdrop-blur-md border-b border-amber-100 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            href="/"
            className={`${playfair.className} text-xl font-bold bg-gradient-to-r from-amber-600 to-pink-600 bg-clip-text text-transparent`}
          >
            Revochamp
          </Link>
          <span className={`${poppins.className} text-xs text-stone-500`}>
            Health Tools
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
          <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <span>🛠️</span> Free Evidence-Based Tools
          </div>
          <h1
            className={`${playfair.className} text-3xl sm:text-5xl font-extrabold text-stone-800 mb-3`}
          >
            Your Health &{" "}
            <span className="bg-gradient-to-r from-amber-600 to-pink-600 bg-clip-text text-transparent">
              Parenting Toolkit
            </span>
          </h1>
          <p
            className={`${poppins.className} text-base sm:text-lg text-stone-600 max-w-2xl mx-auto`}
          >
            Calculators and trackers for fertility, pregnancy, baby care, and
            postpartum recovery.
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
              aria-label="Search health tools"
              className="w-full pl-12 pr-4 py-3.5 bg-white text-stone-800 border border-stone-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent text-base placeholder:text-stone-400"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">
              🔍
            </span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
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
                  ? "bg-gradient-to-r from-amber-500 to-pink-500 text-white shadow-md"
                  : "bg-white text-stone-600 hover:bg-stone-100 border border-stone-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results Count */}
        {(searchQuery || selectedCategory !== "All") && (
          <div className="mb-6 text-center">
            <p className={`${poppins.className} text-sm text-stone-500`}>
              Found {filteredTools.length} tool
              {filteredTools.length !== 1 ? "s" : ""}
            </p>
          </div>
        )}

        {/* Tools Display */}
        {groupedTools && !searchQuery && selectedCategory === "All" ? (
          // Grouped by category (default view)
          <div className="space-y-10">
            {Object.entries(groupedTools).map(([category, categoryTools]) => (
              <div key={category}>
                <h2
                  className={`${playfair.className} text-xl sm:text-2xl font-bold text-stone-800 mb-4 flex items-center gap-2`}
                >
                  <span className="w-1 h-6 bg-gradient-to-b from-amber-500 to-pink-500 rounded-full"></span>
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
          // Filtered grid (search or category filter active)
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredTools.map((tool, idx) => (
              <ToolCard key={`${tool.route}-${tool.name}`} tool={tool} index={idx} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredTools.length === 0 && (
          <div className="text-center py-16">
            <p className={`${poppins.className} text-stone-500`}>
              No tools found. Try a different search.
            </p>
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-12 p-4 bg-stone-50 border border-stone-200 rounded-2xl text-center">
          <p className={`${poppins.className} text-xs text-stone-500`}>
            ⚠️ These tools provide estimates and are for informational purposes
            only. Always consult a healthcare professional for medical advice.
          </p>
        </div>
      </main>

      <footer className="border-t border-stone-200 py-6 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-stone-400">
          © {new Date().getFullYear()} Revochamp. Evidence-based wellness tools.
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
        className="block h-full bg-white rounded-2xl shadow-sm border border-stone-100 p-5 hover:shadow-lg transition-all duration-200 group"
      >
        <div className="flex items-start gap-3">
          <div
            className={`p-2.5 rounded-xl bg-gradient-to-br ${tool.color} text-white shadow-sm`}
          >
            <Icon size={20} />
          </div>
          <div className="flex-1">
            <h3
              className={`${poppins.className} font-semibold text-stone-800 group-hover:text-amber-600 transition-colors`}
            >
              {tool.name}
            </h3>
            <p
              className={`${poppins.className} text-xs text-stone-500 mt-0.5`}
            >
              {tool.description}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
