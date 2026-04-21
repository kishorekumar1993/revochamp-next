// app/health/pregnancy-symptom-checker/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Playfair_Display, Poppins } from 'next/font/google';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-playfair',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});

// ----------------------------------------------------------------------------
// Improved Models & Types
// ----------------------------------------------------------------------------
type Severity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
type MatchType = 'ALL' | 'ANY';

interface Symptom {
  id: string;
  name: string;
}

interface SymptomRule {
  id: string;
  priority: number;
  requiredSymptoms: string[];
  excludedSymptoms?: string[];
  matchType: MatchType;
  condition: string;
  severity: Severity;
  advice: string[];
  isEmergency: boolean;
  minWeek?: number;
  maxWeek?: number;
  score?: number;      // base confidence score (0-100)
  tags?: string[];
}

// ----------------------------------------------------------------------------
// Symptom Data (standardized snake_case IDs)
// ----------------------------------------------------------------------------
const allSymptoms: Symptom[] = [
  { id: 'nausea', name: 'Nausea' },
  { id: 'vomiting', name: 'Vomiting' },
  { id: 'fatigue', name: 'Fatigue' },
  { id: 'back_pain', name: 'Back Pain' },
  { id: 'headache', name: 'Headache' },
  { id: 'swelling', name: 'Swelling (hands/feet)' },
  { id: 'vaginal_bleeding', name: 'Vaginal bleeding' },
  { id: 'abdominal_pain', name: 'Abdominal pain' },
  { id: 'dizziness', name: 'Dizziness' },
  { id: 'blurred_vision', name: 'Blurred vision' },
  { id: 'shortness_of_breath', name: 'Shortness of breath' },
  { id: 'fever', name: 'Fever' },
  { id: 'chest_pain', name: 'Chest pain' },
  { id: 'pelvic_pressure', name: 'Pelvic pressure' },
  { id: 'frequent_urination', name: 'Frequent urination' },
  { id: 'heartburn', name: 'Heartburn' },
  { id: 'constipation', name: 'Constipation' },
];

