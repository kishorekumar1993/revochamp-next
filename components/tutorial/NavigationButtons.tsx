'use client';

interface NavigationButtonsProps {
  onPrevious: () => void;
  onNext: () => void;
  isFirst?: boolean;
  isLast?: boolean;
}

export default function NavigationButtons({
  onPrevious,
  onNext,
  isFirst = false,
  isLast = false,
}: NavigationButtonsProps) {
  return (
    <div className="flex gap-3 sm:gap-4 mt-12 pt-6 border-t border-gray-100">
      {/* Previous Button */}
      <button
        onClick={onPrevious}
        disabled={isFirst}
        className={`group flex-1 py-3 px-4 rounded-xl border font-medium text-sm flex items-center justify-center gap-2 transition-all duration-200
          ${isFirst
            ? 'bg-gray-50 border-gray-200 text-gray-300 cursor-not-allowed'
            : 'bg-white border-gray-200 text-gray-700 hover:border-indigo-300 hover:bg-indigo-50/50 hover:text-indigo-600 hover:shadow-sm active:scale-[0.98]'
          }`}
        aria-label="Previous tutorial"
      >
        <svg 
          className={`w-4 h-4 transition-transform duration-200 ${!isFirst && 'group-hover:-translate-x-1'}`} 
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Previous</span>
      </button>

      {/* Next Button */}
      <button
        onClick={onNext}
        disabled={isLast}
        className={`group flex-1 py-3 px-4 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all duration-200
          ${isLast
            ? 'bg-gray-50 border border-gray-200 text-gray-300 cursor-not-allowed'
            : 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/30 hover:from-indigo-700 hover:to-indigo-800 active:scale-[0.98] border border-transparent'
          }`}
        aria-label="Next tutorial"
      >
        <span>{isLast ? 'Completed' : 'Next'}</span>
        <svg 
          className={`w-4 h-4 transition-transform duration-200 ${!isLast && 'group-hover:translate-x-1'}`} 
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </button>
    </div>
  );
}
