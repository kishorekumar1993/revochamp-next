'use client';

import { TutorialTopic } from '@/types/topic';
import { Play, ChevronRight } from 'lucide-react'; // Better than material-icons for React

interface Props {
  topic: TutorialTopic;
  onClick: () => void;
}

export default function TopicContinueBanner({ topic, onClick }: Props) {
  return (
    <div className="container mx-auto px-4 mb-8">
      <button
        onClick={onClick}
        className="w-full text-left group relative overflow-hidden bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl p-4 md:p-6 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-900/5 hover:-translate-y-0.5 active:scale-[0.98]"
      >
        {/* Subtle Decorative Background Element */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-32 h-32 bg-emerald-200/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-4 md:gap-6">
          {/* Icon Container */}
          <div className="relative flex-shrink-0">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200 group-hover:rotate-12 transition-transform duration-300">
              <Play className="w-6 h-6 text-white fill-white" />
            </div>
          </div>

          {/* Text Content */}
          <div className="flex-1 min-w-0">
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-emerald-600 mb-1 block">
              Resume Learning
            </span>
            <h4 className="text-base md:text-lg font-bold text-gray-900 truncate leading-tight">
              {topic.title}
            </h4>
            <p className="text-sm text-gray-500 mt-1 hidden md:block">
              You're doing great! Pick up right where you left off.
            </p>
          </div>

          {/* Action Icon */}
          <div className="flex-shrink-0 bg-white p-2 rounded-full shadow-sm border border-emerald-50 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300">
            <ChevronRight className="w-5 h-5" />
          </div>
        </div>
      </button>
    </div>
  );
}

// 'use client';

// import { TutorialTopic } from '@/types/topic';

// interface Props {
//   topic: TutorialTopic;
//   onClick: () => void;
// }

// export default function TopicContinueBanner({ topic, onClick }: Props) {
//   return (
//     <div className="container" style={{ marginBottom: '24px' }}>
//       <div
//         role="button"
//         tabIndex={0}
//         onClick={onClick}
//         onKeyDown={(e) => {
//           if (e.key === 'Enter' || e.key === ' ') {
//             e.preventDefault();
//             onClick();
//           }
//         }}
//         className="hover:shadow-md"
//         style={{
//           background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
//           border: '1.5px solid #10B98140',
//           borderRadius: '16px',
//           padding: '16px 20px',
//           cursor: 'pointer',
//           transition: 'all 0.2s ease',
//         }}
//       >
//         <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
//           <div
//             style={{
//               width: '48px',
//               height: '48px',
//               borderRadius: '50%',
//               background: 'linear-gradient(135deg, #11998E, #38EF7D)',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               boxShadow: '0 4px 12px #11998E40',
//             }}
//           >
//             <span className="material-icons" aria-hidden="true" style={{ color: 'white' }}>
//               play_arrow
//             </span>
//           </div>
//           <div style={{ flex: 1 }}>
//             <h4 style={{ fontWeight: 700, marginBottom: '4px' }}>Continue: {topic.title}</h4>
//             <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
//               Tap to resume where you left off
//             </p>
//           </div>
//           <span className="material-icons" aria-hidden="true" style={{ color: '#10B981' }}>
//             arrow_forward
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// }