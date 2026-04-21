"use client";

import React, { useState, useEffect, useMemo } from "react";
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
interface ChecklistItem {
  id: string;
  name: string;
  emoji: string;
  isChecked: boolean;
}

interface Category {
  name: string;
  emoji: string;
  items: ChecklistItem[];
}

// ----------------------------------------------------------------------------
// Initial Data
// ----------------------------------------------------------------------------
const createInitialCategories = (): Category[] => [
  {
    name: "Mother",
    emoji: "🤰",
    items: [
      { id: "nightgown", name: "Comfortable nightgown", emoji: "👗", isChecked: false },
      { id: "going_home", name: "Loose clothes for going home", emoji: "👚", isChecked: false },
      { id: "nursing_bra", name: "Nursing bras", emoji: "🩱", isChecked: false },
      { id: "maternity_underwear", name: "Maternity underwear", emoji: "🩲", isChecked: false },
      { id: "socks", name: "Socks", emoji: "🧦", isChecked: false },
      { id: "slippers", name: "Slippers", emoji: "🩴", isChecked: false },
      { id: "toiletries", name: "Toiletries (toothbrush, etc.)", emoji: "🧴", isChecked: false },
      { id: "phone_charger", name: "Phone and charger", emoji: "📱", isChecked: false },
      { id: "documents", name: "ID, insurance, medical records", emoji: "📄", isChecked: false },
      { id: "snacks", name: "Snacks", emoji: "🍫", isChecked: false },
      { id: "water_bottle", name: "Water bottle", emoji: "💧", isChecked: false },
      { id: "pillow", name: "Pillow (optional)", emoji: "🛏️", isChecked: false },
    ],
  },
  {
    name: "Baby",
    emoji: "👶",
    items: [
      { id: "newborn_outfits", name: "2–3 newborn outfits", emoji: "🧸", isChecked: false },
      { id: "blanket", name: "Baby blanket", emoji: "🛏️", isChecked: false },
      { id: "diapers", name: "Newborn diapers", emoji: "🧷", isChecked: false },
      { id: "wipes", name: "Baby wipes", emoji: "🧻", isChecked: false },
      { id: "hat", name: "Baby hat", emoji: "🧢", isChecked: false },
      { id: "socks_baby", name: "Socks", emoji: "🧦", isChecked: false },
      { id: "swaddle", name: "Swaddle cloth", emoji: "🎀", isChecked: false },
      { id: "mittens", name: "Baby mittens (optional)", emoji: "🧤", isChecked: false },
      { id: "towel", name: "Baby towel (optional)", emoji: "🧺", isChecked: false },
    ],
  },
  {
    name: "Partner",
    emoji: "👨‍👩‍👧",
    items: [
      { id: "change_clothes", name: "Change of clothes", emoji: "👕", isChecked: false },
      { id: "toiletries_partner", name: "Toiletries", emoji: "🧴", isChecked: false },
      { id: "phone_charger_partner", name: "Phone charger", emoji: "📱", isChecked: false },
      { id: "snacks_partner", name: "Snacks", emoji: "🍪", isChecked: false },
      { id: "cash", name: "Cash / cards", emoji: "💳", isChecked: false },
      { id: "camera", name: "Camera", emoji: "📷", isChecked: false },
    ],
  },
  {
    name: "Documents",
    emoji: "📋",
    items: [
      { id: "id_proof", name: "ID proof", emoji: "🪪", isChecked: false },
      { id: "medical_records", name: "Medical records", emoji: "📁", isChecked: false },
      { id: "insurance_papers", name: "Insurance papers", emoji: "📄", isChecked: false },
      { id: "prescriptions", name: "Doctor prescriptions", emoji: "📝", isChecked: false },
      { id: "hospital_reg", name: "Hospital registration", emoji: "🏥", isChecked: false },
    ],
  },
];

const STORAGE_KEY = "hospital_bag_checklist";

