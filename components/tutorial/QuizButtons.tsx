'use client';

import { useState } from 'react';

interface QuizButtonsProps {
  onSubmit: () => void;
  onReset: () => void;
}

export default function QuizButtons({ onSubmit, onReset }: QuizButtonsProps) {
  const [hoverSubmit, setHoverSubmit] = useState(false);
  const [hoverReset, setHoverReset] = useState(false);

  return (
    <div className="flex gap-3 mt-4">
      <button
        onClick={onSubmit}
        onMouseEnter={() => setHoverSubmit(true)}
        onMouseLeave={() => setHoverSubmit(false)}
        className="flex-1 py-3 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200"
        style={{
          background: hoverSubmit
            ? 'linear-gradient(135deg, #60A5FA, #3B82F6)'
            : 'linear-gradient(135deg, #3B82F6, #1e40af)',
          boxShadow: hoverSubmit ? '0 4px 12px rgba(59,130,246,0.3)' : 'none',
        }}
      >
        <span className="material-icons text-base">check_circle</span>
        Submit Quiz
      </button>
      <button
        onClick={onReset}
        onMouseEnter={() => setHoverReset(true)}
        onMouseLeave={() => setHoverReset(false)}
        className={`flex-1 py-3 rounded-xl border text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${
          hoverReset ? 'border-blue-500 text-blue-600 bg-blue-50' : 'border-gray-200 text-gray-500 bg-white'
        }`}
      >
        <span className="material-icons text-base">refresh</span>
        Reset
      </button>
    </div>
  );
}