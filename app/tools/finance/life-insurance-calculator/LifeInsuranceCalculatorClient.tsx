// app/tools/life-insurance-calculator/LifeInsuranceCalculatorClient.tsx
"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Playfair_Display, Poppins } from "next/font/google";
import Link from "next/link";
import {
  Shield,
  IndianRupee,
  Users,
  Home,
  Calculator,
  TrendingUp,
  AlertCircle,
  Heart,
  Sparkles,
  ChevronRight,
} from "lucide-react";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "700", "800"] });
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export default function LifeInsuranceCalculatorClient() {
  // User inputs
  const [monthlyIncome, setMonthlyIncome] = useState(75000);
  const [monthlyExpenses, setMonthlyExpenses] = useState(40000);
  const [existingSavings, setExistingSavings] = useState(500000);
  const [liabilities, setLiabilities] = useState(2000000); // home loan, car loan, etc.
  const [dependents, setDependents] = useState(2);
  const [yearsOfCover, setYearsOfCover] = useState(15); // income replacement years
  const [inflationRate, setInflationRate] = useState(6); // % per year

  // Derived values
  const annualIncome = monthlyIncome * 12;
  const annualExpenses = monthlyExpenses * 12;
  const annualSurplus = annualIncome - annualExpenses;

  // Method 1: Income Replacement Method (adjusted for inflation and years)
  const calculateIncomeReplacement = () => {
    // Future value of annual surplus adjusted for inflation over the coverage period
    // We assume the surplus grows with inflation (real terms remain constant)
    // Simplified: cover = annual_surplus * years * (1 + inflation_rate/100)^(years/2) (mid-point adjustment)
    const inflationFactor = Math.pow(1 + inflationRate / 100, yearsOfCover / 2);
    const totalCover = annualSurplus * yearsOfCover * inflationFactor;
    return Math.max(0, totalCover);
  };

  // Method 2: Human Life Value (capitalisation of income - expenses + liabilities - savings)
  const calculateHLV = () => {
    // HLV = (annual_surplus * (1 - (1+inflation)^-years) / (inflation_rate/100)) + liabilities - savings
    if (inflationRate === 0) return annualSurplus * yearsOfCover + liabilities - existingSavings;
    const discountRate = inflationRate / 100;
    const pvFactor = (1 - Math.pow(1 + discountRate, -yearsOfCover)) / discountRate;
    const cover = annualSurplus * pvFactor + liabilities - existingSavings;
    return Math.max(0, cover);
  };

  // Final recommended cover (average of both methods for robustness)
  const incomeReplacementCover = calculateIncomeReplacement();
  const hlvCover = calculateHLV();
  const recommendedCover = Math.round((incomeReplacementCover + hlvCover) / 2);

  // Monthly premium estimate (assuming typical term insurance rate: ~0.5% of cover per year for a healthy individual)
  const estimatedAnnualPremium = recommendedCover * 0.005; // 0.5% of sum assured
  const estimatedMonthlyPremium = estimatedAnnualPremium / 12;

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Risk assessment based on cover vs. income
  const coverMultiple = recommendedCover / annualIncome;
  let riskLevel = "Low";
  let riskColor = "text-green-600";
  let riskMessage = "Your family is well protected. Consider investing the surplus.";
  if (coverMultiple < 5) {
    riskLevel = "High";
    riskColor = "text-red-600";
    riskMessage = "Cover may be insufficient. Increase coverage to secure your family.";
  } else if (coverMultiple < 10) {
    riskLevel = "Medium";
    riskColor = "text-amber-600";
    riskMessage = "Adequate cover, but consider adding critical illness rider.";
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50/30 via-white to-orange-50/20 text-slate-800">
      <header className="bg-white/90 backdrop-blur-xl border-b border-rose-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className={`${playfair.className} text-2xl font-bold bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent`}
          >
            FinTools
          </Link>
          <span className={`${poppins.className} text-sm font-medium text-slate-600`}>
            Life Insurance Calculator
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
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-100 to-orange-100 text-rose-700 px-4 py-1.5 rounded-full text-sm font-medium mb-5 shadow-sm">
            <Heart size={16} /> Protect Your Loved Ones
          </div>
          <h1
            className={`${playfair.className} text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-4 leading-tight`}
          >
            Life Insurance{" "}
            <span className="bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent">
              Calculator
            </span>
          </h1>
          <p className={`${poppins.className} text-base sm:text-lg text-slate-600 max-w-3xl mx-auto`}>
            Calculate the right life cover for your family using the Human Life Value (HLV) method.
            Plan for income replacement, outstanding debts, and future goals.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Panel */}
          <div className="lg:col-span-1 bg-white rounded-3xl shadow-xl border border-slate-200/80 p-6 md:p-7">
            <h2 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
              <Calculator size={20} className="text-rose-600" />
              Your Financial Profile
            </h2>

            <div className="space-y-6">
              {/* Monthly Income */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-slate-600">Monthly Income (₹)</label>
                  <span className="text-sm font-mono font-semibold text-rose-700 bg-rose-50 px-3 py-1 rounded-full">
                    {formatCurrency(monthlyIncome)}
                  </span>
                </div>
                <input
                  type="range"
                  min={15000}
                  max={500000}
                  step={5000}
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-600"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>₹15k</span>
                  <span>₹5L</span>
                </div>
              </div>

              {/* Monthly Expenses */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-slate-600">Monthly Expenses (₹)</label>
                  <span className="text-sm font-mono font-semibold text-rose-700 bg-rose-50 px-3 py-1 rounded-full">
                    {formatCurrency(monthlyExpenses)}
                  </span>
                </div>
                <input
                  type="range"
                  min={5000}
                  max={300000}
                  step={5000}
                  value={monthlyExpenses}
                  onChange={(e) => setMonthlyExpenses(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-600"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>₹5k</span>
                  <span>₹3L</span>
                </div>
              </div>

              {/* Existing Savings */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-slate-600">Existing Savings / Investments (₹)</label>
                  <span className="text-sm font-mono font-semibold text-rose-700 bg-rose-50 px-3 py-1 rounded-full">
                    {formatCurrency(existingSavings)}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={10000000}
                  step={100000}
                  value={existingSavings}
                  onChange={(e) => setExistingSavings(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-600"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>₹0</span>
                  <span>₹1 Cr</span>
                </div>
              </div>

              {/* Liabilities */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-slate-600">Total Liabilities (Home/Car Loan etc.)</label>
                  <span className="text-sm font-mono font-semibold text-rose-700 bg-rose-50 px-3 py-1 rounded-full">
                    {formatCurrency(liabilities)}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={50000000}
                  step={500000}
                  value={liabilities}
                  onChange={(e) => setLiabilities(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-600"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>₹0</span>
                  <span>₹5 Cr</span>
                </div>
              </div>

              {/* Dependents */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-slate-600">Number of Dependents</label>
                  <span className="text-sm font-mono font-semibold text-rose-700 bg-rose-50 px-3 py-1 rounded-full">
                    {dependents}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={10}
                  step={1}
                  value={dependents}
                  onChange={(e) => setDependents(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-600"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>0</span>
                  <span>10</span>
                </div>
              </div>

              {/* Years of Cover */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-slate-600">Years of Income Replacement</label>
                  <span className="text-sm font-mono font-semibold text-rose-700 bg-rose-50 px-3 py-1 rounded-full">
                    {yearsOfCover} years
                  </span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={30}
                  step={1}
                  value={yearsOfCover}
                  onChange={(e) => setYearsOfCover(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-600"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>5 yrs</span>
                  <span>30 yrs</span>
                </div>
              </div>

              {/* Inflation Rate */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-slate-600">Expected Inflation (%)</label>
                  <span className="text-sm font-mono font-semibold text-rose-700 bg-rose-50 px-3 py-1 rounded-full">
                    {inflationRate}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={12}
                  step={0.5}
                  value={inflationRate}
                  onChange={(e) => setInflationRate(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-600"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>0%</span>
                  <span>12%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl border border-slate-200/80 p-6 md:p-7">
            <h2 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
              <Shield size={20} className="text-rose-600" />
              Recommended Life Cover
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left side - Main number */}
              <div>
                <div className="bg-gradient-to-br from-rose-50 to-orange-50 rounded-2xl p-5 mb-5 border border-rose-200">
                  <p className="text-sm text-rose-700 mb-1 font-medium">Your Estimated Life Cover Need</p>
                  <p className="text-4xl md:text-5xl font-bold text-rose-800 tracking-tight">
                    {formatCurrency(recommendedCover)}
                  </p>
                  <p className="text-xs text-rose-600 mt-2">
                    Based on Human Life Value & Income Replacement methods
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <p className="text-xs text-slate-500 mb-1">Annual Surplus</p>
                    <p className="text-lg font-semibold text-slate-800">{formatCurrency(annualSurplus)}</p>
                    <p className="text-xs text-slate-400">Income - Expenses</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <p className="text-xs text-slate-500 mb-1">Cover Multiple (x Annual Income)</p>
                    <p className="text-lg font-semibold text-rose-700">{coverMultiple.toFixed(1)}x</p>
                    <p className="text-xs text-slate-400">Recommended: 10-15x</p>
                  </div>
                </div>

                <div className="mt-5 p-4 bg-rose-50/40 rounded-xl border border-rose-100">
                  <p className="text-xs text-rose-600 mb-2 flex items-center gap-1">
                    <TrendingUp size={14} /> Estimated Monthly Premium
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">For term insurance (approx.)</span>
                    <span className="font-mono font-bold text-rose-700">{formatCurrency(estimatedMonthlyPremium)} / month</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    * Premiums vary based on age, health, smoking status, and policy type.
                  </p>
                </div>
              </div>

              {/* Right side - Risk Assessment & Dependents */}
              <div className="flex flex-col justify-between">
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle size={18} className={riskColor} />
                    <span className="font-semibold text-slate-800">Risk Assessment: {riskLevel}</span>
                  </div>
                  <p className="text-sm text-slate-600">{riskMessage}</p>
                  {coverMultiple < 10 && (
                    <div className="mt-3 text-xs text-amber-600 bg-amber-50 p-2 rounded-lg">
                      Tip: Consider increasing cover to at least 10x your annual income for adequate protection.
                    </div>
                  )}
                </div>

                <div className="mt-4 bg-gradient-to-r from-rose-50 to-orange-50 rounded-xl p-4 border border-rose-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Users size={16} className="text-rose-600" />
                    <span className="text-sm font-medium text-slate-700">Dependents: {dependents}</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    {dependents === 0
                      ? "You may consider a lower cover, but ensure final expenses and debts are covered."
                      : dependents <= 2
                      ? "Standard cover should be sufficient. Review if you have children's education goals."
                      : "With more dependents, consider a higher cover or additional riders like critical illness."}
                  </p>
                </div>

                {/* Breakdown of methods */}
                <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="text-xs font-medium text-slate-700 mb-1">Calculation Breakdown</p>
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>Income Replacement Method:</span>
                    <span>{formatCurrency(incomeReplacementCover)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-600 mt-1">
                    <span>Human Life Value Method:</span>
                    <span>{formatCurrency(hlvCover)}</span>
                  </div>
                  <div className="border-t border-slate-200 mt-2 pt-1 flex justify-between text-xs font-semibold">
                    <span>Average (Recommended):</span>
                    <span>{formatCurrency(recommendedCover)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Educational note */}
            <div className="mt-6 bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs text-slate-500 flex items-start gap-2">
              <Heart size={14} className="shrink-0 text-rose-500 mt-0.5" />
              <span>
                <strong>How it works:</strong> We calculate the present value of your future income surplus (income minus expenses)
                over the chosen years, add outstanding liabilities, and subtract existing savings. The result is the lump sum your family would need to maintain their lifestyle.
              </span>
            </div>
          </div>
        </div>

        {/* FAQ / Additional Tips */}
        <div className="mt-10 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <Sparkles size={18} className="text-rose-500" />
            Important Considerations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600">
            <div className="flex items-start gap-2">
              <ChevronRight size={14} className="shrink-0 text-rose-500 mt-0.5" />
              <span>Include future goals: children's education, marriage, retirement for spouse.</span>
            </div>
            <div className="flex items-start gap-2">
              <ChevronRight size={14} className="shrink-0 text-rose-500 mt-0.5" />
              <span>Add riders: critical illness, accidental death benefit for comprehensive protection.</span>
            </div>
            <div className="flex items-start gap-2">
              <ChevronRight size={14} className="shrink-0 text-rose-500 mt-0.5" />
              <span>Review cover every 3-5 years as income, family size, and liabilities change.</span>
            </div>
            <div className="flex items-start gap-2">
              <ChevronRight size={14} className="shrink-0 text-rose-500 mt-0.5" />
              <span>Term insurance is the most cost‑effective pure protection plan.</span>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200/60 py-8 mt-8 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} FinTools. Secure your family's future.
        </div>
      </footer>
    </div>
  );
}