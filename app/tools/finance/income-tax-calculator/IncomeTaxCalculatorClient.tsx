// app/tools/income-tax-calculator/IncomeTaxCalculatorClient.tsx
"use client";

import React, { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Playfair_Display, Poppins } from "next/font/google";
import Link from "next/link";
import {
  Calculator,
  IndianRupee,
  TrendingUp,
  Sparkles,
  Wallet,
  Users,
  Building,
  ChevronRight,
  ChevronDown,
  Calendar,
  Percent,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "700", "800"] });
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export default function IncomeTaxCalculatorClient() {
  const [regime, setRegime] = useState<"new" | "old">("new");
  const [totalIncome, setTotalIncome] = useState(1200000);
  const [standardDeductionNew, setStandardDeductionNew] = useState(75000);
  const [standardDeductionOld, setStandardDeductionOld] = useState(50000);
  const [deductions80C, setDeductions80C] = useState(0);
  const [deductions80D, setDeductions80D] = useState(0);
  const [otherDeductions, setOtherDeductions] = useState(0);
  const [age, setAge] = useState<"below60" | "senior" | "superSenior">("below60");
  const [showBreakdown, setShowBreakdown] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Calculate surcharge with marginal relief
  const calculateSurcharge = (tax: number, taxableIncome: number) => {
    let surchargeRate = 0;
    if (taxableIncome > 5000000) {
      if (taxableIncome > 20000000) surchargeRate = 0.25;
      else if (taxableIncome > 10000000) surchargeRate = 0.15;
      else if (taxableIncome > 5000000) surchargeRate = 0.10;
    }

    let surcharge = tax * surchargeRate;
    // Marginal relief: ensure additional tax + surcharge does not exceed extra income beyond threshold
    if (surchargeRate > 0) {
      let threshold = 0;
      if (taxableIncome > 20000000) threshold = 20000000;
      else if (taxableIncome > 10000000) threshold = 10000000;
      else if (taxableIncome > 5000000) threshold = 5000000;

      const excessIncome = taxableIncome - threshold;
      const additionalTax = tax - (threshold <= 5000000 ? tax : 0); // approximate
      if (additionalTax + surcharge > excessIncome) {
        surcharge = Math.max(0, excessIncome - additionalTax);
      }
    }
    return surcharge;
  };

  const calculateTax = useCallback(() => {
    let taxableIncome = totalIncome;
    let totalDeductions = 0;

    if (regime === "new") {
      // New regime: only standard deduction (salaried)
      taxableIncome = Math.max(0, totalIncome - standardDeductionNew);
      totalDeductions = standardDeductionNew;
    } else {
      // Old regime: standard deduction + 80C + 80D + others
      const capped80C = Math.min(deductions80C, 150000);
      totalDeductions = standardDeductionOld + capped80C + deductions80D + otherDeductions;
      taxableIncome = Math.max(0, totalIncome - totalDeductions);
    }

    // Apply tax slabs based on regime and age (for old regime exemption)
    let tax = 0;
    let slabDetails: { slab: string; amount: number; rate: number; taxAmount: number }[] = [];
    let remainingIncome = taxableIncome;
    let prevLimit = 0;

    if (regime === "new") {
      // New regime slabs (FY 2025-26 typical)
      const slabs = [
        { limit: 300000, rate: 0 },
        { limit: 600000, rate: 5 },
        { limit: 900000, rate: 10 },
        { limit: 1200000, rate: 15 },
        { limit: 1500000, rate: 20 },
      ];
      for (const slab of slabs) {
        if (remainingIncome > 0) {
          const taxableInSlab = Math.min(remainingIncome, slab.limit - prevLimit);
          if (taxableInSlab > 0 && slab.rate > 0) {
            const slabTax = (taxableInSlab * slab.rate) / 100;
            tax += slabTax;
            slabDetails.push({
              slab: `₹${(prevLimit / 100000).toFixed(0)}L - ₹${(slab.limit / 100000).toFixed(0)}L`,
              amount: taxableInSlab,
              rate: slab.rate,
              taxAmount: slabTax,
            });
          }
          remainingIncome -= taxableInSlab;
          prevLimit = slab.limit;
        }
      }
      if (remainingIncome > 0) {
        const slabTax = (remainingIncome * 30) / 100;
        tax += slabTax;
        slabDetails.push({
          slab: `Above ₹15L`,
          amount: remainingIncome,
          rate: 30,
          taxAmount: slabTax,
        });
      }
    } else {
      // Old regime slabs with age‑based exemption
      let basicExemption = 250000;
      if (age === "senior") basicExemption = 300000;
      else if (age === "superSenior") basicExemption = 500000;

      const slabs = [
        { limit: basicExemption, rate: 0 },
        { limit: 500000, rate: 5 },
        { limit: 1000000, rate: 20 },
      ];
      for (const slab of slabs) {
        if (remainingIncome > 0) {
          const taxableInSlab = Math.min(remainingIncome, slab.limit - prevLimit);
          if (taxableInSlab > 0 && slab.rate > 0) {
            const slabTax = (taxableInSlab * slab.rate) / 100;
            tax += slabTax;
            slabDetails.push({
              slab: `₹${(prevLimit / 100000).toFixed(0)}L - ₹${(slab.limit / 100000).toFixed(0)}L`,
              amount: taxableInSlab,
              rate: slab.rate,
              taxAmount: slabTax,
            });
          }
          remainingIncome -= taxableInSlab;
          prevLimit = slab.limit;
        }
      }
      if (remainingIncome > 0) {
        const slabTax = (remainingIncome * 30) / 100;
        tax += slabTax;
        slabDetails.push({
          slab: `Above ₹10L`,
          amount: remainingIncome,
          rate: 30,
          taxAmount: slabTax,
        });
      }
    }

    // Store tax before rebate
    const taxBeforeRebate = tax;

    // Section 87A Rebate
    let rebate = 0;
    if (regime === "new" && taxableIncome <= 700000) {
      rebate = Math.min(tax, 25000);
      tax -= rebate;
    } else if (regime === "old" && taxableIncome <= 500000) {
      rebate = Math.min(tax, 12500);
      tax -= rebate;
    }

    // Surcharge (based on taxable income, not gross)
    const surcharge = calculateSurcharge(tax, taxableIncome);
    const taxWithSurcharge = tax + surcharge;

    // Health & Education Cess (4%)
    const cess = taxWithSurcharge * 0.04;
    const totalTax = taxWithSurcharge + cess;
    const effectiveRate = totalIncome > 0 ? (totalTax / totalIncome) * 100 : 0;

    return {
      totalIncome,
      taxableIncome,
      totalDeductions,
      taxBeforeRebate,
      rebate,
      surcharge,
      cess,
      totalTax,
      effectiveRate,
      slabDetails,
    };
  }, [
    regime,
    totalIncome,
    standardDeductionNew,
    standardDeductionOld,
    deductions80C,
    deductions80D,
    otherDeductions,
    age,
  ]);

  const result = useMemo(() => calculateTax(), [calculateTax]);

  const handleRegimeChange = (newRegime: "new" | "old") => {
    setRegime(newRegime);
  };

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
            Income Tax Calculator
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
            <Calculator size={16} /> Know Your Tax Liability
          </div>
          <h1
            className={`${playfair.className} text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-4 leading-tight`}
          >
            Income Tax{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Calculator
            </span>
          </h1>
          <p className={`${poppins.className} text-base sm:text-lg text-slate-600 max-w-3xl mx-auto`}>
            Estimate your income tax liability for FY 2025‑26 (AY 2026‑27). Compare new vs old regime,
            include deductions, and see a detailed breakdown with surcharge and cess.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Panel */}
          <div className="lg:col-span-1 bg-white rounded-3xl shadow-xl border border-slate-200/80 p-6 md:p-7">
            <h2 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
              <Wallet size={20} className="text-blue-600" />
              Your Details
            </h2>

            <div className="space-y-6">
              {/* Regime Toggle */}
              <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
                <button
                  onClick={() => handleRegimeChange("new")}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                    regime === "new"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  New Regime (Default)
                </button>
                <button
                  onClick={() => handleRegimeChange("old")}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                    regime === "old"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  Old Regime
                </button>
              </div>

              {/* Total Income */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-slate-600">Total Annual Income (₹)</label>
                  <span className="text-sm font-mono font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
                    {formatCurrency(totalIncome)}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={10000000}
                  step={50000}
                  value={totalIncome}
                  onChange={(e) => setTotalIncome(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>₹0</span>
                  <span>₹1Cr</span>
                </div>
              </div>

              {/* Age (only for old regime) */}
              {regime === "old" && (
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Age Group</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: "below60", label: "Below 60" },
                      { value: "senior", label: "60-79 Years" },
                      { value: "superSenior", label: "80+ Years" },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setAge(opt.value as typeof age)}
                        className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                          age === opt.value
                            ? "bg-blue-600 text-white shadow-sm"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Standard Deduction (New Regime) */}
              {regime === "new" && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-600">Standard Deduction (₹)</label>
                    <span className="text-sm font-mono font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
                      {formatCurrency(standardDeductionNew)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={75000}
                    step={1000}
                    value={standardDeductionNew}
                    onChange={(e) => setStandardDeductionNew(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <p className="text-xs text-slate-400 mt-1">₹75,000 for salaried individuals (max)</p>
                </div>
              )}

              {/* Standard Deduction (Old Regime) */}
              {regime === "old" && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-600">Standard Deduction (₹)</label>
                    <span className="text-sm font-mono font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
                      {formatCurrency(standardDeductionOld)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={50000}
                    step={1000}
                    value={standardDeductionOld}
                    onChange={(e) => setStandardDeductionOld(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <p className="text-xs text-slate-400 mt-1">₹50,000 standard deduction for salaried</p>
                </div>
              )}

              {/* Old regime deductions */}
              {regime === "old" && (
                <div className="space-y-3 p-3 bg-slate-50 rounded-xl">
                  <h3 className="text-sm font-medium text-slate-700">Deductions (₹)</h3>
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">Section 80C (max ₹1.5L)</label>
                    <input
                      type="number"
                      min={0}
                      max={150000}
                      step={5000}
                      value={deductions80C}
                      onChange={(e) => setDeductions80C(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">Section 80D (Health Insurance)</label>
                    <input
                      type="number"
                      min={0}
                      max={100000}
                      step={5000}
                      value={deductions80D}
                      onChange={(e) => setDeductions80D(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">Other Deductions</label>
                    <input
                      type="number"
                      min={0}
                      max={500000}
                      step={10000}
                      value={otherDeductions}
                      onChange={(e) => setOtherDeductions(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl border border-slate-200/80 p-6 md:p-7">
            <h2 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
              <TrendingUp size={20} className="text-blue-600" />
              Tax Summary
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left side - Numbers */}
              <div>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 mb-5 border border-blue-200">
                  <p className="text-sm text-blue-700 mb-1 font-medium">Total Tax Payable</p>
                  <p className="text-4xl md:text-5xl font-bold text-blue-800 tracking-tight">
                    {formatCurrency(result.totalTax)}
                  </p>
                  <p className="text-xs text-blue-600 mt-2">Effective Tax Rate: {result.effectiveRate.toFixed(2)}%</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <p className="text-xs text-slate-500 mb-1">Total Income</p>
                    <p className="text-lg font-semibold text-slate-800">{formatCurrency(result.totalIncome)}</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <p className="text-xs text-slate-500 mb-1">Taxable Income</p>
                    <p className="text-lg font-semibold text-slate-800">{formatCurrency(result.taxableIncome)}</p>
                  </div>
                </div>

                <div className="mt-5 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-xs text-slate-500 mb-2">Tax Breakdown</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-700">Tax before Rebate</span>
                    <span className="font-mono font-medium">{formatCurrency(result.taxBeforeRebate)}</span>
                  </div>
                  {result.rebate > 0 && (
                    <div className="flex items-center justify-between mt-1 text-green-600">
                      <span className="text-sm">Rebate (Sec 87A)</span>
                      <span className="font-mono">-{formatCurrency(result.rebate)}</span>
                    </div>
                  )}
                  {result.surcharge > 0 && (
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-sm text-slate-700">Surcharge</span>
                      <span className="font-mono font-medium">+{formatCurrency(result.surcharge)}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm text-slate-700">Health & Education Cess (4%)</span>
                    <span className="font-mono font-medium">+{formatCurrency(result.cess)}</span>
                  </div>
                </div>
              </div>

              {/* Right side - Info */}
              <div className="flex flex-col justify-between">
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                  <h3 className="font-medium text-slate-700 mb-3">Key Highlights for FY 2025‑26</h3>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle size={16} className="shrink-0 text-green-500 mt-0.5" />
                      <span>Income up to ₹7 lakh is tax‑free under the new regime (with ₹25,000 rebate).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle size={16} className="shrink-0 text-green-500 mt-0.5" />
                      <span>Standard deduction of ₹75,000 for salaried individuals (new regime).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle size={16} className="shrink-0 text-green-500 mt-0.5" />
                      <span>New tax slabs: 0% (₹0-3L), 5% (3-6L), 10% (6-9L), 15% (9-12L), 20% (12-15L), 30% (above 15L).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle size={16} className="shrink-0 text-green-500 mt-0.5" />
                      <span>Old regime unchanged: basic exemption ₹2.5L (₹3L for seniors, ₹5L for super seniors).</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-700 flex items-start gap-2">
                  <AlertCircle size={14} className="shrink-0 mt-0.5" />
                  <span>
                    ⚠️ Surcharge and marginal relief are accurately implemented. Consult a tax professional for final filing.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tax Breakdown Section */}
        <div className="mt-8">
          <button
            onClick={() => setShowBreakdown(!showBreakdown)}
            className="w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex items-center justify-between hover:bg-slate-50 transition-all group"
          >
            <span className="font-semibold text-slate-700 flex items-center gap-3">
              <div className="p-1.5 bg-blue-100 rounded-lg">
                <Percent size={18} className="text-blue-600" />
              </div>
              Detailed Tax Calculation
            </span>
            <div className="flex items-center gap-2 text-slate-400 group-hover:text-blue-600 transition-colors">
              <span className="text-sm">{result.slabDetails.length} slabs</span>
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
                          Income Slab
                        </th>
                        <th className="px-5 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          Taxable Amount
                        </th>
                        <th className="px-5 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          Rate
                        </th>
                        <th className="px-5 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          Tax Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {result.slabDetails.map((slab, idx) => (
                        <tr key={idx} className="hover:bg-blue-50/30 transition-colors">
                          <td className="px-5 py-3 font-medium text-slate-700">{slab.slab}</td>
                          <td className="px-5 py-3 text-right font-mono text-slate-600">
                            {formatCurrency(slab.amount)}
                          </td>
                          <td className="px-5 py-3 text-right font-mono text-blue-600">{slab.rate}%</td>
                          <td className="px-5 py-3 text-right font-mono text-slate-800">
                            {formatCurrency(slab.taxAmount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="p-4 bg-slate-50 border-t border-slate-200 text-center">
                  <p className="text-xs text-slate-500">
                    📋 Tax is calculated progressively — only the amount in each slab is taxed at that slab's rate.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Tips Card */}
        <div className="mt-10 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-white rounded-xl shadow-sm">
              <Sparkles size={20} className="text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 mb-1">Tax Planning Tips for FY 2025‑26</h3>
              <p className="text-sm text-slate-600">
                The new regime is default and offers lower rates, but the old regime may still be beneficial if you have
                significant deductions (80C, 80D, HRA, etc.). Use this calculator to compare both. Consider investing in
                ELSS, PPF, NPS, and health insurance to maximise deductions under the old regime. For new regime, focus
                on higher take-home pay and simpler compliance.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200/60 py-8 mt-8 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} FinTools. Plan your taxes wisely.
        </div>
      </footer>
    </div>
  );
}