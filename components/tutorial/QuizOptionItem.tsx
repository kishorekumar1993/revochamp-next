'use client';

interface QuizOptionItemProps {
  index: number;
  text: string;
  isSelected: boolean;
  isCorrect: boolean;
  isWrong: boolean;
  submitted: boolean;
  onTap?: () => void;
}

export default function QuizOptionItem({
  index,
  text,
  isSelected,
  isCorrect,
  isWrong,
  submitted,
  onTap,
}: QuizOptionItemProps) {
  // ✅ Fix #3: No hover state – use CSS instead
  // ✅ Fix #2: Disable click after submit
  const handleClick = () => {
    if (!submitted && onTap) onTap();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && !submitted && onTap) {
      e.preventDefault();
      onTap();
    }
  };

  // ✅ Fix #1: Accessibility + styling
  // ✅ Fix #4 & #9: Color logic based on submission and correctness
  let borderColor = 'border-gray-200';
  let bgColor = 'bg-white';
  let letterBg = 'bg-gray-100';
  let letterText = 'text-gray-400';
  let textColor = 'text-gray-600';
  let icon = null;

  if (submitted) {
    if (isCorrect) {
      borderColor = 'border-green-500';
      bgColor = 'bg-green-50';
      letterBg = 'bg-green-100';
      letterText = 'text-green-700';
      textColor = 'text-green-700';
      icon = <span className="material-icons text-green-500 text-base">check_circle</span>;
    } else if (isWrong) {
      borderColor = 'border-red-500';
      bgColor = 'bg-red-50';
      letterBg = 'bg-red-100';
      letterText = 'text-red-600';
      textColor = 'text-red-600';
      icon = <span className="material-icons text-red-500 text-base">cancel</span>;
    }
  } else {
    if (isSelected) {
      borderColor = 'border-blue-500';
      bgColor = 'bg-blue-50';
      letterBg = 'bg-blue-100';
      letterText = 'text-blue-600';
      textColor = 'text-blue-600';
      icon = <span className="material-icons text-blue-500 text-base">radio_button_checked</span>;
    }
    // ✅ Fix #3: Hover handled by CSS, not state
  }

  // ✅ Fix #7: Dynamic letter (supports unlimited options)
  const letter = String.fromCharCode(65 + index);

  return (
    <div
      role="button"
      tabIndex={submitted ? -1 : 0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`
        flex items-center gap-3 p-3 rounded-xl border transition-all duration-200
        ${borderColor} ${bgColor}
        ${!submitted ? 'cursor-pointer hover:border-blue-300 hover:bg-blue-50 active:scale-[0.98]' : 'cursor-default opacity-80'}
      `}
    >
      <div
        className={`
          w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-colors
          ${letterBg} ${letterText}
        `}
      >
        {letter}
      </div>

      {/* ✅ Fix #6: Break long words */}
      <span className={`flex-1 text-sm font-medium break-words ${textColor}`}>
        {text}
      </span>

      {/* ✅ Fix #5: Fixed width to prevent layout shift */}
      <div className="shrink-0 w-5 flex justify-center">
        {icon}
      </div>
    </div>
  );
}