// ----------------------------------------------------------------------------
// Improved Rule Set (more accurate, fewer false emergencies)
// ----------------------------------------------------------------------------
const rules: SymptomRule[] = [
  // EMERGENCY RULES (CRITICAL)
  {
    id: 'preeclampsia',
    priority: 1,
    requiredSymptoms: ['swelling', 'headache', 'blurred_vision'],
    matchType: 'ANY',            // any two of these?
    condition: 'Possible preeclampsia',
    severity: 'CRITICAL',
    advice: [
      'Seek emergency medical care immediately.',
      'Monitor blood pressure if possible.',
      'Do not wait for symptoms to worsen.',
    ],
    isEmergency: true,
    minWeek: 20,
    score: 90,
    tags: ['emergency', 'trimester2', 'trimester3'],
  },
  {
    id: 'miscarriage_ectopic',
    priority: 1,
    requiredSymptoms: ['vaginal_bleeding', 'abdominal_pain'],
    excludedSymptoms: ['light_spotting'],
    matchType: 'ALL',
    condition: 'Possible miscarriage or ectopic pregnancy',
    severity: 'CRITICAL',
    advice: [
      'Seek emergency medical care immediately.',
      'Note the amount and color of bleeding.',
      'Avoid taking any medication without consulting a doctor.',
    ],
    isEmergency: true,
    score: 95,
    tags: ['emergency', 'trimester1'],
  },
  {
    id: 'pulmonary_embolism',
    priority: 1,
    requiredSymptoms: ['chest_pain', 'shortness_of_breath'],
    matchType: 'ALL',
    condition: 'Possible pulmonary embolism',
    severity: 'CRITICAL',
    advice: [
      'Call emergency services (112) immediately.',
      'Try to stay calm and seated upright.',
      'Do not delay – this is life‑threatening.',
    ],
    isEmergency: true,
    score: 100,
    tags: ['emergency'],
  },
  {
    id: 'severe_infection',
    priority: 1,
    requiredSymptoms: ['fever', 'abdominal_pain'],
    matchType: 'ALL',
    condition: 'Possible serious infection',
    severity: 'CRITICAL',
    advice: [
      'Go to the emergency room or call your doctor immediately.',
      'High fever during pregnancy can harm the baby.',
    ],
    isEmergency: true,
    score: 85,
    tags: ['emergency'],
  },
  {
    id: 'severe_preeclampsia',
    priority: 1,
    requiredSymptoms: ['blurred_vision', 'headache'],
    matchType: 'ALL',
    condition: 'Severe preeclampsia warning',
    severity: 'CRITICAL',
    advice: [
      'Go to the emergency room immediately.',
      'This can progress rapidly – do not wait.',
    ],
    isEmergency: true,
    minWeek: 20,
    score: 95,
    tags: ['emergency', 'trimester2', 'trimester3'],
  },
  {
    id: 'heavy_bleeding',
    priority: 1,
    requiredSymptoms: ['vaginal_bleeding'],
    matchType: 'ANY',
    condition: 'Heavy vaginal bleeding',
    severity: 'CRITICAL',
    advice: [
      'Call your healthcare provider or go to the ER immediately.',
      'Use a pad (not a tampon) to monitor bleeding.',
    ],
    isEmergency: true,
    score: 80,
    tags: ['emergency'],
  },

  // HIGH PRIORITY (non-emergency)
  {
    id: 'dehydration_hypotension',
    priority: 2,
    requiredSymptoms: ['dizziness'],
    matchType: 'ANY',
    condition: 'Possible dehydration or low blood pressure',
    severity: 'HIGH',
    advice: [
      'Lie down on your left side.',
      'Drink water or an electrolyte beverage.',
      'Stand up slowly to avoid fainting.',
    ],
    isEmergency: false,
    minWeek: 1,
    score: 60,
    tags: ['common'],
  },
  {
    id: 'fever_moderate',
    priority: 2,
    requiredSymptoms: ['fever'],
    matchType: 'ANY',
    condition: 'Fever during pregnancy',
    severity: 'HIGH',
    advice: [
      'Rest and stay hydrated.',
      'Take acetaminophen (paracetamol) if approved by your doctor.',
      'Contact your healthcare provider if fever exceeds 38°C or persists.',
    ],
    isEmergency: false,
    score: 55,
    tags: ['common'],
  },

  // COMMON SYMPTOMS (LOW/MEDIUM)
  {
    id: 'morning_sickness',
    priority: 3,
    requiredSymptoms: ['nausea', 'fatigue'],
    matchType: 'ANY',
    condition: 'Morning sickness',
    severity: 'LOW',
    advice: [
      'Eat small, frequent meals.',
      'Avoid strong smells and greasy foods.',
      'Ginger tea or crackers may help.',
    ],
    isEmergency: false,
    minWeek: 4,
    maxWeek: 16,
    score: 30,
    tags: ['trimester1', 'common'],
  },
  {
    id: 'back_pain_strain',
    priority: 3,
    requiredSymptoms: ['back_pain', 'fatigue'],
    matchType: 'ANY',
    condition: 'Muscle strain / Normal pregnancy discomfort',
    severity: 'LOW',
    advice: [
      'Maintain good posture.',
      'Try gentle stretching or prenatal yoga.',
      'Use a pregnancy pillow for sleep.',
    ],
    isEmergency: false,
    score: 25,
    tags: ['common'],
  },
  {
    id: 'headache_mild',
    priority: 3,
    requiredSymptoms: ['headache'],
    excludedSymptoms: ['blurred_vision', 'swelling'],
    matchType: 'ANY',
    condition: 'Tension headache or dehydration',
    severity: 'LOW',
    advice: [
      'Increase water intake.',
      'Rest in a quiet, dark room.',
      'Apply a cool compress to your forehead.',
    ],
    isEmergency: false,
    score: 20,
    tags: ['common'],
  },
  {
    id: 'swelling_normal',
    priority: 3,
    requiredSymptoms: ['swelling'],
    excludedSymptoms: ['headache', 'blurred_vision'],
    matchType: 'ANY',
    condition: 'Normal fluid retention',
    severity: 'LOW',
    advice: [
      'Elevate your legs when sitting.',
      'Reduce salt intake.',
      'Stay well hydrated.',
    ],
    isEmergency: false,
    minWeek: 1,
    score: 15,
    tags: ['common'],
  },
  {
    id: 'nausea_alone',
    priority: 3,
    requiredSymptoms: ['nausea'],
    matchType: 'ANY',
    condition: 'Nausea',
    severity: 'LOW',
    advice: [
      'Eat dry crackers before getting out of bed.',
      'Avoid greasy or spicy foods.',
      'Get fresh air and rest.',
    ],
    isEmergency: false,
    score: 15,
    tags: ['common'],
  },
  {
    id: 'fatigue_normal',
    priority: 3,
    requiredSymptoms: ['fatigue'],
    matchType: 'ANY',
    condition: 'Normal pregnancy fatigue',
    severity: 'LOW',
    advice: [
      'Prioritize rest and take short naps.',
      'Maintain a balanced diet with iron-rich foods.',
      'Light exercise can boost energy.',
    ],
    isEmergency: false,
    score: 15,
    tags: ['common'],
  },
  {
    id: 'back_pain_alone',
    priority: 3,
    requiredSymptoms: ['back_pain'],
    matchType: 'ANY',
    condition: 'Back pain',
    severity: 'LOW',
    advice: [
      'Gentle prenatal yoga or stretching.',
      'Warm bath or heating pad on low.',
      'Avoid heavy lifting.',
    ],
    isEmergency: false,
    score: 15,
    tags: ['common'],
  },
  {
    id: 'frequent_urination',
    priority: 3,
    requiredSymptoms: ['frequent_urination'],
    matchType: 'ANY',
    condition: 'Frequent urination',
    severity: 'LOW',
    advice: [
      'Normal in pregnancy.',
      'Empty your bladder completely.',
      'Limit fluids before bedtime.',
    ],
    isEmergency: false,
    score: 10,
    tags: ['common'],
  },
  {
    id: 'heartburn_normal',
    priority: 3,
    requiredSymptoms: ['heartburn'],
    matchType: 'ANY',
    condition: 'Heartburn',
    severity: 'LOW',
    advice: [
      'Eat smaller, more frequent meals.',
      'Avoid spicy, acidic, or fried foods.',
      'Sit upright for at least an hour after eating.',
    ],
    isEmergency: false,
    score: 10,
    tags: ['common'],
  },
  {
    id: 'constipation_normal',
    priority: 3,
    requiredSymptoms: ['constipation'],
    matchType: 'ANY',
    condition: 'Constipation',
    severity: 'LOW',
    advice: [
      'Increase fiber intake (fruits, vegetables, whole grains).',
      'Drink plenty of water.',
      'Gentle exercise like walking can help.',
    ],
    isEmergency: false,
    score: 10,
    tags: ['common'],
  },
];

