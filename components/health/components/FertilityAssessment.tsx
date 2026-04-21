"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Playfair_Display, Poppins } from "next/font/google";
import confetti from "canvas-confetti";
import Script from "next/script";
import Footer from "@/components/footer";

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
// Types
// ----------------------------------------------------------------------------
type QuestionId =
  | "female_age"
  | "cycle_regular"
  | "pcos"
  | "thyroid"
  | "miscarriage_history"
  | "bmi_female"
  | "stress"
  | "smoking_female"
  | "exercise_female"
  | "male_age"
  | "sperm_issues"
  | "obesity_male"
  | "testicular_problems"
  | "erectile_dysfunction"
  | "smoking_male"
  | "intercourse_frequency"
  | "ovulation_timing"
  | "ovulation_tracking"
  | "trying_duration"
  | "contraceptive_history"
  | "recent_illness";

type AnswerMap = Partial<Record<QuestionId, string>>;

type Question = {
  id: QuestionId;
  category: string;
  categoryEmoji: string;
  text: string;
  why: string;
  options: string[];
  scoreMapping: (value: string) => number;
};

// Scoring functions
const mapYesNoToScore = (value: string) => (value === "Yes" ? 1 : 0);
const mapYesNoToScore2 = (value: string) => (value === "Yes" ? 2 : 0);
const mapThreeLevel = (value: string) => {
  switch (value) {
    case "Low": return 0;
    case "Moderate": return 1;
    case "High": return 2;
    default: return 0;
  }
};
const mapFrequency = (value: string) => {
  switch (value) {
    case ">2 times per week": return 0;
    case "1-2 times per week": return 0;
    case "<1 time per week": return 2;
    default: return 0;
  }
};
const mapOvulationTiming = (value: string) => {
  switch (value) {
    case "Always during fertile window": return 0;
    case "Sometimes": return 1;
    case "Never / Not tracking": return 2;
    default: return 0;
  }
};
const mapDuration = (value: string) => {
  switch (value) {
    case "<6 months": return 0;
    case "6–12 months": return 1;
    case ">12 months": return 3;
    default: return 0;
  }
};
const mapBMI = (value: string) => {
  switch (value) {
    case "Underweight (<18.5)": return 1;
    case "Normal (18.5–24.9)": return 0;
    case "Overweight (25–29.9)": return 1;
    case "Obese (≥30)": return 2;
    default: return 0;
  }
};
const mapAgeFemale = (value: string) => {
  switch (value) {
    case "18–34": return 0;
    case "35–37": return 1;
    case "38–40": return 2;
    case ">40": return 3;
    default: return 0;
  }
};
const mapAgeMale = (value: string) => {
  switch (value) {
    case "<40": return 0;
    case "40–45": return 0;
    case ">45": return 2;
    default: return 0;
  }
};
const mapMiscarriage = (value: string) => (value === "Yes" ? 2 : 0);
const mapOvulationTracking = (value: string) => (value === "No" ? 1 : 0);
const neutralScore = () => 1;

