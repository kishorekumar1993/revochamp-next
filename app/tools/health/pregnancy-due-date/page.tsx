'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Playfair_Display, Poppins } from 'next/font/google';

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
// Utility functions (pure)
// ----------------------------------------------------------------------------
const normalizeDate = (date: Date): Date =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const dueDateFromLMP = (lmp: Date): Date =>
  new Date(lmp.getTime() + 280 * 24 * 60 * 60 * 1000);

const currentWeek = (lmp: Date): number => {
  const today = normalizeDate(new Date());
  const diff = today.getTime() - lmp.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days < 0) return 0;
  return Math.floor(days / 7) + 1;
};

const daysRemaining = (dueDate: Date): number => {
  const today = normalizeDate(new Date());
  return Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
};

const trimester = (week: number): string => {
  if (week <= 12) return 'First Trimester';
  if (week <= 27) return 'Second Trimester';
  return 'Third Trimester';
};

const babySize = (week: number): string => {
  const sizes: Record<number, string> = {
    8: 'Raspberry',
    12: 'Lime',
    16: 'Avocado',
    20: 'Banana',
    24: 'Corn',
    28: 'Eggplant',
    32: 'Squash',
    36: 'Lettuce',
    40: 'Pumpkin',
  };
  let closest = 8;
  for (const w of Object.keys(sizes).map(Number)) {
    if (week >= w) closest = w;
  }
  return sizes[closest] || 'Poppy seed';
};

const conceptionDate = (lmp: Date): Date =>
  new Date(lmp.getTime() + 14 * 24 * 60 * 60 * 1000);

