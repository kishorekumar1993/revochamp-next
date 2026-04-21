"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Playfair_Display, Poppins } from "next/font/google";
import Link from "next/link";
import {
  Calendar,
  Heart,
  Syringe,
  CalendarDays,
  AlertCircle,
  Info,
  Baby,
} from "lucide-react";

const playfair = Playfair_Display({ subsets: ["latin"] });
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

// ----------------------------------------------------------------------
// Due Date Calculation Logic
// ----------------------------------------------------------------------

/**
 * Calculate due date using Naegele's rule (LMP + 280 days)
 */
function fromLMP(lmpDate: Date): Date {
  const dueDate = new Date(lmpDate);
  dueDate.setDate(lmpDate.getDate() + 280);
  return dueDate;
}

/**
 * Calculate due date from conception date (conception + 266 days)
 */
function fromConception(conceptionDate: Date): Date {
  const dueDate = new Date(conceptionDate);
  dueDate.setDate(conceptionDate.getDate() + 266);
  return dueDate;
}

/**
 * Calculate due date from IVF transfer (transfer + 263 days for Day‑5, + 265 for Day‑3)
 */
function fromIVF(transferDate: Date, embryoType: "Day-3" | "Day-5"): Date {
  const daysToAdd = embryoType === "Day-5" ? 263 : 265;
  const dueDate = new Date(transferDate);
  dueDate.setDate(transferDate.getDate() + daysToAdd);
  return dueDate;
}

/**
 * Get current gestational age in weeks + days based on due date
 */
