// components/finance/tools/FinanceToolsHub.tsx
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Playfair_Display, Poppins } from "next/font/google";
import Link from "next/link";
import {
  Calculator,
  PiggyBank,
  Landmark,
  CreditCard,
  Percent,
  Calendar,
  TrendingUp,
  Shield,
  Banknote,
  LineChart,
  PieChart,
  Home,
  Car,
  GraduationCap,
  Wallet,
  Receipt,
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
// Finance Tools Data
// ----------------------------------------------------------------------------
const tools: Tool[] = [
  // Banking
  {
    name: "EMI Calculator",
    description: "Calculate monthly loan payments",
    icon: Calculator,
    route: "/tools/finance/emi-calculator",
    category: "Banking",
    color: "from-emerald-500 to-green-500",
  },
  {
    name: "Fixed Deposit Calculator",
    description: "Calculate FD maturity amount",
    icon: PiggyBank,
    route: "/tools/finance/fd-calculator",
    category: "Banking",
    color: "from-teal-500 to-emerald-500",
  },
  {
    name: "Recurring Deposit Calculator",
    description: "Calculate RD returns",
    icon: Calendar,
    route: "/tools/finance/rd-calculator",
    category: "Banking",
    color: "from-cyan-500 to-blue-500",
  },
  {
    name: "Savings Calculator",
    description: "Project your savings growth",
    icon: Banknote,
    route: "/tools/finance/savings-calculator",
    category: "Banking",
    color: "from-green-500 to-emerald-500",
  },
  {
    name: "Loan Eligibility Calculator",
    description: "Check how much you can borrow",
    icon: CreditCard,
    route: "/tools/finance/loan-eligibility",
    category: "Banking",
    color: "from-blue-500 to-indigo-500",
  },

  // Insurance
  {
    name: "Life Insurance Calculator",
    description: "Estimate life cover needed",
    icon: Shield,
    route: "/tools/finance/life-insurance-calculator",
    category: "Insurance",
    color: "from-indigo-500 to-purple-500",
  },
  {
    name: "Health Insurance Premium",
    description: "Estimate health insurance cost",
    icon: Shield,
    route: "/tools/finance/health-insurance-calculator",
    category: "Insurance",
    color: "from-purple-500 to-pink-500",
  },
  {
    name: "Term Insurance Calculator",
    description: "Calculate term insurance premium",
    icon: Shield,
    route: "/tools/finance/term-insurance-calculator",
    category: "Insurance",
    color: "from-violet-500 to-purple-500",
  },
  {
    name: "ULIP Calculator",
    description: "Calculate ULIP returns",
    icon: TrendingUp,
    route: "/tools/finance/ulip-calculator",
    category: "Insurance",
    color: "from-pink-500 to-rose-500",
  },

  // Mutual Funds
  {
    name: "SIP Calculator",
    description: "Calculate SIP investment returns",
    icon: LineChart,
    route: "/tools/finance/sip-calculator",
    category: "Mutual Funds",
    color: "from-amber-500 to-orange-500",
  },
  {
    name: "Lumpsum Calculator",
    description: "Calculate one-time investment growth",
    icon: TrendingUp,
    route: "/tools/finance/lumpsum-calculator",
    category: "Mutual Funds",
    color: "from-orange-500 to-red-500",
  },
  {
    name: "SIP Goal Planner",
    description: "Plan SIP for financial goals",
    icon: PieChart,
    route: "/tools/finance/sip-goal-planner",
    category: "Mutual Funds",
    color: "from-yellow-500 to-amber-500",
  },
  {
    name: "SWP Calculator",
    description: "Systematic Withdrawal Plan returns",
    icon: Wallet,
    route: "/tools/finance/swp-calculator",
    category: "Mutual Funds",
    color: "from-red-500 to-rose-500",
  },
  {
    name: "Mutual Fund Returns Calculator",
    description: "Calculate historical returns",
    icon: LineChart,
    route: "/tools/finance/mf-returns-calculator",
    category: "Mutual Funds",
    color: "from-orange-500 to-amber-500",
  },

  // Finance & Loans
  {
    name: "Home Loan Calculator",
    description: "Calculate home loan EMI & interest",
    icon: Home,
    route: "/tools/finance/home-loan-calculator",
    category: "Finance & Loans",
    color: "from-blue-500 to-cyan-500",
  },
  {
    name: "Car Loan Calculator",
    description: "Calculate car loan payments",
    icon: Car,
    route: "/tools/finance/car-loan-calculator",
    category: "Finance & Loans",
    color: "from-sky-500 to-blue-500",
  },
  {
    name: "Education Loan Calculator",
    description: "Calculate education loan EMI",
    icon: GraduationCap,
    route: "/tools/finance/education-loan-calculator",
    category: "Finance & Loans",
    color: "from-indigo-500 to-blue-500",
  },
  {
    name: "Personal Loan Calculator",
    description: "Calculate personal loan payments",
    icon: CreditCard,
    route: "/tools/finance/personal-loan-calculator",
    category: "Finance & Loans",
    color: "from-emerald-500 to-teal-500",
  },
  {
    name: "GST Calculator",
    description: "Calculate GST on products/services",
    icon: Receipt,
    route: "/tools/finance/gst-calculator",
    category: "Finance & Loans",
    color: "from-purple-500 to-indigo-500",
  },
  {
    name: "Income Tax Calculator",
    description: "Estimate income tax liability",
    icon: Calculator,
    route: "/tools/finance/income-tax-calculator",
    category: "Finance & Loans",
    color: "from-rose-500 to-pink-500",
  },
  {
    name: "Compound Interest Calculator",
    description: "Calculate compound interest growth",
    icon: TrendingUp,
    route: "/tools/finance/compound-interest-calculator",
    category: "Finance & Loans",
    color: "from-green-500 to-emerald-500",
  },
];

const categories = ["All", ...Array.from(new Set(tools.map((t) => t.category)))];

// ----------------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------------
export default function FinanceToolsHub() {
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/20 via-white to-amber-50/20 text-slate-800">
      <header className="bg-white/80 backdrop-blur-md border-b border-emerald-100 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            href="/"
            className={`${playfair.className} text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent`}
          >
            FinTools
          </Link>
          <span className={`${poppins.className} text-xs text-slate-500`}>
            Financial Calculators
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
          <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <span>💰</span> Free Financial Tools
          </div>
          <h1
            className={`${playfair.className} text-3xl sm:text-5xl font-extrabold text-slate-800 mb-3`}
          >
            Smart Financial{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Calculators
            </span>
          </h1>
          <p
            className={`${poppins.className} text-base sm:text-lg text-slate-600 max-w-2xl mx-auto`}
          >
            Plan your finances with confidence — banking, insurance, mutual
            funds, loans, and tax calculators.
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
              aria-label="Search finance tools"
              className="w-full pl-12 pr-4 py-3.5 bg-white text-slate-800 border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-base placeholder:text-slate-400"
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
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md"
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
                  <span className="w-1 h-6 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full"></span>
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
        <div className="mt-12 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-center">
          <p className={`${poppins.className} text-xs text-amber-700`}>
            ⚠️ Disclaimer: These calculators are for informational purposes only
            and should not be considered financial advice. Please consult a
            qualified financial advisor before making any investment decisions.
          </p>
        </div>
      </main>

      <footer className="border-t border-slate-200 py-6 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-slate-400">
          © {new Date().getFullYear()} FinTools. Smart financial planning for
          everyone.
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
              className={`${poppins.className} font-semibold text-slate-800 group-hover:text-emerald-600 transition-colors`}
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