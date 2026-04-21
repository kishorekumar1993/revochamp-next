"use client";

import React from "react";
import { motion } from "framer-motion";
import { Playfair_Display, Poppins } from "next/font/google";
import Link from "next/link";
import {
  TrendingUp,
  Code2,
  GraduationCap,
  Heart,
  Home,
  Percent,
  Shield,
  Zap,
  Lock,
  RefreshCw,
  type LucideIcon,
} from "lucide-react";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "700", "800"] });
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600"] });

interface Domain {
  name: string;
  description: string;
  icon: LucideIcon;
  route: string;
  gradient: string;
  bgLight: string;
  toolCount: number;
}

const domains: Domain[] = [
  {
    name: "Finance",
    description: "EMI, SIP, tax, insurance, investment calculators",
    icon: TrendingUp,
    route: "/tools/finance",
    gradient: "from-emerald-500 to-teal-500",
    bgLight: "bg-emerald-50",
    toolCount: 18,
  },
  {
    name: "Tech / Developer",
    description: "JSON, Base64, JWT, regex, color, generators",
    icon: Code2,
    route: "/tools/tech",
    gradient: "from-blue-500 to-cyan-500",
    bgLight: "bg-blue-50",
    toolCount: 12,
  },
  {
    name: "Education",
    description: "Grade, CGPA, attendance, study timer, citation",
    icon: GraduationCap,
    route: "/tools/education",
    gradient: "from-purple-500 to-violet-500",
    bgLight: "bg-purple-50",
    toolCount: 8,
  },
  {
    name: "Health & Wellness",
    description: "BMI, BMR, body fat, calorie, water intake",
    icon: Heart,
    route: "/tools/health",
    gradient: "from-rose-500 to-pink-500",
    bgLight: "bg-rose-50",
    toolCount: 7,
  },
  {
    name: "Real Estate",
    description: "Stamp duty, rent vs buy, area converter",
    icon: Home,
    route: "/tools/realestate",
    gradient: "from-indigo-500 to-blue-500",
    bgLight: "bg-indigo-50",
    toolCount: 5,
  },
  {
    name: "General Utilities",
    description: "Percentage, discount, tip, age, unit converter",
    icon: Percent,
    route: "/tools/general",
    gradient: "from-orange-500 to-amber-500",
    bgLight: "bg-orange-50",
    toolCount: 6,
  },
];

const benefits = [
  {
    icon: Zap,
    title: "Instant Results",
    description: "No waiting – calculations happen in real-time as you type.",
  },
  {
    icon: Lock,
    title: "100% Private",
    description: "All tools run locally in your browser. Your data never leaves your device.",
  },
  {
    icon: RefreshCw,
    title: "Always Free",
    description: "No subscriptions, no hidden fees, no signup required.",
  },
  {
    icon: Shield,
    title: "Trusted Accuracy",
    description: "Formulas verified against industry standards and financial regulations.",
  },
];

export default function ToolsDomainHub() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-100 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className={`${playfair.className} text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent`}>
            Revochamp
          </Link>
          <span className={`${poppins.className} text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full`}>
            50+ Tools
          </span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-medium mb-5 shadow-sm">
            <span>✨</span> Client-Side Tools
          </div>
          <h1 className={`${playfair.className} text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-4`}>
            Tools by{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Domain
            </span>
          </h1>
          <p className={`${poppins.className} text-lg text-slate-600 max-w-2xl mx-auto`}>
            Calculators, converters, and utilities organized by category. Fast, private, and completely free.
          </p>
        </motion.div>

        {/* Domain Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 mb-20">
          {domains.map((domain, idx) => {
            const Icon = domain.icon;
            return (
              <motion.div
                key={domain.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.07 }}
                whileHover={{ y: -8 }}
                className="group"
              >
                <Link
                  href={domain.route}
                  className="block h-full bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  {/* Colored top bar */}
                  <div className={`h-2 w-full bg-gradient-to-r ${domain.gradient}`}></div>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-xl ${domain.bgLight} group-hover:scale-110 transition-transform duration-200`}>
                        <Icon className={`w-6 h-6 text-${domain.gradient.split(' ')[1]?.replace('to-', '')}-600`} />
                      </div>
                      <div className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
                        {domain.toolCount} tools
                      </div>
                    </div>
                    <h2 className={`${playfair.className} text-xl font-bold text-slate-800 mb-2`}>
                      {domain.name}
                    </h2>
                    <p className={`${poppins.className} text-sm text-slate-500 leading-relaxed`}>
                      {domain.description}
                    </p>
                    <div className="mt-4 flex items-center text-indigo-600 text-sm font-medium group-hover:translate-x-1 transition-transform">
                      Browse tools →
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Why These Tools Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-indigo-50/50 to-purple-50/50 rounded-3xl p-8 md:p-10 mb-12 border border-indigo-100"
        >
          <div className="text-center mb-8">
            <h2 className={`${playfair.className} text-2xl md:text-3xl font-bold text-slate-800 mb-2`}>
              Why Revochamp Tools?
            </h2>
            <p className={`${poppins.className} text-slate-600 max-w-2xl mx-auto`}>
              Built for speed, privacy, and accuracy – no compromises.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, idx) => {
              const Icon = benefit.icon;
              return (
                <div key={idx} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white shadow-sm mb-3 mx-auto">
                    <Icon className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h3 className={`${poppins.className} font-semibold text-slate-800 mb-1`}>
                    {benefit.title}
                  </h3>
                  <p className={`${poppins.className} text-xs text-slate-500`}>
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Trust Badges & Call to Action */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium text-slate-600">100% Free</span>
          </div>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200">
            <Lock className="w-3 h-3 text-slate-500" />
            <span className="text-xs font-medium text-slate-600">No Signup</span>
          </div>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200">
            <RefreshCw className="w-3 h-3 text-slate-500" />
            <span className="text-xs font-medium text-slate-600">Client‑Side Only</span>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="text-center">
          <p className={`${poppins.className} text-xs text-slate-400 max-w-lg mx-auto`}>
            All tools run entirely in your browser – no data is sent to any server. 
            Calculations are performed locally for maximum privacy and speed.
          </p>
        </div>
      </main>

      <footer className="border-t border-slate-200 py-8 mt-8 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-slate-400">
          © {new Date().getFullYear()} Revochamp. Tools designed to simplify your digital life.
        </div>
      </footer>
    </div>
  );
}