function getGestationalAge(dueDate: Date): { weeks: number; days: number } {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  const diffDays = Math.floor((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const daysPregnant = 280 - diffDays;
  if (daysPregnant < 0) return { weeks: 0, days: 0 };
  const weeks = Math.floor(daysPregnant / 7);
  const days = daysPregnant % 7;
  return { weeks, days };
}

// ----------------------------------------------------------------------
// Client Component
// ----------------------------------------------------------------------
export default function DueDateCalculatorClient() {
  const [method, setMethod] = useState<"lmp" | "conception" | "ivf">("lmp");

  // LMP
  const [lmpDate, setLmpDate] = useState<Date>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 70); // assume ~10 weeks pregnant
    return d;
  });

  // Conception
  const [conceptionDate, setConceptionDate] = useState<Date>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 56); // conception ~8 weeks ago
    return d;
  });

  // IVF
  const [transferDate, setTransferDate] = useState<Date>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 35); // transfer ~5 weeks ago
    return d;
  });
  const [embryoType, setEmbryoType] = useState<"Day-5" | "Day-3">("Day-5");

  // Results
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [gestationalAge, setGestationalAge] = useState<{ weeks: number; days: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const calculate = () => {
    setError(null);
    try {
      let computedDueDate: Date;
      if (method === "lmp") {
        if (!lmpDate) {
          setError("Please select the first day of your last menstrual period.");
          return;
        }
        computedDueDate = fromLMP(lmpDate);
      } else if (method === "conception") {
        if (!conceptionDate) {
          setError("Please select your conception date.");
          return;
        }
        computedDueDate = fromConception(conceptionDate);
      } else {
        if (!transferDate) {
          setError("Please select your embryo transfer date.");
          return;
        }
        computedDueDate = fromIVF(transferDate, embryoType);
      }
      setDueDate(computedDueDate);
      setGestationalAge(getGestationalAge(computedDueDate));
    } catch (e) {
      setError("Something went wrong. Please check your inputs.");
    }
  };

  useEffect(() => {
    calculate();
  }, [method, lmpDate, conceptionDate, transferDate, embryoType]);

  const isPastDue = dueDate && new Date() > dueDate;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/20 via-white to-pink-50/20">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-amber-100 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            href="/"
            className={`${playfair.className} text-xl font-bold bg-gradient-to-r from-amber-600 to-pink-600 bg-clip-text text-transparent`}
          >
            Revochamp
          </Link>
          <span className={`${poppins.className} text-xs text-stone-500`}>
            Pregnancy Tools
          </span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <span>📅</span> Pregnancy Calculator
          </div>
          <h1
            className={`${playfair.className} text-3xl sm:text-4xl font-extrabold text-stone-800 mb-3`}
          >
            Due Date Calculator
          </h1>
          <p className={`${poppins.className} text-base text-stone-600 max-w-2xl`}>
            Estimate your baby's arrival date using your last menstrual period,
            conception date, or IVF transfer date.
          </p>
        </motion.div>

        {/* Input Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-stone-100 overflow-hidden mb-8">
          <div className="p-6 md:p-8">
            {/* Method Selection */}
            <div className="mb-6">
              <label className="block text-stone-700 font-medium mb-3">
                Calculation method:
              </label>
              <div className="flex flex-wrap gap-3">
                {[
                  { value: "lmp", label: "📆 Last Menstrual Period", icon: <Calendar size={18} /> },
                  { value: "conception", label: "💑 Conception Date", icon: <Heart size={18} /> },
                  { value: "ivf", label: "🧪 IVF Transfer", icon: <Syringe size={18} /> },
                ].map((item) => (
                  <button
                    key={item.value}
                    onClick={() => setMethod(item.value as typeof method)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      method === item.value
                        ? "bg-gradient-to-r from-amber-500 to-pink-500 text-white shadow-md"
                        : "bg-white text-stone-600 hover:bg-stone-100 border border-stone-200"
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Inputs */}
            <div className="space-y-5">
              {method === "lmp" && (
                <DatePickerField
                  label="First day of last menstrual period"
                  value={lmpDate}
                  onChange={setLmpDate}
                />
              )}
              {method === "conception" && (
                <DatePickerField
                  label="Conception date (estimated)"
                  value={conceptionDate}
                  onChange={setConceptionDate}
                />
              )}
              {method === "ivf" && (
                <>
                  <DatePickerField
                    label="Embryo transfer date"
                    value={transferDate}
                    onChange={setTransferDate}
                  />
                  <div>
                    <label className="block text-stone-700 font-medium mb-2">
                      Embryo type
                    </label>
                    <select
                      value={embryoType}
                      onChange={(e) => setEmbryoType(e.target.value as "Day-3" | "Day-5")}
                      className="w-full p-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="Day-5">Day‑5 blastocyst</option>
                      <option value="Day-3">Day‑3 embryo</option>
                    </select>
                    <p className="text-xs text-stone-400 mt-1">
                      Day‑5 transfers add 263 days; Day‑3 add 265 days.
                    </p>
                  </div>
                </>
              )}
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-xl text-sm flex items-center gap-2">
                <AlertCircle size={16} />
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Results Card */}
        <AnimatePresence mode="wait">
          {dueDate && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl shadow-lg border border-stone-100 overflow-hidden mb-8"
            >
              <div className="p-6 md:p-8">
                <h2 className={`${playfair.className} text-2xl font-bold text-stone-800 mb-4`}>
                  🗓️ Your Estimated Due Date
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl">
                    <CalendarDays className="text-amber-600" size={28} />
                    <div>
                      <p className="text-sm text-stone-500">Estimated due date</p>
                      <p className="text-2xl font-bold text-stone-800">{formatDate(dueDate)}</p>
                    </div>
                  </div>
                  {gestationalAge && gestationalAge.weeks > 0 && (
                    <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl">
                      <Baby className="text-amber-600" size={20} />
                      <div>
                        <p className="text-sm text-stone-500">Current gestational age</p>
                        <p className="font-semibold text-stone-800">
                          {gestationalAge.weeks} weeks, {gestationalAge.days} days
                        </p>
                      </div>
                    </div>
                  )}
                  {isPastDue && (
                    <div className="p-3 bg-yellow-50 rounded-xl text-sm text-yellow-700 flex items-center gap-2">
                      <AlertCircle size={16} />
                      Your due date has passed. Please consult your healthcare provider.
                    </div>
                  )}
                </div>
                <div className="mt-6 p-4 bg-blue-50 rounded-xl text-sm text-stone-600">
                  <Info size={16} className="inline mr-1 text-blue-600" />
                  Only about 5% of babies are born exactly on their due date. Most arrive
                  between 37 and 42 weeks. This is an estimate – always follow your
                  healthcare provider's guidance.
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Info Card */}
        <div className="bg-white/50 rounded-2xl border border-stone-200 p-6">
          <h3 className={`${playfair.className} text-xl font-bold text-stone-800 mb-2`}>
            How is due date calculated?
          </h3>
          <div className="space-y-3 text-stone-600 text-sm">
            <p>
              <strong className="text-stone-800">Naegele's rule</strong> – The most common method:
              add 280 days (40 weeks) to the first day of your last menstrual period.
            </p>
            <p>
              <strong className="text-stone-800">Conception method</strong> – Add 266 days (38 weeks)
              to the estimated conception date (ovulation + fertilization).
            </p>
            <p>
              <strong className="text-stone-800">IVF method</strong> – Add 263 days for Day‑5
              blastocyst transfer or 265 days for Day‑3 transfer.
            </p>
          </div>
          <div className="mt-4 p-3 bg-stone-100 rounded-lg text-xs text-stone-500 italic">
            ⚠️ This calculator provides an estimate. Pregnancy dating is best confirmed
            by ultrasound and your healthcare provider.
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 py-6 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-stone-400">
          © {new Date().getFullYear()} Revochamp. Evidence‑based pregnancy tools.
        </div>
      </footer>
    </div>
  );
}

// ----------------------------------------------------------------------
// Reusable Date Picker Component
// ----------------------------------------------------------------------
function DatePickerField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: Date;
  onChange: (date: Date) => void;
}) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    if (!isNaN(newDate.getTime())) {
      onChange(newDate);
    }
  };

  return (
    <div>
      <label className="block text-stone-700 font-medium mb-2">{label}</label>
      <input
        type="date"
        value={value.toISOString().split("T")[0]}
        onChange={handleChange}
        className="w-full p-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500"
      />
    </div>
  );
}