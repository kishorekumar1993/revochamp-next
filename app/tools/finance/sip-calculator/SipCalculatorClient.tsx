// app/tools/sip-calculator/SipCalculatorClient.tsx
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
} from "lucide-react";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "700", "800"] });
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

interface YearlyBreakdown {
  year: number;
  totalInvested: number;
  interest: number;
  balance: number;
}

const sipPresets = [
  { name: "Retirement", monthly: 10000, years: 20, rate: 12 },
  { name: "Child Education", monthly: 5000, years: 15, rate: 12 },
  { name: "Dream Vacation", monthly: 3000, years: 5, rate: 10 },
  { name: "Down Payment", monthly: 8000, years: 7, rate: 11 },
];

export default function SipCalculatorClient() {
  const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [timePeriod, setTimePeriod] = useState(10); // years
  const [showBreakdown, setShowBreakdown] = useState(false);

  // SIP calculation (monthly compounding)
  const calculateSIP = useCallback(() => {
    const P = monthlyInvestment;
    const r = expectedReturn / 100 / 12; // monthly rate
    const n = timePeriod * 12; // total months

    if (r === 0) {
      const maturity = P * n;
      const totalInvested = maturity;
      const interestEarned = 0;
      const breakdown: YearlyBreakdown[] = [];
      for (let year = 1; year <= timePeriod; year++) {
        const monthsSoFar = year * 12;
        const balance = P * monthsSoFar;
        const prevBalance = year === 1 ? 0 : breakdown[year - 2].balance;
        const yearlyInterest = balance - prevBalance - P * 12;
        breakdown.push({
          year,
          totalInvested: P * monthsSoFar,
          interest: yearlyInterest,
          balance,
        });
      }
      return { maturityAmount: maturity, totalInvestment: totalInvested, interestEarned, breakdown };
    }

    // Future value of SIP: A = P * ((1+r)^n - 1)/r * (1+r) if invested at beginning of month
    // Standard formula for SIP (monthly investment at start of each month)
    const maturityAmount = P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    const totalInvestment = P * n;
    const interestEarned = maturityAmount - totalInvestment;

    // Yearly breakdown
    const breakdown: YearlyBreakdown[] = [];
    for (let year = 1; year <= timePeriod; year++) {
      const months = year * 12;
      const balance = P * ((Math.pow(1 + r, months) - 1) / r) * (1 + r);
      const prevBalance = year === 1 ? 0 : breakdown[year - 2].balance;
      const totalInvestedSoFar = P * months;
      const yearlyInterest = balance - prevBalance - P * 12;
      breakdown.push({
        year,
        totalInvested: totalInvestedSoFar,
        interest: yearlyInterest,
        balance,
      });
    }

    return { maturityAmount, totalInvestment, interestEarned, breakdown };
  }, [monthlyInvestment, expectedReturn, timePeriod]);

  const { maturityAmount, totalInvestment, interestEarned, breakdown } = useMemo(
    () => calculateSIP(),
    [calculateSIP]
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handlePreset = (preset: typeof sipPresets[0]) => {
    setMonthlyInvestment(preset.monthly);
    setExpectedReturn(preset.rate);
    setTimePeriod(preset.years);
  };

  // Donut chart data
  const total = maturityAmount;
  const principalPercentage = total > 0 ? (totalInvestment / total) * 100 : 0;
  const interestPercentage = total > 0 ? (interestEarned / total) * 100 : 0;
  const circumference = 2 * Math.PI * 40;
  const principalDash = (principalPercentage / 100) * circumference;
  const interestDash = (interestPercentage / 100) * circumference;
  const offsetRounded = -principalDash;

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
            SIP Calculator
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
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium mb-5 shadow-sm">
            <PiggyBank size={16} /> Wealth Creation
          </div>
          <h1
            className={`${playfair.className} text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-4 leading-tight`}
          >
            SIP{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Calculator
            </span>
          </h1>
          <p className={`${poppins.className} text-base sm:text-lg text-slate-600 max-w-3xl mx-auto`}>
            Plan your mutual fund SIP investments. See how monthly contributions grow over time with
            the power of compounding. Adjust amounts, returns, and tenure.
          </p>
        </motion.div>

        {/* Preset Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {sipPresets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => handlePreset(preset)}
              className="group bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-blue-300 transition-all text-left"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <Wallet size={16} className="text-blue-700" />
                </div>
                <span className="font-semibold text-slate-800">{preset.name}</span>
              </div>
              <p className="text-xs text-slate-500 mb-1">Monthly SIP</p>
              <p className="text-lg font-bold text-slate-900">{formatCurrency(preset.monthly)}</p>
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
              <Calculator size={20} className="text-blue-600" />
              Your SIP Details
            </h2>

            <div className="space-y-6">
              {/* Monthly Investment */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-slate-600">Monthly Investment (₹)</label>
                  <span className="text-sm font-mono font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
                    {formatCurrency(monthlyInvestment)}
                  </span>
                </div>
                <input
                  type="range"
                  min={500}
                  max={200000}
                  step={500}
                  value={monthlyInvestment}
                  onChange={(e) => setMonthlyInvestment(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>₹500</span>
                  <span>₹2L</span>
                </div>
              </div>

              {/* Expected Return */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-slate-600">Expected Return (% p.a.)</label>
                  <span className="text-sm font-mono font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
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
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>1%</span>
                  <span>20%</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Historical equity returns ~12-15%, debt ~6-8%. Past performance not guaranteed.
                </p>
              </div>

              {/* Time Period */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-slate-600">Time Period (Years)</label>
                  <span className="text-sm font-mono font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
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
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
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
              <TrendingUp size={20} className="text-blue-600" />
              Estimated Future Value
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left side - Numbers */}
              <div>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 mb-5 border border-blue-200">
                  <p className="text-sm text-blue-700 mb-1 font-medium">Total Corpus</p>
                  <p className="text-4xl md:text-5xl font-bold text-blue-800 tracking-tight">
                    {formatCurrency(maturityAmount)}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <p className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                      <IndianRupee size={12} /> Total Invested
                    </p>
                    <p className="text-xl font-semibold text-slate-800">{formatCurrency(totalInvestment)}</p>
                  </div>
                  <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                    <p className="text-xs text-amber-600 mb-1 flex items-center gap-1">
                      <TrendingUp size={12} /> Wealth Gain
                    </p>
                    <p className="text-xl font-semibold text-amber-700">{formatCurrency(interestEarned)}</p>
                  </div>
                </div>

                <div className="mt-5 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-xs text-slate-500 mb-2">SIP Summary</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-700">Monthly SIP</span>
                    <span className="font-mono font-medium">{formatCurrency(monthlyInvestment)}</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-slate-700">Total Installments</span>
                    <span className="font-mono font-medium">{timePeriod * 12} months</span>
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200">
                    <span className="text-sm font-medium text-slate-800">Wealth Ratio</span>
                    <span className="font-mono font-bold text-blue-700">
                      {((maturityAmount / totalInvestment) * 100).toFixed(1)}%
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
                      stroke="#3b82f6"
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
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
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
                          Total Invested
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
                            {formatCurrency(row.totalInvested)}
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
                    📈 The longer you stay invested, the more powerful compounding becomes.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Tip Card */}
        <div className="mt-10 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-white rounded-xl shadow-sm">
              <Sparkles size={20} className="text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 mb-1">Pro Tip: Start Early, Stay Disciplined</h3>
              <p className="text-sm text-slate-600">
                Even a small increase in monthly SIP or a few extra years can dramatically boost your final corpus.
                Use the power of compounding to your advantage – start today.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200/60 py-8 mt-8 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} FinTools. Invest wisely, grow wealth.
        </div>
      </footer>
    </div>
  );
}