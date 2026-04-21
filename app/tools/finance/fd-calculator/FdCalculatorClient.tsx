// app/tools/finance/fd-calculator/FdCalculatorClient.tsx
"use client";

import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Playfair_Display, Poppins } from 'next/font/google';
import Link from 'next/link';
import {
  Calculator,
  PiggyBank,
  IndianRupee,
  Percent,
  Calendar,
  TrendingUp,
  BarChart3,
  ChevronDown,
  ChevronRight,
  Banknote,
} from 'lucide-react';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '700', '800'] });
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });

interface YearlyBreakdown {
  year: number;
  principal: number;
  interest: number;
  balance: number;
}

const compoundingOptions = [
  { value: 1, label: 'Yearly' },
  { value: 2, label: 'Half-Yearly' },
  { value: 4, label: 'Quarterly' },
  { value: 12, label: 'Monthly' },
];

const presetFds = [
  { name: '1 Year', principal: 100000, rate: 7.0, tenure: 1 },
  { name: '3 Years', principal: 250000, rate: 7.5, tenure: 3 },
  { name: '5 Years', principal: 500000, rate: 8.0, tenure: 5 },
  { name: '10 Years', principal: 1000000, rate: 8.5, tenure: 10 },
];

export default function FdCalculatorClient() {
  const [principal, setPrincipal] = useState(250000);
  const [interestRate, setInterestRate] = useState(7.5);
  const [tenure, setTenure] = useState(3);
  const [compounding, setCompounding] = useState(4); // Quarterly default
  const [showBreakdown, setShowBreakdown] = useState(false);

  const calculateFD = useCallback(() => {
    const rate = interestRate / 100;
    const n = compounding;
    const t = tenure;
    
    const maturityAmount = principal * Math.pow(1 + rate / n, n * t);
    const interestEarned = maturityAmount - principal;

    // Yearly breakdown
    const breakdown: YearlyBreakdown[] = [];
    let balance = principal;
    for (let year = 1; year <= t; year++) {
      const yearEndBalance = principal * Math.pow(1 + rate / n, n * year);
      const yearlyInterest = yearEndBalance - balance;
      breakdown.push({
        year,
        principal,
        interest: yearlyInterest,
        balance: yearEndBalance,
      });
      balance = yearEndBalance;
    }

    return { maturityAmount, interestEarned, breakdown };
  }, [principal, interestRate, tenure, compounding]);

  const { maturityAmount, interestEarned, breakdown } = useMemo(() => calculateFD(), [calculateFD]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handlePreset = (preset: typeof presetFds[0]) => {
    setPrincipal(preset.principal);
    setInterestRate(preset.rate);
    setTenure(preset.tenure);
  };

  // Calculate max bar height for chart (relative to maturity amount)
  const maxBarHeight = 150;
  const principalBarHeight = (principal / maturityAmount) * maxBarHeight || 0;
  const interestBarHeight = maxBarHeight - principalBarHeight;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/20 via-white to-amber-50/20 text-slate-800">
      <header className="bg-white/90 backdrop-blur-xl border-b border-emerald-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className={`${playfair.className} text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent`}>
            FinTools
          </Link>
          <span className={`${poppins.className} text-sm font-medium text-slate-600`}>FD Calculator</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-14">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-medium mb-5 shadow-sm">
            <PiggyBank size={16} /> Free Financial Tool
          </div>
          <h1 className={`${playfair.className} text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-4 leading-tight`}>
            FD <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Calculator</span>
          </h1>
          <p className={`${poppins.className} text-base sm:text-lg text-slate-600 max-w-2xl mx-auto`}>
            Calculate your Fixed Deposit maturity amount and interest earned. Compare different compounding frequencies.
          </p>
        </motion.div>

        {/* Preset Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {presetFds.map((preset) => (
            <button
              key={preset.name}
              onClick={() => handlePreset(preset)}
              className="px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:border-emerald-300 transition-all flex items-center gap-2 text-slate-700 hover:text-emerald-700"
            >
              <Banknote size={16} />
              <span className="text-sm font-medium">{preset.name}</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Controls */}
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 p-6 md:p-8">
            <h2 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
              <IndianRupee size={20} className="text-emerald-600" />
              Deposit Details
            </h2>

            {/* Principal */}
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-slate-600">Principal Amount</label>
                <span className="text-sm font-mono text-emerald-700 bg-emerald-50 px-3 py-0.5 rounded-full">
                  {formatCurrency(principal)}
                </span>
              </div>
              <input
                type="range"
                min={1000}
                max={5000000}
                step={1000}
                value={principal}
                onChange={(e) => setPrincipal(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>₹1K</span>
                <span>₹50L</span>
              </div>
              <input
                type="number"
                value={principal}
                onChange={(e) => setPrincipal(Math.min(5000000, Math.max(1000, parseInt(e.target.value) || 0)))}
                className="mt-3 w-full px-4 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>

            {/* Interest Rate */}
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-slate-600">Interest Rate (% p.a.)</label>
                <span className="text-sm font-mono text-emerald-700 bg-emerald-50 px-3 py-0.5 rounded-full">
                  {interestRate}%
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={15}
                step={0.1}
                value={interestRate}
                onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>1%</span>
                <span>15%</span>
              </div>
              <input
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(Math.min(15, Math.max(1, parseFloat(e.target.value) || 0)))}
                step="0.1"
                className="mt-3 w-full px-4 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>

            {/* Tenure */}
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-slate-600">Tenure (Years)</label>
                <span className="text-sm font-mono text-emerald-700 bg-emerald-50 px-3 py-0.5 rounded-full">
                  {tenure} {tenure === 1 ? 'Year' : 'Years'}
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={20}
                step={1}
                value={tenure}
                onChange={(e) => setTenure(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>1 Year</span>
                <span>20 Years</span>
              </div>
              <input
                type="number"
                value={tenure}
                onChange={(e) => setTenure(Math.min(20, Math.max(1, parseInt(e.target.value) || 0)))}
                className="mt-3 w-full px-4 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>

            {/* Compounding Frequency */}
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">Compounding Frequency</label>
              <select
                value={compounding}
                onChange={(e) => setCompounding(parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm bg-white"
              >
                {compoundingOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Panel */}
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 p-6 md:p-8">
            <h2 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
              <TrendingUp size={20} className="text-emerald-600" />
              Maturity Summary
            </h2>

            {/* Maturity Amount */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-5 mb-6 border border-emerald-200">
              <p className="text-sm text-emerald-700 mb-1">Maturity Amount</p>
              <p className="text-4xl font-bold text-emerald-800">{formatCurrency(maturityAmount)}</p>
            </div>

            {/* Interest Earned & Principal */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <p className="text-xs text-slate-500 mb-1">Principal</p>
                <p className="text-xl font-semibold text-slate-800">{formatCurrency(principal)}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <p className="text-xs text-slate-500 mb-1">Interest Earned</p>
                <p className="text-xl font-semibold text-amber-700">{formatCurrency(interestEarned)}</p>
              </div>
            </div>

            {/* Bar Chart Visualization */}
            <div className="mb-6">
              <p className="text-sm font-medium text-slate-600 mb-3 flex items-center gap-2">
                <BarChart3 size={16} className="text-emerald-600" />
                Principal vs Interest
              </p>
              <div className="flex items-end justify-center gap-8 h-40">
                <div className="flex flex-col items-center">
                  <div className="text-xs text-slate-500 mb-1">Principal</div>
                  <div className="w-16 bg-emerald-500 rounded-t-lg" style={{ height: `${principalBarHeight}px` }}></div>
                  <div className="text-sm font-medium mt-2">{formatCurrency(principal)}</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-xs text-slate-500 mb-1">Interest</div>
                  <div className="w-16 bg-amber-500 rounded-t-lg" style={{ height: `${interestBarHeight}px` }}></div>
                  <div className="text-sm font-medium mt-2">{formatCurrency(interestEarned)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Year-wise Breakdown */}
        <div className="mt-6">
          <button
            onClick={() => setShowBreakdown(!showBreakdown)}
            className="w-full bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
          >
            <span className="font-medium text-slate-700 flex items-center gap-2">
              <Calendar size={18} className="text-emerald-600" />
              Year-wise Breakdown
            </span>
            {showBreakdown ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </button>

          <AnimatePresence>
            {showBreakdown && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
              >
                <div className="max-h-96 overflow-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 sticky top-0">
                      <tr className="border-b border-slate-200">
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">Year</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">Principal</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">Interest Earned</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">Balance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {breakdown.map((row) => (
                        <tr key={row.year} className="hover:bg-slate-50">
                          <td className="px-4 py-2">{row.year}</td>
                          <td className="px-4 py-2 text-right font-mono">{formatCurrency(row.principal)}</td>
                          <td className="px-4 py-2 text-right font-mono text-amber-600">{formatCurrency(row.interest)}</td>
                          <td className="px-4 py-2 text-right font-mono text-emerald-700 font-medium">{formatCurrency(row.balance)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Features */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-5">
          <FeatureCard
            icon={<Calculator className="text-emerald-500" size={20} />}
            title="Accurate Compounding"
            description="Supports yearly, half-yearly, quarterly, and monthly compounding."
          />
          <FeatureCard
            icon={<BarChart3 className="text-teal-500" size={20} />}
            title="Visual Breakdown"
            description="See principal vs interest split with an interactive bar chart."
          />
          <FeatureCard
            icon={<Calendar className="text-amber-500" size={20} />}
            title="Year-wise Table"
            description="View year-by-year growth of your fixed deposit."
          />
        </div>
      </main>

      <footer className="border-t border-slate-200/60 py-8 mt-8 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} FinTools. Smart financial planning for everyone.
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center mb-3">
        {icon}
      </div>
      <h4 className="font-semibold text-slate-800 mb-1">{title}</h4>
      <p className="text-sm text-slate-600">{description}</p>
    </div>
  );
}