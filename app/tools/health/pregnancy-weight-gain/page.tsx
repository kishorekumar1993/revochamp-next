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
// Calculation Service
// ----------------------------------------------------------------------------
const calculateBMI = (heightCm: number, weightKg: number): number => {
  const heightM = heightCm / 100;
  return weightKg / (heightM * heightM);
};

const getCategoryAndGain = (bmi: number, isTwin: boolean) => {
  let category: string;
  let minGain: number;
  let maxGain: number;
  let color: string;

  if (bmi < 18.5) {
    category = 'Underweight';
    minGain = 12.5;
    maxGain = 18.0;
    color = '#3B82F6'; // blue
  } else if (bmi >= 18.5 && bmi <= 24.9) {
    category = 'Normal';
    minGain = 11.5;
    maxGain = 16.0;
    color = '#10B981'; // green
  } else if (bmi >= 25 && bmi <= 29.9) {
    category = 'Overweight';
    minGain = 7.0;
    maxGain = 11.5;
    color = '#F59E0B'; // amber
  } else {
    category = 'Obese';
    minGain = 5.0;
    maxGain = 9.0;
    color = '#EF4444'; // red
  }

  if (isTwin) {
    switch (category) {
      case 'Normal':
        minGain = 16.0;
        maxGain = 24.0;
        break;
      case 'Overweight':
        minGain = 14.0;
        maxGain = 23.0;
        break;
      default:
        minGain = 12.0;
        maxGain = 20.0;
    }
  }

  return { category, minGain, maxGain, color };
};

const weeklyGain = (minGain: number, maxGain: number) => ({
  minWeekly: minGain / 27,
  maxWeekly: maxGain / 27,
});

const estimatedWeightAtWeek = (
  preWeight: number,
  minGain: number,
  maxGain: number,
  week: number
): number => {
  const midGain = (minGain + maxGain) / 2;
  if (week <= 12) {
    return preWeight + (1.5 * week) / 12;
  } else {
    const weekly = midGain / 27;
    return preWeight + 1.5 + weekly * (week - 12);
  }
};

