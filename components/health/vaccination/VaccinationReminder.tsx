"use client";

import React, { useState, useMemo } from "react";
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
type VaccineStatus = "dueNow" | "upcoming" | "completed" | "optional";

interface Vaccine {
  name: string;
  timingDescription: string;
  description: string;
  benefit: string;
  icon: string;
  isGovernmentRecommended: boolean;
  status: VaccineStatus;
}

interface BabyVaccine {
  age: string;
  vaccines: string;
}

// ----------------------------------------------------------------------------
// Vaccine Service Logic
// ----------------------------------------------------------------------------
const getRecommendedVaccines = (week: number): Vaccine[] => {
  const result: Vaccine[] = [];

  // Td Dose 1
  if (week >= 1) {
    let status: VaccineStatus;
    if (week < 12) status = "upcoming";
    else if (week >= 12 && week <= 16) status = "dueNow";
    else status = "completed";

    result.push({
      name: "Td Dose 1 (Tetanus-diphtheria)",
      timingDescription: "Recommended at 12–16 weeks",
      description: "First dose of Td vaccine. Essential for preventing neonatal tetanus.",
      benefit: "Part of India's Universal Immunisation Programme (UIP).",
      icon: "💉",
      isGovernmentRecommended: true,
      status,
    });
  }

  // Td Dose 2
  if (week >= 1) {
    let status: VaccineStatus;
    if (week < 16) status = "upcoming";
    else if (week >= 16 && week <= 20) status = "dueNow";
    else status = "completed";

    result.push({
      name: "Td Dose 2 (Tetanus-diphtheria)",
      timingDescription: "4 weeks after Dose 1 (16–20 weeks)",
      description: "Second dose of Td vaccine. Completes tetanus protection.",
      benefit: "If previously vaccinated within 3 years, only one booster is needed.",
      icon: "💉",
      isGovernmentRecommended: true,
      status,
    });
  }

  // COVID-19
  if (week >= 1) {
    result.push({
      name: "COVID-19 Vaccine",
      timingDescription: "Any trimester (if not previously vaccinated)",
      description: "Recommended by Government of India for all pregnant women.",
      benefit: "Protects from severe COVID-19 illness.",
      icon: "🦠",
      isGovernmentRecommended: true,
      status: "optional",
    });
  }

  // Influenza
  if (week >= 1) {
    result.push({
      name: "Influenza Vaccine",
      timingDescription: "Any trimester (optional)",
      description: "WHO recommends, but not part of India's UIP. Discuss with your doctor.",
      benefit: "Reduces flu-related complications.",
      icon: "🤧",
      isGovernmentRecommended: false,
      status: "optional",
    });
  }

  return result;
};

const babyVaccines: BabyVaccine[] = [
  { age: "At birth", vaccines: "BCG, OPV-0, Hepatitis B-1" },
  { age: "6 weeks", vaccines: "DPT-1, OPV-1, Hepatitis B-2, IPV-1, PCV-1, Rotavirus-1" },
  { age: "10 weeks", vaccines: "DPT-2, OPV-2, Hepatitis B-3, IPV-2, PCV-2, Rotavirus-2" },
  { age: "14 weeks", vaccines: "DPT-3, OPV-3, IPV-3, PCV-3, Rotavirus-3" },
];