// ----------------------------------------------------------------------------
// Evaluation Engine (improved)
// ----------------------------------------------------------------------------
interface MatchResult {
  rule: SymptomRule;
  matchCount: number;
  confidenceScore: number;
}

function evaluateSymptoms(
  selectedIds: Set<string>,
  pregnancyWeek?: number
): MatchResult[] {
  if (selectedIds.size === 0) return [];

  const results: MatchResult[] = [];

  for (const rule of rules) {
    // Week filtering
    if (pregnancyWeek !== undefined) {
      if (rule.minWeek && pregnancyWeek < rule.minWeek) continue;
      if (rule.maxWeek && pregnancyWeek > rule.maxWeek) continue;
    }

    // Exclusion check
    if (rule.excludedSymptoms) {
      const hasExcluded = rule.excludedSymptoms.some(id => selectedIds.has(id));
      if (hasExcluded) continue;
    }

    // Matching logic
    let matchCount = 0;
    const required = rule.requiredSymptoms;

    if (rule.matchType === 'ALL') {
      // All required symptoms must be present
      const allPresent = required.every(id => selectedIds.has(id));
      if (!allPresent) continue;
      matchCount = required.length;
    } else {
      // ANY: count how many required symptoms are present
      matchCount = required.filter(id => selectedIds.has(id)).length;
      if (matchCount === 0) continue;
    }

    // Confidence score: base rule score + bonus for each extra matched symptom
    const baseScore = rule.score ?? 50;
    const extraBonus = (matchCount - 1) * 5;
    const confidenceScore = Math.min(100, baseScore + extraBonus);

    results.push({ rule, matchCount, confidenceScore });
  }

  // Sort by priority (ascending), then confidence (descending)
  results.sort((a, b) => {
    if (a.rule.priority !== b.rule.priority) {
      return a.rule.priority - b.rule.priority;
    }
    return b.confidenceScore - a.confidenceScore;
  });

  return results.slice(0, 3);
}

