// app/tools/compound-interest-calculator/CompoundInterestCalculatorClient.tsx
"use client";

import React, { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Playfair_Display, Poppins } from "next/font/google";
import Link from "next/link";
import {
  Calculator,
  IndianRupee,
  Percent,
  Calendar,
  TrendingUp,
  ChevronDown,
  ChevronRight,
  PiggyBank,
  Sparkles,
  Wallet,
  Plus,
} from "lucide-react";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "700", "800"] });
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

interface YearlyBreakdown {
  year: number;
  principal: number;
  interest: number;
  balance: number;
}

const compoundingOptions = [
  { value: 1, label: "Yearly" },
  { value: 2, label: "Half-Yearly" },
  { value: 4, label: "Quarterly" },
  { value: 12, label: "Monthly" },
];

export default function CompoundInterestCalculatorClient() {
  const [principal, setPrincipal] = useState(100000);
  const [monthlyAddition, setMonthlyAddition] = useState(0);
  const [interestRate, setInterestRate] = useState(10);
  const [years, setYears] = useState(10);
  const [compounding, setCompounding] = useState(4); // Quarterly default
  const [showBreakdown, setShowBreakdown] = useState(false);

  // Core calculation (supports monthly additions)
  const calculateCompoundInterest = useCallback(() => {
    const P = principal;
    const M = monthlyAddition;
    const r = interestRate / 100;
    const n = compounding;
    const t = years;

    if (r === 0) {
      const totalPrincipal = P + M * 12 * t;
      return {
        maturityAmount: totalPrincipal,
        totalInvestment: totalPrincipal,
        interestEarned: 0,
        breakdown: [],
      };
    }

    // Effective monthly rate for monthly addition
    const monthlyRate = Math.pow(1 + r / n, n / 12) - 1;

    // Future value of initial principal
    const fvPrincipal = P * Math.pow(1 + r / n, n * t);

    // Future value of monthly additions (annuity)
    let fvAdditions = 0;
    if (M > 0) {
      const months = t * 12;
      fvAdditions = M * (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate * (1 + monthlyRate);
    }

    const maturityAmount = fvPrincipal + fvAdditions;
    const totalInvestment = P + M * 12 * t;
    const interestEarned = maturityAmount - totalInvestment;

    // Yearly breakdown
    const breakdown: YearlyBreakdown[] = [];
    let runningBalance = P;
    let runningPrincipal = P;

    for (let year = 1; year <= t; year++) {
      // Add contributions for the year (monthly additions)
      runningPrincipal += M * 12;
      // Compound the balance for 1 year (using effective annual rate)
      const effectiveAnnualRate = Math.pow(1 + r / n, n) - 1;
      const balanceAtYearEnd = runningBalance * Math.pow(1 + effectiveAnnualRate, 1);
      // For each year, also the new contributions added during the year grow partially
      // This is an approximation; a more accurate method would use monthly compounding within the year.
      // But for simplicity and readability, we treat contributions as added at year start.
      // However, to be more accurate, we recalc the balance properly with monthly additions:
      let accurateBalance = runningBalance;
      for (let month = 1; month <= 12; month++) {
        accurateBalance = accurateBalance * (1 + monthlyRate) + M;
      }
      const yearlyInterest = accurateBalance - runningPrincipal;
      breakdown.push({
        year,
        principal: runningPrincipal,
        interest: yearlyInterest,
        balance: accurateBalance,
      });
      runningBalance = accurateBalance;
    }

    return { maturityAmount, totalInvestment, interestEarned, breakdown };
  }, [principal, monthlyAddition, interestRate, years, compounding]);

  const result = useMemo(() => calculateCompoundInterest(), [calculateCompoundInterest]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Donut chart data
  const total = result.maturityAmount;
  const principalPercentage = total > 0 ? (result.totalInvestment / total) * 100 : 0;
  const interestPercentage = total > 0 ? (result.interestEarned / total) * 100 : 0;
  const circumference = 2 * Math.PI * 40;
  const principalDash = (principalPercentage / 100) * circumference;
  const interestDash = (interestPercentage / 100) * circumference;
  const offsetRounded = -principalDash;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/30 via-white to-indigo-50/20 text-slate-800">
      <header className="bg-white/90 backdrop-blur-xl border-b border-purple-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className={`${playfair.className} text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent`}
          >
            FinTools
          </Link>
          <span className={`${poppins.className} text-sm font-medium text-slate-600`}>
            Compound Interest Calculator
          </span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-14">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 px-4 py-1.5 rounded-full text-sm font-medium mb-5 shadow-sm">
            <Sparkles size={16} /> The Eighth Wonder
          </div>
          <h1
            className={`${playfair.className} text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-4 leading-tight`}
          >
            Compound Interest{" "}
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Calculator
            </span>
          </h1>
          <p className={`${poppins.className} text-base sm:text-lg text-slate-600 max-w-3xl mx-auto`}>
            See how your money grows exponentially with compound interest. Add monthly contributions,
            choose compounding frequency, and watch your wealth multiply.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Panel */}
          <div className="lg:col-span-1 bg-white rounded-3xl shadow-xl border border-slate-200/80 p-6 md:p-7">
            <h2 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
              <Calculator size={20} className="text-purple-600" />
              Investment Details
            </h2>

            <div className="space-y-6">
              {/* Principal Amount */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-slate-600">Principal Amount (₹)</label>
                  <span className="text-sm font-mono font-semibold text-purple-700 bg-purple-50 px-3 py-1 rounded-full">
                    {formatCurrency(principal)}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={10000000}
                  step={50000}
                  value={principal}
                  onChange={(e) => setPrincipal(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>₹0</span>
                  <span>₹1Cr</span>
                </div>
              </div>

              {/* Monthly Addition */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-slate-600">Monthly Addition (₹)</label>
                  <span className="text-sm font-mono font-semibold text-purple-700 bg-purple-50 px-3 py-1 rounded-full">
                    {formatCurrency(monthlyAddition)}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={500000}
                  step={5000}
                  value={monthlyAddition}
                  onChange={(e) => setMonthlyAddition(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>₹0</span>
                  <span>₹5L</span>
                </div>
              </div>

              {/* Interest Rate */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-slate-600">Interest Rate (% p.a.)</label>
                  <span className="text-sm font-mono font-semibold text-purple-700 bg-purple-50 px-3 py-1 rounded-full">
                    {interestRate}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={30}
                  step={0.5}
                  value={interestRate}
                  onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>0%</span>
                  <span>30%</span>
                </div>
              </div>

              {/* Time Period */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-slate-600">Time Period (Years)</label>
                  <span className="text-sm font-mono font-semibold text-purple-700 bg-purple-50 px-3 py-1 rounded-full">
                    {years} {years === 1 ? "Year" : "Years"}
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={50}
                  step={1}
                  value={years}
                  onChange={(e) => setYears(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>1 Year</span>
                  <span>50 Years</span>
                </div>
              </div>

              {/* Compounding Frequency */}
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">
                  Compounding Frequency
                </label>
                <select
                  value={compounding}
                  onChange={(e) => setCompounding(parseInt(e.target.value))}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400"
                >
                  {compoundingOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-slate-400 mt-1.5">
                  More frequent compounding yields higher returns.
                </p>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl border border-slate-200/80 p-6 md:p-7">
            <h2 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
              <TrendingUp size={20} className="text-purple-600" />
              Future Value
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left side - Numbers */}
              <div>
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-5 mb-5 border border-purple-200">
                  <p className="text-sm text-purple-700 mb-1 font-medium">Maturity Amount</p>
                  <p className="text-4xl md:text-5xl font-bold text-purple-800 tracking-tight">
                    {formatCurrency(result.maturityAmount)}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <p className="text-xs text-slate-500 mb-1">Total Invested</p>
                    <p className="text-xl font-semibold text-slate-800">{formatCurrency(result.totalInvestment)}</p>
                  </div>
                  <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                    <p className="text-xs text-amber-600 mb-1">Total Interest</p>
                    <p className="text-xl font-semibold text-amber-700">{formatCurrency(result.interestEarned)}</p>
                  </div>
                </div>

                <div className="mt-5 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-xs text-slate-500 mb-2">Investment Summary</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-700">Initial Principal</span>
                    <span className="font-mono font-medium">{formatCurrency(principal)}</span>
                  </div>
                  {monthlyAddition > 0 && (
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-sm text-slate-700">Monthly Addition</span>
                      <span className="font-mono font-medium">{formatCurrency(monthlyAddition)}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200">
                    <span className="text-sm font-medium text-slate-800">Wealth Multiplier</span>
                    <span className="font-mono font-bold text-purple-700">
                      {(result.maturityAmount / result.totalInvestment).toFixed(2)}x
                    </span>
                  </div>
                </div>
              </div>

              {/* Donut Chart */}
              <div className="flex flex-col items-center justify-center">
                <div className="relative w-48 h-48">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#e2e8f0" strokeWidth="12" />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#8b5cf6"
                      strokeWidth="12"
                      strokeDasharray={`${principalDash} ${circumference}`}
                      className="transition-all duration-700"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="12"
                      strokeDasharray={`${interestDash} ${circumference}`}
                      strokeDashoffset={offsetRounded}
                      className="transition-all duration-700"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-slate-800">{interestPercentage.toFixed(1)}%</span>
                    <span className="text-xs text-slate-500">Interest Share</span>
                  </div>
                </div>
                <div className="flex items-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                    <span className="text-xs text-slate-600">Principal</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <span className="text-xs text-slate-600">Interest</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Year‑wise Breakdown */}
        <div className="mt-8">
          <button
            onClick={() => setShowBreakdown(!showBreakdown)}
            className="w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex items-center justify-between hover:bg-slate-50 transition-all group"
          >
            <span className="font-semibold text-slate-700 flex items-center gap-3">
              <div className="p-1.5 bg-purple-100 rounded-lg">
                <Calendar size={18} className="text-purple-600" />
              </div>
              Year‑wise Growth Breakdown
            </span>
            <div className="flex items-center gap-2 text-slate-400 group-hover:text-purple-600 transition-colors">
              <span className="text-sm">{result.breakdown.length} years</span>
              {showBreakdown ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
            </div>
          </button>

          <AnimatePresence>
            {showBreakdown && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden"
              >
                <div className="max-h-96 overflow-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 sticky top-0">
                      <tr className="border-b border-slate-200">
                        <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          Year
                        </th>
                        <th className="px-5 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          Total Invested
                        </th>
                        <th className="px-5 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          Interest Earned
                        </th>
                        <th className="px-5 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          Balance
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {result.breakdown.map((row) => (
                        <tr key={row.year} className="hover:bg-purple-50/30 transition-colors">
                          <td className="px-5 py-3 font-medium text-slate-700">Year {row.year}</td>
                          <td className="px-5 py-3 text-right font-mono text-slate-600">
                            {formatCurrency(row.principal)}
                          </td>
                          <td className="px-5 py-3 text-right font-mono text-amber-600 font-medium">
                            +{formatCurrency(row.interest)}
                          </td>
                          <td className="px-5 py-3 text-right font-mono text-purple-700 font-semibold">
                            {formatCurrency(row.balance)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="p-4 bg-slate-50 border-t border-slate-200 text-center">
                  <p className="text-xs text-slate-500">
                    📈 The longer you stay invested, the more powerful compounding becomes.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Tips Card */}
        <div className="mt-10 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-200">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-white rounded-xl shadow-sm">
              <Sparkles size={20} className="text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 mb-1">The Power of Compounding</h3>
              <p className="text-sm text-slate-600">
                Albert Einstein called compound interest the "eighth wonder of the world". Start early,
                invest regularly, and let your money work for you. Even small monthly additions can lead
                to massive wealth over long periods.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200/60 py-8 mt-8 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} FinTools. Grow your wealth wisely.
        </div>
      </footer>
    </div>
  );
}