// // components/TableOfContents/index.tsx
// import React, {
//   useRef,
//   useEffect,
//   useMemo,
//   useState,
//   useCallback,
//   forwardRef,
//   useImperativeHandle,
// } from 'react';
// import { motion, AnimatePresence, MotionConfig, useReducedMotion } from 'framer-motion';
// // import { useReducedMotion } from '@/hooks/useReducedMotion'; // custom hook (see below)

// // ============================================================================
// // Types
// // ============================================================================
// export interface Heading {
//   id: string;
//   text: string;
//   level?: 1 | 2 | 3 | 4 | 5 | 6;
// }

// export interface TableOfContentsData {
//   readTime?: string;
//   totalSections?: number;
//   lessonNumber?: number;
//   difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
// }

// export interface TableOfContentsProps {
//   headings: Heading[];
//   activeHeadingId: string | null;
//   scrollProgress: number; // 0–100
//   data: TableOfContentsData;
//   scrollToHeading: (id: string) => void;
//   /** Enable haptic feedback on mobile (default: false) */
//   enableVibration?: boolean;
//   /** Show difficulty badge (default: true) */
//   showDifficulty?: boolean;
//   /** Show copy link button (default: true) */
//   showCopyLink?: boolean;
//   /** Offset for smooth scroll (e.g., fixed header height) (default: 80) */
//   scrollOffset?: number;
//   /** Called when the copy link button is clicked (for analytics) */
//   onCopyLink?: () => void;
// }

// // ============================================================================
// // Helpers
// // ============================================================================
// const parseReadTime = (readTimeStr?: string): number => {
//   if (!readTimeStr) return 5;
//   const match = readTimeStr.match(/\d+/);
//   return match ? parseInt(match[0], 10) : 5;
// };

// // ============================================================================
// // Subcomponents (for readability & memoization)
// // ============================================================================

// /** Animated progress bar with gradient */
// const ProgressBar = React.memo(({ progress }: { progress: number }) => {
//   const prefersReducedMotion = useReducedMotion();
//   return (
//     <div className="relative h-1.5 w-full bg-gray-100/80 rounded-full overflow-hidden">
//       <motion.div
//         className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 rounded-full"
//         initial={{ width: 0 }}
//         animate={{ width: `${progress}%` }}
//         transition={
//           prefersReducedMotion
//             ? { duration: 0 }
//             : { type: 'spring', bounce: 0, duration: 0.5 }
//         }
//       />
//     </div>
//   );
// });
// ProgressBar.displayName = 'ProgressBar';

// /** Individual heading button with active state and animations */
// const HeadingItem = React.memo(
//   ({
//     heading,
//     index,
//     isActive,
//     onClick,
//   }: {
//     heading: Heading;
//     index: number;
//     isActive: boolean;
//     onClick: (id: string) => void;
//   }) => {
//     const level = heading.level || 2;
//     const paddingLeft =
//       level === 3 ? 'pl-8' : level === 4 ? 'pl-10' : level === 5 ? 'pl-12' : 'pl-4';

//     return (
//       <motion.button
//         onClick={() => onClick(heading.id)}
//         className={`relative w-full flex items-center gap-3 py-2.5 px-4 text-sm rounded-xl transition-all duration-200 group/item text-left focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 ${
//           isActive
//             ? 'text-gray-900 font-semibold'
//             : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50/80'
//         } ${paddingLeft}`}
//         aria-current={isActive ? 'location' : undefined}
//         aria-label={`Jump to section: ${heading.text}`}
//       >
//         {/* Active left glow indicator with shared layoutId */}
//         {isActive && (
//           <motion.div
//             layoutId="active-line-toc"
//             className="absolute left-0 w-1 h-5 bg-indigo-500 rounded-r-full shadow-[0_0_8px_rgba(99,102,241,0.6)]"
//             transition={{ type: 'spring', stiffness: 350, damping: 30 }}
//           />
//         )}

