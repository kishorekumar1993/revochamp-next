'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TestSession } from '@/lib/testService';

interface Props {
  session: TestSession;
  onFinish: (answers: Record<string, { selected: number; isCorrect: boolean; usedHint: boolean }>, hintsUsed: Set<string>, timeTaken: number) => void;
  onBack: () => void;
}

export default function QuizScreen({ session, onFinish, onBack }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, { selected: number; isCorrect: boolean; usedHint: boolean }>>({});
  const [hintsUsed, setHintsUsed] = useState<Set<string>>(new Set());
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(session.timeLimitMinutes * 60);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const startTimeRef = useRef<number>(Date.now());

  const question = session.questions[currentIndex];
  const hasAnswer = answers[question.id] !== undefined;
  const isLast = currentIndex === session.questions.length - 1;
  const allAnswered = Object.keys(answers).length === session.questions.length;

  // Timer with visual warning
  useEffect(() => {
    if (isTimeUp) return;
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsTimeUp(true);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isTimeUp]);

  // Restore answer state when changing questions
  useEffect(() => {
    const existing = answers[question.id];
    if (existing) {
      setSelectedOption(existing.selected);
      setShowExplanation(true);
      setShowHint(existing.usedHint);
    } else {
      setSelectedOption(null);
      setShowExplanation(false);
      setShowHint(false);
    }
  }, [currentIndex, question.id, answers]);

  const handleSelectOption = (index: number) => {
    if (showExplanation || hasAnswer || isTimeUp) return;
    const isCorrect = index === question.correctAnswerIndex;
    setSelectedOption(index);
    setAnswers(prev => ({
      ...prev,
      [question.id]: { selected: index, isCorrect, usedHint: showHint },
    }));
    if (showHint) {
      setHintsUsed(prev => new Set(prev).add(question.id));
    }
    setShowExplanation(true);
  };

  const handleRevealHint = () => setShowHint(true);

  const handleNext = () => {
    if (isLast) {
      if (allAnswered || isTimeUp) handleSubmit();
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    const timeTaken = Math.floor((Date.now() - startTimeRef.current) / 1000);
    onFinish(answers, hintsUsed, timeTaken);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((currentIndex + 1) / session.questions.length) * 100;
  const answeredCount = Object.keys(answers).length;
  const correctCount = Object.values(answers).filter(a => a.isCorrect).length;
  const isWarningTime = timeRemaining < 300; // 5 minutes

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      {/* Enhanced Header */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-3 sm:px-6 py-2 sm:py-3">
          {/* Top Row */}
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="group p-1.5 sm:p-2 hover:bg-gray-100 rounded-xl transition-colors"
              aria-label="Back"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 truncate max-w-[150px] sm:max-w-[200px] md:max-w-md">
              {session.title}
            </h1>
            <div className={`flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-mono font-bold shadow-sm transition-colors ${
              isWarningTime 
                ? 'bg-red-100 text-red-700 animate-pulse' 
                : 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700'
            }`}>
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{formatTime(timeRemaining)}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-2 sm:mt-3 flex items-center gap-2 sm:gap-3">
            <div className="flex-1 h-1.5 sm:h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <span className="text-xs font-medium text-gray-500">
              {currentIndex + 1}/{session.questions.length}
            </span>
          </div>

          {/* Stats Row */}
          <div className="flex items-center justify-between mt-1.5 sm:mt-2 text-[10px] sm:text-xs">
            <div className="flex items-center gap-2 sm:gap-4">
              <span className="flex items-center gap-1 text-gray-600">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full"></span>
                {answeredCount} <span className="hidden sm:inline">answered</span>
              </span>
              <span className="flex items-center gap-1 text-gray-600">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-indigo-500 rounded-full"></span>
                {correctCount} <span className="hidden sm:inline">correct</span>
              </span>
            </div>
            <span className="text-gray-400">
              {session.questions.length - answeredCount} left
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-6 md:py-8 w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Question Card */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-gray-100 overflow-hidden mb-4 sm:mb-6">
              {/* Card Header */}
              <div className="px-3 sm:px-5 py-2.5 sm:py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                  <span className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wide ${getDifficultyGradient(question.difficulty)}`}>
                    {question.difficulty}
                  </span>
                  <span className="text-[10px] sm:text-xs text-gray-500 bg-gray-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                    {question.topic}
                  </span>
                </div>
                <span className="flex items-center gap-0.5 sm:gap-1 text-amber-600 text-xs sm:text-sm font-semibold bg-amber-50 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
                  <span>⭐</span>
                  <span>{question.points} pts</span>
                </span>
              </div>

              {/* Question Text */}
              <div className="p-4 sm:p-6 md:p-8">
                <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-800 leading-relaxed">
                  {question.text}
                </h2>
              </div>
            </div>

            {/* Options */}
            <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
              {question.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === question.correctAnswerIndex;
                const letter = String.fromCharCode(65 + idx);
                
                let optionStyle = 'bg-white border-gray-200 hover:border-indigo-300 hover:shadow-md';
                if (showExplanation && hasAnswer) {
                  if (isCorrect) {
                    optionStyle = 'bg-green-50 border-green-400 shadow-sm';
                  } else if (isSelected && !isCorrect) {
                    optionStyle = 'bg-red-50 border-red-400 shadow-sm';
                  } else {
                    optionStyle = 'bg-white border-gray-200 opacity-60';
                  }
                } else if (isSelected) {
                  optionStyle = 'bg-indigo-50 border-indigo-400 shadow-md';
                }

                return (
                  <motion.button
                    key={idx}
                    whileHover={!showExplanation && !hasAnswer && !isTimeUp ? { scale: 1.01 } : {}}
                    whileTap={!showExplanation && !hasAnswer && !isTimeUp ? { scale: 0.99 } : {}}
                    disabled={showExplanation || hasAnswer || isTimeUp}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-left p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl border-2 transition-all ${optionStyle} ${
                      !showExplanation && !hasAnswer && !isTimeUp ? 'cursor-pointer' : 'cursor-default'
                    }`}
                  >
                    <div className="flex items-start gap-2 sm:gap-3 md:gap-4">
                      <span className={`flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-md sm:rounded-lg flex items-center justify-center font-bold text-xs sm:text-sm md:text-base transition-colors ${
                        isSelected || (showExplanation && isCorrect)
                          ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {letter}
                      </span>
                      <span className="flex-1 text-gray-700 text-xs sm:text-sm md:text-base leading-relaxed pt-0.5 sm:pt-1">
                        {opt}
                      </span>
                      {showExplanation && hasAnswer && (
                        <span className="flex-shrink-0">
                          {isCorrect ? (
                            <span className="text-green-600 text-base sm:text-xl">✓</span>
                          ) : (isSelected && (
                            <span className="text-red-600 text-base sm:text-xl">✗</span>
                          ))}
                        </span>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Hint Section */}
            <AnimatePresence>
              {question.hints.length > 0 && !showExplanation && !hasAnswer && !isTimeUp && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4"
                >
                  <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-lg sm:rounded-xl overflow-hidden">
                    {!showHint ? (
                      <div className="p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <span className="text-xl sm:text-2xl">💡</span>
                          <div>
                            <p className="font-semibold text-amber-800 text-sm">Stuck? Get a hint</p>
                            <p className="text-[10px] sm:text-xs text-amber-600">Using a hint won't affect your score</p>
                          </div>
                        </div>
                        <button
                          onClick={handleRevealHint}
                          className="w-full sm:w-auto px-4 py-1.5 sm:py-2 bg-amber-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-amber-700 transition-colors shadow-sm"
                        >
                          Reveal Hint
                        </button>
                      </div>
                    ) : (
                      <div className="p-3 sm:p-4">
                        <div className="flex items-start gap-2 sm:gap-3">
                          <span className="text-xl sm:text-2xl">💡</span>
                          <p className="text-amber-800 text-xs sm:text-sm md:text-base leading-relaxed">
                            {question.hints[0]}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Explanation Section */}
            <AnimatePresence>
              {showExplanation && hasAnswer && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-4 sm:mb-6"
                >
                  <div className={`rounded-lg sm:rounded-xl overflow-hidden border-2 ${
                    answers[question.id].isCorrect 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  }`}>
                    <div className={`px-3 sm:px-5 py-2 sm:py-3 border-b ${
                      answers[question.id].isCorrect 
                        ? 'bg-green-100 border-green-200' 
                        : 'bg-red-100 border-red-200'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <span className="text-lg sm:text-xl">
                            {answers[question.id].isCorrect ? '🎉' : '📝'}
                          </span>
                          <span className={`font-bold text-sm sm:text-base ${
                            answers[question.id].isCorrect ? 'text-green-800' : 'text-red-800'
                          }`}>
                            {answers[question.id].isCorrect ? 'Correct!' : 'Incorrect'}
                          </span>
                        </div>
                        {answers[question.id].isCorrect && (
                          <span className="bg-green-600 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-bold shadow-sm">
                            +{question.points} pts
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="p-3 sm:p-5">
                      {!answers[question.id].isCorrect && (
                        <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-white rounded-lg border border-gray-200">
                          <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-1">Your Answer:</p>
                          <p className="text-gray-600 text-xs sm:text-sm">
                            {String.fromCharCode(65 + selectedOption!)}. {question.options[selectedOption!]}
                          </p>
                        </div>
                      )}
                      <div className="p-2 sm:p-3 bg-white rounded-lg border border-gray-200">
                        <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-1">Correct Answer:</p>
                        <p className="text-gray-800 font-medium text-xs sm:text-sm">
                          {String.fromCharCode(65 + question.correctAnswerIndex)}. {question.options[question.correctAnswerIndex]}
                        </p>
                      </div>
                      <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                        <p className="text-xs sm:text-sm font-semibold text-indigo-800 mb-1 sm:mb-2">💡 Explanation:</p>
                        <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">
                          {question.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex gap-2 sm:gap-3 mt-3 sm:mt-4">
              <button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="px-3 sm:px-5 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl font-medium text-xs sm:text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1 sm:gap-2"
              >
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Prev
              </button>
              <button
                onClick={handleNext}
                disabled={!showExplanation && !hasAnswer && !isTimeUp}
                className={`flex-1 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-white text-xs sm:text-sm transition-all flex items-center justify-center gap-1 sm:gap-2 ${
                  !showExplanation && !hasAnswer && !isTimeUp
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg'
                }`}
              >
                {isLast ? (
                  isSubmitting ? (
                    <>
                      <svg className="animate-spin h-3 w-3 sm:h-4 sm:w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="hidden sm:inline">Submitting...</span>
                      <span className="sm:hidden">...</span>
                    </>
                  ) : (
                    <>
                      {allAnswered || isTimeUp ? 'Submit' : 'Answer All'}
                      <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </>
                  )
                ) : (
                  <>
                    Next
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>
            </div>

            {/* Warning for incomplete submission */}
            {isLast && !allAnswered && !isTimeUp && showExplanation && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-amber-600 text-[10px] sm:text-xs text-center mt-2 sm:mt-3 bg-amber-50 py-1.5 sm:py-2 px-3 sm:px-4 rounded-lg"
              >
                ⚠️ Please answer all questions before submitting
              </motion.p>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

function getDifficultyGradient(difficulty: string): string {
  switch (difficulty.toLowerCase()) {
    case 'beginner':
      return 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200';
    case 'intermediate':
      return 'bg-gradient-to-r from-orange-100 to-amber-100 text-orange-800 border border-orange-200';
    case 'advanced':
      return 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border border-gray-200';
  }
}