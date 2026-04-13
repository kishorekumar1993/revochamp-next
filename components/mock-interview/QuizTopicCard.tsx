'use client';

import { MockTutorialTopic } from "@/lib/mockInterview";

interface Props {
  topic: MockTutorialTopic;
  isCompleted: boolean;
  onClick: () => void;
}

const levelThemes: Record<string, { primary: string; icon: string }> = {
  Beginner: { primary: '#10B981', icon: '🌱' },
  Intermediate: { primary: '#3B82F6', icon: '⚡' },
  Advanced: { primary: '#8B5CF6', icon: '🚀' },
};

export default function QuizTopicCard({ topic, isCompleted, onClick }: Props) {
  const theme = levelThemes[topic.level] || { primary: '#6B7280', icon: '📚' };
  
  return (
    <button
      onClick={onClick}
      className="group relative bg-white border border-light-gray rounded-2xl p-4 text-left transition-all hover:shadow-lg hover:border-orange-300 hover:-translate-y-0.5"
    >
      {/* Decorative corner */}
      <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-bl from-orange-100/50 to-transparent rounded-tr-2xl rounded-bl-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="flex items-start gap-4">
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shadow-md"
          style={{ background: `linear-gradient(135deg, ${theme.primary}20, ${theme.primary}05)` }}
        >
          {topic.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-text-dark truncate">{topic.title}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
              style={{ backgroundColor: `${theme.primary}15`, color: theme.primary }}
            >
              <span>{theme.icon}</span>
              <span>{topic.level}</span>
            </span>
            {topic.estimatedHours && (
              <span className="text-xs text-text-muted flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {Math.round(topic.estimatedHours)}h
              </span>
            )}
          </div>
        </div>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
          isCompleted ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400 group-hover:bg-orange-100 group-hover:text-orange-600'
        }`}>
          {isCompleted ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )}
        </div>
      </div>
      
      {/* Completion indicator line */}
      {isCompleted && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-green-600 rounded-b-2xl" />
      )}
    </button>
  );
}

// 'use client';

// import { MockTutorialTopic } from "@/lib/mockInterview";

// interface Props {
//   topic: MockTutorialTopic;
//   isCompleted: boolean;
//   onClick: () => void;
// }

// const levelThemes: Record<string, { primary: string; icon: string }> = {
//   Beginner: { primary: '#10B981', icon: '🌱' },
//   Intermediate: { primary: '#3B82F6', icon: '⚡' },
//   Advanced: { primary: '#8B5CF6', icon: '🚀' },
// };

// export default function QuizTopicCard({ topic, isCompleted, onClick }: Props) {
//   const theme = levelThemes[topic.level] || { primary: '#6B7280', icon: '📚' };
  
//   return (
//     <button
//       onClick={onClick}
//       className="group relative bg-white border border-light-gray rounded-2xl p-4 text-left transition-all hover:shadow-lg hover:border-orange-300 hover:-translate-y-0.5"
//     >
//       {/* Decorative corner */}
//       <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-bl from-orange-100/50 to-transparent rounded-tr-2xl rounded-bl-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
      
//       <div className="flex items-start gap-4">
//         <div
//           className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shadow-md"
//           style={{ background: `linear-gradient(135deg, ${theme.primary}20, ${theme.primary}05)` }}
//         >
//           {topic.emoji}
//         </div>
//         <div className="flex-1 min-w-0">
//           <h3 className="font-bold text-text-dark truncate">{topic.title}</h3>
//           <div className="flex items-center gap-2 mt-1">
//             <span
//               className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
//               style={{ backgroundColor: `${theme.primary}15`, color: theme.primary }}
//             >
//               <span>{theme.icon}</span>
//               <span>{topic.level}</span>
//             </span>
//             {topic.estimatedHours && (
//               <span className="text-xs text-text-muted flex items-center gap-1">
//                 <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//                 {Math.round(topic.estimatedHours)}h
//               </span>
//             )}
//           </div>
//         </div>
//         <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
//           isCompleted ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400 group-hover:bg-orange-100 group-hover:text-orange-600'
//         }`}>
//           {isCompleted ? (
//             <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//               <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//             </svg>
//           ) : (
//             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//             </svg>
//           )}
//         </div>
//       </div>
      
//       {/* Completion indicator line */}
//       {isCompleted && (
//         <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-green-600 rounded-b-2xl" />
//       )}
//     </button>
//   );
// }