'use client';

import { useState, useEffect } from 'react';

const CATEGORIES = [
  'All', 'Technology', 'AI', 'Business', 'Finance', 'Insurance',
  'Startups', 'Health', 'Education', 'Politics', 'International',
  'Entertainment', 'Consumer',
];

export default function CategoryFilter({
  activeCategory,
  onSelect,
}: {
  activeCategory: string | null;
  onSelect: (cat: string | null) => void;
}) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [showLeftGradient, setShowLeftGradient] = useState(false);
  const [showRightGradient, setShowRightGradient] = useState(true);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    setScrollPosition(container.scrollLeft);
    setShowLeftGradient(container.scrollLeft > 0);
    setShowRightGradient(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 10
    );
  };

  useEffect(() => {
    const activeBtn = document.querySelector('[data-active="true"]');
    if (activeBtn && 'scrollIntoView' in activeBtn) {
      activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [activeCategory]);

  return (
    <div className="relative w-full">
      {/* Left gradient overlay */}
      {showLeftGradient && (
        <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-r from-slate-900 via-slate-900 to-transparent z-20 pointer-events-none" />
      )}

      {/* Right gradient overlay */}
      {showRightGradient && (
        <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-l from-slate-900 via-slate-900 to-transparent z-20 pointer-events-none" />
      )}

      {/* Scrollable container */}
      <div
        onScroll={handleScroll}
        className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scroll-smooth"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(148, 163, 184, 0.3) transparent',
        }}
      >
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat || (cat === 'All' && !activeCategory);
          return (
            <button
              key={cat}
              data-active={isActive}
              onClick={() => onSelect(cat === 'All' ? null : cat)}
              className={`
                relative px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg font-medium text-xs sm:text-sm
                whitespace-nowrap transition-all duration-300 ease-out
                flex items-center gap-1.5 flex-shrink-0
                ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/30 scale-105'
                    : 'bg-slate-700/40 text-slate-300 hover:bg-slate-700/60 hover:text-white border border-slate-600/30'
                }
              `}
            >
              <span className={isActive ? 'opacity-100' : 'opacity-0'}>✓</span>
              {cat}
            </button>
          );
        })}
      </div>

      {/* Custom scrollbar styles */}
      <style>{`
        div[data-active] {
          scroll-margin-inline: 10px;
        }
        @supports (scrollbar-width: thin) {
          div:has(> button)::-webkit-scrollbar {
            height: 4px;
          }
          div:has(> button)::-webkit-scrollbar-track {
            background: transparent;
          }
          div:has(> button)::-webkit-scrollbar-thumb {
            background: rgba(148, 163, 184, 0.3);
            border-radius: 2px;
          }
          div:has(> button)::-webkit-scrollbar-thumb:hover {
            background: rgba(148, 163, 184, 0.5);
          }
        }
      `}</style>
    </div>
  );
}

// 'use client';

// const CATEGORIES = [
//   'All', 'Technology', 'AI', 'Business', 'Finance', 'Insurance',
//   'Startups', 'Health', 'Education', 'Politics', 'International',
//   'Entertainment', 'Consumer',
// ];

// export default function CategoryFilter({
//   activeCategory,
//   onSelect,
// }: {
//   activeCategory: string | null;
//   onSelect: (cat: string | null) => void;
// }) {
//   return (
//     <div className="w-full border-b border-white/5 bg-black/20 backdrop-blur-md">
//       <div className="max-w-7xl mx-auto">
//         <div 
//           className="flex gap-3 py-4 px-4 overflow-x-auto no-scrollbar items-center scroll-smooth"
//           style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
//         >
//           {CATEGORIES.map((cat) => {
//             const isActive = activeCategory === cat || (cat === 'All' && !activeCategory);
//             console.log('CategoryFilter rendering, activeCategory:', activeCategory);
//             return (
//               <button
//                 key={cat}
// onClick={() => onSelect(cat === 'All' ? null : cat)}
//                 className={`
//                   relative px-5 py-2 rounded-full text-xs font-medium uppercase tracking-widest 
//                   transition-all duration-300 ease-out whitespace-nowrap border
//                   ${isActive 
//                     ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.3)] scale-105' 
//                     : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20'}
//                 `}
//               >
//                 {cat}
//               </button>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// }
