// app/tools/password-strength/PasswordStrengthClient.tsx
"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Playfair_Display, Poppins } from 'next/font/google';
import Link from 'next/link';
import {
  Lock,
  Eye,
  EyeOff,
  Copy,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Zap,
  Clock,
  RefreshCw,
  Trash2,
  History,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '700', '800'] });
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });

interface StrengthResult {
  score: number; // 0-100
  label: string;
  color: string;
  gradient: string;
  icon: React.ReactNode;
  entropy: number;
  crackTime: string;
  crackTimeDisplay: string;
}

interface Requirements {
  length: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  symbol: boolean;
}

interface HistoryEntry {
  password: string;
  strength: number;
  timestamp: Date;
}

function calculateEntropy(password: string): number {
  if (!password) return 0;
  let poolSize = 0;
  if (/[a-z]/.test(password)) poolSize += 26;
  if (/[A-Z]/.test(password)) poolSize += 26;
  if (/[0-9]/.test(password)) poolSize += 10;
  if (/[^a-zA-Z0-9]/.test(password)) poolSize += 33;
  return Math.log2(Math.pow(poolSize, password.length));
}

function estimateCrackTime(entropy: number): { seconds: number; display: string } {
  const guessesPerSecond = 1e9;
  const guessesNeeded = Math.pow(2, entropy - 1);
  const seconds = guessesNeeded / guessesPerSecond;
  
  if (seconds < 1) return { seconds, display: 'Instantly' };
  if (seconds < 60) return { seconds, display: `${Math.round(seconds)}s` };
  if (seconds < 3600) return { seconds, display: `${Math.round(seconds / 60)}m` };
  if (seconds < 86400) return { seconds, display: `${Math.round(seconds / 3600)}h` };
  if (seconds < 31536000) return { seconds, display: `${Math.round(seconds / 86400)}d` };
  if (seconds < 31536000 * 100) return { seconds, display: `${Math.round(seconds / 31536000)}y` };
  if (seconds < 31536000 * 1000000) return { seconds, display: `${Math.round(seconds / 31536000 / 1000)}K yrs` };
  return { seconds, display: `${Math.round(seconds / 31536000 / 1000000)}M yrs` };
}

