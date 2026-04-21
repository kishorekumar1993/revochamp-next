"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Playfair_Display, Poppins } from "next/font/google";
import Link from "next/link";
import {
  Calendar,
  Heart,
  CalendarDays,
  AlertCircle,
  Info,
  Sparkles,
} from "lucide-react";

const playfair = Playfair_Display({ subsets: ["latin"] });
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

// ----------------------------------------------------------------------
// Calculation Logic
// ----------------------------------------------------------------------

/**
 * Normalize date to midnight
 */
function normalize(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/**
 * Estimate conception date range from due date
 * Due date = conception + 266 days (38 weeks)
 * So conception = due date - 266 days
 * Conception window: ovulation day ± 1 day
 */
function fromDueDate(dueDate: Date): {
  conceptionDate: Date;
  conceptionStart: Date;
  conceptionEnd: Date;
  ovulationDate: Date;
} {
  const conception = normalize(new Date(dueDate.getTime() - 266 * 24 * 60 * 60 * 1000));
  const ovulation = conception; // conception day = ovulation day (fertilization within 24h)
  const start = normalize(new Date(conception.getTime() - 1 * 24 * 60 * 60 * 1000));
  const end = normalize(new Date(conception.getTime() + 1 * 24 * 60 * 60 * 1000));
  return {
    conceptionDate: conception,
    conceptionStart: start,
    conceptionEnd: end,
    ovulationDate: ovulation,
  };
}

/**
 * Estimate conception from LMP (last menstrual period)
 * Ovulation typically occurs 14 days before next period (cycle length assumption 28 days)
 * So ovulation = LMP + 14 days
 * Conception = ovulation (±1 day)
 */
function fromLMP(lmpDate: Date, cycleLength: number = 28): {
  ovulationDate: Date;
  conceptionDate: Date;
  conceptionStart: Date;
  conceptionEnd: Date;
} {
  const ovulation = normalize(new Date(lmpDate.getTime() + (cycleLength - 14) * 24 * 60 * 60 * 1000));
  const conception = ovulation; // conception day
  const start = normalize(new Date(conception.getTime() - 1 * 24 * 60 * 60 * 1000));
  const end = normalize(new Date(conception.getTime() + 1 * 24 * 60 * 60 * 1000));
  return {
    ovulationDate: ovulation,
    conceptionDate: conception,
    conceptionStart: start,
    conceptionEnd: end,
  };
}

/**
 * Calculate current pregnancy week based on conception date
 */
function getPregnancyWeek(conceptionDate: Date): number {
  const today = normalize(new Date());
  const conception = normalize(conceptionDate);
  const daysSinceConception = Math.floor((today.getTime() - conception.getTime()) / (1000 * 60 * 60 * 24));
  // Pregnancy weeks are counted from LMP, which is ~2 weeks before conception
  const weeksPregnant = Math.floor((daysSinceConception + 14) / 7);
  return weeksPregnant > 0 ? weeksPregnant : 0;
}

// ----------------------------------------------------------------------
// Client Component
// ----------------------------------------------------------------------
export default function PregnancyConceptionClient() {
  const [method, setMethod] = useState<"dueDate" | "lmp">("dueDate");

  // Due date method
  const [dueDate, setDueDate] = useState<Date>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 140); // assume ~20 weeks from now
    return d;
  });

  // LMP method
  const [lmpDate, setLmpDate] = useState<Date>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 70); // assume ~10 weeks ago
    return d;
  });
  const [cycleLength, setCycleLength] = useState<number>(28);

  // Results
  const [conceptionDate, setConceptionDate] = useState<Date | null>(null);
  const [conceptionWindowStart, setConceptionWindowStart] = useState<Date | null>(null);
  const [conceptionWindowEnd, setConceptionWindowEnd] = useState<Date | null>(null);
  const [ovulationDate, setOvulationDate] = useState<Date | null>(null);
  const [pregnancyWeek, setPregnancyWeek] = useState<number | null>(null);
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
      if (method === "dueDate") {
        if (!dueDate) {
          setError("Please select your due date.");
          return;
        }
        const result = fromDueDate(dueDate);
        setConceptionDate(result.conceptionDate);
        setConceptionWindowStart(result.conceptionStart);
        setConceptionWindowEnd(result.conceptionEnd);
        setOvulationDate(result.ovulationDate);
        setPregnancyWeek(getPregnancyWeek(result.conceptionDate));
      } else {
        if (!lmpDate) {
          setError("Please select the first day of your last menstrual period.");
          return;
        }
        if (cycleLength < 21 || cycleLength > 35) {
          setError("Cycle length should be between 21 and 35 days.");
          return;
        }
        const result = fromLMP(lmpDate, cycleLength);
        setConceptionDate(result.conceptionDate);
        setConceptionWindowStart(result.conceptionStart);
        setConceptionWindowEnd(result.conceptionEnd);
        setOvulationDate(result.ovulationDate);
        setPregnancyWeek(getPregnancyWeek(result.conceptionDate));
      }
    } catch (e) {
      setError("Something went wrong. Please check your inputs.");
    }
  };

  useEffect(() => {
    calculate();
  }, [method, dueDate, lmpDate, cycleLength]);

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
            <span>💑</span> Conception Tool
          </div>
          <h1
            className={`${playfair.className} text-3xl sm:text-4xl font-extrabold text-stone-800 mb-3`}
          >
            Pregnancy Conception Calculator
          </h1>
          <p className={`${poppins.className} text-base text-stone-600 max-w-2xl`}>
            Estimate when conception likely occurred and your fertile window using
            your due date or last menstrual period.
          </p>
        </motion.div>

        {/* Input Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-stone-100 overflow-hidden mb-8">
          <div className="p-6 md:p-8">
            {/* Method Selection */}
            <div className="mb-6">
              <label className="block text-stone-700 font-medium mb-3">
                What do you know?
              </label>
              <div className="flex flex-wrap gap-3">
                {[
                  { value: "dueDate", label: "📅 Due Date", icon: <CalendarDays size={18} /> },
                  { value: "lmp", label: "🩸 Last Menstrual Period", icon: <Calendar size={18} /> },
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
              {method === "dueDate" && (
                <DatePickerField
                  label="Your due date"
                  value={dueDate}
                  onChange={setDueDate}
                />
              )}
              {method === "lmp" && (
                <>
                  <DatePickerField
                    label="First day of last menstrual period"
                    value={lmpDate}
                    onChange={setLmpDate}
                  />
                  <div>
                    <label className="block text-stone-700 font-medium mb-2">
                      Average cycle length (days)
                    </label>
                    <input
                      type="number"
                      value={cycleLength}
                      onChange={(e) => setCycleLength(Number(e.target.value))}
                      min={21}
                      max={35}
                      className="w-full p-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500"
                    />
                    <p className="text-xs text-stone-400 mt-1">
                      Typical range: 21–35 days (default 28)
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
          {conceptionDate && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl shadow-lg border border-stone-100 overflow-hidden mb-8"
            >
              <div className="p-6 md:p-8">
                <h2 className={`${playfair.className} text-2xl font-bold text-stone-800 mb-4`}>
                  💑 Your Conception Window
                </h2>
                <div className="space-y-4">
                  {/* Conception Date (most likely) */}
                  <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl">
                    <Heart className="text-amber-600" size={28} />
                    <div>
                      <p className="text-sm text-stone-500">Most likely conception date</p>
                      <p className="text-xl font-bold text-stone-800">{formatDate(conceptionDate)}</p>
                    </div>
                  </div>

                  {/* Conception Window Range */}
                  <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl">
                    <CalendarDays className="text-amber-600" size={20} />
                    <div>
                      <p className="text-sm text-stone-500">Possible conception window</p>
                      <p className="font-semibold text-stone-800">
                        {formatDate(conceptionWindowStart!)} – {formatDate(conceptionWindowEnd!)}
                      </p>
                    </div>
                  </div>

                  {/* Ovulation Date */}
                  {ovulationDate && (
                    <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl">
                      <Sparkles className="text-amber-600" size={20} />
                      <div>
                        <p className="text-sm text-stone-500">Estimated ovulation day</p>
                        <p className="font-semibold text-stone-800">{formatDate(ovulationDate)}</p>
                      </div>
                    </div>
                  )}

                  {/* Current Pregnancy Week */}
                  {pregnancyWeek && pregnancyWeek > 0 && (
                    <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl">
                      <Calendar className="text-amber-600" size={20} />
                      <div>
                        <p className="text-sm text-stone-500">Current pregnancy week</p>
                        <p className="font-semibold text-stone-800">
                          Week {pregnancyWeek} (based on conception)
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-xl text-sm text-stone-600">
                  <Info size={16} className="inline mr-1 text-blue-600" />
                  Conception typically occurs within 24 hours of ovulation. Sperm can
                  survive up to 5 days, so intercourse in the days before ovulation
                  can also lead to pregnancy. This is an estimate – for exact dating,
                  consult your healthcare provider.
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Info Card */}
        <div className="bg-white/50 rounded-2xl border border-stone-200 p-6">
          <h3 className={`${playfair.className} text-xl font-bold text-stone-800 mb-2`}>
            How conception dating works
          </h3>
          <div className="space-y-3 text-stone-600 text-sm">
            <p>
              <strong className="text-stone-800">From due date</strong> – Pregnancy lasts
              approximately 266 days (38 weeks) from conception. Subtract 266 days from
              your due date to estimate the conception day.
            </p>
            <p>
              <strong className="text-stone-800">From last menstrual period (LMP)</strong> –
              Ovulation usually occurs 14 days before your next period. For a 28‑day cycle,
              ovulation = LMP + 14 days. Conception occurs within 24 hours of ovulation.
            </p>
            <p>
              <strong className="text-stone-800">Conception window</strong> – Because sperm
              can live up to 5 days and the egg survives 24 hours, the fertile window spans
              several days. Our calculator shows the most likely single day (±1 day).
            </p>
          </div>
          <div className="mt-4 p-3 bg-stone-100 rounded-lg text-xs text-stone-500 italic">
            ⚠️ This tool provides estimates only. Ultrasound dating in early pregnancy is
            the most accurate way to determine gestational age and conception.
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