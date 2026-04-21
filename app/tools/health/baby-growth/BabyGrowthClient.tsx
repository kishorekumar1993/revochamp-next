"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Playfair_Display, Poppins } from "next/font/google";
import Link from "next/link";
import {
  Baby,
  Calendar,
  Weight,
  Ruler,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertCircle,
  Info,
  LineChart,
  Save,
  Trash2,
  History,
} from "lucide-react";

const playfair = Playfair_Display({ subsets: ["latin"] });
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

// ----------------------------------------------------------------------
// WHO Growth Reference (simplified LMS approximation)
// ----------------------------------------------------------------------
interface GrowthData {
  ageMonths: number;
  weightMedian: number;
  weightSD: number;
  heightMedian: number;
  heightSD: number;
}

const growthData: GrowthData[] = [
  { ageMonths: 0, weightMedian: 3.3, weightSD: 0.4, heightMedian: 49.5, heightSD: 1.9 },
  { ageMonths: 1, weightMedian: 4.5, weightSD: 0.5, heightMedian: 54.0, heightSD: 2.0 },
  { ageMonths: 2, weightMedian: 5.6, weightSD: 0.6, heightMedian: 58.0, heightSD: 2.1 },
  { ageMonths: 3, weightMedian: 6.4, weightSD: 0.7, heightMedian: 61.5, heightSD: 2.2 },
  { ageMonths: 4, weightMedian: 7.0, weightSD: 0.7, heightMedian: 64.0, heightSD: 2.3 },
  { ageMonths: 5, weightMedian: 7.5, weightSD: 0.8, heightMedian: 66.5, heightSD: 2.3 },
  { ageMonths: 6, weightMedian: 7.9, weightSD: 0.8, heightMedian: 68.5, heightSD: 2.4 },
  { ageMonths: 9, weightMedian: 8.9, weightSD: 0.9, heightMedian: 74.0, heightSD: 2.5 },
  { ageMonths: 12, weightMedian: 9.6, weightSD: 1.0, heightMedian: 78.0, heightSD: 2.6 },
  { ageMonths: 15, weightMedian: 10.2, weightSD: 1.1, heightMedian: 81.5, heightSD: 2.7 },
  { ageMonths: 18, weightMedian: 10.8, weightSD: 1.2, heightMedian: 84.5, heightSD: 2.8 },
  { ageMonths: 21, weightMedian: 11.3, weightSD: 1.2, heightMedian: 87.5, heightSD: 2.9 },
  { ageMonths: 24, weightMedian: 11.8, weightSD: 1.3, heightMedian: 90.0, heightSD: 3.0 },
];

function interpolateGrowth(ageMonths: number): GrowthData {
  if (ageMonths <= 0) return growthData[0];
  if (ageMonths >= 24) return growthData[growthData.length - 1];
  const idx = growthData.findIndex(d => d.ageMonths >= ageMonths);
  if (idx === 0) return growthData[0];
  const prev = growthData[idx - 1];
  const next = growthData[idx];
  const t = (ageMonths - prev.ageMonths) / (next.ageMonths - prev.ageMonths);
  return {
    ageMonths,
    weightMedian: prev.weightMedian + t * (next.weightMedian - prev.weightMedian),
    weightSD: prev.weightSD + t * (next.weightSD - prev.weightSD),
    heightMedian: prev.heightMedian + t * (next.heightMedian - prev.heightMedian),
    heightSD: prev.heightSD + t * (next.heightSD - prev.heightSD),
  };
}

function computePercentile(value: number, median: number, sd: number): number {
  const z = (value - median) / sd;
  const percentile = 0.5 * (1 + erf(z / Math.sqrt(2)));
  return Math.min(99.9, Math.max(0.1, percentile * 100));
}

function erf(x: number): number {
  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x);
  const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741;
  const a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911;
  const t = 1 / (1 + p * x);
  const y = 1 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  return sign * y;
}

