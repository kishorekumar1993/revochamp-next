// app/tools/education-loan-calculator/EducationLoanCalculatorClient.tsx
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
  GraduationCap,
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

const educationPresets = [
  { name: "UG in India", amount: 800000, rate: 9.5, years: 10, moratorium: 1 },
  { name: "PG in India", amount: 1200000, rate: 9.25, years: 10, moratorium: 1 },
  { name: "Study Abroad", amount: 4000000, rate: 8.75, years: 15, moratorium: 2 },
  { name: "Professional", amount: 2500000, rate: 9.0, years: 12, moratorium: 1 },
];

export default function EducationLoanCalculatorClient() {
  const [loanAmount, setLoanAmount] = useState(1000000);
  const [interestRate, setInterestRate] = useState(9.25);
  const [loanTenure, setLoanTenure] = useState(10);
  const [moratoriumPeriod, setMoratoriumPeriod] = useState(1); // years before repayment starts
  const [showBreakdown, setShowBreakdown] = useState(false);

  // EMI calculation (with moratorium - simple interest accrued during moratorium)
  const calculateEMI = useCallback(() => {
    const P = loanAmount;
    const r = interestRate / 100 / 12;
    const totalMonths = loanTenure * 12;
    let effectivePrincipal = P;
    const emi = effectivePrincipal * r * Math.pow(1 + r, totalMonths) / (Math.pow(1 + r, totalMonths) - 1);
    const totalPayment = emi * totalMonths;
    const totalInterest = totalPayment - effectivePrincipal;
    const moratoriumInterest = effectivePrincipal - P;

    // During moratorium, simple interest accrues (most banks)
    if (moratoriumPeriod > 0) {
      const moratoriumInterest = P * (interestRate / 100) * moratoriumPeriod;
      effectivePrincipal = P + moratoriumInterest;
    }

    if (r === 0) {
      const emi = effectivePrincipal / totalMonths;
      const totalPayment = effectivePrincipal;
      const totalInterest = 0;
      const breakdown: YearlyBreakdown[] = [];
      let balance = effectivePrincipal;
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
      return { emi, totalPayment, totalInterest, breakdown, effectivePrincipal, moratoriumInterest };
    }


    // Yearly amortization (during repayment phase)
    let balance = effectivePrincipal;
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

    return { emi, totalPayment, totalInterest, breakdown, effectivePrincipal, moratoriumInterest };
  }, [loanAmount, interestRate, loanTenure, moratoriumPeriod]);

  const result = useMemo(() => calculateEMI(), [calculateEMI]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handlePreset = (preset: typeof educationPresets[0]) => {
    setLoanAmount(preset.amount);
    setInterestRate(preset.rate);
    setLoanTenure(preset.years);
    setMoratoriumPeriod(preset.moratorium);
  };

  // Donut chart: principal vs interest (including moratorium interest)
  const totalPayment = result.totalPayment;
  const principalPercentage = (loanAmount / totalPayment) * 100;
  const interestPercentage = (result.totalInterest / totalPayment) * 100;
  const circumference = 2 * Math.PI * 40;
  const principalDash = (principalPercentage / 100) * circumference;
  const interestDash = (interestPercentage / 100) * circumference;
  const offsetRounded = -principalDash;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/30 via-white to-pink-50/20 text-slate-800">
      <header className="bg-white/90 backdrop-blur-xl border-b border-purple-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className={`${playfair.className} text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent`}
          >
            FinTools
          </Link>
          <span className={`${poppins.className} text-sm font-medium text-slate-600`}>
            Education Loan Calculator
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
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-4 py-1.5 rounded-full text-sm font-medium mb-5 shadow-sm">
            <GraduationCap size={16} /> Invest in Knowledge
          </div>
          <h1
            className={`${playfair.className} text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-4 leading-tight`}
          >
            Education Loan{" "}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Calculator
            </span>
          </h1>
          <p className={`${poppins.className} text-base sm:text-lg text-slate-600 max-w-3xl mx-auto`}>
            Plan your education loan with EMI, total interest, and repayment schedule. Adjust loan
            amount, interest rate, tenure, and moratorium period to suit your needs.
          </p>
        </motion.div>

        {/* Preset Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {educationPresets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => handlePreset(preset)}
              className="group bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-purple-300 transition-all text-left"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                  <GraduationCap size={16} className="text-purple-700" />
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
              <Calculator size={20} className="text-purple-600" />
              Loan Details
            </h2>

            <div className="space-y-6">
              {/* Loan Amount */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-slate-600">Loan Amount (₹)</label>
                  <span className="text-sm font-mono font-semibold text-purple-700 bg-purple-50 px-3 py-1 rounded-full">
                    {formatCurrency(loanAmount)}
                  </span>
                </div>
                <input
                  type="range"
                  min={50000}
                  max={5000000}
                  step={50000}
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>₹50k</span>
                  <span>₹50L</span>
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
                  min={5}
                  max={15}
                  step={0.1}
                  value={interestRate}
                  onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>5%</span>
                  <span>15%</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">Government bank rates: 8-10%</p>
              </div>

              {/* Loan Tenure */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-slate-600">Repayment Tenure (Years)</label>
                  <span className="text-sm font-mono font-semibold text-purple-700 bg-purple-50 px-3 py-1 rounded-full">
                    {loanTenure} {loanTenure === 1 ? "Year" : "Years"}
                  </span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={20}
                  step={1}
                  value={loanTenure}
                  onChange={(e) => setLoanTenure(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>5 Years</span>
                  <span>20 Years</span>
                </div>
              </div>

              {/* Moratorium Period */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-slate-600">Moratorium Period (Years)</label>
                  <span className="text-sm font-mono font-semibold text-purple-700 bg-purple-50 px-3 py-1 rounded-full">
                    {moratoriumPeriod} {moratoriumPeriod === 1 ? "Year" : "Years"}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={5}
                  step={1}
                  value={moratoriumPeriod}
                  onChange={(e) => setMoratoriumPeriod(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>0 Years</span>
                  <span>5 Years</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  No repayment during moratorium, but simple interest accrues.
                </p>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl border border-slate-200/80 p-6 md:p-7">
            <h2 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
              <TrendingUp size={20} className="text-purple-600" />
              Your EMI Summary
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left side - Numbers */}
              <div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-5 mb-5 border border-purple-200">
                  <p className="text-sm text-purple-700 mb-1 font-medium">Monthly EMI (after moratorium)</p>
                  <p className="text-4xl md:text-5xl font-bold text-purple-800 tracking-tight">
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
                  {moratoriumPeriod > 0 && (
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-sm text-slate-700">Moratorium Interest Accrued</span>
                      <span className="font-mono font-medium text-amber-600">
                        {formatCurrency(result.moratoriumInterest)}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200">
                    <span className="text-sm font-medium text-slate-800">Effective Principal (after moratorium)</span>
                    <span className="font-mono font-bold text-purple-700">
                      {formatCurrency(result.effectivePrincipal)}
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
                    <span className="text-xs text-slate-600">Total Interest</span>
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
              <div className="p-1.5 bg-purple-100 rounded-lg">
                <Calendar size={18} className="text-purple-600" />
              </div>
              Year-wise Amortization Schedule (Repayment Phase)
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
                        <tr key={row.year} className="hover:bg-purple-50/30 transition-colors">
                          <td className="px-5 py-3 font-medium text-slate-700">Year {row.year}</td>
                          <td className="px-5 py-3 text-right font-mono text-slate-600">
                            {formatCurrency(row.principalPaid)}
                          </td>
                          <td className="px-5 py-3 text-right font-mono text-amber-600">
                            {formatCurrency(row.interestPaid)}
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
                    📚 Interest paid during the moratorium period is added to the principal. Start repaying early to save on interest.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Tip Card */}
        <div className="mt-10 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-white rounded-xl shadow-sm">
              <Sparkles size={20} className="text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 mb-1">Smart Education Loan Tips</h3>
              <p className="text-sm text-slate-600">
                Check for government subsidies (e.g., interest subvention schemes). Pay interest during
                moratorium if possible – it prevents capitalisation. Compare rates across banks and
                NBFCs. Use tax benefits under Section 80E for interest paid.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200/60 py-8 mt-8 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} FinTools. Invest in education, secure your future.
        </div>
      </footer>
    </div>
  );
}