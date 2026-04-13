'use client';

import { useState, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

export function FAQSection({ faqs }: { faqs: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="mt-16 max-w-3xl mx-auto px-4">
      <div className="mb-8">
        <h2 className="text-[22px] font-semibold text-[#111]">
          Frequently Asked Questions
        </h2>
        <p className="text-sm text-[#777] mt-1">
          Clear answers to help you understand better
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;

          return (
            <div
              key={idx}
              className="bg-white border border-[#f0f0f0] rounded-lg transition-all duration-200 hover:border-[#e6e6e6]"
            >
              <button
                onClick={() => toggle(idx)}
                className="w-full flex justify-between items-start text-left px-5 py-4"
              >
                <span className="text-[15px] font-medium text-[#222] leading-6">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-4 h-4 mt-1 ml-3 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-[#111]' : 'text-[#bbb]'
                  }`}
                />
              </button>

              <div
                ref={(el) => {
                  contentRefs.current[idx] = el; // void return – no explicit return
                }}
                style={{
                  maxHeight: isOpen
                    ? contentRefs.current[idx]?.scrollHeight
                    : 0,
                }}
                className="overflow-hidden transition-all duration-300 ease-in-out"
              >
                <div className="px-5 pb-4 text-[14px] text-[#555] leading-6">
                  {faq.answer.split('\n').map((para, i) => (
                    <p key={i} className="mb-2 last:mb-0">
                      {para}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}


// 'use client';

// import { useState, useRef } from 'react';
// import { ChevronDown } from 'lucide-react';

// interface FAQItem {
//   question: string;
//   answer: string;
// }

// export function FAQSection({ faqs }: { faqs: FAQItem[] }) {
//   const [openIndex, setOpenIndex] = useState<number | null>(0);
//   const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

//   const toggle = (index: number) => {
//     setOpenIndex(openIndex === index ? null : index);
//   };

//   return (
//     <section className="mt-16 max-w-3xl mx-auto px-4">
//       {/* Header */}
//       <div className="mb-8">
//         <h2 className="text-[22px] font-semibold text-[#111]">
//           Frequently Asked Questions
//         </h2>
//         <p className="text-sm text-[#777] mt-1">
//           Clear answers to help you understand better
//         </p>
//       </div>

//       {/* FAQ List */}
//       <div className="space-y-4">
//         {faqs.map((faq, idx) => {
//           const isOpen = openIndex === idx;

//           return (
//             <div
//               key={idx}
//               className="bg-white border border-[#f0f0f0] rounded-lg transition-all duration-200 hover:border-[#e6e6e6]"
//             >
//               {/* Question */}
//               <button
//                 onClick={() => toggle(idx)}
//                 className="w-full flex justify-between items-start text-left px-5 py-4"
//               >
//                 <span className="text-[15px] font-medium text-[#222] leading-6">
//                   {faq.question}
//                 </span>

//                 <ChevronDown
//                   className={`w-4 h-4 mt-1 ml-3 transition-transform duration-200 ${
//                     isOpen ? 'rotate-180 text-[#111]' : 'text-[#bbb]'
//                   }`}
//                 />
//               </button>

//               {/* Answer */}
//               <div
//                 ref={(el) => (contentRefs.current[idx] = el)}
//                 style={{
//                   maxHeight: isOpen
//                     ? contentRefs.current[idx]?.scrollHeight
//                     : 0,
//                 }}
//                 className="overflow-hidden transition-all duration-300 ease-in-out"
//               >
//                 <div className="px-5 pb-4 text-[14px] text-[#555] leading-6">
//                   {faq.answer.split('\n').map((para, i) => (
//                     <p key={i} className="mb-2 last:mb-0">
//                       {para}
//                     </p>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </section>
//   );
// }
