'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Playfair_Display, Poppins } from 'next/font/google';
import BMIGauge from './components/BMIGauge';
import HistoryPanel from './components/HistoryPanel';

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
// Types & Constants
// ----------------------------------------------------------------------------
interface HistoryEntry {
  timestamp: Date;
  heightCm: number;
  weightKg: number;
  waistCm: number;
  age: number;
  gender: string;
  bmi: number;
  category: string;
}

interface Results {
  bmi: number;
  category: string;
  categoryColor: string;
  bmr: number;
  healthyMin: number;
  healthyMax: number;
  bodyFat: number;
  whtr: number;
  waterIntake: number;
  advice: string;
}

const BMI_CATEGORIES = [
  { min: 0, max: 18.5, label: 'Underweight', color: '#3B82F6', bgLight: '#EFF6FF' },
  { min: 18.5, max: 25, label: 'Normal weight', color: '#10B981', bgLight: '#ECFDF5' },
  { min: 25, max: 30, label: 'Overweight', color: '#F59E0B', bgLight: '#FFFBEB' },
  { min: 30, max: 100, label: 'Obese', color: '#EF4444', bgLight: '#FEF2F2' },
];

// ----------------------------------------------------------------------------
// Utility Functions
// ----------------------------------------------------------------------------
const getBMICategory = (bmi: number) => {
  return BMI_CATEGORIES.find(cat => bmi >= cat.min && bmi < cat.max) || BMI_CATEGORIES[BMI_CATEGORIES.length - 1];
};

const calculateResults = (
  heightCm: number,
  weightKg: number,
  age: number,
  gender: string,
  waistCm: number
): Results => {
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  const categoryInfo = getBMICategory(bmi);

  // BMR using Mifflin-St Jeor
  let bmr: number;
  let genderFactor: number;
  if (gender === 'Male') {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
    genderFactor = 1.0;
  } else if (gender === 'Female') {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
    genderFactor = 0.0;
  } else {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 78;
    genderFactor = 0.5;
  }

  // Body fat (Deurenberg formula)
  const bodyFat = Math.max(5, 1.20 * bmi + 0.23 * age - 10.8 * genderFactor - 5.4);

  // Waist-to-height ratio
  const whtr = waistCm > 0 ? waistCm / heightCm : 0;

  // Healthy weight range
  const healthyMin = 18.5 * heightM * heightM;
  const healthyMax = 24.9 * heightM * heightM;

  // Water intake (ml per kg)
  const waterIntake = weightKg * 0.033;

  // Advice
  const adviceMap: Record<string, string> = {
    Underweight: 'Consider nutrient-dense foods and strength training. Consult a dietitian if needed.',
    'Normal weight': 'Great! Maintain a balanced diet and regular physical activity.',
    Overweight: 'Focus on whole foods and aim for 150+ minutes of exercise weekly.',
    Obese: 'Consult a healthcare provider for a personalized plan. Small changes add up.',
  };

  return {
    bmi,
    category: categoryInfo.label,
    categoryColor: categoryInfo.color,
    bmr,
    healthyMin,
    healthyMax,
    bodyFat,
    whtr,
    waterIntake,
    advice: adviceMap[categoryInfo.label],
  };
};

