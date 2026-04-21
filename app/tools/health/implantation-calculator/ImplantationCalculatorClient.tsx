"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Playfair_Display, Poppins } from "next/font/google";
import Link from "next/link";
import {
  Calendar,
  Sprout,
  FlaskConical,
  Baby,
  CalendarDays,
  MoveRight,
  Square,
  AlertCircle,
  Info,
} from "lucide-react";

const playfair = Playfair_Display({ subsets: ["latin"] });
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

// ----------------------------------------------------------------------
// Service logic (same as before)
// ----------------------------------------------------------------------
function normalize(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function natural(ovulation: Date): {
  start: Date;
  end: Date;
  testDate: Date;
} {
  const start = normalize(new Date(ovulation.getTime() + 6 * 24 * 60 * 60 * 1000));
  const end = normalize(new Date(ovulation.getTime() + 10 * 24 * 60 * 60 * 1000));
  const testDate = normalize(new Date(ovulation.getTime() + 14 * 24 * 60 * 60 * 1000));
  return { start, end, testDate };
}

function ivf(
  transferDate: Date,
  embryoType: "Day-3 embryo" | "Day-5 blastocyst"
): { start: Date; end: Date; testDate: Date } {
  let start: Date, end: Date;
  if (embryoType === "Day-3 embryo") {
    start = normalize(new Date(transferDate.getTime() + 3 * 24 * 60 * 60 * 1000));
    end = normalize(new Date(transferDate.getTime() + 5 * 24 * 60 * 60 * 1000));
  } else {
    start = normalize(new Date(transferDate.getTime() + 1 * 24 * 60 * 60 * 1000));
    end = normalize(new Date(transferDate.getTime() + 3 * 24 * 60 * 60 * 1000));
  }
  const testDate = normalize(new Date(transferDate.getTime() + 10 * 24 * 60 * 60 * 1000));
  return { start, end, testDate };
}

function lmp(
  lmpDate: Date,
  cycleLength: number
): {
  ovulation: Date;
  start: Date;
  end: Date;
  testDate: Date;
} {
  const ovulation = normalize(
    new Date(lmpDate.getTime() + (cycleLength - 14) * 24 * 60 * 60 * 1000)
  );
  const { start, end, testDate } = natural(ovulation);
  return { ovulation, start, end, testDate };
}

// ----------------------------------------------------------------------
// Client Component
// ----------------------------------------------------------------------
export default function ImplantationCalculatorClient() {
  const [mode, setMode] = useState<"natural" | "ivf" | "lmp">("natural");

  // Natural
  const [ovulationDate, setOvulationDate] = useState<Date>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d;
  });

  // IVF
  const [transferDate, setTransferDate] = useState<Date>(new Date());
  const [embryoType, setEmbryoType] = useState<"Day-3 embryo" | "Day-5 blastocyst">(
    "Day-5 blastocyst"
  );

  // LMP
  const [lmpDate, setLmpDate] = useState<Date>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 28);
    return d;
  });
  const [cycleLength, setCycleLength] = useState<number>(28);

  // Results
  const [implantationStart, setImplantationStart] = useState<Date | null>(null);
  const [implantationEnd, setImplantationEnd] = useState<Date | null>(null);
  const [pregnancyTestDate, setPregnancyTestDate] = useState<Date | null>(null);
  const [estimatedOvulation, setEstimatedOvulation] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const calculate = () => {
    setError(null);
    try {
      if (mode === "natural") {
        if (!ovulationDate) {
          setError("Please select an ovulation date.");
          return;
        }
        const res = natural(ovulationDate);
        setImplantationStart(res.start);
        setImplantationEnd(res.end);
        setPregnancyTestDate(res.testDate);
        setEstimatedOvulation(null);
      } else if (mode === "ivf") {
        if (!transferDate) {
          setError("Please select an embryo transfer date.");
          return;
        }
        const res = ivf(transferDate, embryoType);
        setImplantationStart(res.start);
        setImplantationEnd(res.end);
        setPregnancyTestDate(res.testDate);
        setEstimatedOvulation(null);
      } else {
        if (!lmpDate) {
          setError("Please select the first day of your last period.");
          return;
        }
        if (cycleLength < 21 || cycleLength > 35) {
          setError("Cycle length must be between 21 and 35 days.");
          return;
        }
        const res = lmp(lmpDate, cycleLength);
        setEstimatedOvulation(res.ovulation);
        setImplantationStart(res.start);
        setImplantationEnd(res.end);
        setPregnancyTestDate(res.testDate);
      }
    } catch (e) {
      setError("Something went wrong. Please check your inputs.");
    }
  };

  useEffect(() => {
    calculate();
  }, [mode, ovulationDate, transferDate, embryoType, lmpDate, cycleLength]);

  const rawResultItems = [
    estimatedOvulation && {
      icon: <CalendarDays className="text-amber-600" size={20} />,
      label: "Estimated ovulation",
      value: formatDate(estimatedOvulation),
    },
    implantationStart && {
      icon: <MoveRight className="text-amber-600" size={20} />,
      label: "Implantation start",
      value: formatDate(implantationStart),
    },
    implantationEnd && {
      icon: <Square className="text-amber-600" size={20} />,
      label: "Implantation end",
      value: formatDate(implantationEnd),
    },
    pregnancyTestDate && {
      icon: <Baby className="text-amber-600" size={20} />,
      label: "Recommended pregnancy test",
      value: formatDate(pregnancyTestDate),
    },
  ].filter((item): item is NonNullable<typeof item> => item !== null && item !== undefined);

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
          <span className={`${poppins.className} text-xs text-stone-500`}>
            Health Tools
          </span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <span>🧬</span> Fertility Tool
          </div>
          <h1 className={`${playfair.className} text-3xl sm:text-4xl font-extrabold text-stone-800 mb-3`}>
            Implantation Calculator
          </h1>
          <p className={`${poppins.className} text-base text-stone-600 max-w-2xl`}>
            Estimate when implantation may occur and when to take a pregnancy test,
            based on ovulation, IVF transfer, or your last menstrual period.
          </p>
        </motion.div>

        {/* Input Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-stone-100 overflow-hidden mb-8">
          <div className="p-6 md:p-8">
            <div className="mb-6">
              <label className="block text-stone-700 font-medium mb-3">
                Select calculation method:
              </label>
              <div className="flex flex-wrap gap-3">
                {[
                  { value: "natural", label: "🌿 Natural Cycle", icon: <Sprout size={18} /> },
                  { value: "ivf", label: "🧪 IVF", icon: <FlaskConical size={18} /> },
                  { value: "lmp", label: "📆 LMP", icon: <Calendar size={18} /> },
                ].map((item) => (
                  <button
                    key={item.value}
                    onClick={() => setMode(item.value as typeof mode)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      mode === item.value
                        ? "bg-gradient-to-r from-amber-500 to-pink-500 text-white shadow-md"
                        : "bg-white text-stone-600 hover:bg-stone-100 border border-stone-200"
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-5">
              {mode === "natural" && (
                <DatePickerField
                  label="Ovulation Date"
                  value={ovulationDate}
                  onChange={setOvulationDate}
                />
              )}

              {mode === "ivf" && (
                <>
                  <DatePickerField
                    label="Embryo Transfer Date"
                    value={transferDate}
                    onChange={setTransferDate}
                  />
                  <div>
                    <label className="block text-stone-700 font-medium mb-2">
                      Embryo Type
                    </label>
                    <select
                      value={embryoType}
                      onChange={(e) =>
                        setEmbryoType(e.target.value as typeof embryoType)
                      }
                      className="w-full p-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="Day-3 embryo">Day‑3 embryo</option>
                      <option value="Day-5 blastocyst">Day‑5 blastocyst</option>
                    </select>
                  </div>
                </>
              )}

              {mode === "lmp" && (
                <>
                  <DatePickerField
                    label="First day of last menstrual period"
                    value={lmpDate}
                    onChange={setLmpDate}
                  />
                  <div>
                    <label className="block text-stone-700 font-medium mb-2">
                      Cycle length (days)
                    </label>
                    <input
                      type="number"
                      value={cycleLength}
                      onChange={(e) => setCycleLength(Number(e.target.value))}
                      min={21}
                      max={35}
                      className="w-full p-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500"
                    />
                    <p className="text-xs text-stone-400 mt-1">
                      Typical range: 21–35 days
                    </p>
                  </div>
                </>
              )}
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-xl text-sm flex items-center gap-2">
                <AlertCircle size={16} />
                {error}
              </div>
            )}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {implantationStart && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl shadow-lg border border-stone-100 overflow-hidden mb-8"
            >
              <div className="p-6 md:p-8">
                <h2 className={`${playfair.className} text-2xl font-bold text-stone-800 mb-4`}>
                  📊 Your Implantation Window
                </h2>
                <div className="space-y-4">
                  {rawResultItems.map((item, idx) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl"
                    >
                      <div className="w-8">{item.icon}</div>
                      <div className="flex-1">
                        <p className="text-sm text-stone-500">{item.label}</p>
                        <p className="font-semibold text-stone-800">{item.value}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-amber-50 rounded-xl text-sm text-stone-600">
                  <Info size={16} className="inline mr-1 text-amber-600" />
                  Implantation usually occurs 6–10 days after ovulation. For IVF,
                  timing depends on embryo age. A pregnancy test is typically
                  reliable 14 days after ovulation or 10 days after embryo transfer.
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="bg-white/50 rounded-2xl border border-stone-200 p-6">
          <h3 className={`${playfair.className} text-xl font-bold text-stone-800 mb-2`}>
            How implantation works
          </h3>
          <p className="text-stone-600 text-sm leading-relaxed">
            Implantation is the process where a fertilized egg attaches to the
            lining of the uterus. It typically occurs 6–10 days after ovulation.
            After implantation, the body begins producing hCG, which pregnancy
            tests detect. A test taken too early may give a false negative.
          </p>
          <div className="mt-4 p-3 bg-stone-100 rounded-lg text-xs text-stone-500 italic">
            ⚠️ This calculator provides estimated timing based on average
            biological patterns and should not replace professional medical advice.
          </div>
        </div>
      </main>

      <footer className="border-t border-stone-200 py-6 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-stone-400">
          © {new Date().getFullYear()} Revochamp. Evidence‑based wellness tools.
        </div>
      </footer>
    </div>
  );
}

// ----------------------------------------------------------------------
// Reusable Date Picker Component
// ----------------------------------------------------------------------
function DatePickerField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: Date;
  onChange: (date: Date) => void;
}) {
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    if (!isNaN(newDate.getTime())) {
      onChange(newDate);
    }
  };

  return (
    <div>
      <label className="block text-stone-700 font-medium mb-2">{label}</label>
      <div className="relative">
        <input
          type="date"
          value={value.toISOString().split("T")[0]}
          onChange={handleDateChange}
          className="w-full p-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500"
        />
      </div>
    </div>
  );
}