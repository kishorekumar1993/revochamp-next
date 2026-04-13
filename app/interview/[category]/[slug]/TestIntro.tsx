'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { TestSession } from '@/lib/testService';

interface Props {
  session: TestSession;
  category: string;
  onStart: () => void;
}

export default function TestIntro({ session, category, onStart }: Props) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-600 to-purple-700 text-white pb-6 sm:pb-8 md:pb-12 rounded-b-[2rem] sm:rounded-b-[2.5rem] shadow-2xl">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-20 -right-20 w-60 h-60 sm:w-80 sm:h-80 rounded-full bg-white blur-3xl animate-pulse" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 sm:w-80 sm:h-80 rounded-full bg-white blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6 md:pt-8">
          {/* Navigation Bar */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center justify-between"
          >
            <Link
              href="/tech/mock-interview"
              className="group p-2 sm:p-2.5 bg-white/15 backdrop-blur-sm rounded-xl hover:bg-white/25 transition-all duration-200"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:-translate-x-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <span className="px-3 sm:px-5 py-1.5 sm:py-2 bg-white/15 backdrop-blur-sm rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider">
              {category}
            </span>
          </motion.div>

          {/* Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col items-center mt-6 sm:mt-8 md:mt-10"
          >
            <div className="relative mb-4 sm:mb-6">
              <div className="absolute inset-0 bg-white/20 rounded-full blur-xl animate-pulse" />
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 bg-white/15 backdrop-blur-sm rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-2xl">
                <span className="text-4xl sm:text-5xl md:text-6xl">📋</span>
              </div>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-center max-w-3xl leading-tight px-2">
              {session.title}
            </h1>
            <p className="text-white/85 text-xs sm:text-sm md:text-base mt-3 sm:mt-4 text-center max-w-2xl leading-relaxed px-4">
              {session.description}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mt-4 sm:mt-5">
              <span className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 bg-white/15 backdrop-blur-sm rounded-full text-xs sm:text-sm">
                <span>⏱️</span>
                <span>{session.timeLimitMinutes} mins</span>
              </span>
              <span className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 bg-white/15 backdrop-blur-sm rounded-full text-xs sm:text-sm">
                <span>📝</span>
                <span>{session.questions.length} questions</span>
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-12"
      >
        {/* Key Stats */}
        <motion.div variants={itemVariants} className="grid grid-cols-3 gap-2 sm:gap-4 mb-6 sm:mb-8">
          <StatCard
            icon="📝"
            value={session.questions.length}
            label="Questions"
            gradient="from-blue-500 to-cyan-500"
          />
          <StatCard
            icon="⏱️"
            value={session.timeLimitMinutes}
            label="Minutes"
            gradient="from-purple-500 to-pink-500"
          />
          <StatCard
            icon="⭐"
            value={session.totalPoints}
            label="Points"
            gradient="from-amber-500 to-orange-500"
          />
        </motion.div>

        {/* Passing Score Card */}
        <motion.div
          variants={itemVariants}
          className="relative overflow-hidden bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 mb-6 sm:mb-8 border border-indigo-100 shadow-sm"
        >
          <div className="absolute top-0 right-0 w-16 h-16 sm:w-24 sm:h-24 bg-indigo-100 rounded-full blur-2xl opacity-50" />
          <div className="relative flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-xl sm:text-2xl">🏆</span>
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-indigo-600 uppercase tracking-wide">
                Passing Score
              </p>
              <p className="text-xl sm:text-2xl font-bold text-gray-800">
                {session.passingScore}%
              </p>
            </div>
          </div>
        </motion.div>

        {/* Difficulty Distribution */}
        <motion.div variants={itemVariants} className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <h3 className="text-base sm:text-lg font-bold text-gray-800">Difficulty</h3>
            <span className="text-[10px] sm:text-xs font-medium text-gray-500 bg-gray-100 px-2 sm:px-3 py-1 rounded-full">
              {session.beginnerCount + session.intermediateCount + session.advancedCount} Qs
            </span>
          </div>
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100">
            <div className="flex h-2 sm:h-3 rounded-full overflow-hidden shadow-inner">
              <div
                className="bg-gradient-to-r from-green-400 to-green-500 transition-all duration-500"
                style={{ width: `${(session.beginnerCount / session.questions.length) * 100}%` }}
              />
              <div
                className="bg-gradient-to-r from-orange-400 to-orange-500 transition-all duration-500"
                style={{ width: `${(session.intermediateCount / session.questions.length) * 100}%` }}
              />
              <div
                className="bg-gradient-to-r from-red-400 to-red-500 transition-all duration-500"
                style={{ width: `${(session.advancedCount / session.questions.length) * 100}%` }}
              />
            </div>
            <div className="flex justify-around mt-3 sm:mt-4 text-xs sm:text-sm">
              <DifficultyLegend
                color="bg-green-500"
                label="Beginner"
                count={session.beginnerCount}
              />
              <DifficultyLegend
                color="bg-orange-500"
                label="Intermediate"
                count={session.intermediateCount}
              />
              <DifficultyLegend
                color="bg-red-500"
                label="Advanced"
                count={session.advancedCount}
              />
            </div>
          </div>
        </motion.div>

        {/* Topics */}
        <motion.div variants={itemVariants} className="mb-6 sm:mb-8">
          <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2 sm:mb-3">Topics Covered</h3>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {session.topics.map((topic) => (
              <span
                key={topic}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white border border-gray-200 text-gray-700 text-xs sm:text-sm rounded-full font-medium shadow-sm hover:shadow-md hover:border-indigo-300 hover:bg-indigo-50/50 transition-all duration-200"
              >
                {topic}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Features */}
        <motion.div variants={itemVariants} className="mb-8 sm:mb-10">
          <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2 sm:mb-3">What You'll Get</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            <FeatureItem icon="⏰" text="Timed Challenge – Simulate real interview pressure" />
            <FeatureItem icon="🔄" text="Free Navigation – Move between questions freely" />
            <FeatureItem icon="💡" text="Smart Hints – Get unstuck with contextual hints" />
            <FeatureItem icon="📖" text="Detailed Explanations – Learn from every answer" />
          </div>
        </motion.div>

        {/* Start Button */}
        <motion.div variants={itemVariants}>
          <button
            onClick={onStart}
            className="group relative w-full overflow-hidden bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white font-bold py-4 sm:py-5 px-4 sm:px-6 rounded-xl sm:rounded-2xl shadow-xl shadow-indigo-200 hover:shadow-2xl hover:shadow-indigo-300 transition-all duration-300"
          >
            <span className="relative z-10 flex items-center justify-center gap-2 text-base sm:text-lg">
              <span>Start Test Now</span>
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
          <p className="text-center text-[10px] sm:text-xs text-gray-500 mt-3 sm:mt-4">
            You can pause and resume anytime. No time limit on explanations.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

