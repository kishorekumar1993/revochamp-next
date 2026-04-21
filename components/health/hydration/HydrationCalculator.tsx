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
  weight: ["400", "500", "600", "700"],
});

// ----------------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------------
export default function HydrationCalculator() {
  const [weight, setWeight] = useState<number>(70);
  const [age, setAge] = useState<number>(30);
  const [gender, setGender] = useState<"Male" | "Female" | "Other">("Male");
  const [activity, setActivity] = useState<"Light Exercise" | "Moderate" | "Heavy">("Light Exercise");
  const [isHot, setIsHot] = useState<boolean>(false);
  const [isCold, setIsCold] = useState<boolean>(false);

  const [dailyWaterMl, setDailyWaterMl] = useState<number>(2300);
  const [dailyGlasses, setDailyGlasses] = useState<number>(9);
  const [workoutRecommendation, setWorkoutRecommendation] = useState<string>("");

  useEffect(() => {
    calculateHydration();
  }, [weight, age, gender, activity, isHot, isCold]);

  const calculateHydration = () => {
    let mlPerKg: number;
    switch (gender) {
      case "Male": mlPerKg = 35; break;
      case "Female": mlPerKg = 31; break;
      default: mlPerKg = 33;
    }

    let baseMl = weight * mlPerKg;
    if (activity === "Moderate") baseMl += 400;
    if (activity === "Heavy") baseMl += 800;
    if (isHot) baseMl += 400;
    if (isCold) baseMl += 100;

    baseMl = Math.min(4500, Math.max(1500, baseMl));
    setDailyWaterMl(Math.round(baseMl));
    setDailyGlasses(Math.round(baseMl / 250));
    setWorkoutRecommendation(`${Math.round(baseMl)} ml recommended (based on your inputs)`);
  };

  const litersDisplay = (dailyWaterMl / 1000).toFixed(1);
  const progressPercent = Math.min(100, (dailyWaterMl / 3500) * 100);

  const handleHotToggle = () => {
    setIsHot(!isHot);
    if (!isHot) setIsCold(false);
  };

  const handleColdToggle = () => {
    setIsCold(!isCold);
    if (!isCold) setIsHot(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-blue-100 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className={`${playfair.className} text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent`}>
            Revochamp
          </h1>
          <span className={`${poppins.className} text-xs sm:text-sm text-stone-500`}>
            Hydration Calculator
          </span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 md:py-8">
        {/* Hero - Compact */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 md:mb-8"
        >
          <div className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs sm:text-sm font-medium mb-3">
            <span>💧</span> Stay Hydrated, Stay Healthy
          </div>
          <h2 className={`${playfair.className} text-2xl sm:text-4xl font-extrabold text-stone-800 leading-tight`}>
            Daily Water Intake{" "}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Personalized
            </span>
          </h2>
          <p className={`${poppins.className} text-sm sm:text-base text-stone-600 mt-1 max-w-2xl`}>
            Based on your weight, age, activity, and climate.
          </p>
        </motion.div>

        {/* Main Grid: Form + Result */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 lg:gap-6">
          {/* Form Section - Takes 3 columns */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg shadow-blue-100/50 border border-blue-100 p-5 sm:p-6">
              <h3 className={`${playfair.className} text-lg font-bold text-stone-800 mb-4 flex items-center gap-2`}>
                <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">📋</span>
                Your Details
              </h3>

              <div className="space-y-4">
                {/* Weight & Age */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1">Weight (kg)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">⚖️</span>
                      <input
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(Number(e.target.value) || 0)}
                        min={30}
                        max={200}
                        className="w-full pl-9 pr-3 py-2.5 border border-stone-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1">Age</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">🎂</span>
                      <input
                        type="number"
                        value={age}
                        onChange={(e) => setAge(Number(e.target.value) || 0)}
                        min={15}
                        max={100}
                        className="w-full pl-9 pr-3 py-2.5 border border-stone-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">Gender</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["Female", "Male", "Other"] as const).map((g) => (
                      <button
                        key={g}
                        onClick={() => setGender(g)}
                        className={`py-2.5 px-2 rounded-xl text-sm font-medium transition-all ${
                          gender === g
                            ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-sm"
                            : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                        }`}
                      >
                        {g === "Female" ? "♀️" : g === "Male" ? "♂️" : "⚧"} {g}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Activity */}
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">Activity Level</label>
                  <select
                    value={activity}
                    onChange={(e) => setActivity(e.target.value as typeof activity)}
                    className="w-full p-2.5 border border-stone-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="Light Exercise">Light Exercise</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Heavy">Heavy</option>
                  </select>
                </div>

                {/* Climate */}
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">Climate</label>
                  <div className="flex gap-3">
                    <button
                      onClick={handleHotToggle}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-sm transition-all ${
                        isHot
                          ? "bg-orange-100 border-orange-300 text-orange-700"
                          : "bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100"
                      }`}
                    >
                      <span>☀️</span> Hot
                    </button>
                    <button
                      onClick={handleColdToggle}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-sm transition-all ${
                        isCold
                          ? "bg-blue-100 border-blue-300 text-blue-700"
                          : "bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100"
                      }`}
                    >
                      <span>❄️</span> Cold
                    </button>
                  </div>
                </div>

                {/* Calculate Button */}
                <button
                  onClick={calculateHydration}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-3 px-4 rounded-xl shadow-md transition-all duration-200 transform hover:scale-[1.01] text-sm sm:text-base"
                >
                  💧 Calculate Water Intake
                </button>
              </div>
            </div>
          </div>

          {/* Result Section - Takes 2 columns */}
          <div className="lg:col-span-2">
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/40 p-5 sm:p-6 sticky top-20">
              <h3 className={`${playfair.className} text-lg font-bold text-stone-800 mb-3 text-center`}>
                Your Daily Intake
              </h3>

              {/* Wave Progress Visualization */}
              <div className="relative h-32 mb-4">
                <div className="absolute inset-0 flex items-end">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${progressPercent}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="w-full bg-gradient-to-t from-blue-500 to-cyan-400 rounded-b-xl"
                    style={{ height: `${progressPercent}%` }}
                  />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
                    <motion.span
                      key={dailyWaterMl}
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent"
                    >
                      {litersDisplay}L
                    </motion.span>
                  </div>
                </div>
              </div>

              <p className="text-center text-stone-500 text-sm mb-4">
                ≈ {dailyGlasses} glasses (250ml)
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="text-center p-2 bg-blue-50/50 rounded-lg">
                  <div className="text-lg">⏱️</div>
                  <div className="text-xs font-medium text-stone-600">Every 2h</div>
                </div>
                <div className="text-center p-2 bg-blue-50/50 rounded-lg">
                  <div className="text-lg">🔥</div>
                  <div className="text-xs font-medium text-stone-600">2-3L Daily</div>
                </div>
                <div className="text-center p-2 bg-blue-50/50 rounded-lg">
                  <div className="text-lg">💪</div>
                  <div className="text-xs font-medium text-stone-600">{dailyWaterMl}ml</div>
                </div>
              </div>

              {/* Workout */}
              <div className="p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100 mb-3">
                <p className="text-xs font-semibold text-stone-700 flex items-center gap-1">
                  <span>🏋️</span> Workout Adjustment
                </p>
                <p className="text-xs text-stone-600 mt-1">{workoutRecommendation}</p>
              </div>

              {/* Pregnancy */}
              <div className="p-3 bg-pink-50 rounded-xl border border-pink-100">
                <p className="text-xs font-semibold text-stone-700 flex items-center gap-1">
                  <span>🤰</span> Pregnancy Hydration
                </p>
                <p className="text-xs text-stone-600 mt-1">
                  3300 ml during pregnancy to support healthy fluid balance.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits & Tips - Compact Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Benefits */}
          <div>
            <h3 className={`${playfair.className} text-lg font-bold text-stone-800 mb-3`}>
              ✨ Benefits of Hydration
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { emoji: "☀️", title: "Morning Boost", desc: "Kickstart metabolism" },
                { emoji: "⚡", title: "Energy", desc: "Prevents fatigue" },
                { emoji: "💪", title: "Performance", desc: "Better workouts" },
                { emoji: "🧠", title: "Focus", desc: "Mental clarity" },
              ].map((benefit, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white p-3 rounded-xl border border-blue-100 shadow-sm"
                >
                  <div className="text-2xl mb-1">{benefit.emoji}</div>
                  <h4 className="text-sm font-semibold text-stone-800">{benefit.title}</h4>
                  <p className="text-xs text-stone-500">{benefit.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Daily Tips */}
          <div>
            <h3 className={`${playfair.className} text-lg font-bold text-stone-800 mb-3`}>
              📝 Daily Tips
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { emoji: "☀️", label: "After waking up" },
                { emoji: "🍽️", label: "Before meals" },
                { emoji: "💪", label: "During workouts" },
                { emoji: "🧴", label: "Carry a bottle" },
              ].map((tip, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-gradient-to-br from-blue-50 to-cyan-50 p-3 rounded-xl border border-blue-100 text-center"
                >
                  <div className="text-2xl mb-1">{tip.emoji}</div>
                  <p className="text-xs font-medium text-stone-700">{tip.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 p-3 bg-stone-50 border border-stone-200 rounded-xl text-center">
          <p className="text-xs text-stone-500">
            ⚠️ Estimates based on general guidelines. Individual needs may vary.
          </p>
        </div>
      </main>

      <footer className="border-t border-stone-200 py-4">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-stone-400">
          © {new Date().getFullYear()} Revochamp. Evidence‑based wellness insights.
        </div>
      </footer>
    </div>
  );
}

// "use client";

// import React, { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Playfair_Display, Poppins } from "next/font/google";

// // ----------------------------------------------------------------------------
// // Fonts
// // ----------------------------------------------------------------------------
// const playfair = Playfair_Display({
//   subsets: ["latin"],
//   weight: ["400", "700", "800"],
// });
// const poppins = Poppins({
//   subsets: ["latin"],
//   weight: ["400", "500", "600", "700"],
// });

// // ----------------------------------------------------------------------------
// // Main Component
// // ----------------------------------------------------------------------------
// export default function HydrationCalculator() {
//   // Inputs
//   const [weight, setWeight] = useState<number>(70);
//   const [age, setAge] = useState<number>(30);
//   const [gender, setGender] = useState<"Male" | "Female" | "Other">("Male");
//   const [activity, setActivity] = useState<"Light Exercise" | "Moderate" | "Heavy">("Light Exercise");
//   const [isHot, setIsHot] = useState<boolean>(false);
//   const [isCold, setIsCold] = useState<boolean>(false);

//   // Results
//   const [dailyWaterMl, setDailyWaterMl] = useState<number>(2300);
//   const [dailyGlasses, setDailyGlasses] = useState<number>(9);
//   const [workoutRecommendation, setWorkoutRecommendation] = useState<string>("");
//   const [pregnancyTip] = useState<string>(
//     "3300 ml during pregnancy to support healthy fluid balance."
//   );

//   // Calculate on input change
//   useEffect(() => {
//     calculateHydration();
//   }, [weight, age, gender, activity, isHot, isCold]);

//   const calculateHydration = () => {
//     let mlPerKg: number;
//     switch (gender) {
//       case "Male":
//         mlPerKg = 35;
//         break;
//       case "Female":
//         mlPerKg = 31;
//         break;
//       default:
//         mlPerKg = 33;
//     }

//     let baseMl = weight * mlPerKg;

//     if (activity === "Moderate") baseMl += 400;
//     if (activity === "Heavy") baseMl += 800;
//     if (isHot) baseMl += 400;
//     if (isCold) baseMl += 100;

//     // Clamp between 1500 and 4000 ml
//     baseMl = Math.min(4000, Math.max(1500, baseMl));

//     setDailyWaterMl(Math.round(baseMl));
//     setDailyGlasses(Math.round(baseMl / 250));
//     setWorkoutRecommendation(`${Math.round(baseMl)} ml recommended (based on your inputs)`);
//   };

//   const litersDisplay = (dailyWaterMl / 1000).toFixed(1);

//   // Handle climate toggles (mutually exclusive)
//   const handleHotToggle = () => {
//     setIsHot(!isHot);
//     if (!isHot) setIsCold(false);
//   };

//   const handleColdToggle = () => {
//     setIsCold(!isCold);
//     if (!isCold) setIsHot(false);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-blue-50/30 via-white to-white">
//       {/* Header */}
//       <header className="bg-white/90 backdrop-blur-md border-b border-blue-100 sticky top-0 z-20">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
//           <h1
//             className={`${playfair.className} text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent`}
//           >
//             Revochamp
//           </h1>
//           <span className={`${poppins.className} text-sm text-stone-500 hidden sm:block`}>
//             Hydration Calculator
//           </span>
//         </div>
//       </header>

//       <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
//         {/* Hero Section */}
//         <motion.div
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="mb-10"
//         >
//           <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
//             <span>💧</span>
//             <span>Stay Hydrated, Stay Healthy</span>
//           </div>
//           <h2
//             className={`${playfair.className} text-3xl sm:text-5xl font-extrabold text-stone-800 mb-3`}
//           >
//             Daily Water Intake
//             <br />
//             <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
//               Personalized for You
//             </span>
//           </h2>
//           <p className={`${poppins.className} text-base sm:text-lg text-stone-600 max-w-3xl`}>
//             Calculate how much water your body needs daily based on your weight, age, activity level, and climate.
//           </p>
//         </motion.div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Left Column: Calculator Form */}
//           <div className="lg:col-span-2">
//             <div className="bg-white rounded-3xl shadow-xl shadow-blue-100/50 border border-blue-100 p-6 sm:p-8">
//               <h3 className={`${playfair.className} text-xl font-bold text-stone-800 mb-6`}>
//                 📋 Your Details
//               </h3>

//               <div className="space-y-5">
//                 {/* Weight & Age Row */}
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-stone-700 mb-1">
//                       ⚖️ Weight (kg)
//                     </label>
//                     <input
//                       type="number"
//                       value={weight}
//                       onChange={(e) => setWeight(Number(e.target.value) || 0)}
//                       min={30}
//                       max={200}
//                       className="w-full p-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-stone-700 mb-1">
//                       🎂 Age (years)
//                     </label>
//                     <input
//                       type="number"
//                       value={age}
//                       onChange={(e) => setAge(Number(e.target.value) || 0)}
//                       min={15}
//                       max={100}
//                       className="w-full p-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   </div>
//                 </div>

//                 {/* Gender Selection */}
//                 <div>
//                   <label className="block text-sm font-medium text-stone-700 mb-2">
//                     👤 Gender
//                   </label>
//                   <div className="flex gap-2">
//                     {(["Female", "Male", "Other"] as const).map((g) => (
//                       <button
//                         key={g}
//                         onClick={() => setGender(g)}
//                         className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
//                           gender === g
//                             ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md"
//                             : "bg-stone-100 text-stone-600 hover:bg-stone-200"
//                         }`}
//                       >
//                         {g === "Female" && "♀️"} {g === "Male" && "♂️"} {g === "Other" && "⚧"} {g}
//                       </button>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Activity Level */}
//                 <div>
//                   <label className="block text-sm font-medium text-stone-700 mb-2">
//                     🏃 Activity Level
//                   </label>
//                   <select
//                     value={activity}
//                     onChange={(e) => setActivity(e.target.value as typeof activity)}
//                     className="w-full p-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="Light Exercise">Light Exercise</option>
//                     <option value="Moderate">Moderate</option>
//                     <option value="Heavy">Heavy</option>
//                   </select>
//                 </div>

//                 {/* Climate */}
//                 <div>
//                   <label className="block text-sm font-medium text-stone-700 mb-2">
//                     🌡️ Climate
//                   </label>
//                   <div className="flex gap-4">
//                     <button
//                       onClick={handleHotToggle}
//                       className={`flex items-center gap-2 py-2 px-5 rounded-full border transition-all ${
//                         isHot
//                           ? "bg-orange-100 border-orange-300 text-orange-700"
//                           : "bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100"
//                       }`}
//                     >
//                       <span className="text-xl">☀️</span> Hot
//                     </button>
//                     <button
//                       onClick={handleColdToggle}
//                       className={`flex items-center gap-2 py-2 px-5 rounded-full border transition-all ${
//                         isCold
//                           ? "bg-blue-100 border-blue-300 text-blue-700"
//                           : "bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100"
//                       }`}
//                     >
//                       <span className="text-xl">❄️</span> Cold
//                     </button>
//                   </div>
//                 </div>

//                 {/* Calculate Button */}
//                 <button
//                   onClick={calculateHydration}
//                   className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-4 px-6 rounded-full shadow-md transition-all duration-200 transform hover:scale-[1.02] mt-4"
//                 >
//                   💧 Calculate Water Intake
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Right Column: Result Card */}
//           <div className="lg:col-span-1">
//             <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 p-6 sm:p-8 sticky top-20">
//               <h3 className={`${playfair.className} text-xl font-bold text-stone-800 text-center mb-2`}>
//                 💧 Your Daily Intake
//               </h3>
//               <div className="text-center">
//                 <motion.div
//                   key={dailyWaterMl}
//                   initial={{ scale: 0.9, opacity: 0 }}
//                   animate={{ scale: 1, opacity: 1 }}
//                   className="text-6xl font-extrabold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent"
//                 >
//                   {litersDisplay} L
//                 </motion.div>
//                 <p className="text-stone-500 mt-1">≈ {dailyGlasses} glasses (250ml each)</p>
//               </div>

//               <div className="mt-6 p-4 bg-blue-50/50 rounded-2xl">
//                 <div className="flex justify-around text-sm font-medium text-stone-700">
//                   <div className="text-center">
//                     <div className="text-2xl mb-1">⏱️</div>
//                     <div>Every 2h</div>
//                   </div>
//                   <div className="text-center">
//                     <div className="text-2xl mb-1">🔥</div>
//                     <div>2-3L Daily</div>
//                   </div>
//                   <div className="text-center">
//                     <div className="text-2xl mb-1">💪</div>
//                     <div>{dailyWaterMl} ml</div>
//                   </div>
//                 </div>
//               </div>

//               {/* Workout Recommendation */}
//               <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-100">
//                 <h4 className={`${poppins.className} font-semibold text-stone-800 flex items-center gap-2`}>
//                   <span>🏋️</span> Workout Adjustment
//                 </h4>
//                 <p className={`${poppins.className} text-sm text-stone-600 mt-2`}>
//                   {workoutRecommendation}
//                 </p>
//               </div>

//               {/* Pregnancy Tip */}
//               <div className="mt-4 p-4 bg-pink-50 rounded-2xl border border-pink-100">
//                 <h4 className={`${poppins.className} font-semibold text-stone-800 flex items-center gap-2`}>
//                   <span>🤰</span> Pregnancy Hydration
//                 </h4>
//                 <p className={`${poppins.className} text-sm text-stone-600 mt-2`}>
//                   {pregnancyTip}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Benefits Section */}
//         <div className="mt-16">
//           <h3 className={`${playfair.className} text-2xl sm:text-3xl font-bold text-stone-800 mb-6`}>
//             ✨ Benefits of Staying Hydrated
//           </h3>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
//             {[
//               {
//                 emoji: "☀️",
//                 title: "Morning Boost",
//                 desc: "Drink water after waking up to kickstart your metabolism.",
//               },
//               {
//                 emoji: "⚡",
//                 title: "Sustained Energy",
//                 desc: "Proper hydration prevents fatigue and brain fog.",
//               },
//               {
//                 emoji: "💪",
//                 title: "Workout Performance",
//                 desc: "Stay hydrated before, during, and after exercise.",
//               },
//               {
//                 emoji: "🧠",
//                 title: "Mental Clarity",
//                 desc: "Even mild dehydration affects concentration and mood.",
//               },
//             ].map((benefit, idx) => (
//               <motion.div
//                 key={idx}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: idx * 0.1 }}
//                 className="bg-white rounded-2xl shadow-lg border border-blue-100 p-5 hover:shadow-xl transition-shadow"
//               >
//                 <div className="text-4xl mb-3">{benefit.emoji}</div>
//                 <h4 className={`${poppins.className} font-semibold text-stone-800`}>
//                   {benefit.title}
//                 </h4>
//                 <p className={`${poppins.className} text-sm text-stone-500 mt-1`}>
//                   {benefit.desc}
//                 </p>
//               </motion.div>
//             ))}
//           </div>
//         </div>

//         {/* Daily Tips */}
//         <div className="mt-16">
//           <h3 className={`${playfair.className} text-2xl sm:text-3xl font-bold text-stone-800 mb-6`}>
//             📝 Daily Hydration Tips
//           </h3>
//           <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
//             {[
//               { emoji: "☀️", label: "Drink after waking up" },
//               { emoji: "🍽️", label: "Drink before meals" },
//               { emoji: "💪", label: "Drink during workouts" },
//               { emoji: "🧴", label: "Carry a water bottle" },
//             ].map((tip, idx) => (
//               <motion.div
//                 key={idx}
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 transition={{ delay: idx * 0.1 }}
//                 className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-5 text-center border border-blue-100"
//               >
//                 <div className="text-4xl mb-2">{tip.emoji}</div>
//                 <p className={`${poppins.className} text-sm font-medium text-stone-700`}>
//                   {tip.label}
//                 </p>
//               </motion.div>
//             ))}
//           </div>
//         </div>

//         {/* Disclaimer */}
//         <div className="mt-12 p-4 bg-stone-50 border border-stone-200 rounded-2xl text-center">
//           <p className={`${poppins.className} text-sm text-stone-500 italic`}>
//             ⚠️ This calculator provides estimates based on general guidelines. Individual hydration needs may vary.
//             Consult a healthcare professional for personalized advice.
//           </p>
//         </div>
//       </main>

//       <footer className="border-t border-stone-200 py-6 mt-12">
//         <div className="max-w-7xl mx-auto px-4 text-center text-sm text-stone-500">
//           © {new Date().getFullYear()} Revochamp. Evidence‑based wellness insights.
//         </div>
//       </footer>
//     </div>
//   );
// }