// ----------------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------------
export default function HealthCalculatorPage() {
  // State
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('metric');
  const [heightCm, setHeightCm] = useState<number>(170);
  const [weightKg, setWeightKg] = useState<number>(70);
  const [waistCm, setWaistCm] = useState<number>(0);
  const [age, setAge] = useState<number>(30);
  const [gender, setGender] = useState<string>('Male');

  const [results, setResults] = useState<Results | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Controllers for input fields
  const [heightInput, setHeightInput] = useState('170');
  const [weightInput, setWeightInput] = useState('70');
  const [waistInput, setWaistInput] = useState('');
  const [ageInput, setAgeInput] = useState('30');

  // Load history from localStorage
  useEffect(() => {
    setIsClient(true);
    const saved = localStorage.getItem('health_calc_history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const withDates = parsed.map((e: any) => ({
          ...e,
          timestamp: new Date(e.timestamp),
        }));
        setHistory(withDates);
      } catch (e) {
        console.warn('Failed to load history');
      }
    }
  }, []);

  // Save history
  useEffect(() => {
    if (isClient && history.length > 0) {
      localStorage.setItem('health_calc_history', JSON.stringify(history));
    }
  }, [history, isClient]);

  // Update input fields when unit system or base values change
  useEffect(() => {
    if (unitSystem === 'metric') {
      setHeightInput(heightCm.toFixed(0));
      setWeightInput(weightKg.toFixed(1));
      setWaistInput(waistCm > 0 ? waistCm.toFixed(1) : '');
      setAgeInput(age.toString());
    } else {
      const inches = heightCm / 2.54;
      const pounds = weightKg * 2.20462;
      const waistInches = waistCm / 2.54;
      setHeightInput(inches.toFixed(0));
      setWeightInput(pounds.toFixed(1));
      setWaistInput(waistCm > 0 ? waistInches.toFixed(1) : '');
      setAgeInput(age.toString());
    }
  }, [unitSystem, heightCm, weightKg, waistCm, age]);

  // Handle unit toggle
  const handleUnitToggle = (newUnit: 'metric' | 'imperial') => {
    if (newUnit === unitSystem) return;
    if (unitSystem === 'imperial' && newUnit === 'metric') {
      const inches = parseFloat(heightInput) || 0;
      const pounds = parseFloat(weightInput) || 0;
      const waistInches = parseFloat(waistInput) || 0;
      setHeightCm(inches * 2.54);
      setWeightKg(pounds / 2.20462);
      setWaistCm(waistInches * 2.54);
    }
    setUnitSystem(newUnit);
  };

  // Parse inputs and update metric values
  const updateFromInputs = useCallback(() => {
    let newHeight = heightCm;
    let newWeight = weightKg;
    let newWaist = waistCm;
    let newAge = age;

    if (unitSystem === 'metric') {
      const h = parseFloat(heightInput);
      if (!isNaN(h) && h > 0) newHeight = h;
      const w = parseFloat(weightInput);
      if (!isNaN(w) && w > 0) newWeight = w;
      const wa = parseFloat(waistInput);
      if (!isNaN(wa) && wa > 0) newWaist = wa;
    } else {
      const inches = parseFloat(heightInput);
      if (!isNaN(inches) && inches > 0) newHeight = inches * 2.54;
      const pounds = parseFloat(weightInput);
      if (!isNaN(pounds) && pounds > 0) newWeight = pounds / 2.20462;
      const waistInches = parseFloat(waistInput);
      if (!isNaN(waistInches) && waistInches > 0) newWaist = waistInches * 2.54;
    }
    const a = parseInt(ageInput, 10);
    if (!isNaN(a) && a > 0) newAge = a;

    setHeightCm(newHeight);
    setWeightKg(newWeight);
    setWaistCm(newWaist);
    setAge(newAge);
    return { heightCm: newHeight, weightKg: newWeight, waistCm: newWaist, age: newAge };
  }, [heightInput, weightInput, waistInput, ageInput, unitSystem, heightCm, weightKg, waistCm, age]);

  // Calculate and add to history
  const handleCalculate = () => {
    const { heightCm: h, weightKg: w, waistCm: wa, age: a } = updateFromInputs();
    if (h <= 0 || w <= 0 || a <= 0) {
      alert('Please enter valid height, weight, and age.');
      return;
    }

    const res = calculateResults(h, w, a, gender, wa);
    setResults(res);

    const entry: HistoryEntry = {
      timestamp: new Date(),
      heightCm: h,
      weightKg: w,
      waistCm: wa,
      age: a,
      gender,
      bmi: res.bmi,
      category: res.category,
    };
    setHistory(prev => [entry, ...prev].slice(0, 10));
  };

  const handleLoadHistory = (entry: HistoryEntry) => {
    setHeightCm(entry.heightCm);
    setWeightKg(entry.weightKg);
    setWaistCm(entry.waistCm);
    setAge(entry.age);
    setGender(entry.gender);
    setUnitSystem('metric');
    const res = calculateResults(entry.heightCm, entry.weightKg, entry.age, entry.gender, entry.waistCm);
    setResults(res);
    setShowHistory(false);
  };

  const handleReset = () => {
    setHeightCm(170);
    setWeightKg(70);
    setWaistCm(0);
    setAge(30);
    setGender('Male');
    setResults(null);
    setUnitSystem('metric');
  };

  const formatNumber = (val: number, decimals: number = 1) => val.toFixed(decimals);
  const getUnitLabels = () => ({
    height: unitSystem === 'metric' ? 'cm' : 'in',
    weight: unitSystem === 'metric' ? 'kg' : 'lb',
    waist: unitSystem === 'metric' ? 'cm' : 'in',
  });
  const labels = getUnitLabels();

  return (
    <>
      <main className={`min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 ${poppins.variable} ${playfair.variable}`}>
        {/* Decorative background elements */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {/* Enhanced Header */}
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-10 md:mb-14"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/50 text-blue-700 text-sm font-medium mb-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Free & Private
            </div>
            <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4 leading-tight ${playfair.className}`}>
              Know Your Numbers,<br />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Own Your Health
              </span>
            </h1>
            <p className={`text-lg md:text-xl text-gray-600 max-w-3xl ${poppins.className}`}>
              Calculate BMI, BMR, body fat percentage, healthy weight range, and daily water intake — 
              all in one place. Track your progress with history.
            </p>
            <div className={`flex flex-wrap gap-3 mt-6 ${poppins.className}`}>
              <Badge>✅ WHO Guidelines</Badge>
              <Badge>🔒 100% Private</Badge>
              <Badge>📈 Track History</Badge>
            </div>
          </motion.header>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Left Column: Inputs */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 md:p-8"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className={`text-2xl font-bold text-gray-800 flex items-center gap-2 ${playfair.className}`}>
                  <span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">📋</span>
                  Your Details
                </h2>
                <div className="flex gap-1">
                  <IconButton onClick={() => setShowHistory(true)} aria-label="History" icon="📜" />
                  <IconButton onClick={handleReset} aria-label="Reset" icon="🔄" />
                </div>
              </div>

              {/* Unit Toggle */}
              <div className="flex justify-center mb-8">
                <div className="inline-flex rounded-full bg-gray-100/80 p-1.5 backdrop-blur-sm">
                  {(['metric', 'imperial'] as const).map((unit) => (
                    <button
                      key={unit}
                      onClick={() => handleUnitToggle(unit)}
                      className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                        unitSystem === unit
                          ? 'bg-white text-blue-600 shadow-md'
                          : 'text-gray-600 hover:bg-white/50'
                      }`}
                    >
                      {unit === 'metric' ? '📏 Metric (cm/kg)' : '📐 Imperial (in/lb)'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gender Selector */}
              <div className="mb-8">
                <label className={`block text-sm font-semibold text-gray-700 mb-3 ${poppins.className}`}>
                  Gender
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['Male', 'Female', 'Other'].map((g) => (
                    <button
                      key={g}
                      onClick={() => setGender(g)}
                      className={`py-3 px-4 rounded-xl border-2 transition-all duration-200 font-medium ${
                        gender === g
                          ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200'
                          : 'bg-white/50 border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-white'
                      }`}
                    >
                      {g === 'Male' ? '♂️' : g === 'Female' ? '♀️' : '⚧️'} {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Fields */}
              <div className="space-y-6">
                <InputField
                  label="Age"
                  value={ageInput}
                  onChange={setAgeInput}
                  unit="years"
                  icon="🎂"
                  min={15}
                  max={100}
                  step={1}
                />
                <InputField
                  label="Height"
                  value={heightInput}
                  onChange={setHeightInput}
                  unit={labels.height}
                  icon="📏"
                  min={unitSystem === 'metric' ? 100 : 39}
                  max={unitSystem === 'metric' ? 250 : 98}
                  step={0.1}
                />
                <InputField
                  label="Weight"
                  value={weightInput}
                  onChange={setWeightInput}
                  unit={labels.weight}
                  icon="⚖️"
                  min={unitSystem === 'metric' ? 30 : 66}
                  max={unitSystem === 'metric' ? 200 : 440}
                  step={0.1}
                />
                <InputField
                  label="Waist (optional)"
                  value={waistInput}
                  onChange={setWaistInput}
                  unit={labels.waist}
                  icon="📐"
                  min={unitSystem === 'metric' ? 50 : 20}
                  max={unitSystem === 'metric' ? 150 : 59}
                  step={0.1}
                  placeholder="Optional"
                />
              </div>

              <button
                onClick={handleCalculate}
                className={`w-full mt-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 ${poppins.className}`}
              >
                🔍 Calculate My Health Metrics
              </button>
            </motion.div>

            {/* Right Column: Results */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 md:p-8"
            >
              <h2 className={`text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2 ${playfair.className}`}>
                <span className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">📊</span>
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
                    <p className={`text-lg ${poppins.className}`}>Enter your details and click "Calculate" to see your health metrics.</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    {/* BMI Card */}
                    <div className="flex items-start gap-5 mb-8 p-5 bg-gradient-to-br from-white to-gray-50/50 rounded-2xl border border-gray-100">
                      <div className="flex-1">
                        <p className={`text-sm font-medium text-gray-500 mb-1 ${poppins.className}`}>Your BMI</p>
                        <p className={`text-5xl font-bold text-gray-800 ${playfair.className}`}>{formatNumber(results.bmi)}</p>
                        <div
                          className="mt-3 inline-block px-4 py-1.5 rounded-full text-white text-sm font-semibold shadow-sm"
                          style={{ backgroundColor: results.categoryColor }}
                        >
                          {results.category}
                        </div>
                      </div>
                      <div className="w-28 h-28">
                        <BMIGauge bmi={results.bmi} color={results.categoryColor} />
                      </div>
                    </div>

                    {/* Advice Box */}
                    <div
                      className="mb-8 p-5 rounded-2xl border-l-4"
                      style={{
                        backgroundColor: BMI_CATEGORIES.find(c => c.label === results.category)?.bgLight,
                        borderLeftColor: results.categoryColor,
                      }}
                    >
                      <p className={`text-gray-700 font-medium ${poppins.className}`}>
                        💡 {results.advice}
                      </p>
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <MetricCard label="BMR" value={`${Math.round(results.bmr)} kcal`} icon="🔥" color="orange" />
                      <MetricCard label="Healthy Weight" value={`${formatNumber(results.healthyMin)} – ${formatNumber(results.healthyMax)} kg`} icon="⚖️" color="green" />
                      <MetricCard label="Body Fat" value={`${formatNumber(results.bodyFat)}%`} icon="💪" color="purple" />
                      <MetricCard label="Water Intake" value={`${formatNumber(results.waterIntake)} L/day`} icon="💧" color="blue" />
                      {results.whtr > 0 && (
                        <MetricCard label="Waist-to-Height" value={formatNumber(results.whtr, 2)} icon="📐" color="teal" />
                      )}
                    </div>

                    {/* CTA */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="mt-8 p-5 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100"
                    >
                      <p className={`text-sm font-medium text-gray-800 mb-2 ${poppins.className}`}>
                        🚀 Ready for a personalized health plan?
                      </p>
                      <button className={`text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg ${poppins.className}`}>
                        Take Full Assessment →
                      </button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Educational Sections */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 grid md:grid-cols-2 gap-6"
          >
            <InfoCard
              title="📖 Why These Metrics Matter"
              content={
                <>
                  <p className="mb-4"><strong>BMI</strong> is a screening tool for weight categories. <strong>BMR</strong> tells you calories burned at rest. <strong>Body fat percentage</strong> gives a clearer picture of fitness than weight alone. <strong>Waist-to-height ratio</strong> helps assess abdominal fat risk.</p>
                  <p className="text-gray-600">Use these numbers as a starting point for conversations with healthcare professionals.</p>
                </>
              }
            />
            <InfoCard
              title="❓ Frequently Asked Questions"
              content={
                <div className="space-y-4">
                  <div><strong className="text-gray-800">Is BMI accurate for everyone?</strong> BMI doesn't account for muscle mass. Athletes may have high BMI but low body fat.</div>
                  <div><strong className="text-gray-800">How much water should I drink?</strong> The 33 ml/kg guideline is a baseline. Adjust for activity level and climate.</div>
                  <div><strong className="text-gray-800">What's a healthy waist-to-height ratio?</strong> Aim for less than 0.5 to reduce health risks.</div>
                </div>
              }
            />
          </motion.div>

          <div className="mt-10 text-center">
            <p className="text-sm text-gray-500 bg-white/50 backdrop-blur-sm inline-block px-6 py-2 rounded-full">
              ⚠️ Medical Disclaimer: This calculator provides estimates for educational purposes only. Consult a healthcare provider for medical advice.
            </p>
          </div>
        </div>

        {/* History Modal */}
        <HistoryPanel
          isOpen={showHistory}
          onClose={() => setShowHistory(false)}
          history={history}
          onSelect={handleLoadHistory}
        />
      </main>
    </>
  );
}

// ----------------------------------------------------------------------------
// Enhanced Sub-components
// ----------------------------------------------------------------------------
function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 text-sm bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm border border-white/50">
      {children}
    </span>
  );
}

function IconButton({ onClick, icon, ariaLabel }: { onClick: () => void; icon: string; ariaLabel: string }) {
  return (
    <button
      onClick={onClick}
      className="p-2.5 rounded-full hover:bg-white/80 text-gray-600 hover:text-blue-600 transition-all duration-200 shadow-sm hover:shadow"
      aria-label={ariaLabel}
    >
      {icon}
    </button>
  );
}

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  unit: string;
  icon: string;
  min: number;
  max: number;
  step: number;
  placeholder?: string;
}