//         {/* Animated background pill for active item */}
//         <AnimatePresence>
//           {isActive && (
//             <motion.div
//               layoutId="active-pill-toc"
//               initial={{ opacity: 0, scale: 0.96 }}
//               animate={{ opacity: 1, scale: 1 }}
//               exit={{ opacity: 0, scale: 0.96 }}
//               className="absolute inset-0 bg-white shadow-md shadow-indigo-50/50 border border-indigo-100/60 rounded-xl -z-10"
//               transition={{ type: 'spring', stiffness: 450, damping: 28 }}
//             />
//           )}
//         </AnimatePresence>

//         {/* Index number */}
//         <span
//           className={`flex-shrink-0 text-[11px] font-mono font-bold transition-all duration-200 ${
//             isActive ? 'text-indigo-600 scale-105' : 'text-gray-300 group-hover/item:text-indigo-400'
//           }`}
//         >
//           {String(index + 1).padStart(2, '0')}
//         </span>

//         {/* Heading text */}
//         <span className="flex-1 truncate">{heading.text}</span>

//         {/* Anchor icon on hover */}
//         <motion.div
//           initial={{ opacity: 0, x: -4 }}
//           whileHover={{ opacity: 1, x: 0 }}
//           className="opacity-0 group-hover/item:opacity-100 transition-opacity duration-200"
//         >
//           <svg className="w-3.5 h-3.5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.102m3.172-3.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.102"
//             />
//           </svg>
//         </motion.div>
//       </motion.button>
//     );
//   }
// );
// HeadingItem.displayName = 'HeadingItem';

// /** Copy link button with tooltip feedback */
// const CopyLinkButton = React.memo(
//   ({ onCopy, onCopyCallback }: { onCopy: () => void; onCopyCallback?: () => void }) => {
//     const [showFeedback, setShowFeedback] = useState(false);

//     const handleCopy = useCallback(async () => {
//       try {
//         await navigator.clipboard.writeText(window.location.href);
//         setShowFeedback(true);
//         onCopyCallback?.();
//         setTimeout(() => setShowFeedback(false), 2000);
//       } catch (err) {
//         console.error('Failed to copy link:', err);
//       }
//       onCopy();
//     }, [onCopy, onCopyCallback]);

//     return (
//       <div className="relative">
//         <motion.button
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//           onClick={handleCopy}
//           className="relative flex items-center justify-center w-8 h-8 rounded-full bg-white/80 border border-gray-200 text-gray-500 hover:text-indigo-600 hover:border-indigo-200 hover:shadow-sm transition-all duration-200 group/copy focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           aria-label="Copy page link"
//         >
//           <svg
//             className="w-4 h-4 transition-transform group-hover/copy:rotate-12"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth="1.8"
//               d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
//             />
//           </svg>
//         </motion.button>

//         <AnimatePresence>
//           {showFeedback && (
//             <motion.div
//               initial={{ opacity: 0, y: 10, scale: 0.8 }}
//               animate={{ opacity: 1, y: 0, scale: 1 }}
//               exit={{ opacity: 0, scale: 0.8 }}
//               className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-gray-800 text-white text-[10px] font-semibold rounded-md whitespace-nowrap shadow-lg"
//             >
//               Link copied! ✓
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     );
//   }
// );
// CopyLinkButton.displayName = 'CopyLinkButton';

// // ============================================================================
// // Main Component
// // ============================================================================
// const TableOfContents: React.FC<TableOfContentsProps> = ({
//   headings,
//   activeHeadingId,
//   scrollProgress,
//   data,
//   scrollToHeading,
//   enableVibration = false,
//   showDifficulty = true,
//   showCopyLink = true,
//   scrollOffset = 80,
//   onCopyLink,
// }) => {
//   const navContainerRef = useRef<HTMLDivElement>(null);
//   const headingRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
//   const prefersReducedMotion = useReducedMotion();

//   // Derived values
//   const totalReadMinutes = useMemo(() => parseReadTime(data.readTime), [data.readTime]);
//   const remainingMinutes = useMemo(() => {
//     const remainingPercent = Math.max(0, 100 - scrollProgress);
//     return Math.ceil((remainingPercent / 100) * totalReadMinutes);
//   }, [scrollProgress, totalReadMinutes]);

//   const totalSections = headings.length;

