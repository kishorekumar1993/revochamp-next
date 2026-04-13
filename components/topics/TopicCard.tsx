'use client';

import { TutorialTopic } from '@/types/topic';

interface Props {
  topic: TutorialTopic;
  isCompleted: boolean;
  onClick: () => void;
}

// Level-based colors (like course.color but for topics)
const levelColors: Record<string, string> = {
  Beginner: '#059669', // green
  Intermediate: '#2563EB', // blue
  Advanced: '#7C3AED', // purple
};

const levelEmoji: Record<string, string> = {
  Beginner: '🌱',
  Intermediate: '⚡',
  Advanced: '🚀',
};

export default function TopicCard({ topic, isCompleted, onClick }: Props) {
  const levelColor = levelColors[topic.level] || '#6B7280';
  const levelIcon = levelEmoji[topic.level] || '📘';

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 group">
      {/* Emoji header - exactly like CourseCard */}
      <div
        className="h-28 flex items-center justify-center"
        style={{ backgroundColor: `${levelColor}10` }}
      >
        <span
          className="text-5xl"
          style={{ fontFamily: `system-ui, 'Segoe UI Emoji', 'Apple Color Emoji', sans-serif` }}
        >
          {topic.emoji || levelIcon}
        </span>
      </div>

      <div className="p-5">
        {/* Title */}
        <h4 className="font-bold text-gray-900 line-clamp-2 group-hover:text-gray-700 transition">
          {topic.title}
        </h4>

        {/* Description */}
        {topic.description && (
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{topic.description}</p>
        )}

        {/* Metadata badges: Level, estimated time, difficulty */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {/* Level badge */}
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ backgroundColor: `${levelColor}15`, color: levelColor }}
          >
            {levelIcon} {topic.level}
          </span>

          {/* Estimated time */}
          {topic.estimatedHours && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
              ⏱️ {topic.estimatedHours} min
            </span>
          )}

          {/* Difficulty */}
          {topic.difficulty && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
              📊 {topic.difficulty}
            </span>
          )}
        </div>

        {/* Tags (like topics in CourseCard) */}
        {topic.tags && topic.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {topic.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded-full"
                style={{ backgroundColor: `${levelColor}10`, color: levelColor }}
              >
                #{tag}
              </span>
            ))}
            {topic.tags.length > 2 && (
              <span className="text-xs px-2 py-0.5 text-gray-400">+{topic.tags.length - 2}</span>
            )}
          </div>
        )}

        {/* Footer with completion indicator and button */}
        <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
          {isCompleted ? (
            <span className="flex items-center gap-1 text-green-600">
              <span>✅</span> Completed
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <span>📚</span> Not started
            </span>
          )}
          <span className="flex items-center gap-1">
            <span>🎯</span> {topic.level}
          </span>
        </div>

        {/* Button – exactly like CourseCard but with dynamic color */}
        <button
          onClick={onClick}
          className="block w-full mt-4 py-2 text-white text-center text-sm font-semibold rounded-lg transition"
          style={{ backgroundColor: levelColor }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = `${levelColor}dd`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = levelColor;
          }}
        >
          {isCompleted ? 'Review Topic' : 'Start Learning'}
        </button>
      </div>
    </div>
  );
}
// 'use client';

// import { TutorialTopic } from '@/types/topic';
// import { useState } from 'react';

// interface Props {
//   topic: TutorialTopic;
//   isCompleted: boolean;
//   onClick: () => void;
// }

// // Professional muted accents
// const levelThemes: Record<
//   string,
//   {
//     accent: string;
//     badgeBg: string;
//     badgeText: string;
//   }
// > = {
//   Beginner: {
//     accent: '#0F5B45',
//     badgeBg: '#EFFAF6',
//     badgeText: '#0F5B45',
//   },
//   Intermediate: {
//     accent: '#1E4A76',
//     badgeBg: '#EFF4FA',
//     badgeText: '#1E4A76',
//   },
//   Advanced: {
//     accent: '#5E3A8C',
//     badgeBg: '#F5F0FA',
//     badgeText: '#5E3A8C',
//   },
// };

// const defaultTheme = {
//   accent: '#5C6A7A',
//   badgeBg: '#F1F3F5',
//   badgeText: '#5C6A7A',
// };

// export default function TopicCard({ topic, isCompleted, onClick }: Props) {
//   const [isHovered, setIsHovered] = useState(false);
//   const theme = levelThemes[topic.level] || defaultTheme;