function InputField({ label, value, onChange, unit, icon, min, max, step, placeholder }: InputFieldProps) {
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
          min={min}
          max={max}
          step={step}
          placeholder={placeholder}
          className={`w-full px-5 py-3 pr-14 rounded-xl border-2 border-gray-200 bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 group-hover:border-blue-200 ${poppins.className}`}
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">{unit}</span>
      </div>
    </div>
  );
}

function MetricCard({ label, value, icon, color }: { label: string; value: string; icon: string; color: string }) {
  const colorMap: Record<string, string> = {
    orange: 'bg-orange-50 border-orange-100 text-orange-700',
    green: 'bg-green-50 border-green-100 text-green-700',
    purple: 'bg-purple-50 border-purple-100 text-purple-700',
    blue: 'bg-blue-50 border-blue-100 text-blue-700',
    teal: 'bg-teal-50 border-teal-100 text-teal-700',
  };
  return (
    <div className={`p-4 rounded-xl border ${colorMap[color] || 'bg-gray-50 border-gray-100'} transition-transform hover:scale-[1.02]`}>
      <div className="text-xl mb-1">{icon}</div>
      <p className="text-xs font-medium text-gray-500 mb-0.5">{label}</p>
      <p className="font-semibold text-gray-800">{value}</p>
    </div>
  );
}

function InfoCard({ title, content }: { title: string; content: React.ReactNode }) {
  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-sm hover:shadow-md transition-shadow">
      <h3 className={`text-xl font-bold text-gray-800 mb-4 flex items-center gap-2 ${playfair.className}`}>
        {title}
      </h3>
      <div className={`text-gray-700 space-y-2 ${poppins.className}`}>{content}</div>
    </div>
  );
}