//   const difficultyColor = useMemo(() => {
//     switch (data.difficulty) {
//       case 'Beginner':
//         return 'text-emerald-600 bg-emerald-50';
//       case 'Intermediate':
//         return 'text-amber-600 bg-amber-50';
//       case 'Advanced':
//         return 'text-rose-600 bg-rose-50';
//       default:
//         return 'text-gray-500 bg-gray-100';
//     }
//   }, [data.difficulty]);

//   // Auto-scroll active heading into view inside TOC
//   useEffect(() => {
//     if (activeHeadingId && headingRefs.current.has(activeHeadingId)) {
//       const activeButton = headingRefs.current.get(activeHeadingId);
//       const container = navContainerRef.current;
//       if (activeButton && container) {
//         const containerRect = container.getBoundingClientRect();
//         const buttonRect = activeButton.getBoundingClientRect();
//         const isVisible =
//           buttonRect.top >= containerRect.top && buttonRect.bottom <= containerRect.bottom;

//         if (!isVisible) {
//           activeButton.scrollIntoView({
//             behavior: prefersReducedMotion ? 'auto' : 'smooth',
//             block: 'nearest',
//           });
//         }
//       }
//     }
//   }, [activeHeadingId, prefersReducedMotion]);

//   const handleHeadingClick = useCallback(
//     (id: string) => {
//       // Smooth scroll with offset for fixed header
//       const element = document.getElementById(id);
//       if (element) {
//         const elementPosition = element.getBoundingClientRect().top + window.scrollY;
//         const offsetPosition = elementPosition - scrollOffset;
//         window.scrollTo({
//           top: offsetPosition,
//           behavior: prefersReducedMotion ? 'auto' : 'smooth',
//         });
//       }
//       scrollToHeading(id); // parent callback for updating active state

//       if (enableVibration && window.navigator && window.navigator.vibrate) {
//         window.navigator.vibrate(10);
//       }
//     },
//     [scrollToHeading, scrollOffset, enableVibration, prefersReducedMotion]
//   );

//   // Guard against SSR for window-dependent code
//   const [isClient, setIsClient] = useState(false);
//   useEffect(() => {
//     setIsClient(true);
//   }, []);

//   if (!isClient) {
//     // Return a placeholder with same dimensions to avoid layout shift
//     return (
//       <aside className="hidden lg:block w-80 flex-shrink-0 sticky top-24 h-fit max-h-[calc(100vh-10rem)] px-4 group/sidebar">
//         <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-lg h-[400px] animate-pulse" />
//       </aside>
//     );
//   }

//   return (
//     <MotionConfig reducedMotion={prefersReducedMotion ? 'always' : 'never'}>
//       <aside
//         className="hidden lg:block w-80 flex-shrink-0 sticky top-24 h-fit max-h-[calc(100vh-10rem)] px-4 group/sidebar"
//         aria-label="Table of contents"
//       >
//         <div className="bg-white/80 backdrop-blur-2xl backdrop-saturate-150 border border-white/60 rounded-3xl shadow-[0_20px_45px_-12px_rgba(0,0,0,0.12)] overflow-hidden transition-all duration-500 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.2)]">
//           {/* Header */}
//           <div className="p-6 pb-3 border-b border-gray-100/80">
//             <div className="flex items-center justify-between mb-4">
//               <div className="flex items-center gap-2">
//                 <div className="relative flex h-2 w-2">
//                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
//                   <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
//                 </div>
//                 <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">
//                   On this page
//                 </h3>
//                 <span className="text-[10px] font-mono font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-md">
//                   {totalSections}
//                 </span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <motion.div
//                   className="text-[11px] font-bold text-indigo-600 bg-indigo-50/80 px-2 py-0.5 rounded-full tabular-nums shadow-sm"
//                   initial={{ scale: 0.9 }}
//                   animate={{ scale: 1 }}
//                   key={Math.floor(scrollProgress)}
//                 >
//                   {Math.round(scrollProgress)}%
//                 </motion.div>
//               </div>
//             </div>

//             <ProgressBar progress={scrollProgress} />

