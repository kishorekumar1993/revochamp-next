"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Playfair_Display, Poppins } from "next/font/google";
import Link from "next/link";
import {
  Calendar,
  Heart,
  Droplets,
  CalendarDays,
  TrendingUp,
  AlertCircle,
  Info,
  Save,
  Trash2,
  History,
} from "lucide-react";

const playfair = Playfair_Display({ subsets: ["latin"] });
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

// ----------------------------------------------------------------------
// Types & Helpers
// ----------------------------------------------------------------------
interface CycleRecord {
  id: string;
  date: string; // ISO date of period start
  cycleLength: number;
  periodDuration: number;
  nextPeriodPrediction: string;
  ovulationPrediction: string;
  fertileWindow: { start: string; end: string };
}

function normalize(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, days: number): Date {
  return normalize(new Date(date.getTime() + days * 24 * 60 * 60 * 1000));
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function predictNextPeriod(lmp: Date, cycleLength: number): Date {
  return addDays(lmp, cycleLength);
}

function predictOvulation(lmp: Date, cycleLength: number): Date {
  // Ovulation ~14 days before next period
  const nextPeriod = predictNextPeriod(lmp, cycleLength);
  return addDays(nextPeriod, -14);
}

function predictFertileWindow(ovulation: Date): { start: Date; end: Date } {
  // Fertile window: 5 days before ovulation + ovulation day
  const start = addDays(ovulation, -5);
  const end = ovulation;
  return { start, end };
}

// ----------------------------------------------------------------------
// Local Storage
// ----------------------------------------------------------------------
function saveRecord(record: CycleRecord) {
  const stored = localStorage.getItem("periodRecords");
  const records: CycleRecord[] = stored ? JSON.parse(stored) : [];
  records.push(record);
  localStorage.setItem("periodRecords", JSON.stringify(records));
}

function getRecords(): CycleRecord[] {
  const stored = localStorage.getItem("periodRecords");
  return stored ? JSON.parse(stored) : [];
}

function deleteRecord(id: string) {
  const records = getRecords();
  const filtered = records.filter(r => r.id !== id);
  localStorage.setItem("periodRecords", JSON.stringify(filtered));
}

// ----------------------------------------------------------------------
// FAQ Component with JSON‑LD
// ----------------------------------------------------------------------
function FAQ() {
  const faqs = [
    { q: "How accurate is this period calculator?", a: "It's very accurate if you have a regular cycle (21–35 days). For irregular cycles, predictions are estimates. Track over several months for better accuracy." },
    { q: "What is a normal cycle length?", a: "Typical range is 21–35 days, with 28 days being average. Variations of up to 7 days are common." },
    { q: "When do I ovulate?", a: "Ovulation usually occurs 14 days before your next period. For a 28‑day cycle, that's day 14 (counting from period start)." },
    { q: "Can I get pregnant outside the fertile window?", a: "The fertile window (5 days before ovulation + ovulation day) is the only time pregnancy can occur. Sperm lives up to 5 days." },
    { q: "What if my cycles are irregular?", a: "Use this tool as a guide. For irregular cycles, consider tracking basal body temperature or using ovulation kits." },
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
export default function PeriodCalculatorClient() {
  const [lmpDate, setLmpDate] = useState<Date>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 14); // assume period started 14 days ago
    return d;
  });
  const [cycleLength, setCycleLength] = useState<number>(28);
  const [periodDuration, setPeriodDuration] = useState<number>(5);
  const [records, setRecords] = useState<CycleRecord[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    setRecords(getRecords());
  }, []);

  const nextPeriod = useMemo(() => predictNextPeriod(lmpDate, cycleLength), [lmpDate, cycleLength]);
  const ovulation = useMemo(() => predictOvulation(lmpDate, cycleLength), [lmpDate, cycleLength]);
  const fertileWindow = useMemo(() => predictFertileWindow(ovulation), [ovulation]);

  const today = normalize(new Date());
  const isPeriodSoon = nextPeriod <= addDays(today, 3);
  const isFertileNow = today >= fertileWindow.start && today <= fertileWindow.end;

  const handleSave = () => {
    const record: CycleRecord = {
      id: Date.now().toString(),
      date: lmpDate.toISOString(),
      cycleLength,
      periodDuration,
      nextPeriodPrediction: formatDate(nextPeriod),
      ovulationPrediction: formatDate(ovulation),
      fertileWindow: {
        start: formatDate(fertileWindow.start),
        end: formatDate(fertileWindow.end),
      },
    };
    saveRecord(record);
    setRecords(getRecords());
    alert("Cycle saved!");
  };

  const handleDelete = (id: string) => {
    deleteRecord(id);
    setRecords(getRecords());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/20 via-white to-pink-50/20">
      <header className="bg-white/80 backdrop-blur-md border-b border-amber-100 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className={`${playfair.className} text-xl font-bold bg-gradient-to-r from-amber-600 to-pink-600 bg-clip-text text-transparent`}>
            Revochamp
          </Link>
          <span className={`${poppins.className} text-xs text-stone-500`}>Cycle Tracker</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <Calendar size={16} /> Period & Ovulation
          </div>
          <h1 className={`${playfair.className} text-3xl sm:text-4xl font-extrabold text-stone-800 mb-3`}>
            Period Calculator
          </h1>
          <p className={`${poppins.className} text-base text-stone-600 max-w-2xl`}>
            Predict your next period, ovulation day, and fertile window. Save your cycle history and track patterns over time.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-white rounded-2xl shadow-lg border border-stone-100 p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className={`${playfair.className} text-xl font-bold text-stone-800`}>Cycle Information</h2>
              <button onClick={() => setShowHistory(!showHistory)} className="text-amber-600 text-sm flex items-center gap-1">
                <History size={16} /> {showHistory ? "Hide History" : "Show History"}
              </button>
            </div>

            {/* LMP Date Picker */}
            <div>
              <label className="flex items-center gap-2 text-stone-700 font-medium mb-2">
                <Calendar size={18} className="text-amber-600" /> First day of last period
              </label>
              <input
                type="date"
                value={lmpDate.toISOString().split("T")[0]}
                onChange={(e) => setLmpDate(new Date(e.target.value))}
                className="w-full p-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Cycle Length Slider */}
            <div>
              <label className="flex items-center gap-2 text-stone-700 font-medium mb-2">
                <TrendingUp size={18} className="text-amber-600" /> Cycle length: {cycleLength} days
              </label>
              <input
                type="range"
                min={21}
                max={35}
                step={1}
                value={cycleLength}
                onChange={(e) => setCycleLength(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
              <div className="flex justify-between text-xs text-stone-400 mt-1">
                <span>21</span><span>28</span><span>35</span>
              </div>
            </div>

            {/* Period Duration Slider */}
            <div>
              <label className="flex items-center gap-2 text-stone-700 font-medium mb-2">
                <Droplets size={18} className="text-amber-600" /> Period duration: {periodDuration} days
              </label>
              <input
                type="range"
                min={2}
                max={8}
                step={1}
                value={periodDuration}
                onChange={(e) => setPeriodDuration(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>

            <button
              onClick={handleSave}
              className="w-full bg-gradient-to-r from-amber-500 to-pink-500 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:shadow-lg transition"
            >
              <Save size={18} /> Save This Cycle
            </button>

            {/* History List */}
            {showHistory && (
              <div className="border-t pt-4">
                <h3 className="font-semibold text-stone-700 mb-2">Saved Cycles</h3>
                {records.length === 0 && <p className="text-sm text-stone-400">No records yet.</p>}
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {records.map(rec => (
                    <div key={rec.id} className="flex justify-between items-center p-2 bg-stone-50 rounded-lg text-sm">
                      <div>
                        <span className="font-medium">{formatDate(new Date(rec.date))}</span> – {rec.cycleLength}d cycle
                        <div className="text-xs text-stone-500">Next period: {rec.nextPeriodPrediction}</div>
                      </div>
                      <button onClick={() => handleDelete(rec.id)} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Results Cards */}
          <div className="space-y-6">
            {/* Next Period */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-2xl shadow-lg border p-5 ${isPeriodSoon ? "bg-amber-50 border-amber-200" : "bg-white border-stone-100"}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-stone-500">Next period starts</p>
                  <p className="text-2xl font-bold text-stone-800">{formatDate(nextPeriod)}</p>
                  {isPeriodSoon && <p className="text-xs text-amber-600 mt-1">⚠️ Due in 3 days or less</p>}
                </div>
                <CalendarDays size={32} className="text-amber-600" />
              </div>
            </motion.div>

            {/* Ovulation */}
            <div className="bg-white rounded-2xl shadow-lg border border-stone-100 p-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-stone-500">Estimated ovulation day</p>
                  <p className="text-2xl font-bold text-stone-800">{formatDate(ovulation)}</p>
                </div>
                <Heart size={32} className="text-rose-500" />
              </div>
            </div>

            {/* Fertile Window */}
            <div className={`rounded-2xl shadow-lg border p-5 ${isFertileNow ? "bg-green-50 border-green-200" : "bg-white border-stone-100"}`}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-stone-500">Fertile window</p>
                  <p className="text-lg font-semibold text-stone-800">
                    {formatDate(fertileWindow.start)} – {formatDate(fertileWindow.end)}
                  </p>
                  {isFertileNow && <p className="text-xs text-green-600 mt-1">✨ You are currently fertile</p>}
                </div>
                <TrendingUp size={32} className="text-green-600" />
              </div>
            </div>

            <div className="bg-blue-50 rounded-2xl p-4 text-sm text-stone-600">
              <Info size={16} className="inline mr-1 text-blue-600" />
              Predictions assume regular cycles. For irregular cycles, use this as a rough guide. Track over 3–6 months for better accuracy.
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <FAQ />

        <div className="mt-6 p-3 bg-stone-50 rounded-lg text-xs text-stone-500 italic text-center">
          ⚠️ This tool provides estimates. For fertility planning or medical concerns, consult a healthcare provider.
        </div>
      </main>

      <footer className="border-t border-stone-200 py-6 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-stone-400">
          © {new Date().getFullYear()} Revochamp. Evidence‑based cycle tracking.
        </div>
      </footer>
    </div>
  );
}