// ----------------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------------
export default function PregnancyWeightGainPage() {
  const [height, setHeight] = useState<string>('165');
  const [weight, setWeight] = useState<string>('60');
  const [currentWeek, setCurrentWeek] = useState<string>('12');
  const [isTwin, setIsTwin] = useState<boolean>(false);

  const [results, setResults] = useState<{
    bmi: number;
    category: string;
    minGain: number;
    maxGain: number;
    minWeekly: number;
    maxWeekly: number;
    color: string;
    estimatedCurrentWeight: number | null;
  } | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Load saved data
    const saved = localStorage.getItem('pregnancy_weight_calc');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setHeight(data.height || '165');
        setWeight(data.weight || '60');
        setCurrentWeek(data.currentWeek || '12');
        setIsTwin(data.isTwin || false);
      } catch (e) {
        console.warn('Failed to load saved data');
      }
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem(
        'pregnancy_weight_calc',
        JSON.stringify({ height, weight, currentWeek, isTwin })
      );
    }
  }, [height, weight, currentWeek, isTwin, isClient]);

  const calculate = useCallback(() => {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    const week = currentWeek ? parseInt(currentWeek, 10) : null;

    if (!height || isNaN(h) || h < 120 || h > 210) {
      setError('Please enter a valid height (120–210 cm).');
      setResults(null);
      return;
    }
    if (!weight || isNaN(w) || w < 35 || w > 200) {
      setError('Please enter a valid pre-pregnancy weight (35–200 kg).');
      setResults(null);
      return;
    }
    if (currentWeek && (isNaN(week!) || week! < 1 || week! > 40)) {
      setError('Pregnancy week must be between 1 and 40.');
      setResults(null);
      return;
    }

    setError(null);
    const bmi = calculateBMI(h, w);
    const { category, minGain, maxGain, color } = getCategoryAndGain(bmi, isTwin);
    const { minWeekly, maxWeekly } = weeklyGain(minGain, maxGain);
    const estimatedCurrentWeight = week ? estimatedWeightAtWeek(w, minGain, maxGain, week) : null;

    setResults({
      bmi,
      category,
      minGain,
      maxGain,
      minWeekly,
      maxWeekly,
      color,
      estimatedCurrentWeight,
    });
  }, [height, weight, currentWeek, isTwin]);

  // Auto-calculate on input change
  useEffect(() => {
    calculate();
  }, [calculate]);

  const formatNumber = (val: number, decimals: number = 1) => val.toFixed(decimals);

  return (
    <main className={`min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 ${poppins.variable} ${playfair.variable}`}>
      {/* Decorative background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-pink-200/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Enhanced Header */}
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
            Free & Private • IOM Guidelines
          </div>
          <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4 leading-tight ${playfair.className}`}>
            Healthy Pregnancy,{' '}
            <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Healthy Weight
            </span>
          </h1>
          <p className={`text-lg md:text-xl text-gray-600 max-w-3xl mx-auto md:mx-0 ${poppins.className}`}>
            Calculate your recommended weight gain during pregnancy based on your pre-pregnancy BMI.
            Includes twin pregnancy support and week-by-week tracking.
          </p>
          <div className={`flex flex-wrap gap-3 justify-center md:justify-start mt-6 ${poppins.className}`}>
            <Badge>✅ IOM Recommendations</Badge>
            <Badge>👶 Twin Pregnancy</Badge>
            <Badge>📊 Week-by-Week</Badge>
          </div>
        </motion.header>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Left: Input Form */}
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

            <div className="space-y-5">
              <InputField
                label="Height"
                value={height}
                onChange={setHeight}
                unit="cm"
                icon="📏"
                placeholder="e.g., 165"
              />
              <InputField
                label="Pre-pregnancy weight"
                value={weight}
                onChange={setWeight}
                unit="kg"
                icon="⚖️"
                placeholder="e.g., 60"
              />
              <InputField
                label="Current pregnancy week"
                value={currentWeek}
                onChange={setCurrentWeek}
                unit="week"
                icon="📅"
                placeholder="Optional (1–40)"
              />

              {/* Twin Checkbox */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setIsTwin(!isTwin)}
                  className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${isTwin ? 'bg-pink-600' : 'bg-gray-300'}`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                      isTwin ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
                <span className={`text-gray-700 font-medium ${poppins.className}`}>
                  👶👶 Expecting twins?
                </span>
              </div>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                ⚠️ {error}
              </div>
            )}

            <button
              onClick={calculate}
              className={`w-full mt-8 py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 ${poppins.className}`}
            >
              ⚖️ Calculate Weight Gain
            </button>
          </motion.div>

          {/* Right: Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 md:p-8"
          >
            <h2 className={`text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2 ${playfair.className}`}>
              <span className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">📊</span>
              Your Results
            </h2>

            <AnimatePresence mode="wait">
              {!results ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-16 text-gray-500"
                >
                  <div className="text-7xl mb-4 opacity-50">📋</div>
                  <p className={`text-lg ${poppins.className}`}>
                    Enter your details to see your personalized weight gain recommendations.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* BMI Card */}
                  <div className="flex items-start gap-5 p-5 bg-gradient-to-br from-white to-gray-50/50 rounded-2xl border border-gray-100">
                    <div className="flex-1">
                      <p className={`text-sm font-medium text-gray-500 mb-1 ${poppins.className}`}>Your BMI</p>
                      <p className={`text-5xl font-bold text-gray-800 ${playfair.className}`}>
                        {formatNumber(results.bmi)}
                      </p>
                      <div
                        className="mt-3 inline-block px-4 py-1.5 rounded-full text-white text-sm font-semibold shadow-sm"
                        style={{ backgroundColor: results.color }}
                      >
                        {results.category}
                      </div>
                    </div>
                  </div>

                  {/* Results Rows */}
                  <div className="space-y-4">
                    <ResultRow
                      icon="📈"
                      label="Recommended Total Gain"
                      value={`${formatNumber(results.minGain)} – ${formatNumber(results.maxGain)} kg`}
                    />
                    <ResultRow
                      icon="📊"
                      label="Avg Weekly Gain (after week 12)"
                      value={`${formatNumber(results.minWeekly, 2)} – ${formatNumber(results.maxWeekly, 2)} kg/week`}
                    />
                    {results.estimatedCurrentWeight && (
                      <ResultRow
                        icon="⚖️"
                        label={`Estimated weight at week ${currentWeek}`}
                        value={`${formatNumber(results.estimatedCurrentWeight)} kg`}
                        highlight
                      />
                    )}
                  </div>

                  {/* CTA */}
                  <div className="mt-6 p-5 bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl border border-pink-100">
                    <p className={`text-sm font-medium text-gray-800 mb-2 ${poppins.className}`}>
                      🤰 Want a personalized pregnancy plan?
                    </p>
                    <button className={`text-sm bg-pink-600 hover:bg-pink-700 text-white px-5 py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg ${poppins.className}`}>
                      Get Full Pregnancy Guide →
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Timeline Table */}
        {results && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 md:p-8"
          >
            <h3 className={`text-xl font-bold text-gray-800 mb-6 flex items-center gap-2 ${playfair.className}`}>
              <span className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-600">📈</span>
              Weight Gain Timeline
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className={`text-left py-3 px-4 text-sm font-semibold text-gray-600 ${poppins.className}`}>
                      Pregnancy Week
                    </th>
                    <th className={`text-left py-3 px-4 text-sm font-semibold text-gray-600 ${poppins.className}`}>
                      Recommended Weight (kg)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[12, 16, 20, 24, 28, 32, 36, 40].map((week) => {
                    const est = estimatedWeightAtWeek(
                      parseFloat(weight),
                      results.minGain,
                      results.maxGain,
                      week
                    );
                    const isCurrent = currentWeek && parseInt(currentWeek) === week;
                    return (
                      <tr
                        key={week}
                        className={`border-b border-gray-100 ${isCurrent ? 'bg-pink-50/50' : ''}`}
                      >
                        <td className={`py-3 px-4 ${poppins.className}`}>
                          Week {week}
                          {isCurrent && (
                            <span className="ml-2 inline-block px-2 py-0.5 bg-pink-100 text-pink-700 text-xs rounded-full">
                              Current
                            </span>
                          )}
                        </td>
                        <td className={`py-3 px-4 font-semibold text-gray-800 ${poppins.className}`}>
                          {formatNumber(est)} kg
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Progress Bar */}
            {currentWeek && parseInt(currentWeek) >= 1 && parseInt(currentWeek) <= 40 && (
              <div className="mt-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Week 1</span>
                  <span className="font-semibold text-pink-600">Week {currentWeek}</span>
                  <span>Week 40</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(parseInt(currentWeek) / 40) * 100}%` }}
                    transition={{ duration: 0.8 }}
                    className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"
                  />
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Tips Card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 md:p-8"
        >
          <h3 className={`text-xl font-bold text-gray-800 mb-6 flex items-center gap-2 ${playfair.className}`}>
            <span className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">💡</span>
            Healthy Weight Gain Tips
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <TipCard
              icon="🥗"
              title="Balanced Nutrition"
              description="Eat plenty of fruits, vegetables, whole grains, lean proteins, and healthy fats."
            />
            <TipCard
              icon="💧"
              title="Stay Hydrated"
              description="Drink at least 8–10 glasses of water daily to support increased blood volume."
            />
            <TipCard
              icon="🚶‍♀️"
              title="Moderate Exercise"
              description="Walking, swimming, and prenatal yoga help manage weight and reduce discomfort."
            />
          </div>
          <div className="mt-6 p-4 bg-amber-50/80 rounded-xl border border-amber-200 text-sm italic text-gray-700">
            ⚠️ Medical Disclaimer: This calculator provides estimates based on IOM guidelines. Always consult your healthcare provider for personalized advice.
          </div>
        </motion.div>
      </div>
    </main>
  );
}

// ----------------------------------------------------------------------------
// Sub-components
// ----------------------------------------------------------------------------
function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 text-sm bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm border border-white/50">
      {children}
    </span>
  );
}

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  unit: string;
  icon: string;
  placeholder?: string;
}

function InputField({ label, value, onChange, unit, icon, placeholder }: InputFieldProps) {
  return (
    <div>
      <label className={`block text-sm font-semibold text-gray-700 mb-2 ${poppins.className}`}>
        {icon} {label}
      </label>
      <div className="relative group">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full px-5 py-3 pr-14 rounded-xl border-2 border-gray-200 bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition-all duration-200 group-hover:border-pink-200 ${poppins.className}`}
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">{unit}</span>
      </div>
    </div>
  );
}

function ResultRow({
  icon,
  label,
  value,
  highlight = false,
}: {
  icon: string;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className={`flex items-center gap-4 p-4 rounded-xl ${highlight ? 'bg-pink-50/80 border border-pink-200' : 'bg-gray-50/50'}`}>
      <span className="text-2xl">{icon}</span>
      <div>
        <p className={`text-sm text-gray-500 ${poppins.className}`}>{label}</p>
        <p className={`text-lg font-semibold text-gray-800 ${poppins.className}`}>{value}</p>
      </div>
    </div>
  );
}

function TipCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="p-5 bg-white/50 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
      <div className="text-3xl mb-3">{icon}</div>
      <h4 className={`font-semibold text-gray-800 mb-1 ${poppins.className}`}>{title}</h4>
      <p className={`text-sm text-gray-600 ${poppins.className}`}>{description}</p>
    </div>
  );
}