//   return (
//     <div
//       className="group relative cursor-pointer transition-all duration-200 ease-out"
//       style={{
//         transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
//       }}
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//       onClick={onClick}
//       role="button"
//       tabIndex={0}
//       onKeyDown={(e) => {
//         if (e.key === 'Enter' || e.key === ' ') {
//           e.preventDefault();
//           onClick();
//         }
//       }}
//     >
//       <div
//         className="relative bg-white rounded-lg overflow-hidden transition-all duration-200"
//         style={{
//           boxShadow: isHovered
//             ? '0 4px 12px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.05)'
//             : '0 1px 2px rgba(0, 0, 0, 0.03), 0 1px 1px rgba(0, 0, 0, 0.02)',
//           border: `1px solid ${isHovered ? theme.accent + '30' : '#EDF2F7'}`,
//         }}
//       >
//         {/* Left accent bar */}
//         <div
//           className="absolute left-0 top-0 bottom-0 w-0.5 transition-all duration-200"
//           style={{
//             backgroundColor: theme.accent,
//             opacity: isHovered ? 0.8 : 0.4,
//           }}
//         />

//         <div className="p-4">
//           <div className="flex items-start gap-3">
//             {/* Emoji container - ensures emoji displays correctly */}
//             <div
//               className="w-9 h-9 rounded-md flex items-center justify-center text-xl flex-shrink-0"
//               style={{
//                 backgroundColor: `${theme.accent}08`,
//                 fontFamily: `system-ui, 'Segoe UI Emoji', 'Apple Color Emoji', sans-serif`,
//               }}
//             >
//               {topic.emoji || '📘'}
//             </div>

//             <div className="flex-1 min-w-0">
//               <div className="flex items-start justify-between gap-2">
//                 <h3
//                   className="font-medium text-gray-800 text-sm leading-tight line-clamp-2 transition-colors"
//                   style={{ color: isHovered ? theme.accent : '#1F2937' }}
//                 >
//                   {topic.title}
//                 </h3>

//                 {/* Arrow icon on hover */}
//                 <div
//                   className="w-6 h-6 rounded flex items-center justify-center transition-all duration-200 flex-shrink-0"
//                   style={{
//                     backgroundColor: isHovered ? `${theme.accent}10` : 'transparent',
//                   }}
//                 >
//                   <span
//                     className="material-icons text-sm transition-all"
//                     style={{ color: isHovered ? theme.accent : '#CBD5E1' }}
//                   >
//                     arrow_forward
//                   </span>
//                 </div>
//               </div>

//               {/* Badges row */}
//               <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
//                 <span
//                   className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
//                   style={{
//                     backgroundColor: theme.badgeBg,
//                     color: theme.badgeText,
//                   }}
//                 >
//                   <span className="text-xs">{topic.level === 'Beginner' ? '🌱' : topic.level === 'Intermediate' ? '⚡' : '🚀'}</span>
//                   {topic.level}
//                 </span>

//                 {topic.estimatedHours && (
//                   <span className="inline-flex items-center gap-0.5 text-xs text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full">
//                     <span className="material-icons text-[10px]">schedule</span>
//                     {topic.estimatedHours} min
//                   </span>
//                 )}

//                 {topic.difficulty && (
//                   <span className="inline-flex items-center gap-0.5 text-xs text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full">
//                     <span className="material-icons text-[10px]">signal_cellular_alt</span>
//                     {topic.difficulty}
//                   </span>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Description */}
//           {topic.description && (
//             <p className="mt-2 text-xs text-gray-500 leading-relaxed line-clamp-2 pl-0">
//               {topic.description}
//             </p>
//           )}

//           {/* Footer with tags and status */}
//           <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-2.5">
//             <div className="flex flex-wrap gap-1">
//               {topic.tags && topic.tags.length > 0 ? (
//                 <>
//                   {topic.tags.slice(0, 2).map((tag, idx) => (
//                     <span
//                       key={idx}
//                       className="text-[11px] text-gray-400 bg-transparent px-1.5 py-0"
//                     >
//                       #{tag}
//                     </span>
//                   ))}
//                   {topic.tags.length > 2 && (
//                     <span className="text-[11px] text-gray-300">+{topic.tags.length - 2}</span>
//                   )}
//                 </>
//               ) : (
//                 <span className="text-[11px] text-gray-300">—</span>
//               )}
//             </div>

//             {isCompleted ? (
//               <div className="flex items-center gap-1">
//                 <span className="material-icons text-xs" style={{ color: theme.accent }}>
//                   check_circle
//                 </span>
//                 <span className="text-[11px] font-medium text-gray-500">Done</span>
//               </div>
//             ) : (
//               <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
//                 <span className="text-[11px] font-medium" style={{ color: theme.accent }}>
//                   Start
//                 </span>
//                 <span className="material-icons text-[13px]" style={{ color: theme.accent }}>
//                   arrow_forward
//                 </span>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
// // 'use client';

// // import { TutorialTopic } from '@/types/topic';
// // import { useState } from 'react';