// ----------------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------------
export default function PregnancySymptomCheckerPage() {
  const [selectedSymptoms, setSelectedSymptoms] = useState<Set<string>>(new Set());
  const [pregnancyWeek, setPregnancyWeek] = useState<string>('20');
  const [results, setResults] = useState<MatchResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const saved = localStorage.getItem('symptom_checker_v2');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.selectedSymptoms) setSelectedSymptoms(new Set(data.selectedSymptoms));
        if (data.pregnancyWeek) setPregnancyWeek(data.pregnancyWeek);
      } catch (e) {
        console.warn('Failed to load saved data');
      }
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem(
        'symptom_checker_v2',
        JSON.stringify({
          selectedSymptoms: Array.from(selectedSymptoms),
          pregnancyWeek,
        })
      );
    }
  }, [selectedSymptoms, pregnancyWeek, isClient]);

  const toggleSymptom = (id: string) => {
    setSelectedSymptoms(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    setError(null);
  };

  const handleCheck = useCallback(() => {
    let week: number | undefined;
    if (pregnancyWeek.trim()) {
      const w = parseInt(pregnancyWeek, 10);
      if (isNaN(w) || w < 1 || w > 40) {
        setError('Pregnancy week must be between 1 and 40.');
        setResults([]);
        return;
      }
      week = w;
    }

    if (selectedSymptoms.size === 0) {
      setError('Please select at least one symptom.');
      setResults([]);
      return;
    }

    setError(null);
    const matches = evaluateSymptoms(selectedSymptoms, week);
    setResults(matches);
  }, [selectedSymptoms, pregnancyWeek]);

  const handleEmergencyCall = () => {
    window.location.href = 'tel:112';
  };

  return (
    <main className={`min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 ${poppins.variable} ${playfair.variable}`}>
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-pink-200/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header (unchanged) */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10 md:mb-14 text-center md:text-left"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100/60 text-rose-700 text-sm font-medium mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
            Free & Private • Evidence-Based
          </div>
          <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4 leading-tight ${playfair.className}`}>
            Pregnancy Symptom{' '}
            <span className="bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent">
              Checker
            </span>
          </h1>
          <p className={`text-lg md:text-xl text-gray-600 max-w-3xl mx-auto md:mx-0 ${poppins.className}`}>
            Select your symptoms for instant, reliable guidance. Know when to seek medical attention.
          </p>
        </motion.header>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Left: Symptoms (unchanged, but using allSymptoms) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 md:p-8"
          >
            <h2 className={`text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2 ${playfair.className}`}>
              <span className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">📋</span>
              Select Your Symptoms
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 max-h-[400px] overflow-y-auto pr-2">
              {allSymptoms.map(symptom => (
                <SymptomCheckbox
                  key={symptom.id}
                  id={symptom.id}
                  label={symptom.name}
                  checked={selectedSymptoms.has(symptom.id)}
                  onChange={() => toggleSymptom(symptom.id)}
                />
              ))}
            </div>

            <div className="mb-6">
              <label className={`block text-sm font-semibold text-gray-700 mb-2 ${poppins.className}`}>
                📅 Pregnancy week (optional)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="40"
                  value={pregnancyWeek}
                  onChange={e => { setPregnancyWeek(e.target.value); setError(null); }}
                  placeholder="1–40"
                  className={`w-full px-5 py-3 pr-14 rounded-xl border-2 border-gray-200 bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-all ${poppins.className}`}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">week</span>
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm"
                >
                  ⚠️ {error}
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={handleCheck}
              className={`w-full py-4 bg-gradient-to-r from-rose-600 to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 ${poppins.className}`}
            >
              🔍 Check Symptoms
            </button>
          </motion.div>

          {/* Right: Results (updated to show confidence) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 md:p-8"
          >
            <h2 className={`text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2 ${playfair.className}`}>
              <span className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">📊</span>
              Your Results
            </h2>

            <AnimatePresence mode="wait">
              {results.length === 0 ? (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-16 text-gray-500">
                  <div className="text-7xl mb-4 opacity-50">🔍</div>
                  <p className={`text-lg ${poppins.className}`}>
                    {selectedSymptoms.size === 0
                      ? 'Select symptoms and tap "Check Symptoms".'
                      : 'No matching conditions found.'}
                  </p>
                </motion.div>
              ) : (
                <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                  {results.map((match, index) => (
                    <ResultCard
                      key={match.rule.id}
                      rule={match.rule}
                      confidence={match.confidenceScore}
                      onEmergencyCall={handleEmergencyCall}
                      isFirst={index === 0}
                    />
                  ))}
                  {pregnancyWeek && (
                    <p className={`text-sm text-gray-500 mt-4 text-center ${poppins.className}`}>
                      Based on pregnancy week: {pregnancyWeek}
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-8 p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200 text-center">
          <p className={`text-sm text-gray-600 italic ${poppins.className}`}>
            ⚠️ This tool provides informational guidance only and does not replace professional medical advice.
          </p>
        </motion.div>
      </div>
    </main>
  );
}

// ----------------------------------------------------------------------------
// Sub-components (updated for array advice)
// ----------------------------------------------------------------------------
function SymptomCheckbox({ id, label, checked, onChange }: { id: string; label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ${checked ? 'bg-rose-50 border-rose-300 shadow-sm' : 'bg-white/50 border-gray-200 hover:border-rose-200'}`}>
      <input type="checkbox" checked={checked} onChange={onChange} className="w-5 h-5 accent-rose-500 rounded" />
      <span className={`text-gray-700 ${poppins.className}`}>{label}</span>
    </label>
  );
}

