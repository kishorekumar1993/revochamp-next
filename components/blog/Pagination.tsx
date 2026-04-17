'use client';

import { useMemo } from 'react';

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  // Generate page numbers with smart truncation for mobile
  const pageNumbers = useMemo(() => {
    const pages = [];
    const maxPagesToShow = window.innerWidth < 640 ? 3 : 5;
    const halfWindow = Math.floor(maxPagesToShow / 2);

    if (totalPages <= maxPagesToShow) {
      // Show all pages if total is small
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Always show first page
    pages.push(1);

    // Calculate range around current page
    let startPage = Math.max(2, currentPage - halfWindow);
    let endPage = Math.min(totalPages - 1, currentPage + halfWindow);

    // Adjust if we're near the start
    if (currentPage <= halfWindow + 1) {
      endPage = Math.min(totalPages - 1, maxPagesToShow - 1);
    }

    // Adjust if we're near the end
    if (currentPage >= totalPages - halfWindow) {
      startPage = Math.max(2, totalPages - maxPagesToShow + 2);
    }

    // Add ellipsis and pages
    if (startPage > 2) {
      pages.push('...');
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages - 1) {
      pages.push('...');
    }

    // Always show last page
    pages.push(totalPages);

    return pages;
  }, [currentPage, totalPages]);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-2 py-8">
      {/* Previous button */}
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className={`
          flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5
          rounded-lg font-medium text-sm transition-all duration-300
          ${
            currentPage === 1
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
              : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 active:bg-slate-100'
          }
        `}
      >
        <span>←</span>
        <span className="hidden sm:inline">Previous</span>
      </button>

      {/* Page numbers */}
      <div className="flex items-center gap-1 sm:gap-2">
        {pageNumbers.map((pageNum, idx) => {
          if (pageNum === '...') {
            return (
              <span
                key={`ellipsis-${idx}`}
                className="px-2 py-2 text-slate-500 text-sm font-medium"
              >
                ⋯
              </span>
            );
          }

          const isActive = currentPage === pageNum;

          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum as number)}
              className={`
                min-w-10 h-10 rounded-lg font-medium text-sm
                transition-all duration-300 flex items-center justify-center
                ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/30 scale-105'
                    : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 active:bg-slate-100'
                }
              `}
              aria-label={`Go to page ${pageNum}`}
              aria-current={isActive ? 'page' : undefined}
            >
              {pageNum}
            </button>
          );
        })}
      </div>

      {/* Next button */}
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className={`
          flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5
          rounded-lg font-medium text-sm transition-all duration-300
          ${
            currentPage === totalPages
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
              : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 active:bg-slate-100'
          }
        `}
      >
        <span className="hidden sm:inline">Next</span>
        <span>→</span>
      </button>

      {/* Page info - mobile only */}
      <div className="sm:hidden text-xs text-slate-600 font-medium">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
}

// 'use client';

// import { useMemo } from "react";

// export default function Pagination({
//   currentPage,
//   totalPages,
//   onPageChange,
// }: {
//   currentPage: number;
//   totalPages: number;
//   onPageChange: (page: number) => void;
// }) {
//   if (totalPages <= 1) return null;

//   // const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
// const pageNumbers = useMemo(
//   () => Array.from({ length: totalPages }, (_, i) => i + 1),
//   [totalPages]
// );
//   return (
//     <div className="flex justify-center gap-2 mt-12">
//       <button
//         disabled={currentPage === 1}
//         onClick={() => onPageChange(currentPage - 1)}
//         className="px-4 py-2 border border-border disabled:opacity-30 hover:bg-gray-100 transition"
//       >
//         Previous
//       </button>
//       {pageNumbers.map((pageNum) => (
//         <button
//           key={pageNum}   // ✅ unique key added
//           onClick={() => onPageChange(pageNum)}
//           className={`px-4 py-2 ${
//             currentPage === pageNum
//               ? 'bg-red text-white'
//               : 'border border-border hover:bg-gray-100'
//           } transition`}
//         >
//           {pageNum}
//         </button>
//       ))}
//       <button
//         disabled={currentPage === totalPages}
//         onClick={() => onPageChange(currentPage + 1)}
//         className="px-4 py-2 border border-border disabled:opacity-30 hover:bg-gray-100 transition"
//       >
//         Next
//       </button>
//     </div>
//   );
// }