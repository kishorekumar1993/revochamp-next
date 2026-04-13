'use client';

import { memo } from 'react';

interface ScoreCardProps {
  score: number;
  total: number;
}

// ✅ Fix #1: Safe HEX to RGBA conversion (works everywhere)
const hexToRgba = (hex: string, opacity: number): string => {
  const bigint = parseInt(hex.replace('#', ''), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export default memo(function ScoreCard({ score, total }: ScoreCardProps) {
  // ✅ Fix #7: Zero‑state handling
  if (total === 0) {
    return (
      <div className="bg-white dark:bg-[#1A2235] rounded-xl border border-gray-200 dark:border-gray-700 p-6 text-center my-4">
        <p className="text-gray-500 dark:text-gray-400">No quiz attempted yet</p>
      </div>
    );
  }

  // ✅ Fix #2: Safe percentage (clamped to 0–100)
  const percentage = Math.min(100, Math.max(0, (score / total) * 100));
  const isExcellent = percentage >= 80;
  const isGood = percentage >= 50;

  // Colors (from your design tokens)
  const successColor = '#10B981'; // green
  const warningColor = '#F59E0B'; // amber
  const dangerColor = '#EF4444';  // red

  const color = isExcellent ? successColor : isGood ? warningColor : dangerColor;
  // ✅ Fix #5: Better text contrast for yellow on dark
  const textColor = isGood ? '#FBBF24' : color;

  // ✅ Fix #8: Upgraded emojis for premium feel
  const emoji = isExcellent ? '🎉' : isGood ? '🚀' : '⚡';
  const message = isExcellent ? 'Excellent work!' : isGood ? 'Good job!' : 'Keep practicing!';

  // ✅ Fix #1: Safe opacity values using RGBA
  const borderColor = hexToRgba(color, 0.2);   // ~20% opacity
  const bgCircle = hexToRgba(color, 0.1);      // ~10% opacity

  return (
    <div className="bg-white dark:bg-[#1A2235] rounded-xl border p-6 text-center my-4 transition-all duration-300"
         style={{ borderColor }}>
      {/* ✅ Fix #9: Add label */}
      <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">
        Your Score
      </p>

      {/* Score circle */}
      <div
        className="w-20 h-20 rounded-full border-4 flex items-center justify-center mx-auto mb-4 transition-all duration-500"
        style={{ borderColor: color, backgroundColor: bgCircle }}
      >
        <span className="text-xl font-bold" style={{ color: textColor }}>
          {score}/{total}
        </span>
      </div>

      {/* Progress bar – ✅ Fix #3: Accessibility */}
      <div
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-2"
      >
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>

      {/* Percentage */}
      <p className="text-sm font-semibold mb-1" style={{ color: textColor }}>
        {Math.round(percentage)}% Correct
      </p>

      {/* Message with emoji */}
      <p className="text-base font-bold" style={{ color: textColor }}>
        {emoji} {message}
      </p>
    </div>
  );
});