// // interface Props {
// //   topic: TutorialTopic;
// //   isCompleted: boolean;
// //   onClick: () => void;
// // }

// // const levelThemes: Record<
// //   string,
// //   {
// //     primary: string;
// //     secondary: string;
// //     bg: string;
// //     icon: string;
// //     textColor: string;
// //     gradientFrom: string;
// //     gradientTo: string;
// //   }
// // > = {
// //   Beginner: {
// //     primary: '#059669',
// //     secondary: '#10B981',
// //     bg: '#ECFDF5',
// //     icon: '🌱',
// //     textColor: '#064E3B',
// //     gradientFrom: '#D1FAE5',
// //     gradientTo: '#A7F3D0',
// //   },
// //   Intermediate: {
// //     primary: '#2563EB',
// //     secondary: '#3B82F6',
// //     bg: '#EFF6FF',
// //     icon: '⚡',
// //     textColor: '#1E3A8A',
// //     gradientFrom: '#DBEAFE',
// //     gradientTo: '#BFDBFE',
// //   },
// //   Advanced: {
// //     primary: '#7C3AED',
// //     secondary: '#8B5CF6',
// //     bg: '#F5F3FF',
// //     icon: '🚀',
// //     textColor: '#4C1D95',
// //     gradientFrom: '#EDE9FE',
// //     gradientTo: '#DDD6FE',
// //   },
// // };

// // export default function TopicCard({ topic, isCompleted, onClick }: Props) {
// //   const [isHovered, setIsHovered] = useState(false);

// //   const theme = levelThemes[topic.level] || {
// //     primary: '#4B5563',
// //     secondary: '#6B7280',
// //     bg: '#F9FAFB',
// //     icon: '📚',
// //     textColor: '#1F2937',
// //     gradientFrom: '#F3F4F6',
// //     gradientTo: '#E5E7EB',
// //   };

// //   return (
// //     <div
// //       className="group relative cursor-pointer transition-all duration-300"
// //       style={{
// //         transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
// //       }}
// //       onMouseEnter={() => setIsHovered(true)}
// //       onMouseLeave={() => setIsHovered(false)}
// //       onClick={onClick}
// //     >
// //       {/* Main card with gradient background */}
// //       <div
// //         className="relative rounded-2xl overflow-hidden transition-all duration-300"
// //         style={{
// //           background: `linear-gradient(145deg, ${theme.gradientFrom}40, white)`,
// //           boxShadow: isHovered
// //             ? `0 20px 30px -8px ${theme.primary}30, 0 8px 12px -4px rgb(0 0 0 / 0.05)`
// //             : '0 4px 6px -2px rgb(0 0 0 / 0.05), 0 2px 4px -1px rgb(0 0 0 / 0.03)',
// //           border: `1px solid ${isHovered ? theme.primary + '40' : theme.gradientFrom}`,
// //         }}
// //       >
// //         {/* Decorative top bar */}
// //         <div
// //           className="h-1.5 w-full transition-all duration-300"
// //           style={{
// //             background: `linear-gradient(90deg, ${theme.primary}, ${theme.secondary})`,
// //             opacity: isHovered ? 1 : 0.6,
// //           }}
// //         />

// //         <div className="p-5">
// //           {/* Header with icon and completion ring */}
// //           <div className="flex items-start gap-4">
// //             {/* Icon with completion ring */}
// //             <div className="relative flex-shrink-0">
// //               <div
// //                 className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm transition-all duration-300 group-hover:scale-105"
// //                 style={{
// //                   background: `linear-gradient(135deg, ${theme.gradientFrom}, ${theme.gradientTo})`,
// //                   border: `2px solid ${isHovered ? theme.primary : theme.gradientTo}`,
// //                 }}
// //               >
// //                 {topic.emoji}
// //               </div>
              
// //               {/* Completion indicator - progress ring */}
// //               {isCompleted && (
// //                 <div className="absolute -bottom-1 -right-1">
// //                   <svg width="24" height="24" viewBox="0 0 24 24">
// //                     <circle
// //                       cx="12"
// //                       cy="12"
// //                       r="10"
// //                       fill="white"
// //                       stroke={theme.primary}
// //                       strokeWidth="3"
// //                     />
// //                     <path
// //                       d="M8 12L11 15L16 9"
// //                       stroke="white"
// //                       strokeWidth="2"
// //                       strokeLinecap="round"
// //                       strokeLinejoin="round"
// //                       fill="none"
// //                     />
// //                     <circle
// //                       cx="12"
// //                       cy="12"
// //                       r="10"
// //                       fill="none"
// //                       stroke={theme.primary}
// //                       strokeWidth="3"
// //                       strokeDasharray="63"
// //                       strokeDashoffset="0"
// //                       className="transition-all duration-700"
// //                     />
// //                   </svg>
// //                 </div>
// //               )}
// //             </div>