// ----------------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------------
export default function PregnancyDueDatePage() {
  const [lmpDate, setLmpDate] = useState<Date | null>(null);
  const [lmpInput, setLmpInput] = useState<string>('');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [week, setWeek] = useState<number>(0);
  const [remaining, setRemaining] = useState<number>(0);
  const [trim, setTrim] = useState<string>('—');
  const [size, setSize] = useState<string>('—');
  const [conception, setConception] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    setIsClient(true);
    const saved = localStorage.getItem('pregnancy_due_date');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.lmp) {
          const lmp = new Date(data.lmp);
          setLmpDate(lmp);
          setLmpInput(lmp.toISOString().split('T')[0]);
          calculate(lmp);
        }
      } catch (e) {
        console.warn('Failed to load saved LMP');
      }
    } else {
      // Default: 140 days ago (approx 20 weeks)
      const defaultLmp = normalizeDate(new Date(Date.now() - 140 * 24 * 60 * 60 * 1000));
      setLmpDate(defaultLmp);
      setLmpInput(defaultLmp.toISOString().split('T')[0]);
      calculate(defaultLmp);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isClient && lmpDate) {
      localStorage.setItem('pregnancy_due_date', JSON.stringify({ lmp: lmpDate.toISOString() }));
    }
  }, [lmpDate, isClient]);

  const calculate = useCallback((lmp: Date) => {
    if (lmp > new Date()) {
      setError('Last period date cannot be in the future.');
      return;
    }
    setError(null);

    const due = dueDateFromLMP(lmp);
    const w = currentWeek(lmp);
    const daysLeft = daysRemaining(due);
    const tri = trimester(w);
    const baby = babySize(w);
    const conc = conceptionDate(lmp);

    setDueDate(due);
    setWeek(w);
    setRemaining(daysLeft);
    setTrim(tri);
    setSize(baby);
    setConception(conc);
  }, []);

  const handleLmpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLmpInput(value);
    if (value) {
      const newLmp = new Date(value);
      setLmpDate(newLmp);
      calculate(newLmp);
    }
  };

  const formatDate = (date: Date | null): string => {
    if (!date) return '—';
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const formatShortDate = (date: Date | null): string => {
    if (!date) return '—';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Calendar generation
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startWeekday = firstDay.getDay(); // 0 = Sunday

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <main
      className={`min-h-screen bg-gradient-to-br from-amber-50 via-pink-50 to-rose-50 ${poppins.variable} ${playfair.variable}`}
    >
      {/* Decorative background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-pink-200/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10 md:mb-14 text-center md:text-left"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-100/60 text-pink-700 text-sm font-medium mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
            </span>
            Free & Private • Medical Guidelines
          </div>
          <h1
            className={`text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4 leading-tight ${playfair.className}`}
          >
            🤰 Pregnancy Due Date{' '}
            <span className="bg-gradient-to-r from-pink-600 to-amber-600 bg-clip-text text-transparent">
              Calculator
            </span>
          </h1>
          <p className={`text-lg md:text-xl text-gray-600 max-w-3xl mx-auto md:mx-0 ${poppins.className}`}>
            Find your estimated delivery date and track your pregnancy week by week.
          </p>
        </motion.header>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Left Column: Input + Results */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 md:p-8"
            >
              <h2 className={`text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2 ${playfair.className}`}>
                <span className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-600">📋</span>
                Your Details
              </h2>
              <div className="mb-6">
                <label className={`block text-sm font-semibold text-gray-700 mb-2 ${poppins.className}`}>
                  📅 Last Menstrual Period (LMP)
                </label>
                <input
                  type="date"
                  value={lmpInput}
                  onChange={handleLmpChange}
                  max={new Date().toISOString().split('T')[0]}
                  className={`w-full px-5 py-3 rounded-xl border-2 border-gray-200 bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition-all ${poppins.className}`}
                />
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 md:p-8"
            >
              <h2 className={`text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2 ${playfair.className}`}>
                <span className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">📊</span>
                Your Results
              </h2>
              <div className="space-y-4">
                <ResultRow icon="📅" label="Estimated Due Date" value={formatDate(dueDate)} />
                <ResultRow icon="⏳" label="Current Pregnancy Week" value={week > 0 ? `Week ${week}` : '—'} />
                <ResultRow
                  icon="⌛"
                  label="Days Remaining"
                  value={remaining >= 0 ? `${remaining} days` : 'Past due'}
                />
              </div>
            </motion.div>
          </div>

          {/* Right Column: Progress & Trimester */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 md:p-8"
          >
            <h2 className={`text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2 ${playfair.className}`}>
              <span className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">📈</span>
              Pregnancy Timeline
            </h2>
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Week 1</span>
                <span className="font-semibold text-pink-600">Week {week} of 40</span>
                <span>Week 40</span>
              </div>
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (week / 40) * 100)}%` }}
                  transition={{ duration: 0.8 }}
                  className="h-full bg-gradient-to-r from-pink-500 to-amber-500 rounded-full"
                />
              </div>
            </div>
            <div className="p-5 bg-amber-50/80 rounded-2xl border border-amber-200">
              <p className={`text-lg font-semibold text-gray-800 ${poppins.className}`}>
                Current Trimester: {trim}
              </p>
              <p className={`text-gray-600 mt-1 ${poppins.className}`}>
                Your baby is about the size of a <strong>{size}</strong>.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Calendar Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 md:p-8"
        >
          <h3 className={`text-xl font-bold text-gray-800 mb-4 flex items-center gap-2 ${playfair.className}`}>
            <span className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">📅</span>
            Pregnancy Calendar
          </h3>
          <div className="flex flex-wrap gap-4 mb-4">
            <LegendItem color="bg-pink-300" label="Conception" />
            <LegendItem color="bg-blue-400" label="Current week" />
            <LegendItem color="bg-green-400" label="Due date" />
          </div>
          <div className="text-center mb-3">
            <span className={`font-semibold text-gray-800 ${playfair.className}`}>
              {now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center">
            {weekdays.map((day) => (
              <div key={day} className={`text-xs font-medium text-gray-500 ${poppins.className}`}>
                {day}
              </div>
            ))}
            {Array.from({ length: startWeekday }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const date = new Date(currentYear, currentMonth, day);
              let bgColor = '';
              if (dueDate && date.toDateString() === dueDate.toDateString()) bgColor = 'bg-green-400 text-white';
              else if (date.toDateString() === now.toDateString()) bgColor = 'bg-blue-400 text-white';
              else if (conception && date.toDateString() === conception.toDateString())
                bgColor = 'bg-pink-300 text-white';
              else bgColor = 'bg-gray-100 text-gray-800';

              return (
                <div
                  key={day}
                  className={`p-2 rounded-lg text-sm font-medium ${bgColor} ${poppins.className}`}
                >
                  {day}
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Baby Growth + Tips */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 md:p-8"
          >
            <h3 className={`text-xl font-bold text-gray-800 mb-4 flex items-center gap-2 ${playfair.className}`}>
              <span className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-600">👶</span>
              Baby Growth
            </h3>
            <p className={`text-gray-700 mb-4 ${poppins.className}`}>
              Week {week}: Your baby is about the size of a <strong>{size}</strong>.
            </p>
            <div className="flex flex-wrap gap-2">
              {['Week 8: Raspberry', 'Week 12: Lime', 'Week 20: Banana', 'Week 40: Pumpkin'].map((item) => (
                <span
                  key={item}
                  className="px-3 py-1 bg-white/50 rounded-full text-sm border border-gray-200 text-gray-700"
                >
                  {item}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 md:p-8"
          >
            <h3 className={`text-xl font-bold text-gray-800 mb-4 flex items-center gap-2 ${playfair.className}`}>
              <span className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">💡</span>
              Pregnancy Tips
            </h3>
            <ul className="space-y-3">
              <TipItem text="Eat nutritious foods rich in folic acid." />
              <TipItem text="Drink enough water during pregnancy." />
              <TipItem text="Schedule regular prenatal checkups." />
            </ul>
          </motion.div>
        </div>

        {/* Related Tools */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8 bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 md:p-8"
        >
          <h3 className={`text-xl font-bold text-gray-800 mb-4 flex items-center gap-2 ${playfair.className}`}>
            <span className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">🔗</span>
            Related Tools
          </h3>
          <div className="flex flex-wrap gap-3">
            {[
              'Ovulation Calculator',
              'BMI Calculator',
              'Water Intake Calculator',
              'Pregnancy Trimester Tracker',
            ].map((tool) => (
              <span
                key={tool}
                className="px-4 py-2 bg-pink-50 rounded-full text-sm border border-pink-200 text-gray-700 cursor-pointer hover:bg-pink-100 transition"
              >
                {tool}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 p-5 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200 text-center"
        >
          <p className={`text-sm text-gray-600 italic ${poppins.className}`}>
            ⚠️ This calculator provides estimates based on standard pregnancy timelines. Actual due dates may vary.
            Always consult your healthcare provider.
          </p>
        </motion.div>
      </div>
    </main>
  );
}

// ----------------------------------------------------------------------------
// Helper Components
// ----------------------------------------------------------------------------
function ResultRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-4 p-3 rounded-xl bg-gray-50/50">
      <span className="text-2xl">{icon}</span>
      <div>
        <p className={`text-sm text-gray-500 ${poppins.className}`}>{label}</p>
        <p className={`text-lg font-semibold text-gray-800 ${poppins.className}`}>{value}</p>
      </div>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-4 h-4 rounded-full ${color}`} />
      <span className={`text-sm text-gray-600 ${poppins.className}`}>{label}</span>
    </div>
  );
}

function TipItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2">
      <span className="text-pink-500 mt-1">•</span>
      <span className={`text-gray-700 ${poppins.className}`}>{text}</span>
    </li>
  );
}