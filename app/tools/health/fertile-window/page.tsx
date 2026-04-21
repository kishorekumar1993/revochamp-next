// app/fertile-window/page.tsx
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
// Calculation Logic (timezone-safe)
// ----------------------------------------------------------------------------
const LUTEAL_PHASE_DAYS = 12;

const normalizeDate = (date: Date): Date =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const calculateFertileWindow = (
  lmp: Date,
  cycleLength: number,
  lutealPhase: number = LUTEAL_PHASE_DAYS
) => {
  const ovulationDay = cycleLength - lutealPhase;
  const ovulation = normalizeDate(
    new Date(lmp.getTime() + ovulationDay * 24 * 60 * 60 * 1000)
  );
  const fertileStart = normalizeDate(
    new Date(ovulation.getTime() - 5 * 24 * 60 * 60 * 1000)
  );
  const fertileEnd = normalizeDate(ovulation);
  return { ovulation, fertileStart, fertileEnd };
};

const getPregnancyTestDate = (ovulation: Date): Date =>
  normalizeDate(new Date(ovulation.getTime() + 14 * 24 * 60 * 60 * 1000));

const getBestDays = (fertileStart: Date, fertileEnd: Date): Date[] => {
  const days: Date[] = [];
  for (let i = 2; i >= 0; i--) {
    days.push(
      normalizeDate(new Date(fertileEnd.getTime() - i * 24 * 60 * 60 * 1000))
    );
  }
  return days;
};

const parseLocalDate = (dateString: string): Date => {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
};

