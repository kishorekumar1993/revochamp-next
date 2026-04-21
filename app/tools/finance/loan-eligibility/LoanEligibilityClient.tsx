// app/tools/loan-eligibility/LoanEligibilityClient.tsx
"use client";

import React, { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { Playfair_Display, Poppins } from "next/font/google";
import Link from "next/link";
import {
  Calculator,
  IndianRupee,
  TrendingUp,
  Home,
  Car,
  Briefcase,
  Sparkles,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "700", "800"] });
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

// Common loan types for quick selection
const loanPresets = [
  { name: "Home Loan", icon: Home, maxTenure: 30, maxAmount: 20000000, rate: 8.5 },
  { name: "Car Loan", icon: Car, maxTenure: 7, maxAmount: 5000000, rate: 9.5 },
  { name: "Personal Loan", icon: Briefcase, maxTenure: 5, maxAmount: 2500000, rate: 11.0 },
];

export default function LoanEligibilityClient() {
  // Income & obligations
  const [monthlyIncome, setMonthlyIncome] = useState(75000);
  const [existingEMI, setExistingEMI] = useState(5000);
  const [otherObligations, setOtherObligations] = useState(2000); // e.g., rent, existing loan payments

  // Loan parameters
  const [interestRate, setInterestRate] = useState(9.5);
  const [loanTenure, setLoanTenure] = useState(5); // years
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  // FOIR (Fixed Obligation to Income Ratio) – banks typically allow 40-50%
  const foirPercentage = 50; // 50% of income can go towards total EMI

  // Calculate max eligible EMI
  const totalMonthlyObligations = existingEMI + otherObligations;
  const maxPermissibleEMI = (monthlyIncome * foirPercentage) / 100;
  const availableForNewEMI = Math.max(0, maxPermissibleEMI - totalMonthlyObligations);

  // EMI formula: P = EMI * ((1+r)^n - 1) / (r*(1+r)^n)
  const calculateMaxLoan = useCallback(() => {
    if (availableForNewEMI <= 0) return 0;
    const monthlyRate = interestRate / 100 / 12;
    const months = loanTenure * 12;
    if (monthlyRate === 0) return availableForNewEMI * months;
    const factor = Math.pow(1 + monthlyRate, months);
    const maxLoan = availableForNewEMI * ((factor - 1) / (monthlyRate * factor));
    return Math.floor(maxLoan);
  }, [availableForNewEMI, interestRate, loanTenure]);

  const maxLoanAmount = calculateMaxLoan();
  const isEligible = maxLoanAmount > 0 && availableForNewEMI > 0;

  // EMI for a given loan amount (used to show an example)
  const calculateEMI = (principal: number, rate: number, tenureYears: number) => {
    const monthlyRate = rate / 100 / 12;
    const months = tenureYears * 12;
    if (monthlyRate === 0) return principal / months;
    const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
    return Math.round(emi);
  };

  // Example EMI for the eligible amount
  const exampleEMI = maxLoanAmount > 0 ? calculateEMI(maxLoanAmount, interestRate, loanTenure) : 0;

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Handle preset selection
  const applyPreset = (preset: typeof loanPresets[0]) => {
    setSelectedPreset(preset.name);
    setInterestRate(preset.rate);
    // Optionally adjust tenure to be within preset.maxTenure
    if (loanTenure > preset.maxTenure) setLoanTenure(preset.maxTenure);
  };

  // Helper: get recommended loan amount based on typical LTV (just a suggestion)
  const recommendedLoan = maxLoanAmount;
  const monthlySurplus = monthlyIncome - totalMonthlyObligations;
  const usedPercentage = totalMonthlyObligations / monthlyIncome * 100;

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
            Loan Eligibility
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
            <Sparkles size={16} /> Know Before You Apply
          </div>
          <h1
            className={`${playfair.className} text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-4 leading-tight`}
          >
            Loan Eligibility{" "}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Calculator
            </span>
          </h1>
          <p className={`${poppins.className} text-base sm:text-lg text-slate-600 max-w-3xl mx-auto`}>
            Find out how much loan you can afford based on your income, existing EMIs, and desired tenure.
            Instant, accurate, and free.
          </p>
        </motion.div>

        {/* Loan Presets */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {loanPresets.map((preset) => {
            const Icon = preset.icon;
            return (
              <button
                key={preset.name}
                onClick={() => applyPreset(preset)}
                className={`group bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all text-left ${
                  selectedPreset === preset.name
                    ? "border-purple-400 ring-2 ring-purple-200"
                    : "border-slate-200 hover:border-purple-300"
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-purple-100 rounded-xl group-hover:bg-purple-200 transition-colors">
                    <Icon size={20} className="text-purple-700" />
                  </div>
                  <span className="font-semibold text-slate-800">{preset.name}</span>
                </div>
                <p className="text-xs text-slate-500 mb-1">Typical Rate</p>
                <p className="text-lg font-bold text-slate-900">{preset.rate}% p.a.</p>
                <p className="text-xs text-slate-400 mt-1">Max tenure: {preset.maxTenure} yrs</p>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Panel */}
          <div className="lg:col-span-1 bg-white rounded-3xl shadow-xl border border-slate-200/80 p-6 md:p-7">
            <h2 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
              <Calculator size={20} className="text-purple-600" />
              Your Financial Profile
            </h2>

            <div className="space-y-6">
              {/* Monthly Income */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-slate-600">Monthly Income (₹)</label>
                  <span className="text-sm font-mono font-semibold text-purple-700 bg-purple-50 px-3 py-1 rounded-full">
                    {formatCurrency(monthlyIncome)}
                  </span>
                </div>
                <input
                  type="range"
                  min={10000}
                  max={500000}
                  step={5000}
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>₹10k</span>
                  <span>₹5L</span>
                </div>
              </div>

              {/* Existing EMI */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-slate-600">Existing EMI / Loan Payments</label>
                  <span className="text-sm font-mono font-semibold text-purple-700 bg-purple-50 px-3 py-1 rounded-full">
                    {formatCurrency(existingEMI)}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={200000}
                  step={1000}
                  value={existingEMI}
                  onChange={(e) => setExistingEMI(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>₹0</span>
                  <span>₹2L</span>
                </div>
              </div>

              {/* Other Obligations (rent, credit card, etc.) */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-slate-600">Other Monthly Obligations</label>
                  <span className="text-sm font-mono font-semibold text-purple-700 bg-purple-50 px-3 py-1 rounded-full">
                    {formatCurrency(otherObligations)}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100000}
                  step={1000}
                  value={otherObligations}
                  onChange={(e) => setOtherObligations(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>₹0</span>
                  <span>₹1L</span>
                </div>
              </div>

              {/* Interest Rate */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-slate-600">Expected Interest Rate (% p.a.)</label>
                  <span className="text-sm font-mono font-semibold text-purple-700 bg-purple-50 px-3 py-1 rounded-full">
                    {interestRate}%
                  </span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={20}
                  step={0.25}
                  value={interestRate}
                  onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>5%</span>
                  <span>20%</span>
                </div>
              </div>

              {/* Loan Tenure */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-slate-600">Loan Tenure (Years)</label>
                  <span className="text-sm font-mono font-semibold text-purple-700 bg-purple-50 px-3 py-1 rounded-full">
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
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>1 Year</span>
                  <span>30 Years</span>
                </div>
              </div>

              {/* FOIR Info */}
              <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-500 flex items-start gap-2">
                <AlertCircle size={14} className="shrink-0 mt-0.5" />
                <span>Banks typically allow up to 50% of your monthly income towards total EMI (FOIR). We use this standard.</span>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl border border-slate-200/80 p-6 md:p-7">
            <h2 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
              <TrendingUp size={20} className="text-purple-600" />
              Your Eligibility
            </h2>

            {!isEligible ? (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center">
                <AlertCircle size={40} className="text-amber-500 mx-auto mb-3" />
                <h3 className="font-semibold text-slate-800 mb-2">Loan Not Eligible</h3>
                <p className="text-sm text-slate-600">
                  Based on your current income and obligations, there is no surplus for a new EMI.
                  Try reducing existing obligations or increasing income.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left side - Numbers */}
                  <div>
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-5 mb-5 border border-purple-200">
                      <p className="text-sm text-purple-700 mb-1 font-medium">Maximum Loan Amount</p>
                      <p className="text-4xl md:text-5xl font-bold text-purple-800 tracking-tight">
                        {formatCurrency(maxLoanAmount)}
                      </p>
                      <p className="text-xs text-purple-600 mt-2">Based on {foirPercentage}% FOIR</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                        <p className="text-xs text-slate-500 mb-1">Monthly Surplus</p>
                        <p className="text-xl font-semibold text-slate-800">{formatCurrency(monthlySurplus)}</p>
                        <p className="text-xs text-slate-400">Income - Obligations</p>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                        <p className="text-xs text-slate-500 mb-1">Available for New EMI</p>
                        <p className="text-xl font-semibold text-emerald-700">{formatCurrency(availableForNewEMI)}</p>
                        <p className="text-xs text-slate-400">After {foirPercentage}% FOIR</p>
                      </div>
                    </div>

                    <div className="mt-5 p-4 bg-purple-50/40 rounded-xl border border-purple-100">
                      <p className="text-xs text-purple-600 mb-2 flex items-center gap-1">
                        <CheckCircle size={14} /> Loan Summary
                      </p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Monthly EMI (approx.)</span>
                        <span className="font-mono font-semibold text-slate-800">{formatCurrency(exampleEMI)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm mt-2">
                        <span className="text-slate-600">Tenure</span>
                        <span className="font-mono font-semibold text-slate-800">{loanTenure} years</span>
                      </div>
                      <div className="flex items-center justify-between text-sm mt-2 pt-2 border-t border-purple-200">
                        <span className="text-slate-600">Interest Rate</span>
                        <span className="font-mono font-semibold text-purple-700">{interestRate}% p.a.</span>
                      </div>
                    </div>
                  </div>

                  {/* Right side - Donut / Usage Chart */}
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
                          strokeDasharray={`${(usedPercentage / 100) * (2 * Math.PI * 40)} ${2 * Math.PI * 40}`}
                          className="transition-all duration-700"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-bold text-slate-800">{usedPercentage.toFixed(0)}%</span>
                        <span className="text-xs text-slate-500">Obligation Ratio</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-3 text-center max-w-[200px]">
                      {usedPercentage > 50
                        ? "⚠️ Your obligations exceed 50% of income. Consider reducing debt."
                        : "✅ Your obligation ratio is within the safe limit."}
                    </p>
                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                        <span className="text-xs text-slate-600">Obligations</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                        <span className="text-xs text-slate-600">Available</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional tip */}
                <div className="mt-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
                  <p className="text-xs text-purple-700 flex items-start gap-2">
                    <Sparkles size={14} className="shrink-0 mt-0.5" />
                    <span>
                      💡 <strong>Pro Tip:</strong> A longer tenure reduces EMI but increases total interest.
                      Use the calculator to find the right balance for your budget.
                    </span>
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Educational Note */}
        <div className="mt-10 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <h3 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
            <AlertCircle size={18} className="text-purple-500" />
            How is eligibility calculated?
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Lenders use the <strong>FOIR (Fixed Obligation to Income Ratio)</strong> method. They typically allow up to 50%
            of your monthly income to go towards all EMIs (existing + proposed). Your maximum loan amount is then derived
            from the available EMI using the standard loan amortisation formula.
          </p>
          <div className="mt-3 text-xs text-slate-400">
            Formula: EMI = P × r × (1+r)ⁿ / ((1+r)ⁿ - 1) &nbsp;→ &nbsp; P = maximum loan principal.
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200/60 py-8 mt-8 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} FinTools. Empowering your financial decisions.
        </div>
      </footer>
    </div>
  );
}