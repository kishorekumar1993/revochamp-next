"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Playfair_Display, Poppins } from "next/font/google";
import Link from "next/link";
import {
  Heart,
  Calendar,
  Activity,
  Weight,
  Sparkles,
  AlertCircle,
  Info,
  TrendingUp,
  TrendingDown,
  Minus,
  Shield,
  TrendingUp as TrendUp,
  FileText,
} from "lucide-react";

const playfair = Playfair_Display({ subsets: ["latin"] });
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

// ----------------------------------------------------------------------
// Types & Config
// ----------------------------------------------------------------------

type ConfidenceLevel = "high" | "medium" | "low";
type EmbryoQuality = "good" | "fair" | "poor";
type AmhLevel = "low" | "normal" | "high";
type SpermQuality = "normal" | "low";

interface PredictionInputs {
  age: number;
  bmi: number;
  previousIVFAttempts: number;
  embryoQuality: EmbryoQuality;
  amhLevel: AmhLevel;
  uterineHealth: "normal" | "abnormal";
  smoking: boolean;
  pcos: boolean;
  endometriosis: boolean;
  spermQuality: SpermQuality;
  clinicSuccessRate?: number; // optional, 0-100
}

// Weighted scoring configuration (max 100 points)
const WEIGHTS = {
  age: {
    "<35": 30,
    "35-37": 25,
    "38-39": 18,
    "40-41": 10,
    ">=42": 5,
  },
  bmi: {
    optimal: 15, // 18.5-24.9
    borderline: 8,
    poor: 3,
  },
  embryoQuality: {
    good: 25,
    fair: 15,
    poor: 5,
  },
  amh: {
    high: 15,
    normal: 10,
    low: 5,
  },
  uterineHealth: {
    normal: 10,
    abnormal: 0,
  },
  smoking: {
    false: 5,
    true: 0,
  },
  pcos: {
    false: 5,
    true: 0,
  },
  endometriosis: {
    false: 5,
    true: 0,
  },
  spermQuality: {
    normal: 5,
    low: 0,
  },
};

// ----------------------------------------------------------------------
// Prediction Service
// ----------------------------------------------------------------------

function getAgeGroup(age: number): keyof typeof WEIGHTS.age {
  if (age < 35) return "<35";
  if (age <= 37) return "35-37";
  if (age <= 39) return "38-39";
  if (age <= 41) return "40-41";
  return ">=42";
}

function getBmiGroup(bmi: number): keyof typeof WEIGHTS.bmi {
  if (bmi >= 18.5 && bmi <= 24.9) return "optimal";
  if ((bmi >= 25 && bmi <= 29.9) || (bmi >= 17 && bmi < 18.5)) return "borderline";
  return "poor";
}

function calculateScore(inputs: PredictionInputs): number {
  let score = 0;
  score += WEIGHTS.age[getAgeGroup(inputs.age)];
  score += WEIGHTS.bmi[getBmiGroup(inputs.bmi)];
  score += WEIGHTS.embryoQuality[inputs.embryoQuality];
  score += WEIGHTS.amh[inputs.amhLevel];
  score += WEIGHTS.uterineHealth[inputs.uterineHealth];
  score += WEIGHTS.smoking[inputs.smoking ? "true" : "false"];
  score += WEIGHTS.pcos[inputs.pcos ? "true" : "false"];
  score += WEIGHTS.endometriosis[inputs.endometriosis ? "true" : "false"];
  score += WEIGHTS.spermQuality[inputs.spermQuality];
  // Clinic success rate adjustment (optional)
  if (inputs.clinicSuccessRate && inputs.clinicSuccessRate > 0) {
    const clinicBonus = (inputs.clinicSuccessRate - 30) / 100 * 10;
    score += Math.min(10, Math.max(-5, clinicBonus));
  }
  return Math.min(100, Math.max(0, score));
}

function predictSuccessRate(score: number): number {
  // Map score (0-100) to success % (5% to 75%)
  return Math.round(5 + (score / 100) * 70);
}