function ResultCard({ rule, confidence, onEmergencyCall, isFirst }: { rule: SymptomRule; confidence: number; onEmergencyCall: () => void; isFirst: boolean }) {
  const severityColor =
    rule.severity === 'CRITICAL' ? 'text-red-700 bg-red-50 border-red-200' :
    rule.severity === 'HIGH' ? 'text-amber-700 bg-amber-50 border-amber-200' :
    rule.severity === 'MEDIUM' ? 'text-yellow-700 bg-yellow-50 border-yellow-200' :
    'text-green-700 bg-green-50 border-green-200';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: isFirst ? 0 : 0.1 }}
      className={`p-5 rounded-2xl border ${rule.isEmergency ? 'bg-red-50/90 border-red-300 shadow-lg shadow-red-100' : 'bg-white/60 border-gray-100'}`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {rule.isEmergency && <span className="text-xl">🚨</span>}
          <h3 className={`text-xl font-bold text-gray-800 ${playfair.className}`}>{rule.condition}</h3>
        </div>
        <span className="text-xs bg-white/80 px-2 py-1 rounded-full text-gray-600">
          {Math.round(confidence)}% match
        </span>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <span className={`text-sm px-3 py-1 rounded-full ${severityColor}`}>
          Severity: {rule.severity}
        </span>
      </div>

      <div className="mb-4 p-4 bg-white/80 rounded-xl">
        <p className={`text-sm font-medium text-gray-600 mb-1 ${poppins.className}`}>Advice:</p>
        <ul className="list-disc list-inside space-y-1">
          {rule.advice.map((item, i) => (
            <li key={i} className={`text-gray-800 ${poppins.className}`}>{item}</li>
          ))}
        </ul>
      </div>

      {rule.isEmergency && (
        <button
          onClick={onEmergencyCall}
          className={`w-full py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 ${poppins.className}`}
        >
          <span>📞</span> Contact Emergency Services
        </button>
      )}
    </motion.div>
  );
}