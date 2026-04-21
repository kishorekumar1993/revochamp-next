// app/tools/swp-calculator/SwpCalculatorClient.tsx
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
  AlertCircle,
} from "lucide-react";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "700", "800"] });
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

interface YearlyBreakdown {
  year: number;
  startingBalance: number;
  withdrawals: number;
  interestEarned: number;
  endingBalance: number;
}

const withdrawalFrequencies = [
  { value: 1, label: "Monthly" },
  { value: 3, label: "Quarterly" },
  { value: 6, label: "Half-Yearly" },
  { value: 12, label: "Yearly" },
];

const swpPresets = [
  { name: "Retirement Income", amount: 5000000, withdrawal: 30000, years: 25, rate: 8 },
  { name: "Child Education", amount: 2000000, withdrawal: 20000, years: 10, rate: 9 },
  { name: "Monthly Pension", amount: 10000000, withdrawal: 60000, years: 20, rate: 7 },
  { name: "Bridge Corpus", amount: 3000000, withdrawal: 25000, years: 8, rate: 8 },
];

export default function SwpCalculatorClient() {
  const [initialInvestment, setInitialInvestment] = useState(5000000);
  const [monthlyWithdrawal, setMonthlyWithdrawal] = useState(30000);
  const [expectedReturn, setExpectedReturn] = useState(8);
  const [withdrawalFrequency, setWithdrawalFrequency] = useState(1); // Monthly
  const [showBreakdown, setShowBreakdown] = useState(false);

  // SWP calculation
  const calculateSWP = useCallback(() => {
    const P = initialInvestment;
    const annualRate = expectedReturn / 100;
    const freq = withdrawalFrequency; // withdrawals per year
    const periodicRate = annualRate / freq;
    const withdrawalPerPeriod = monthlyWithdrawal * (12 / freq); // adjust to frequency

    let balance = P;
    let totalWithdrawals = 0;
    let totalInterest = 0;
    let year = 0;
    let periods = 0;
    const maxPeriods = 100; // safety limit

    const breakdown: YearlyBreakdown[] = [];

    while (balance > 0 && periods < maxPeriods) {
      const yearIndex = Math.floor(periods / freq) + 1;
      const startOfPeriod = balance;

      // Apply interest for the period
      const interestThisPeriod = balance * periodicRate;
      balance += interestThisPeriod;
      totalInterest += interestThisPeriod;

      // Withdraw amount (if balance is sufficient)
      const withdrawAmount = Math.min(withdrawalPerPeriod, balance);
      balance -= withdrawAmount;
      totalWithdrawals += withdrawAmount;

      // If this is the last period of a year or balance exhausted
      if ((periods + 1) % freq === 0 || balance <= 0) {
        const endingBalance = Math.max(0, balance);
        const yearlyWithdrawals = withdrawalPerPeriod * ((periods % freq) + 1);
        breakdown.push({
          year: yearIndex,
          startingBalance: startOfPeriod,
          withdrawals: yearlyWithdrawals,
          interestEarned: interestThisPeriod,
          endingBalance: endingBalance,
        });
      }

      periods++;
      if (balance <= 0) break;
    }

    const totalPeriods = periods;
    const yearsCovered = totalPeriods / freq;
    const finalBalance = Math.max(0, balance);
    const totalWithdrawn = totalWithdrawals;
    const netGain = totalInterest - (initialInvestment - finalBalance);

    return {
      yearsCovered,
      finalBalance,
      totalWithdrawn,
      totalInterest,
      netGain,
      breakdown,
      withdrawalPerPeriod,
    };
  }, [initialInvestment, monthlyWithdrawal, expectedReturn, withdrawalFrequency]);

  const result = useMemo(() => calculateSWP(), [calculateSWP]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handlePreset = (preset: typeof swpPresets[0]) => {
    setInitialInvestment(preset.amount);
    setMonthlyWithdrawal(preset.withdrawal);
    setExpectedReturn(preset.rate);
    // preset years is for info only, we don't set time period as it's computed
  };

  // Donut chart: composition of withdrawals vs remaining vs interest
  const totalWithdrawn = result.totalWithdrawn;
  const finalBalance = result.finalBalance;
  const totalInvested = initialInvestment;
  const totalReturn = result.totalInterest;
  const totalCorpusUsed = totalWithdrawn + finalBalance;

  const withdrawnPercentage = totalCorpusUsed > 0 ? (totalWithdrawn / totalCorpusUsed) * 100 : 0;
  const remainingPercentage = totalCorpusUsed > 0 ? (finalBalance / totalCorpusUsed) * 100 : 0;
  const circumference = 2 * Math.PI * 40;
  const withdrawnDash = (withdrawnPercentage / 100) * circumference;
  const remainingDash = (remainingPercentage / 100) * circumference;
  const offsetRounded = -withdrawnDash;

  const isSustainable = result.yearsCovered >= 30; // arbitrary threshold

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-amber-50/20 text-slate-800">
      <header className="bg-white/90 backdrop-blur-xl border-b border-orange-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className={`${playfair.className} text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent`}
          >
            FinTools
          </Link>
          <span className={`${poppins.className} text-sm font-medium text-slate-600`}>
            SWP Calculator
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
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 px-4 py-1.5 rounded-full text-sm font-medium mb-5 shadow-sm">
            <PiggyBank size={16} /> Regular Income Plan
          </div>
          <h1
            className={`${playfair.className} text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-4 leading-tight`}
          >
            SWP{" "}
            <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              Calculator
            </span>
          </h1>
          <p className={`${poppins.className} text-base sm:text-lg text-slate-600 max-w-3xl mx-auto`}>
            Plan your Systematic Withdrawal Plan. Find out how long your lump sum investment will last
            with regular withdrawals. Adjust returns, withdrawal amount, and frequency.
          </p>
        </motion.div>

        {/* Preset Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {swpPresets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => handlePreset(preset)}
              className="group bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-orange-300 transition-all text-left"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                  <Wallet size={16} className="text-orange-700" />
                </div>
                <span className="font-semibold text-slate-800">{preset.name}</span>
              </div>
              <p className="text-xs text-slate-500 mb-1">Corpus / Withdrawal</p>
              <p className="text-sm font-bold text-slate-900">{formatCurrency(preset.amount)}</p>
              <p className="text-xs text-slate-500">Monthly: {formatCurrency(preset.withdrawal)}</p>
              <p className="text-xs text-slate-400 mt-1">
                {preset.rate}% • {preset.years} yrs target
              </p>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Panel */}
          <div className="lg:col-span-1 bg-white rounded-3xl shadow-xl border border-slate-200/80 p-6 md:p-7">
            <h2 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
              <Calculator size={20} className="text-orange-600" />
              Your SWP Details
            </h2>

            <div className="space-y-6">
              {/* Initial Investment */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-slate-600">Initial Investment (₹)</label>
                  <span className="text-sm font-mono font-semibold text-orange-700 bg-orange-50 px-3 py-1 rounded-full">
                    {formatCurrency(initialInvestment)}
                  </span>
                </div>
                <input
                  type="range"
                  min={100000}
                  max={50000000}
                  step={100000}
                  value={initialInvestment}
                  onChange={(e) => setInitialInvestment(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>₹1L</span>
                  <span>₹5Cr</span>
                </div>
              </div>

              {/* Monthly Withdrawal */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-slate-600">Monthly Withdrawal (₹)</label>
                  <span className="text-sm font-mono font-semibold text-orange-700 bg-orange-50 px-3 py-1 rounded-full">
                    {formatCurrency(monthlyWithdrawal)}
                  </span>
                </div>
                <input
                  type="range"
                  min={1000}
                  max={500000}
                  step={1000}
                  value={monthlyWithdrawal}
                  onChange={(e) => setMonthlyWithdrawal(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>₹1k</span>
                  <span>₹5L</span>
                </div>
              </div>

              {/* Expected Return */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-slate-600">Expected Return (% p.a.)</label>
                  <span className="text-sm font-mono font-semibold text-orange-700 bg-orange-50 px-3 py-1 rounded-full">
                    {expectedReturn}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={15}
                  step={0.5}
                  value={expectedReturn}
                  onChange={(e) => setExpectedReturn(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>0%</span>
                  <span>15%</span>
                </div>
              </div>

              {/* Withdrawal Frequency */}
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">
                  Withdrawal Frequency
                </label>
                <select
                  value={withdrawalFrequency}
                  onChange={(e) => setWithdrawalFrequency(parseInt(e.target.value))}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400"
                >
                  {withdrawalFrequencies.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-slate-400 mt-1.5">
                  More frequent withdrawals reduce corpus longevity.
                </p>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl border border-slate-200/80 p-6 md:p-7">
            <h2 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
              <TrendingUp size={20} className="text-orange-600" />
              Withdrawal Sustainability
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left side - Numbers */}
              <div>
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-5 mb-5 border border-orange-200">
                  <p className="text-sm text-orange-700 mb-1 font-medium">Corpus Duration</p>
                  <p className="text-4xl md:text-5xl font-bold text-orange-800 tracking-tight">
                    {result.yearsCovered.toFixed(1)} years
                  </p>
                  <p className="text-xs text-orange-600 mt-2">
                    Your corpus will last approximately {Math.floor(result.yearsCovered)} years and{" "}
                    {Math.round((result.yearsCovered % 1) * 12)} months
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <p className="text-xs text-slate-500 mb-1">Total Withdrawn</p>
                    <p className="text-xl font-semibold text-slate-800">{formatCurrency(result.totalWithdrawn)}</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <p className="text-xs text-slate-500 mb-1">Remaining Balance</p>
                    <p className="text-xl font-semibold text-slate-800">{formatCurrency(result.finalBalance)}</p>
                  </div>
                </div>

                <div className="mt-5 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-xs text-slate-500 mb-2">SWP Summary</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-700">Monthly Withdrawal</span>
                    <span className="font-mono font-medium">{formatCurrency(monthlyWithdrawal)}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm text-slate-700">Total Interest Earned</span>
                    <span className="font-mono font-medium text-green-600">
                      {formatCurrency(result.totalInterest)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200">
                    <span className="text-sm font-medium text-slate-800">Net Gain (Interest - Principal used)</span>
                    <span className={`font-mono font-bold ${result.netGain >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {formatCurrency(result.netGain)}
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
                      stroke="#f97316"
                      strokeWidth="12"
                      strokeDasharray={`${withdrawnDash} ${circumference}`}
                      className="transition-all duration-700"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#22c55e"
                      strokeWidth="12"
                      strokeDasharray={`${remainingDash} ${circumference}`}
                      strokeDashoffset={offsetRounded}
                      className="transition-all duration-700"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-slate-800">{withdrawnPercentage.toFixed(1)}%</span>
                    <span className="text-xs text-slate-500">Withdrawn</span>
                  </div>
                </div>
                <div className="flex items-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                    <span className="text-xs text-slate-600">Total Withdrawn</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-xs text-slate-600">Remaining</span>
                  </div>
                </div>
                {!isSustainable && result.yearsCovered < 20 && (
                  <div className="mt-4 p-2 bg-red-50 rounded-lg border border-red-200 text-xs text-red-700 flex items-center gap-1">
                    <AlertCircle size={14} />
                    <span>Withdrawal may deplete corpus sooner. Consider reducing withdrawal amount.</span>
                  </div>
                )}
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
              <div className="p-1.5 bg-orange-100 rounded-lg">
                <Calendar size={18} className="text-orange-600" />
              </div>
              Year‑wise Withdrawal Breakdown
            </span>
            <div className="flex items-center gap-2 text-slate-400 group-hover:text-orange-600 transition-colors">
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
                          Start Balance
                        </th>
                        <th className="px-5 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          Withdrawals
                        </th>
                        <th className="px-5 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          Interest Earned
                        </th>
                        <th className="px-5 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          End Balance
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {result.breakdown.map((row) => (
                        <tr key={row.year} className="hover:bg-orange-50/30 transition-colors">
                          <td className="px-5 py-3 font-medium text-slate-700">Year {row.year}</td>
                          <td className="px-5 py-3 text-right font-mono text-slate-600">
                            {formatCurrency(row.startingBalance)}
                          </td>
                          <td className="px-5 py-3 text-right font-mono text-amber-600 font-medium">
                            -{formatCurrency(row.withdrawals)}
                          </td>
                          <td className="px-5 py-3 text-right font-mono text-green-600">
                            +{formatCurrency(row.interestEarned)}
                          </td>
                          <td className="px-5 py-3 text-right font-mono text-orange-700 font-semibold">
                            {formatCurrency(row.endingBalance)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="p-4 bg-slate-50 border-t border-slate-200 text-center">
                  <p className="text-xs text-slate-500">
                    📉 Higher withdrawals or lower returns reduce corpus longevity. Plan withdrawals wisely.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Tip Card */}
        <div className="mt-10 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-200">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-white rounded-xl shadow-sm">
              <Sparkles size={20} className="text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 mb-1">SWP Strategy Tips</h3>
              <p className="text-sm text-slate-600">
                Withdraw only the required amount to make your corpus last longer. A balanced portfolio
                with moderate returns (7-9%) and inflation-adjusted withdrawals is ideal. Consider
                reinvesting surplus during good market years.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200/60 py-8 mt-8 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} FinTools. Plan your regular income smartly.
        </div>
      </footer>
    </div>
  );
}