// ----------------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------------
export default function VaccinationReminder() {
  const [weekInput, setWeekInput] = useState<string>("28");
  const [pregnancyWeek, setPregnancyWeek] = useState<number | null>(28);
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [error, setError] = useState("");

  const recommendedVaccines = useMemo(() => {
    if (pregnancyWeek !== null && pregnancyWeek >= 1 && pregnancyWeek <= 40) {
      return getRecommendedVaccines(pregnancyWeek);
    }
    return [];
  }, [pregnancyWeek]);

  const progress = pregnancyWeek ? pregnancyWeek / 40 : 0;

  const handleCalculate = () => {
    const week = parseInt(weekInput);
    if (isNaN(week) || week < 1 || week > 40) {
      setError("Please enter a valid week between 1 and 40.");
      setPregnancyWeek(null);
      return;
    }
    setError("");
    setPregnancyWeek(week);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setWeekInput(value);
    if (error) setError("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCalculate();
    }
  };

  const toggleReminder = () => {
    setReminderEnabled(!reminderEnabled);
    if (!reminderEnabled) {
      alert("✅ Reminder set (simulated). In a real app, notifications would be scheduled.");
    }
  };

  const getStatusColor = (status: VaccineStatus) => {
    switch (status) {
      case "dueNow": return "text-green-600 bg-green-50 border-green-200";
      case "upcoming": return "text-amber-600 bg-amber-50 border-amber-200";
      case "completed": return "text-gray-500 bg-gray-50 border-gray-200";
      case "optional": return "text-blue-600 bg-blue-50 border-blue-200";
    }
  };

  const getStatusIcon = (status: VaccineStatus) => {
    switch (status) {
      case "dueNow": return "🔔";
      case "upcoming": return "⏳";
      case "completed": return "✅";
      case "optional": return "ℹ️";
    }
  };

  const getStatusText = (status: VaccineStatus) => {
    switch (status) {
      case "dueNow": return "Due Now";
      case "upcoming": return "Upcoming";
      case "completed": return "Completed (if taken)";
      case "optional": return "Optional";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-purple-50/30">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-blue-100 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className={`${playfair.className} text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`}>
            Revochamp
          </h1>
          <span className={`${poppins.className} text-xs text-stone-500`}>
            Vaccination Reminder
          </span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 md:py-8">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs sm:text-sm font-medium mb-3">
            <span>💉</span> India UIP Guidelines
          </div>
          <h2 className={`${playfair.className} text-2xl sm:text-4xl font-extrabold text-stone-800 leading-tight`}>
            Pregnancy{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Vaccination Tracker
            </span>
          </h2>
          <p className={`${poppins.className} text-sm sm:text-base text-stone-600 mt-2 max-w-2xl`}>
            Stay on track with recommended vaccines based on Indian government guidelines.
          </p>
        </motion.div>

        {/* Progress Bar */}
        {pregnancyWeek && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow-sm border border-blue-100 p-4 mb-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`${poppins.className} text-sm font-medium text-stone-700`}>
                📊 Pregnancy Progress
              </span>
              <span className={`${poppins.className} text-sm text-stone-500`}>
                Week {pregnancyWeek} of 40
              </span>
            </div>
            <div className="h-2.5 bg-stone-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress * 100}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
              />
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6">
              <h3 className={`${playfair.className} text-lg font-bold text-stone-800 mb-4 flex items-center gap-2`}>
                <span className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">📋</span>
                Your Details
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Pregnancy Week (1–40)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">
                      📅
                    </span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={weekInput}
                      onChange={handleInputChange}
                      onKeyPress={handleKeyPress}
                      placeholder="e.g., 28"
                      className="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                    />
                  </div>
                  {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
                </div>

                <button
                  onClick={handleCalculate}
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-xl shadow-md transition transform hover:scale-[1.01]"
                >
                  🔍 Check Vaccines
                </button>
              </div>
            </div>
          </div>

          {/* Recommendations Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6">
              <h3 className={`${playfair.className} text-lg font-bold text-stone-800 mb-4 flex items-center gap-2`}>
                <span className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">💉</span>
                Recommended Vaccines
              </h3>

              {recommendedVaccines.length > 0 ? (
                <AnimatePresence>
                  <div className="space-y-4">
                    {recommendedVaccines.map((vaccine, idx) => (
                      <motion.div
                        key={vaccine.name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`p-4 rounded-xl border ${vaccine.isGovernmentRecommended ? "border-blue-200 bg-blue-50/30" : "border-purple-200 bg-purple-50/30"}`}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">{vaccine.icon}</span>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <h4 className={`${poppins.className} font-semibold text-stone-800`}>
                                {vaccine.name}
                              </h4>
                              {vaccine.isGovernmentRecommended && (
                                <span className="px-2 py-0.5 bg-blue-500 text-white text-[10px] font-semibold rounded-full">
                                  UIP
                                </span>
                              )}
                            </div>
                            <p className={`${poppins.className} text-xs text-blue-600 font-medium mb-1`}>
                              {vaccine.timingDescription}
                            </p>
                            <p className={`${poppins.className} text-xs text-stone-600 mb-1`}>
                              {vaccine.description}
                            </p>
                            <p className={`${poppins.className} text-xs text-stone-500 mb-2`}>
                              Benefit: {vaccine.benefit}
                            </p>
                            <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(vaccine.status)}`}>
                              <span>{getStatusIcon(vaccine.status)}</span>
                              <span>{getStatusText(vaccine.status)}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </AnimatePresence>
              ) : pregnancyWeek ? (
                <p className={`${poppins.className} text-stone-500 text-center py-8`}>
                  No specific vaccines recommended for this week.
                </p>
              ) : (
                <p className={`${poppins.className} text-stone-500 text-center py-8`}>
                  Enter your week to see recommendations.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Actions Card */}
        <div className="mt-6 bg-white rounded-2xl shadow-sm border border-stone-200 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-lg">
              ⏰
            </div>
            <span className={`${poppins.className} font-medium text-stone-700`}>
              Set reminder for due vaccines
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleReminder}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                reminderEnabled ? "bg-blue-500" : "bg-stone-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  reminderEnabled ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <button
              onClick={() => alert("Please contact your healthcare provider to discuss vaccines.")}
              className="px-5 py-2 border border-blue-300 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-50 transition"
            >
              🩺 Consult Doctor
            </button>
          </div>
        </div>

        {/* India Context Card */}
        <div className="mt-6 bg-white rounded-2xl shadow-sm border border-amber-100 bg-gradient-to-r from-amber-50/50 to-orange-50/50 p-5">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🇮🇳</span>
            <div>
              <h3 className={`${playfair.className} text-lg font-bold text-stone-800 mb-2`}>
                India-Specific Guidelines
              </h3>
              <ul className={`${poppins.className} text-sm text-stone-600 space-y-1`}>
                <li>• Td (Tetanus-diphtheria) vaccine is provided free under the Universal Immunization Programme (UIP).</li>
                <li>• Two doses: first at 12–16 weeks, second 4 weeks later.</li>
                <li>• COVID-19 vaccine is recommended for all pregnant women.</li>
                <li>• Influenza vaccine is optional (not in UIP).</li>
                <li>• Tdap (whooping cough) is not currently recommended in India.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Baby Vaccination Schedule */}
        <div className="mt-6 bg-white rounded-2xl shadow-sm border border-stone-200 p-5">
          <h3 className={`${playfair.className} text-lg font-bold text-stone-800 mb-4 flex items-center gap-2`}>
            <span>👶</span> Baby Vaccination Schedule (India)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {babyVaccines.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 bg-stone-50 rounded-xl">
                <span className="min-w-[70px] px-3 py-1.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full text-center">
                  {item.age}
                </span>
                <span className={`${poppins.className} text-xs text-stone-600`}>
                  {item.vaccines}
                </span>
              </div>
            ))}
          </div>
          <p className={`${poppins.className} text-[10px] text-stone-400 mt-4 italic`}>
            Source: Government of India, Ministry of Health & Family Welfare
          </p>
        </div>

        {/* Sources & Disclaimer */}
        <div className="mt-6 p-4 bg-stone-50 border border-stone-200 rounded-xl">
          <p className={`${poppins.className} text-xs text-stone-500 mb-2`}>
            <strong>📚 Sources:</strong> Government of India, Ministry of Health & Family Welfare; Universal Immunization Programme (UIP); WHO guidelines.
          </p>
          <p className={`${poppins.className} text-xs text-stone-500 italic`}>
            ⚠️ This reminder is based on Indian guidelines and is for informational purposes only. Always consult your healthcare provider before taking any vaccine.
          </p>
        </div>
      </main>

      <footer className="border-t border-stone-200 py-4 mt-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-stone-400">
          © {new Date().getFullYear()} Revochamp. Supporting maternal health.
        </div>
      </footer>
    </div>
  );
}