"use client";

import React, { useState, useEffect } from "react";
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
// Chinese Gender Chart Data
// ----------------------------------------------------------------------------
const CHINESE_GENDER_CHART: Record<number, Record<number, string>> = {
  18: {1:"Girl",2:"Girl",3:"Boy",4:"Boy",5:"Boy",6:"Boy",7:"Boy",8:"Boy",9:"Boy",10:"Boy",11:"Boy",12:"Boy"},
  19: {1:"Boy",2:"Boy",3:"Girl",4:"Girl",5:"Girl",6:"Boy",7:"Boy",8:"Boy",9:"Boy",10:"Boy",11:"Girl",12:"Girl"},
  20: {1:"Girl",2:"Boy",3:"Girl",4:"Boy",5:"Boy",6:"Boy",7:"Boy",8:"Boy",9:"Boy",10:"Girl",11:"Boy",12:"Boy"},
  21: {1:"Boy",2:"Girl",3:"Girl",4:"Girl",5:"Girl",6:"Girl",7:"Girl",8:"Girl",9:"Girl",10:"Girl",11:"Girl",12:"Girl"},
  22: {1:"Girl",2:"Boy",3:"Boy",4:"Girl",5:"Boy",6:"Girl",7:"Girl",8:"Boy",9:"Girl",10:"Girl",11:"Girl",12:"Girl"},
  23: {1:"Boy",2:"Boy",3:"Girl",4:"Boy",5:"Boy",6:"Girl",7:"Boy",8:"Girl",9:"Boy",10:"Boy",11:"Boy",12:"Girl"},
  24: {1:"Boy",2:"Girl",3:"Boy",4:"Boy",5:"Girl",6:"Boy",7:"Boy",8:"Girl",9:"Girl",10:"Girl",11:"Girl",12:"Girl"},
  25: {1:"Girl",2:"Boy",3:"Boy",4:"Girl",5:"Girl",6:"Boy",7:"Girl",8:"Girl",9:"Boy",10:"Boy",11:"Boy",12:"Boy"},
  26: {1:"Boy",2:"Girl",3:"Boy",4:"Girl",5:"Girl",6:"Boy",7:"Girl",8:"Boy",9:"Boy",10:"Boy",11:"Girl",12:"Girl"},
  27: {1:"Girl",2:"Boy",3:"Girl",4:"Boy",5:"Girl",6:"Girl",7:"Boy",8:"Boy",9:"Boy",10:"Girl",11:"Girl",12:"Boy"},
  28: {1:"Boy",2:"Girl",3:"Boy",4:"Girl",5:"Boy",6:"Boy",7:"Girl",8:"Boy",9:"Girl",10:"Girl",11:"Boy",12:"Boy"},
  29: {1:"Girl",2:"Boy",3:"Girl",4:"Girl",5:"Boy",6:"Girl",7:"Boy",8:"Boy",9:"Boy",10:"Girl",11:"Girl",12:"Girl"},
  30: {1:"Boy",2:"Girl",3:"Girl",4:"Boy",5:"Boy",6:"Girl",7:"Boy",8:"Girl",9:"Boy",10:"Boy",11:"Boy",12:"Boy"},
  31: {1:"Boy",2:"Girl",3:"Boy",4:"Girl",5:"Girl",6:"Boy",7:"Girl",8:"Boy",9:"Girl",10:"Girl",11:"Boy",12:"Boy"},
  32: {1:"Boy",2:"Girl",3:"Boy",4:"Girl",5:"Boy",6:"Girl",7:"Girl",8:"Boy",9:"Boy",10:"Boy",11:"Girl",12:"Girl"},
  33: {1:"Girl",2:"Boy",3:"Boy",4:"Girl",5:"Girl",6:"Boy",7:"Girl",8:"Boy",9:"Boy",10:"Boy",11:"Boy",12:"Girl"},
  34: {1:"Boy",2:"Girl",3:"Boy",4:"Girl",5:"Boy",6:"Boy",7:"Boy",8:"Boy",9:"Girl",10:"Boy",11:"Boy",12:"Girl"},
  35: {1:"Boy",2:"Boy",3:"Girl",4:"Boy",5:"Girl",6:"Girl",7:"Boy",8:"Girl",9:"Boy",10:"Boy",11:"Girl",12:"Girl"},
  36: {1:"Girl",2:"Boy",3:"Boy",4:"Girl",5:"Boy",6:"Girl",7:"Girl",8:"Boy",9:"Girl",10:"Girl",11:"Girl",12:"Boy"},
  37: {1:"Boy",2:"Girl",3:"Boy",4:"Boy",5:"Girl",6:"Boy",7:"Girl",8:"Boy",9:"Girl",10:"Boy",11:"Boy",12:"Girl"},
  38: {1:"Girl",2:"Boy",3:"Girl",4:"Boy",5:"Boy",6:"Girl",7:"Boy",8:"Girl",9:"Boy",10:"Girl",11:"Boy",12:"Boy"},
  39: {1:"Boy",2:"Girl",3:"Boy",4:"Boy",5:"Boy",6:"Girl",7:"Girl",8:"Boy",9:"Girl",10:"Boy",11:"Girl",12:"Girl"},
  40: {1:"Girl",2:"Boy",3:"Girl",4:"Boy",5:"Girl",6:"Boy",7:"Boy",8:"Girl",9:"Boy",10:"Girl",11:"Boy",12:"Boy"},
  41: {1:"Boy",2:"Girl",3:"Boy",4:"Girl",5:"Boy",6:"Girl",7:"Boy",8:"Boy",9:"Girl",10:"Boy",11:"Girl",12:"Boy"},
  42: {1:"Girl",2:"Boy",3:"Boy",4:"Girl",5:"Boy",6:"Girl",7:"Boy",8:"Girl",9:"Boy",10:"Boy",11:"Boy",12:"Girl"},
  43: {1:"Boy",2:"Girl",3:"Boy",4:"Boy",5:"Girl",6:"Boy",7:"Girl",8:"Boy",9:"Girl",10:"Girl",11:"Boy",12:"Boy"},
  44: {1:"Girl",2:"Boy",3:"Girl",4:"Boy",5:"Boy",6:"Girl",7:"Boy",8:"Girl",9:"Boy",10:"Girl",11:"Girl",12:"Boy"},
  45: {1:"Boy",2:"Girl",3:"Boy",4:"Girl",5:"Boy",6:"Boy",7:"Girl",8:"Boy",9:"Girl",10:"Boy",11:"Boy",12:"Girl"},
};

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const getPrediction = (age: number, month: number): string | null => {
  const lunarAge = age + 1;
  return CHINESE_GENDER_CHART[lunarAge]?.[month] || null;
};