// ----------------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------------
export default function HospitalBagChecklist() {
  const [categories, setCategories] = useState<Category[]>(createInitialCategories());

  // Load saved state from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const checkedIds: string[] = JSON.parse(saved);
        setCategories((prev) =>
          prev.map((cat) => ({
            ...cat,
            items: cat.items.map((item) => ({
              ...item,
              isChecked: checkedIds.includes(item.id),
            })),
          }))
        );
      }
    } catch (e) {
      console.error("Failed to load checklist:", e);
    }
  }, []);

  // Save state to localStorage
  const saveState = (newCategories: Category[]) => {
    try {
      const checkedIds = newCategories
        .flatMap((cat) => cat.items)
        .filter((item) => item.isChecked)
        .map((item) => item.id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(checkedIds));
    } catch (e) {
      console.error("Failed to save checklist:", e);
    }
  };

  const toggleItem = (categoryIndex: number, itemIndex: number) => {
    setCategories((prev) => {
      const newCategories = [...prev];
      const category = { ...newCategories[categoryIndex] };
      const items = [...category.items];
      items[itemIndex] = { ...items[itemIndex], isChecked: !items[itemIndex].isChecked };
      category.items = items;
      newCategories[categoryIndex] = category;
      saveState(newCategories);
      return newCategories;
    });
  };

  const resetAll = () => {
    if (window.confirm("Are you sure you want to reset all checked items?")) {
      setCategories((prev) => {
        const newCategories = prev.map((cat) => ({
          ...cat,
          items: cat.items.map((item) => ({ ...item, isChecked: false })),
        }));
        saveState(newCategories);
        return newCategories;
      });
    }
  };

  const downloadPDF = () => {
    alert("📥 Downloading checklist PDF (simulated)...");
  };

  const totalItems = useMemo(
    () => categories.flatMap((c) => c.items).length,
    [categories]
  );
  const checkedItems = useMemo(
    () => categories.flatMap((c) => c.items).filter((i) => i.isChecked).length,
    [categories]
  );
  const progress = totalItems === 0 ? 0 : checkedItems / totalItems;
  const isComplete = progress === 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50/30 via-white to-purple-50/30">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-pink-100 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className={`${playfair.className} text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent`}>
            Revochamp
          </h1>
          <span className={`${poppins.className} text-xs text-stone-500`}>
            Hospital Bag Checklist
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
          <div className="inline-flex items-center gap-1.5 bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-xs sm:text-sm font-medium mb-3">
            <span>🧳</span> Pack by Week 34–36
          </div>
          <h2 className={`${playfair.className} text-2xl sm:text-4xl font-extrabold text-stone-800 leading-tight`}>
            Hospital Bag{" "}
            <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Checklist
            </span>
          </h2>
          <p className={`${poppins.className} text-sm sm:text-base text-stone-600 mt-2 max-w-2xl`}>
            Track everything you need for mom, baby, partner, and documents. Stay organized for the big day!
          </p>
        </motion.div>

        {/* Progress Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-pink-100 p-5 sm:p-6 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className={`${playfair.className} text-lg font-bold text-stone-800`}>
              📊 Packing Progress
            </h3>
            <span className={`${poppins.className} text-sm font-semibold text-pink-600`}>
              {checkedItems} / {totalItems} packed
            </span>
          </div>
          <div className="h-3 bg-stone-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className={`${poppins.className} text-xs text-stone-500`}>
              {Math.round(progress * 100)}% complete
            </span>
            <span className={`${poppins.className} text-xs font-medium text-stone-600`}>
              Remaining: {totalItems - checkedItems}
            </span>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          {categories.map((category, catIndex) => {
            const checkedInCat = category.items.filter((i) => i.isChecked).length;
            return (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: catIndex * 0.1 }}
                className="bg-white rounded-2xl shadow-md border border-pink-100 p-5"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{category.emoji}</span>
                    <h3 className={`${playfair.className} text-lg font-bold text-stone-800`}>
                      {category.name}
                    </h3>
                  </div>
                  <span className="px-3 py-1 bg-pink-50 text-pink-600 text-xs font-semibold rounded-full">
                    {checkedInCat} / {category.items.length}
                  </span>
                </div>
                <div className="space-y-1">
                  {category.items.map((item, itemIndex) => (
                    <label
                      key={item.id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-stone-50 cursor-pointer transition"
                    >
                      <input
                        type="checkbox"
                        checked={item.isChecked}
                        onChange={() => toggleItem(catIndex, itemIndex)}
                        className="w-5 h-5 text-pink-500 rounded border-stone-300 focus:ring-pink-500"
                      />
                      <span className="text-lg">{item.emoji}</span>
                      <span
                        className={`${poppins.className} text-sm flex-1 ${
                          item.isChecked ? "text-stone-400 line-through" : "text-stone-700"
                        }`}
                      >
                        {item.name}
                      </span>
                    </label>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
          <button
            onClick={downloadPDF}
            className="px-6 py-3 bg-white border border-pink-200 text-pink-700 font-medium rounded-full hover:bg-pink-50 transition shadow-sm"
          >
            📥 Download PDF
          </button>
          <button
            onClick={resetAll}
            className="px-6 py-3 text-stone-500 font-medium rounded-full hover:bg-stone-100 transition"
          >
            🔄 Reset All
          </button>
        </div>

        {/* Completion Message */}
        <AnimatePresence>
          {isComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-6"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">🎉</span>
                <p className={`${poppins.className} text-green-800 font-medium`}>
                  Your hospital bag is fully packed! You're ready to go.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Disclaimer */}
        <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl text-center">
          <p className={`${poppins.className} text-xs text-stone-500 italic`}>
            ⚠️ This checklist is a general guide. Please follow your doctor's specific instructions.
          </p>
        </div>
      </main>

      <footer className="border-t border-stone-200 py-4 mt-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-stone-400">
          © {new Date().getFullYear()} Revochamp. Supporting your journey to parenthood.
        </div>
      </footer>
    </div>
  );
}