// app/tools/finance/emi-calculator/EmiCalculatorClient.tsx
"use client";

import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Playfair_Display, Poppins } from 'next/font/google';
import Link from 'next/link';
import {
  Calculator,
  Home,
  Car,
  CreditCard,
  GraduationCap,
  IndianRupee,
  Calendar,
  Percent,
  PieChart,
  TrendingUp,
  Download,
  RefreshCw,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '700', '800'] });
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });

interface AmortizationRow {
  month: number;
  emi: number;
  interest: number;
  principal: number;
  balance: number;
}

export default function EmiCalculatorClient() {
  const [loanAmount, setLoanAmount] = useState(2500000); // ₹25,00,000
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);
  const [tenureType, setTenureType] = useState<'years' | 'months'>('years');
  const [showSchedule, setShowSchedule] = useState(false);

  const calculateEMI = useCallback(() => {
    const principal = loanAmount;
    const monthlyRate = interestRate / 12 / 100;
    const months = tenureType === 'years' ? tenure * 12 : tenure;

    if (principal <= 0 || monthlyRate <= 0 || months <= 0) {
      return { emi: 0, totalInterest: 0, totalPayment: 0, schedule: [] };
    }

    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    const totalPayment = emi * months;
    const totalInterest = totalPayment - principal;

    // Generate amortization schedule
    const schedule: AmortizationRow[] = [];
    let balance = principal;
    for (let i = 1; i <= months; i++) {
      const interest = balance * monthlyRate;
      const principalPaid = emi - interest;
      balance = Math.max(0, balance - principalPaid);
      schedule.push({
        month: i,
        emi: emi,
        interest: interest,
        principal: principalPaid,
        balance: balance,
      });
    }

    return { emi, totalInterest, totalPayment, schedule };
  }, [loanAmount, interestRate, tenure, tenureType]);

  const { emi, totalInterest, totalPayment, schedule } = useMemo(() => calculateEMI(), [calculateEMI]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-IN').format(value);
  };

  const loanTypeButtons = [
    { label: 'Home', icon: Home, amount: 2500000, rate: 8.5, tenure: 20 },
    { label: 'Car', icon: Car, amount: 800000, rate: 9.0, tenure: 5 },
    { label: 'Personal', icon: CreditCard, amount: 500000, rate: 12.0, tenure: 3 },
    { label: 'Education', icon: GraduationCap, amount: 1500000, rate: 8.0, tenure: 10 },
  ];

  const handlePreset = (preset: { amount: number; rate: number; tenure: number }) => {
    setLoanAmount(preset.amount);
    setInterestRate(preset.rate);
    setTenure(preset.tenure);
    setTenureType('years');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/20 via-white to-amber-50/20 text-slate-800">
      <header className="bg-white/90 backdrop-blur-xl border-b border-emerald-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className={`${playfair.className} text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent`}>
            FinTools
          </Link>
          <span className={`${poppins.className} text-sm font-medium text-slate-600`}>EMI Calculator</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-14">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-medium mb-5 shadow-sm">
            <Calculator size={16} /> Free Financial Tool
          </div>
          <h1 className={`${playfair.className} text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-4 leading-tight`}>
            EMI <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Calculator</span>
          </h1>
          <p className={`${poppins.className} text-base sm:text-lg text-slate-600 max-w-2xl mx-auto`}>
            Calculate your monthly loan EMI, total interest, and view complete amortization schedule.
          </p>
        </motion.div>

        {/* Loan Type Presets */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {loanTypeButtons.map((preset) => (
            <button
              key={preset.label}
              onClick={() => handlePreset(preset)}
              className="px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:border-emerald-300 transition-all flex items-center gap-2 text-slate-700 hover:text-emerald-700"
            >
              <preset.icon size={16} />
              <span className="text-sm font-medium">{preset.label} Loan</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Controls */}
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 p-6 md:p-8">
            <h2 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
              <IndianRupee size={20} className="text-emerald-600" />
              Loan Details
            </h2>

            {/* Loan Amount */}
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-slate-600">Loan Amount</label>
                <span className="text-sm font-mono text-emerald-700 bg-emerald-50 px-3 py-0.5 rounded-full">
                  {formatCurrency(loanAmount)}
                </span>
              </div>
              <input
                type="range"
                min={10000}
                max={10000000}
                step={10000}
                value={loanAmount}
                onChange={(e) => setLoanAmount(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>₹10K</span>
                <span>₹1Cr</span>
              </div>
              <input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Math.min(10000000, Math.max(10000, parseInt(e.target.value) || 0)))}
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
                max={20}
                step={0.1}
                value={interestRate}
                onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>1%</span>
                <span>20%</span>
              </div>
              <input
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(Math.min(20, Math.max(1, parseFloat(e.target.value) || 0)))}
                step="0.1"
                className="mt-3 w-full px-4 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>

            {/* Tenure */}
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-slate-600">Loan Tenure</label>
                <span className="text-sm font-mono text-emerald-700 bg-emerald-50 px-3 py-0.5 rounded-full">
                  {tenure} {tenureType}
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={tenureType === 'years' ? 30 : 360}
                step={1}
                value={tenure}
                onChange={(e) => setTenure(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>1 {tenureType === 'years' ? 'year' : 'month'}</span>
                <span>{tenureType === 'years' ? '30 years' : '360 months'}</span>
              </div>
              <div className="flex gap-2 mt-3">
                <input
                  type="number"
                  value={tenure}
                  onChange={(e) => setTenure(Math.min(tenureType === 'years' ? 30 : 360, Math.max(1, parseInt(e.target.value) || 0)))}
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-sm"
                />
                <select
                  value={tenureType}
                  onChange={(e) => {
                    setTenureType(e.target.value as 'years' | 'months');
                    setTenure(e.target.value === 'years' ? Math.min(30, tenure) : Math.min(360, tenure * 12));
                  }}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                >
                  <option value="years">Years</option>
                  <option value="months">Months</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 p-6 md:p-8">
            <h2 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
              <TrendingUp size={20} className="text-emerald-600" />
              EMI Summary
            </h2>

            {/* Monthly EMI */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-5 mb-6 border border-emerald-200">
              <p className="text-sm text-emerald-700 mb-1">Monthly EMI</p>
              <p className="text-4xl font-bold text-emerald-800">{formatCurrency(emi)}</p>
            </div>

            {/* Total Interest & Payment */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <p className="text-xs text-slate-500 mb-1">Total Interest</p>
                <p className="text-xl font-semibold text-amber-700">{formatCurrency(totalInterest)}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <p className="text-xs text-slate-500 mb-1">Total Payment</p>
                <p className="text-xl font-semibold text-slate-800">{formatCurrency(totalPayment)}</p>
              </div>
            </div>

            {/* Pie Chart Visualization */}
            <div className="mb-6">
              <p className="text-sm font-medium text-slate-600 mb-3 flex items-center gap-2">
                <PieChart size={16} className="text-emerald-600" />
                Principal vs Interest
              </p>
              <div className="flex items-center gap-4">
                <div className="relative w-24 h-24">
                  <svg viewBox="0 0 36 36" className="w-full h-full">
                    <path
                      d={`M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831`}
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="3"
                      strokeDasharray={`${(loanAmount / totalPayment) * 100}, 100`}
                      className="transition-all duration-500"
                    />
                    <path
                      d={`M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831`}
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="3"
                      strokeDasharray={`${(totalInterest / totalPayment) * 100}, 100`}
                      strokeDashoffset={-((loanAmount / totalPayment) * 100)}
                      className="transition-all duration-500"
                    />
                  </svg>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    <span className="text-sm text-slate-600">Principal: {formatCurrency(loanAmount)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <span className="text-sm text-slate-600">Interest: {formatCurrency(totalInterest)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Amortization Schedule */}
        <div className="mt-6">
          <button
            onClick={() => setShowSchedule(!showSchedule)}
            className="w-full bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
          >
            <span className="font-medium text-slate-700 flex items-center gap-2">
              <Calendar size={18} className="text-emerald-600" />
              Amortization Schedule
            </span>
            {showSchedule ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </button>

          <AnimatePresence>
            {showSchedule && (
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
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">Month</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">EMI</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">Interest</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">Principal</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">Balance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {schedule.slice(0, 24).map((row) => (
                        <tr key={row.month} className="hover:bg-slate-50">
                          <td className="px-4 py-2">{row.month}</td>
                          <td className="px-4 py-2 text-right font-mono">{formatCurrency(row.emi)}</td>
                          <td className="px-4 py-2 text-right font-mono text-amber-600">{formatCurrency(row.interest)}</td>
                          <td className="px-4 py-2 text-right font-mono text-emerald-600">{formatCurrency(row.principal)}</td>
                          <td className="px-4 py-2 text-right font-mono">{formatCurrency(row.balance)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {schedule.length > 24 && (
                    <p className="text-center text-xs text-slate-500 py-3 border-t border-slate-100">
                      Showing first 24 months of {schedule.length} total payments
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Features */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-5">
          <FeatureCard
            icon={<Calculator className="text-emerald-500" size={20} />}
            title="Accurate EMI Calculation"
            description="Uses standard reducing balance method for precise monthly EMI."
          />
          <FeatureCard
            icon={<PieChart className="text-teal-500" size={20} />}
            title="Visual Breakdown"
            description="See principal vs interest split with interactive pie chart."
          />
          <FeatureCard
            icon={<Calendar className="text-amber-500" size={20} />}
            title="Amortization Schedule"
            description="View month-by-month breakup of interest and principal payments."
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