// app/tools/term-insurance-calculator/TermInsuranceCalculatorClient.tsx
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
  Calendar,
  TrendingUp,
  Heart,
  Sparkles,
  ChevronRight,
  AlertCircle,
  DollarSign,
} from "lucide-react";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "700", "800"] });
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export default function TermInsuranceCalculatorClient() {
  // Income & expenses
  const [annualIncome, setAnnualIncome] = useState(1200000);
  const [annualExpenses, setAnnualExpenses] = useState(600000);
  const [liabilities, setLiabilities] = useState(3000000);
  const [existingAssets, setExistingAssets] = useState(1000000);
  const [dependents, setDependents] = useState(2);
  const [yearsOfCover, setYearsOfCover] = useState(20);
  const [inflationRate, setInflationRate] = useState(6);
  const [returnRate, setReturnRate] = useState(8); // Assumed post-tax return on investment

  // Personal details for premium
  const [age, setAge] = useState(35);
  const [smoker, setSmoker] = useState(false);
  const [gender, setGender] = useState<"male" | "female">("male");
  const [policyTerm, setPolicyTerm] = useState(20); // years

  // Calculate annual surplus
  const annualSurplus = annualIncome - annualExpenses;

  // Method 1: Income Replacement Method (discounted to present value)
  const calculateIncomeReplacement = () => {
    if (annualSurplus <= 0) return 0;
    const r = (returnRate - inflationRate) / 100;
    if (r === 0) return annualSurplus * yearsOfCover;
    const pv = annualSurplus * (1 - Math.pow(1 + r, -yearsOfCover)) / r;
    return Math.max(0, pv);
  };

  // Method 2: Human Life Value (more comprehensive)
  const calculateHLV = () => {
    if (annualSurplus <= 0) return 0;
    const discountRate = inflationRate / 100;
    if (discountRate === 0) return annualSurplus * yearsOfCover;
    const pv = annualSurplus * (1 - Math.pow(1 + discountRate, -yearsOfCover)) / discountRate;
    const cover = pv + liabilities - existingAssets;
    return Math.max(0, cover);
  };

  // Recommended cover (average of both methods)
  const incomeReplacementCover = calculateIncomeReplacement();
  const hlvCover = calculateHLV();
  const recommendedCover = Math.round((incomeReplacementCover + hlvCover) / 2);

  // Term insurance premium estimation (₹ per year per ₹1 lakh of cover)
  // Based on typical Indian term insurance rates (age, smoker, gender)
  const calculatePremiumRate = () => {
    let baseRate = 0;
    if (age <= 30) baseRate = 250;
    else if (age <= 35) baseRate = 350;
    else if (age <= 40) baseRate = 500;
    else if (age <= 45) baseRate = 750;
    else if (age <= 50) baseRate = 1200;
    else if (age <= 55) baseRate = 2000;
    else baseRate = 3500;

    // Per ₹1 lakh of sum assured per year
    let rate = baseRate;
    if (smoker) rate *= 2.5;
    if (gender === "female") rate *= 0.9;
    if (policyTerm > 20) rate *= 1.2;
    return rate;
  };

  const premiumRatePerLakh = calculatePremiumRate();
  const estimatedAnnualPremium = (recommendedCover / 100000) * premiumRatePerLakh;
  const estimatedMonthlyPremium = estimatedAnnualPremium / 12;

  // Cover multiple (cover / annual income)
  const coverMultiple = recommendedCover / annualIncome;
  let adequacy = "Adequate";
  let adequacyColor = "text-green-600";
  let adequacyMessage = "Your family will be well protected. Consider locking in rates at a younger age.";
  if (coverMultiple < 10) {
    adequacy = "Inadequate";
    adequacyColor = "text-red-600";
    adequacyMessage = "Cover may not be enough. Increase sum assured or reduce liabilities.";
  } else if (coverMultiple < 15) {
    adequacy = "Moderate";
    adequacyColor = "text-amber-600";
    adequacyMessage = "Decent cover, but consider adding a critical illness rider.";
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-cyan-50/20 text-slate-800">
      <header className="bg-white/90 backdrop-blur-xl border-b border-blue-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className={`${playfair.className} text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent`}
          >
            FinTools
          </Link>
          <span className={`${poppins.className} text-sm font-medium text-slate-600`}>
            Term Insurance Calculator
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
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium mb-5 shadow-sm">
            <Shield size={16} /> Secure Your Family's Future
          </div>
          <h1
            className={`${playfair.className} text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-4 leading-tight`}
          >
            Term Insurance{" "}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Calculator
            </span>
          </h1>
          <p className={`${poppins.className} text-base sm:text-lg text-slate-600 max-w-3xl mx-auto`}>
            Calculate the right term insurance cover for your loved ones. Based on income, expenses, liabilities,
            and future goals. Also get an estimated premium.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Panel */}
          <div className="lg:col-span-1 bg-white rounded-3xl shadow-xl border border-slate-200/80 p-6 md:p-7">
            <h2 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
              <DollarSign size={20} className="text-blue-600" />
              Your Financial Profile
            </h2>

            <div className="space-y-6">
              {/* Annual Income */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-slate-600">Annual Income (₹)</label>
                  <span className="text-sm font-mono font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
                    {formatCurrency(annualIncome)}
                  </span>
                </div>
                <input
                  type="range"
                  min={300000}
                  max={5000000}
                  step={50000}
                  value={annualIncome}
                  onChange={(e) => setAnnualIncome(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>₹3L</span>
                  <span>₹50L</span>
                </div>
              </div>

              {/* Annual Expenses */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-slate-600">Annual Expenses (₹)</label>
                  <span className="text-sm font-mono font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
                    {formatCurrency(annualExpenses)}
                  </span>
                </div>
                <input
                  type="range"
                  min={100000}
                  max={4000000}
                  step={50000}
                  value={annualExpenses}
                  onChange={(e) => setAnnualExpenses(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>₹1L</span>
                  <span>₹40L</span>
                </div>
              </div>

              {/* Liabilities */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-slate-600">Total Liabilities (Home/Car Loan etc.)</label>
                  <span className="text-sm font-mono font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
                    {formatCurrency(liabilities)}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={10000000}
                  step={500000}
                  value={liabilities}
                  onChange={(e) => setLiabilities(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>₹0</span>
                  <span>₹1 Cr</span>
                </div>
              </div>

              {/* Existing Assets */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-slate-600">Existing Assets / Savings (₹)</label>
                  <span className="text-sm font-mono font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
                    {formatCurrency(existingAssets)}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={10000000}
                  step={500000}
                  value={existingAssets}
                  onChange={(e) => setExistingAssets(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>₹0</span>
                  <span>₹1 Cr</span>
                </div>
              </div>

              {/* Dependents */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-slate-600">Number of Dependents</label>
                  <span className="text-sm font-mono font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
                    {dependents}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={6}
                  step={1}
                  value={dependents}
                  onChange={(e) => setDependents(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>0</span>
                  <span>6</span>
                </div>
              </div>

              {/* Years of Cover */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-slate-600">Years of Income Replacement</label>
                  <span className="text-sm font-mono font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
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
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>5 yrs</span>
                  <span>30 yrs</span>
                </div>
              </div>

              {/* Inflation & Return Rate */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Inflation (%)</label>
                  <input
                    type="number"
                    min={0}
                    max={12}
                    step={0.5}
                    value={inflationRate}
                    onChange={(e) => setInflationRate(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Return Rate (%)</label>
                  <input
                    type="number"
                    min={0}
                    max={15}
                    step={0.5}
                    value={returnRate}
                    onChange={(e) => setReturnRate(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl border border-slate-200/80 p-6 md:p-7">
            <h2 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
              <Shield size={20} className="text-blue-600" />
              Recommended Term Cover
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left side - Main number */}
              <div>
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-5 mb-5 border border-blue-200">
                  <p className="text-sm text-blue-700 mb-1 font-medium">Your Ideal Term Cover</p>
                  <p className="text-4xl md:text-5xl font-bold text-blue-800 tracking-tight">
                    {formatCurrency(recommendedCover)}
                  </p>
                  <p className="text-xs text-blue-600 mt-2">
                    {coverMultiple.toFixed(1)}x your annual income
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <p className="text-xs text-slate-500 mb-1">Annual Surplus</p>
                    <p className="text-lg font-semibold text-slate-800">{formatCurrency(annualSurplus)}</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <p className="text-xs text-slate-500 mb-1">Cover Adequacy</p>
                    <p className={`text-lg font-semibold ${adequacyColor}`}>{adequacy}</p>
                  </div>
                </div>

                {/* Premium Estimate */}
                <div className="mt-5 p-4 bg-blue-50/40 rounded-xl border border-blue-100">
                  <p className="text-xs text-blue-600 mb-2 flex items-center gap-1">
                    <TrendingUp size={14} /> Estimated Term Premium
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Annual premium</span>
                    <span className="font-mono font-bold text-blue-700">{formatCurrency(estimatedAnnualPremium)}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm text-slate-600">Monthly</span>
                    <span className="font-mono text-blue-600">{formatCurrency(estimatedMonthlyPremium)}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    * Based on age {age}, {smoker ? "smoker" : "non‑smoker"}, {gender}. Actual premiums vary by insurer.
                  </p>
                </div>
              </div>

              {/* Right side - Personal details for premium & risk */}
              <div className="flex flex-col justify-between">
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                  <h3 className="font-medium text-slate-700 mb-3">Personal Details (for premium)</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-slate-500 block mb-1">Age</label>
                      <input
                        type="range"
                        min={18}
                        max={65}
                        step={1}
                        value={age}
                        onChange={(e) => setAge(parseInt(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg accent-blue-600"
                      />
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>18</span>
                        <span>{age}</span>
                        <span>65</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-slate-600">Gender</label>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setGender("male")}
                          className={`px-3 py-1 rounded-lg text-sm ${
                            gender === "male"
                              ? "bg-blue-600 text-white"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          Male
                        </button>
                        <button
                          onClick={() => setGender("female")}
                          className={`px-3 py-1 rounded-lg text-sm ${
                            gender === "female"
                              ? "bg-blue-600 text-white"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          Female
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-slate-600">Smoker</label>
                      <button
                        onClick={() => setSmoker(!smoker)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          smoker ? "bg-blue-600" : "bg-slate-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            smoker ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 block mb-1">Policy Term (years)</label>
                      <input
                        type="range"
                        min={10}
                        max={40}
                        step={5}
                        value={policyTerm}
                        onChange={(e) => setPolicyTerm(parseInt(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg accent-blue-600"
                      />
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>10</span>
                        <span>{policyTerm}</span>
                        <span>40</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Heart size={16} className="text-blue-600" />
                    <span className="text-sm font-medium text-slate-700">{adequacyMessage}</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    {coverMultiple < 15
                      ? "Tip: Use the 'income replacement' method and add children's education costs for more accuracy."
                      : "Great! You have a robust cover. Consider adding accidental death benefit rider."}
                  </p>
                </div>
              </div>
            </div>

            {/* Breakdown of methods */}
            <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-xs font-medium text-slate-700 mb-2">Calculation Methods</p>
              <div className="flex justify-between text-xs text-slate-600">
                <span>Income Replacement (PV of future surplus):</span>
                <span>{formatCurrency(incomeReplacementCover)}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-600 mt-1">
                <span>Human Life Value (incl. liabilities - assets):</span>
                <span>{formatCurrency(hlvCover)}</span>
              </div>
              <div className="border-t border-slate-200 mt-2 pt-1 flex justify-between text-xs font-semibold">
                <span>Recommended (average):</span>
                <span>{formatCurrency(recommendedCover)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Educational Tips */}
        <div className="mt-10 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <Sparkles size={18} className="text-blue-500" />
            Term Insurance Essentials
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600">
            <div className="flex items-start gap-2">
              <ChevronRight size={14} className="shrink-0 text-blue-500 mt-0.5" />
              <span><strong>Pure protection:</strong> Term insurance is the most cost‑effective way to secure a large cover.</span>
            </div>
            <div className="flex items-start gap-2">
              <ChevronRight size={14} className="shrink-0 text-blue-500 mt-0.5" />
              <span><strong>Claim settlement ratio:</strong> Always check the insurer's historical ratio before buying.</span>
            </div>
            <div className="flex items-start gap-2">
              <ChevronRight size={14} className="shrink-0 text-blue-500 mt-0.5" />
              <span><strong>Riders:</strong> Add critical illness, accidental death, or disability riders for comprehensive cover.</span>
            </div>
            <div className="flex items-start gap-2">
              <ChevronRight size={14} className="shrink-0 text-blue-500 mt-0.5" />
              <span><strong>Tax benefits:</strong> Premiums up to ₹1.5L deductible under Sec 80C, proceeds tax‑free under Sec 10(10D).</span>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200/60 py-8 mt-8 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} FinTools. Secure your family's tomorrow.
        </div>
      </footer>
    </div>
  );
}