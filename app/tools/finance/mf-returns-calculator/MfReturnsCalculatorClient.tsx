// app/tools/mf-returns-calculator/MfReturnsCalculatorClient.tsx
"use client";

import React, { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Playfair_Display, Poppins } from "next/font/google";
import Link from "next/link";
import {
  Calculator,
  IndianRupee,
  Calendar,
  TrendingUp,
  ChevronDown,
  ChevronRight,
  PiggyBank,
  Sparkles,
  Wallet,
  ArrowRight,
  BarChart3,
} from "lucide-react";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "700", "800"] });
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

interface YearlyBreakdown {
  year: number;
  totalInvested: number;
  interest: number;
  balance: number;
}

const mfPresets = [
  { name: "Large Cap Fund", mode: "lumpsum", amount: 100000, rate: 12, years: 5 },
  { name: "Mid Cap Fund", mode: "sip", monthly: 5000, rate: 14, years: 7 },
  { name: "Small Cap Fund", mode: "sip", monthly: 3000, rate: 15, years: 10 },
  { name: "Hybrid Fund", mode: "lumpsum", amount: 200000, rate: 10, years: 5 },
];

export default function MfReturnsCalculatorClient() {
  const [mode, setMode] = useState<"lumpsum" | "sip">("lumpsum");
  const [lumpsumAmount, setLumpsumAmount] = useState(100000);
  const [monthlySIP, setMonthlySIP] = useState(5000);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [timePeriod, setTimePeriod] = useState(5);
  const [showBreakdown, setShowBreakdown] = useState(false);

  // Calculate returns
  const calculateReturns = useCallback(() => {
    const r = expectedReturn / 100;
    const t = timePeriod;
    const months = t * 12;

    if (mode === "lumpsum") {
      const maturityAmount = lumpsumAmount * Math.pow(1 + r, t);
      const totalInvestment = lumpsumAmount;
      const interestEarned = maturityAmount - totalInvestment;

      // Yearly breakdown for lump sum (compounded annually)
      const breakdown: YearlyBreakdown[] = [];
      for (let year = 1; year <= t; year++) {
        const balance = lumpsumAmount * Math.pow(1 + r, year);
        const prevBalance = year === 1 ? lumpsumAmount : lumpsumAmount * Math.pow(1 + r, year - 1);
        const yearlyInterest = balance - prevBalance;
        breakdown.push({
          year,
          totalInvested: lumpsumAmount,
          interest: yearlyInterest,
          balance,
        });
      }
      const cagr = (Math.pow(maturityAmount / lumpsumAmount, 1 / t) - 1) * 100;
      return { maturityAmount, totalInvestment, interestEarned, breakdown, cagr };
    } else {
      // SIP mode (monthly investment at start of month)
      const monthlyRate = r / 12;
      if (monthlyRate === 0) {
        const maturityAmount = monthlySIP * months;
        const totalInvestment = maturityAmount;
        const interestEarned = 0;
        const breakdown: YearlyBreakdown[] = [];
        for (let year = 1; year <= t; year++) {
          const monthsSoFar = year * 12;
          const balance = monthlySIP * monthsSoFar;
          const prevBalance = year === 1 ? 0 : monthlySIP * (year - 1) * 12;
          const yearlyInterest = 0;
          breakdown.push({ year, totalInvested: balance, interest: yearlyInterest, balance });
        }
        return { maturityAmount, totalInvestment, interestEarned, breakdown, cagr: 0 };
      }
      const maturityAmount =
        monthlySIP * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
      const totalInvestment = monthlySIP * months;
      const interestEarned = maturityAmount - totalInvestment;

      // Yearly breakdown for SIP
      const breakdown: YearlyBreakdown[] = [];
      for (let year = 1; year <= t; year++) {
        const monthsSoFar = year * 12;
        const balance = monthlySIP * ((Math.pow(1 + monthlyRate, monthsSoFar) - 1) / monthlyRate) * (1 + monthlyRate);
        const prevBalance =
          year === 1 ? 0 : monthlySIP * ((Math.pow(1 + monthlyRate, (year - 1) * 12) - 1) / monthlyRate) * (1 + monthlyRate);
        const totalInvestedSoFar = monthlySIP * monthsSoFar;
        const yearlyInterest = balance - prevBalance - monthlySIP * 12;
        breakdown.push({
          year,
          totalInvested: totalInvestedSoFar,
          interest: yearlyInterest,
          balance,
        });
      }
      // Approximate XIRR (using CAGR formula for simplicity)
      const cagr = (Math.pow(maturityAmount / totalInvestment, 1 / t) - 1) * 100;
      return { maturityAmount, totalInvestment, interestEarned, breakdown, cagr };
    }
  }, [mode, lumpsumAmount, monthlySIP, expectedReturn, timePeriod]);

  const result = useMemo(() => calculateReturns(), [calculateReturns]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handlePreset = (preset: typeof mfPresets[0]) => {
    if (preset.mode === "lumpsum") {
      setMode("lumpsum");
      setLumpsumAmount(preset.amount!);
    } else {
      setMode("sip");
      setMonthlySIP(preset.monthly || 5000);
    }
    setExpectedReturn(preset.rate);
    setTimePeriod(preset.years);
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
    <div className="min-h-screen bg-gradient-to-br from-cyan-50/30 via-white to-blue-50/20 text-slate-800">
      <header className="bg-white/90 backdrop-blur-xl border-b border-cyan-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className={`${playfair.className} text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent`}
          >
            FinTools
          </Link>
          <span className={`${poppins.className} text-sm font-medium text-slate-600`}>
            MF Returns Calculator
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
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-700 px-4 py-1.5 rounded-full text-sm font-medium mb-5 shadow-sm">
            <BarChart3 size={16} /> Smart Investing
          </div>
          <h1
            className={`${playfair.className} text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-4 leading-tight`}
          >
            Mutual Fund{" "}
            <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              Returns Calculator
            </span>
          </h1>
          <p className={`${poppins.className} text-base sm:text-lg text-slate-600 max-w-3xl mx-auto`}>
            Calculate the future value of your mutual fund investments – both lump sum and monthly SIP.
            Estimate returns, see year‑wise growth, and plan your wealth creation journey.
          </p>
        </motion.div>

        {/* Preset Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {mfPresets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => handlePreset(preset)}
              className="group bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-cyan-300 transition-all text-left"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-cyan-100 rounded-lg group-hover:bg-cyan-200 transition-colors">
                  {preset.mode === "lumpsum" ? <Wallet size={16} className="text-cyan-700" /> : <PiggyBank size={16} className="text-cyan-700" />}
                </div>
                <span className="font-semibold text-slate-800">{preset.name}</span>
              </div>
              <p className="text-xs text-slate-500 mb-1">
                {preset.mode === "lumpsum" ? "Lump sum" : "Monthly SIP"}
              </p>
              <p className="text-sm font-bold text-slate-900">
                {preset.mode === "lumpsum"
                  ? formatCurrency(preset.amount!)
                  : formatCurrency(preset.monthly || 0)}
              </p>
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
              <Calculator size={20} className="text-cyan-600" />
              Investment Details
            </h2>

            <div className="space-y-6">
              {/* Mode Toggle */}
              <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
                <button
                  onClick={() => setMode("lumpsum")}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                    mode === "lumpsum"
                      ? "bg-cyan-600 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  Lump Sum
                </button>
                <button
                  onClick={() => setMode("sip")}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                    mode === "sip"
                      ? "bg-cyan-600 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  Monthly SIP
                </button>
              </div>

              {/* Amount based on mode */}
              {mode === "lumpsum" ? (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-600">Investment Amount (₹)</label>
                    <span className="text-sm font-mono font-semibold text-cyan-700 bg-cyan-50 px-3 py-1 rounded-full">
                      {formatCurrency(lumpsumAmount)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={10000}
                    max={5000000}
                    step={10000}
                    value={lumpsumAmount}
                    onChange={(e) => setLumpsumAmount(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>₹10k</span>
                    <span>₹50L</span>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-600">Monthly SIP (₹)</label>
                    <span className="text-sm font-mono font-semibold text-cyan-700 bg-cyan-50 px-3 py-1 rounded-full">
                      {formatCurrency(monthlySIP)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={500}
                    max={200000}
                    step={500}
                    value={monthlySIP}
                    onChange={(e) => setMonthlySIP(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>₹500</span>
                    <span>₹2L</span>
                  </div>
                </div>
              )}

              {/* Expected Return */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-slate-600">Expected Return (% p.a.)</label>
                  <span className="text-sm font-mono font-semibold text-cyan-700 bg-cyan-50 px-3 py-1 rounded-full">
                    {expectedReturn}%
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={20}
                  step={0.5}
                  value={expectedReturn}
                  onChange={(e) => setExpectedReturn(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>1%</span>
                  <span>20%</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Historical equity returns ~12-15%, debt ~6-8%.
                </p>
              </div>

              {/* Time Period */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-slate-600">Time Period (Years)</label>
                  <span className="text-sm font-mono font-semibold text-cyan-700 bg-cyan-50 px-3 py-1 rounded-full">
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
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
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
              <TrendingUp size={20} className="text-cyan-600" />
              Estimated Returns
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left side - Numbers */}
              <div>
                <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-5 mb-5 border border-cyan-200">
                  <p className="text-sm text-cyan-700 mb-1 font-medium">
                    {mode === "lumpsum" ? "Future Value" : "Corpus Value"}
                  </p>
                  <p className="text-4xl md:text-5xl font-bold text-cyan-800 tracking-tight">
                    {formatCurrency(result.maturityAmount)}
                  </p>
                  <p className="text-xs text-cyan-600 mt-2">
                    {mode === "lumpsum"
                      ? `Lump sum of ${formatCurrency(lumpsumAmount)}`
                      : `SIP of ${formatCurrency(monthlySIP)} / month`}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <p className="text-xs text-slate-500 mb-1">Total Invested</p>
                    <p className="text-xl font-semibold text-slate-800">{formatCurrency(result.totalInvestment)}</p>
                  </div>
                  <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                    <p className="text-xs text-amber-600 mb-1">Wealth Gain</p>
                    <p className="text-xl font-semibold text-amber-700">{formatCurrency(result.interestEarned)}</p>
                  </div>
                </div>

                <div className="mt-5 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-xs text-slate-500 mb-2">Return Metrics</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-700">
                      {mode === "lumpsum" ? "CAGR" : "XIRR (approx.)"}
                    </span>
                    <span className="font-mono font-bold text-cyan-700">{result.cagr.toFixed(2)}%</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-slate-700">Wealth Multiplier</span>
                    <span className="font-mono font-bold text-cyan-700">
                      {(result.maturityAmount / result.totalInvestment).toFixed(2)}x
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200">
                    <span className="text-sm font-medium text-slate-800">Investment Period</span>
                    <span className="font-mono font-medium">{timePeriod} years</span>
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
                      stroke="#06b6d4"
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
                    <span className="text-xs text-slate-500">Returns</span>
                  </div>
                </div>
                <div className="flex items-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
                    <span className="text-xs text-slate-600">Principal</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <span className="text-xs text-slate-600">Gains</span>
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
              <div className="p-1.5 bg-cyan-100 rounded-lg">
                <Calendar size={18} className="text-cyan-600" />
              </div>
              Year‑wise Growth Breakdown
            </span>
            <div className="flex items-center gap-2 text-slate-400 group-hover:text-cyan-600 transition-colors">
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
                          Yearly Gain
                        </th>
                        <th className="px-5 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          Balance
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {result.breakdown.map((row) => (
                        <tr key={row.year} className="hover:bg-cyan-50/30 transition-colors">
                          <td className="px-5 py-3 font-medium text-slate-700">Year {row.year}</td>
                          <td className="px-5 py-3 text-right font-mono text-slate-600">
                            {formatCurrency(row.totalInvested)}
                          </td>
                          <td className="px-5 py-3 text-right font-mono text-amber-600 font-medium">
                            +{formatCurrency(row.interest)}
                          </td>
                          <td className="px-5 py-3 text-right font-mono text-cyan-700 font-semibold">
                            {formatCurrency(row.balance)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="p-4 bg-slate-50 border-t border-slate-200 text-center">
                  <p className="text-xs text-slate-500">
                    📈 The longer you stay invested, the more compounding works in your favour.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Tip Card */}
        <div className="mt-10 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl p-6 border border-cyan-200">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-white rounded-xl shadow-sm">
              <Sparkles size={20} className="text-cyan-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 mb-1">Smart MF Investing Tips</h3>
              <p className="text-sm text-slate-600">
                Start early to maximise compounding. Even a 1% higher return can significantly boost your corpus.
                Diversify across equity, debt, and hybrid funds based on your risk appetite. Review portfolio annually.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200/60 py-8 mt-8 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} FinTools. Grow wealth with smart mutual fund investments.
        </div>
      </footer>
    </div>
  );
}