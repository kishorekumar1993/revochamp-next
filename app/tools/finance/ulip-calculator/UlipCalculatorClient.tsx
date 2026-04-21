// app/tools/ulip-calculator/UlipCalculatorClient.tsx
"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Playfair_Display, Poppins } from "next/font/google";
import Link from "next/link";
import {
  TrendingUp,
  IndianRupee,
  Calendar,
  Shield,
  AlertCircle,
  Sparkles,
  ChevronRight,
  BarChart,
  DollarSign,
} from "lucide-react";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "700", "800"] });
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

// Helper function: calculate XIRR (simplified CAGR)
const calculateXIRR = (totalInvested: number, finalValue: number, years: number) => {
  if (totalInvested <= 0) return 0;
  const cagr = Math.pow(finalValue / totalInvested, 1 / years) - 1;
  return cagr * 100;
};

export default function UlipCalculatorClient() {
  // Policy details
  const [premiumAmount, setPremiumAmount] = useState(50000);
  const [policyTerm, setPolicyTerm] = useState(10);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [fundType, setFundType] = useState<"equity" | "debt" | "balanced">("equity");

  // ULIP charges (default industry averages)
  const [allocationCharge, setAllocationCharge] = useState(5);
  const [allocationChargeSubsequent, setAllocationChargeSubsequent] = useState(2);
  const [fundManagementCharge, setFundManagementCharge] = useState(1.35);
  const [mortalityCharge, setMortalityCharge] = useState(2000);
  const [policyAdminCharge, setPolicyAdminCharge] = useState(1000);

  // Alternative investment
  const [alternativeReturn, setAlternativeReturn] = useState(12);
  const [showComparison, setShowComparison] = useState(true);

  // Fund type return mapping
  const fundReturnMap = {
    equity: 12,
    debt: 8,
    balanced: 10,
  };

  const handleFundTypeChange = (type: "equity" | "debt" | "balanced") => {
    setFundType(type);
    setExpectedReturn(fundReturnMap[type]);
  };

  // ULIP maturity calculation
  const ulipResult = useMemo(() => {
    let fundValue = 0;
    let totalPremiumsPaid = 0;
    let totalCharges = 0;

    for (let year = 1; year <= policyTerm; year++) {
      let premiumAfterAllocation = premiumAmount;
      if (year === 1) {
        premiumAfterAllocation = premiumAmount * (1 - allocationCharge / 100);
        totalCharges += premiumAmount * (allocationCharge / 100);
      } else {
        premiumAfterAllocation = premiumAmount * (1 - allocationChargeSubsequent / 100);
        totalCharges += premiumAmount * (allocationChargeSubsequent / 100);
      }

      fundValue += premiumAfterAllocation;

      fundValue -= mortalityCharge;
      fundValue -= policyAdminCharge;
      totalCharges += mortalityCharge + policyAdminCharge;

      if (fundValue < 0) fundValue = 0;

      const fmcAmount = fundValue * (fundManagementCharge / 100);
      fundValue -= fmcAmount;
      totalCharges += fmcAmount;

      const annualReturn = expectedReturn / 100;
      fundValue = fundValue * (1 + annualReturn);

      totalPremiumsPaid += premiumAmount;
    }

    const maturityValue = Math.round(fundValue);
    const netGain = maturityValue - totalPremiumsPaid;
    const xirr = calculateXIRR(totalPremiumsPaid, maturityValue, policyTerm);

    return { maturityValue, totalPremiums: totalPremiumsPaid, netGain, totalCharges, xirr };
  }, [
    premiumAmount,
    policyTerm,
    expectedReturn,
    allocationCharge,
    allocationChargeSubsequent,
    fundManagementCharge,
    mortalityCharge,
    policyAdminCharge,
  ]);

  // Alternative investment (SIP in mutual fund, ~1% expense ratio)
  const altResult = useMemo(() => {
    let alternativeValue = 0;
    const alternativeReturnRate = alternativeReturn / 100;
    const expenseRatio = 1.0;
    let totalInvested = 0;

    for (let year = 1; year <= policyTerm; year++) {
      totalInvested += premiumAmount;
      alternativeValue += premiumAmount;
      alternativeValue -= alternativeValue * (expenseRatio / 100);
      alternativeValue = alternativeValue * (1 + alternativeReturnRate);
    }

    return {
      maturityValue: Math.round(alternativeValue),
      totalInvested,
      netGain: Math.round(alternativeValue - totalInvested),
      xirr: calculateXIRR(totalInvested, alternativeValue, policyTerm),
    };
  }, [premiumAmount, policyTerm, alternativeReturn]);

  const difference = ulipResult.maturityValue - altResult.maturityValue;
  const ulipBetter = difference > 0;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return value.toFixed(2) + "%";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/30 via-white to-purple-50/20 text-slate-800">
      <header className="bg-white/90 backdrop-blur-xl border-b border-indigo-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className={`${playfair.className} text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent`}
          >
            FinTools
          </Link>
          <span className={`${poppins.className} text-sm font-medium text-slate-600`}>
            ULIP Calculator
          </span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-14">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-medium mb-5 shadow-sm">
            <Shield size={16} /> Insurance + Investment
          </div>
          <h1
            className={`${playfair.className} text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-4 leading-tight`}
          >
            ULIP{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Calculator
            </span>
          </h1>
          <p className={`${poppins.className} text-base sm:text-lg text-slate-600 max-w-3xl mx-auto`}>
            Understand the real returns from your Unit Linked Insurance Plan after all charges.
            Compare with a pure investment alternative and make an informed decision.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Panel */}
          <div className="lg:col-span-1 bg-white rounded-3xl shadow-xl border border-slate-200/80 p-6 md:p-7">
            <h2 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
              <DollarSign size={20} className="text-indigo-600" />
              Policy Details
            </h2>

            <div className="space-y-6">
              {/* Annual Premium */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-slate-600">Annual Premium (₹)</label>
                  <span className="text-sm font-mono font-semibold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full">
                    {formatCurrency(premiumAmount)}
                  </span>
                </div>
                <input
                  type="range"
                  min={10000}
                  max={500000}
                  step={5000}
                  value={premiumAmount}
                  onChange={(e) => setPremiumAmount(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>₹10k</span>
                  <span>₹5L</span>
                </div>
              </div>

              {/* Policy Term */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-slate-600">Policy Term (Years)</label>
                  <span className="text-sm font-mono font-semibold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full">
                    {policyTerm} years
                  </span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={30}
                  step={1}
                  value={policyTerm}
                  onChange={(e) => setPolicyTerm(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>5 yrs</span>
                  <span>30 yrs</span>
                </div>
              </div>

              {/* Fund Type */}
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">Fund Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["equity", "balanced", "debt"] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => handleFundTypeChange(type)}
                      className={`px-3 py-2 rounded-xl text-sm font-medium transition-all capitalize ${
                        fundType === type
                          ? "bg-indigo-600 text-white shadow-sm"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-slate-400 mt-1.5">
                  Expected return: {expectedReturn}% (based on fund type)
                </p>
              </div>

              {/* Expected Return (override) */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-slate-600">Expected Annual Return (%)</label>
                  <span className="text-sm font-mono font-semibold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full">
                    {expectedReturn}%
                  </span>
                </div>
                <input
                  type="range"
                  min={4}
                  max={18}
                  step={0.5}
                  value={expectedReturn}
                  onChange={(e) => setExpectedReturn(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              {/* Advanced Charges (collapsible) */}
              <details className="text-sm">
                <summary className="cursor-pointer text-indigo-600 font-medium">Advanced Charges (customize)</summary>
                <div className="mt-3 space-y-3 pt-2 border-t border-slate-100">
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">Allocation Charge (Year 1) %</label>
                    <input
                      type="number"
                      min={0}
                      max={10}
                      step={0.5}
                      value={allocationCharge}
                      onChange={(e) => setAllocationCharge(parseFloat(e.target.value))}
                      className="w-full px-3 py-1.5 border rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">Allocation Charge (Subsequent) %</label>
                    <input
                      type="number"
                      min={0}
                      max={5}
                      step={0.5}
                      value={allocationChargeSubsequent}
                      onChange={(e) => setAllocationChargeSubsequent(parseFloat(e.target.value))}
                      className="w-full px-3 py-1.5 border rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">Fund Management Charge (% p.a.)</label>
                    <input
                      type="number"
                      min={0}
                      max={2.5}
                      step={0.05}
                      value={fundManagementCharge}
                      onChange={(e) => setFundManagementCharge(parseFloat(e.target.value))}
                      className="w-full px-3 py-1.5 border rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">Mortality Charge (₹ per year)</label>
                    <input
                      type="number"
                      min={0}
                      max={10000}
                      step={500}
                      value={mortalityCharge}
                      onChange={(e) => setMortalityCharge(parseInt(e.target.value))}
                      className="w-full px-3 py-1.5 border rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">Policy Admin Charge (₹ per year)</label>
                    <input
                      type="number"
                      min={0}
                      max={5000}
                      step={500}
                      value={policyAdminCharge}
                      onChange={(e) => setPolicyAdminCharge(parseInt(e.target.value))}
                      className="w-full px-3 py-1.5 border rounded-lg text-sm"
                    />
                  </div>
                </div>
              </details>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl border border-slate-200/80 p-6 md:p-7">
            <h2 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
              <BarChart size={20} className="text-indigo-600" />
              ULIP Maturity Projection
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* ULIP Results */}
              <div>
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-5 mb-5 border border-indigo-200">
                  <p className="text-sm text-indigo-700 mb-1 font-medium">ULIP Maturity Value</p>
                  <p className="text-4xl md:text-5xl font-bold text-indigo-800 tracking-tight">
                    {formatCurrency(ulipResult.maturityValue)}
                  </p>
                  <p className="text-xs text-indigo-600 mt-2">
                    Total premiums paid: {formatCurrency(ulipResult.totalPremiums)}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <p className="text-xs text-slate-500 mb-1">Net Gain</p>
                    <p className={`text-lg font-semibold ${ulipResult.netGain >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {formatCurrency(ulipResult.netGain)}
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <p className="text-xs text-slate-500 mb-1">XIRR (approx.)</p>
                    <p className="text-lg font-semibold text-indigo-700">
                      {ulipResult.xirr > 0 ? formatPercentage(ulipResult.xirr) : "Negative"}
                    </p>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-xs text-amber-700 flex items-center gap-1">
                    <AlertCircle size={14} /> Total charges over {policyTerm} years: {formatCurrency(ulipResult.totalCharges)}
                  </p>
                </div>
              </div>

              {/* Alternative Investment */}
              <div>
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-5 mb-5 border border-emerald-200">
                  <p className="text-sm text-emerald-700 mb-1 font-medium">Alternative Investment (SIP)</p>
                  <p className="text-4xl md:text-5xl font-bold text-emerald-800 tracking-tight">
                    {formatCurrency(altResult.maturityValue)}
                  </p>
                  <p className="text-xs text-emerald-600 mt-2">
                    Assumed return: {alternativeReturn}% p.a. (post-expense)
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <p className="text-xs text-slate-500 mb-1">Net Gain (Alt.)</p>
                    <p className={`text-lg font-semibold ${altResult.netGain >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {formatCurrency(altResult.netGain)}
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <p className="text-xs text-slate-500 mb-1">XIRR (Alt.)</p>
                    <p className="text-lg font-semibold text-emerald-700">{formatPercentage(altResult.xirr)}</p>
                  </div>
                </div>

                {showComparison && (
                  <div className={`mt-4 p-4 rounded-xl border ${ulipBetter ? "bg-indigo-50 border-indigo-200" : "bg-emerald-50 border-emerald-200"}`}>
                    <div className="flex items-center gap-2">
                      <TrendingUp size={18} className={ulipBetter ? "text-indigo-600" : "text-emerald-600"} />
                      <p className="text-sm font-medium">
                        {ulipBetter
                          ? `ULIP outperforms alternative by ${formatCurrency(Math.abs(difference))}`
                          : `Alternative outperforms ULIP by ${formatCurrency(Math.abs(difference))}`}
                      </p>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      {ulipBetter
                        ? "ULIP provides insurance cover + returns. Ensure the higher returns justify the lock-in."
                        : "Pure investment may give better returns. Consider term insurance + separate investment for better flexibility."}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Alternative return slider & toggle */}
            <div className="mt-6 pt-4 border-t border-slate-200">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-slate-600">Alternative Investment Return (% p.a.)</label>
                <span className="text-sm font-mono font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                  {alternativeReturn}%
                </span>
              </div>
              <input
                type="range"
                min={4}
                max={18}
                step={0.5}
                value={alternativeReturn}
                onChange={(e) => setAlternativeReturn(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <button
                onClick={() => setShowComparison(!showComparison)}
                className="mt-3 text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                {showComparison ? "Hide comparison" : "Show comparison"}
              </button>
            </div>
          </div>
        </div>

        {/* Educational Disclosures */}
        <div className="mt-10 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <Sparkles size={18} className="text-indigo-500" />
            Understanding ULIPs
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600">
            <div className="flex items-start gap-2">
              <ChevronRight size={14} className="shrink-0 text-indigo-500 mt-0.5" />
              <span><strong>Lock-in period:</strong> ULIPs have a 5-year lock-in (cannot withdraw before 5 years).</span>
            </div>
            <div className="flex items-start gap-2">
              <ChevronRight size={14} className="shrink-0 text-indigo-500 mt-0.5" />
              <span><strong>Tax benefits:</strong> Premiums up to ₹1.5L deductible under Sec 80C, maturity proceeds tax-free under Sec 10(10D) subject to conditions.</span>
            </div>
            <div className="flex items-start gap-2">
              <ChevronRight size={14} className="shrink-0 text-indigo-500 mt-0.5" />
              <span><strong>Charges:</strong> Allocation, fund management, mortality, policy admin – these impact returns significantly.</span>
            </div>
            <div className="flex items-start gap-2">
              <ChevronRight size={14} className="shrink-0 text-indigo-500 mt-0.5" />
              <span><strong>Switching funds:</strong> Most ULIPs allow free switches between equity/debt funds.</span>
            </div>
          </div>
          <div className="mt-4 p-3 bg-slate-50 rounded-lg text-xs text-slate-500">
            ⚠️ Disclaimer: Past performance does not guarantee future returns. The calculator provides estimates; actual returns may vary based on market conditions and actual charges.
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200/60 py-8 mt-8 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} FinTools. Smart insights for your financial future.
        </div>
      </footer>
    </div>
  );
}