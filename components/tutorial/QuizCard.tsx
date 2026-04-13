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
      <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 rounded-t-xl flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white text-xs font-bold px-3 py-1 rounded-full">
            Q{index + 1}
          </div>
          <span className="text-xs text-gray-400">of {total}</span>
        </div>
        {submitted && (
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
              isCorrect === true
                ? 'bg-green-50 text-green-600 border border-green-200'
                : isCorrect === false
                ? 'bg-red-50 text-red-500 border border-red-200'
                : 'bg-gray-100 text-gray-500 border border-gray-200'
            }`}
          >
            <span className="material-icons text-sm">
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
                ? 'Wrong'
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