//             {/* Stats row */}
//             <div className="flex items-center justify-between mt-4 text-xs">
//               {showDifficulty && data.difficulty && (
//                 <span
//                   className={`inline-flex items-center gap-1 px-2 py-1 rounded-full font-semibold ${difficultyColor}`}
//                 >
//                   <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M13 10V3L4 14h7v7l9-11h-7z"
//                     />
//                   </svg>
//                   {data.difficulty}
//                 </span>
//               )}
//               <div className="flex items-center gap-1.5 text-gray-500">
//                 <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
//                   />
//                 </svg>
//                 <span className="font-medium">{totalReadMinutes} min read</span>
//               </div>
//             </div>
//           </div>

//           {/* Navigation list */}
//           <nav
//             ref={navContainerRef}
//             className="px-3 py-3 overflow-y-auto max-h-[48vh] scroll-smooth"
//             style={{
//               scrollbarWidth: 'thin',
//               scrollbarColor: '#cbd5e1 #f1f5f9',
//             }}
//             aria-label="Sections"
//           >
//             <div className="space-y-1 relative">
//               {headings.map((heading, index) => (
//                 <HeadingItem
//                   key={heading.id}
//                   heading={heading}
//                   index={index}
//                   isActive={activeHeadingId === heading.id}
//                   onClick={handleHeadingClick}
//                 />
//               ))}
//             </div>
//           </nav>

//           {/* Footer */}
//           <div className="mt-2 bg-gradient-to-b from-transparent via-gray-50/30 to-gray-50/60 p-5 pt-3">
//             <div className="pt-3 border-t border-gray-200/50 flex items-center justify-between">
//               <div className="flex flex-col gap-0.5">
//                 <span className="text-[9px] text-gray-400 uppercase font-black tracking-widest">
//                   Remaining
//                 </span>
//                 <div className="flex items-center gap-1.5">
//                   <span className="text-sm font-bold text-gray-800 tabular-nums">
//                     {remainingMinutes} min
//                   </span>
//                   <span className="w-1 h-1 bg-gray-300 rounded-full" />
//                   <span className="text-[10px] font-medium text-gray-500">left</span>
//                 </div>
//               </div>

//               {showCopyLink && (
//                 <CopyLinkButton onCopy={() => {}} onCopyCallback={onCopyLink} />
//               )}
//             </div>

//             <p className="text-[10px] text-gray-400 mt-3 flex items-center gap-1.5">
//               <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
//                 />
//               </svg>
//               <span>Click any section to jump — progress syncs automatically</span>
//             </p>
//           </div>
//         </div>
//       </aside>
//     </MotionConfig>
//   );
// };

// export default React.memo(TableOfContents);
//sad