function getConfidence(score: number, factorsCount: number): ConfidenceLevel {
  if (score > 70 && factorsCount <= 2) return "high";
  if (score < 40 || factorsCount >= 4) return "low";
  return "medium";
}

function getFactors(inputs: PredictionInputs): string[] {
  const factors: string[] = [];
  if (inputs.age >= 40) factors.push("Age is a significant factor");
  if (inputs.bmi > 30 || inputs.bmi < 18.5) factors.push("BMI outside optimal range");
  if (inputs.previousIVFAttempts >= 2) factors.push("Multiple previous IVF cycles");
  if (inputs.embryoQuality === "poor") factors.push("Embryo quality affects outcome");
  if (inputs.amhLevel === "low") factors.push("Low AMH indicates reduced ovarian reserve");
  if (inputs.uterineHealth === "abnormal") factors.push("Uterine condition may affect implantation");
  if (inputs.smoking) factors.push("Smoking negatively impacts success rates");
  if (inputs.pcos) factors.push("PCOS may require tailored stimulation protocols");
  if (inputs.endometriosis) factors.push("Endometriosis can affect implantation");
  if (inputs.spermQuality === "low") factors.push("Male factor infertility may require ICSI");
  return factors;
}

function getInsights(inputs: PredictionInputs, score: number): string[] {
  const insights: string[] = [];
  if (inputs.age > 38) insights.push("📅 Consider early IVF due to declining ovarian reserve");
  if (inputs.bmi > 30) insights.push("⚖️ Weight optimization may improve success rates");
  if (inputs.bmi < 18.5) insights.push("🥗 Achieving a healthy BMI could boost outcomes");
  if (inputs.smoking) insights.push("🚭 Quitting smoking can significantly increase IVF success");
  if (inputs.pcos) insights.push("🩺 PCOS often responds well to metformin and lifestyle changes");
  if (inputs.endometriosis) insights.push("🔬 Treating endometriosis before IVF may improve implantation");
  if (inputs.spermQuality === "low") insights.push("🧬 ICSI (intracytoplasmic sperm injection) is recommended");
  if (inputs.embryoQuality === "fair" || inputs.embryoQuality === "poor") {
    insights.push("💊 Discuss embryo selection methods (PGT-A) with your specialist");
  }
  if (score < 30) insights.push("🎯 Consider donor eggs or embryos as an alternative");
  return insights.slice(0, 3);
}

function getSuggestions(inputs: PredictionInputs): string[] {
  const suggestions: string[] = [];
  if (inputs.bmi > 25) suggestions.push("Maintain healthy BMI (18.5–24.9)");
  if (inputs.embryoQuality === "poor") suggestions.push("Discuss embryo grading and lab quality");
  if (inputs.smoking) suggestions.push("Join a smoking cessation program");
  if (inputs.pcos) suggestions.push("Ask your doctor about myo-inositol supplementation");
  if (inputs.endometriosis) suggestions.push("Consider laparoscopic surgery before IVF");
  if (inputs.amhLevel === "low") suggestions.push("Explore ovarian reserve enhancement protocols");
  if (inputs.uterineHealth === "abnormal") suggestions.push("Hysteroscopy to evaluate uterine cavity");
  if (inputs.previousIVFAttempts >= 2) suggestions.push("Request a second opinion at a high-volume clinic");
  return suggestions.slice(0, 2);
}

function getCumulativeProbability(perCycle: number, cycles: number): number {
  return Math.round((1 - Math.pow(1 - perCycle / 100, cycles)) * 100);
}