function getPercentileCategory(percentile: number): { label: string; color: string; icon: JSX.Element; advice: string } {
  if (percentile < 3) return {
    label: "Underweight / Stunted",
    color: "text-red-600",
    icon: <TrendingDown size={16} />,
    advice: "Consult your paediatrician. Consider nutrition assessment."
  };
  if (percentile < 15) return {
    label: "Low",
    color: "text-orange-500",
    icon: <TrendingDown size={16} />,
    advice: "Monitor feeding and weight gain. Regular check-ups advised."
  };
  if (percentile <= 85) return {
    label: "Normal",
    color: "text-green-600",
    icon: <Minus size={16} />,
    advice: "Your baby is growing well. Continue healthy feeding."
  };
  if (percentile <= 97) return {
    label: "High",
    color: "text-yellow-600",
    icon: <TrendingUp size={16} />,
    advice: "Healthy range but monitor for rapid gain."
  };
  return {
    label: "Very High",
    color: "text-red-600",
    icon: <TrendingUp size={16} />,
    advice: "Consult your paediatrician to rule out underlying issues."
  };
}

// ----------------------------------------------------------------------
// Growth Record Type & Local Storage
// ----------------------------------------------------------------------
interface GrowthRecord {
  id: string;
  date: string; // ISO date
  ageMonths: number;
  weightKg: number;
  heightCm: number;
  weightPercentile: number;
  heightPercentile: number;
}

function saveRecord(record: GrowthRecord) {
  const stored = localStorage.getItem("babyGrowthRecords");
  const records: GrowthRecord[] = stored ? JSON.parse(stored) : [];
  records.push(record);
  localStorage.setItem("babyGrowthRecords", JSON.stringify(records));
}

function getRecords(): GrowthRecord[] {
  const stored = localStorage.getItem("babyGrowthRecords");
  return stored ? JSON.parse(stored) : [];
}

function deleteRecord(id: string) {
  const records = getRecords();
  const filtered = records.filter(r => r.id !== id);
  localStorage.setItem("babyGrowthRecords", JSON.stringify(filtered));
}