// ----------------------------------------------------------------------------
// Questions Data
// ----------------------------------------------------------------------------
const questions: Question[] = [
  {
    id: "female_age",
    category: "Female (Your) Health",
    categoryEmoji: "👩",
    text: "What is your age?",
    why: "Age is the single most important factor affecting female fertility. Fertility begins to decline after 35.",
    options: ["18–34", "35–37", "38–40", ">40"],
    scoreMapping: mapAgeFemale,
  },
  {
    id: "cycle_regular",
    category: "Female (Your) Health",
    categoryEmoji: "👩",
    text: "Is your menstrual cycle regular?",
    why: "Irregular cycles often indicate ovulation problems, which can make conception more difficult.",
    options: ["Yes", "No", "Not sure"],
    scoreMapping: (v) => {
      if (v === "No") return 2;
      if (v === "Not sure") return 1;
      return 0;
    },
  },
  {
    id: "pcos",
    category: "Female (Your) Health",
    categoryEmoji: "👩",
    text: "Have you been diagnosed with PCOS?",
    why: "Polycystic Ovary Syndrome is a leading cause of ovulatory infertility.",
    options: ["No", "Yes", "Not sure"],
    scoreMapping: (v) => {
      if (v === "Yes") return 2;
      if (v === "Not sure") return 1;
      return 0;
    },
  },
  {
    id: "thyroid",
    category: "Female (Your) Health",
    categoryEmoji: "👩",
    text: "Do you have any thyroid issues?",
    why: "Both hypothyroidism and hyperthyroidism can disrupt ovulation and menstrual cycles.",
    options: ["No", "Yes", "Not sure"],
    scoreMapping: (v) => {
      if (v === "Yes") return 2;
      if (v === "Not sure") return 1;
      return 0;
    },
  },
  {
    id: "miscarriage_history",
    category: "Female (Your) Health",
    categoryEmoji: "👩",
    text: "Have you had previous miscarriages?",
    why: "Recurrent pregnancy loss may indicate underlying issues that affect fertility.",
    options: ["No", "Yes"],
    scoreMapping: mapMiscarriage,
  },
  {
    id: "bmi_female",
    category: "Lifestyle (Female)",
    categoryEmoji: "🏃‍♀️",
    text: "What is your BMI category?",
    why: "Both underweight and overweight can disrupt hormone balance and ovulation.",
    options: [
      "Underweight (<18.5)",
      "Normal (18.5–24.9)",
      "Overweight (25–29.9)",
      "Obese (≥30)",
      "Not sure",
    ],
    scoreMapping: (v) => {
      if (v === "Not sure") return 1;
      return mapBMI(v);
    },
  },
  {
    id: "stress",
    category: "Lifestyle (Female)",
    categoryEmoji: "🧘",
    text: "How would you rate your stress level?",
    why: "High stress can interfere with ovulation and reduce libido.",
    options: ["Low", "Moderate", "High"],
    scoreMapping: mapThreeLevel,
  },
  {
    id: "smoking_female",
    category: "Lifestyle (Female)",
    categoryEmoji: "🚭",
    text: "Do you smoke or consume alcohol?",
    why: "Smoking and heavy drinking are linked to reduced fertility and earlier menopause.",
    options: ["No", "Occasionally", "Frequently"],
    scoreMapping: mapThreeLevel,
  },
  {
    id: "exercise_female",
    category: "Lifestyle (Female)",
    categoryEmoji: "💪",
    text: "How often do you exercise?",
    why: "Extreme exercise can stop ovulation; a sedentary lifestyle contributes to weight issues.",
    options: [
      "Regularly (3+ times/week)",
      "Moderately (1-2 times/week)",
      "Sedentary",
    ],
    scoreMapping: (v) => {
      switch (v) {
        case "Regularly (3+ times/week)": return 0;
        case "Moderately (1-2 times/week)": return 1;
        case "Sedentary": return 2;
        default: return 0;
      }
    },
  },
  {
    id: "male_age",
    category: "Partner (Male) Health",
    categoryEmoji: "👨",
    text: "What is your partner's age?",
    why: "Male fertility also declines with age, especially after 45, affecting sperm quality.",
    options: ["<40", "40–45", ">45"],
    scoreMapping: mapAgeMale,
  },
  {
    id: "sperm_issues",
    category: "Partner (Male) Health",
    categoryEmoji: "👨",
    text: "Has your partner been diagnosed with sperm issues?",
    why: "Known sperm abnormalities are a direct factor in infertility.",
    options: ["No", "Yes", "Not sure"],
    scoreMapping: (v) => {
      if (v === "Yes") return 2;
      if (v === "Not sure") return 1;
      return 0;
    },
  },
  {
    id: "obesity_male",
    category: "Partner (Male) Health",
    categoryEmoji: "👨",
    text: "Is your partner obese (BMI ≥30)?",
    why: "Obesity in men can lower testosterone and sperm count.",
    options: ["No", "Yes", "Not sure"],
    scoreMapping: (v) => {
      if (v === "Yes") return 2;
      if (v === "Not sure") return 1;
      return 0;
    },
  },
  {
    id: "testicular_problems",
    category: "Partner (Male) Health",
    categoryEmoji: "👨",
    text: "Has your partner had any testicular problems?",
    why: "Conditions like varicocele or undescended testicles can impair sperm production.",
    options: ["No", "Yes", "Not sure"],
    scoreMapping: (v) => {
      if (v === "Yes") return 2;
      if (v === "Not sure") return 1;
      return 0;
    },
  },
  {
    id: "erectile_dysfunction",
    category: "Partner (Male) Health",
    categoryEmoji: "👨",
    text: "Does your partner experience erectile dysfunction?",
    why: "ED can make timed intercourse difficult and may signal underlying health issues.",
    options: ["No", "Yes", "Not sure"],
    scoreMapping: (v) => {
      if (v === "Yes") return 2;
      if (v === "Not sure") return 1;
      return 0;
    },
  },
  {
    id: "smoking_male",
    category: "Lifestyle (Male)",
    categoryEmoji: "🚭",
    text: "Does your partner smoke or consume alcohol?",
    why: "Tobacco and excessive alcohol harm sperm DNA and reduce count.",
    options: ["No", "Occasionally", "Frequently"],
    scoreMapping: mapThreeLevel,
  },
  {
    id: "intercourse_frequency",
    category: "Timing",
    categoryEmoji: "⏰",
    text: "How often do you have intercourse?",
    why: "Infrequent intercourse reduces the chance of hitting the fertile window.",
    options: [">2 times per week", "1-2 times per week", "<1 time per week"],
    scoreMapping: mapFrequency,
  },
  {
    id: "ovulation_timing",
    category: "Timing",
    categoryEmoji: "📅",
    text: "Do you time intercourse around ovulation?",
    why: "Timing intercourse correctly can double conception chances each cycle.",
    options: [
      "Always during fertile window",
      "Sometimes",
      "Never / Not tracking",
    ],
    scoreMapping: mapOvulationTiming,
  },
  {
    id: "ovulation_tracking",
    category: "Timing",
    categoryEmoji: "📱",
    text: "Do you track ovulation using kits or apps?",
    why: "Tracking helps identify the fertile window; not tracking may lead to missed opportunities.",
    options: ["Yes", "No"],
    scoreMapping: mapOvulationTracking,
  },
  {
    id: "trying_duration",
    category: "Timing",
    categoryEmoji: "⏳",
    text: "How long have you been trying to conceive?",
    why: "The length of time trying helps determine when to seek specialist help.",
    options: ["<6 months", "6–12 months", ">12 months"],
    scoreMapping: mapDuration,
  },
  {
    id: "contraceptive_history",
    category: "Timing",
    categoryEmoji: "💊",
    text: "Did you recently stop using contraception?",
    why: "It can take a few months for cycles to regulate after stopping hormonal birth control.",
    options: ["No", "Yes"],
    scoreMapping: mapYesNoToScore,
  },
  {
    id: "recent_illness",
    category: "General",
    categoryEmoji: "🩺",
    text: "Has either partner had recent illness or taken medications that could affect fertility?",
    why: "Certain illnesses and medications (e.g., steroids, antidepressants) can temporarily impact fertility.",
    options: ["No", "Yes"],
    scoreMapping: mapYesNoToScore,
  },
];

