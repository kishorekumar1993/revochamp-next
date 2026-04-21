"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Playfair_Display, Poppins } from "next/font/google";

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
type DiaperType = "wet" | "dirty" | "both";

interface DiaperLog {
  id: string;
  timestamp: string; // ISO string
  type: DiaperType;
  notes: string;
}

// ----------------------------------------------------------------------------
// Utility functions
// ----------------------------------------------------------------------------
const typeEmoji = (type: DiaperType): string => {
  switch (type) {
    case "wet": return "💧";
    case "dirty": return "💩";
    case "both": return "💧💩";
  }
};

const typeName = (type: DiaperType): string => {
  switch (type) {
    case "wet": return "Wet";
    case "dirty": return "Dirty";
    case "both": return "Both";
  }
};

const STORAGE_KEY = "diaper_logs";

// ----------------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------------
export default function DiaperTracker() {
  const [logs, setLogs] = useState<DiaperLog[]>([]);
  const [notes, setNotes] = useState("");

  // Load logs from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setLogs(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load logs:", e);
    }
  }, []);

  // Save logs to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
    } catch (e) {
      console.error("Failed to save logs:", e);
    }
  }, [logs]);

  const addLog = (type: DiaperType) => {
    const newLog: DiaperLog = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      type,
      notes: notes.trim() || "No notes",
    };
    setLogs(prev => [newLog, ...prev]);
    setNotes("");
  };

  const clearHistory = () => {
    if (window.confirm("Are you sure you want to delete all diaper logs?")) {
      setLogs([]);
    }
  };

  // Daily summary
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    logDate.setHours(0, 0, 0, 0);
    return logDate.getTime() === today.getTime();
  });

  const todayCount = todayLogs.length;
  const wetCount = todayLogs.filter(l => l.type === "wet").length;
  const dirtyCount = todayLogs.filter(l => l.type === "dirty").length;
  const bothCount = todayLogs.filter(l => l.type === "both").length;

  // Recent logs (max 5)
  const recentLogs = logs.slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/30 via-white to-orange-50/30">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-amber-100 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className={`${playfair.className} text-xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent`}>
            Revochamp
          </h1>
          <span className={`${poppins.className} text-xs text-stone-500`}>
            Diaper Tracker
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
          <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs sm:text-sm font-medium mb-3">
            <span>🧷</span> Simple & Private
          </div>
          <h2 className={`${playfair.className} text-2xl sm:text-4xl font-extrabold text-stone-800 leading-tight`}>
            Track Your Baby's{" "}
            <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              Diaper Changes
            </span>
          </h2>
          <p className={`${poppins.className} text-sm sm:text-base text-stone-600 mt-1 max-w-2xl`}>
            Log wet and dirty diapers to monitor hydration and digestion. One tap to track.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6">
          {/* Input Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-5 sm:p-6">
            <h3 className={`${playfair.className} text-lg font-bold text-stone-800 mb-4 flex items-center gap-2`}>
              <span className="w-7 h-7 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">📝</span>
              Log a Diaper Change
            </h3>

            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              <button
                onClick={() => addLog("wet")}
                className="py-3 rounded-xl bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-medium shadow-md transition transform hover:scale-[1.02]"
              >
                <span className="text-xl block">💧</span>
                <span className="text-sm">Wet</span>
              </button>
              <button
                onClick={() => addLog("dirty")}
                className="py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium shadow-md transition transform hover:scale-[1.02]"
              >
                <span className="text-xl block">💩</span>
                <span className="text-sm">Dirty</span>
              </button>
              <button
                onClick={() => addLog("both")}
                className="py-3 rounded-xl bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-500 hover:to-pink-600 text-white font-medium shadow-md transition transform hover:scale-[1.02]"
              >
                <span className="text-xl block">💧💩</span>
                <span className="text-sm">Both</span>
              </button>
            </div>

            {/* Notes Input */}
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1">Notes (optional)</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g., unusual color, time of day"
                className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:bg-white transition text-sm"
              />
            </div>
          </div>

          {/* Summary Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-5 sm:p-6">
            <h3 className={`${playfair.className} text-lg font-bold text-stone-800 mb-4 flex items-center gap-2`}>
              <span className="w-7 h-7 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">📊</span>
              Today's Summary
            </h3>

            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="p-3 bg-blue-50/50 rounded-xl text-center">
                <div className="text-2xl mb-1">💧</div>
                <div className="text-2xl font-bold text-stone-800">{wetCount}</div>
                <div className="text-xs text-stone-500">Wet</div>
              </div>
              <div className="p-3 bg-amber-50/50 rounded-xl text-center">
                <div className="text-2xl mb-1">💩</div>
                <div className="text-2xl font-bold text-stone-800">{dirtyCount}</div>
                <div className="text-xs text-stone-500">Dirty</div>
              </div>
              <div className="p-3 bg-purple-50/50 rounded-xl text-center">
                <div className="text-2xl mb-1">💧💩</div>
                <div className="text-2xl font-bold text-stone-800">{bothCount}</div>
                <div className="text-xs text-stone-500">Both</div>
              </div>
            </div>

            <div className="pt-3 border-t border-amber-100 text-center">
              <div className="inline-block px-6 py-2 bg-amber-50 rounded-full">
                <span className="text-sm text-stone-600">Total Changes: </span>
                <span className="text-xl font-bold text-amber-700">{todayCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Educational Info Card */}
        <div className="mt-6 bg-white rounded-2xl shadow-sm border border-stone-200 p-5 sm:p-6">
          <h3 className={`${playfair.className} text-lg font-bold text-stone-800 mb-3 flex items-center gap-2`}>
            <span>💡</span> Why Track Diapers?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-stone-600">
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-1">▹</span>
                <span><strong>Wet diapers:</strong> Show hydration. Newborns should have 4–6+ wet diapers daily after week 1.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-1">▹</span>
                <span><strong>Dirty diapers:</strong> Indicate digestion. Meconium transitions to yellow/seedy by day 4–5.</span>
              </li>
            </ul>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-1">▹</span>
                <span><strong>Changes matter:</strong> Frequency, color, consistency changes can signal issues.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-1">▹</span>
                <span><strong>Call doctor if:</strong> Fewer than 4 wet diapers/24h, blood in stool, extreme fussiness.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* History Header */}
        <div className="mt-8 flex items-center justify-between">
          <h3 className={`${playfair.className} text-xl font-bold text-stone-800`}>
            📋 Recent Changes
          </h3>
          {logs.length > 0 && (
            <button
              onClick={clearHistory}
              className="text-xs text-stone-500 hover:text-red-500 transition"
            >
              Clear History
            </button>
          )}
        </div>

        {/* History List */}
        <div className="mt-3">
          {recentLogs.length > 0 ? (
            <AnimatePresence>
              <div className="space-y-2">
                {recentLogs.map((log, idx) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-white rounded-xl p-4 border border-stone-200 shadow-sm flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-xl">
                        {typeEmoji(log.type)}
                      </div>
                      <div>
                        <p className="font-medium text-stone-800">
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                        </p>
                        <p className="text-xs text-stone-500">
                          {typeName(log.type)} • {log.notes}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-stone-400">
                      {new Date(log.timestamp).toLocaleDateString([], { month: "short", day: "numeric" })}
                    </span>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          ) : (
            <div className="bg-white rounded-xl p-8 text-center border border-stone-200">
              <p className="text-stone-400">No diaper changes logged yet. Tap a button above to log.</p>
            </div>
          )}
        </div>

        {/* Disclaimer */}
        <div className="mt-6 p-4 bg-stone-50 border border-stone-200 rounded-xl text-center">
          <p className="text-xs text-stone-500">
            ⚠️ This tracker is for informational purposes only. Consult your pediatrician if you have concerns about your baby's diaper output.
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