// ----------------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------------
export default function BabyGenderPredictor() {
  const [inputMode, setInputMode] = useState<"month" | "date">("month");
  const [age, setAge] = useState<string>("28");
  const [selectedMonth, setSelectedMonth] = useState<string>("June");
  const [conceptionDate, setConceptionDate] = useState<string>("");
  const [prediction, setPrediction] = useState<{ gender: string; lunarAge: number; month: number } | null>(null);
  const [error, setError] = useState<string>("");

  // Auto-predict when inputs change
  useEffect(() => {
    predictGender();
  }, [age, selectedMonth, conceptionDate, inputMode]);

  const predictGender = () => {
    setError("");
    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 18 || ageNum > 45) {
      setError("Mother's age must be between 18 and 45.");
      setPrediction(null);
      return;
    }

    let monthNum: number;
    if (inputMode === "month") {
      monthNum = MONTHS.indexOf(selectedMonth) + 1;
    } else {
      if (!conceptionDate) {
        setPrediction(null);
        return;
      }
      monthNum = new Date(conceptionDate).getMonth() + 1;
    }

    const gender = getPrediction(ageNum, monthNum);
    if (gender) {
      setPrediction({
        gender,
        lunarAge: ageNum + 1,
        month: monthNum,
      });
    } else {
      setPrediction(null);
    }
  };

  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    setAge(val);
  };

  const isBoy = prediction?.gender === "Boy";
  const isGirl = prediction?.gender === "Girl";

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50/30 via-white to-blue-50/30">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-pink-100 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className={`${playfair.className} text-xl font-bold bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent`}>
            Revochamp
          </h1>
          <span className={`${poppins.className} text-xs text-stone-500`}>
            Baby Gender Predictor
          </span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 md:py-8">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 text-center md:text-left"
        >
          <div className="inline-flex items-center gap-1.5 bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-xs sm:text-sm font-medium mb-3">
            <span>🔮</span> Ancient Chinese Tradition
          </div>
          <h2 className={`${playfair.className} text-2xl sm:text-4xl font-extrabold text-stone-800 leading-tight`}>
            Boy or Girl?{" "}
            <span className="bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
              Find Out Now
            </span>
          </h2>
          <p className={`${poppins.className} text-sm sm:text-base text-stone-600 mt-1 max-w-2xl`}>
            Based on the 700-year-old Chinese Gender Chart. For fun and entertainment!
          </p>
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6">
          {/* Input Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-pink-100 p-5 sm:p-6">
            <h3 className={`${playfair.className} text-lg font-bold text-stone-800 mb-4 flex items-center gap-2`}>
              <span className="w-7 h-7 bg-pink-100 rounded-full flex items-center justify-center text-pink-600">📋</span>
              Enter Details
            </h3>

            {/* Input Mode Toggle */}
            <div className="flex gap-3 mb-5">
              <button
                onClick={() => setInputMode("month")}
                className={`flex-1 py-2 rounded-xl text-sm font-medium transition ${
                  inputMode === "month"
                    ? "bg-pink-500 text-white shadow-sm"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                📅 Month
              </button>
              <button
                onClick={() => setInputMode("date")}
                className={`flex-1 py-2 rounded-xl text-sm font-medium transition ${
                  inputMode === "date"
                    ? "bg-pink-500 text-white shadow-sm"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                📆 Exact Date
              </button>
            </div>

            <div className="space-y-4">
              {/* Age Input */}
              <div>
                <label className="block text-xs font-medium text-stone-500 mb-1">
                  Mother's Age at Conception (18-45)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={age}
                    onChange={handleAgeChange}
                    placeholder="28"
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:bg-white transition text-sm"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-lg">👩</span>
                </div>
              </div>

              {/* Month or Date Input */}
              {inputMode === "month" ? (
                <div>
                  <label className="block text-xs font-medium text-stone-500 mb-1">
                    Month of Conception
                  </label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-pink-500 text-sm"
                  >
                    {MONTHS.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-medium text-stone-500 mb-1">
                    Conception Date
                  </label>
                  <input
                    type="date"
                    value={conceptionDate}
                    onChange={(e) => setConceptionDate(e.target.value)}
                    max={new Date().toISOString().split("T")[0]}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-pink-500 text-sm"
                  />
                </div>
              )}

              {error && (
                <p className="text-xs text-red-500 mt-1">{error}</p>
              )}

              <button
                onClick={predictGender}
                className="w-full bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 text-white font-semibold py-3 rounded-xl shadow-md transition-all duration-200 transform hover:scale-[1.01] text-sm"
              >
                ✨ Predict Baby Gender
              </button>
            </div>
          </div>

          {/* Result Card */}
          <div
            className={`rounded-2xl shadow-lg p-5 sm:p-6 flex flex-col items-center justify-center transition-all duration-500 ${
              prediction
                ? isBoy
                  ? "bg-gradient-to-br from-blue-400 to-blue-600 text-white"
                  : "bg-gradient-to-br from-pink-400 to-pink-600 text-white"
                : "bg-white border border-pink-100"
            }`}
          >
            <AnimatePresence mode="wait">
              {prediction ? (
                <motion.div
                  key="result"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="text-center"
                >
                  <div className="text-7xl mb-3">
                    {isBoy ? "👦" : "👧"}
                  </div>
                  <h3 className={`${playfair.className} text-3xl font-bold mb-1`}>
                    It's a {prediction.gender}!
                  </h3>
                  <p className="text-sm opacity-90">
                    Based on lunar age {prediction.lunarAge} and month {prediction.month}
                  </p>
                  <div className="mt-4 text-xs bg-white/20 rounded-full px-4 py-1.5 inline-block">
                    🔮 For entertainment only
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center"
                >
                  <div className="text-6xl mb-3">👶</div>
                  <h3 className={`${playfair.className} text-xl font-semibold text-stone-600`}>
                    Enter details to see prediction
                  </h3>
                  <p className="text-sm text-stone-400 mt-2">
                    Age and month/conception date required
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* About Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-stone-200 p-5 sm:p-6">
          <h3 className={`${playfair.className} text-lg font-bold text-stone-800 mb-3 flex items-center gap-2`}>
            <span>📜</span> About the Chinese Gender Chart
          </h3>
          <div className="space-y-3 text-sm text-stone-600">
            <p>
              🇨🇳 The Chinese gender prediction chart is a traditional method said to be over 700 years old.
              It uses the mother's lunar age at conception and the lunar month of conception to predict the baby's gender.
              Many cultures find it fun to try, but scientific studies have shown it is no more accurate than chance (about 50%).
            </p>
            <p>
              🎯 <strong>Accuracy:</strong> While the chart is widely shared online, there is no scientific evidence that it can reliably predict a baby's sex.
              The only medically accurate ways are ultrasound (usually after 16–20 weeks) and genetic tests like NIPT, CVS, or amniocentesis.
            </p>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-5 p-4 bg-stone-50 border border-stone-200 rounded-xl text-center">
          <p className="text-xs text-stone-500">
            ⚠️ This tool is for entertainment purposes only. Baby gender can only be medically confirmed through ultrasound or genetic testing.
          </p>
        </div>
      </main>

      <footer className="border-t border-stone-200 py-4 mt-6">
        <div className="max-w-5xl mx-auto px-4 text-center text-xs text-stone-400">
          © {new Date().getFullYear()} Revochamp. For fun and entertainment.
        </div>
      </footer>
    </div>
  );
}