// ========== Subcomponents ==========

interface StatCardProps {
  icon: string;
  value: string | number;
  label: string;
  gradient: string;
}

function StatCard({ icon, value, label, gradient }: StatCardProps) {
  return (
    <div className="group relative bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-md border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 sm:hover:-translate-y-1">
      <div className={`absolute top-0 left-0 w-full h-0.5 sm:h-1 bg-gradient-to-r ${gradient}`} />
      <div className="flex items-center gap-2 sm:gap-4">
        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-md`}>
          <span className="text-lg sm:text-2xl">{icon}</span>
        </div>
        <div>
          <div className="text-lg sm:text-2xl font-bold text-gray-800">{value}</div>
          <div className="text-[10px] sm:text-sm font-medium text-gray-500">{label}</div>
        </div>
      </div>
    </div>
  );
}

interface DifficultyLegendProps {
  color: string;
  label: string;
  count: number;
}

function DifficultyLegend({ color, label, count }: DifficultyLegendProps) {
  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${color} shadow-sm`} />
      <span className="text-xs sm:text-sm font-medium text-gray-700">{label}</span>
      <span className="text-[10px] sm:text-xs text-gray-500">({count})</span>
    </div>
  );
}

interface FeatureItemProps {
  icon: string;
  text: string;
}

function FeatureItem({ icon, text }: FeatureItemProps) {
  return (
    <div className="flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3 bg-white rounded-lg sm:rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <span className="text-base sm:text-xl">{icon}</span>
      <span className="text-xs sm:text-sm text-gray-700 leading-relaxed">{text}</span>
    </div>
  );
}