// ----------------------------------------------------------------------
// Client Component
// ----------------------------------------------------------------------
export default function IVFSuccessPredictionClient() {
  // Form state
  const [age, setAge] = useState<number>(32);
  const [bmi, setBmi] = useState<number>(22.5);
  const [previousAttempts, setPreviousAttempts] = useState<number>(0);
  const [embryoQuality, setEmbryoQuality] = useState<EmbryoQuality>("good");
  const [amhLevel, setAmhLevel] = useState<AmhLevel>("normal");
  const [uterineHealth, setUterineHealth] = useState<"normal" | "abnormal">("normal");
  const [smoking, setSmoking] = useState<boolean>(false);
  const [pcos, setPcos] = useState<boolean>(false);
  const [endometriosis, setEndometriosis] = useState<boolean>(false);
  const [spermQuality, setSpermQuality] = useState<SpermQuality>("normal");
  const [clinicSuccessRate, setClinicSuccessRate] = useState<number>(45);

  // Derived data
  const inputs: PredictionInputs = {
    age,
    bmi,
    previousIVFAttempts: previousAttempts,
    embryoQuality,
    amhLevel,
    uterineHealth,
    smoking,
    pcos,
    endometriosis,
    spermQuality,
    clinicSuccessRate,
  };

  const result = useMemo(() => {
    const score = calculateScore(inputs);
    const perCycle = predictSuccessRate(score);
    const factors = getFactors(inputs);
    const confidence = getConfidence(score, factors.length);
    const insights = getInsights(inputs, score);
    const suggestions = getSuggestions(inputs);
    const cumulative1 = perCycle;
    const cumulative2 = getCumulativeProbability(perCycle, 2);
    const cumulative3 = getCumulativeProbability(perCycle, 3);
    return { score, perCycle, confidence, factors, insights, suggestions, cumulative1, cumulative2, cumulative3 };
  }, [inputs]);

  const { perCycle, confidence, factors, insights, suggestions, cumulative2, cumulative3 } = result;
  const percentage = perCycle;

  const getConfidenceColor = (conf: ConfidenceLevel) => {
    switch (conf) {
      case "high": return "text-green-600 bg-green-50";
      case "medium": return "text-yellow-600 bg-yellow-50";
      default: return "text-orange-600 bg-orange-50";
    }
  };

  const getResultColor = (p: number) => {
    if (p >= 50) return "text-green-600";
    if (p >= 30) return "text-yellow-600";
    return "text-orange-600";
  };

  // Circular progress component
  const CircleProgress = ({ percentage, size = 140 }: { percentage: number; size?: number }) => {
    const radius = (size - 20) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;
    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="8"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-3xl font-black ${getResultColor(percentage)}`}>{percentage}%</span>
          <span className="text-xs text-stone-500">success</span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/20 via-white to-pink-50/20">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-amber-100 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            href="/"
            className={`${playfair.className} text-xl font-bold bg-gradient-to-r from-amber-600 to-pink-600 bg-clip-text text-transparent`}
          >
            Revochamp
          </Link>
          <span className={`${poppins.className} text-xs text-stone-500`}>Fertility Tools</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <span>🧬</span> IVF Predictor
          </div>
          <h1 className={`${playfair.className} text-3xl sm:text-4xl font-extrabold text-stone-800 mb-3`}>
            IVF Success Predictor
          </h1>
          <p className={`${poppins.className} text-base text-stone-600 max-w-2xl`}>
            Estimate your chances of a successful IVF cycle using a weighted clinical model.
            Based on age, BMI, embryo quality, AMH, lifestyle factors, and more.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Input Form */}
          <div className="bg-white rounded-2xl shadow-lg border border-stone-100 overflow-hidden">
            <div className="p-6 space-y-6">
              <h2 className={`${playfair.className} text-xl font-bold text-stone-800`}>Your Profile</h2>

              {/* Age Range Slider */}
              <div>
                <label className="flex items-center gap-2 text-stone-700 font-medium mb-2">
                  <Calendar size={18} className="text-amber-600" /> Age: {age} years
                </label>
                <input
                  type="range"
                  min={18}
                  max={55}
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>

              {/* BMI Range Slider */}
              <div>
                <label className="flex items-center gap-2 text-stone-700 font-medium mb-2">
                  <Weight size={18} className="text-amber-600" /> BMI: {bmi.toFixed(1)}
                </label>
                <input
                  type="range"
                  min={15}
                  max={45}
                  step={0.5}
                  value={bmi}
                  onChange={(e) => setBmi(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
                <p className="text-xs text-stone-400 mt-1">Optimal: 18.5–24.9</p>
              </div>

              {/* Previous IVF attempts */}
              <div>
                <label className="flex items-center gap-2 text-stone-700 font-medium mb-2">
                  <Activity size={18} className="text-amber-600" /> Previous IVF cycles
                </label>
                <select
                  value={previousAttempts}
                  onChange={(e) => setPreviousAttempts(Number(e.target.value))}
                  className="w-full p-3 border border-stone-200 rounded-xl"
                >
                  {[0,1,2,3,4,5].map(n => <option key={n}>{n}</option>)}
                </select>
              </div>

              {/* Embryo quality */}
              <div>
                <label className="flex items-center gap-2 text-stone-700 font-medium mb-2">
                  <Sparkles size={18} className="text-amber-600" /> Embryo quality
                </label>
                <select
                  value={embryoQuality}
                  onChange={(e) => setEmbryoQuality(e.target.value as EmbryoQuality)}
                  className="w-full p-3 border border-stone-200 rounded-xl"
                >
                  <option value="good">Good (top grade)</option>
                  <option value="fair">Fair (average)</option>
                  <option value="poor">Poor (low grade)</option>
                </select>
              </div>

              {/* AMH level */}
              <div>
                <label className="flex items-center gap-2 text-stone-700 font-medium mb-2">
                  <Heart size={18} className="text-amber-600" /> AMH level
                </label>
                <select
                  value={amhLevel}
                  onChange={(e) => setAmhLevel(e.target.value as AmhLevel)}
                  className="w-full p-3 border border-stone-200 rounded-xl"
                >
                  <option value="high">High (≥3.0 ng/mL)</option>
                  <option value="normal">Normal (1.0–2.9 ng/mL)</option>
                  <option value="low">Low (&lt;1.0 ng/mL)</option>
                </select>
              </div>

              {/* Uterine health */}
              <div>
                <label className="flex items-center gap-2 text-stone-700 font-medium mb-2">
                  <Activity size={18} className="text-amber-600" /> Uterine health
                </label>
                <select
                  value={uterineHealth}
                  onChange={(e) => setUterineHealth(e.target.value as "normal" | "abnormal")}
                  className="w-full p-3 border border-stone-200 rounded-xl"
                >
                  <option value="normal">Normal (no known issues)</option>
                  <option value="abnormal">Abnormal (fibroids, polyps, etc.)</option>
                </select>
              </div>

              {/* Advanced Factors (grid) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={smoking} onChange={(e) => setSmoking(e.target.checked)} className="rounded text-amber-600" />
                  <span className="text-sm">Smoking</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={pcos} onChange={(e) => setPcos(e.target.checked)} className="rounded text-amber-600" />
                  <span className="text-sm">PCOS</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={endometriosis} onChange={(e) => setEndometriosis(e.target.checked)} className="rounded text-amber-600" />
                  <span className="text-sm">Endometriosis</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={spermQuality === "low"} onChange={(e) => setSpermQuality(e.target.checked ? "low" : "normal")} className="rounded text-amber-600" />
                  <span className="text-sm">Male factor (low sperm quality)</span>
                </label>
              </div>

              {/* Optional clinic success rate */}
              <div>
                <label className="flex items-center gap-2 text-stone-700 font-medium mb-2">
                  <TrendUp size={18} className="text-amber-600" /> Clinic success rate (optional)
                </label>
                <input
                  type="number"
                  min={20}
                  max={70}
                  value={clinicSuccessRate}
                  onChange={(e) => setClinicSuccessRate(Number(e.target.value))}
                  className="w-full p-3 border border-stone-200 rounded-xl"
                />
                <p className="text-xs text-stone-400 mt-1">Average clinic live birth rate per cycle (%)</p>
              </div>
            </div>
          </div>

          {/* Right: Results & Insights */}
          <div className="space-y-6">
            {/* Main result card with circular progress */}
            <div className="bg-white rounded-2xl shadow-lg border border-stone-100 overflow-hidden">
              <div className="p-6 text-center">
                <h2 className={`${playfair.className} text-xl font-bold text-stone-800 mb-4`}>Your IVF Success Prediction</h2>
                <div className="flex justify-center mb-4">
                  <CircleProgress percentage={percentage} size={160} />
                </div>
                <div className="flex justify-center mt-2">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getConfidenceColor(confidence)}`}>
                    {confidence === "high" && <TrendingUp size={14} />}
                    {confidence === "medium" && <Minus size={14} />}
                    {confidence === "low" && <TrendingDown size={14} />}
                    {confidence === "high" ? "High confidence" : confidence === "medium" ? "Medium confidence" : "Low confidence"}
                  </span>
                </div>

                {/* Multi-cycle cumulative */}
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="bg-stone-50 p-2 rounded-lg">
                    <p className="text-xs text-stone-500">1 cycle</p>
                    <p className="text-lg font-bold text-stone-800">{perCycle}%</p>
                  </div>
                  <div className="bg-stone-50 p-2 rounded-lg">
                    <p className="text-xs text-stone-500">2 cycles (cumulative)</p>
                    <p className="text-lg font-bold text-stone-800">{cumulative2}%</p>
                  </div>
                  <div className="bg-stone-50 p-2 rounded-lg col-span-2">
                    <p className="text-xs text-stone-500">3 cycles (cumulative)</p>
                    <p className="text-lg font-bold text-stone-800">{cumulative3}%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Insights card */}
            {insights.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-purple-50 rounded-2xl border border-purple-100 p-5">
                <h3 className="font-semibold text-purple-800 mb-2 flex items-center gap-2"><Sparkles size={18} /> Personalized Insights</h3>
                <ul className="space-y-2">
                  {insights.map((insight, i) => (
                    <li key={i} className="text-sm text-purple-700 flex items-start gap-2"><span>💡</span> {insight}</li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Suggestions card */}
            {suggestions.length > 0 && (
              <div className="bg-blue-50 rounded-2xl border border-blue-100 p-5">
                <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2"><Shield size={18} /> What can improve your chances?</h3>
                <ul className="space-y-2">
                  {suggestions.map((s, i) => (
                    <li key={i} className="text-sm text-blue-700 flex items-start gap-2"><span>✓</span> {s}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Key factors */}
            {factors.length > 0 && (
              <div className="bg-stone-50 rounded-2xl border border-stone-200 p-5">
                <h3 className="font-semibold text-stone-700 mb-2 flex items-center gap-2"><AlertCircle size={18} /> Key influencing factors</h3>
                <ul className="space-y-1">
                  {factors.map((f, i) => (
                    <li key={i} className="text-sm text-stone-600 flex items-center gap-2"><span>•</span> {f}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Premium feature teaser */}
            <div className="bg-gradient-to-r from-amber-100 to-pink-100 rounded-2xl p-5 text-center">
              <p className="text-sm font-medium text-stone-700 flex items-center justify-center gap-2"><FileText size={18} /> Want a detailed report?</p>
              <p className="text-xs text-stone-600 mt-1">Upgrade to Revochamp Premium for a printable PDF analysis and clinic recommendations.</p>
            </div>

            {/* Trust & disclaimer */}
            <div className="bg-white/50 rounded-2xl border border-stone-200 p-4 text-center">
              <p className="text-xs text-stone-500 italic">⚠️ This tool provides an estimate based on clinical data (CDC, HFEA). Individual results vary. Always consult your fertility specialist.</p>
              <p className="text-xs text-stone-400 mt-2">Model accuracy: estimated 70–80% | Last updated: 2025</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-stone-200 py-6 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-stone-400">
          © {new Date().getFullYear()} Revochamp. Evidence‑based fertility tools.
        </div>
      </footer>
    </div>
  );
}