// ----------------------------------------------------------------------
// Simple Growth Chart (SVG with tooltip effect)
// ----------------------------------------------------------------------
function GrowthChart({ records, measurementType }: { records: GrowthRecord[]; measurementType: "weight" | "height" }) {
  if (records.length === 0) return <div className="text-center text-stone-400 py-8">No data yet. Save a measurement to see the chart.</div>;

  const sorted = [...records].sort((a, b) => a.ageMonths - b.ageMonths);
  const width = 500, height = 300, padding = 40;
  const chartWidth = width - 2 * padding;
  const chartHeight = height - 2 * padding;

  const maxAge = 24;
  const minValue = measurementType === "weight" ? 2 : 45;
  const maxValue = measurementType === "weight" ? 15 : 100;

  const toX = (age: number) => padding + (age / maxAge) * chartWidth;
  const toY = (val: number) => padding + chartHeight - ((val - minValue) / (maxValue - minValue)) * chartHeight;

  // Generate percentile curves (3rd, 15th, 50th, 85th, 97th)
  const percentiles = [3, 15, 50, 85, 97];
  const curves = percentiles.map(p => {
    const points = growthData.map(data => {
      const median = measurementType === "weight" ? data.weightMedian : data.heightMedian;
      const sd = measurementType === "weight" ? data.weightSD : data.heightSD;
      let z = 0;
      if (p === 3) z = -1.88;
      else if (p === 15) z = -1.04;
      else if (p === 50) z = 0;
      else if (p === 85) z = 1.04;
      else if (p === 97) z = 1.88;
      const value = median + z * sd;
      return { x: data.ageMonths, y: value };
    });
    return { percentile: p, points };
  });

  // User points
  const userPoints = sorted.map(record => ({
    x: record.ageMonths,
    y: measurementType === "weight" ? record.weightKg : record.heightCm,
    percentile: measurementType === "weight" ? record.weightPercentile : record.heightPercentile,
    date: record.date,
  }));

  return (
    <div className="overflow-x-auto">
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="mx-auto">
        {/* Axes */}
        <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#ccc" strokeWidth="1" />
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#ccc" strokeWidth="1" />

        {/* X labels */}
        {[0, 3, 6, 9, 12, 15, 18, 21, 24].map(age => (
          <g key={age}>
            <text x={toX(age)} y={height - padding + 15} fontSize="10" textAnchor="middle" fill="#666">{age}m</text>
            <line x1={toX(age)} y1={height - padding} x2={toX(age)} y2={height - padding + 4} stroke="#ccc" strokeWidth="1" />
          </g>
        ))}

        {/* Y labels */}
        {[0, 25, 50, 75, 100].map(pct => {
          const value = minValue + (pct / 100) * (maxValue - minValue);
          const y = toY(value);
          return (
            <g key={pct}>
              <text x={padding - 5} y={y + 3} fontSize="10" textAnchor="end" fill="#666">{value.toFixed(0)}{measurementType === "weight" ? "kg" : "cm"}</text>
              <line x1={padding - 3} y1={y} x2={padding} y2={y} stroke="#ccc" strokeWidth="1" />
            </g>
          );
        })}

        {/* Percentile curves */}
        {curves.map(curve => (
          <polyline
            key={curve.percentile}
            points={curve.points.map(p => `${toX(p.x)},${toY(p.y)}`).join(" ")}
            fill="none"
            stroke={curve.percentile === 50 ? "#f59e0b" : "#cbd5e1"}
            strokeWidth={curve.percentile === 50 ? 2 : 1}
            strokeDasharray={curve.percentile === 50 ? "none" : "4"}
          />
        ))}

        {/* User data points */}
        {userPoints.map((point, idx) => (
          <g key={idx}>
            <circle cx={toX(point.x)} cy={toY(point.y)} r="5" fill="#ec4899" stroke="white" strokeWidth="2" />
            <title>{`${point.date}: ${point.y} (${point.percentile.toFixed(0)}th percentile)`}</title>
          </g>
        ))}
      </svg>
      <p className="text-center text-xs text-stone-400 mt-2">Orange line = 50th percentile (WHO median). Dots = your baby's measurements.</p>
    </div>
  );
}

