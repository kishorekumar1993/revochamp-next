// app/tools/timestamp-converter/TimestampConverterClient.tsx
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Playfair_Display, Poppins } from 'next/font/google';
import Link from 'next/link';
import {
  Clock,
  Calendar,
  Copy,
  RefreshCw,
  CheckCircle2,
  Trash2,
  Globe,
  AlertCircle,
} from 'lucide-react';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '700', '800'] });
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600'] });

interface TimezoneOption {
  value: string;
  label: string;
  offset?: number; // offset in minutes from UTC
}

const timezones: TimezoneOption[] = [
  { value: 'local', label: 'Local Time' },
  { value: 'utc', label: 'UTC' },
  { value: 'PST', label: 'PST (UTC-8)', offset: -480 },
  { value: 'MST', label: 'MST (UTC-7)', offset: -420 },
  { value: 'CST', label: 'CST (UTC-6)', offset: -360 },
  { value: 'EST', label: 'EST (UTC-5)', offset: -300 },
  { value: 'GMT', label: 'GMT (UTC+0)', offset: 0 },
  { value: 'CET', label: 'CET (UTC+1)', offset: 60 },
  { value: 'IST', label: 'IST (UTC+5:30)', offset: 330 },
  { value: 'JST', label: 'JST (UTC+9)', offset: 540 },
];

