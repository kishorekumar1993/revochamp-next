"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Playfair_Display, Poppins } from "next/font/google";
import {
  format,
  addDays,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isToday,
  getDay,
  subMonths,
  addMonths,
} from "date-fns";

// ----------------------------------------------------------------------------
// Fonts
// ----------------------------------------------------------------------------
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700", "800"],
});
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// ----------------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------------
type DayType = "period" | "fertile" | "ovulation" | "normal" | "empty";

interface FertilityDayInfo {
  type: DayType;
  probability: number;
}

interface CalendarDay {
  date: Date | null;
  type: DayType;
  probability: number;
}

interface CyclePrediction {
  cycleNumber: number;
  startDate: Date;
  endDate: Date;
  ovulationDate: Date | null;
  fertileStart: Date;
  fertileEnd: Date;
}

// ----------------------------------------------------------------------------
// Utility functions
// ----------------------------------------------------------------------------
const normalizeDate = (date: Date): Date =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const probabilityFromDays = (daysFromOvulation: number): number => {
  switch (daysFromOvulation) {
    case -1: return 0.31;
    case -2: return 0.27;
    case -3: return 0.16;
    case -4: return 0.14;
    case -5: return 0.10;
    default: return 0.02;
  }
};

const calculateCycle = (
  cycleStart: Date,
  cycleLength: number,
  lutealPhase: number,
  regularity: string
): { ovulation: Date | null; fertileStart: Date; fertileEnd: Date } => {
  const cycleEnd = addDays(cycleStart, cycleLength);
  if (regularity === "Regular") {
    const ovulation = addDays(cycleEnd, -lutealPhase);
    const fertileStart = addDays(ovulation, -5);
    const fertileEnd = ovulation;
    return { ovulation, fertileStart, fertileEnd };
  } else {
    const fertileStart = addDays(cycleStart, 8);
    const fertileEnd = addDays(cycleStart, 19);
    return { ovulation: null, fertileStart, fertileEnd };
  }
};

const generateFertilityInfo = (
  cycleStart: Date,
  cycleLength: number,
  periodDuration: number,
  lutealPhase: number,
  regularity: string
): Map<string, FertilityDayInfo> => {
  const info = new Map<string, FertilityDayInfo>();
  const lastDay = addDays(cycleStart, cycleLength * 4);
  let currentStart = cycleStart;

  while (currentStart < lastDay) {
    const res = calculateCycle(currentStart, cycleLength, lutealPhase, regularity);

    for (let i = 0; i < periodDuration; i++) {
      const day = addDays(currentStart, i);
      info.set(normalizeDate(day).toISOString(), { type: "period", probability: 0 });
    }

    if (regularity === "Regular" && res.ovulation) {
      for (let offset = -5; offset <= 0; offset++) {
        const day = addDays(res.ovulation, offset);
        const prob = probabilityFromDays(offset);
        info.set(normalizeDate(day).toISOString(), {
          type: offset === 0 ? "ovulation" : "fertile",
          probability: prob,
        });
      }
    } else if (regularity === "Irregular") {
      for (let offset = 8; offset <= 19; offset++) {
        const day = addDays(currentStart, offset);
        if (!info.has(normalizeDate(day).toISOString())) {
          info.set(normalizeDate(day).toISOString(), {
            type: "fertile",
            probability: 0.15,
          });
        }
      }
    }
    currentStart = addDays(currentStart, cycleLength);
  }
  return info;
};

const predictCycles = (
  start: Date,
  cycleLength: number,
  lutealPhase: number,
  regularity: string,
  count: number = 3
): CyclePrediction[] => {
  const predictions: CyclePrediction[] = [];
  let currentStart = start;
  for (let i = 0; i < count; i++) {
    const cycleEnd = addDays(currentStart, cycleLength);
    const res = calculateCycle(currentStart, cycleLength, lutealPhase, regularity);
    predictions.push({
      cycleNumber: i + 1,
      startDate: currentStart,
      endDate: cycleEnd,
      ovulationDate: res.ovulation,
      fertileStart: res.fertileStart,
      fertileEnd: res.fertileEnd,
    });
    currentStart = cycleEnd;
  }
  return predictions;
};

