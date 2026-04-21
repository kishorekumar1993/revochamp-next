'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Playfair_Display, Poppins } from 'next/font/google';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-playfair',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});

// ----------------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------------
interface KickSession {
  id: string;
  startTime: Date;
  endTime: Date | null;
  kickCount: number;
  status: 'normal' | 'warning' | 'low';
  kickTimestamps: Date[];
  pregnancyWeek: number;
  targetKicks: number;
  durationSeconds: number;
  completed: boolean;
}

interface StoredSession {
  id: string;
  startTime: string;
  endTime: string | null;
  kickCount: number;
  status: 'normal' | 'warning' | 'low';
  kickTimestamps: string[];
  pregnancyWeek: number;
  targetKicks: number;
  durationSeconds: number;
  completed: boolean;
}

interface ActiveSession {
  startTime: string;
  kickCount: number;
  kickTimestamps: string[];
  pregnancyWeek: number;
  targetKicks: number;
  isPaused: boolean;
  pauseTime: string | null;
}

// ----------------------------------------------------------------------------
// Utility Functions
// ----------------------------------------------------------------------------
const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const formatFullDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

const getStatusFromKicks = (
  kickCount: number,
  elapsedSeconds: number,
  target: number
): { status: 'normal' | 'warning' | 'low'; message: string } => {
  const elapsedMinutes = elapsedSeconds / 60;

  // Early warning: less than 5 kicks after 60 minutes
  if (elapsedMinutes >= 60 && kickCount < 5) {
    return {
      status: 'warning',
      message: '⚠️ Movement seems low. Try eating/drinking and lie on your left side.',
    };
  }

  // Completed evaluation
  if (elapsedMinutes >= 120 || kickCount >= target) {
    if (kickCount >= target) {
      return {
        status: 'normal',
        message: '✅ Normal baby movement. Great!',
      };
    } else {
      return {
        status: 'low',
        message: '⚠️ Less than 10 kicks in 2 hours. Contact your healthcare provider.',
      };
    }
  }

  // Still counting
  return {
    status: 'warning',
    message: 'Keep counting...',
  };
};

const getContextMessage = (week: number): string => {
  if (week < 28) return 'Kick counting is usually recommended after 28 weeks.';
  if (week >= 37) return 'Daily monitoring is recommended from 37 weeks.';
  return '';
};

