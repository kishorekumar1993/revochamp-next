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
type BreastSide = "left" | "right" | "both";

interface FeedingSession {
  id: string;
  startTime: string; // ISO string
  endTime: string;   // ISO string
  side: BreastSide;
  notes: string;
  duration: number;  // in seconds
}

// ----------------------------------------------------------------------------
// Utility functions
// ----------------------------------------------------------------------------
const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}m ${secs}s`;
};

const formatElapsed = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

const STORAGE_KEY = "breastfeeding_sessions";

// ----------------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------------
export default function BreastfeedingTracker() {
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [selectedSide, setSelectedSide] = useState<BreastSide>("left");
  const [notes, setNotes] = useState("");
  const [sessions, setSessions] = useState<FeedingSession[]>([]);
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load sessions from localStorage
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

  // Save sessions to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    } catch (e) {
      console.error("Failed to save sessions:", e);
    }
  }, [sessions]);

  // Timer logic
  useEffect(() => {
    if (isRunning && startTime) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds(Math.floor((new Date().getTime() - startTime.getTime()) / 1000));
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
  }, [isRunning, startTime]);

  const startTimer = () => {
    setStartTime(new Date());
    setIsRunning(true);
    setElapsedSeconds(0);
  };

  const stopTimer = () => {
    if (!startTime) return;
    setShowNotesModal(true);
  };

  const saveSession = (sessionNotes: string) => {
    if (!startTime) return;
    const endTime = new Date();
    const durationSeconds = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);

    const newSession: FeedingSession = {
      id: Date.now().toString(),
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      side: selectedSide,
      notes: sessionNotes.trim() || "No notes",
      duration: durationSeconds,
    };

    setSessions(prev => [newSession, ...prev]);
    setIsRunning(false);
    setStartTime(null);
    setElapsedSeconds(0);
    setNotes("");
    setShowNotesModal(false);
  };

  const clearHistory = () => {
    if (window.confirm("Are you sure you want to delete all feeding sessions?")) {
      setSessions([]);
    }
  };

  const toggleReminder = () => {
    setReminderEnabled(!reminderEnabled);
    if (!reminderEnabled) {
      alert("✅ Reminder set (simulated). You will be notified every 2-3 hours.");
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

  // Side counts
  const leftCount = todaySessions.filter(s => s.side === "left").length;
  const rightCount = todaySessions.filter(s => s.side === "right").length;
  const bothCount = todaySessions.filter(s => s.side === "both").length;

  // Recent sessions (max 5)
  const recentSessions = sessions.slice(0, 5);

  const sideName = (side: BreastSide): string => {
    switch (side) {
      case "left": return "Left";
      case "right": return "Right";
      case "both": return "Both";
    }
  };

  const sideEmoji = (side: BreastSide): string => {
    switch (side) {
      case "left": return "👈";
      case "right": return "👉";
      case "both": return "🤱";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50/30 via-white to-purple-50/30">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-pink-100 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className={`${playfair.className} text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent`}>
            Revochamp
          </h1>
          <span className={`${poppins.className} text-xs text-stone-500`}>
            Breastfeeding Tracker
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
          <div className="inline-flex items-center gap-1.5 bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-xs sm:text-sm font-medium mb-3">
            <span>🤱</span> Nursing Made Simple
          </div>
          <h2 className={`${playfair.className} text-2xl sm:text-4xl font-extrabold text-stone-800 leading-tight`}>
            Track Your Baby's{" "}
            <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Feeding Journey
            </span>
          </h2>
          <p className={`${poppins.className} text-sm sm:text-base text-stone-600 mt-1 max-w-2xl`}>
            Log nursing sessions, track sides, and monitor patterns. Simple timer for breastfeeding moms.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6">
          {/* Timer Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-pink-100 p-5 sm:p-6">
            {/* Side Selection */}
            <div className="flex gap-2 mb-5">
              {(["left", "right", "both"] as BreastSide[]).map((side) => (
                <button
                  key={side}
                  onClick={() => setSelectedSide(side)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition ${
                    selectedSide === side
                      ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-sm"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  }`}
                  disabled={isRunning}
                >
                  {sideEmoji(side)} {sideName(side)}
                </button>
              ))}
            </div>

            {/* Timer Display */}
            <div className="bg-pink-50/50 rounded-3xl p-6 text-center mb-4">
              <motion.div
                key={elapsedSeconds}
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className={`${playfair.className} text-5xl sm:text-6xl font-bold text-stone-800 mb-2`}
              >
                {isRunning ? formatElapsed(elapsedSeconds) : "00:00"}
              </motion.div>
              <p className={`${poppins.className} text-sm text-stone-500`}>
                {isRunning ? "Feeding in progress..." : "Ready to start"}
              </p>
            </div>

            {/* Start/Stop Button */}
            <button
              onClick={isRunning ? stopTimer : startTimer}
              className={`w-full py-3 rounded-xl font-semibold text-white shadow-md transition-all transform hover:scale-[1.01] ${
                isRunning
                  ? "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                  : "bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
              }`}
            >
              {isRunning ? "⏹️ Stop Feeding" : "▶️ Start Feeding"}
            </button>
          </div>

          {/* Daily Summary Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-pink-100 p-5 sm:p-6">
            <h3 className={`${playfair.className} text-lg font-bold text-stone-800 mb-4 flex items-center gap-2`}>
              <span className="w-7 h-7 bg-pink-100 rounded-full flex items-center justify-center text-pink-600">📊</span>
              Today's Summary
            </h3>

            {/* Top stats */}
            <div className="grid grid-cols-3 gap-2 text-center mb-4">
              <div className="p-3 bg-pink-50/50 rounded-xl">
                <div className="text-2xl mb-1">🍼</div>
                <div className="text-2xl font-bold text-stone-800">{todayCount}</div>
                <div className="text-xs text-stone-500">Feeds</div>
              </div>
              <div className="p-3 bg-pink-50/50 rounded-xl">
                <div className="text-2xl mb-1">⏱️</div>
                <div className="text-xl font-bold text-stone-800">{formatDuration(todayTotalSeconds)}</div>
                <div className="text-xs text-stone-500">Total</div>
              </div>
              <div className="p-3 bg-pink-50/50 rounded-xl">
                <div className="text-2xl mb-1">⚖️</div>
                <div className="text-xl font-bold text-stone-800">{formatDuration(todayAverageSeconds)}</div>
                <div className="text-xs text-stone-500">Average</div>
              </div>
            </div>

            {/* Side breakdown */}
            <div className="grid grid-cols-3 gap-2 text-center pt-3 border-t border-pink-100">
              <div>
                <div className="text-lg">👈</div>
                <div className="text-lg font-semibold text-stone-800">{leftCount}</div>
                <div className="text-[10px] text-stone-400">Left</div>
              </div>
              <div>
                <div className="text-lg">👉</div>
                <div className="text-lg font-semibold text-stone-800">{rightCount}</div>
                <div className="text-[10px] text-stone-400">Right</div>
              </div>
              <div>
                <div className="text-lg">🤱</div>
                <div className="text-lg font-semibold text-stone-800">{bothCount}</div>
                <div className="text-[10px] text-stone-400">Both</div>
              </div>
            </div>
          </div>
        </div>

        {/* Reminder Card */}
        <div className="mt-5 bg-white rounded-2xl shadow-sm border border-stone-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 text-lg">
              ⏰
            </div>
            <span className={`${poppins.className} font-medium text-stone-700`}>Feeding Reminder</span>
          </div>
          <button
            onClick={toggleReminder}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              reminderEnabled ? "bg-pink-500" : "bg-stone-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                reminderEnabled ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* History Header */}
        <div className="mt-8 flex items-center justify-between">
          <h3 className={`${playfair.className} text-xl font-bold text-stone-800`}>
            📋 Recent Sessions
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
                    className="bg-white rounded-xl p-4 border border-stone-200 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center text-xl">
                        {sideEmoji(session.side)}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-stone-800">
                          {new Date(session.startTime).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                        </p>
                        <p className="text-xs text-stone-500">
                          {formatDuration(session.duration)} • {sideName(session.side)} • {session.notes}
                        </p>
                      </div>
                      <span className="text-xs text-stone-400">
                        {new Date(session.startTime).toLocaleDateString([], { month: "short", day: "numeric" })}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          ) : (
            <div className="bg-white rounded-xl p-8 text-center border border-stone-200">
              <p className="text-stone-400">No feeding sessions yet. Start a session to track.</p>
            </div>
          )}
        </div>

        {/* Educational Info */}
        <div className="mt-6 bg-white rounded-2xl shadow-sm border border-stone-200 p-5 sm:p-6">
          <h3 className={`${playfair.className} text-lg font-bold text-stone-800 mb-3 flex items-center gap-2`}>
            <span>💡</span> Breastfeeding Tips
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-stone-600">
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-pink-500 mt-1">▹</span>
                <span><strong>Newborns:</strong> Feed every 2-3 hours (8-12 times per day).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pink-500 mt-1">▹</span>
                <span><strong>Alternate sides:</strong> Start with the breast you ended on last time.</span>
              </li>
            </ul>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-pink-500 mt-1">▹</span>
                <span><strong>Feeding cues:</strong> Rooting, sucking motions, hands to mouth.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pink-500 mt-1">▹</span>
                <span><strong>Consult LC if:</strong> Pain persists, poor weight gain, or latch issues.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 p-4 bg-stone-50 border border-stone-200 rounded-xl text-center">
          <p className="text-xs text-stone-500">
            ⚠️ This tracker is for informational purposes only. Consult your doctor or lactation consultant if you have concerns about feeding.
          </p>
        </div>
      </main>

      {/* Notes Modal */}
      <AnimatePresence>
        {showNotesModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowNotesModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className={`${playfair.className} text-xl font-bold text-stone-800 mb-3`}>
                Add Notes (Optional)
              </h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g., baby seemed hungry, good latch"
                className="w-full p-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-pink-500 text-sm mb-4"
                rows={3}
                autoFocus
              />
              <div className="flex gap-3">
                <button
                  onClick={() => saveSession("")}
                  className="flex-1 py-2.5 rounded-xl bg-stone-100 text-stone-600 font-medium hover:bg-stone-200 transition"
                >
                  Skip
                </button>
                <button
                  onClick={() => saveSession(notes)}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium hover:from-pink-600 hover:to-purple-600 transition"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="border-t border-stone-200 py-4 mt-6">
        <div className="max-w-5xl mx-auto px-4 text-center text-xs text-stone-400">
          © {new Date().getFullYear()} Revochamp. Supporting your breastfeeding journey.
        </div>
      </footer>
    </div>
  );
}