// ----------------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------------
export default function FertileWindowPage() {
  // State initialized with defaults to avoid hydration mismatch
  const [lmpDate, setLmpDate] = useState<string>('');
  const [cycleLength, setCycleLength] = useState<string>('28');
  const [lutealPhase, setLutealPhase] = useState<number>(LUTEAL_PHASE_DAYS);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [result, setResult] = useState<{
    ovulation: Date;
    fertileStart: Date;
    fertileEnd: Date;
    pregnancyTest: Date;
    bestDays: Date[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [hasCalculated, setHasCalculated] = useState(false);

  // Mark as client-side after mount to prevent hydration mismatches
  useEffect(() => {
    setIsClient(true);
    // Load saved data from localStorage only on client
    const saved = localStorage.getItem('fertility_calc');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.lmpDate) setLmpDate(data.lmpDate);
        if (data.cycleLength) setCycleLength(data.cycleLength);
        if (data.lutealPhase) setLutealPhase(data.lutealPhase);
      } catch (e) {
        console.warn('Failed to parse saved data');
      }
    }
  }, []);

  // Persist data when changed (client only)
  useEffect(() => {
    if (isClient && lmpDate && cycleLength) {
      localStorage.setItem(
        'fertility_calc',
        JSON.stringify({ lmpDate, cycleLength, lutealPhase })
      );
    }
  }, [lmpDate, cycleLength, lutealPhase, isClient]);

  // Validation function (doesn't auto-calculate, only checks validity)
  const validate = useCallback((): boolean => {
    if (!lmpDate) {
      setError('Please select the first day of your last period.');
      return false;
    }
    const cycle = parseInt(cycleLength, 10);
    if (isNaN(cycle) || cycle < 21 || cycle > 35) {
      setError('Cycle length must be between 21 and 35 days.');
      return false;
    }
    if (lutealPhase < 10 || lutealPhase > 16) {
      setError('Luteal phase should be between 10 and 16 days.');
      return false;
    }
    setError(null);
    return true;
  }, [lmpDate, cycleLength, lutealPhase]);

  // Calculate function (called on button click)
  const handleCalculate = useCallback(() => {
    if (!validate()) return;
    const lmp = parseLocalDate(lmpDate);
    const cycle = parseInt(cycleLength, 10);
    const { ovulation, fertileStart, fertileEnd } = calculateFertileWindow(
      lmp,
      cycle,
      lutealPhase
    );
    const pregnancyTest = getPregnancyTestDate(ovulation);
    const bestDays = getBestDays(fertileStart, fertileEnd);
    setResult({ ovulation, fertileStart, fertileEnd, pregnancyTest, bestDays });
    setHasCalculated(true);
  }, [lmpDate, cycleLength, lutealPhase, validate]);

  const formatDate = (date: Date, format: 'short' | 'long' = 'long'): string => {
    if (!isClient) return ''; // Prevent server/client mismatch
    if (format === 'short') {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleCopyResults = useCallback(() => {
    if (!result) return;
    const text = `Ovulation: ${formatDate(result.ovulation)}\nFertile Window: ${formatDate(
      result.fertileStart,
      'short'
    )} – ${formatDate(result.fertileEnd, 'short')}\nPregnancy Test: ${formatDate(
      result.pregnancyTest
    )}\nBest Days: ${result.bestDays
      .map((d) => formatDate(d, 'short'))
      .join(', ')}`;
    navigator.clipboard?.writeText(text);
    alert('Results copied to clipboard!');
  }, [result, formatDate]);

  // Don't render date-dependent content until client-side hydration is complete
  const safeFormatDate = (date: Date, format: 'short' | 'long' = 'long'): string => {
    if (!isClient) return '—';
    return formatDate(date, format);
  };

  return (
    <>
      <main
        className={`min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 ${poppins.variable} ${playfair.variable}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8 md:mb-12 text-center md:text-left"
          >
            <h1
              className={`text-4xl md:text-5xl font-bold text-gray-800 mb-4 ${playfair.className}`}
            >
              🌸 Know Exactly When You're Most Fertile
            </h1>
            <p
              className={`text-lg md:text-xl text-gray-600 max-w-4xl mx-auto md:mx-0 ${poppins.className}`}
            >
              Whether you're trying to conceive or just want to understand your cycle better,
              this free calculator gives you your personalized fertile window in seconds.
            </p>
            <div
              className={`flex flex-wrap gap-4 justify-center md:justify-start mt-6 ${poppins.className}`}
            >
              <span className="inline-flex items-center gap-1 text-sm bg-white/80 px-3 py-1 rounded-full shadow-sm">
                ✅ 100% Free & Private
              </span>
              <span className="inline-flex items-center gap-1 text-sm bg-white/80 px-3 py-1 rounded-full shadow-sm">
                📊 Based on Medical Guidelines
              </span>
              <span className="inline-flex items-center gap-1 text-sm bg-white/80 px-3 py-1 rounded-full shadow-sm">
                🔒 No Sign-up Required
              </span>
            </div>
          </motion.header>

          {/* Who is this for? */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid md:grid-cols-3 gap-4 mb-8"
          >
            {[
              {
                icon: '👶',
                title: 'Trying to Conceive',
                description:
                  'Maximize your chances by knowing exactly when to time intercourse.',
              },
              {
                icon: '📅',
                title: 'Cycle Tracking',
                description: "Understand your body's patterns and predict upcoming periods.",
              },
              {
                icon: '🧑‍⚕️',
                title: 'Fertility Awareness',
                description:
                  'Gain insights before consulting a specialist or starting treatment.',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 border border-pink-100 shadow-sm"
              >
                <div className="text-3xl mb-2">{item.icon}</div>
                <h3 className={`font-semibold text-gray-800 mb-1 ${poppins.className}`}>
                  {item.title}
                </h3>
                <p className={`text-sm text-gray-600 ${poppins.className}`}>
                  {item.description}
                </p>
              </div>
            ))}
          </motion.div>

          {/* Input Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-pink-100 overflow-hidden mb-8"
          >
            <div className="p-6 md:p-8">
              <h2
                className={`text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2 ${playfair.className}`}
              >
                <span>📋</span> Enter Your Cycle Details
              </h2>
              <p className={`text-gray-600 mb-6 ${poppins.className}`}>
                We only need two things: the first day of your last period and your typical
                cycle length.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="lmp"
                    className={`block text-sm font-semibold text-gray-700 mb-2 ${poppins.className}`}
                  >
                    📅 Last Menstrual Period
                  </label>
                  <input
                    id="lmp"
                    type="date"
                    value={lmpDate}
                    onChange={(e) => setLmpDate(e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      !lmpDate && error?.includes('period')
                        ? 'border-red-300'
                        : 'border-pink-200'
                    } bg-white/90 focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-shadow text-gray-700 ${
                      poppins.className
                    }`}
                    aria-label="Select first day of last menstrual period"
                  />
                </div>
                <div>
                  <label
                    htmlFor="cycle"
                    className={`block text-sm font-semibold text-gray-700 mb-2 ${poppins.className}`}
                  >
                    🔄 Cycle Length (days)
                  </label>
                  <input
                    id="cycle"
                    type="number"
                    min="21"
                    max="35"
                    value={cycleLength}
                    onChange={(e) => setCycleLength(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      cycleLength &&
                      (parseInt(cycleLength) < 21 || parseInt(cycleLength) > 35)
                        ? 'border-red-300'
                        : 'border-pink-200'
                    } bg-white/90 focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-shadow text-gray-700 ${
                      poppins.className
                    }`}
                  />
                  <p className={`text-xs text-gray-500 mt-1 ${poppins.className}`}>
                    21–35 days typical
                  </p>
                </div>
              </div>

              {/* Advanced Toggle */}
              <div className="mt-4">
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className={`text-sm text-pink-600 hover:text-pink-800 ${poppins.className}`}
                >
                  {showAdvanced ? 'Hide' : 'Show'} advanced options (luteal phase)
                </button>
              </div>
              <AnimatePresence>
                {showAdvanced && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4"
                  >
                    <label
                      htmlFor="luteal"
                      className={`block text-sm font-semibold text-gray-700 mb-2 ${poppins.className}`}
                    >
                      🧪 Luteal Phase Length (days)
                    </label>
                    <input
                      id="luteal"
                      type="number"
                      min="10"
                      max="16"
                      value={lutealPhase}
                      onChange={(e) =>
                        setLutealPhase(parseInt(e.target.value) || LUTEAL_PHASE_DAYS)
                      }
                      className={`w-full md:w-1/2 px-4 py-3 rounded-xl border border-pink-200 bg-white/90 ${poppins.className}`}
                    />
                    <p className={`text-xs text-gray-500 mt-1 ${poppins.className}`}>
                      Usually 12–14 days. Adjust if you know yours.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Error Message */}
              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                  ⚠️ {error}
                </div>
              )}

              {/* Submit Button */}
              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleCalculate}
                  className={`px-8 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 ${poppins.className}`}
                >
                  🔍 Calculate My Fertile Window
                </button>
              </div>
            </div>
          </motion.div>

          {/* Results Section */}
          <AnimatePresence mode="wait">
            {!hasCalculated && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 text-center border border-pink-100"
              >
                <p className={`text-gray-500 ${poppins.className}`}>
                  👆 Enter your details and click "Calculate" to see your fertile window.
                </p>
              </motion.div>
            )}

            {hasCalculated && result && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5 }}
                className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-pink-100 overflow-hidden mb-8"
              >
                <div className="p-6 md:p-8">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className={`text-2xl font-bold text-gray-800 ${playfair.className}`}>
                      ✨ Your Fertile Window
                    </h2>
                    <button
                      onClick={handleCopyResults}
                      className={`text-sm bg-white border border-pink-200 hover:bg-pink-50 px-4 py-2 rounded-full ${poppins.className}`}
                    >
                      📋 Copy
                    </button>
                  </div>

                  <div className="space-y-4">
                    {[
                      {
                        label: '🥚 Ovulation Date',
                        value: safeFormatDate(result.ovulation),
                      },
                      {
                        label: '🌸 Fertile Window',
                        value: `${safeFormatDate(
                          result.fertileStart,
                          'short'
                        )} – ${safeFormatDate(result.fertileEnd, 'short')}`,
                      },
                      {
                        label: '📆 Pregnancy Test Date',
                        value: safeFormatDate(result.pregnancyTest),
                      },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-pink-50/50 rounded-xl"
                      >
                        <span className="text-gray-600">{item.label}</span>
                        <span className="text-lg font-semibold text-gray-800">
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Best Days */}
                  <div className="mt-8 p-5 bg-gradient-to-r from-pink-100 to-rose-50 rounded-2xl">
                    <h3
                      className={`text-lg font-semibold text-gray-800 mb-3 ${poppins.className}`}
                    >
                      ❤️ Best Days for Conception
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {result.bestDays.map((day, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-4 py-2 bg-white rounded-full shadow-sm border border-pink-200"
                        >
                          {safeFormatDate(day, 'short')}
                        </span>
                      ))}
                    </div>
                    <p className={`text-sm text-gray-500 mt-3 ${poppins.className}`}>
                      Highest probability 1-2 days before ovulation.
                    </p>
                  </div>

                  {/* CTA */}
                  <div className="mt-8 p-5 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-200">
                    <h3
                      className={`text-lg font-semibold text-gray-800 mb-2 ${poppins.className}`}
                    >
                      🚀 Ready for a personalized fertility plan?
                    </h3>
                    <p className={`text-gray-600 mb-4 ${poppins.className}`}>
                      Get tailored recommendations based on your cycle and lifestyle.
                    </p>
                    <button
                      className={`bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2 rounded-full ${poppins.className}`}
                    >
                      Take Full Assessment →
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Educational Content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-md border border-pink-100 p-6 md:p-8 mb-8"
          >
            <h2 className={`text-2xl md:text-3xl font-bold text-gray-800 mb-6 ${playfair.className}`}>
              📖 Why Track Your Fertile Window?
            </h2>
            <div className={`space-y-8 text-gray-700 ${poppins.className}`}>
              <section>
                <h3 className="text-xl font-semibold mb-3">
                  1. Increase Your Chances of Pregnancy
                </h3>
                <p>
                  The fertile window is only about 6 days per cycle. By knowing exactly when it
                  occurs, you can time intercourse to coincide with peak fertility. Studies show
                  couples who track ovulation conceive up to <strong>2x faster</strong> than those
                  who don't.
                </p>
              </section>
              <section>
                <h3 className="text-xl font-semibold mb-3">
                  2. Understand Your Body Better
                </h3>
                <p>
                  Your menstrual cycle is a vital sign. Tracking it helps you notice irregularities
                  early, which can be important for overall health. Many women discover patterns
                  that help them communicate more effectively with healthcare providers.
                </p>
              </section>
              <section>
                <h3 className="text-xl font-semibold mb-3">
                  3. Plan Ahead Emotionally & Logistically
                </h3>
                <p>
                  Trying to conceive can be stressful. Knowing your fertile window helps you plan
                  intimacy without the pressure of "doing it every day." It also gives you a clear
                  timeline for when to expect your period or take a pregnancy test.
                </p>
              </section>
            </div>
          </motion.div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-md border border-pink-100 p-6 md:p-8"
          >
            <h2 className={`text-2xl md:text-3xl font-bold text-gray-800 mb-6 ${playfair.className}`}>
              ❓ Frequently Asked Questions
            </h2>
            <div className={`space-y-6 ${poppins.className}`}>
              {[
                {
                  q: 'How accurate is this calculator?',
                  a: "It's based on average cycle lengths and a luteal phase of 12-14 days. For women with regular cycles, it's quite accurate (±1-2 days). For irregular cycles, it's a helpful estimate but should be used alongside other tracking methods.",
                },
                {
                  q: 'What if my cycles are irregular?',
                  a: 'You can still use the calculator, but results may vary. Consider tracking additional signs like cervical mucus or using ovulation test strips for more precision.',
                },
                {
                  q: 'Can I use this to avoid pregnancy?',
                  a: 'This calculator is designed for pregnancy planning, not contraception. The fertile window method has a high failure rate for birth control.',
                },
                {
                  q: 'What does "luteal phase" mean?',
                  a: 'The luteal phase is the time between ovulation and your next period. It\'s usually consistent for each woman (10-16 days). Knowing yours improves accuracy.',
                },
                {
                  q: 'Is my data stored or shared?',
                  a: "All calculations happen in your browser. We don't store or see any of your cycle data.",
                },
              ].map((faq, idx) => (
                <div key={idx} className="border-b border-gray-200 pb-4 last:border-0">
                  <h4 className="font-semibold text-gray-800 mb-1">{faq.q}</h4>
                  <p className="text-gray-600">{faq.a}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-amber-50/80 rounded-xl border border-amber-200 text-sm italic">
              ⚠️ Medical Disclaimer: This tool is for educational purposes and not a substitute for
              professional medical advice.
            </div>
          </motion.div>
        </div>
      </main>
    </>
  );
}