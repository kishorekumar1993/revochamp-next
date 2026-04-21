// app/tools/health-insurance-calculator/HealthInsuranceCalculatorClient.tsx
"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Playfair_Display, Poppins } from "next/font/google";
import Link from "next/link";
import {
  Heart,
  Users,
  Building,
  Calendar,
  TrendingUp,
  IndianRupee,
  Shield,
  Sparkles,
  ChevronRight,
  AlertCircle,
  Home,
} from "lucide-react";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "700", "800"] });
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

const cityTiers = [
  { value: "tier1", label: "Tier 1 (Metros)", multiplier: 1.5 },
  { value: "tier2", label: "Tier 2 (Smaller cities)", multiplier: 1.2 },
  { value: "tier3", label: "Tier 3 (Rural / towns)", multiplier: 1.0 },
];

const ageGroups = [
  { label: "18-30", multiplier: 0.8, defaultCover: 500000 },
  { label: "31-40", multiplier: 1.0, defaultCover: 500000 },
  { label: "41-50", multiplier: 1.3, defaultCover: 700000 },
  { label: "51-60", multiplier: 1.7, defaultCover: 1000000 },
  { label: "60+", multiplier: 2.2, defaultCover: 1000000 },
];

export default function HealthInsuranceCalculatorClient() {
  // User inputs
  const [age, setAge] = useState(32);
  const [cityTier, setCityTier] = useState("tier1");
  const [familySize, setFamilySize] = useState(3); // including self
  const [existingCover, setExistingCover] = useState(0);
  const [lifestyle, setLifestyle] = useState<"sedentary" | "moderate" | "active">("moderate");
  const [smoker, setSmoker] = useState(false);
  const [showPremiumEstimate, setShowPremiumEstimate] = useState(true);

  // Get age group multiplier
  const ageGroup = useMemo(() => {
    if (age <= 30) return ageGroups[0];
    if (age <= 40) return ageGroups[1];
    if (age <= 50) return ageGroups[2];
    if (age <= 60) return ageGroups[3];
    return ageGroups[4];
  }, [age]);

  const cityMultiplier = cityTiers.find((c) => c.value === cityTier)?.multiplier || 1;

  // Lifestyle multiplier (higher risk -> need higher cover)
  const lifestyleMultiplier = lifestyle === "active" ? 0.9 : lifestyle === "moderate" ? 1.0 : 1.2;

  // Smoker multiplier
  const smokerMultiplier = smoker ? 1.5 : 1.0;

  // Base recommended cover per person (without any multipliers)
  const baseCoverPerPerson = 500000; // ₹5 lakh

  // Calculate recommended total cover
  const recommendedCover = useMemo(() => {
    let cover = baseCoverPerPerson * familySize;
    cover *= ageGroup.multiplier;
    cover *= cityMultiplier;
    cover *= lifestyleMultiplier;
    cover *= smokerMultiplier;
    // Subtract existing cover if any (but ensure minimum 3 lakh)
    cover = Math.max(300000, cover - existingCover);
    // Round to nearest 50,000 for readability
    return Math.ceil(cover / 50000) * 50000;
  }, [familySize, ageGroup, cityMultiplier, lifestyleMultiplier, smokerMultiplier, existingCover]);

  // Estimate annual premium (approx 1.5% of sum insured for a family floater)
  const estimatedPremium = recommendedCover * 0.015;
  const monthlyPremium = estimatedPremium / 12;

  // Risk assessment
  const coverPerPerson = recommendedCover / familySize;
  let riskLevel = "Moderate";
  let riskColor = "text-amber-600";
  let riskMessage = "Your cover is adequate for most scenarios. Consider critical illness rider.";
  if (coverPerPerson < 500000) {
    riskLevel = "High";
    riskColor = "text-red-600";
    riskMessage = "Cover may be insufficient for major treatments. Consider increasing sum insured.";
  } else if (coverPerPerson >= 1000000) {
    riskLevel = "Low";
    riskColor = "text-green-600";
    riskMessage = "Well protected. Look for value-added benefits like no-claim bonus.";
  }

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/30 via-white to-teal-50/20 text-slate-800">
      <header className="bg-white/90 backdrop-blur-xl border-b border-emerald-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className={`${playfair.className} text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent`}
          >
            FinTools
          </Link>
          <span className={`${poppins.className} text-sm font-medium text-slate-600`}>
            Health Insurance Calculator
          </span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-14">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-medium mb-5 shadow-sm">
            <Heart size={16} /> Secure Your Health
          </div>
          <h1
            className={`${playfair.className} text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-4 leading-tight`}
          >
            Health Insurance{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Calculator
            </span>
          </h1>
          <p className={`${poppins.className} text-base sm:text-lg text-slate-600 max-w-3xl mx-auto`}>
            Find the right health cover for you and your family based on age, city, lifestyle, and existing policies.
            Get an instant premium estimate.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Panel */}
          <div className="lg:col-span-1 bg-white rounded-3xl shadow-xl border border-slate-200/80 p-6 md:p-7">
            <h2 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
              <Shield size={20} className="text-emerald-600" />
              Your Details
            </h2>

            <div className="space-y-6">
              {/* Age */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-slate-600">Age (Years)</label>
                  <span className="text-sm font-mono font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                    {age}
                  </span>
                </div>
                <input
                  type="range"
                  min={18}
                  max={75}
                  step={1}
                  value={age}
                  onChange={(e) => setAge(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>18</span>
                  <span>75</span>
                </div>
              </div>

              {/* City Tier */}
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">City Tier</label>
                <select
                  value={cityTier}
                  onChange={(e) => setCityTier(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400"
                >
                  {cityTiers.map((tier) => (
                    <option key={tier.value} value={tier.value}>
                      {tier.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-slate-400 mt-1.5">
                  Healthcare costs vary by city. Tier 1 cities need higher cover.
                </p>
              </div>

              {/* Family Size */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-slate-600">Family Size (including yourself)</label>
                  <span className="text-sm font-mono font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                    {familySize}
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={8}
                  step={1}
                  value={familySize}
                  onChange={(e) => setFamilySize(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>1</span>
                  <span>8</span>
                </div>
              </div>

              {/* Existing Cover */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-slate-600">Existing Health Cover (₹)</label>
                  <span className="text-sm font-mono font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                    {formatCurrency(existingCover)}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={2000000}
                  step={100000}
                  value={existingCover}
                  onChange={(e) => setExistingCover(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>₹0</span>
                  <span>₹20 Lakh</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  If you already have employer or personal cover, subtract it here.
                </p>
              </div>

              {/* Lifestyle */}
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">Lifestyle / Health Profile</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["sedentary", "moderate", "active"] as const).map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setLifestyle(opt)}
                      className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                        lifestyle === opt
                          ? "bg-emerald-600 text-white shadow-sm"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {opt === "sedentary" ? "Sedentary" : opt === "moderate" ? "Moderate" : "Active"}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-slate-400 mt-1.5">
                  Sedentary lifestyle increases health risks → higher recommended cover.
                </p>
              </div>

              {/* Smoking */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-600">Smoker / Tobacco User</label>
                <button
                  onClick={() => setSmoker(!smoker)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    smoker ? "bg-emerald-600" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      smoker ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl border border-slate-200/80 p-6 md:p-7">
            <h2 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
              <TrendingUp size={20} className="text-emerald-600" />
              Recommended Health Cover
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left side - Main number */}
              <div>
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-5 mb-5 border border-emerald-200">
                  <p className="text-sm text-emerald-700 mb-1 font-medium">Ideal Sum Insured</p>
                  <p className="text-4xl md:text-5xl font-bold text-emerald-800 tracking-tight">
                    {formatCurrency(recommendedCover)}
                  </p>
                  <p className="text-xs text-emerald-600 mt-2">
                    For {familySize} member{familySize > 1 ? "s" : ""} (₹{formatCurrency(coverPerPerson)} per person average)
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <p className="text-xs text-slate-500 mb-1">Age Factor</p>
                    <p className="text-lg font-semibold text-slate-800">{ageGroup.multiplier}x</p>
                    <p className="text-xs text-slate-400">Base cover adjusted</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <p className="text-xs text-slate-500 mb-1">City Factor</p>
                    <p className="text-lg font-semibold text-slate-800">{cityMultiplier}x</p>
                    <p className="text-xs text-slate-400">{cityTiers.find((c) => c.value === cityTier)?.label}</p>
                  </div>
                </div>

                {showPremiumEstimate && (
                  <div className="mt-5 p-4 bg-emerald-50/40 rounded-xl border border-emerald-100">
                    <p className="text-xs text-emerald-600 mb-2 flex items-center gap-1">
                      <IndianRupee size={14} /> Estimated Annual Premium
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">For family floater plan</span>
                      <span className="font-mono font-bold text-emerald-700">{formatCurrency(estimatedPremium)} / year</span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-slate-500">Monthly equivalent</span>
                      <span className="font-mono text-emerald-600">{formatCurrency(monthlyPremium)}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                      * Premiums vary by insurer, age, and add‑ons. This is a rough estimate.
                    </p>
                  </div>
                )}
              </div>

              {/* Right side - Risk & Tips */}
              <div className="flex flex-col justify-between">
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle size={18} className={riskColor} />
                    <span className="font-semibold text-slate-800">Risk Profile: {riskLevel}</span>
                  </div>
                  <p className="text-sm text-slate-600">{riskMessage}</p>
                  {coverPerPerson < 700000 && (
                    <div className="mt-3 text-xs text-amber-600 bg-amber-50 p-2 rounded-lg">
                      💡 Medical inflation in India is ~10-15% per year. Consider a top‑up plan or super top‑up for extra protection.
                    </div>
                  )}
                </div>

                <div className="mt-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Home size={16} className="text-emerald-600" />
                    <span className="text-sm font-medium text-slate-700">Why this cover?</span>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                    <li>Hospitalisation costs in top cities can exceed ₹10L for major surgeries.</li>
                    <li>Family floater plans cover all members under one sum insured.</li>
                    <li>Add critical illness rider for cancer, heart diseases, etc.</li>
                  </ul>
                </div>

                {/* Toggle premium visibility */}
                <button
                  onClick={() => setShowPremiumEstimate(!showPremiumEstimate)}
                  className="mt-4 text-xs text-emerald-600 hover:text-emerald-700 flex items-center gap-1 justify-end"
                >
                  {showPremiumEstimate ? "Hide premium estimate" : "Show premium estimate"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Tips */}
        <div className="mt-10 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <Sparkles size={18} className="text-emerald-500" />
            Health Insurance Essentials
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600">
            <div className="flex items-start gap-2">
              <ChevronRight size={14} className="shrink-0 text-emerald-500 mt-0.5" />
              <span><strong>Waiting period:</strong> Most policies have 30 days for illnesses, 2-4 years for pre‑existing diseases.</span>
            </div>
            <div className="flex items-start gap-2">
              <ChevronRight size={14} className="shrink-0 text-emerald-500 mt-0.5" />
              <span><strong>No Claim Bonus (NCB):</strong> Increase sum insured by 50% for every claim‑free year.</span>
            </div>
            <div className="flex items-start gap-2">
              <ChevronRight size={14} className="shrink-0 text-emerald-500 mt-0.5" />
              <span><strong>Co-payment & deductibles:</strong> Higher co-pay lowers premium but increases out‑of‑pocket cost.</span>
            </div>
            <div className="flex items-start gap-2">
              <ChevronRight size={14} className="shrink-0 text-emerald-500 mt-0.5" />
              <span><strong>Restoration benefit:</strong> Reinstates sum insured if exhausted in a year – very useful.</span>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200/60 py-8 mt-8 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} FinTools. Protect your health, protect your wealth.
        </div>
      </footer>
    </div>
  );
}