export default function TimestampConverterClient() {
  const [mode, setMode] = useState<'timestamp-to-date' | 'date-to-timestamp'>('timestamp-to-date');
  const [timestampInput, setTimestampInput] = useState('');
  const [unit, setUnit] = useState<'seconds' | 'milliseconds'>('seconds');
  const [dateInput, setDateInput] = useState('');
  const [timeInput, setTimeInput] = useState('12:00');
  const [selectedTimezone, setSelectedTimezone] = useState<TimezoneOption>(timezones[0]);
  const [result, setResult] = useState<string>('');
  const [currentTimestamp, setCurrentTimestamp] = useState<{ seconds: number; milliseconds: number }>({ seconds: 0, milliseconds: 0 });
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  // Update current timestamp every second
  useEffect(() => {
    const updateCurrent = () => {
      const ms = Date.now();
      setCurrentTimestamp({
        milliseconds: ms,
        seconds: Math.floor(ms / 1000),
      });
    };
    updateCurrent();
    const interval = setInterval(updateCurrent, 1000);
    return () => clearInterval(interval);
  }, []);

  // Convert timestamp to date
  const convertTimestampToDate = useCallback(() => {
    if (!timestampInput.trim()) {
      setResult('');
      setError(null);
      return;
    }

    try {
      let ts = parseInt(timestampInput);
      if (isNaN(ts)) throw new Error('Invalid timestamp');

      // Convert to milliseconds if input is in seconds
      if (unit === 'seconds') {
        ts = ts * 1000;
      }

      const date = new Date(ts);
      if (isNaN(date.getTime())) throw new Error('Invalid date');

      // Apply timezone
      let displayDate: Date;
      if (selectedTimezone.value === 'local') {
        displayDate = date;
      } else if (selectedTimezone.value === 'utc') {
        displayDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
      } else if (selectedTimezone.offset !== undefined) {
        const offsetMs = selectedTimezone.offset * 60000;
        const utc = date.getTime() + date.getTimezoneOffset() * 60000;
        displayDate = new Date(utc + offsetMs);
      } else {
        displayDate = date;
      }

      const formatted = displayDate.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });

      const iso = displayDate.toISOString();
      setResult(`${formatted}\nISO 8601: ${iso}`);
      setError(null);
    } catch (e: any) {
      setError(e.message);
      setResult('');
    }
  }, [timestampInput, unit, selectedTimezone]);

  // Convert date to timestamp
  const convertDateToTimestamp = useCallback(() => {
    if (!dateInput) {
      setResult('');
      setError(null);
      return;
    }

    try {
      // Combine date and time inputs
      const dateTimeStr = `${dateInput}T${timeInput}`;
      let date = new Date(dateTimeStr);

      if (isNaN(date.getTime())) throw new Error('Invalid date');

      // Apply timezone adjustment if not local
      if (selectedTimezone.value !== 'local') {
        let offsetMs = 0;
        if (selectedTimezone.value === 'utc') {
          offsetMs = -date.getTimezoneOffset() * 60000;
        } else if (selectedTimezone.offset !== undefined) {
          const localOffset = date.getTimezoneOffset() * 60000;
          const targetOffset = selectedTimezone.offset * 60000;
          offsetMs = targetOffset - localOffset;
        }
        date = new Date(date.getTime() - offsetMs);
      }

      const seconds = Math.floor(date.getTime() / 1000);
      const milliseconds = date.getTime();

      setResult(`Seconds: ${seconds}\nMilliseconds: ${milliseconds}`);
      setError(null);
    } catch (e: any) {
      setError(e.message);
      setResult('');
    }
  }, [dateInput, timeInput, selectedTimezone]);

  // Trigger conversion on input changes
  useEffect(() => {
    if (mode === 'timestamp-to-date') {
      convertTimestampToDate();
    } else {
      convertDateToTimestamp();
    }
  }, [mode, timestampInput, unit, dateInput, timeInput, selectedTimezone, convertTimestampToDate, convertDateToTimestamp]);

  const handleCopy = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(type);
      setTimeout(() => setCopySuccess(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handleUseCurrent = () => {
    if (mode === 'timestamp-to-date') {
      setTimestampInput(unit === 'seconds' ? currentTimestamp.seconds.toString() : currentTimestamp.milliseconds.toString());
    } else {
      const now = new Date();
      setDateInput(now.toISOString().split('T')[0]);
      setTimeInput(now.toTimeString().split(' ')[0].substring(0, 5));
    }
  };

  const handleClear = () => {
    if (mode === 'timestamp-to-date') {
      setTimestampInput('');
    } else {
      setDateInput('');
      setTimeInput('12:00');
    }
    setResult('');
    setError(null);
  };

  const handleSample = () => {
    if (mode === 'timestamp-to-date') {
      setTimestampInput(unit === 'seconds' ? '1700000000' : '1700000000000');
    } else {
      setDateInput('2025-12-25');
      setTimeInput('09:30');
    }
  };

  const toggleMode = () => {
    setMode(prev => prev === 'timestamp-to-date' ? 'date-to-timestamp' : 'timestamp-to-date');
    setError(null);
    setResult('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50/20 via-white to-blue-50/20 text-slate-800">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className={`${playfair.className} text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent`}>
            DevTools
          </Link>
          <span className={`${poppins.className} text-xs text-slate-500`}>Timestamp Converter</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
          <div className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <Clock size={16} /> Free Developer Tool
          </div>
          <h1 className={`${playfair.className} text-3xl sm:text-5xl font-extrabold text-slate-800 mb-3`}>
            Unix <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Timestamp</span> Converter
          </h1>
          <p className={`${poppins.className} text-base sm:text-lg text-slate-600 max-w-2xl mx-auto`}>
            Convert between Unix timestamps and human-readable dates. Supports seconds, milliseconds, and multiple timezones.
          </p>
        </motion.div>

        {/* Current Timestamp Display */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 mb-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Current Unix Timestamp</p>
                <p className="text-2xl font-mono font-bold text-slate-800">{currentTimestamp.seconds}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopy(currentTimestamp.seconds.toString(), 'current-seconds')}
                className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm flex items-center gap-1"
              >
                {copySuccess === 'current-seconds' ? <CheckCircle2 size={14} className="text-green-500" /> : <Copy size={14} />}
                Copy Seconds
              </button>
              <button
                onClick={() => handleCopy(currentTimestamp.milliseconds.toString(), 'current-ms')}
                className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm flex items-center gap-1"
              >
                {copySuccess === 'current-ms' ? <CheckCircle2 size={14} className="text-green-500" /> : <Copy size={14} />}
                Copy Milliseconds
              </button>
            </div>
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setMode('timestamp-to-date')}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                mode === 'timestamp-to-date'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              Timestamp to Date
            </button>
            <button
              onClick={() => setMode('date-to-timestamp')}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                mode === 'date-to-timestamp'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              Date to Timestamp
            </button>
          </div>
        </div>

        {/* Converter Panel */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
          {/* Input Section */}
          <div className="space-y-4 mb-6">
            {mode === 'timestamp-to-date' ? (
              <>
                <label className="block text-sm font-medium text-slate-700">Unix Timestamp</label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={timestampInput}
                    onChange={(e) => setTimestampInput(e.target.value)}
                    placeholder="e.g., 1700000000"
                    className="flex-1 px-4 py-3 bg-white border border-slate-300 rounded-xl font-mono text-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value as 'seconds' | 'milliseconds')}
                    className="px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-700"
                  >
                    <option value="seconds">Seconds</option>
                    <option value="milliseconds">Milliseconds</option>
                  </select>
                </div>
              </>
            ) : (
              <>
                <label className="block text-sm font-medium text-slate-700">Date & Time</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="date"
                    value={dateInput}
                    onChange={(e) => setDateInput(e.target.value)}
                    className="px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="time"
                    value={timeInput}
                    step="1"
                    onChange={(e) => setTimeInput(e.target.value)}
                    className="px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
            )}

            {/* Timezone Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Timezone</label>
              <select
                value={selectedTimezone.value}
                onChange={(e) => {
                  const tz = timezones.find(t => t.value === e.target.value);
                  if (tz) setSelectedTimezone(tz);
                }}
                className="w-full sm:w-64 px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-700 focus:ring-2 focus:ring-blue-500"
              >
                {timezones.map((tz) => (
                  <option key={tz.value} value={tz.value}>{tz.label}</option>
                ))}
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleUseCurrent}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center gap-2 shadow-sm"
              >
                <RefreshCw size={14} /> Use Current
              </button>
              <button
                onClick={handleSample}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm flex items-center gap-2"
              >
                <Calendar size={14} /> Sample
              </button>
              <button
                onClick={handleClear}
                className="px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm flex items-center gap-2 text-red-600"
              >
                <Trash2 size={14} /> Clear
              </button>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Result Section */}
          <div className="border-t border-slate-200 pt-5">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-slate-700">Result</label>
              {result && (
                <button
                  onClick={() => handleCopy(result, 'result')}
                  className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors flex items-center gap-1"
                >
                  {copySuccess === 'result' ? <CheckCircle2 size={14} className="text-green-500" /> : <Copy size={14} />}
                  Copy
                </button>
              )}
            </div>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 min-h-[100px]">
              {result ? (
                <pre className="font-mono text-sm text-slate-800 whitespace-pre-wrap break-all">
                  {result}
                </pre>
              ) : (
                <p className="text-slate-400 text-sm">Result will appear here</p>
              )}
            </div>
          </div>
        </div>

        {/* Information Box */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
            <h3 className={`${poppins.className} font-semibold text-slate-800 mb-2`}>What is Unix Timestamp?</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              The Unix timestamp is the number of seconds (or milliseconds) that have elapsed since January 1, 1970 (UTC),
              not counting leap seconds. It's widely used in programming and databases to store and compare dates.
            </p>
          </div>
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
            <h3 className={`${poppins.className} font-semibold text-slate-800 mb-2`}>Features</h3>
            <ul className="grid grid-cols-1 gap-1 text-sm text-slate-600">
              <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Bidirectional conversion</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Support seconds & milliseconds</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Multiple timezone options</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Live current timestamp</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Copy to clipboard</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> 100% client-side</li>
            </ul>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200 py-6 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-slate-400">
          © {new Date().getFullYear()} DevTools. Built for developers.
        </div>
      </footer>
    </div>
  );
}