// ----------------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------------
export default function KickCounterPage() {
  // Inputs
  const [pregnancyWeek, setPregnancyWeek] = useState<string>('');
  const [targetKicks, setTargetKicks] = useState<number>(10);
  const [error, setError] = useState<string | null>(null);

  // Counting state
  const [isCounting, setIsCounting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [kickCount, setKickCount] = useState(0);
  const [kickTimestamps, setKickTimestamps] = useState<Date[]>([]);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [pauseTime, setPauseTime] = useState<Date | null>(null);

  // Live feedback
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Results
  const [sessionResult, setSessionResult] = useState<{
    status: 'normal' | 'warning' | 'low';
    message: string;
    timeTaken: string;
  } | null>(null);

  // History & UI
  const [history, setHistory] = useState<KickSession[]>([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [reminderEnabled, setReminderEnabled] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const elapsedIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load history and active session from localStorage
  useEffect(() => {
    setIsClient(true);
    const savedHistory = localStorage.getItem('kick_history');
    if (savedHistory) {
      try {
        const parsed: StoredSession[] = JSON.parse(savedHistory);
        const sessions: KickSession[] = parsed.map((s) => ({
          ...s,
          startTime: new Date(s.startTime),
          endTime: s.endTime ? new Date(s.endTime) : null,
          kickTimestamps: s.kickTimestamps.map((t) => new Date(t)),
        }));
        setHistory(sessions);
      } catch (e) {
        console.warn('Failed to load history');
      }
    }

    const savedActive = localStorage.getItem('kick_active_session');
    if (savedActive) {
      try {
        const active: ActiveSession = JSON.parse(savedActive);
        const start = new Date(active.startTime);
        const now = new Date();
        const diffSeconds = Math.floor((now.getTime() - start.getTime()) / 1000);

        setStartTime(start);
        setKickCount(active.kickCount);
        setKickTimestamps(active.kickTimestamps.map((t) => new Date(t)));
        setPregnancyWeek(active.pregnancyWeek.toString());
        setTargetKicks(active.targetKicks);
        setIsPaused(active.isPaused);
        setPauseTime(active.pauseTime ? new Date(active.pauseTime) : null);

        if (!active.isPaused) {
          setIsCounting(true);
          setElapsedSeconds(diffSeconds);
        } else {
          setIsCounting(true);
          setIsPaused(true);
          setElapsedSeconds(diffSeconds);
        }
      } catch (e) {
        console.warn('Failed to restore active session');
      }
    }
  }, []);

  // Save history
  useEffect(() => {
    if (isClient && history.length > 0) {
      const toStore: StoredSession[] = history.map((s) => ({
        id: s.id,
        startTime: s.startTime.toISOString(),
        endTime: s.endTime?.toISOString() || null,
        kickCount: s.kickCount,
        status: s.status,
        kickTimestamps: s.kickTimestamps.map((t) => t.toISOString()),
        pregnancyWeek: s.pregnancyWeek,
        targetKicks: s.targetKicks,
        durationSeconds: s.durationSeconds,
        completed: s.completed,
      }));
      localStorage.setItem('kick_history', JSON.stringify(toStore));
    }
  }, [history, isClient]);

  // Save active session
  useEffect(() => {
    if (isCounting && startTime) {
      const active: ActiveSession = {
        startTime: startTime.toISOString(),
        kickCount,
        kickTimestamps: kickTimestamps.map((t) => t.toISOString()),
        pregnancyWeek: parseInt(pregnancyWeek) || 0,
        targetKicks,
        isPaused,
        pauseTime: pauseTime?.toISOString() || null,
      };
      localStorage.setItem('kick_active_session', JSON.stringify(active));
    } else {
      localStorage.removeItem('kick_active_session');
    }
  }, [isCounting, startTime, kickCount, kickTimestamps, pregnancyWeek, targetKicks, isPaused, pauseTime]);

  // Timer logic – using actual time difference to avoid drift
  useEffect(() => {
    if (isCounting && !isPaused && startTime) {
      elapsedIntervalRef.current = setInterval(() => {
        const now = new Date();
        const diff = Math.floor((now.getTime() - startTime.getTime()) / 1000);
        setElapsedSeconds(diff);

        // Live feedback based on kick count
        if (kickCount === 5) setFeedbackMessage('👍 Halfway there!');
        else if (kickCount === 8) setFeedbackMessage('🎉 Almost done!');
        else setFeedbackMessage(null);

        // Early warning after 60 min with <5 kicks
        if (diff >= 3600 && kickCount < 5) {
          setFeedbackMessage('⚠️ Movement seems low. Try eating/drinking and lie on your left side.');
        }

        // Auto-stop after 2 hours
        if (diff >= 7200) {
          finishSession();
        }
      }, 1000);
    } else {
      if (elapsedIntervalRef.current) clearInterval(elapsedIntervalRef.current);
    }
    return () => {
      if (elapsedIntervalRef.current) clearInterval(elapsedIntervalRef.current);
    };
  }, [isCounting, isPaused, startTime, kickCount]);

  const finishSession = useCallback(() => {
    if (!startTime) return;
    if (timerRef.current) clearInterval(timerRef.current);
    if (elapsedIntervalRef.current) clearInterval(elapsedIntervalRef.current);

    const endTime = new Date();
    const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
    const evaluation = getStatusFromKicks(kickCount, duration, targetKicks);

    const session: KickSession = {
      id: Date.now().toString(),
      startTime,
      endTime,
      kickCount,
      status: evaluation.status,
      kickTimestamps: [...kickTimestamps],
      pregnancyWeek: parseInt(pregnancyWeek) || 0,
      targetKicks,
      durationSeconds: duration,
      completed: kickCount >= targetKicks,
    };

    setHistory((prev) => [session, ...prev]);
    setSessionResult({
      status: evaluation.status,
      message: evaluation.message,
      timeTaken: formatDuration(duration),
    });

    setIsCounting(false);
    setIsPaused(false);
    setStartTime(null);
    setKickCount(0);
    setKickTimestamps([]);
    setElapsedSeconds(0);
    setPauseTime(null);
    setFeedbackMessage(null);
    localStorage.removeItem('kick_active_session');
  }, [startTime, kickCount, kickTimestamps, pregnancyWeek, targetKicks]);

  const startCounting = () => {
    const week = parseInt(pregnancyWeek);
    if (isNaN(week) || week < 1 || week > 42) {
      setError('Please enter a valid pregnancy week (1-42).');
      return;
    }
    setError(null);
    const now = new Date();
    setIsCounting(true);
    setIsPaused(false);
    setKickCount(0);
    setKickTimestamps([]);
    setStartTime(now);
    setElapsedSeconds(0);
    setSessionResult(null);
    setFeedbackMessage(null);
  };

  const pauseCounting = () => {
    setIsPaused(true);
    setPauseTime(new Date());
  };

  const resumeCounting = () => {
    if (pauseTime && startTime) {
      const pauseDuration = new Date().getTime() - pauseTime.getTime();
      setStartTime(new Date(startTime.getTime() + pauseDuration));
    }
    setIsPaused(false);
    setPauseTime(null);
  };

  const resetCounting = () => {
    if (confirm('Are you sure you want to reset the current session?')) {
      if (timerRef.current) clearInterval(timerRef.current);
      if (elapsedIntervalRef.current) clearInterval(elapsedIntervalRef.current);
      setIsCounting(false);
      setIsPaused(false);
      setKickCount(0);
      setKickTimestamps([]);
      setStartTime(null);
      setElapsedSeconds(0);
      setPauseTime(null);
      setSessionResult(null);
      setFeedbackMessage(null);
      localStorage.removeItem('kick_active_session');
    }
  };

  const addKick = () => {
    if (!isCounting || isPaused) return;
    const newCount = kickCount + 1;
    setKickCount(newCount);
    setKickTimestamps((prev) => [...prev, new Date()]);

    // Check if target reached
    if (newCount >= targetKicks) {
      finishSession();
    }
  };

  const clearHistory = () => {
    if (confirm('Delete all past sessions?')) {
      setHistory([]);
      localStorage.removeItem('kick_history');
    }
  };

  const exportHistory = () => {
    const dataStr = JSON.stringify(history, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'kick-history.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleReminder = () => {
    setReminderEnabled(!reminderEnabled);
    if (!reminderEnabled) {
      if ('Notification' in window && Notification.permission !== 'granted') {
        Notification.requestPermission();
      }
      alert('✅ Daily reminder set. We will remind you at your preferred time (simulated).');
    }
  };

  const formattedElapsed = formatDuration(elapsedSeconds);

  // Chart data with trends
  const getChartData = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d;
    });

    return last7Days.map((day) => {
      const daySessions = history.filter((s) => {
        const sDate = new Date(s.startTime);
        return (
          sDate.getFullYear() === day.getFullYear() &&
          sDate.getMonth() === day.getMonth() &&
          sDate.getDate() === day.getDate()
        );
      });
      const totalKicks = daySessions.reduce((sum, s) => sum + s.kickCount, 0);
      const completedSessions = daySessions.filter((s) => s.completed).length;
      const avgDuration =
        daySessions.length > 0
          ? daySessions.reduce((sum, s) => sum + s.durationSeconds, 0) / daySessions.length
          : 0;

      return {
        date: day,
        label: day.toLocaleDateString('en-US', { weekday: 'short' }),
        kicks: totalKicks,
        sessions: daySessions.length,
        completed: completedSessions,
        avgDuration: Math.round(avgDuration / 60),
      };
    });
  };

  const chartData = getChartData();
  const contextMsg = pregnancyWeek ? getContextMessage(parseInt(pregnancyWeek)) : '';

  // Trend analysis
  const recentSessions = history.slice(0, 6);
  const successRate =
    recentSessions.length > 0
      ? (recentSessions.filter((s) => s.completed).length / recentSessions.length) * 100
      : 0;

  const last3Avg =
    recentSessions.slice(0, 3).reduce((sum, s) => sum + s.kickCount, 0) / 3 || 0;
  const prev3Avg =
    recentSessions.slice(3, 6).reduce((sum, s) => sum + s.kickCount, 0) / 3 || 0;
  const trendDirection = last3Avg < prev3Avg ? 'decreasing' : last3Avg > prev3Avg ? 'increasing' : 'stable';

  return (
    <main
      className={`min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 ${poppins.variable} ${playfair.variable}`}
    >
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center md:text-left"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/60 text-blue-700 text-sm font-medium mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Medically Accurate • Time‑Based Evaluation
          </div>
          <h1
            className={`text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4 leading-tight ${playfair.className}`}
          >
            👣 Baby Kick{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Counter
            </span>
          </h1>
          <p className={`text-lg md:text-xl text-gray-600 max-w-3xl mx-auto md:mx-0 ${poppins.className}`}>
            Count 10 kicks within 2 hours. Get early warnings and trend insights.
          </p>
        </motion.header>

        {contextMsg && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm">
            ℹ️ {contextMsg}
          </div>
        )}

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-1 space-y-6"
          >
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6">
              <h2 className={`text-xl font-bold text-gray-800 mb-4 ${playfair.className}`}>Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-semibold text-gray-700 mb-1 ${poppins.className}`}>
                    🤰 Pregnancy Week
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="42"
                    value={pregnancyWeek}
                    onChange={(e) => setPregnancyWeek(e.target.value)}
                    placeholder="e.g., 32"
                    className={`w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-400 ${poppins.className}`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-semibold text-gray-700 mb-1 ${poppins.className}`}>
                    🎯 Target Kicks (usually 10)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={targetKicks}
                    onChange={(e) => setTargetKicks(parseInt(e.target.value) || 10)}
                    className={`w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-400 ${poppins.className}`}
                  />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <div className="flex items-center justify-between pt-2">
                  <span className={`text-gray-700 ${poppins.className}`}>⏰ Daily Reminder</span>
                  <button
                    onClick={toggleReminder}
                    className={`relative w-12 h-6 rounded-full transition-colors ${reminderEnabled ? 'bg-blue-600' : 'bg-gray-300'}`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${reminderEnabled ? 'translate-x-6' : ''}`}
                    />
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6">
              <h2 className={`text-xl font-bold text-gray-800 mb-4 ${playfair.className}`}>Controls</h2>
              <div className="flex flex-col gap-2">
                {!isCounting ? (
                  <button
                    onClick={startCounting}
                    disabled={!pregnancyWeek}
                    className={`w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    ▶️ Start Counting
                  </button>
                ) : isPaused ? (
                  <button
                    onClick={resumeCounting}
                    className="w-full py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold rounded-xl shadow"
                  >
                    ⏯️ Resume
                  </button>
                ) : (
                  <button
                    onClick={pauseCounting}
                    className="w-full py-3 bg-amber-500 text-white font-semibold rounded-xl shadow"
                  >
                    ⏸️ Pause
                  </button>
                )}
                {isCounting && (
                  <button
                    onClick={resetCounting}
                    className="w-full py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition"
                  >
                    🔄 Reset Session
                  </button>
                )}
              </div>
            </div>

            {/* Trend Summary */}
            {history.length > 0 && (
              <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6">
                <h3 className={`font-bold text-gray-800 mb-3 ${playfair.className}`}>📊 Recent Trend</h3>
                <div className="space-y-2 text-sm">
                  <p>✅ Success rate: {successRate.toFixed(0)}%</p>
                  <p>
                    📈 Kicks trend:{' '}
                    <span
                      className={
                        trendDirection === 'decreasing'
                          ? 'text-amber-600'
                          : trendDirection === 'increasing'
                          ? 'text-green-600'
                          : 'text-gray-600'
                      }
                    >
                      {trendDirection}
                    </span>
                  </p>
                  {trendDirection === 'decreasing' && (
                    <p className="text-amber-600 text-xs mt-1">
                      ⚠️ Movement trend is decreasing. Monitor closely.
                    </p>
                  )}
                </div>
              </div>
            )}
          </motion.div>

          {/* Center: Counter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 md:p-8">
              <div className="flex justify-around mb-6">
                <div className="text-center">
                  <p className={`text-gray-500 ${poppins.className}`}>🦵 Kicks</p>
                  <p className={`text-4xl font-bold text-gray-800 ${poppins.className}`}>
                    {kickCount} / {targetKicks}
                  </p>
                </div>
                <div className="text-center">
                  <p className={`text-gray-500 ${poppins.className}`}>⏱️ Time</p>
                  <p className={`text-4xl font-bold text-gray-800 ${poppins.className}`}>
                    {isCounting ? formattedElapsed : '00:00'}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden mb-6">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((kickCount / targetKicks) * 100, 100)}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {/* Live Feedback */}
              {feedbackMessage && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-800 text-sm text-center">
                  {feedbackMessage}
                </div>
              )}

              {/* Kick Button */}
              <div className="flex justify-center mb-6">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    addKick();
                    if ('vibrate' in navigator) navigator.vibrate(50);
                  }}
                  disabled={!isCounting || isPaused}
                  className={`w-40 h-40 md:w-48 md:h-48 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl font-bold shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all ${poppins.className}`}
                >
                  👣 KICK!
                </motion.button>
              </div>
              <p className={`text-center text-gray-500 ${poppins.className}`}>
                Tap every time you feel a distinct movement
              </p>
            </div>
          </motion.div>
        </div>

        {/* Session Result */}
        <AnimatePresence>
          {sessionResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-6 bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6"
            >
              <h3 className={`text-xl font-bold text-gray-800 mb-4 ${playfair.className}`}>📊 Session Result</h3>
              <div className={`${poppins.className}`}>
                <p>
                  <span className="font-semibold">Time taken:</span> {sessionResult.timeTaken}
                </p>
                <p className="mt-2">
                  <span className="font-semibold">Evaluation:</span> {sessionResult.message}
                </p>
                {sessionResult.status === 'low' && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800">
                    Please contact your healthcare provider if you haven't already.
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chart & History */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6"
          >
            <h3 className={`text-xl font-bold text-gray-800 mb-4 ${playfair.className}`}>📈 Weekly Overview</h3>
            {history.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="kicks" fill="#3b82f6" name="Total Kicks" radius={[4, 4, 0, 0]} />
                    <Bar yAxisId="right" dataKey="completed" fill="#10b981" name="Completed Sessions" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No data yet</p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className={`text-xl font-bold text-gray-800 ${playfair.className}`}>📋 Recent Sessions</h3>
              <div className="flex gap-2">
                <button onClick={exportHistory} className="text-sm text-blue-600 hover:underline">
                  Export
                </button>
                <button onClick={() => setShowHistoryModal(true)} className="text-sm text-blue-600 hover:underline">
                  View All
                </button>
                {history.length > 0 && (
                  <button onClick={clearHistory} className="text-sm text-red-500 hover:underline">
                    Clear
                  </button>
                )}
              </div>
            </div>
            {history.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No sessions yet</p>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {history.slice(0, 3).map((session) => (
                  <div
                    key={session.id}
                    className="p-3 rounded-xl border border-gray-100 bg-white/50 flex items-center gap-3"
                  >
                    <div
                      className={`w-3 h-3 rounded-full ${
                        session.status === 'normal'
                          ? 'bg-green-500'
                          : session.status === 'warning'
                          ? 'bg-amber-500'
                          : 'bg-red-500'
                      }`}
                    />
                    <div className="flex-1">
                      <p className={`font-semibold ${poppins.className}`}>{formatDate(session.startTime)}</p>
                      <p className={`text-sm text-gray-500 ${poppins.className}`}>
                        {session.kickCount} kicks • {formatDuration(session.durationSeconds)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 p-5 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200 text-center"
        >
          <p className={`text-sm text-gray-600 italic ${poppins.className}`}>
            ⚠️ This tool follows medical guidelines (10 kicks within 2 hours). Always contact your healthcare provider if you're concerned about reduced fetal movement.
          </p>
        </motion.div>

        {/* History Modal */}
        <AnimatePresence>
          {showHistoryModal && (
            <HistoryModal
              history={history}
              onClose={() => setShowHistoryModal(false)}
              onClear={clearHistory}
              onExport={exportHistory}
            />
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

// ----------------------------------------------------------------------------
// History Modal Component
// ----------------------------------------------------------------------------
function HistoryModal({
  history,
  onClose,
  onClear,
  onExport,
}: {
  history: KickSession[];
  onClose: () => void;
  onClear: () => void;
  onExport: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className={`text-2xl font-bold text-gray-800 ${playfair.className}`}>📋 Full History</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">
            ✕
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {history.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No sessions recorded</p>
          ) : (
            <div className="space-y-4">
              {history.map((session) => (
                <div key={session.id} className="p-4 rounded-xl border border-gray-200">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-4 h-4 rounded-full mt-1 ${
                        session.status === 'normal'
                          ? 'bg-green-500'
                          : session.status === 'warning'
                          ? 'bg-amber-500'
                          : 'bg-red-500'
                      }`}
                    />
                    <div className="flex-1">
                      <p className={`font-semibold text-lg ${poppins.className}`}>
                        {formatFullDate(session.startTime)} (Week {session.pregnancyWeek})
                      </p>
                      <p className={`text-gray-600 ${poppins.className}`}>
                        Started: {formatTime(session.startTime)} • {session.kickCount} kicks •{' '}
                        {formatDuration(session.durationSeconds)}
                      </p>
                      <p className={`text-sm ${poppins.className}`}>
                        Target: {session.targetKicks} • Completed: {session.completed ? 'Yes' : 'No'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="p-4 border-t border-gray-200 flex justify-end gap-3">
          <button onClick={onExport} className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
            Export JSON
          </button>
          {history.length > 0 && (
            <button onClick={onClear} className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition">
              Clear All
            </button>
          )}
          <button onClick={onClose} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}