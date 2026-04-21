// app/tools/savings-calculator/SavingsCalculatorClient.tsx
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

export default function SavingsCalculatorClient() {
  const [mode, setMode] = useState<"lump-sum" | "monthly">("monthly");
  const [initialDeposit, setInitialDeposit] = useState(10000);
  const [monthlyContribution, setMonthlyContribution] = useState(5000);
  const [interestRate, setInterestRate] = useState(7.5);
  const [years, setYears] = useState(5);
  const [compounding, setCompounding] = useState(4);
  const [showBreakdown, setShowBreakdown] = useState(false);

  const calculateSavings = useCallback(() => {
    const annualRate = interestRate / 100;
    const n = compounding;
    const t = years;
    const totalMonths = t * 12;
    const periodicRate = annualRate / n;
    const effectiveMonthlyRate = Math.pow(1 + periodicRate, n / 12) - 1;

    if (annualRate === 0) {
      let totalPrincipal = initialDeposit;
      if (mode === "monthly") totalPrincipal += monthlyContribution * totalMonths;
      const maturity = totalPrincipal;
      const interestEarned = 0;
      const breakdown: YearlyBreakdown[] = [];
      for (let year = 1; year <= t; year++) {
        let balance = initialDeposit;
        if (mode === "monthly") balance += monthlyContribution * year * 12;
        breakdown.push({
          year,
          totalDeposits: balance,
          interest: 0,
          balance,
        });
      }
      return { maturityAmount: maturity, totalInvestment: totalPrincipal, interestEarned, breakdown };
    }

    let maturityAmount: number;
    let totalInvestment: number;

    if (mode === "lump-sum") {
      maturityAmount = initialDeposit * Math.pow(1 + effectiveMonthlyRate, totalMonths);
      totalInvestment = initialDeposit;
    } else {
      const fvInitial = initialDeposit * Math.pow(1 + effectiveMonthlyRate, totalMonths);
      const fvAnnuity =
        monthlyContribution *
        (Math.pow(1 + effectiveMonthlyRate, totalMonths) - 1) /
        effectiveMonthlyRate;
      maturityAmount = fvInitial + fvAnnuity;
      totalInvestment = initialDeposit + monthlyContribution * totalMonths;
    }

    const interestEarned = maturityAmount - totalInvestment;
    const breakdown: YearlyBreakdown[] = [];

    for (let year = 1; year <= t; year++) {
      const monthsSoFar = year * 12;
      let balance: number;
      if (mode === "lump-sum") {
        balance = initialDeposit * Math.pow(1 + effectiveMonthlyRate, monthsSoFar);
      } else {
        const fvInitial = initialDeposit * Math.pow(1 + effectiveMonthlyRate, monthsSoFar);
        const fvAnnuity =
          monthlyContribution *
          (Math.pow(1 + effectiveMonthlyRate, monthsSoFar) - 1) /
          effectiveMonthlyRate;
        balance = fvInitial + fvAnnuity;
      }
      const prevBalance = year === 1 ? 0 : breakdown[year - 2].balance;
      const totalDepositsSoFar =
        mode === "lump-sum"
          ? initialDeposit
          : initialDeposit + monthlyContribution * monthsSoFar;
      const yearlyInterest = balance - prevBalance - (mode === "lump-sum" ? 0 : monthlyContribution * 12);
      breakdown.push({ year, totalDeposits: totalDepositsSoFar, interest: yearlyInterest, balance });
    }

    return { maturityAmount, totalInvestment, interestEarned, breakdown };
  }, [mode, initialDeposit, monthlyContribution, interestRate, years, compounding]);

  const { maturityAmount, totalInvestment, interestEarned, breakdown } = useMemo(
    () => calculateSavings(),
    [calculateSavings]
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const total = maturityAmount;
  const principalPercentage = total > 0 ? (totalInvestment / total) * 100 : 0;
  const interestPercentage = total > 0 ? (interestEarned / total) * 100 : 0;

  const circumference = 2 * Math.PI * 40; // ≈ 251.32741228718345

  // FIX: Round to 2 decimals to prevent hydration mismatch
  const principalDashRaw = (principalPercentage / 100) * circumference;
  const interestDashRaw = (interestPercentage / 100) * circumference;
  const principalDashRounded = Number(principalDashRaw.toFixed(2));
  const interestDashRounded = Number(interestDashRaw.toFixed(2));
  const offsetRounded = -principalDashRounded;

  const tipMessage =
    mode === "lump-sum"
      ? "A longer investment horizon and higher compounding frequency dramatically boost your lump sum returns."
      : "Starting early and contributing consistently every month harnesses the full power of compounding. Even small increments matter.";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-indigo-50/20 text-slate-800">
      <header className="bg-white/90 backdrop-blur-xl border-b border-blue-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className={`${playfair.className} text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent`}
          >
            FinTools
          </Link>
          <span className={`${poppins.className} text-sm font-medium text-slate-600`}>
            Savings Calculator
          </span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-14">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium mb-5 shadow-sm">
            <Sparkles size={16} /> Wealth Builder
          </div>
          <h1
            className={`${playfair.className} text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-4 leading-tight`}
          >
            Savings{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Calculator
            </span>
          </h1>
          <p className={`${poppins.className} text-base sm:text-lg text-slate-600 max-w-3xl mx-auto`}>
            Project the growth of your savings — whether you make a one‑time deposit or contribute monthly.
            Adjust compounding frequency, interest rate, and time horizon.
          </p>
        </motion.div>

        <div className="flex justify-center mb-8">
          <div className="bg-white/80 backdrop-blur-sm p-1 rounded-2xl shadow-md border border-slate-200 inline-flex gap-1">
            <button
              onClick={() => setMode("lump-sum")}
              className={`px-5 py-2 rounded-xl font-medium transition-all ${
                mode === "lump-sum"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Wallet size={16} className="inline mr-2" />
              Lump Sum
            </button>
            <button
              onClick={() => setMode("monthly")}
              className={`px-5 py-2 rounded-xl font-medium transition-all ${
                mode === "monthly"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <PiggyBank size={16} className="inline mr-2" />
              Monthly Savings
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Panel */}
          <div className="lg:col-span-1 bg-white rounded-3xl shadow-xl border border-slate-200/80 p-6 md:p-7">
            <h2 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
              <Calculator size={20} className="text-blue-600" />
              Customise Your Plan
            </h2>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-slate-600">Initial Deposit</label>
                  <span className="text-sm font-mono font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
                    {formatCurrency(initialDeposit)}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={5000000}
                  step={10000}
                  value={initialDeposit}
                  onChange={(e) => setInitialDeposit(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>₹0</span>
                  <span>₹50 Lakh</span>
                </div>
              </div>

              {mode === "monthly" && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-600">Monthly Contribution</label>
                    <span className="text-sm font-mono font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
                      {formatCurrency(monthlyContribution)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={200000}
                    step={1000}
                    value={monthlyContribution}
                    onChange={(e) => setMonthlyContribution(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>₹0</span>
                    <span>₹2 Lakh</span>
                  </div>
                </div>
              )}

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-slate-600">Interest Rate (% p.a.)</label>
                  <span className="text-sm font-mono font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
                    {interestRate}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={20}
                  step={0.1}
                  value={interestRate}
                  onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>0%</span>
                  <span>20%</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-slate-600">Time Horizon (Years)</label>
                  <span className="text-sm font-mono font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
                    {years} {years === 1 ? "Year" : "Years"}
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={30}
                  step={1}
                  value={years}
                  onChange={(e) => setYears(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>1 Year</span>
                  <span>30 Years</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">
                  Compounding Frequency
                </label>
                <select
                  value={compounding}
                  onChange={(e) => setCompounding(parseInt(e.target.value))}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                >
                  {compoundingOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1">
                  <span>💡</span> More frequent compounding yields higher returns.
                </p>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl border border-slate-200/80 p-6 md:p-7">
            <h2 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
              <TrendingUp size={20} className="text-blue-600" />
              Projected Growth
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 mb-5 border border-blue-200">
                  <p className="text-sm text-blue-700 mb-1 font-medium">Final Maturity Value</p>
                  <p className="text-4xl md:text-5xl font-bold text-blue-800 tracking-tight">
                    {formatCurrency(maturityAmount)}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <p className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                      <IndianRupee size={12} /> Total Savings
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
                  <p className="text-xs text-slate-500 mb-2">Investment Summary</p>
                  {mode === "lump-sum" ? (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-700">One‑time Deposit</span>
                      <span className="font-mono font-medium">{formatCurrency(initialDeposit)}</span>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-700">Monthly Contribution</span>
                        <span className="font-mono font-medium">{formatCurrency(monthlyContribution)}</span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-slate-700">Total Months</span>
                        <span className="font-mono font-medium">{years * 12} months</span>
                      </div>
                    </>
                  )}
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200">
                    <span className="text-sm font-medium text-slate-800">Wealth Gain</span>
                    <span className="font-mono font-bold text-blue-700">
                      {totalInvestment > 0 ? ((interestEarned / totalInvestment) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Donut Chart - FIXED with rounded values */}
              <div className="flex flex-col items-center justify-center">
                <div className="relative w-48 h-48">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#e2e8f0" strokeWidth="12" />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="12"
                      strokeDasharray={`${principalDashRounded} ${circumference}`}
                      className="transition-all duration-700"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="12"
                      strokeDasharray={`${interestDashRounded} ${circumference}`}
                      strokeDashoffset={offsetRounded}
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
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-xs text-slate-600">Your Savings</span>
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
              <div className="p-1.5 bg-blue-100 rounded-lg">
                <Calendar size={18} className="text-blue-600" />
              </div>
              Year‑wise Growth Breakdown
            </span>
            <div className="flex items-center gap-2 text-slate-400 group-hover:text-blue-600 transition-colors">
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
                          Total Saved
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
                        <tr key={row.year} className="hover:bg-blue-50/30 transition-colors">
                          <td className="px-5 py-3 font-medium text-slate-700">Year {row.year}</td>
                          <td className="px-5 py-3 text-right font-mono text-slate-600">
                            {formatCurrency(row.totalDeposits)}
                          </td>
                          <td className="px-5 py-3 text-right font-mono text-amber-600 font-medium">
                            +{formatCurrency(row.interest)}
                          </td>
                          <td className="px-5 py-3 text-right font-mono text-blue-700 font-semibold">
                            {formatCurrency(row.balance)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="p-4 bg-slate-50 border-t border-slate-200 text-center">
                  <p className="text-xs text-slate-500">
                    📈 Compound interest accelerates your wealth – the longer you stay invested, the faster it grows.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-10 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-white rounded-xl shadow-sm">
              <Sparkles size={20} className="text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 mb-1">Pro Tip: Maximise Your Savings</h3>
              <p className="text-sm text-slate-600">{tipMessage}</p>
              <p className="text-xs text-slate-500 mt-2">
                Remember: even a 1% increase in interest rate or an extra year can significantly boost your final corpus.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200/60 py-8 mt-8 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} FinTools. Empowering your financial journey.
        </div>
      </footer>
    </div>
  );
}