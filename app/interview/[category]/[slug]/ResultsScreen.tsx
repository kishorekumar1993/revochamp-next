'use client';

import { useState } from 'react';
import { TestSession } from '@/lib/testService';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  session: TestSession;
  userAnswers: Record<string, { selected: number; isCorrect: boolean; usedHint: boolean }>;
  hintsUsed: number;
  timeTaken: number;
  onRetake: () => void;
  onExit: () => void;
}

export default function ResultsScreen({ session, userAnswers, hintsUsed, timeTaken, onRetake, onExit }: Props) {
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

  const answered = Object.keys(userAnswers).length;
  const correct = Object.values(userAnswers).filter(a => a.isCorrect).length;
  const incorrect = answered - correct;
  const earnedPoints = Object.entries(userAnswers).reduce((sum, [qId, ans]) => {
    if (ans.isCorrect) {
      const q = session.questions.find(q => q.id === qId);
      return sum + (q?.points || 0);
    }
    return sum;
  }, 0);
  const percentage = (earnedPoints / session.totalPoints) * 100;
  const passed = percentage >= session.passingScore;
  const accuracy = answered > 0 ? (correct / answered) * 100 : 0;
  const attemptRate = (answered / session.questions.length) * 100;

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return mins > 0 ? `${mins} min ${secs}s` : `${secs}s`;
  };

  // Circular progress parameters
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 md:py-10">
        {/* Score Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`relative overflow-hidden rounded-3xl p-6 md:p-8 shadow-2xl ${
            passed
              ? 'bg-gradient-to-br from-emerald-500 to-teal-600'
              : 'bg-gradient-to-br from-amber-500 to-orange-600'
          }`}
        >
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-white" />
            <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-white" />
          </div>

          <div className="relative flex flex-col md:flex-row items-center gap-6 md:gap-10">
            {/* Circular Progress */}
            <div className="relative w-44 h-44">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="88"
                  cy="88"
                  r={radius}
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="8"
                  fill="none"
                />
                <motion.circle
                  cx="88"
                  cy="88"
                  r={radius}
                  stroke="white"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: progressOffset }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  style={{ strokeDasharray: circumference }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl md:text-5xl font-black text-white">
                  {percentage.toFixed(0)}%
                </span>
                <span className="text-white/80 text-sm font-medium">Score</span>
              </div>
            </div>

            {/* Score Details */}
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full mb-4">
                <span className="text-2xl">{passed ? '🏆' : '📚'}</span>
                <span className="text-white font-bold tracking-wide">
                  {passed ? 'PASSED' : 'NEEDS IMPROVEMENT'}
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                {session.title}
              </h2>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start text-white/90">
                <div className="flex items-center gap-1">
                  <span>⭐</span>
                  <span>{earnedPoints} / {session.totalPoints} points</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>⏱️</span>
                  <span>{formatTime(timeTaken)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>🎯</span>
                  <span>Passing: {session.passingScore}%</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Statistics Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 my-6"
        >
          <StatCard
            icon="📋"
            label="Questions"
            value={session.questions.length}
            color="blue"
          />
          <StatCard
            icon="✅"
            label="Answered"
            value={answered}
            color="teal"
          />
          <StatCard
            icon="🎉"
            label="Correct"
            value={correct}
            color="green"
          />
          <StatCard
            icon="❌"
            label="Incorrect"
            value={incorrect}
            color="red"
          />
          <StatCard
            icon="🎯"
            label="Accuracy"
            value={`${accuracy.toFixed(0)}%`}
            color="orange"
          />
          <StatCard
            icon="📊"
            label="Attempt Rate"
            value={`${attemptRate.toFixed(0)}%`}
            color="purple"
          />
          <StatCard
            icon="💡"
            label="Hints Used"
            value={hintsUsed}
            color="amber"
          />
          <StatCard
            icon="🏁"
            label="Passing"
            value={`${session.passingScore}%`}
            color="gray"
          />
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-3 mb-8"
        >
          <button
            onClick={onRetake}
            className="flex-1 py-3.5 px-6 bg-white border-2 border-indigo-600 text-indigo-600 font-semibold rounded-xl hover:bg-indigo-50 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            🔄 Retake Test
          </button>
          <button
            onClick={onExit}
            className="flex-1 py-3.5 px-6 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 shadow-lg shadow-indigo-200 hover:shadow-xl"
          >
            ✅ Exit & Continue Learning
          </button>
        </motion.div>

        {/* Detailed Review */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <span>📝</span> Detailed Question Review
            </h3>
          </div>
          <div className="divide-y divide-gray-100">
            {session.questions.map((q, idx) => {
              const ans = userAnswers[q.id];
              const isAnswered = !!ans;
              const isCorrect = ans?.isCorrect;
              const isExpanded = expandedQuestion === q.id;

              return (
                <div key={q.id} className="group">
                  <button
                    onClick={() => setExpandedQuestion(isExpanded ? null : q.id)}
                    className="w-full px-5 py-4 flex items-center gap-3 text-left hover:bg-gray-50 transition-colors"
                  >
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm ${
                        isAnswered
                          ? isCorrect
                            ? 'bg-green-500'
                            : 'bg-red-500'
                          : 'bg-gray-400'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <span className="flex-1 font-medium text-gray-700 line-clamp-1">
                      {q.text}
                    </span>
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          isAnswered
                            ? isCorrect
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {isAnswered ? (isCorrect ? '✓ Correct' : '✗ Incorrect') : 'Not answered'}
                      </span>
                      <svg
                        className={`w-5 h-5 text-gray-400 transition-transform ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 pl-15 space-y-3">
                          {isAnswered && !isCorrect && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                              <p className="text-sm font-semibold text-red-700 mb-1">
                                Your Answer:
                              </p>
                              <p className="text-sm text-gray-700">
                                {String.fromCharCode(65 + ans.selected)}. {q.options[ans.selected]}
                              </p>
                            </div>
                          )}
                          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                            <p className="text-sm font-semibold text-green-700 mb-1">
                              Correct Answer:
                            </p>
                            <p className="text-sm text-gray-700">
                              {String.fromCharCode(65 + q.correctAnswerIndex)}. {q.options[q.correctAnswerIndex]}
                            </p>
                          </div>
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <p className="text-sm font-semibold text-blue-700 mb-1">
                              Explanation:
                            </p>
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {q.explanation}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500 pt-1">
                            <span className="px-2 py-1 bg-gray-100 rounded-full">
                              {q.difficulty}
                            </span>
                            <span className="px-2 py-1 bg-gray-100 rounded-full">
                              {q.points} points
                            </span>
                            <span className="px-2 py-1 bg-gray-100 rounded-full">
                              {q.topic}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: string;
  label: string;
  value: string | number;
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    teal: 'bg-teal-50 text-teal-700 border-teal-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    red: 'bg-red-50 text-red-700 border-red-200',
    orange: 'bg-orange-50 text-orange-700 border-orange-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    gray: 'bg-gray-50 text-gray-700 border-gray-200',
  };

  return (
    <div className={`rounded-xl p-4 border ${colorClasses[color]} transition-all duration-200 hover:shadow-md`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">{icon}</span>
        <span className="text-xs font-medium uppercase tracking-wide opacity-75">
          {label}
        </span>
      </div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}