// app/tools/finance/rd-calculator/RdCalculatorClient.tsx
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
  Repeat,
  PiggyBank,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "700", "800"] });
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

interface YearlyBreakdown {
  year: number;
  totalDeposits: number;
  interest: number;
  balance: number;
}

const compoundingOptions = [
  { value: 1, label: "Yearly" },
  { value: 2, label: "Half-Yearly" },
  { value: 4, label: "Quarterly" },
  { value: 12, label: "Monthly" },
];

const presetRds = [
  { name: "1 Year", monthly: 5000, rate: 7.0, tenure: 1 },
  { name: "3 Years", monthly: 10000, rate: 7.5, tenure: 3 },
  { name: "5 Years", monthly: 15000, rate: 8.0, tenure: 5 },
  { name: "10 Years", monthly: 20000, rate: 8.5, tenure: 10 },
];

export default function RdCalculatorClient() {
  const [monthlyAmount, setMonthlyAmount] = useState(10000);
  const [interestRate, setInterestRate] = useState(7.5);
  const [tenure, setTenure] = useState(3);
  const [compounding, setCompounding] = useState(4); // Quarterly default
  const [showBreakdown, setShowBreakdown] = useState(false);

  // ---------- FIXED CALCULATION (always positive interest) ----------
  const calculateRD = useCallback(() => {
    const P = monthlyAmount;
    const annualRate = interestRate / 100;
    const n = compounding;           // compounding periods per year
    const t = tenure;                // years
    const totalMonths = t * 12;

    // Edge case: 0% interest
    if (annualRate === 0) {
      const maturity = P * totalMonths;
      const totalInvestment = maturity;
      const interestEarned = 0;
      const breakdown: YearlyBreakdown[] = [];

      for (let year = 1; year <= t; year++) {
        const monthsSoFar = year * 12;
        const balance = P * monthsSoFar;
        const prevBalance = year === 1 ? 0 : breakdown[year - 2].balance;
        const yearlyInterest = balance - prevBalance - P * 12;
        breakdown.push({
          year,
          totalDeposits: P * monthsSoFar,
          interest: yearlyInterest,
          balance,
        });
      }

      return { maturityAmount: maturity, totalInvestment, interestEarned, breakdown };
    }

    // Effective monthly interest rate
    // Formula: (1 + annual_rate / compounding_periods)^(compounding_periods/12) - 1
    const periodicRate = annualRate / n;
    const effectiveMonthlyRate = Math.pow(1 + periodicRate, n / 12) - 1;

    // Maturity amount using geometric series: M = P * ((1+r)^N - 1) / r
    const maturityAmount =
      P * (Math.pow(1 + effectiveMonthlyRate, totalMonths) - 1) / effectiveMonthlyRate;

    const totalInvestment = P * totalMonths;
    const interestEarned = maturityAmount - totalInvestment;

    // Yearly breakdown using the same monthly compounding
    const breakdown: YearlyBreakdown[] = [];
    for (let year = 1; year <= t; year++) {
      const monthsSoFar = year * 12;
      const balance =
        P * (Math.pow(1 + effectiveMonthlyRate, monthsSoFar) - 1) / effectiveMonthlyRate;

      const prevBalance = year === 1 ? 0 : breakdown[year - 2].balance;
      const yearlyInterest = balance - prevBalance - P * 12;

      breakdown.push({
        year,
        totalDeposits: P * monthsSoFar,
        interest: yearlyInterest,
        balance,
      });
    }

    return { maturityAmount, totalInvestment, interestEarned, breakdown };
  }, [monthlyAmount, interestRate, tenure, compounding]);

  const { maturityAmount, totalInvestment, interestEarned, breakdown } = useMemo(
    () => calculateRD(),
    [calculateRD]
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handlePreset = (preset: typeof presetRds[0]) => {
    setMonthlyAmount(preset.monthly);
    setInterestRate(preset.rate);
    setTenure(preset.tenure);
  };

  // Donut chart (always positive percentages now)
  const total = maturityAmount;
  const investmentPercentage = total > 0 ? (totalInvestment / total) * 100 : 0;
  const interestPercentage = total > 0 ? (interestEarned / total) * 100 : 0;
  const circumference = 2 * Math.PI * 40; // r=40
  const investmentDash = (investmentPercentage / 100) * circumference;
  const interestDash = (interestPercentage / 100) * circumference;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/30 via-white to-teal-50/20 text-slate-800">
      <header className="bg-white/90 backdrop-blur-xl border-b border-emerald-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className={`${playfair.className} text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent`}
          >
            FinTools
          </Link>
          <span className={`${poppins.className} text-sm font-medium text-slate-600`}>
            RD Calculator
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
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-medium mb-5 shadow-sm">
            <Sparkles size={16} /> Smart Savings Tool
          </div>
          <h1
            className={`${playfair.className} text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-4 leading-tight`}
          >
            Recurring Deposit{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Calculator
            </span>
          </h1>
          <p className={`${poppins.className} text-base sm:text-lg text-slate-600 max-w-3xl mx-auto`}>
            Plan your monthly savings and see how your money grows with compound interest. Choose
            from popular tenures or customize your own.
          </p>
        </motion.div>

        {/* Preset Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {presetRds.map((preset) => (
            <button
              key={preset.name}
              onClick={() => handlePreset(preset)}
              className="group bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all text-left"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-emerald-100 rounded-lg group-hover:bg-emerald-200 transition-colors">
                  <PiggyBank size={16} className="text-emerald-700" />
                </div>
                <span className="font-semibold text-slate-800">{preset.name}</span>
              </div>
              <p className="text-xs text-slate-500 mb-1">Monthly Deposit</p>
              <p className="text-lg font-bold text-slate-900">{formatCurrency(preset.monthly)}</p>
              <p className="text-xs text-slate-400 mt-1">
                {preset.rate}% p.a. • {preset.tenure} yr
              </p>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Panel */}
          <div className="lg:col-span-1 bg-white rounded-3xl shadow-xl border border-slate-200/80 p-6 md:p-7">
            <h2 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
              <Calculator size={20} className="text-emerald-600" />
              Customize Your RD
            </h2>

            <div className="space-y-6">
              {/* Monthly Amount */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-slate-600">Monthly Deposit</label>
                  <span className="text-sm font-mono font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                    {formatCurrency(monthlyAmount)}
                  </span>
                </div>
                <input
                  type="range"
                  min={500}
                  max={100000}
                  step={500}
                  value={monthlyAmount}
                  onChange={(e) => setMonthlyAmount(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>₹500</span>
                  <span>₹1,00,000</span>
                </div>
              </div>

              {/* Interest Rate */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-slate-600">Interest Rate (% p.a.)</label>
                  <span className="text-sm font-mono font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                    {interestRate}%
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={15}
                  step={0.1}
                  value={interestRate}
                  onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>1%</span>
                  <span>15%</span>
                </div>
              </div>

              {/* Tenure */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-slate-600">Tenure (Years)</label>
                  <span className="text-sm font-mono font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                    {tenure} {tenure === 1 ? "Year" : "Years"}
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={20}
                  step={1}
                  value={tenure}
                  onChange={(e) => setTenure(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>1 Year</span>
                  <span>20 Years</span>
                </div>
              </div>

              {/* Compounding */}
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">
                  Compounding Frequency
                </label>
                <select
                  value={compounding}
                  onChange={(e) => setCompounding(parseInt(e.target.value))}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400"
                >
                  {compoundingOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1">
                  <span>💡</span> Banks typically compound quarterly
                </p>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl border border-slate-200/80 p-6 md:p-7">
            <h2 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
              <TrendingUp size={20} className="text-emerald-600" />
              Maturity Summary
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left side - Numbers */}
              <div>
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-5 mb-5 border border-emerald-200">
                  <p className="text-sm text-emerald-700 mb-1 font-medium">Total Maturity Value</p>
                  <p className="text-4xl md:text-5xl font-bold text-emerald-800 tracking-tight">
                    {formatCurrency(maturityAmount)}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <p className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                      <IndianRupee size={12} /> Total Investment
                    </p>
                    <p className="text-xl font-semibold text-slate-800">
                      {formatCurrency(totalInvestment)}
                    </p>
                  </div>
                  <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                    <p className="text-xs text-amber-600 mb-1 flex items-center gap-1">
                      <TrendingUp size={12} /> Interest Earned
                    </p>
                    <p className="text-xl font-semibold text-amber-700">
                      {formatCurrency(interestEarned)}
                    </p>
                  </div>
                </div>

                <div className="mt-5 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-xs text-slate-500 mb-2">Monthly Investment Summary</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-700">Monthly Deposit</span>
                    <span className="font-mono font-medium">{formatCurrency(monthlyAmount)}</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-slate-700">Total Months</span>
                    <span className="font-mono font-medium">{tenure * 12} months</span>
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200">
                    <span className="text-sm font-medium text-slate-800">Wealth Gain</span>
                    <span className="font-mono font-bold text-emerald-700">
                      {totalInvestment > 0 ? ((interestEarned / totalInvestment) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Right side - Donut Chart (now always positive) */}
              <div className="flex flex-col items-center justify-center">
                <div className="relative w-48 h-48">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#e2e8f0" strokeWidth="12" />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="12"
                      strokeDasharray={`${investmentDash} ${circumference}`}
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
                      strokeDashoffset={-investmentDash}
                      className="transition-all duration-700"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-slate-800">
                      {interestPercentage.toFixed(1)}%
                    </span>
                    <span className="text-xs text-slate-500">Interest Share</span>
                  </div>
                </div>
                <div className="flex items-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    <span className="text-xs text-slate-600">Investment</span>
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

        {/* Breakdown Section */}
        <div className="mt-8">
          <button
            onClick={() => setShowBreakdown(!showBreakdown)}
            className="w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex items-center justify-between hover:bg-slate-50 transition-all group"
          >
            <span className="font-semibold text-slate-700 flex items-center gap-3">
              <div className="p-1.5 bg-emerald-100 rounded-lg">
                <Calendar size={18} className="text-emerald-600" />
              </div>
              Year-wise Growth Breakdown
            </span>
            <div className="flex items-center gap-2 text-slate-400 group-hover:text-emerald-600 transition-colors">
              <span className="text-sm">{breakdown.length} years</span>
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
                          Total Deposits
                        </th>
                        <th className="px-5 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          Yearly Interest
                        </th>
                        <th className="px-5 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          Balance
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {breakdown.map((row) => (
                        <tr key={row.year} className="hover:bg-emerald-50/30 transition-colors">
                          <td className="px-5 py-3 font-medium text-slate-700">Year {row.year}</td>
                          <td className="px-5 py-3 text-right font-mono text-slate-600">
                            {formatCurrency(row.totalDeposits)}
                          </td>
                          <td className="px-5 py-3 text-right font-mono text-amber-600 font-medium">
                            +{formatCurrency(row.interest)}
                          </td>
                          <td className="px-5 py-3 text-right font-mono text-emerald-700 font-semibold">
                            {formatCurrency(row.balance)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="p-4 bg-slate-50 border-t border-slate-200 text-center">
                  <p className="text-xs text-slate-500">
                    📈 Your money grows faster in later years due to the power of compounding!
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Tips Card */}
        <div className="mt-10 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-white rounded-xl shadow-sm">
              <Sparkles size={20} className="text-emerald-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 mb-1">Pro Tip: Maximize Your RD Returns</h3>
              <p className="text-sm text-slate-600">
                Start early and choose longer tenures to benefit from compound interest. Even a small
                increase in monthly deposit can significantly boost your maturity amount over time.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200/60 py-8 mt-8 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} FinTools. Smart financial planning for everyone.
        </div>
      </footer>
    </div>
  );
}