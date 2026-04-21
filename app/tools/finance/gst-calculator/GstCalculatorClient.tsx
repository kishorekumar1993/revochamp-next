// app/tools/gst-calculator/GstCalculatorClient.tsx
"use client";

import React, { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { Playfair_Display, Poppins } from "next/font/google";
import Link from "next/link";
import {
  Calculator,
  IndianRupee,
  Percent,
  TrendingUp,
  RefreshCw,
  Sparkles,
  Receipt,
  FileText,
} from "lucide-react";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "700", "800"] });
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

const gstRates = [0, 3, 5, 12, 18, 28];

export default function GstCalculatorClient() {
  const [mode, setMode] = useState<"exclusive" | "inclusive">("exclusive");
  const [amount, setAmount] = useState<number>(10000);
  const [gstRate, setGstRate] = useState<number>(18);
  const [showFormula, setShowFormula] = useState(false);

  // Calculate GST based on mode
  const calculate = useCallback(() => {
    const rate = gstRate / 100;
    if (mode === "exclusive") {
      // Amount is net (without GST)
      const gstAmount = amount * rate;
      const totalAmount = amount + gstAmount;
      return { netAmount: amount, gstAmount, totalAmount };
    } else {
      // Amount is gross (including GST)
      const netAmount = amount / (1 + rate);
      const gstAmount = amount - netAmount;
      return { netAmount, gstAmount, totalAmount: amount };
    }
  }, [mode, amount, gstRate]);

  const result = useMemo(() => calculate(), [calculate]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return value.toFixed(0) + "%";
  };

  // Swap mode (for reverse calculation convenience)
  const swapMode = () => {
    if (mode === "exclusive") {
      setAmount(result.totalAmount);
      setMode("inclusive");
    } else {
      setAmount(result.netAmount);
      setMode("exclusive");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50/30 via-white to-cyan-50/20 text-slate-800">
      <header className="bg-white/90 backdrop-blur-xl border-b border-teal-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className={`${playfair.className} text-2xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent`}
          >
            FinTools
          </Link>
          <span className={`${poppins.className} text-sm font-medium text-slate-600`}>
            GST Calculator
          </span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 md:py-14">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-100 to-cyan-100 text-teal-700 px-4 py-1.5 rounded-full text-sm font-medium mb-5 shadow-sm">
            <Receipt size={16} /> Tax Made Simple
          </div>
          <h1
            className={`${playfair.className} text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-4 leading-tight`}
          >
            GST{" "}
            <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Calculator
            </span>
          </h1>
          <p className={`${poppins.className} text-base sm:text-lg text-slate-600 max-w-2xl mx-auto`}>
            Calculate GST quickly. Choose between exclusive (add tax) or inclusive (remove tax) modes.
            Supports all standard GST rates.
          </p>
        </motion.div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden">
          {/* Mode Toggle */}
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setMode("exclusive")}
              className={`flex-1 py-4 text-center font-medium transition-all ${
                mode === "exclusive"
                  ? "bg-teal-50 text-teal-700 border-b-2 border-teal-500"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <FileText size={18} /> Exclusive (Add GST)
              </span>
            </button>
            <button
              onClick={() => setMode("inclusive")}
              className={`flex-1 py-4 text-center font-medium transition-all ${
                mode === "inclusive"
                  ? "bg-teal-50 text-teal-700 border-b-2 border-teal-500"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <Receipt size={18} /> Inclusive (Remove GST)
              </span>
            </button>
          </div>

          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column - Inputs */}
              <div className="space-y-6">
                {/* Amount Input */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {mode === "exclusive" ? "Net Amount (exclusive of GST)" : "Gross Amount (inclusive of GST)"}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <IndianRupee size={18} />
                    </span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                      className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 text-lg"
                      step="100"
                    />
                  </div>
                </div>

                {/* GST Rate Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">GST Rate (%)</label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {gstRates.map((rate) => (
                      <button
                        key={rate}
                        onClick={() => setGstRate(rate)}
                        className={`py-2 rounded-lg text-sm font-medium transition-all ${
                          gstRate === rate
                            ? "bg-teal-600 text-white shadow-sm"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {rate}%
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-slate-400 mt-2">
                    Common rates: 0%, 5%, 12%, 18%, 28% (plus 3% for gold)
                  </p>
                </div>

                {/* Custom Rate Option */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Custom Rate (%)
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      value={gstRate}
                      onChange={(e) => setGstRate(parseFloat(e.target.value) || 0)}
                      className="flex-1 px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400"
                      step="0.25"
                      min="0"
                      max="100"
                    />
                    <span className="text-slate-500">%</span>
                  </div>
                </div>

                {/* Swap Button */}
                <button
                  onClick={swapMode}
                  className="w-full flex items-center justify-center gap-2 py-2.5 border border-teal-200 rounded-xl text-teal-600 hover:bg-teal-50 transition-colors"
                >
                  <RefreshCw size={16} />
                  Switch to {mode === "exclusive" ? "Inclusive" : "Exclusive"} Mode
                </button>
              </div>

              {/* Right Column - Results */}
              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-6 border border-teal-100">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <Calculator size={20} className="text-teal-600" />
                  Calculation Results
                </h3>

                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-teal-200">
                    <span className="text-slate-600">
                      {mode === "exclusive" ? "Net Amount" : "Original Amount (excl. GST)"}
                    </span>
                    <span className="text-xl font-semibold text-slate-800">
                      {formatCurrency(result.netAmount)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pb-2 border-b border-teal-200">
                    <span className="text-slate-600">GST Amount ({formatPercentage(gstRate)})</span>
                    <span className="text-xl font-semibold text-teal-700">
                      +{formatCurrency(result.gstAmount)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-slate-700 font-medium">
                      {mode === "exclusive" ? "Total Amount (incl. GST)" : "Gross Amount (inclusive of GST)"}
                    </span>
                    <span className="text-2xl font-bold text-teal-800">
                      {formatCurrency(result.totalAmount)}
                    </span>
                  </div>
                </div>

                {/* Quick Info */}
                <div className="mt-6 p-3 bg-white/60 rounded-xl text-xs text-slate-500 flex items-start gap-2">
                  <Percent size={14} className="shrink-0 mt-0.5 text-teal-500" />
                  <span>
                    {mode === "exclusive"
                      ? `GST of ${formatPercentage(gstRate)} is applied on the net amount.`
                      : `The original price excluding GST is ${formatCurrency(result.netAmount)}.`}
                  </span>
                </div>
              </div>
            </div>

            {/* Formula Explanation Toggle */}
            <div className="mt-6 pt-4 border-t border-slate-200">
              <button
                onClick={() => setShowFormula(!showFormula)}
                className="text-sm text-teal-600 hover:text-teal-700 flex items-center gap-1"
              >
                <Sparkles size={14} />
                {showFormula ? "Hide formula" : "Show calculation formula"}
              </button>
              {showFormula && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 p-3 bg-slate-50 rounded-xl text-xs text-slate-600 font-mono"
                >
                  {mode === "exclusive" ? (
                    <>
                      <div>GST Amount = (Net Amount × GST Rate) / 100</div>
                      <div>Total Amount = Net Amount + GST Amount</div>
                      <div className="text-teal-600 mt-1">
                        = {formatCurrency(amount)} + {formatCurrency(result.gstAmount)} = {formatCurrency(result.totalAmount)}
                      </div>
                    </>
                  ) : (
                    <>
                      <div>Original Amount = Gross Amount / (1 + GST Rate/100)</div>
                      <div>GST Amount = Gross Amount - Original Amount</div>
                      <div className="text-teal-600 mt-1">
                        = {formatCurrency(amount)} - {formatCurrency(result.netAmount)} = {formatCurrency(result.gstAmount)}
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Tips Card */}
        <div className="mt-10 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl p-6 border border-teal-200">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-white rounded-xl shadow-sm">
              <Sparkles size={20} className="text-teal-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 mb-1">GST Essentials</h3>
              <p className="text-sm text-slate-600">
                GST (Goods and Services Tax) in India has multiple slabs: 0%, 3%, 5%, 12%, 18%, and 28%.
                Some items like gold attract 3% GST. Use this calculator to determine tax liability or
                reverse‑calculate the base price from a GST‑inclusive amount.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200/60 py-8 mt-8 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} FinTools. Simplify your taxes.
        </div>
      </footer>
    </div>
  );
}