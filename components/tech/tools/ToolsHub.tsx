"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Playfair_Display, Poppins } from "next/font/google";
import Link from "next/link";
import {
  Code2,
  Braces,
  Hash,
  QrCode,
  FileJson,
  Globe,
  Lock,
  Palette,
  Calculator,
  Timer,
  Ruler,
  Database,
  KeyRound,
  Fingerprint,
  ShieldCheck,
  Link2,
  Image,
  type LucideIcon,
} from "lucide-react";

// ----------------------------------------------------------------------------
// Fonts (same as original)
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
// Tech Tools Data
// ----------------------------------------------------------------------------
const tools: Tool[] = [
  // Developer Utilities
  {
    name: "JSON Formatter",
    description: "Prettify and validate JSON",
    icon: Braces,
    route: "/tools/tech/json-formatter",
    category: "Developer Utilities",
    color: "from-blue-500 to-cyan-500",
  },
  {
    name: "Base64 Encoder/Decoder",
    description: "Encode or decode Base64 strings",
    icon: Code2,
    route: "/tools/tech/base64",
    category: "Developer Utilities",
    color: "from-emerald-500 to-teal-500",
  },
  {
    name: "URL Parser",
    description: "Break down URL components",
    icon: Globe,
    route: "/tools/tech/url-parser",
    category: "Developer Utilities",
    color: "from-purple-500 to-violet-500",
  },
  {
    name: "JWT Debugger",
    description: "Decode and inspect JWT tokens",
    icon: KeyRound,
    route: "/tools/tech/jwt-debugger",
    category: "Developer Utilities",
    color: "from-amber-500 to-orange-500",
  },
  {
    name: "Regex Tester",
    description: "Test regular expressions live",
    icon: Hash,
    route: "/tools/tech/regex-tester",
    category: "Developer Utilities",
    color: "from-pink-500 to-rose-500",
  },

  // Converters
  {
    name: "Color Converter",
    description: "HEX, RGB, HSL, CMYK",
    icon: Palette,
    route: "/tools/tech/color-converter",
    category: "Converters",
    color: "from-indigo-500 to-blue-500",
  },
  {
    name: "Unit Converter",
    description: "Length, mass, temperature, etc.",
    icon: Ruler,
    route: "/tools/tech/unit-converter",
    category: "Converters",
    color: "from-green-500 to-emerald-500",
  },
  {
    name: "Timestamp Converter",
    description: "Unix time ↔ human readable",
    icon: Timer,
    route: "/tools/tech/timestamp-converter",
    category: "Converters",
    color: "from-orange-500 to-amber-500",
  },
  {
    name: "CSV to JSON",
    description: "Convert tabular data to JSON",
    icon: FileJson,
    route: "/tools/tech/csv-to-json",
    category: "Converters",
    color: "from-sky-500 to-blue-500",
  },

  // Generators
  {
    name: "UUID Generator",
    description: "Generate v1, v4 UUIDs",
    icon: Fingerprint,
    route: "/tools/tech/uuid-generator",
    category: "Generators",
    color: "from-rose-500 to-pink-500",
  },
  {
    name: "Password Generator",
    description: "Create strong random passwords",
    icon: Lock,
    route: "/tools/tech/password-generator",
    category: "Generators",
    color: "from-teal-500 to-cyan-500",
  },
  {
    name: "Lorem Ipsum Generator",
    description: "Generate placeholder text",
    icon: FileJson,
    route: "/tools/tech/lorem-ipsum",
    category: "Generators",
    color: "from-stone-500 to-neutral-500",
  },
  {
    name: "QR Code Generator",
    description: "Create QR codes instantly",
    icon: QrCode,
    route: "/tools/tech/qr-generator",
    category: "Generators",
    color: "from-gray-700 to-gray-900",
  },

  // Security & Hashing
  {
    name: "Hash Generator",
    description: "MD5, SHA-1, SHA-256, etc.",
    icon: ShieldCheck,
    route: "/tools/tech/hash-generator",
    category: "Security & Hashing",
    color: "from-red-500 to-rose-500",
  },
  {
    name: "SSL Checker",
    description: "Verify SSL certificate details",
    icon: Lock,
    route: "/tools/tech/ssl-checker",
    category: "Security & Hashing",
    color: "from-cyan-500 to-blue-500",
  },
  {
    name: "Password Strength Meter",
    description: "Check password robustness",
    icon: KeyRound,
    route: "/tools/tech/password-strength",
    category: "Security & Hashing",
    color: "from-amber-500 to-yellow-500",
  },

  // Web Tools
  {
    name: "URL Shortener",
    description: "Create short, shareable links",
    icon: Link2,
    route: "/tools/tech/url-shortener",
    category: "Web Tools",
    color: "from-purple-500 to-pink-500",
  },
  {
    name: "Image Compressor",
    description: "Reduce image file size",
    icon: Image,
    route: "/tools/tech/image-compressor",
    category: "Web Tools",
    color: "from-lime-500 to-green-500",
  },
  {
    name: "Meta Tag Analyzer",
    description: "Inspect website meta tags",
    icon: Globe,
    route: "/tools/tech/meta-analyzer",
    category: "Web Tools",
    color: "from-blue-500 to-indigo-500",
  },
  {
    name: "SQL Formatter",
    description: "Beautify SQL queries",
    icon: Database,
    route: "/tools/tech/sql-formatter",
    category: "Web Tools",
    color: "from-orange-500 to-red-500",
  },
  {
    name: "IP Lookup",
    description: "Get geolocation from IP",
    icon: Globe,
    route: "/tools/tech/ip-lookup",
    category: "Web Tools",
    color: "from-violet-500 to-purple-500",
  },
];

const categories = ["All", ...Array.from(new Set(tools.map((t) => t.category)))];

// ----------------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------------
export default function TechToolsHub() {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50/20 via-white to-blue-50/20 text-slate-800">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            href="/"
            className={`${playfair.className} text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent`}
          >
            DevTools
          </Link>
          <span className={`${poppins.className} text-xs text-slate-500`}>
            Developer Utilities
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
            <span>⚙️</span> Free Developer Tools
          </div>
          <h1
            className={`${playfair.className} text-3xl sm:text-5xl font-extrabold text-slate-800 mb-3`}
          >
            Build & Debug{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Faster
            </span>
          </h1>
          <p
            className={`${poppins.className} text-base sm:text-lg text-slate-600 max-w-2xl mx-auto`}
          >
            Handy utilities for developers — formatters, converters, generators,
            and security tools.
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
              aria-label="Search tech tools"
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
        <div className="mt-12 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center">
          <p className={`${poppins.className} text-xs text-slate-500`}>
            ⚠️ These tools are for development purposes only. Always verify
            sensitive data handling.
          </p>
        </div>
      </main>

      <footer className="border-t border-slate-200 py-6 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-slate-400">
          © {new Date().getFullYear()} DevTools. Built for developers.
        </div>
      </footer>
    </div>
  );
}

// ----------------------------------------------------------------------------
// Tool Card Component (unchanged except for hover color)
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