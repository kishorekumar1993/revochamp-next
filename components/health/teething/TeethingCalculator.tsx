"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Playfair_Display, Poppins } from "next/font/google";

// ----------------------------------------------------------------------------
// Fonts
// ----------------------------------------------------------------------------
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700", "800"],
});
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

// ----------------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------------
interface TeethingStage {
  minAgeMonths: number;
  maxAgeMonths: number;
  description: string;
  tips: string[];
  emoji: string;
}

// ----------------------------------------------------------------------------
// Teething Stages Data
// ----------------------------------------------------------------------------
const teethingStages: TeethingStage[] = [
  {
    minAgeMonths: 0,
    maxAgeMonths: 3,
    emoji: "👶",
    description: "No teeth yet – gums are smooth.",
    tips: [
      "No teething symptoms yet.",
      "Continue breastfeeding/formula.",
      "Wipe gums gently with a soft cloth after feedings.",
    ],
  },
  {
    minAgeMonths: 4,
    maxAgeMonths: 6,
    emoji: "🦷",
    description: "Teething may begin! Bottom central incisors are often first.",
    tips: [
      "Wipe gums with a clean, damp cloth.",
      "Offer a clean teething ring (chilled, not frozen).",
      "Increased drooling is normal – keep a bib handy.",
    ],
  },
  {
    minAgeMonths: 7,
    maxAgeMonths: 12,
    emoji: "😁",
    description: "Central and lateral incisors (top and bottom) are coming in.",
    tips: [
      "Continue teething rings (chilled).",
      "Gently rub gums with a clean finger.",
      "Expect some fussiness and disrupted sleep.",
      "Offer cold foods if baby is on solids.",
    ],
  },
  {
    minAgeMonths: 13,
    maxAgeMonths: 18,
    emoji: "🍼",
    description: "First molars and canines start to appear.",
    tips: [
      "Offer cold foods like chilled cucumber (supervised).",
      "Keep up with gum massage.",
      "Consult doctor about infant pain relief if needed.",
      "Maintain regular oral hygiene.",
    ],
  },
  {
    minAgeMonths: 19,
    maxAgeMonths: 24,
    emoji: "😊",
    description: "Canines and second molars are on the way.",
    tips: [
      "More intense teething pain possible.",
      "Try a soft-bristled toothbrush for gentle cleaning.",
      "Maintain regular meals despite fussiness.",
      "Extra cuddles and comfort help.",
    ],
  },
  {
    minAgeMonths: 25,
    maxAgeMonths: 30,
    emoji: "🦷🦷",
    description: "Second molars erupt – the last of the baby teeth!",
    tips: [
      "This can be a tough stage; extra comfort helps.",
      "Keep up with oral hygiene twice daily.",
      "Schedule first dental visit by age 1 if not done yet.",
      "Use a tiny smear of fluoride toothpaste.",
    ],
  },
  {
    minAgeMonths: 31,
    maxAgeMonths: 36,
    emoji: "🎉",
    description: "Most children have all 20 baby teeth by age 3.",
    tips: [
      "Brush twice daily with a pea-sized amount of fluoride toothpaste.",
      "Schedule regular dental checkups.",
      "Encourage self-brushing with supervision.",
      "Celebrate the milestone!",
    ],
  },
];

