"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Playfair_Display, Poppins } from "next/font/google";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { format, differenceInDays } from "date-fns";

// ----------------------------------------------------------------------------
// Fonts
// ----------------------------------------------------------------------------
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700", "800"],
});
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

// ----------------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------------
interface WeightEntry {
  id: string;
  date: string; // ISO string
  weightKg: number;
  notes: string;
}

// ----------------------------------------------------------------------------
// Constants
// ----------------------------------------------------------------------------
const STORAGE_KEY = "newborn_weight_entries";

// ----------------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------------
export default function NewbornWeightTracker() {
  const [entries, setEntries] = useState<WeightEntry[]>([]);
  const [weight, setWeight] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>(
    format(new Date(), "yyyy-MM-dd")
  );

  // Load entries from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Sort by date ascending for chart
        parsed.sort((a: WeightEntry, b: WeightEntry) =>
          new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        setEntries(parsed);
      }
    } catch (e) {
      console.error("Failed to load entries:", e);
    }
  }, []);

  // Save entries to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch (e) {
      console.error("Failed to save entries:", e);
    }
  }, [entries]);

  const addEntry = () => {
    const weightNum = parseFloat(weight);
    if (isNaN(weightNum) || weightNum <= 0) {
      alert("Please enter a valid weight in kg.");
      return;
    }

    const newEntry: WeightEntry = {
      id: Date.now().toString(),
      date: selectedDate,
      weightKg: weightNum,
      notes: notes.trim() || "No notes",
    };

    setEntries(prev => {
      const updated = [...prev, newEntry];
      updated.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      return updated;
    });

    setWeight("");
    setNotes("");
    setSelectedDate(format(new Date(), "yyyy-MM-dd"));
  };

  const deleteEntry = (id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  const clearAllEntries = () => {
    if (window.confirm("Are you sure you want to delete all weight entries?")) {
      setEntries([]);
    }
  };

  // Calculate daily gain (between last two entries)
  const calculateDailyGain = (): string => {
    if (entries.length < 2) return "–";
    const latest = entries[entries.length - 1];
    const previous = entries[entries.length - 2];
    const daysDiff = differenceInDays(new Date(latest.date), new Date(previous.date));
    if (daysDiff === 0) return "–";
    const gainPerDay = (latest.weightKg - previous.weightKg) / daysDiff;
    return `${(gainPerDay * 1000).toFixed(0)} g/day`;
  };

  const latestWeight = entries.length > 0
    ? entries[entries.length - 1].weightKg.toFixed(2)
    : "–";

  const chartData = entries.map((entry, index) => ({
    index,
    date: format(new Date(entry.date), "MM/dd"),
    weight: entry.weightKg,
    fullDate: format(new Date(entry.date), "MMM d, yyyy"),
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50/30 via-white to-emerald-50/30">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-teal-100 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className={`${playfair.className} text-xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent`}>
            Revochamp
          </h1>
          <span className={`${poppins.className} text-xs text-stone-500`}>
            Newborn Weight Tracker
          </span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 md:py-8">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="inline-flex items-center gap-1.5 bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-xs sm:text-sm font-medium mb-3">
            <span>⚖️</span> Track Growth with Confidence
          </div>
          <h2 className={`${playfair.className} text-2xl sm:text-4xl font-extrabold text-stone-800 leading-tight`}>
            Monitor Your Baby's{" "}
            <span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
              Weight Journey
            </span>
          </h2>
          <p className={`${poppins.className} text-sm sm:text-base text-stone-600 mt-1 max-w-2xl`}>
            Log daily weights and watch your newborn grow with beautiful charts.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6">
          {/* Input Card */}
          <div className="lg:col-span-1 bg-white rounded-2xl shadow-lg border border-teal-100 p-5 sm:p-6">
            <h3 className={`${playfair.className} text-lg font-bold text-stone-800 mb-4 flex items-center gap-2`}>
              <span className="w-7 h-7 bg-teal-100 rounded-full flex items-center justify-center text-teal-600">📝</span>
              Log New Weight
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-stone-500 mb-1">Weight (kg)</label>
                <input
                  type="number"
                  step="0.01"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="e.g., 3.5"
                  className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:bg-white transition text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-500 mb-1">Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  max={format(new Date(), "yyyy-MM-dd")}
                  className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:bg-white transition text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-500 mb-1">Notes (optional)</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g., after feeding"
                  className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:bg-white transition text-sm"
                />
              </div>

              <button
                onClick={addEntry}
                className="w-full py-3 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-semibold rounded-xl shadow-md transition transform hover:scale-[1.01]"
              >
                ➕ Add Entry
              </button>
            </div>
          </div>

          {/* Summary & Chart Area */}
          <div className="lg:col-span-2 space-y-5">
            {/* Summary Stats */}
            <div className="bg-white rounded-2xl shadow-lg border border-teal-100 p-5 sm:p-6">
              <h3 className={`${playfair.className} text-lg font-bold text-stone-800 mb-4 flex items-center gap-2`}>
                <span className="w-7 h-7 bg-teal-100 rounded-full flex items-center justify-center text-teal-600">📊</span>
                Summary
              </h3>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-teal-50/50 rounded-xl">
                  <div className="text-sm text-stone-500">Latest</div>
                  <div className="text-2xl font-bold text-stone-800">{latestWeight} kg</div>
                </div>
                <div className="p-3 bg-teal-50/50 rounded-xl">
                  <div className="text-sm text-stone-500">Gain/day</div>
                  <div className="text-2xl font-bold text-stone-800">{calculateDailyGain()}</div>
                </div>
                <div className="p-3 bg-teal-50/50 rounded-xl">
                  <div className="text-sm text-stone-500">Entries</div>
                  <div className="text-2xl font-bold text-stone-800">{entries.length}</div>
                </div>
              </div>
            </div>

            {/* Chart Card */}
            {entries.length >= 2 && (
              <div className="bg-white rounded-2xl shadow-lg border border-teal-100 p-5 sm:p-6">
                <h3 className={`${playfair.className} text-lg font-bold text-stone-800 mb-4`}>
                  📈 Weight Progress
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 11, fill: "#6b7280" }}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 11, fill: "#6b7280" }}
                        tickLine={false}
                        domain={["auto", "auto"]}
                        tickFormatter={(value) => `${value} kg`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          borderRadius: "12px",
                          border: "1px solid #e5e7eb",
                          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                        }}
                        labelFormatter={(label, payload) => {
                          if (payload && payload[0]) {
                            return payload[0].payload.fullDate;
                          }
                          return label;
                        }}
                        formatter={(value: any) => {
                          // Handle both single values and arrays (recharts may pass array for stacked charts)
                          const val = Array.isArray(value) ? value[0] : value;
                          if (typeof val === "number") {
                            return [`${val.toFixed(2)} kg`, "Weight"];
                          }
                          return [val, "Weight"];
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="weight"
                        stroke="#14b8a6"
                        strokeWidth={2}
                        fill="url(#colorWeight)"
                        dot={{ fill: "#0d9488", strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, fill: "#0f766e" }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Educational Info Card */}
        <div className="mt-6 bg-white rounded-2xl shadow-sm border border-stone-200 p-5 sm:p-6">
          <h3 className={`${playfair.className} text-lg font-bold text-stone-800 mb-3 flex items-center gap-2`}>
            <span>💡</span> Why Track Newborn Weight?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-stone-600">
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-teal-500 mt-1">▹</span>
                <span><strong>First week:</strong> Newborns may lose up to 7–10% of birth weight, but should regain by day 10–14.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-500 mt-1">▹</span>
                <span><strong>Expected gain:</strong> After week 1, babies typically gain 20–30 g/day (150–200 g/week).</span>
              </li>
            </ul>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-teal-500 mt-1">▹</span>
                <span>Tracking ensures baby is feeding well and growing properly.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-500 mt-1">▹</span>
                <span><strong>Call doctor if:</strong> Not regained birth weight by 2 weeks, or consistently gains &lt;20 g/day.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* History Header */}
        <div className="mt-8 flex items-center justify-between">
          <h3 className={`${playfair.className} text-xl font-bold text-stone-800`}>
            📋 Weight History
          </h3>
          {entries.length > 0 && (
            <button
              onClick={clearAllEntries}
              className="text-xs text-stone-500 hover:text-red-500 transition"
            >
              Clear All
            </button>
          )}
        </div>

        {/* History List */}
        <div className="mt-3">
          {entries.length > 0 ? (
            <AnimatePresence>
              <div className="space-y-2">
                {[...entries].reverse().map((entry, idx) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-white rounded-xl p-4 border border-stone-200 shadow-sm flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-xl">
                        ⚖️
                      </div>
                      <div>
                        <p className="font-medium text-stone-800">
                          {entry.weightKg.toFixed(2)} kg
                        </p>
                        <p className="text-xs text-stone-500">
                          {entry.notes} • {format(new Date(entry.date), "MMM d, yyyy")}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteEntry(entry.id)}
                      className="opacity-0 group-hover:opacity-100 text-stone-400 hover:text-red-500 transition"
                    >
                      🗑️
                    </button>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          ) : (
            <div className="bg-white rounded-xl p-8 text-center border border-stone-200">
              <p className="text-stone-400">No weight entries yet. Add your first measurement.</p>
            </div>
          )}
        </div>

        {/* Disclaimer */}
        <div className="mt-6 p-4 bg-stone-50 border border-stone-200 rounded-xl text-center">
          <p className="text-xs text-stone-500">
            ⚠️ This tracker is for informational purposes only. Always consult your pediatrician about your baby's growth.
          </p>
        </div>
      </main>

      <footer className="border-t border-stone-200 py-4 mt-6">
        <div className="max-w-5xl mx-auto px-4 text-center text-xs text-stone-400">
          © {new Date().getFullYear()} Revochamp. Supporting your parenting journey.
        </div>
      </footer>
    </div>
  );
}