// //             {/* Title and action area */}
// //             <div className="flex-1 min-w-0">
// //               <div className="flex items-start justify-between gap-2">
// //                 <h3
// //                   className="font-bold text-gray-900 text-lg leading-tight line-clamp-2 transition-colors duration-200"
// //                   style={{ color: isHovered ? theme.primary : '#111827' }}
// //                 >
// //                   {topic.title}
// //                 </h3>

// //                 {/* Animated arrow button */}
// //                 <div
// //                   className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 flex-shrink-0"
// //                   style={{
// //                     backgroundColor: isHovered ? theme.primary : `${theme.primary}10`,
// //                     transform: isHovered ? 'translateX(3px)' : 'none',
// //                     boxShadow: isHovered ? `0 4px 8px -2px ${theme.primary}40` : 'none',
// //                   }}
// //                 >
// //                   <span
// //                     className="material-icons text-xl transition-all duration-300"
// //                     style={{ color: isHovered ? 'white' : theme.primary }}
// //                   >
// //                     {isHovered ? 'arrow_forward' : 'chevron_right'}
// //                   </span>
// //                 </div>
// //               </div>

// //               {/* Level badge with icon */}
// //               <div className="flex flex-wrap items-center gap-2 mt-2">
// //                 <span
// //                   className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold shadow-sm"
// //                   style={{
// //                     backgroundColor: theme.bg,
// //                     color: theme.textColor,
// //                     border: `1px solid ${theme.gradientTo}`,
// //                   }}
// //                 >
// //                   <span className="text-base">{theme.icon}</span>
// //                   {topic.level}
// //                 </span>

// //                 {topic.estimatedHours && (
// //                   <span className="inline-flex items-center gap-1 text-xs text-gray-600 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
// //                     <span className="material-icons text-sm">schedule</span>
// //                     {topic.estimatedHours} min
// //                   </span>
// //                 )}

// //                 {topic.difficulty && (
// //                   <span className="inline-flex items-center gap-1 text-xs text-gray-600 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
// //                     <span className="material-icons text-sm">signal_cellular_alt</span>
// //                     {topic.difficulty}
// //                   </span>
// //                 )}
// //               </div>
// //             </div>
// //           </div>

// //           {/* Description with subtle background */}
// //           {topic.description && (
// //             <div className="mt-4 p-3 rounded-xl bg-white/60 backdrop-blur-sm">
// //               <p className="text-sm text-gray-700 leading-relaxed line-clamp-2">
// //                 {topic.description}
// //               </p>
// //             </div>
// //           )}

// //           {/* Tags and progress footer */}
// //           <div className="mt-4 flex items-center justify-between">
// //             {/* Tags */}
// //             <div className="flex flex-wrap gap-1.5">
// //               {topic.tags && topic.tags.length > 0 ? (
// //                 <>
// //                   {topic.tags.slice(0, 3).map((tag, idx) => (
// //                     <span
// //                       key={idx}
// //                       className="text-xs font-medium px-2.5 py-1 rounded-full transition-all hover:scale-105"
// //                       style={{
// //                         backgroundColor: `${theme.primary}10`,
// //                         color: theme.textColor,
// //                       }}
// //                     >
// //                       #{tag}
// //                     </span>
// //                   ))}
// //                   {topic.tags.length > 3 && (
// //                     <span className="text-xs text-gray-500 px-2 py-1">
// //                       +{topic.tags.length - 3}
// //                     </span>
// //                   )}
// //                 </>
// //               ) : (
// //                 <span className="text-xs text-gray-400 italic">No tags</span>
// //               )}
              
// //             </div>

// //             {/* Progress or start learning indicator */}
// //             {isCompleted ? (
// //               <div className="flex items-center gap-1.5">
// //                 <span className="material-icons text-sm" style={{ color: theme.primary }}>
// //                   task_alt
// //                 </span>
// //                 <span className="text-xs font-medium" style={{ color: theme.primary }}>
// //                   Completed
// //                 </span>
// //               </div>
// //             ) : (
// //               <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
// //                 <span className="text-xs font-medium" style={{ color: theme.primary }}>
// //                   Start Learning
// //                 </span>
// //                 <span className="material-icons text-sm" style={{ color: theme.primary }}>
// //                   play_arrow
// //                 </span>
// //               </div>
// //             )}
// //           </div>
// //         </div>

// //         {/* Hover overlay gradient */}
// //         <div
// //           className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
// //           style={{
// //             background: `radial-gradient(circle at 30% 20%, ${theme.primary}08, transparent 70%)`,
// //           }}
// //         />
// //       </div>
// //     </div>
// //   );
// // }