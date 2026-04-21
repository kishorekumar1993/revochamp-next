// app/tools/sip-goal-planner/SipGoalPlannerClient.tsx
"use client";

import React, { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Playfair_Display, Poppins } from "next/font/google";
import Link from "next/link";
import {
  Target,
  IndianRupee,
  Calendar,
  TrendingUp,
  ChevronDown,
  ChevronRight,
  PiggyBank,
  Sparkles,
  Wallet,
  ArrowRight,
  Clock,
} from "lucide-react";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "700", "800"] });
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

interface YearlyBreakdown {
  year: number;
  lumpSumValue: number;
  sipContributions: number;
  sipGrowth: number;
  totalBalance: number;
}

const goalPresets = [
  { name: "Child Education", target: 2000000, years: 15, currentSavings: 200000, rate: 12 },
  { name: "Retirement Corpus", target: 5000000, years: 20, currentSavings: 500000, rate: 12 },
  { name: "House Down Payment", target: 1500000, years: 5, currentSavings: 300000, rate: 10 },
  { name: "Dream Vacation", target: 500000, years: 3, currentSavings: 50000, rate: 9 },
];

export default function SipGoalPlannerClient() {
  const [targetAmount, setTargetAmount] = useState(2000000);
  const [currentSavings, setCurrentSavings] = useState(200000);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [timePeriod, setTimePeriod] = useState(10);
  const [showBreakdown, setShowBreakdown] = useState(false);

  // Calculate required monthly SIP
  const calculateSIP = useCallback(() => {
    const r = expectedReturn / 100 / 12; // monthly rate
    const n = timePeriod * 12; // total months

    if (r === 0) {
      const remaining = Math.max(0, targetAmount - currentSavings);
      const monthlySIP = remaining / n;
      const totalSIP = monthlySIP * n;
      const lumpSumGrowth = currentSavings;
      const sipContributions = totalSIP;
      const totalCorpus = lumpSumGrowth + totalSIP;
      const interestFromSIP = 0;

      // Simple yearly breakdown (no compounding)
      const breakdown: YearlyBreakdown[] = [];
      let cumulativeSIP = 0;
      let lumpValue = currentSavings;
      for (let year = 1; year <= timePeriod; year++) {
        cumulativeSIP += monthlySIP * 12;
        const balance = lumpValue + cumulativeSIP;
        breakdown.push({
          year,
          lumpSumValue: lumpValue,
          sipContributions: cumulativeSIP,
          sipGrowth: 0,
          totalBalance: balance,
        });
      }
      return { monthlySIP, totalCorpus, totalSIP, interestFromSIP, lumpSumGrowth, breakdown };
    }

    // Future value of existing lump sum
    const lumpSumFV = currentSavings * Math.pow(1 + r, n);
    const remainingGoal = Math.max(0, targetAmount - lumpSumFV);

    // Solve for monthly SIP (invested at beginning of each month)
    // Formula: SIP_FV = M * ((1+r)^n - 1)/r * (1+r)
    // So M = (remainingGoal * r) / ((1+r) * ((1+r)^n - 1))
    let monthlySIP = 0;
    if (remainingGoal > 0 && n > 0) {
      monthlySIP = (remainingGoal * r) / ((1 + r) * (Math.pow(1 + r, n) - 1));
    }
    monthlySIP = Math.max(0, monthlySIP);

    const totalSIP = monthlySIP * n;
    const sipFV = monthlySIP * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    const totalCorpus = lumpSumFV + sipFV;
    const interestFromSIP = sipFV - totalSIP;
    const lumpSumGrowth = lumpSumFV - currentSavings;

    // Yearly breakdown
    const breakdown: YearlyBreakdown[] = [];
    for (let year = 1; year <= timePeriod; year++) {
      const months = year * 12;
      const lumpValue = currentSavings * Math.pow(1 + r, months);
      const sipValue = monthlySIP * ((Math.pow(1 + r, months) - 1) / r) * (1 + r);
      const totalBalance = lumpValue + sipValue;
      breakdown.push({
        year,
        lumpSumValue: lumpValue,
        sipContributions: monthlySIP * months,
        sipGrowth: sipValue - monthlySIP * months,
        totalBalance,
      });
    }

    return {
      monthlySIP,
      totalCorpus,
      totalSIP,
      interestFromSIP,
      lumpSumGrowth,
      breakdown,
    };
  }, [targetAmount, currentSavings, expectedReturn, timePeriod]);

  const result = useMemo(() => calculateSIP(), [calculateSIP]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handlePreset = (preset: typeof goalPresets[0]) => {
    setTargetAmount(preset.target);
    setCurrentSavings(preset.currentSavings);
    setExpectedReturn(preset.rate);
    setTimePeriod(preset.years);
  };

  // Donut chart: how the goal is achieved
  const lumpSumContribution = currentSavings + result.lumpSumGrowth;
  const sipContribution = result.totalSIP;
  const totalCorpus = result.totalCorpus;
  const lumpSumPercentage = totalCorpus > 0 ? (lumpSumContribution / totalCorpus) * 100 : 0;
  const sipPercentage = totalCorpus > 0 ? (sipContribution / totalCorpus) * 100 : 0;
  const circumference = 2 * Math.PI * 40;
  const lumpDash = (lumpSumPercentage / 100) * circumference;
  const sipDash = (sipPercentage / 100) * circumference;
  const offsetRounded = -lumpDash;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50/30 via-white to-green-50/20 text-slate-800">
      <header className="bg-white/90 backdrop-blur-xl border-b border-teal-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className={`${playfair.className} text-2xl font-bold bg-gradient-to-r from-teal-600 to-green-600 bg-clip-text text-transparent`}
          >
            FinTools
          </Link>
          <span className={`${poppins.className} text-sm font-medium text-slate-600`}>
            SIP Goal Planner
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
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-100 to-green-100 text-teal-700 px-4 py-1.5 rounded-full text-sm font-medium mb-5 shadow-sm">
            <Target size={16} /> Achieve Your Dreams
          </div>
          <h1
            className={`${playfair.className} text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-4 leading-tight`}
          >
            SIP Goal{" "}
            <span className="bg-gradient-to-r from-teal-600 to-green-600 bg-clip-text text-transparent">
              Planner
            </span>
          </h1>
          <p className={`${poppins.className} text-base sm:text-lg text-slate-600 max-w-3xl mx-auto`}>
            Plan your monthly SIP to achieve a future financial goal. Enter your target amount,
            current savings, expected returns, and time horizon.
          </p>
        </motion.div>

        {/* Preset Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {goalPresets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => handlePreset(preset)}
              className="group bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-teal-300 transition-all text-left"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-teal-100 rounded-lg group-hover:bg-teal-200 transition-colors">
                  <Wallet size={16} className="text-teal-700" />
                </div>
                <span className="font-semibold text-slate-800">{preset.name}</span>
              </div>
              <p className="text-xs text-slate-500 mb-1">Target</p>
              <p className="text-lg font-bold text-slate-900">{formatCurrency(preset.target)}</p>
              <p className="text-xs text-slate-400 mt-1">
                {preset.rate}% • {preset.years} yrs
              </p>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Panel */}
          <div className="lg:col-span-1 bg-white rounded-3xl shadow-xl border border-slate-200/80 p-6 md:p-7">
            <h2 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
              <Target size={20} className="text-teal-600" />
              Your Financial Goal
            </h2>

            <div className="space-y-6">
              {/* Target Amount */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-slate-600">Target Amount (₹)</label>
                  <span className="text-sm font-mono font-semibold text-teal-700 bg-teal-50 px-3 py-1 rounded-full">
                    {formatCurrency(targetAmount)}
                  </span>
                </div>
                <input
                  type="range"
                  min={100000}
                  max={10000000}
                  step={50000}
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>₹1L</span>
                  <span>₹1Cr</span>
                </div>
              </div>

              {/* Current Savings */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-slate-600">Current Savings (₹)</label>
                  <span className="text-sm font-mono font-semibold text-teal-700 bg-teal-50 px-3 py-1 rounded-full">
                    {formatCurrency(currentSavings)}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={5000000}
                  step={25000}
                  value={currentSavings}
                  onChange={(e) => setCurrentSavings(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>₹0</span>
                  <span>₹50L</span>
                </div>
              </div>

              {/* Expected Return */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-slate-600">Expected Return (% p.a.)</label>
                  <span className="text-sm font-mono font-semibold text-teal-700 bg-teal-50 px-3 py-1 rounded-full">
                    {expectedReturn}%
                  </span>
                </div>
                <input
                  type="range"
                  min={4}
                  max={18}
                  step={0.5}
                  value={expectedReturn}
                  onChange={(e) => setExpectedReturn(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>4%</span>
                  <span>18%</span>
                </div>
              </div>

              {/* Time Period */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-slate-600">Time Horizon (Years)</label>
                  <span className="text-sm font-mono font-semibold text-teal-700 bg-teal-50 px-3 py-1 rounded-full">
                    {timePeriod} {timePeriod === 1 ? "Year" : "Years"}
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={30}
                  step={1}
                  value={timePeriod}
                  onChange={(e) => setTimePeriod(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>1 Year</span>
                  <span>30 Years</span>
                </div>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl border border-slate-200/80 p-6 md:p-7">
            <h2 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
              <TrendingUp size={20} className="text-teal-600" />
              Your Monthly SIP Requirement
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left side - Numbers */}
              <div>
                <div className="bg-gradient-to-br from-teal-50 to-green-50 rounded-2xl p-5 mb-5 border border-teal-200">
                  <p className="text-sm text-teal-700 mb-1 font-medium">Required Monthly SIP</p>
                  <p className="text-4xl md:text-5xl font-bold text-teal-800 tracking-tight">
                    {formatCurrency(result.monthlySIP)}
                  </p>
                  <p className="text-xs text-teal-600 mt-2">
                    To reach {formatCurrency(targetAmount)} in {timePeriod} years
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <p className="text-xs text-slate-500 mb-1">Total SIP Investment</p>
                    <p className="text-xl font-semibold text-slate-800">{formatCurrency(result.totalSIP)}</p>
                  </div>
                  <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                    <p className="text-xs text-amber-600 mb-1">SIP Interest Earned</p>
                    <p className="text-xl font-semibold text-amber-700">{formatCurrency(result.interestFromSIP)}</p>
                  </div>
                </div>

                <div className="mt-5 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-xs text-slate-500 mb-2">Goal Breakdown</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-700">Lump Sum Growth</span>
                    <span className="font-mono font-medium">{formatCurrency(currentSavings + result.lumpSumGrowth)}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm text-slate-700">SIP Contribution + Growth</span>
                    <span className="font-mono font-medium">{formatCurrency(result.totalSIP + result.interestFromSIP)}</span>
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200">
                    <span className="text-sm font-medium text-slate-800">Final Corpus</span>
                    <span className="font-mono font-bold text-teal-700">{formatCurrency(result.totalCorpus)}</span>
                  </div>
                </div>
              </div>

              {/* Donut Chart - Goal Source */}
              <div className="flex flex-col items-center justify-center">
                <div className="relative w-48 h-48">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#e2e8f0" strokeWidth="12" />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#14b8a6"
                      strokeWidth="12"
                      strokeDasharray={`${lumpDash} ${circumference}`}
                      className="transition-all duration-700"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="12"
                      strokeDasharray={`${sipDash} ${circumference}`}
                      strokeDashoffset={offsetRounded}
                      className="transition-all duration-700"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-slate-800">{sipPercentage.toFixed(1)}%</span>
                    <span className="text-xs text-slate-500">from SIP</span>
                  </div>
                </div>
                <div className="flex items-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-teal-500"></div>
                    <span className="text-xs text-slate-600">Lump Sum</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <span className="text-xs text-slate-600">SIP</span>
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
              <div className="p-1.5 bg-teal-100 rounded-lg">
                <Calendar size={18} className="text-teal-600" />
              </div>
              Year‑wise Growth Breakdown
            </span>
            <div className="flex items-center gap-2 text-slate-400 group-hover:text-teal-600 transition-colors">
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
                          Lump Sum Value
                        </th>
                        <th className="px-5 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          SIP Invested
                        </th>
                        <th className="px-5 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          SIP Growth
                        </th>
                        <th className="px-5 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          Total Balance
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {result.breakdown.map((row) => (
                        <tr key={row.year} className="hover:bg-teal-50/30 transition-colors">
                          <td className="px-5 py-3 font-medium text-slate-700">Year {row.year}</td>
                          <td className="px-5 py-3 text-right font-mono text-slate-600">
                            {formatCurrency(row.lumpSumValue)}
                          </td>
                          <td className="px-5 py-3 text-right font-mono text-slate-600">
                            {formatCurrency(row.sipContributions)}
                          </td>
                          <td className="px-5 py-3 text-right font-mono text-amber-600 font-medium">
                            +{formatCurrency(row.sipGrowth)}
                          </td>
                          <td className="px-5 py-3 text-right font-mono text-teal-700 font-semibold">
                            {formatCurrency(row.totalBalance)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="p-4 bg-slate-50 border-t border-slate-200 text-center">
                  <p className="text-xs text-slate-500">
                    📈 The longer your time horizon, the lower the monthly SIP required.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Tip Card */}
        <div className="mt-10 bg-gradient-to-r from-teal-50 to-green-50 rounded-2xl p-6 border border-teal-200">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-white rounded-xl shadow-sm">
              <Sparkles size={20} className="text-teal-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 mb-1">Smart Goal Planning Tips</h3>
              <p className="text-sm text-slate-600">
                Starting early reduces your monthly SIP significantly. Even a small increase in returns or
                a higher initial lump sum can lower the required SIP. Review your goals annually.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200/60 py-8 mt-8 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} FinTools. Plan today, achieve tomorrow.
        </div>
      </footer>
    </div>
  );
}