import React, { useRef, useEffect, useMemo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================================================
// Type Definitions
// ============================================================================
interface Heading {
  id: string;
  text: string;
  level?: number; // Optional: support for nested heading levels
}

interface TableOfContentsData {
  readTime?: string;      // e.g., "5 min" or "8 min"
  totalSections?: number;
  lessonNumber?: number;
  difficulty?:string;
}

interface TableOfContentsProps {
  headings: Heading[];
  activeHeadingId: string | null;
  scrollProgress: number;       // 0 to 100
  data: TableOfContentsData;
  scrollToHeading: (id: string) => void;
}

// ============================================================================
// Helper: Parse numeric value from readTime string (e.g., "5 min" -> 5)
// ============================================================================
const parseReadTime = (readTimeStr?: string): number => {
  if (!readTimeStr) return 5;
  const match = readTimeStr.match(/\d+/);
  return match ? parseInt(match[0], 10) : 5;
};

// ============================================================================
// Main Component: TableOfContents (Learning Platform Style)
// ============================================================================
const TableOfContents: React.FC<TableOfContentsProps> = ({
  headings,
  activeHeadingId,
  scrollProgress,
  data,
  scrollToHeading,
}) => {
  // ----- Refs for auto-scrolling active heading into view within TOC -----
  const navContainerRef = useRef<HTMLDivElement>(null);
  const headingRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  // ----- Local state for "Copied link" feedback -----
  const [showCopiedFeedback, setShowCopiedFeedback] = useState(false);

  // ----- Derived values: reading time, remaining time, total sections -----
  const totalReadMinutes = useMemo(() => parseReadTime(data.readTime), [data.readTime]);
  const remainingMinutes = useMemo(() => {
    const remainingPercent = Math.max(0, 100 - scrollProgress);
    return Math.ceil((remainingPercent / 100) * totalReadMinutes);
  }, [scrollProgress, totalReadMinutes]);

  const totalSections = headings.length;

  // ----- Auto-scroll the active heading button into view inside the TOC -----
  useEffect(() => {
    if (activeHeadingId && headingRefs.current.has(activeHeadingId)) {
      const activeButton = headingRefs.current.get(activeHeadingId);
      const container = navContainerRef.current;
      if (activeButton && container) {
        const containerRect = container.getBoundingClientRect();
        const buttonRect = activeButton.getBoundingClientRect();
        const isVisible =
          buttonRect.top >= containerRect.top &&
          buttonRect.bottom <= containerRect.bottom;

        if (!isVisible) {
          activeButton.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
          });
        }
      }
    }
  }, [activeHeadingId]);

  // ----- Copy current page URL to clipboard with feedback -----
  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShowCopiedFeedback(true);
      setTimeout(() => setShowCopiedFeedback(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  }, []);

  // ----- Handle heading click: smooth scroll + optional analytics hook -----
  const handleHeadingClick = useCallback(
    (id: string) => {
      scrollToHeading(id);
      // Optional: add a subtle haptic feedback (vibration) on mobile if needed
      if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(10);
      }
    },
    [scrollToHeading]
  );

  // ----- Format difficulty badge color -----
  const difficultyColor = useMemo(() => {
    switch (data.difficulty) {
      case 'Beginner':
        return 'text-emerald-600 bg-emerald-50';
      case 'Intermediate':
        return 'text-amber-600 bg-amber-50';
      case 'Advanced':
        return 'text-rose-600 bg-rose-50';
      default:
        return 'text-gray-500 bg-gray-100';
    }
  }, [data.difficulty]);

  return (
    <aside className="hidden lg:block w-80 flex-shrink-0 sticky top-24 h-fit max-h-[calc(100vh-10rem)] px-4 group/sidebar">
      {/* Main Card: Glassmorphism + Elevated Shadow + Smooth Transitions */}
      <div className="bg-white/80 backdrop-blur-2xl backdrop-saturate-150 border border-white/60 rounded-3xl shadow-[0_20px_45px_-12px_rgba(0,0,0,0.12)] overflow-hidden transition-all duration-500 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.2)]">
        
        {/* ===== HEADER SECTION ===== */}
        <div className="p-6 pb-3 border-b border-gray-100/80">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </div>
              <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">
                On this page
              </h3>
              {/* Section count badge */}
              <span className="text-[10px] font-mono font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-md">
                {totalSections}
              </span>
            </div>
            {/* Reading progress percentage + interactive ring */}
            <div className="flex items-center gap-2">
              <motion.div
                className="text-[11px] font-bold text-indigo-600 bg-indigo-50/80 px-2 py-0.5 rounded-full tabular-nums shadow-sm"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                key={Math.floor(scrollProgress)}
              >
                {Math.round(scrollProgress)}%
              </motion.div>
            </div>
          </div>

          {/* Enhanced Progress Bar with gradient and shimmer effect */}
          <div className="relative h-1.5 w-full bg-gray-100/80 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${scrollProgress}%` }}
              transition={{ type: 'spring', bounce: 0, duration: 0.5 }}
            />
            {/* Shimmer overlay on progress bar (subtle) */}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
          </div>

          {/* Quick stats row: difficulty + reading time */}
          <div className="flex items-center justify-between mt-4 text-xs">
            {data.difficulty && (
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full font-semibold ${difficultyColor}`}>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {data.difficulty}
              </span>
            )}
            <div className="flex items-center gap-1.5 text-gray-500">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">{totalReadMinutes} min read</span>
            </div>
          </div>
        </div>

        {/* ===== NAVIGATION AREA (Headings List) ===== */}
        <nav
          ref={navContainerRef}
          className="px-3 py-3 overflow-y-auto max-h-[48vh] scroll-smooth"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#cbd5e1 #f1f5f9',
          }}
        >
          <div className="space-y-1 relative">
            {headings.map((heading, index) => {
              const isActive = activeHeadingId === heading.id;
              const headingLevel = heading.level || 2; // default level 2 for indentation

              return (
                <motion.button
                  key={heading.id}
                  ref={(el) => {
                    if (el) headingRefs.current.set(heading.id, el);
                    else headingRefs.current.delete(heading.id);
                  }}
                  onClick={() => handleHeadingClick(heading.id)}
                  className={`relative w-full flex items-center gap-3 py-2.5 px-4 text-sm rounded-xl transition-all duration-300 group/item text-left ${
                    isActive
                      ? 'text-gray-900'
                      : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50/80'
                  }`}
                  style={{
                    paddingLeft: headingLevel === 3 ? '2rem' : headingLevel === 4 ? '2.5rem' : '1rem',
                  }}
                  aria-current={isActive ? 'location' : undefined}
                >
                  {/* Active left glow indicator (layoutId smooth transition) */}
                  {isActive && (
                    <motion.div
                      layoutId="active-line-toc"
                      className="absolute left-0 w-1 h-5 bg-indigo-500 rounded-r-full shadow-[0_0_8px_rgba(99,102,241,0.6)]"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}

                  {/* Animated background pill for active item */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        layoutId="active-pill-toc"
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        className="absolute inset-0 bg-white shadow-md shadow-indigo-50/50 border border-indigo-100/60 rounded-xl -z-10"
                        transition={{ type: 'spring', stiffness: 450, damping: 28 }}
                      />
                    )}
                  </AnimatePresence>

                  {/* Index number with dynamic styling */}
                  <span
                    className={`flex-shrink-0 text-[11px] font-mono font-bold transition-all duration-200 ${
                      isActive
                        ? 'text-indigo-600 scale-105'
                        : 'text-gray-300 group-hover/item:text-indigo-400'
                    }`}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  {/* Heading text with truncation + hover micro-translation */}
                  <span
                    className={`flex-1 truncate transition-all duration-200 ${
                      isActive ? 'font-semibold translate-x-0.5' : 'font-medium'
                    }`}
                  >
                    {heading.text}
                  </span>

                  {/* Optional: Show anchor icon on hover for deep linking */}
                  <motion.div
                    initial={{ opacity: 0, x: -4 }}
                    whileHover={{ opacity: 1, x: 0 }}
                    className="opacity-0 group-hover/item:opacity-100 transition-opacity duration-200"
                  >
                    <svg className="w-3.5 h-3.5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.102m3.172-3.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.102" />
                    </svg>
                  </motion.div>
                </motion.button>
              );
            })}
          </div>
        </nav>

        {/* ===== FOOTER SECTION: Reading Insights + Copy Link ===== */}
        <div className="mt-2 bg-gradient-to-b from-transparent via-gray-50/30 to-gray-50/60 p-5 pt-3">
          <div className="pt-3 border-t border-gray-200/50 flex items-center justify-between">
            {/* Left: Reading time remaining */}
            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] text-gray-400 uppercase font-black tracking-widest">
                Remaining
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-gray-800 tabular-nums">
                  {remainingMinutes} min
                </span>
                <span className="w-1 h-1 bg-gray-300 rounded-full" />
                <span className="text-[10px] font-medium text-gray-500">
                  left
                </span>
              </div>
            </div>

            {/* Right: Copy link button with feedback */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCopyLink}
                className="relative flex items-center justify-center w-8 h-8 rounded-full bg-white/80 border border-gray-200 text-gray-500 hover:text-indigo-600 hover:border-indigo-200 hover:shadow-sm transition-all duration-200 group/copy"
                aria-label="Copy page link"
              >
                <svg
                  className="w-4 h-4 transition-transform group-hover/copy:rotate-12"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </motion.button>

              {/* Copied feedback tooltip */}
              <AnimatePresence>
                {showCopiedFeedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-gray-800 text-white text-[10px] font-semibold rounded-md whitespace-nowrap shadow-lg"
                  >
                    Link copied! ✓
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Extra: Tip message for learners */}
          <p className="text-[10px] text-gray-400 mt-3 flex items-center gap-1.5">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <span>Click any section to jump — progress syncs automatically</span>
          </p>
        </div>
      </div>

      {/* Add shimmer keyframe animation in global scope (only once) */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </aside>
  );
};

export default TableOfContents;