const AVG_SECONDS_PER_QUESTION = 4;

// ----------------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------------
export default function FertilityAssessment() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [totalScore, setTotalScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [progress, setProgress] = useState(0);

  // Load answers from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("fertility_answers");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setAnswers(parsed);
      } catch (e) {
        console.warn("Failed to parse saved answers");
      }
    }
  }, []);

  // Persist answers to localStorage whenever they change
  useEffect(() => {
    if (Object.keys(answers).length > 0) {
      localStorage.setItem("fertility_answers", JSON.stringify(answers));
    }
  }, [answers]);

  // Scroll to top when question changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentIndex]);

  // Progress calculation
  useEffect(() => {
    setProgress(
      questions.length > 1 ? currentIndex / (questions.length - 1) : 1
    );
  }, [currentIndex]);

  // Analytics: track question view
  useEffect(() => {
    if (!showDisclaimer && !showResult) {
      console.log("[Analytics] Question viewed:", questions[currentIndex].id);
    }
  }, [currentIndex, showDisclaimer, showResult]);

  const handleAnswerChange = (questionId: QuestionId, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const calculateScore = (): number => {
    return questions.reduce((acc, q) => {
      const answer = answers[q.id];
      if (!answer) return acc + 1;
      return acc + q.scoreMapping(answer);
    }, 0);
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      const score = calculateScore();
      setTotalScore(score);
      setShowResult(true);
      console.log("[Analytics] Assessment completed. Score:", score);
      if (score <= 6) {
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
      }
    }
  };

  const prevQuestion = () => {
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
  };

  const restart = () => {
    setCurrentIndex(0);
    setShowResult(false);
    setShowDisclaimer(true);
    setAnswers({});
    setTotalScore(0);
    localStorage.removeItem("fertility_answers");
  };

  const acceptDisclaimer = () => setShowDisclaimer(false);

  const riskLevel = useMemo(() => {
    const hasCriticalFlag =
      answers["sperm_issues"] === "Yes" ||
      answers["pcos"] === "Yes" ||
      answers["trying_duration"] === ">12 months" ||
      (answers["female_age"] && mapAgeFemale(answers["female_age"]) >= 2);

    let level: "Low" | "Moderate" | "High";
    if (totalScore <= 6) level = "Low";
    else if (totalScore <= 14) level = "Moderate";
    else level = "High";

    if (hasCriticalFlag && level !== "High" && totalScore > 8) {
      level = "High";
    } else if (hasCriticalFlag && level === "Low") {
      level = "Moderate";
    }

    return level;
  }, [totalScore, answers]);

  const factors = useMemo(() => {
    const factorsList: string[] = [];
    const a = answers;

    if (a.female_age && mapAgeFemale(a.female_age) >= 2)
      factorsList.push("👩 Advanced maternal age");
    if (a.cycle_regular === "No")
      factorsList.push("📅 Irregular ovulation");
    if (a.pcos === "Yes") factorsList.push("🫘 PCOS");
    if (a.thyroid === "Yes") factorsList.push("🦋 Thyroid issues");
    if (a.miscarriage_history === "Yes")
      factorsList.push("💔 History of miscarriage");
    if (a.bmi_female && a.bmi_female !== "Not sure" && mapBMI(a.bmi_female) >= 1)
      factorsList.push("⚖️ BMI out of normal range");
    if (a.stress === "High") factorsList.push("😰 High stress");
    if (a.smoking_female && a.smoking_female !== "No")
      factorsList.push("🚬 Smoking/alcohol (female)");
    if (a.exercise_female === "Sedentary")
      factorsList.push("🪑 Sedentary lifestyle");
    if (a.male_age && mapAgeMale(a.male_age) >= 2)
      factorsList.push("👨 Partner age >45");
    if (a.sperm_issues === "Yes")
      factorsList.push("🔬 Known sperm issues");
    if (a.smoking_male && a.smoking_male !== "No")
      factorsList.push("🚬 Smoking/alcohol (male)");
    if (a.obesity_male === "Yes") factorsList.push("⚖️ Male obesity");
    if (a.testicular_problems === "Yes")
      factorsList.push("🧬 Testicular problems");
    if (a.erectile_dysfunction === "Yes")
      factorsList.push("💊 Erectile dysfunction");
    if (a.intercourse_frequency === "<1 time per week")
      factorsList.push("🕰️ Infrequent intercourse");
    if (a.ovulation_timing === "Never / Not tracking")
      factorsList.push("📉 Poor timing around ovulation");
    if (a.ovulation_tracking === "No")
      factorsList.push("📵 Not tracking ovulation");
    if (a.trying_duration === ">12 months")
      factorsList.push("⏳ Long trying duration");

    return Array.from(new Set(factorsList));
  }, [answers]);

  const recommendations = useMemo(() => {
    const recs: string[] = [];
    const a = answers;
    const ageFemale = a.female_age ? mapAgeFemale(a.female_age) : 0;
    const duration = a.trying_duration;

    if (a.cycle_regular === "No")
      recs.push("📆 Track ovulation (LH strips, BBT) to identify fertile window.");
    if (a.intercourse_frequency === "<1 time per week")
      recs.push("💑 Aim for intercourse every 2–3 days, especially during fertile window.");
    if (
      a.ovulation_timing === "Never / Not tracking" ||
      a.ovulation_tracking === "No"
    )
      recs.push("📲 Use ovulation prediction kits or apps to time intercourse.");
    if (duration === ">12 months" && ageFemale < 1)
      recs.push("👩‍⚕️ Consult a fertility specialist if trying >12 months (age <35).");
    if (duration === ">12 months" && ageFemale >= 1)
      recs.push("👩‍⚕️ Consult a fertility specialist if trying >6 months (age ≥35).");
    if (a.bmi_female && a.bmi_female !== "Normal (18.5–24.9)" && a.bmi_female !== "Not sure")
      recs.push("🥗 Maintain a healthy BMI through diet and exercise.");
    if ((a.smoking_female && a.smoking_female !== "No") || (a.smoking_male && a.smoking_male !== "No"))
      recs.push("🚭 Reduce or eliminate smoking and alcohol consumption.");
    if (a.stress === "High")
      recs.push("🧘 Incorporate stress‑reduction techniques (yoga, meditation).");
    if (a.pcos === "Yes")
      recs.push("🩺 Consult a gynecologist for PCOS‑specific treatment options.");
    if (a.sperm_issues === "Yes")
      recs.push("🔬 Consider a semen analysis and urologist consultation.");
    if (recs.length === 0)
      recs.push("✅ Continue healthy habits. If trying >12 months, consider consulting a doctor.");

    return recs;
  }, [answers]);

  const currentQuestion = questions[currentIndex];
  const isAnswered = !!answers[currentQuestion.id];
  const riskColor =
    riskLevel === "Low"
      ? "bg-emerald-500"
      : riskLevel === "Moderate"
      ? "bg-amber-500"
      : "bg-rose-500";

  const categories = Array.from(new Set(questions.map((q) => q.category)));
  const currentCategory = currentQuestion.category;

  const handleBookConsultation = () => {
    window.location.href = "/book-consultation";
  };

  const handleDownloadReport = () => {
    const reportContent = `
Fertility Assessment Report
Generated: ${new Date().toLocaleDateString()}
Risk Level: ${riskLevel}

Possible Contributing Factors:
${factors.map((f) => `• ${f}`).join("\n")}

Recommendations:
${recommendations.map((r) => `• ${r}`).join("\n")}

Disclaimer: This is an educational tool, not a medical diagnosis.
    `;
    const blob = new Blob([reportContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "fertility-assessment-report.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* Structured Data: MedicalWebPage */}
      <Script
        id="medical-webpage-schema"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MedicalWebPage",
            name: "Free Fertility Test for Couples",
            description:
              "Interactive fertility assessment covering female and male health, lifestyle, and timing factors.",
            url: "https://revochamp.site/tools/health/fertility-assessment",
            about: {
              "@type": "MedicalCondition",
              name: "Fertility",
            },
            audience: {
              "@type": "Audience",
              name: "Couples trying to conceive",
            },
          }),
        }}
      />

      <div className="min-h-screen bg-gradient-to-b from-amber-50/30 via-white to-white">
        <header className="bg-white/90 backdrop-blur-md border-b border-amber-100 sticky top-0 z-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
            <h1 className={`${playfair.className} text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent`}>
              Revochamp
            </h1>
            <div className="hidden md:flex items-center gap-6">
              {categories.map((cat) => (
                <div key={cat} className="flex items-center gap-1">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      cat === currentCategory ? "bg-amber-500" : "bg-stone-300"
                    }`}
                  />
                  <span
                    className={`${poppins.className} text-xs font-medium ${
                      cat === currentCategory ? "text-amber-700" : "text-stone-400"
                    }`}
                  >
                    {cat.split(" ")[0]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12">
          {/* Only show headline and description on landing page */}
          {showDisclaimer && (
            <>
              <h1 className={`${playfair.className} text-4xl sm:text-5xl font-bold text-center text-stone-800 mb-6`}>
                Free Fertility Test <span className="text-amber-600">for Couples</span>
              </h1>
              <p className={`${poppins.className} text-center text-stone-600 max-w-2xl mx-auto mb-10`}>
                Answer 21 evidence‑based questions – get your fertility score, risk factors, and personalized tips in 2 minutes.
              </p>
            </>
          )}

          {showDisclaimer ? (
            <DisclaimerCard onAccept={acceptDisclaimer} />
          ) : !showResult ? (
            <QuestionCard
              question={currentQuestion}
              selected={answers[currentQuestion.id] || ""}
              onSelect={(val) => handleAnswerChange(currentQuestion.id, val)}
              onNext={nextQuestion}
              onPrev={prevQuestion}
              currentIndex={currentIndex}
              total={questions.length}
              progress={progress}
              isFirst={currentIndex === 0}
              isLast={currentIndex === questions.length - 1}
              isAnswered={isAnswered}
            />
          ) : (
            <ResultCard
              riskLevel={riskLevel}
              riskColor={riskColor}
              factors={factors}
              recommendations={recommendations}
              onRestart={restart}
              onBookConsultation={handleBookConsultation}
              onDownloadReport={handleDownloadReport}
            />
          )}

          {/* Educational content only on landing page */}
          {showDisclaimer && (
            <div className="mt-20 border-t border-amber-100 pt-12">
              <h2 className={`${playfair.className} text-3xl font-bold text-stone-800 mb-6`}>
                What Affects Fertility?
              </h2>
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
                  <h3 className={`${poppins.className} text-xl font-semibold text-amber-700 mb-3`}>
                    Female Factors
                  </h3>
                  <ul className="space-y-2 text-stone-600">
                    <li>• Age (fertility declines after 35)</li>
                    <li>• Ovulation disorders (PCOS, thyroid)</li>
                    <li>• Uterine or tubal abnormalities</li>
                    <li>• Endometriosis</li>
                    <li>• Lifestyle: BMI, smoking, stress</li>
                  </ul>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
                  <h3 className={`${poppins.className} text-xl font-semibold text-amber-700 mb-3`}>
                    Male Factors
                  </h3>
                  <ul className="space-y-2 text-stone-600">
                    <li>• Sperm count & motility issues</li>
                    <li>• Age (&gt;45 reduces fertility)</li>
                    <li>• Testicular problems (varicocele)</li>
                    <li>• Erectile dysfunction</li>
                    <li>• Lifestyle: alcohol, smoking, obesity</li>
                  </ul>
                </div>
              </div>

              <h2 className={`${playfair.className} text-3xl font-bold text-stone-800 mb-6`}>
                When to See a Doctor
              </h2>
              <p className={`${poppins.className} text-stone-600 mb-8 leading-relaxed`}>
                The American College of Obstetricians and Gynecologists (ACOG) recommends consulting a fertility specialist if:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-stone-600 mb-12">
                <li>You are under 35 and have been trying for <strong>12 months</strong> without success</li>
                <li>You are 35–40 and have been trying for <strong>6 months</strong></li>
                <li>You are over 40 – seek evaluation <strong>immediately</strong></li>
                <li>You have irregular or absent periods</li>
                <li>Known male factor issues (e.g., low sperm count)</li>
                <li>History of pelvic infections, endometriosis, or multiple miscarriages</li>
              </ul>

              {/* FAQ Section with Schema */}
              <div className="bg-amber-50/30 rounded-3xl p-6 sm:p-8 mb-12">
                <h2 className={`${playfair.className} text-3xl font-bold text-stone-800 mb-6`}>
                  Frequently Asked Questions
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className={`${poppins.className} text-lg font-semibold text-amber-800`}>
                      How accurate is this fertility test?
                    </h3>
                    <p className="text-stone-600 mt-1">
                      This tool provides an estimate based on common medical factors. It is not a medical diagnosis but a screening to help you understand potential risk factors. Accuracy depends on honest answers.
                    </p>
                  </div>
                  <div>
                    <h3 className={`${poppins.className} text-lg font-semibold text-amber-800`}>
                      Can this test predict my chances of getting pregnant?
                    </h3>
                    <p className="text-stone-600 mt-1">
                      It gives a general risk level (Low/Moderate/High) based on known fertility determinants. Many couples with “High” risk still conceive naturally; conversely, “Low” risk does not guarantee immediate pregnancy.
                    </p>
                  </div>
                  <div>
                    <h3 className={`${poppins.className} text-lg font-semibold text-amber-800`}>
                      Do I need to answer for both partners?
                    </h3>
                    <p className="text-stone-600 mt-1">
                      Yes – the assessment covers female health, male health, lifestyle, and timing. If you don’t have a partner, answer only the female sections; the score will adjust accordingly.
                    </p>
                  </div>
                  <div>
                    <h3 className={`${poppins.className} text-lg font-semibold text-amber-800`}>
                      Is my data stored or shared?
                    </h3>
                    <p className="text-stone-600 mt-1">
                      No. All answers remain in your browser’s local storage. We do not collect, store, or share any personal health information.
                    </p>
                  </div>
                </div>
              </div>

              {/* Internal Links */}
              <div className="text-center">
                <h2 className={`${playfair.className} text-2xl font-bold text-stone-800 mb-4`}>
                  More Tools to Help You Conceive
                </h2>
                <div className="flex flex-wrap justify-center gap-4">
                  <a
                    href="/tools/health/ovulation-calculator"
                    className="bg-white border border-amber-200 text-amber-700 px-5 py-2 rounded-full hover:bg-amber-50 transition"
                  >
                    📅 Ovulation Calculator
                  </a>
                  <a
                    href="/tools/health/pregnancy-calculator"
                    className="bg-white border border-amber-200 text-amber-700 px-5 py-2 rounded-full hover:bg-amber-50 transition"
                  >
                    🤰 Pregnancy Due Date Calculator
                  </a>
                  <a
                    href="/tools/health/bmi-calculator"
                    className="bg-white border border-amber-200 text-amber-700 px-5 py-2 rounded-full hover:bg-amber-50 transition"
                  >
                    ⚖️ BMI Calculator
                  </a>
                  <a
                    href="/blog/fertility-mistakes-to-avoid"
                    className="bg-white border border-amber-200 text-amber-700 px-5 py-2 rounded-full hover:bg-amber-50 transition"
                  >
                    📖 Top Fertility Mistakes
                  </a>
                </div>
              </div>
            </div>
          )}
        </main>

             <Footer />
      
        {/* <footer className="border-t border-stone-200 py-6 mt-8">
          <div className="max-w-6xl mx-auto px-4 text-center text-sm text-stone-500">
            © {new Date().getFullYear()} Revochamp. Evidence‑based fertility insights.
          </div>
        </footer> */}
      </div>

      {/* FAQ Schema */}
      <Script
        id="faq-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "How accurate is this fertility test?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "This tool provides an estimate based on common medical factors. It is not a medical diagnosis but a screening to help you understand potential risk factors.",
                },
              },
              {
                "@type": "Question",
                name: "Can this test predict my chances of getting pregnant?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "It gives a general risk level (Low/Moderate/High) based on known fertility determinants. Many couples with 'High' risk still conceive naturally.",
                },
              },
              {
                "@type": "Question",
                name: "Do I need to answer for both partners?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes – the assessment covers female health, male health, lifestyle, and timing. If you don't have a partner, answer only the female sections.",
                },
              },
              {
                "@type": "Question",
                name: "Is my data stored or shared?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "No. All answers remain in your browser's local storage. We do not collect, store, or share any personal health information.",
                },
              },
            ],
          }),
        }}
      />
    </>
  );
}

// ----------------------------------------------------------------------------
// Subcomponents
// ----------------------------------------------------------------------------
function DisclaimerCard({ onAccept }: { onAccept: () => void }) {
  const questionsCount = 21; // hardcoded for display
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-3xl shadow-xl shadow-amber-100/50 border border-amber-100 p-6 sm:p-8 max-w-3xl mx-auto"
    >
      <div className="text-center mb-6">
        <div className="text-6xl mb-3">🧬</div>
        <h2 className={`${playfair.className} text-3xl sm:text-4xl font-bold text-stone-800 mb-2`}>
          Know Your Fertility Health
        </h2>
        <p className={`${poppins.className} text-stone-600 max-w-xl mx-auto`}>
          A free, evidence‑based self‑assessment to help you understand factors that may influence your journey to conception.
        </p>
      </div>

      <div className="bg-amber-50/50 rounded-2xl p-5 mb-6 border border-amber-100">
        <h3 className={`${poppins.className} text-lg font-semibold text-amber-800 flex items-center gap-2 mb-3`}>
          <span>🎯</span> Why take this assessment?
        </h3>
        <ul className={`${poppins.className} text-sm text-stone-700 space-y-2`}>
          <li className="flex items-start gap-2"><span className="text-amber-500 mt-1">▹</span><span><strong>Early awareness</strong> — Identify potential fertility factors before they become obstacles.</span></li>
          <li className="flex items-start gap-2"><span className="text-amber-500 mt-1">▹</span><span><strong>For both partners</strong> — Covers female and male health, lifestyle, and timing factors.</span></li>
          <li className="flex items-start gap-2"><span className="text-amber-500 mt-1">▹</span><span><strong>Actionable insights</strong> — Get personalized recommendations you can discuss with your doctor.</span></li>
          <li className="flex items-start gap-2"><span className="text-amber-500 mt-1">▹</span><span><strong>Completely private</strong> — Your answers stay in your browser; no data is stored.</span></li>
        </ul>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-amber-100 shadow-sm">
          <div className="text-2xl mb-2">👩</div>
          <h4 className={`${poppins.className} font-semibold text-stone-800 text-sm`}>Female Health</h4>
          <p className={`${poppins.className} text-xs text-stone-500 mt-1`}>Age, cycle regularity, PCOS, thyroid, miscarriage history</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-amber-100 shadow-sm">
          <div className="text-2xl mb-2">👨</div>
          <h4 className={`${poppins.className} font-semibold text-stone-800 text-sm`}>Male Health</h4>
          <p className={`${poppins.className} text-xs text-stone-500 mt-1`}>Age, sperm issues, obesity, testicular problems, ED</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-amber-100 shadow-sm">
          <div className="text-2xl mb-2">⏱️</div>
          <h4 className={`${poppins.className} font-semibold text-stone-800 text-sm`}>Timing & Lifestyle</h4>
          <p className={`${poppins.className} text-xs text-stone-500 mt-1`}>Intercourse frequency, ovulation tracking, stress, BMI, smoking</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 p-4 bg-white rounded-2xl border border-stone-200">
        <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold">1</div><span className={`${poppins.className} text-sm text-stone-700`}>Answer {questionsCount} questions</span></div>
        <div className="hidden sm:block text-amber-300">→</div>
        <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold">2</div><span className={`${poppins.className} text-sm text-stone-700`}>Get your risk profile</span></div>
        <div className="hidden sm:block text-amber-300">→</div>
        <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold">3</div><span className={`${poppins.className} text-sm text-stone-700`}>Receive actionable tips</span></div>
      </div>

      <div className="bg-stone-50 rounded-xl p-4 mb-6 border border-stone-200">
        <p className={`${poppins.className} text-xs text-stone-500 flex items-start gap-2`}>
          <span className="text-base">ℹ️</span>
          <span><strong>Medical disclaimer:</strong> This tool is for educational purposes only and does not provide medical diagnosis. Always consult a qualified healthcare provider for personalized advice.</span>
        </p>
      </div>

      <div className="flex justify-center">
        <button onClick={onAccept} className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-3 px-10 rounded-full shadow-lg transition-all duration-200 transform hover:scale-[1.02] text-lg">
          ✅ Start Free Assessment
        </button>
      </div>
      <p className={`${poppins.className} text-xs text-stone-400 text-center mt-4`}>
        Takes only 2–3 minutes • 100% private • No sign‑up required
      </p>
    </motion.div>
  );
}

function QuestionCard({
  question,
  selected,
  onSelect,
  onNext,
  onPrev,
  currentIndex,
  total,
  progress,
  isFirst,
  isLast,
  isAnswered,
}: {
  question: Question;
  selected: string;
  onSelect: (val: string) => void;
  onNext: () => void;
  onPrev: () => void;
  currentIndex: number;
  total: number;
  progress: number;
  isFirst: boolean;
  isLast: boolean;
  isAnswered: boolean;
}) {
  const remaining = total - currentIndex - 1;
  const estimatedSeconds = Math.ceil(remaining * 4);
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex-1 bg-stone-200 rounded-full h-2.5">
          <motion.div
            className="bg-gradient-to-r from-amber-500 to-orange-500 h-2.5 rounded-full"
            initial={{ width: `${progress * 100}%` }}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
        <span className={`${poppins.className} text-sm font-medium text-stone-600 whitespace-nowrap`}>
          {Math.round(progress * 100)}%
        </span>
      </div>
      <div className="mb-3 text-right">
        <span className={`${poppins.className} text-xs text-stone-400`}>
          ⏱️ ~{estimatedSeconds} sec left
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-3xl shadow-xl shadow-amber-100/50 border border-amber-100 p-6 sm:p-8"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="inline-block bg-amber-50 text-amber-700 text-sm font-semibold px-4 py-1.5 rounded-full border border-amber-200">
              {question.categoryEmoji} {question.category}
            </span>
            <span className={`${poppins.className} text-sm font-medium text-stone-400`}>
              Question {currentIndex + 1} of {total}
            </span>
          </div>

          <h3 className={`${playfair.className} text-xl sm:text-2xl font-bold text-stone-800 mt-3`}>
            {question.text}
          </h3>

          <div className="mt-2 mb-4 p-3 bg-amber-50/50 rounded-xl border border-amber-100">
            <p className={`${poppins.className} text-xs text-amber-800 flex items-start gap-1.5`}>
              <span className="text-base leading-4 mt-0.5">💡</span>
              <span><strong>Why we ask:</strong> {question.why}</span>
            </p>
          </div>

          {(question.category.includes("Partner") || question.category.includes("Male")) && (
            <p className={`${poppins.className} text-xs italic text-stone-500 -mt-2 mb-4`}>
              (Answer for your male partner)
            </p>
          )}

          <div className="mt-2 space-y-2">
            {question.options.map((opt) => (
              <motion.label
                key={opt}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className={`flex items-center space-x-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  selected === opt
                    ? "border-amber-500 bg-amber-50 shadow-sm"
                    : "border-stone-200 hover:border-amber-200 hover:bg-stone-50"
                }`}
              >
                <input
                  type="radio"
                  name={question.id}
                  value={opt}
                  checked={selected === opt}
                  onChange={() => onSelect(opt)}
                  className="w-5 h-5 text-amber-500 focus:ring-amber-500"
                />
                <span className={`${poppins.className} text-stone-700`}>{opt}</span>
              </motion.label>
            ))}
          </div>

          <div className="flex justify-between mt-8">
            {!isFirst ? (
              <button
                onClick={onPrev}
                className="border-2 border-amber-200 text-amber-700 font-semibold py-2.5 px-6 rounded-full hover:bg-amber-50 transition-all"
              >
                ◀ Back
              </button>
            ) : (
              <div />
            )}
            <button
              onClick={onNext}
              disabled={!isAnswered}
              className={`bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold py-2.5 px-8 rounded-full shadow-md transition-all duration-200 transform hover:scale-[1.02] ${
                !isAnswered ? "opacity-50 cursor-not-allowed" : "hover:from-amber-600 hover:to-orange-600"
              }`}
            >
              {isLast ? "🔍 See Results" : "Next ▶"}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
      
    </div>
  );
}

function ResultCard({
  riskLevel,
  riskColor,
  factors,
  recommendations,
  onRestart,
  onBookConsultation,
  onDownloadReport,
}: {
  riskLevel: string;
  riskColor: string;
  factors: string[];
  recommendations: string[];
  onRestart: () => void;
  onBookConsultation: () => void;
  onDownloadReport: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl shadow-xl shadow-amber-100/50 border border-amber-100 p-6 sm:p-8 max-w-2xl mx-auto"
    >
      <div className="text-center mb-2">
        <span className="text-5xl">
          {riskLevel === "Low" ? "🎉" : riskLevel === "Moderate" ? "📋" : "🩺"}
        </span>
      </div>
      <h3 className={`${playfair.className} text-2xl sm:text-3xl font-bold text-stone-800 text-center`}>
        Your Fertility Snapshot
      </h3>

      <div className="flex items-center justify-center mt-6">
        <span className={`${poppins.className} text-lg text-stone-700 mr-3`}>Risk Level:</span>
        <span className={`${riskColor} text-white font-bold py-1.5 px-5 rounded-full shadow-sm`}>
          {riskLevel}
        </span>
      </div>

      {factors.length > 0 && (
        <div className="mt-6">
          <h4 className={`${poppins.className} text-lg font-semibold text-stone-800 flex items-center gap-2`}>
            <span>🔍 Possible Contributing Factors</span>
            <span className="text-xs font-normal text-stone-500">({factors.length})</span>
          </h4>
          <ul className="mt-3 space-y-2">
            {factors.map((factor, idx) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`${poppins.className} text-sm text-stone-600 flex items-start gap-2`}
              >
                <span className="text-amber-500">▹</span>
                <span>{factor}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6">
        <h4 className={`${poppins.className} text-lg font-semibold text-stone-800`}>
          💡 Personalized Recommendations
        </h4>
        <ul className="mt-3 space-y-2">
          {recommendations.map((rec, idx) => (
            <motion.li
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`${poppins.className} text-sm text-stone-600 flex items-start gap-2`}
            >
              <span className="text-emerald-500">▹</span>
              <span>{rec}</span>
            </motion.li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
        <button
          onClick={onBookConsultation}
          className="bg-amber-100 text-amber-800 font-semibold py-2.5 px-6 rounded-full hover:bg-amber-200 transition"
        >
          📅 Book a Consultation
        </button>
        <button
          onClick={onDownloadReport}
          className="bg-stone-100 text-stone-700 font-semibold py-2.5 px-6 rounded-full hover:bg-stone-200 transition"
        >
          📥 Download Report
        </button>
      </div>

      <div className="flex justify-center mt-4">
        <button
          onClick={onRestart}
          className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-3 px-8 rounded-full shadow-md transition-all duration-200 transform hover:scale-[1.02]"
        >
          🔄 Take Assessment Again
        </button>
      </div>

      <p className={`${poppins.className} text-xs text-stone-400 text-center mt-6`}>
        This tool is for educational purposes. Always consult a healthcare provider for medical advice.
      </p>
    </motion.div>
  );
}

