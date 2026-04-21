"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
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
interface SleepSession {
  id: string;
  startTime: string; // ISO string
  endTime: string;   // ISO string
  notes: string;
  duration: number;  // in seconds
}

// ----------------------------------------------------------------------------
// Utility functions
// ----------------------------------------------------------------------------
const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

const formatElapsed = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (hours > 0) {
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

const STORAGE_KEY = "baby_sleep_sessions";

// ----------------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------------
export default function BabySleepTracker() {
  const [isSleeping, setIsSleeping] = useState(false);
  const [sleepStartTime, setSleepStartTime] = useState<Date | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [notes, setNotes] = useState("");
  const [sessions, setSessions] = useState<SleepSession[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load sessions from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSessions(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load sessions:", e);
    }
  }, []);

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    } catch (e) {
      console.error("Failed to save sessions:", e);
    }
  }, [sessions]);

  // Timer logic
  useEffect(() => {
    if (isSleeping && sleepStartTime) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds(Math.floor((new Date().getTime() - sleepStartTime.getTime()) / 1000));
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isSleeping, sleepStartTime]);

  const startSleep = () => {
    const now = new Date();
    setSleepStartTime(now);
    setIsSleeping(true);
    setElapsedSeconds(0);
  };

  const stopSleep = () => {
    if (!sleepStartTime) return;
    const endTime = new Date();
    const durationSeconds = Math.floor((endTime.getTime() - sleepStartTime.getTime()) / 1000);

    const newSession: SleepSession = {
      id: Date.now().toString(),
      startTime: sleepStartTime.toISOString(),
      endTime: endTime.toISOString(),
      notes: notes.trim() || "No notes",
      duration: durationSeconds,
    };

    setSessions(prev => [newSession, ...prev]);
    setIsSleeping(false);
    setSleepStartTime(null);
    setElapsedSeconds(0);
    setNotes("");
  };

  const clearHistory = () => {
    if (window.confirm("Are you sure you want to delete all sleep sessions?")) {
      setSessions([]);
    }
  };

  // Daily summary calculations
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todaySessions = sessions.filter(s => {
    const sessionDate = new Date(s.startTime);
    sessionDate.setHours(0, 0, 0, 0);
    return sessionDate.getTime() === today.getTime();
  });

  const todayCount = todaySessions.length;
  const todayTotalSeconds = todaySessions.reduce((sum, s) => sum + s.duration, 0);
  const todayAverageSeconds = todayCount > 0 ? Math.round(todayTotalSeconds / todayCount) : 0;

  // Recent sessions (max 5)
  const recentSessions = sessions.slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/30 via-white to-blue-50/30">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-purple-100 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className={`${playfair.className} text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent`}>
            Revochamp
          </h1>
          <span className={`${poppins.className} text-xs text-stone-500`}>
            Baby Sleep Tracker
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
          <div className="inline-flex items-center gap-1.5 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs sm:text-sm font-medium mb-3">
            <span>😴</span> Sleep Tracking Made Simple
          </div>
          <h2 className={`${playfair.className} text-2xl sm:text-4xl font-extrabold text-stone-800 leading-tight`}>
            Track Your Baby's{" "}
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Sleep Patterns
            </span>
          </h2>
          <p className={`${poppins.className} text-sm sm:text-base text-stone-600 mt-1 max-w-2xl`}>
            Log naps and night sleep with a simple timer. Understand your baby's rhythm.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6">
          {/* Timer Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-5 sm:p-6">
            <div className="bg-purple-50/50 rounded-3xl p-6 text-center">
              <motion.div
                key={elapsedSeconds}
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className={`${playfair.className} text-5xl sm:text-6xl font-bold text-stone-800 mb-2`}
              >
                {isSleeping ? formatElapsed(elapsedSeconds) : "00:00"}
              </motion.div>
              <p className={`${poppins.className} text-sm text-stone-500 mb-4`}>
                {isSleeping ? "Sleeping..." : "Ready to start"}
              </p>

              {/* Notes input */}
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="📝 Notes (optional) – e.g., dream feed"
                className="w-full p-3 bg-white border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 text-sm mb-4"
                disabled={isSleeping}
              />

              {/* Start/Stop Button */}
              <button
                onClick={isSleeping ? stopSleep : startSleep}
                className={`w-full py-3 rounded-xl font-semibold text-white shadow-md transition-all transform hover:scale-[1.01] ${
                  isSleeping
                    ? "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                    : "bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
                }`}
              >
                {isSleeping ? "⏹️ Stop Sleep" : "😴 Start Sleep"}
              </button>
            </div>
          </div>

          {/* Daily Summary Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-5 sm:p-6">
            <h3 className={`${playfair.className} text-lg font-bold text-stone-800 mb-4 flex items-center gap-2`}>
              <span className="w-7 h-7 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">📊</span>
              Today's Summary
            </h3>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-3 bg-purple-50/50 rounded-xl">
                <div className="text-2xl mb-1">😴</div>
                <div className="text-2xl font-bold text-stone-800">{todayCount}</div>
                <div className="text-xs text-stone-500">Naps</div>
              </div>
              <div className="p-3 bg-purple-50/50 rounded-xl">
                <div className="text-2xl mb-1">⏱️</div>
                <div className="text-xl font-bold text-stone-800">{formatDuration(todayTotalSeconds)}</div>
                <div className="text-xs text-stone-500">Total</div>
              </div>
              <div className="p-3 bg-purple-50/50 rounded-xl">
                <div className="text-2xl mb-1">⚖️</div>
                <div className="text-xl font-bold text-stone-800">{formatDuration(todayAverageSeconds)}</div>
                <div className="text-xs text-stone-500">Average</div>
              </div>
            </div>
          </div>
        </div>

        {/* Educational Info Card */}
        <div className="mt-6 bg-white rounded-2xl shadow-sm border border-stone-200 p-5 sm:p-6">
          <h3 className={`${playfair.className} text-lg font-bold text-stone-800 mb-3 flex items-center gap-2`}>
            <span>💡</span> Why Track Baby Sleep?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-stone-600">
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">▹</span>
                <span><strong>Newborns (0–3 months):</strong> 14–17 hours total, short bursts.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">▹</span>
                <span><strong>Infants (4–11 months):</strong> 12–15 hours, longer night sleep, 2–3 naps.</span>
              </li>
            </ul>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">▹</span>
                <span>Tracking reveals natural rhythms and growth spurts.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">▹</span>
                <span><strong>Call pediatrician if:</strong> extreme difficulty waking, excessive fussiness.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* History Header */}
        <div className="mt-8 flex items-center justify-between">
          <h3 className={`${playfair.className} text-xl font-bold text-stone-800`}>
            📋 Recent Sleep Sessions
          </h3>
          {sessions.length > 0 && (
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
          {recentSessions.length > 0 ? (
            <AnimatePresence>
              <div className="space-y-2">
                {recentSessions.map((session, idx) => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-white rounded-xl p-4 border border-stone-200 shadow-sm flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-xl">
                        😴
                      </div>
                      <div>
                        <p className="font-medium text-stone-800">
                          {new Date(session.startTime).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                        </p>
                        <p className="text-xs text-stone-500">
                          {formatDuration(session.duration)} • {session.notes}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-stone-400">
                      {new Date(session.startTime).toLocaleDateString([], { month: "short", day: "numeric" })}
                    </span>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          ) : (
            <div className="bg-white rounded-xl p-8 text-center border border-stone-200">
              <p className="text-stone-400">No sleep sessions yet. Start a session to track.</p>
            </div>
          )}
        </div>

        {/* Disclaimer */}
        <div className="mt-6 p-4 bg-stone-50 border border-stone-200 rounded-xl text-center">
          <p className="text-xs text-stone-500">
            ⚠️ This tracker is for informational purposes only. Sleep needs vary by baby. Consult your pediatrician if you have concerns.
          </p>
        </div>
      </main>

      <footer className="border-t border-stone-200 py-4 mt-6">
        <div className="max-w-5xl mx-auto px-4 text-center text-xs text-stone-400">
          © {new Date().getFullYear()} Revochamp. Helping parents track what matters.
        </div>
      </footer>
    </div>
  );
}