// app/tools/home-loan-calculator/HomeLoanCalculatorClient.tsx
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
  Home,
  Sparkles,
  Wallet,
  AlertCircle,
} from "lucide-react";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "700", "800"] });
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

interface YearlyBreakdown {
  year: number;
  principalPaid: number;
  interestPaid: number;
  balance: number;
}

const loanPresets = [
  { name: "Standard Home", amount: 5000000, rate: 8.5, years: 20 },
  { name: "Premium Home", amount: 10000000, rate: 8.25, years: 25 },
  { name: "Affordable", amount: 2500000, rate: 8.75, years: 15 },
  { name: "Top-up Loan", amount: 1000000, rate: 9.0, years: 10 },
];

export default function HomeLoanCalculatorClient() {
  const [loanAmount, setLoanAmount] = useState(5000000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [loanTenure, setLoanTenure] = useState(20);
  const [showBreakdown, setShowBreakdown] = useState(false);

  // EMI calculation
  const calculateEMI = useCallback(() => {
    const P = loanAmount;
    const r = interestRate / 100 / 12; // monthly rate
    const n = loanTenure * 12; // total months

    if (r === 0) {
      const emi = P / n;
      const totalPayment = P;
      const totalInterest = 0;
      const breakdown: YearlyBreakdown[] = [];
      let balance = P;
      for (let year = 1; year <= loanTenure; year++) {
        const yearlyPrincipal = Math.min(emi * 12, balance);
        balance -= yearlyPrincipal;
        breakdown.push({
          year,
          principalPaid: yearlyPrincipal,
          interestPaid: 0,
          balance: Math.max(0, balance),
        });
      }
      return { emi, totalPayment, totalInterest, breakdown };
    }

    const emi = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - P;

    // Yearly amortization
    let balance = P;
    const breakdown: YearlyBreakdown[] = [];
    for (let year = 1; year <= loanTenure; year++) {
      let yearlyPrincipal = 0;
      let yearlyInterest = 0;
      for (let month = 1; month <= 12; month++) {
        if (balance <= 0) break;
        const interestForMonth = balance * r;
        const principalForMonth = emi - interestForMonth;
        yearlyInterest += interestForMonth;
        yearlyPrincipal += principalForMonth;
        balance -= principalForMonth;
      }
      if (balance < 0) balance = 0;
      breakdown.push({
        year,
        principalPaid: yearlyPrincipal,
        interestPaid: yearlyInterest,
        balance: Math.max(0, balance),
      });
    }

    return { emi, totalPayment, totalInterest, breakdown };
  }, [loanAmount, interestRate, loanTenure]);

  const result = useMemo(() => calculateEMI(), [calculateEMI]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handlePreset = (preset: typeof loanPresets[0]) => {
    setLoanAmount(preset.amount);
    setInterestRate(preset.rate);
    setLoanTenure(preset.years);
  };

  // Donut chart: principal vs interest
  const total = result.totalPayment;
  const principalPercentage = (loanAmount / total) * 100;
  const interestPercentage = (result.totalInterest / total) * 100;
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
            Home Loan Calculator
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
            <Home size={16} /> Dream Home Planner
          </div>
          <h1
            className={`${playfair.className} text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-4 leading-tight`}
          >
            Home Loan{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Calculator
            </span>
          </h1>
          <p className={`${poppins.className} text-base sm:text-lg text-slate-600 max-w-3xl mx-auto`}>
            Calculate your home loan EMI, total interest, and payment schedule. Adjust loan amount,
            interest rate, and tenure to plan your finances.
          </p>
        </motion.div>

        {/* Preset Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {loanPresets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => handlePreset(preset)}
              className="group bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-blue-300 transition-all text-left"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <Home size={16} className="text-blue-700" />
                </div>
                <span className="font-semibold text-slate-800">{preset.name}</span>
              </div>
              <p className="text-xs text-slate-500 mb-1">Loan Amount</p>
              <p className="text-sm font-bold text-slate-900">{formatCurrency(preset.amount)}</p>
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
              Loan Details
            </h2>

            <div className="space-y-6">
              {/* Loan Amount */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-slate-600">Loan Amount (₹)</label>
                  <span className="text-sm font-mono font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
                    {formatCurrency(loanAmount)}
                  </span>
                </div>
                <input
                  type="range"
                  min={100000}
                  max={50000000}
                  step={100000}
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>₹1L</span>
                  <span>₹5Cr</span>
                </div>
              </div>

              {/* Interest Rate */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-slate-600">Interest Rate (% p.a.)</label>
                  <span className="text-sm font-mono font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
                    {interestRate}%
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={20}
                  step={0.1}
                  value={interestRate}
                  onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>1%</span>
                  <span>20%</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">Current home loan rates: 8-9.5%</p>
              </div>

              {/* Loan Tenure */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-slate-600">Loan Tenure (Years)</label>
                  <span className="text-sm font-mono font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
                    {loanTenure} {loanTenure === 1 ? "Year" : "Years"}
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={30}
                  step={1}
                  value={loanTenure}
                  onChange={(e) => setLoanTenure(parseInt(e.target.value))}
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
              Your EMI Summary
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left side - Numbers */}
              <div>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 mb-5 border border-blue-200">
                  <p className="text-sm text-blue-700 mb-1 font-medium">Monthly EMI</p>
                  <p className="text-4xl md:text-5xl font-bold text-blue-800 tracking-tight">
                    {formatCurrency(result.emi)}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <p className="text-xs text-slate-500 mb-1">Total Interest Payable</p>
                    <p className="text-xl font-semibold text-amber-700">{formatCurrency(result.totalInterest)}</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <p className="text-xs text-slate-500 mb-1">Total Payment</p>
                    <p className="text-xl font-semibold text-slate-800">{formatCurrency(result.totalPayment)}</p>
                  </div>
                </div>

                <div className="mt-5 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-xs text-slate-500 mb-2">Loan Summary</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-700">Principal Amount</span>
                    <span className="font-mono font-medium">{formatCurrency(loanAmount)}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm text-slate-700">Total Interest %</span>
                    <span className="font-mono font-medium">
                      {((result.totalInterest / loanAmount) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200">
                    <span className="text-sm font-medium text-slate-800">Interest to Principal Ratio</span>
                    <span className="font-mono font-bold text-blue-700">
                      {(result.totalInterest / loanAmount).toFixed(2)}x
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
                <p className="text-xs text-slate-500 mt-3 text-center">
                  You'll pay {formatCurrency(result.totalInterest)} in interest over {loanTenure} years.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Amortization Table */}
        <div className="mt-8">
          <button
            onClick={() => setShowBreakdown(!showBreakdown)}
            className="w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex items-center justify-between hover:bg-slate-50 transition-all group"
          >
            <span className="font-semibold text-slate-700 flex items-center gap-3">
              <div className="p-1.5 bg-blue-100 rounded-lg">
                <Calendar size={18} className="text-blue-600" />
              </div>
              Year-wise Amortization Schedule
            </span>
            <div className="flex items-center gap-2 text-slate-400 group-hover:text-blue-600 transition-colors">
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
                          Principal Paid
                        </th>
                        <th className="px-5 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          Interest Paid
                        </th>
                        <th className="px-5 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          Balance
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {result.breakdown.map((row) => (
                        <tr key={row.year} className="hover:bg-blue-50/30 transition-colors">
                          <td className="px-5 py-3 font-medium text-slate-700">Year {row.year}</td>
                          <td className="px-5 py-3 text-right font-mono text-slate-600">
                            {formatCurrency(row.principalPaid)}
                          </td>
                          <td className="px-5 py-3 text-right font-mono text-amber-600">
                            {formatCurrency(row.interestPaid)}
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
                    📉 In early years, most of your EMI goes toward interest. Prepaying early saves significant interest.
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
              <h3 className="font-semibold text-slate-800 mb-1">Smart Home Loan Tips</h3>
              <p className="text-sm text-slate-600">
                Choose a shorter tenure if you can afford higher EMI – it saves lakhs in interest. Prepay whenever possible,
                especially in the first 5-7 years. Compare floating vs fixed rates. Use a home loan balance transfer if you get a lower rate.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200/60 py-8 mt-8 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} FinTools. Make informed home loan decisions.
        </div>
      </footer>
    </div>
  );
}