// ----------------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------------
export default function OvulationCalculator() {
  const [lmpDate, setLmpDate] = useState<Date>(() => normalizeDate(addDays(new Date(), -20)));
  const [cycleLength, setCycleLength] = useState(28);
  const [periodDuration, setPeriodDuration] = useState(5);
  const [regularity, setRegularity] = useState("Regular");
  const [lutealPhase, setLutealPhase] = useState(14);
  const [age, setAge] = useState(30);
  const [tryingToConceive, setTryingToConceive] = useState(false);

  const [ovulationDate, setOvulationDate] = useState<Date | null>(null);
  const [fertileStart, setFertileStart] = useState<Date | null>(null);
  const [fertileEnd, setFertileEnd] = useState<Date | null>(null);
  const [nextPeriodDate, setNextPeriodDate] = useState<Date | null>(null);
  const [upcomingCycles, setUpcomingCycles] = useState<CyclePrediction[]>([]);
  const [fertilityInfo, setFertilityInfo] = useState<Map<string, FertilityDayInfo>>(new Map());
  const [focusedMonth, setFocusedMonth] = useState<Date>(new Date());
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  useEffect(() => {
    calculateAll();
  }, [lmpDate, cycleLength, periodDuration, regularity, lutealPhase]);

  const calculateAll = () => {
    if (!lmpDate) return;

    if (cycleLength < 21 || cycleLength > 35) {
      alert("Cycle length must be between 21 and 35 days.");
      return;
    }
    if (periodDuration < 2 || periodDuration > 8) {
      alert("Period duration must be between 2 and 8 days.");
      return;
    }
    if (lutealPhase < 10 || lutealPhase > 16) {
      alert("Luteal phase must be between 10 and 16 days.");
      return;
    }
    if (lmpDate > new Date()) {
      alert("Last period date cannot be in the future.");
      return;
    }

    const nextPeriod = addDays(lmpDate, cycleLength);
    setNextPeriodDate(nextPeriod);

    const current = calculateCycle(lmpDate, cycleLength, lutealPhase, regularity);
    setOvulationDate(current.ovulation);
    setFertileStart(current.fertileStart);
    setFertileEnd(current.fertileEnd);

    const info = generateFertilityInfo(lmpDate, cycleLength, periodDuration, lutealPhase, regularity);
    setFertilityInfo(info);

    const predictions = predictCycles(lmpDate, cycleLength, lutealPhase, regularity, 3);
    setUpcomingCycles(predictions);

    setFocusedMonth(new Date(lmpDate.getFullYear(), lmpDate.getMonth()));
  };

  const getDayInfo = (date: Date): FertilityDayInfo | undefined =>
    fertilityInfo.get(normalizeDate(date).toISOString());

  const buildMonthDays = (month: Date): CalendarDay[] => {
    const start = startOfMonth(month);
    const end = endOfMonth(month);
    const daysInMonth = eachDayOfInterval({ start, end });
    const startWeekday = getDay(start);
    const offset = startWeekday === 0 ? 6 : startWeekday - 1;

    const days: CalendarDay[] = [];
    for (let i = 0; i < offset; i++) {
      days.push({ date: null, type: "empty", probability: 0 });
    }
    for (const date of daysInMonth) {
      const info = getDayInfo(date);
      days.push({
        date,
        type: info?.type ?? "normal",
        probability: info?.probability ?? 0,
      });
    }
    while (days.length % 7 !== 0) {
      days.push({ date: null, type: "empty", probability: 0 });
    }
    return days;
  };

  const handlePrevMonth = () => setFocusedMonth(subMonths(focusedMonth, 1));
  const handleNextMonth = () => setFocusedMonth(addMonths(focusedMonth, 1));

  const handleDayClick = (day: CalendarDay) => {
    if (!day.date) return;
    setSelectedDay(day.date);
  };

  const handleShare = async () => {
    if (!lmpDate || !nextPeriodDate) return;
    let text = `Ovulation Calculator Results\n`;
    text += `LMP: ${format(lmpDate, "dd MMM yyyy")}\n`;
    text += `Cycle length: ${cycleLength} days\n`;
    if (regularity === "Regular" && ovulationDate) {
      text += `Ovulation: ${format(ovulationDate, "dd MMM yyyy")}\n`;
      text += `Fertile window: ${format(fertileStart!, "dd MMM")} – ${format(fertileEnd!, "dd MMM")}\n`;
    } else {
      text += `Fertile window: ${format(fertileStart!, "dd MMM")} – ${format(fertileEnd!, "dd MMM")}\n`;
    }
    text += `Next period: ${format(nextPeriodDate, "dd MMM yyyy")}`;
    try {
      await navigator.clipboard.writeText(text);
      alert("Results copied to clipboard!");
    } catch {
      prompt("Copy manually:", text);
    }
  };

  const monthDays = useMemo(() => buildMonthDays(focusedMonth), [focusedMonth, fertilityInfo]);
  const bestDays = useMemo(() => {
    if (!tryingToConceive || !nextPeriodDate) return [];
    const days: Date[] = [];
    fertilityInfo.forEach((info, iso) => {
      const date = new Date(iso);
      if (info.probability >= 0.27 && date > lmpDate && date < nextPeriodDate) {
        days.push(date);
      }
    });
    return days.sort((a, b) => a.getTime() - b.getTime());
  }, [tryingToConceive, fertilityInfo, lmpDate, nextPeriodDate]);

  const probabilityData = useMemo(() => {
    if (!ovulationDate) return [];
    const data: { offset: number; probability: number }[] = [];
    for (let offset = -5; offset <= 0; offset++) {
      const day = addDays(ovulationDate, offset);
      const info = getDayInfo(day);
      data.push({ offset, probability: info?.probability ?? 0 });
    }
    return data;
  }, [ovulationDate, fertilityInfo]);

  const selectedDayInfo = selectedDay ? getDayInfo(selectedDay) : null;

  // Premium calendar styling helper
  const getDayStyle = (type: DayType, probability: number) => {
    switch (type) {
      case "period":
        return "bg-gradient-to-br from-rose-400 to-pink-500 text-white shadow-md";
      case "fertile":
        return `bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-md ${
          probability > 0.2 ? "ring-2 ring-green-300" : ""
        }`;
      case "ovulation":
        return "bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-xl scale-110 ring-2 ring-blue-300";
      default:
        return "bg-white/80 backdrop-blur border border-stone-200 text-stone-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/30 via-white to-white">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-amber-100 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <h1 className={`${playfair.className} text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent`}>
            Revochamp
          </h1>
          <span className={`${poppins.className} text-sm text-stone-500 hidden sm:block`}>
            Ovulation & Fertility Pro
          </span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h2 className={`${playfair.className} text-3xl sm:text-4xl font-extrabold text-stone-800 mb-3`}>
            📅 Ovulation & Fertility Pro
          </h2>
          <p className={`${poppins.className} text-base sm:text-lg text-stone-600 max-w-3xl`}>
            Track your cycle with daily probabilities and multi-cycle forecasts.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-xl shadow-amber-100/50 border border-amber-100 p-6 sticky top-20">
              <h3 className={`${playfair.className} text-xl font-bold text-stone-800 mb-4`}>📋 Cycle Details</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Last Menstrual Period</label>
                  <input
                    type="date"
                    value={format(lmpDate, "yyyy-MM-dd")}
                    onChange={(e) => setLmpDate(normalizeDate(new Date(e.target.value)))}
                    className="w-full p-2.5 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Cycle Length (21-35 days)</label>
                  <input
                    type="number"
                    value={cycleLength}
                    onChange={(e) => setCycleLength(Number(e.target.value))}
                    min={21}
                    max={35}
                    className="w-full p-2.5 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Period Duration (2-8 days)</label>
                  <input
                    type="number"
                    value={periodDuration}
                    onChange={(e) => setPeriodDuration(Number(e.target.value))}
                    min={2}
                    max={8}
                    className="w-full p-2.5 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Cycle Regularity</label>
                  <select
                    value={regularity}
                    onChange={(e) => setRegularity(e.target.value)}
                    className="w-full p-2.5 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Regular">Regular</option>
                    <option value="Irregular">Irregular</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Luteal Phase (10-16 days)</label>
                  <input
                    type="number"
                    value={lutealPhase}
                    onChange={(e) => setLutealPhase(Number(e.target.value))}
                    min={10}
                    max={16}
                    className="w-full p-2.5 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="text-amber-600 text-sm font-medium flex items-center gap-1"
                >
                  <span>⚙️ Advanced</span>
                  <span>{showAdvanced ? "▲" : "▼"}</span>
                </button>

                <AnimatePresence>
                  {showAdvanced && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4 pt-2 border-t border-stone-200"
                    >
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">Age</label>
                        <input
                          type="number"
                          value={age}
                          onChange={(e) => setAge(Number(e.target.value))}
                          className="w-full p-2.5 border border-stone-200 rounded-xl"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-stone-700">Trying to conceive?</span>
                        <button
                          onClick={() => setTryingToConceive(!tryingToConceive)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            tryingToConceive ? "bg-amber-500" : "bg-stone-300"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              tryingToConceive ? "translate-x-6" : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  onClick={calculateAll}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-3 px-6 rounded-full shadow-md transition"
                >
                  🔍 Calculate Fertility
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Results & Calendar */}
          <div className="lg:col-span-2 space-y-6">
            {/* Results Summary */}
            <div className="bg-white rounded-3xl shadow-xl shadow-amber-100/50 border border-amber-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className={`${playfair.className} text-xl font-bold text-stone-800`}>📊 Current Cycle</h3>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 py-2 border border-amber-200 text-amber-700 rounded-full hover:bg-amber-50 transition"
                >
                  <span>📤</span> Share
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-amber-50 rounded-xl">
                  <div className="text-sm text-stone-500">🥚 Ovulation</div>
                  <div className="text-lg font-semibold text-stone-800">
                    {ovulationDate ? format(ovulationDate, "dd MMM") : "—"}
                  </div>
                </div>
                <div className="p-4 bg-green-50 rounded-xl">
                  <div className="text-sm text-stone-500">🌸 Fertile Window</div>
                  <div className="text-lg font-semibold text-stone-800">
                    {fertileStart && fertileEnd
                      ? `${format(fertileStart, "dd MMM")} – ${format(fertileEnd, "dd MMM")}`
                      : "—"}
                  </div>
                </div>
                <div className="p-4 bg-blue-50 rounded-xl">
                  <div className="text-sm text-stone-500">📆 Next Period</div>
                  <div className="text-lg font-semibold text-stone-800">
                    {nextPeriodDate ? format(nextPeriodDate, "dd MMM") : "—"}
                  </div>
                </div>
              </div>
            </div>

            {/* Premium Calendar Card */}
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 p-6">
              <div className="flex items-center justify-between mb-6">
                <button onClick={handlePrevMonth} className="p-2 hover:bg-amber-50 rounded-full transition">
                  ◀
                </button>
                <h3 className={`${playfair.className} text-xl font-bold text-stone-800`}>
                  {format(focusedMonth, "MMMM yyyy")}
                </h3>
                <button onClick={handleNextMonth} className="p-2 hover:bg-amber-50 rounded-full transition">
                  ▶
                </button>
              </div>

              {/* Premium Legend */}
              <div className="flex flex-wrap gap-4 mb-5 text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-gradient-to-r from-rose-400 to-pink-500"></span>
                  Period
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-gradient-to-r from-green-400 to-emerald-500"></span>
                  Fertile
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-gradient-to-r from-indigo-500 to-blue-600"></span>
                  Ovulation
                </div>
              </div>

              {/* Weekday Headers */}
              <div className="grid grid-cols-7 gap-3 mb-3">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                  <div key={d} className="text-center text-xs font-semibold text-stone-400 uppercase tracking-wider">
                    {d}
                  </div>
                ))}
              </div>

              {/* Premium Days Grid */}
              <div className="grid grid-cols-7 gap-3">
                {monthDays.map((day, idx) => {
                  const isBestDay = tryingToConceive && day.probability >= 0.27;
                  const isSelected = selectedDay && day.date && isSameDay(day.date, selectedDay);

                  return (
                    <motion.button
                      key={idx}
                      whileHover={day.date ? { scale: 1.12 } : {}}
                      whileTap={day.date ? { scale: 0.95 } : {}}
                      onClick={() => handleDayClick(day)}
                      disabled={!day.date}
                      className={`
                        relative aspect-square rounded-2xl flex flex-col items-center justify-center 
                        text-sm font-semibold transition-all duration-200
                        ${day.date ? "cursor-pointer" : "opacity-20"}
                        ${isSelected ? "ring-2 ring-amber-500 shadow-xl scale-110" : ""}
                        ${day.date ? getDayStyle(day.type, day.probability) : ""}
                      `}
                    >
                      {day.date && (
                        <>
                          <span className={`${isToday(day.date) ? "text-black font-bold underline" : ""}`}>
                            {format(day.date, "d")}
                          </span>
                          {isToday(day.date) && (
                            <span className="text-[9px] mt-1 opacity-70">Today</span>
                          )}
                          {isBestDay && (
                            <>
                              <span className="absolute top-1 right-1 w-2 h-2 bg-pink-500 rounded-full animate-ping"></span>
                              <span className="absolute top-1 right-1 w-2 h-2 bg-pink-600 rounded-full"></span>
                            </>
                          )}
                          {day.probability > 0 && (
                            <div
                              className="absolute bottom-1 left-1 right-1 h-1 rounded-full bg-black/20"
                              style={{ opacity: day.probability * 2 }}
                            />
                          )}
                        </>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Selected Day Info */}
              <AnimatePresence>
                {selectedDay && selectedDayInfo && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="mt-6 p-4 bg-white/80 backdrop-blur rounded-xl border border-white/40"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-stone-800">{format(selectedDay, "EEEE, dd MMM yyyy")}</p>
                        <p className="text-sm text-stone-600 mt-1">
                          Type: <span className="font-medium">{selectedDayInfo.type}</span>
                          {selectedDayInfo.probability > 0 && (
                            <> · Pregnancy chance: {Math.round(selectedDayInfo.probability * 100)}%</>
                          )}
                        </p>
                      </div>
                      <button onClick={() => setSelectedDay(null)} className="text-stone-400 hover:text-stone-600">
                        ✕
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Upcoming Cycles */}
            {upcomingCycles.length > 0 && (
              <div className="bg-white rounded-3xl shadow-xl shadow-amber-100/50 border border-amber-100 p-6">
                <h3 className={`${playfair.className} text-xl font-bold text-stone-800 mb-4`}>📅 Upcoming Cycles</h3>
                <div className="space-y-3">
                  {upcomingCycles.map((cycle) => (
                    <div key={cycle.cycleNumber} className="flex items-center gap-4 p-3 bg-stone-50 rounded-xl">
                      <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold">
                        {cycle.cycleNumber}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-stone-800">Cycle {cycle.cycleNumber}</div>
                        <div className="text-sm text-stone-500">
                          🌸 Fertile: {format(cycle.fertileStart, "dd MMM")} – {format(cycle.fertileEnd, "dd MMM")}
                        </div>
                        {cycle.ovulationDate && (
                          <div className="text-sm text-stone-500">
                            🥚 Ovulation: {format(cycle.ovulationDate, "dd MMM")}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Best Days */}
            {tryingToConceive && bestDays.length > 0 && (
              <div className="bg-white rounded-3xl shadow-xl shadow-amber-100/50 border border-amber-100 p-6">
                <h3 className={`${playfair.className} text-xl font-bold text-stone-800 mb-4`}>✨ Best Days to Conceive</h3>
                <div className="flex flex-wrap gap-2">
                  {bestDays.map((date) => (
                    <span key={date.toISOString()} className="px-4 py-2 bg-pink-50 text-pink-700 rounded-full text-sm font-medium">
                      {format(date, "dd MMM")} ❤️
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Probability Chart */}
            {regularity === "Regular" && ovulationDate && probabilityData.length > 0 && (
              <div className="bg-white rounded-3xl shadow-xl shadow-amber-100/50 border border-amber-100 p-6">
                <h3 className={`${playfair.className} text-xl font-bold text-stone-800 mb-4`}>📈 Daily Pregnancy Probability</h3>
                <div className="h-48 flex items-end gap-2">
                  {probabilityData.map(({ offset, probability }) => (
                    <div key={offset} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-gradient-to-t from-amber-500 to-orange-400 rounded-t-lg transition-all"
                        style={{ height: `${probability * 120}px` }}
                      />
                      <div className="text-xs mt-1 text-stone-500">{offset === 0 ? "O" : offset}</div>
                      <div className="text-xs font-bold">{Math.round(probability * 100)}%</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Educational Content */}
        <div className="mt-12">
          <h3 className={`${playfair.className} text-2xl font-bold text-stone-800 mb-6`}>📚 Understanding Your Fertility</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: "🥚 What is ovulation?", content: "Ovulation is the release of an egg from the ovary, usually 14 days before your next period. It's your most fertile time." },
              { title: "🔍 Signs of ovulation", content: "Changes in cervical mucus (egg‑white consistency), slight rise in basal body temperature, mild cramps." },
              { title: "💪 How to increase fertility", content: "Maintain a healthy weight, eat folate‑rich foods, track your cycle, and have regular intercourse during the fertile window." },
              { title: "👩‍⚕️ When to see a doctor", content: "If you're under 35 and have been trying for over a year, or over 35 for six months, consult a fertility specialist." },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-2xl shadow-md border border-amber-100 p-5"
              >
                <h4 className={`${poppins.className} font-semibold text-lg text-stone-800`}>{item.title}</h4>
                <p className={`${poppins.className} text-sm text-stone-600 mt-2`}>{item.content}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 p-4 bg-stone-50 border border-stone-200 rounded-2xl text-center">
          <p className={`${poppins.className} text-sm text-stone-500 italic`}>
            ⚠️ This tool provides estimates only and is not medical advice. Consult a healthcare professional for fertility concerns.
          </p>
        </div>
      </main>

      <footer className="border-t border-stone-200 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-stone-500">
          © {new Date().getFullYear()} Revochamp. Evidence‑based fertility insights.
        </div>
      </footer>
    </div>
  );
}

// "use client";

// import React, { useState, useEffect, useMemo } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Playfair_Display, Poppins } from "next/font/google";
// import {
//   format,
//   addDays,
//   startOfMonth,
//   endOfMonth,
//   eachDayOfInterval,
//   isSameDay,
//   isToday,
//   getDay,
//   subMonths,
//   addMonths,
// } from "date-fns";

// // ----------------------------------------------------------------------------
// // Fonts
// // ----------------------------------------------------------------------------
// const playfair = Playfair_Display({
//   subsets: ["latin"],
//   weight: ["400", "700", "800"],
// });
// const poppins = Poppins({
//   subsets: ["latin"],
//   weight: ["400", "500", "600", "700"],
// });

// // ----------------------------------------------------------------------------
// // Types
// // ----------------------------------------------------------------------------
// type DayType = "period" | "fertile" | "ovulation" | "normal" | "empty";

// interface FertilityDayInfo {
//   type: DayType;
//   probability: number;
// }

// interface CalendarDay {
//   date: Date | null;
//   type: DayType;
//   probability: number;
// }

// interface CyclePrediction {
//   cycleNumber: number;
//   startDate: Date;
//   endDate: Date;
//   ovulationDate: Date | null;
//   fertileStart: Date;
//   fertileEnd: Date;
// }

// // ----------------------------------------------------------------------------
// // Utility functions
// // ----------------------------------------------------------------------------
// const normalizeDate = (date: Date): Date =>
//   new Date(date.getFullYear(), date.getMonth(), date.getDate());

// const probabilityFromDays = (daysFromOvulation: number): number => {
//   switch (daysFromOvulation) {
//     case -1: return 0.31;
//     case -2: return 0.27;
//     case -3: return 0.16;
//     case -4: return 0.14;
//     case -5: return 0.10;
//     default: return 0.02;
//   }
// };

// const calculateCycle = (
//   cycleStart: Date,
//   cycleLength: number,
//   lutealPhase: number,
//   regularity: string
// ): { ovulation: Date | null; fertileStart: Date; fertileEnd: Date } => {
//   const cycleEnd = addDays(cycleStart, cycleLength);
//   if (regularity === "Regular") {
//     const ovulation = addDays(cycleEnd, -lutealPhase);
//     const fertileStart = addDays(ovulation, -5);
//     const fertileEnd = ovulation;
//     return { ovulation, fertileStart, fertileEnd };
//   } else {
//     const fertileStart = addDays(cycleStart, 8);
//     const fertileEnd = addDays(cycleStart, 19);
//     return { ovulation: null, fertileStart, fertileEnd };
//   }
// };

// const generateFertilityInfo = (
//   cycleStart: Date,
//   cycleLength: number,
//   periodDuration: number,
//   lutealPhase: number,
//   regularity: string
// ): Map<string, FertilityDayInfo> => {
//   const info = new Map<string, FertilityDayInfo>();
//   const lastDay = addDays(cycleStart, cycleLength * 4);
//   let currentStart = cycleStart;

//   while (currentStart < lastDay) {
//     const res = calculateCycle(currentStart, cycleLength, lutealPhase, regularity);

//     // Period days
//     for (let i = 0; i < periodDuration; i++) {
//       const day = addDays(currentStart, i);
//       info.set(normalizeDate(day).toISOString(), { type: "period", probability: 0 });
//     }

//     if (regularity === "Regular" && res.ovulation) {
//       for (let offset = -5; offset <= 0; offset++) {
//         const day = addDays(res.ovulation, offset);
//         const prob = probabilityFromDays(offset);
//         info.set(normalizeDate(day).toISOString(), {
//           type: offset === 0 ? "ovulation" : "fertile",
//           probability: prob,
//         });
//       }
//     } else if (regularity === "Irregular") {
//       for (let offset = 8; offset <= 19; offset++) {
//         const day = addDays(currentStart, offset);
//         if (!info.has(normalizeDate(day).toISOString())) {
//           info.set(normalizeDate(day).toISOString(), {
//             type: "fertile",
//             probability: 0.15,
//           });
//         }
//       }
//     }
//     currentStart = addDays(currentStart, cycleLength);
//   }
//   return info;
// };

// const predictCycles = (
//   start: Date,
//   cycleLength: number,
//   lutealPhase: number,
//   regularity: string,
//   count: number = 3
// ): CyclePrediction[] => {
//   const predictions: CyclePrediction[] = [];
//   let currentStart = start;
//   for (let i = 0; i < count; i++) {
//     const cycleEnd = addDays(currentStart, cycleLength);
//     const res = calculateCycle(currentStart, cycleLength, lutealPhase, regularity);
//     predictions.push({
//       cycleNumber: i + 1,
//       startDate: currentStart,
//       endDate: cycleEnd,
//       ovulationDate: res.ovulation,
//       fertileStart: res.fertileStart,
//       fertileEnd: res.fertileEnd,
//     });
//     currentStart = cycleEnd;
//   }
//   return predictions;
// };

// // ----------------------------------------------------------------------------
// // Main Component
// // ----------------------------------------------------------------------------
// export default function OvulationCalculator() {
//   const [lmpDate, setLmpDate] = useState<Date>(() => normalizeDate(addDays(new Date(), -20)));
//   const [cycleLength, setCycleLength] = useState(28);
//   const [periodDuration, setPeriodDuration] = useState(5);
//   const [regularity, setRegularity] = useState("Regular");
//   const [lutealPhase, setLutealPhase] = useState(14);
//   const [age, setAge] = useState(30);
//   const [tryingToConceive, setTryingToConceive] = useState(false);

//   const [ovulationDate, setOvulationDate] = useState<Date | null>(null);
//   const [fertileStart, setFertileStart] = useState<Date | null>(null);
//   const [fertileEnd, setFertileEnd] = useState<Date | null>(null);
//   const [nextPeriodDate, setNextPeriodDate] = useState<Date | null>(null);
//   const [upcomingCycles, setUpcomingCycles] = useState<CyclePrediction[]>([]);
//   const [fertilityInfo, setFertilityInfo] = useState<Map<string, FertilityDayInfo>>(new Map());
//   const [focusedMonth, setFocusedMonth] = useState<Date>(new Date());
//   const [showAdvanced, setShowAdvanced] = useState(false);
//   const [selectedDay, setSelectedDay] = useState<Date | null>(null);

//   useEffect(() => {
//     calculateAll();
//   }, [lmpDate, cycleLength, periodDuration, regularity, lutealPhase]);

//   const calculateAll = () => {
//     if (!lmpDate) return;

//     if (cycleLength < 21 || cycleLength > 35) {
//       alert("Cycle length must be between 21 and 35 days.");
//       return;
//     }
//     if (periodDuration < 2 || periodDuration > 8) {
//       alert("Period duration must be between 2 and 8 days.");
//       return;
//     }
//     if (lutealPhase < 10 || lutealPhase > 16) {
//       alert("Luteal phase must be between 10 and 16 days.");
//       return;
//     }
//     if (lmpDate > new Date()) {
//       alert("Last period date cannot be in the future.");
//       return;
//     }

//     const nextPeriod = addDays(lmpDate, cycleLength);
//     setNextPeriodDate(nextPeriod);

//     const current = calculateCycle(lmpDate, cycleLength, lutealPhase, regularity);
//     setOvulationDate(current.ovulation);
//     setFertileStart(current.fertileStart);
//     setFertileEnd(current.fertileEnd);

//     const info = generateFertilityInfo(lmpDate, cycleLength, periodDuration, lutealPhase, regularity);
//     setFertilityInfo(info);

//     const predictions = predictCycles(lmpDate, cycleLength, lutealPhase, regularity, 3);
//     setUpcomingCycles(predictions);

//     setFocusedMonth(new Date(lmpDate.getFullYear(), lmpDate.getMonth()));
//   };

//   const getDayInfo = (date: Date): FertilityDayInfo | undefined =>
//     fertilityInfo.get(normalizeDate(date).toISOString());

//   const buildMonthDays = (month: Date): CalendarDay[] => {
//     const start = startOfMonth(month);
//     const end = endOfMonth(month);
//     const daysInMonth = eachDayOfInterval({ start, end });
//     const startWeekday = getDay(start);
//     const offset = startWeekday === 0 ? 6 : startWeekday - 1;

//     const days: CalendarDay[] = [];
//     for (let i = 0; i < offset; i++) {
//       days.push({ date: null, type: "empty", probability: 0 });
//     }
//     for (const date of daysInMonth) {
//       const info = getDayInfo(date);
//       days.push({
//         date,
//         type: info?.type ?? "normal",
//         probability: info?.probability ?? 0,
//       });
//     }
//     while (days.length % 7 !== 0) {
//       days.push({ date: null, type: "empty", probability: 0 });
//     }
//     return days;
//   };

//   const handlePrevMonth = () => setFocusedMonth(subMonths(focusedMonth, 1));
//   const handleNextMonth = () => setFocusedMonth(addMonths(focusedMonth, 1));

//   const handleDayClick = (day: CalendarDay) => {
//     if (!day.date) return;
//     setSelectedDay(day.date);
//   };

//   const handleShare = async () => {
//     if (!lmpDate || !nextPeriodDate) return;
//     let text = `Ovulation Calculator Results\n`;
//     text += `LMP: ${format(lmpDate, "dd MMM yyyy")}\n`;
//     text += `Cycle length: ${cycleLength} days\n`;
//     if (regularity === "Regular" && ovulationDate) {
//       text += `Ovulation: ${format(ovulationDate, "dd MMM yyyy")}\n`;
//       text += `Fertile window: ${format(fertileStart!, "dd MMM")} – ${format(fertileEnd!, "dd MMM")}\n`;
//     } else {
//       text += `Fertile window: ${format(fertileStart!, "dd MMM")} – ${format(fertileEnd!, "dd MMM")}\n`;
//     }
//     text += `Next period: ${format(nextPeriodDate, "dd MMM yyyy")}`;
//     try {
//       await navigator.clipboard.writeText(text);
//       alert("Results copied to clipboard!");
//     } catch {
//       prompt("Copy manually:", text);
//     }
//   };

//   const monthDays = useMemo(() => buildMonthDays(focusedMonth), [focusedMonth, fertilityInfo]);
//   const bestDays = useMemo(() => {
//     if (!tryingToConceive || !nextPeriodDate) return [];
//     const days: Date[] = [];
//     fertilityInfo.forEach((info, iso) => {
//       const date = new Date(iso);
//       if (info.probability >= 0.27 && date > lmpDate && date < nextPeriodDate) {
//         days.push(date);
//       }
//     });
//     return days.sort((a, b) => a.getTime() - b.getTime());
//   }, [tryingToConceive, fertilityInfo, lmpDate, nextPeriodDate]);

//   const probabilityData = useMemo(() => {
//     if (!ovulationDate) return [];
//     const data: { offset: number; probability: number }[] = [];
//     for (let offset = -5; offset <= 0; offset++) {
//       const day = addDays(ovulationDate, offset);
//       const info = getDayInfo(day);
//       data.push({ offset, probability: info?.probability ?? 0 });
//     }
//     return data;
//   }, [ovulationDate, fertilityInfo]);

//   const colors = {
//     primary: "#E67E22",
//     period: "#FF6B6B",
//     fertile: "#6BCB6B",
//     ovulation: "#5A9EFF",
//     normal: "#F3F4F6",
//   };

//   const getDayColor = (type: DayType): string => {
//     switch (type) {
//       case "period": return colors.period;
//       case "fertile": return colors.fertile;
//       case "ovulation": return colors.ovulation;
//       default: return colors.normal;
//     }
//   };

//   const selectedDayInfo = selectedDay ? getDayInfo(selectedDay) : null;

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-amber-50/30 via-white to-white">
//       {/* Header */}
//       <header className="bg-white/90 backdrop-blur-md border-b border-amber-100 sticky top-0 z-20">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
//           <h1 className={`${playfair.className} text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent`}>
//             Revochamp
//           </h1>
//           <span className={`${poppins.className} text-sm text-stone-500 hidden sm:block`}>
//             Ovulation & Fertility Pro
//           </span>
//         </div>
//       </header>

//       <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
//         <motion.div
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="mb-10"
//         >
//           <h2 className={`${playfair.className} text-3xl sm:text-4xl font-extrabold text-stone-800 mb-3`}>
//             📅 Ovulation & Fertility Pro
//           </h2>
//           <p className={`${poppins.className} text-base sm:text-lg text-stone-600 max-w-3xl`}>
//             Track your cycle with daily probabilities and multi-cycle forecasts.
//           </p>
//         </motion.div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Left Column: Form */}
//           <div className="lg:col-span-1">
//             <div className="bg-white rounded-3xl shadow-xl shadow-amber-100/50 border border-amber-100 p-6 sticky top-20">
//               <h3 className={`${playfair.className} text-xl font-bold text-stone-800 mb-4`}>📋 Cycle Details</h3>

//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-stone-700 mb-1">Last Menstrual Period</label>
//                   <input
//                     type="date"
//                     value={format(lmpDate, "yyyy-MM-dd")}
//                     onChange={(e) => setLmpDate(normalizeDate(new Date(e.target.value)))}
//                     className="w-full p-2.5 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-stone-700 mb-1">Cycle Length (21-35 days)</label>
//                   <input
//                     type="number"
//                     value={cycleLength}
//                     onChange={(e) => setCycleLength(Number(e.target.value))}
//                     min={21}
//                     max={35}
//                     className="w-full p-2.5 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-stone-700 mb-1">Period Duration (2-8 days)</label>
//                   <input
//                     type="number"
//                     value={periodDuration}
//                     onChange={(e) => setPeriodDuration(Number(e.target.value))}
//                     min={2}
//                     max={8}
//                     className="w-full p-2.5 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-stone-700 mb-1">Cycle Regularity</label>
//                   <select
//                     value={regularity}
//                     onChange={(e) => setRegularity(e.target.value)}
//                     className="w-full p-2.5 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500"
//                   >
//                     <option value="Regular">Regular</option>
//                     <option value="Irregular">Irregular</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-stone-700 mb-1">Luteal Phase (10-16 days)</label>
//                   <input
//                     type="number"
//                     value={lutealPhase}
//                     onChange={(e) => setLutealPhase(Number(e.target.value))}
//                     min={10}
//                     max={16}
//                     className="w-full p-2.5 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500"
//                   />
//                 </div>

//                 <button
//                   onClick={() => setShowAdvanced(!showAdvanced)}
//                   className="text-amber-600 text-sm font-medium flex items-center gap-1"
//                 >
//                   <span>⚙️ Advanced</span>
//                   <span>{showAdvanced ? "▲" : "▼"}</span>
//                 </button>

//                 <AnimatePresence>
//                   {showAdvanced && (
//                     <motion.div
//                       initial={{ opacity: 0, height: 0 }}
//                       animate={{ opacity: 1, height: "auto" }}
//                       exit={{ opacity: 0, height: 0 }}
//                       className="space-y-4 pt-2 border-t border-stone-200"
//                     >
//                       <div>
//                         <label className="block text-sm font-medium text-stone-700 mb-1">Age</label>
//                         <input
//                           type="number"
//                           value={age}
//                           onChange={(e) => setAge(Number(e.target.value))}
//                           className="w-full p-2.5 border border-stone-200 rounded-xl"
//                         />
//                       </div>
//                       <div className="flex items-center justify-between">
//                         <span className="text-sm font-medium text-stone-700">Trying to conceive?</span>
//                         <button
//                           onClick={() => setTryingToConceive(!tryingToConceive)}
//                           className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${tryingToConceive ? "bg-amber-500" : "bg-stone-300"}`}
//                         >
//                           <span
//                             className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${tryingToConceive ? "translate-x-6" : "translate-x-1"}`}
//                           />
//                         </button>
//                       </div>
//                     </motion.div>
//                   )}
//                 </AnimatePresence>

//                 <button
//                   onClick={calculateAll}
//                   className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-3 px-6 rounded-full shadow-md transition"
//                 >
//                   🔍 Calculate Fertility
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Right Column: Results & Calendar */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* Results Summary */}
//             <div className="bg-white rounded-3xl shadow-xl shadow-amber-100/50 border border-amber-100 p-6">
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className={`${playfair.className} text-xl font-bold text-stone-800`}>📊 Current Cycle</h3>
//                 <button
//                   onClick={handleShare}
//                   className="flex items-center gap-2 px-4 py-2 border border-amber-200 text-amber-700 rounded-full hover:bg-amber-50 transition"
//                 >
//                   <span>📤</span> Share
//                 </button>
//               </div>
//               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                 <div className="p-4 bg-amber-50 rounded-xl">
//                   <div className="text-sm text-stone-500">🥚 Ovulation</div>
//                   <div className="text-lg font-semibold text-stone-800">
//                     {ovulationDate ? format(ovulationDate, "dd MMM") : "—"}
//                   </div>
//                 </div>
//                 <div className="p-4 bg-green-50 rounded-xl">
//                   <div className="text-sm text-stone-500">🌸 Fertile Window</div>
//                   <div className="text-lg font-semibold text-stone-800">
//                     {fertileStart && fertileEnd
//                       ? `${format(fertileStart, "dd MMM")} – ${format(fertileEnd, "dd MMM")}`
//                       : "—"}
//                   </div>
//                 </div>
//                 <div className="p-4 bg-blue-50 rounded-xl">
//                   <div className="text-sm text-stone-500">📆 Next Period</div>
//                   <div className="text-lg font-semibold text-stone-800">
//                     {nextPeriodDate ? format(nextPeriodDate, "dd MMM") : "—"}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Calendar Card */}
//             <div className="bg-white rounded-3xl shadow-xl shadow-amber-100/50 border border-amber-100 p-6">
//               <div className="flex items-center justify-between mb-6">
//                 <button onClick={handlePrevMonth} className="p-2 hover:bg-amber-50 rounded-full transition">
//                   ◀
//                 </button>
//                 <h3 className={`${playfair.className} text-xl font-bold text-stone-800`}>
//                   {format(focusedMonth, "MMMM yyyy")}
//                 </h3>
//                 <button onClick={handleNextMonth} className="p-2 hover:bg-amber-50 rounded-full transition">
//                   ▶
//                 </button>
//               </div>

//               {/* Legend */}
//               <div className="flex flex-wrap gap-4 mb-4 text-sm">
//                 <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.period }}></span> Period</div>
//                 <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.fertile }}></span> Fertile</div>
//                 <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.ovulation }}></span> Ovulation</div>
//                 {tryingToConceive && <div className="flex items-center gap-1.5">❤️ Best days</div>}
//               </div>

//               {/* Weekday Headers */}
//               <div className="grid grid-cols-7 gap-2 mb-2">
//                 {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
//                   <div key={d} className="text-center text-xs font-medium text-stone-500">{d}</div>
//                 ))}
//               </div>

//               {/* Days Grid */}
//               <div className="grid grid-cols-7 gap-2">
//                 {monthDays.map((day, idx) => {
//                   const isBestDay = tryingToConceive && day.probability >= 0.27;
//                   const bgColor = day.date ? getDayColor(day.type) : "transparent";
//                   const isSelected = selectedDay && day.date && isSameDay(day.date, selectedDay);

//                   return (
//                     <button
//                       key={idx}
//                       onClick={() => handleDayClick(day)}
//                       disabled={!day.date}
//                       className={`
//                         relative aspect-square rounded-xl flex items-center justify-center text-sm font-medium transition-all
//                         ${day.date ? "hover:scale-105 hover:shadow-md" : ""}
//                         ${isSelected ? "ring-2 ring-amber-500 ring-offset-2" : ""}
//                       `}
//                       style={{ backgroundColor: bgColor }}
//                     >
//                       {day.date && (
//                         <>
//                           <span className={`${isToday(day.date) ? "font-bold underline" : ""}`}>
//                             {format(day.date, "d")}
//                           </span>
//                           {isBestDay && (
//                             <span className="absolute -top-1 -right-1 text-pink-500 text-sm">❤️</span>
//                           )}
//                         </>
//                       )}
//                     </button>
//                   );
//                 })}
//               </div>

//               {/* Selected Day Info */}
//               <AnimatePresence>
//                 {selectedDay && selectedDayInfo && (
//                   <motion.div
//                     initial={{ opacity: 0, y: 10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: 10 }}
//                     className="mt-6 p-4 bg-stone-50 rounded-xl border border-stone-200"
//                   >
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="font-medium text-stone-800">{format(selectedDay, "EEEE, dd MMM yyyy")}</p>
//                         <p className="text-sm text-stone-600 mt-1">
//                           Type: <span className="font-medium">{selectedDayInfo.type}</span>
//                           {selectedDayInfo.probability > 0 && (
//                             <> · Pregnancy chance: {Math.round(selectedDayInfo.probability * 100)}%</>
//                           )}
//                         </p>
//                       </div>
//                       <button
//                         onClick={() => setSelectedDay(null)}
//                         className="text-stone-400 hover:text-stone-600"
//                       >
//                         ✕
//                       </button>
//                     </div>
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </div>

//             {/* Upcoming Cycles */}
//             {upcomingCycles.length > 0 && (
//               <div className="bg-white rounded-3xl shadow-xl shadow-amber-100/50 border border-amber-100 p-6">
//                 <h3 className={`${playfair.className} text-xl font-bold text-stone-800 mb-4`}>📅 Upcoming Cycles</h3>
//                 <div className="space-y-3">
//                   {upcomingCycles.map((cycle) => (
//                     <div key={cycle.cycleNumber} className="flex items-center gap-4 p-3 bg-stone-50 rounded-xl">
//                       <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold">
//                         {cycle.cycleNumber}
//                       </div>
//                       <div className="flex-1">
//                         <div className="font-medium text-stone-800">Cycle {cycle.cycleNumber}</div>
//                         <div className="text-sm text-stone-500">
//                           🌸 Fertile: {format(cycle.fertileStart, "dd MMM")} – {format(cycle.fertileEnd, "dd MMM")}
//                         </div>
//                         {cycle.ovulationDate && (
//                           <div className="text-sm text-stone-500">
//                             🥚 Ovulation: {format(cycle.ovulationDate, "dd MMM")}
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Best Days */}
//             {tryingToConceive && bestDays.length > 0 && (
//               <div className="bg-white rounded-3xl shadow-xl shadow-amber-100/50 border border-amber-100 p-6">
//                 <h3 className={`${playfair.className} text-xl font-bold text-stone-800 mb-4`}>✨ Best Days to Conceive</h3>
//                 <div className="flex flex-wrap gap-2">
//                   {bestDays.map((date) => (
//                     <span key={date.toISOString()} className="px-4 py-2 bg-pink-50 text-pink-700 rounded-full text-sm font-medium">
//                       {format(date, "dd MMM")} ❤️
//                     </span>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Probability Chart */}
//             {regularity === "Regular" && ovulationDate && probabilityData.length > 0 && (
//               <div className="bg-white rounded-3xl shadow-xl shadow-amber-100/50 border border-amber-100 p-6">
//                 <h3 className={`${playfair.className} text-xl font-bold text-stone-800 mb-4`}>📈 Daily Pregnancy Probability</h3>
//                 <div className="h-48 flex items-end gap-2">
//                   {probabilityData.map(({ offset, probability }) => (
//                     <div key={offset} className="flex-1 flex flex-col items-center">
//                       <div
//                         className="w-full bg-amber-500 rounded-t-lg transition-all"
//                         style={{ height: `${probability * 120}px` }}
//                       />
//                       <div className="text-xs mt-1 text-stone-500">{offset === 0 ? "O" : offset}</div>
//                       <div className="text-xs font-bold">{Math.round(probability * 100)}%</div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Educational Content */}
//         <div className="mt-12">
//           <h3 className={`${playfair.className} text-2xl font-bold text-stone-800 mb-6`}>📚 Understanding Your Fertility</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {[
//               { title: "🥚 What is ovulation?", content: "Ovulation is the release of an egg from the ovary, usually 14 days before your next period. It's your most fertile time." },
//               { title: "🔍 Signs of ovulation", content: "Changes in cervical mucus (egg‑white consistency), slight rise in basal body temperature, mild cramps." },
//               { title: "💪 How to increase fertility", content: "Maintain a healthy weight, eat folate‑rich foods, track your cycle, and have regular intercourse during the fertile window." },
//               { title: "👩‍⚕️ When to see a doctor", content: "If you're under 35 and have been trying for over a year, or over 35 for six months, consult a fertility specialist." },
//             ].map((item, idx) => (
//               <motion.div
//                 key={idx}
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: idx * 0.1 }}
//                 className="bg-white rounded-2xl shadow-md border border-amber-100 p-5"
//               >
//                 <h4 className={`${poppins.className} font-semibold text-lg text-stone-800`}>{item.title}</h4>
//                 <p className={`${poppins.className} text-sm text-stone-600 mt-2`}>{item.content}</p>
//               </motion.div>
//             ))}
//           </div>
//         </div>

//         {/* Disclaimer */}
//         <div className="mt-8 p-4 bg-stone-50 border border-stone-200 rounded-2xl text-center">
//           <p className={`${poppins.className} text-sm text-stone-500 italic`}>
//             ⚠️ This tool provides estimates only and is not medical advice. Consult a healthcare professional for fertility concerns.
//           </p>
//         </div>
//       </main>

//       <footer className="border-t border-stone-200 py-6 mt-12">
//         <div className="max-w-7xl mx-auto px-4 text-center text-sm text-stone-500">
//           © {new Date().getFullYear()} Revochamp. Evidence‑based fertility insights.
//         </div>
//       </footer>
//     </div>
//   );
// }