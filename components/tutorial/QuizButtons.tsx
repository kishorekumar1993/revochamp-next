'use client';

interface QuizButtonsProps {
  onSubmit: () => void;
  onReset: () => void;
  isSubmitting?: boolean; // Optional loading state
}

export default function QuizButtons({ onSubmit, onReset, isSubmitting = false }: QuizButtonsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mt-6 sm:mt-8">
      {/* Submit Button */}
      <button
        onClick={onSubmit}
        disabled={isSubmitting}
        className="
          flex-1 py-3 sm:py-3.5 px-4
          rounded-xl
          text-white font-semibold text-sm sm:text-base
          flex items-center justify-center gap-2
          bg-gradient-to-r from-blue-600 to-blue-800
          hover:from-blue-500 hover:to-blue-700
          dark:from-blue-500 dark:to-indigo-600
          dark:hover:from-blue-400 dark:hover:to-indigo-500
          shadow-sm hover:shadow-md
          hover:shadow-blue-500/25 dark:hover:shadow-blue-400/20
          transition-all duration-200
          disabled:opacity-60 disabled:cursor-not-allowed
          disabled:hover:from-blue-600 disabled:hover:to-blue-800
          disabled:hover:shadow-sm
        "
      >
        {isSubmitting ? (
          <>
            <span className="material-icons animate-spin text-base sm:text-lg">refresh</span>
            <span>Submitting...</span>
          </>
        ) : (
          <>
            <span className="material-icons text-base sm:text-lg">check_circle</span>
            <span>Submit Quiz</span>
          </>
        )}
      </button>

      {/* Reset Button */}
      <button
        onClick={onReset}
        disabled={isSubmitting}
        className="
          flex-1 py-3 sm:py-3.5 px-4
          rounded-xl
          border border-gray-300 dark:border-gray-600
          bg-white dark:bg-gray-800
          text-gray-700 dark:text-gray-200
          font-medium text-sm sm:text-base
          flex items-center justify-center gap-2
          hover:border-blue-500 dark:hover:border-blue-400
          hover:bg-blue-50 dark:hover:bg-gray-700
          hover:text-blue-700 dark:hover:text-blue-300
          shadow-sm hover:shadow
          transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
          disabled:hover:border-gray-300 disabled:hover:bg-white
          disabled:hover:text-gray-700
          dark:disabled:hover:border-gray-600 dark:disabled:hover:bg-gray-800
          dark:disabled:hover:text-gray-200
        "
      >
        <span className="material-icons text-base sm:text-lg">refresh</span>
        <span>Reset</span>
      </button>
    </div>
  );
}

// 'use client';

// import { useState } from 'react';

// interface QuizButtonsProps {
//   onSubmit: () => void;
//   onReset: () => void;
// }

// export default function QuizButtons({ onSubmit, onReset }: QuizButtonsProps) {
//   const [hoverSubmit, setHoverSubmit] = useState(false);
//   const [hoverReset, setHoverReset] = useState(false);

//   return (
//     <div className="flex gap-3 mt-4">
//       <button
//         onClick={onSubmit}
//         onMouseEnter={() => setHoverSubmit(true)}
//         onMouseLeave={() => setHoverSubmit(false)}
//         className="flex-1 py-3 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200"
//         style={{
//           background: hoverSubmit
//             ? 'linear-gradient(135deg, #60A5FA, #3B82F6)'
//             : 'linear-gradient(135deg, #3B82F6, #1e40af)',
//           boxShadow: hoverSubmit ? '0 4px 12px rgba(59,130,246,0.3)' : 'none',
//         }}
//       >
//         <span className="material-icons text-base">check_circle</span>
//         Submit Quiz
//       </button>
//       <button
//         onClick={onReset}
//         onMouseEnter={() => setHoverReset(true)}
//         onMouseLeave={() => setHoverReset(false)}
//         className={`flex-1 py-3 rounded-xl border text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${
//           hoverReset ? 'border-blue-500 text-blue-600 bg-blue-50' : 'border-gray-200 text-gray-500 bg-white'
//         }`}
//       >
//         <span className="material-icons text-base">refresh</span>
//         Reset
//       </button>
//     </div>
//   );
// }