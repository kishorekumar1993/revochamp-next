'use client';

import { QuizQuestion, QuizQuestionState } from '@/lib/types';
import QuizOptionItem from './QuizOptionItem';
import { memo } from 'react';

interface QuizCardProps {
  index: number;
  total: number;
  question: QuizQuestion;
  state: QuizQuestionState;
  submitted: boolean;
  onAnswerSelected: (answerIndex: number) => void;
}

function QuizCard({
  index,
  total,
  question,
  state,
  submitted,
  onAnswerSelected,
}: QuizCardProps) {
  // ✅ Fix #1: Don't default to false – let undefined represent "not answered"
  // Use `isCorrect === true` and `isCorrect === false` explicitly
  const isCorrect = state.isCorrect;

  // ✅ Fix #2: Clean border logic
  let borderColor = 'border-gray-200';
  if (submitted) {
    if (isCorrect === true) borderColor = 'border-green-200';
    else if (isCorrect === false) borderColor = 'border-red-200';
  }

  // ✅ Fix #8: Null safety for question and options
  if (!state || !question || !question.options) return null;

  return (
    <div
      className={`bg-white rounded-xl border ${borderColor} shadow-sm hover:shadow-md transition-shadow mb-4`}
    >
      {/* Header */}
<div
  className="
    px-4 sm:px-5 py-3 sm:py-3.5
    bg-gray-50 dark:bg-gray-800/50
    border-b border-gray-100 dark:border-gray-700
    rounded-t-xl
    flex items-center justify-between
  "
>
  <div className="flex items-center gap-2 sm:gap-3">
    <div
      className="
        bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-blue-500 dark:to-indigo-600
        text-xs sm:text-sm font-semibold tracking-wide
        px-3 py-1.5
        rounded-full
        shadow-sm
      "
    >
      Q{index + 1}
    </div>
    <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">
      of {total}
    </span>
  </div>

  {submitted && (
    <div
      className={`
        flex items-center gap-1.5
        px-2.5 sm:px-3 py-1 sm:py-1.5
        rounded-full
        text-xs sm:text-sm font-medium
        transition-colors duration-200
        ${
          isCorrect === true
            ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800'
            : isCorrect === false
            ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 border border-red-200 dark:border-red-800'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
        }
      `}
    >
      <span className="material-icons text-sm sm:text-base">
        {isCorrect === true
          ? 'check_circle'
          : isCorrect === false
          ? 'cancel'
          : 'help'}
      </span>
      <span>
        {isCorrect === true
          ? 'Correct'
          : isCorrect === false
          ? 'Incorrect'
          : 'Not answered'}
      </span>
    </div>
  )}
</div>
      {/* Question */}
      <div className="px-5 pt-4 pb-2">
        <p className="text-gray-800 font-semibold text-base leading-relaxed">
          {question.question}
        </p>
      </div>

      {/* Options */}
      <div className="px-4 pb-3 space-y-2">
        {question.options.map((opt, idx) => (
          <QuizOptionItem
            // ✅ Fix #3: Stable key that survives option reordering
            key={`${index}-${idx}`}
            index={idx}
            text={opt}
            isSelected={state.selectedAnswer === idx}
            isCorrect={submitted && idx === question.answer}
            isWrong={submitted && state.selectedAnswer === idx && idx !== question.answer}
            submitted={submitted}
            onTap={submitted ? undefined : () => onAnswerSelected(idx)}
          />
        ))}
      </div>

      {/* ✅ Fix #5: Show explanation for both correct and wrong answers */}
      {submitted && question.explanation && (
        <div
          className={`mx-4 mb-4 p-3 rounded-lg flex gap-3 ${
            isCorrect === true
              ? 'bg-green-50 border border-green-100'
              : 'bg-blue-50 border border-blue-100'
          }`}
        >
          <div
            className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center ${
              isCorrect === true ? 'bg-green-600' : 'bg-blue-600'
            }`}
          >
            <span className="material-icons text-white text-sm">
              {isCorrect === true ? 'check_circle' : 'lightbulb'}
            </span>
          </div>
          <p className="text-sm text-gray-600">{question.explanation}</p>
        </div>
      )}
    </div>
  );
}

// ✅ Fix #10: Memoize to prevent unnecessary re-renders
export default memo(QuizCard);