// ----------------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------------
export default function TeethingCalculator() {
  const [ageInput, setAgeInput] = useState<string>("");
  const [babyAgeMonths, setBabyAgeMonths] = useState<number | null>(null);
  const [resultStage, setResultStage] = useState<TeethingStage | null>(null);
  const [error, setError] = useState<string>("");

  const calculateStage = () => {
    const age = parseInt(ageInput);
    if (isNaN(age) || age < 0 || age > 36) {
      setError("Please enter a valid age between 0 and 36 months.");
      setResultStage(null);
      setBabyAgeMonths(null);
      return;
    }
    setError("");
    const stage = teethingStages.find(
      (s) => age >= s.minAgeMonths && age <= s.maxAgeMonths
    ) || teethingStages[teethingStages.length - 1];
    setBabyAgeMonths(age);
    setResultStage(stage);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setAgeInput(value);
    if (error) setError("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      calculateStage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/30 via-white to-orange-50/30">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-amber-100 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className={`${playfair.className} text-xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent`}>
            Revochamp
          </h1>
          <span className={`${poppins.className} text-xs text-stone-500`}>
            Teething Calculator
          </span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 md:py-8">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 text-center"
        >
          <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs sm:text-sm font-medium mb-3">
            <span>🦷</span> Every Baby is Unique
          </div>
          <h2 className={`${playfair.className} text-2xl sm:text-4xl font-extrabold text-stone-800 leading-tight`}>
            Predict Your Baby's{" "}
            <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              Teething Stage
            </span>
          </h2>
          <p className={`${poppins.className} text-sm sm:text-base text-stone-600 mt-2 max-w-xl mx-auto`}>
            Enter your baby's age in months to see what teeth are coming in and get soothing tips.
          </p>
        </motion.div>

        {/* Input Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-6 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Baby's Age (months)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 text-lg">
                  🎂
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={ageInput}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder="e.g., 6"
                  className="w-full pl-12 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:bg-white transition text-lg"
                />
              </div>
              {error && (
                <p className="text-xs text-red-500 mt-1">{error}</p>
              )}
            </div>
            <button
              onClick={calculateStage}
              className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-xl shadow-md transition transform hover:scale-[1.02]"
            >
              🔍 Predict Stage
            </button>
          </div>
        </div>

        {/* Result Card */}
        <AnimatePresence>
          {resultStage && babyAgeMonths !== null && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl shadow-lg border border-amber-100 p-6 sm:p-8 mb-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-5xl">{resultStage.emoji}</span>
                <div>
                  <h3 className={`${playfair.className} text-xl sm:text-2xl font-bold text-stone-800`}>
                    At {babyAgeMonths} months
                  </h3>
                  <p className={`${poppins.className} text-stone-600`}>
                    {resultStage.description}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <h4 className={`${poppins.className} text-lg font-semibold text-stone-800 mb-3 flex items-center gap-2`}>
                  <span>💡</span> Care Tips for This Stage
                </h4>
                <ul className="space-y-2">
                  {resultStage.tips.map((tip, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <span className="text-amber-500 mt-1">▹</span>
                      <span className={`${poppins.className} text-sm text-stone-600`}>{tip}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Timeline visual indicator */}
              <div className="mt-6 pt-4 border-t border-amber-100">
                <p className={`${poppins.className} text-xs text-stone-400`}>
                  Age range: {resultStage.minAgeMonths}–{resultStage.maxAgeMonths} months
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Educational Info Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-5 sm:p-6 mb-6">
          <h3 className={`${playfair.className} text-lg font-bold text-stone-800 mb-3 flex items-center gap-2`}>
            <span>🦷</span> About Teething
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-stone-600">
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-1">▹</span>
                <span><strong>Timing varies:</strong> Every baby is different. The ages shown are averages.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-1">▹</span>
                <span><strong>Signs of teething:</strong> Drooling, fussiness, chewing on objects, swollen gums, disrupted sleep.</span>
              </li>
            </ul>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-1">▹</span>
                <span><strong>Fever?</strong> Teething may cause slight temperature rise, but fever &gt;100.4°F (38°C) needs doctor.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-1">▹</span>
                <span><strong>First dental visit:</strong> Schedule by baby's first birthday.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl text-center">
          <p className="text-xs text-stone-500">
            ⚠️ This calculator provides estimates based on average developmental timelines. Every baby is unique. Consult your pediatrician with any concerns.
          </p>
        </div>
      </main>

      <footer className="border-t border-stone-200 py-4 mt-6">
        <div className="max-w-5xl mx-auto px-4 text-center text-xs text-stone-400">
          © {new Date().getFullYear()} Revochamp. Supporting your parenting journey.
        </div>
      </footer>
    </div>
  );
}