export default function PasswordStrengthClient() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('pwd-strength-history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setHistory(parsed.map((item: any) => ({ ...item, timestamp: new Date(item.timestamp) })));
      } catch (e) {}
    }
  }, []);

  const addToHistory = useCallback((pwd: string, strengthScore: number) => {
    if (!pwd) return;
    const newEntry: HistoryEntry = { password: pwd, strength: strengthScore, timestamp: new Date() };
    const updated = [newEntry, ...history.filter(h => h.password !== pwd)].slice(0, 10);
    setHistory(updated);
    localStorage.setItem('pwd-strength-history', JSON.stringify(updated));
  }, [history]);

  const requirements = useMemo<Requirements>(() => ({
    length: password.length >= 12,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    symbol: /[^a-zA-Z0-9]/.test(password),
  }), [password]);

  const strength = useMemo<StrengthResult>(() => {
    if (!password) {
      return {
        score: 0,
        label: 'No Password',
        color: 'text-slate-400',
        gradient: 'from-slate-400 to-slate-500',
        icon: <Shield size={24} className="text-slate-400" />,
        entropy: 0,
        crackTime: '',
        crackTimeDisplay: '',
      };
    }

    const entropy = calculateEntropy(password);
    const { seconds, display: crackTimeDisplay } = estimateCrackTime(entropy);
    
    let score = 0;
    if (entropy < 30) score = 20;
    else if (entropy < 50) score = 40;
    else if (entropy < 70) score = 60;
    else if (entropy < 90) score = 80;
    else score = 100;

    const reqsMet = Object.values(requirements).filter(Boolean).length;
    if (reqsMet < 3) score = Math.min(score, 30);
    if (reqsMet === 3) score = Math.min(score, 60);
    if (!requirements.length) score = Math.min(score, 40);

    const configs = {
      0: { label: 'Very Weak', color: 'text-red-600', gradient: 'from-red-500 to-orange-500', icon: <ShieldAlert size={24} className="text-red-500" /> },
      20: { label: 'Weak', color: 'text-orange-600', gradient: 'from-orange-500 to-amber-500', icon: <ShieldAlert size={24} className="text-orange-500" /> },
      40: { label: 'Fair', color: 'text-yellow-600', gradient: 'from-yellow-500 to-amber-500', icon: <AlertCircle size={24} className="text-yellow-500" /> },
      60: { label: 'Good', color: 'text-blue-600', gradient: 'from-blue-500 to-cyan-500', icon: <ShieldCheck size={24} className="text-blue-500" /> },
      80: { label: 'Strong', color: 'text-green-600', gradient: 'from-green-500 to-emerald-500', icon: <ShieldCheck size={24} className="text-green-500" /> },
      100: { label: 'Excellent', color: 'text-emerald-600', gradient: 'from-emerald-500 to-teal-500', icon: <ShieldCheck size={24} className="text-emerald-500" /> },
    };
    
    const roundedScore = Math.round(score / 20) * 20;
    return {
      score,
      ...configs[roundedScore as keyof typeof configs],
      entropy,
      crackTime: seconds.toFixed(2),
      crackTimeDisplay,
    };
  }, [password, requirements]);

  const handleCopy = async () => {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {}
  };

  const handleClear = () => setPassword('');

  const handleSuggest = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    let pwd = '';
    const array = new Uint32Array(16);
    crypto.getRandomValues(array);
    for (let i = 0; i < 16; i++) {
      pwd += chars[array[i] % chars.length];
    }
    setPassword(pwd);
    addToHistory(pwd, 100);
  };

  const handleCheckHistory = (pwd: string) => {
    setPassword(pwd);
    setShowHistory(false);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('pwd-strength-history');
  };

  const circularProgress = (strength.score / 100) * 283; // 2*pi*45 ≈ 283

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 text-slate-800">
      <header className="bg-white/90 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className={`${playfair.className} text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent`}>
            DevTools
          </Link>
          <div className="flex items-center gap-3">
            <span className={`${poppins.className} text-sm font-medium text-slate-600 hidden sm:block`}>Password Strength</span>
            {history.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="p-2 text-slate-500 hover:text-indigo-600 transition-colors rounded-lg hover:bg-slate-100 relative"
                >
                  <History size={18} />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {history.length}
                  </span>
                </button>
                <AnimatePresence>
                  {showHistory && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-40"
                    >
                      <div className="flex items-center justify-between mb-2 px-2">
                        <span className="text-xs font-medium text-slate-500">Recent Passwords</span>
                        <button onClick={clearHistory} className="text-xs text-red-500 hover:text-red-700">Clear</button>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {history.map((item, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleCheckHistory(item.password)}
                            className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-lg transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-mono text-slate-700 truncate max-w-[180px]">{item.password}</span>
                              <span className={`text-xs font-medium ${item.strength >= 80 ? 'text-green-600' : item.strength >= 60 ? 'text-blue-600' : 'text-amber-600'}`}>
                                {item.strength}%
                              </span>
                            </div>
                            <p className="text-xs text-slate-400">{item.timestamp.toLocaleTimeString()}</p>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-14">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-medium mb-5 shadow-sm">
            <Shield size={16} /> Military-Grade Analysis
          </div>
          <h1 className={`${playfair.className} text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-4 leading-tight`}>
            Password Strength <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">Meter</span>
          </h1>
          <p className={`${poppins.className} text-base sm:text-lg text-slate-600 max-w-2xl mx-auto`}>
            Real-time entropy analysis and crack time estimation. Your password never leaves your browser.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Input & Gauge */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden">
              <div className="px-6 py-5 bg-gradient-to-r from-slate-50 to-slate-100/50 border-b border-slate-200">
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Lock size={20} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Type or paste a password..."
                    className="w-full pl-12 pr-32 py-4 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 text-lg font-mono"
                    autoFocus
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-2 text-slate-500 hover:text-indigo-600 transition-colors rounded-lg hover:bg-slate-100"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                    <button
                      onClick={handleCopy}
                      disabled={!password}
                      className="p-2 text-slate-500 hover:text-indigo-600 transition-colors rounded-lg hover:bg-slate-100 disabled:opacity-40"
                    >
                      {copySuccess ? <CheckCircle2 size={18} className="text-green-500" /> : <Copy size={18} />}
                    </button>
                    <button
                      onClick={handleClear}
                      className="p-2 text-slate-500 hover:text-red-600 transition-colors rounded-lg hover:bg-slate-100"
                    >
                      <XCircle size={18} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  {/* Circular Gauge */}
                  <div className="relative w-48 h-48 flex-shrink-0">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="96"
                        cy="96"
                        r="88"
                        fill="none"
                        stroke="#e2e8f0"
                        strokeWidth="12"
                      />
                      <motion.circle
                        cx="96"
                        cy="96"
                        r="88"
                        fill="none"
                        stroke={`url(#gradient-${strength.score})`}
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeDasharray="553"
                        strokeDashoffset={553 - (553 * strength.score) / 100}
                        initial={{ strokeDashoffset: 553 }}
                        animate={{ strokeDashoffset: 553 - (553 * strength.score) / 100 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      />
                      <defs>
                        <linearGradient id={`gradient-${strength.score}`} x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor={strength.score >= 80 ? '#10b981' : strength.score >= 60 ? '#3b82f6' : strength.score >= 40 ? '#f59e0b' : '#ef4444'} />
                          <stop offset="100%" stopColor={strength.score >= 80 ? '#059669' : strength.score >= 60 ? '#2563eb' : strength.score >= 40 ? '#d97706' : '#dc2626'} />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <motion.span
                        key={strength.score}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-4xl font-bold text-slate-800"
                      >
                        {strength.score}
                      </motion.span>
                      <span className="text-xs text-slate-500">/100</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl bg-gradient-to-r ${strength.gradient} text-white shadow-md`}>
                        {strength.icon}
                      </div>
                      <div>
                        <p className={`text-xl font-bold ${strength.color}`}>{strength.label}</p>
                        <p className="text-sm text-slate-500">Password Strength</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-50 rounded-xl p-3">
                        <div className="flex items-center gap-1 text-slate-500 mb-1">
                          <Zap size={14} />
                          <span className="text-xs">Entropy</span>
                        </div>
                        <p className="text-xl font-bold text-slate-800">{strength.entropy.toFixed(1)} <span className="text-sm font-normal text-slate-500">bits</span></p>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-3">
                        <div className="flex items-center gap-1 text-slate-500 mb-1">
                          <Clock size={14} />
                          <span className="text-xs">Crack Time</span>
                        </div>
                        <p className="text-xl font-bold text-slate-800">{strength.crackTimeDisplay}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-3xl shadow-lg border border-slate-200/80 p-6">
              <h3 className="text-sm font-semibold text-slate-700 mb-4">Requirements</h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                <RequirementBadge met={requirements.length} label="12+ chars" />
                <RequirementBadge met={requirements.uppercase} label="A-Z" />
                <RequirementBadge met={requirements.lowercase} label="a-z" />
                <RequirementBadge met={requirements.number} label="0-9" />
                <RequirementBadge met={requirements.symbol} label="!@#$" />
              </div>
            </div>
          </div>

          {/* Right Column - Suggestions & Info */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-3xl shadow-lg border border-indigo-200/50 p-6">
              <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <ShieldCheck size={18} className="text-indigo-600" />
                Strong Password Tips
              </h3>
              <ul className="space-y-3 text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                  Use at least 12 characters
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                  Mix uppercase, lowercase, numbers, symbols
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                  Avoid dictionary words and personal info
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                  Use a unique password for each account
                </li>
              </ul>
              <button
                onClick={handleSuggest}
                className="w-full mt-5 px-4 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl font-medium text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <RefreshCw size={14} />
                Generate Strong Password
              </button>
            </div>

            <div className="bg-white rounded-3xl shadow-lg border border-slate-200/80 p-6">
              <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <TrendingUp size={18} className="text-green-600" />
                Why This Matters
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                A strong password is your first line of defense against unauthorized access. 
                With modern hardware, a weak password can be cracked in seconds. 
                Aim for at least 80+ score and an entropy above 60 bits.
              </p>
              <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200">
                <p className="text-xs text-amber-800 flex items-center gap-1">
                  <Lock size={12} />
                  Your password is analyzed locally and never sent anywhere.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200/60 py-8 mt-8 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} DevTools. Built with ❤️ for developers.
        </div>
      </footer>
    </div>
  );
}

function RequirementBadge({ met, label }: { met: boolean; label: string }) {
  return (
    <div className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
      met ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-slate-100 text-slate-500 border border-slate-200'
    }`}>
      {met ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
      {label}
    </div>
  );
}