// ----------------------------------------------------------------------
// FAQ Component with JSON‑LD
// ----------------------------------------------------------------------
function FAQ() {
  const faqs = [
    { q: "What are WHO growth standards?", a: "The World Health Organization (WHO) growth standards describe how healthy children should grow under optimal conditions. They are the international reference for child growth." },
    { q: "How often should I measure my baby?", a: "Typically at well‑child visits: 1, 2, 4, 6, 9, 12, 15, 18, 24 months. More frequent tracking is fine if you're concerned." },
    { q: "What does a low percentile mean?", a: "Below the 3rd percentile may indicate undernutrition or a health issue. Consult your paediatrician for evaluation." },
    { q: "Can I use this for premature babies?", a: "For preemies, use corrected age (age since due date) until 24 months. This tool is designed for term infants." },
    { q: "Is this tool a substitute for medical advice?", a: "No. Always discuss growth with your paediatrician. This tool is for educational purposes." },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(f => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="bg-white rounded-2xl border border-stone-200 p-6 mt-8">
        <h3 className={`${playfair.className} text-2xl font-bold text-stone-800 mb-4`}>Frequently Asked Questions</h3>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <details key={idx} className="group border-b border-stone-100 pb-3">
              <summary className="font-semibold text-stone-700 cursor-pointer hover:text-amber-600 transition-colors">
                {faq.q}
              </summary>
              <p className="text-stone-600 text-sm mt-2 pl-2">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>
    </>
  );
}

// ----------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------
export default function BabyGrowthClient() {
  const [ageMonths, setAgeMonths] = useState<number>(6);
  const [gender, setGender] = useState<"boy" | "girl">("boy");
  const [weightKg, setWeightKg] = useState<number>(7.5);
  const [heightCm, setHeightCm] = useState<number>(68);
  const [records, setRecords] = useState<GrowthRecord[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Load records on mount
  useEffect(() => {
    setRecords(getRecords());
  }, []);

  const growth = useMemo(() => interpolateGrowth(ageMonths), [ageMonths]);
  const weightPercentile = useMemo(() => computePercentile(weightKg, growth.weightMedian, growth.weightSD), [weightKg, growth]);
  const heightPercentile = useMemo(() => computePercentile(heightCm, growth.heightMedian, growth.heightSD), [heightCm, growth]);

  const weightCategory = getPercentileCategory(weightPercentile);
  const heightCategory = getPercentileCategory(heightPercentile);

  const handleSave = () => {
    const newRecord: GrowthRecord = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      ageMonths,
      weightKg,
      heightCm,
      weightPercentile,
      heightPercentile,
    };
    saveRecord(newRecord);
    setRecords(getRecords());
    alert("Measurement saved!");
  };

  const handleDelete = (id: string) => {
    deleteRecord(id);
    setRecords(getRecords());
  };

  const handleAgeChange = (months: number) => {
    setAgeMonths(months);
    const newGrowth = interpolateGrowth(months);
    setWeightKg(parseFloat(newGrowth.weightMedian.toFixed(1)));
    setHeightCm(parseFloat(newGrowth.heightMedian.toFixed(1)));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/20 via-white to-pink-50/20">
      <header className="bg-white/80 backdrop-blur-md border-b border-amber-100 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className={`${playfair.className} text-xl font-bold bg-gradient-to-r from-amber-600 to-pink-600 bg-clip-text text-transparent`}>
            Revochamp
          </Link>
          <span className={`${poppins.className} text-xs text-stone-500`}>Baby Tools</span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <Baby size={16} /> WHO Growth Tracker
          </div>
          <h1 className={`${playfair.className} text-3xl sm:text-4xl font-extrabold text-stone-800 mb-3`}>
            Baby Growth Tracker
          </h1>
          <p className={`${poppins.className} text-base text-stone-600 max-w-2xl`}>
            Monitor your baby's growth using WHO standards. Save multiple measurements, visualise trends, and get personalised advice.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-white rounded-2xl shadow-lg border border-stone-100 p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className={`${playfair.className} text-xl font-bold text-stone-800`}>New Measurement</h2>
              <button onClick={() => setShowHistory(!showHistory)} className="text-amber-600 text-sm flex items-center gap-1">
                <History size={16} /> {showHistory ? "Hide History" : "Show History"}
              </button>
            </div>

            {/* Age slider */}
            <div>
              <label className="flex items-center gap-2 text-stone-700 font-medium mb-2">
                <Calendar size={18} className="text-amber-600" /> Age: {ageMonths} months
              </label>
              <input type="range" min={0} max={24} step={1} value={ageMonths} onChange={(e) => handleAgeChange(Number(e.target.value))} className="w-full accent-amber-500" />
            </div>

            {/* Gender */}
            <div>
              <label className="flex items-center gap-2 text-stone-700 font-medium mb-2">Gender</label>
              <div className="flex gap-3">
                <button onClick={() => setGender("boy")} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${gender === "boy" ? "bg-blue-500 text-white" : "bg-stone-100 text-stone-600"}`}>👦 Boy</button>
                <button onClick={() => setGender("girl")} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${gender === "girl" ? "bg-pink-500 text-white" : "bg-stone-100 text-stone-600"}`}>👧 Girl</button>
              </div>
            </div>

            {/* Weight */}
            <div>
              <label className="flex items-center gap-2 text-stone-700 font-medium mb-2"><Weight size={18} className="text-amber-600" /> Weight (kg)</label>
              <input type="number" step={0.1} value={weightKg} onChange={(e) => setWeightKg(parseFloat(e.target.value))} className="w-full p-3 border border-stone-200 rounded-xl" />
            </div>

            {/* Height */}
            <div>
              <label className="flex items-center gap-2 text-stone-700 font-medium mb-2"><Ruler size={18} className="text-amber-600" /> Height / Length (cm)</label>
              <input type="number" step={0.5} value={heightCm} onChange={(e) => setHeightCm(parseFloat(e.target.value))} className="w-full p-3 border border-stone-200 rounded-xl" />
            </div>

            <button onClick={handleSave} className="w-full bg-gradient-to-r from-amber-500 to-pink-500 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:shadow-lg transition">
              <Save size={18} /> Save Measurement
            </button>

            {/* History list */}
            {showHistory && (
              <div className="border-t pt-4">
                <h3 className="font-semibold text-stone-700 mb-2">Saved Measurements</h3>
                {records.length === 0 && <p className="text-sm text-stone-400">No records yet.</p>}
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {records.map(rec => (
                    <div key={rec.id} className="flex justify-between items-center p-2 bg-stone-50 rounded-lg text-sm">
                      <div>
                        <span className="font-medium">{new Date(rec.date).toLocaleDateString()}</span> – {rec.ageMonths}m, {rec.weightKg}kg, {rec.heightCm}cm
                        <div className="text-xs text-stone-500">Weight: {rec.weightPercentile.toFixed(0)}th, Height: {rec.heightPercentile.toFixed(0)}th</div>
                      </div>
                      <button onClick={() => handleDelete(rec.id)} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Results & Chart */}
          <div className="space-y-6">
            {/* Weight percentile card */}
            <div className="bg-white rounded-2xl shadow-lg border border-stone-100 p-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-stone-500">Weight percentile</p>
                  <p className={`text-3xl font-bold ${weightCategory.color}`}>{weightPercentile.toFixed(1)}%</p>
                  <p className={`text-sm mt-1 flex items-center gap-1 ${weightCategory.color}`}>{weightCategory.icon} {weightCategory.label}</p>
                  <p className="text-xs text-stone-500 mt-2">{weightCategory.advice}</p>
                </div>
                <Weight size={32} className="text-stone-300" />
              </div>
            </div>

            {/* Height percentile card */}
            <div className="bg-white rounded-2xl shadow-lg border border-stone-100 p-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-stone-500">Height percentile</p>
                  <p className={`text-3xl font-bold ${heightCategory.color}`}>{heightPercentile.toFixed(1)}%</p>
                  <p className={`text-sm mt-1 flex items-center gap-1 ${heightCategory.color}`}>{heightCategory.icon} {heightCategory.label}</p>
                  <p className="text-xs text-stone-500 mt-2">{heightCategory.advice}</p>
                </div>
                <Ruler size={32} className="text-stone-300" />
              </div>
            </div>

            {/* Growth chart */}
            <div className="bg-white rounded-2xl shadow-lg border border-stone-100 p-5">
              <h3 className="font-semibold text-stone-700 mb-2 flex items-center gap-2"><LineChart size={18} /> Growth Chart (Weight‑for‑age)</h3>
              <GrowthChart records={records} measurementType="weight" />
            </div>

            <div className="bg-blue-50 rounded-2xl p-4 text-sm text-stone-600">
              <Info size={16} className="inline mr-1 text-blue-600" />
              Based on WHO Child Growth Standards (0‑24 months). Percentiles show how your baby compares to healthy peers.
              Regular tracking helps detect growth issues early.
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <FAQ />

        <div className="mt-6 p-3 bg-stone-50 rounded-lg text-xs text-stone-500 italic text-center">
          ⚠️ This tool provides estimates. Always consult your paediatrician for medical advice.
        </div>
      </main>

      <footer className="border-t border-stone-200 py-6 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-stone-400">
          © {new Date().getFullYear()} Revochamp. WHO‑based growth tracking.
        </div>
      </footer>
    </div>
  );
}