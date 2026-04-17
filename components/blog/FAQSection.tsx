'use client';

import { useState, useRef } from 'react';
import { Plus, Minus, Search, MessageCircle } from 'lucide-react';

interface FAQ {
  question: string;
  answer: string;
}

export function BlogFAQ({ faqs }: { faqs: FAQ[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="max-w-4xl mx-auto px-6 py-20 font-sans">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">
            Common Queries<span className="text-blue-600">.</span>
          </h2>
          <p className="mt-2 text-slate-500 text-lg">
            Quick tips and deep dives for this tutorial.
          </p>
        </div>
        
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <input 
            type="text"
            placeholder="Search questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all w-full md:w-64"
          />
        </div>
      </div>

      {/* FAQ List */}
      <div className="divide-y divide-slate-100 border-t border-slate-100">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq, idx) => (
            <FAQItem 
              key={idx}
              faq={faq}
              isOpen={openIndex === idx}
              toggle={() => setOpenIndex(openIndex === idx ? null : idx)}
            />
          ))
        ) : (
          <p className="py-10 text-center text-slate-400">No results found for "{searchTerm}"</p>
        )}
      </div>

      {/* Support Footer */}
      <div className="mt-12 p-8 bg-slate-900 rounded-3xl text-center text-white relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-xl font-bold">Still stuck?</h3>
          <p className="text-slate-400 mt-1 mb-6">Drop a comment or reach out directly.</p>
          <button className="inline-flex items-center gap-2 bg-white text-slate-900 px-6 py-2.5 rounded-full font-semibold hover:bg-blue-50 transition-colors">
            <MessageCircle className="w-4 h-4" />
            Ask a Question
          </button>
        </div>
        {/* Decorative background blur */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/20 blur-[80px]" />
      </div>
    </section>
  );
}

function FAQItem({ faq, isOpen, toggle }: { faq: FAQ; isOpen: boolean; toggle: () => void }) {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div className={`py-2 transition-colors ${isOpen ? 'bg-slate-50/50' : ''}`}>
      <button
        onClick={toggle}
        className="w-full flex items-start gap-4 px-4 py-6 text-left group"
      >
        <span className="mt-1 flex-shrink-0">
          {isOpen ? (
            <Minus className="w-5 h-5 text-blue-600" />
          ) : (
            <Plus className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
          )}
        </span>
        <span className={`text-lg font-bold transition-colors ${isOpen ? 'text-blue-600' : 'text-slate-800'}`}>
          {faq.question}
        </span>
      </button>

      <div
        style={{
          maxHeight: isOpen ? contentRef.current?.scrollHeight : 0,
          opacity: isOpen ? 1 : 0,
        }}
        className="overflow-hidden transition-all duration-300 ease-in-out"
      >
        <div ref={contentRef} className="pl-13 pr-6 pb-8 ml-9 text-slate-600 leading-relaxed text-[16px]">
          {faq.answer.split('\n').map((p, i) => (
            <p key={i} className={i !== 0 ? 'mt-3' : ''}>{p}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

// 'use client';

// import { useState, useRef, useEffect } from 'react';
// import { ChevronDown, Plus } from 'lucide-react';

// interface FAQ {
//   question: string;
//   answer: string;
// }

// export function FAQSection({ faqs }: { faqs: FAQ[] }) {
//   const [openIndex, setOpenIndex] = useState<number | null>(0);

//   return (
//     <section className="mt-20 max-w-3xl mx-auto px-6 mb-20">
//       <div className="text-center mb-12">
//         <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
//           Common Questions
//         </h2>
//         <p className="mt-4 text-lg text-slate-600">
//           Everything you need to know about our process and platform.
//         </p>
//       </div>

//       <div className="space-y-3">
//         {faqs.map((faq, idx) => (
//           <AccordionItem
//             key={idx}
//             faq={faq}
//             isOpen={openIndex === idx}
//             onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
//           />
//         ))}
//       </div>
//     </section>
//   );
// }

// function AccordionItem({ faq, isOpen, onClick }: { faq: FAQ; isOpen: boolean; onClick: () => void }) {
//   const contentRef = useRef<HTMLDivElement>(null);
//   const [height, setHeight] = useState<string | number>(0);

//   useEffect(() => {
//     if (isOpen) {
//       const content = contentRef.current;
//       if (content) setHeight(content.scrollHeight);
//     } else {
//       setHeight(0);
//     }
//   }, [isOpen]);

//   return (
//     <div 
//       className={`group border rounded-xl transition-all duration-300 ${
//         isOpen 
//           ? 'border-blue-200 bg-blue-50/30 shadow-sm' 
//           : 'border-slate-200 bg-white hover:border-slate-300'
//       }`}
//     >
//       <button
//         onClick={onClick}
//         aria-expanded={isOpen}
//         className="w-full flex justify-between items-center text-left px-6 py-5 focus:outline-none"
//       >
//         <span className={`text-[16px] font-semibold transition-colors duration-200 ${
//           isOpen ? 'text-blue-700' : 'text-slate-800'
//         }`}>
//           {faq.question}
//         </span>
//         <div className={`flex-shrink-0 ml-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
//           <ChevronDown className={`w-5 h-5 ${isOpen ? 'text-blue-600' : 'text-slate-400'}`} />
//         </div>
//       </button>

//       <div
//         style={{ maxHeight: height }}
//         className="overflow-hidden transition-[max-height] duration-300 ease-in-out"
//       >
//         <div ref={contentRef} className="px-6 pb-5">
//           <div className="h-px w-full bg-slate-100 mb-4" /> {/* Subtle separator */}
//           <div className="space-y-3">
//             {faq.answer.split('\n').map((para, i) => (
//               <p key={i} className="text-[15px] text-slate-600 leading-relaxed">
//                 {para}
//               </p>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // 'use client';

// // import { useState, useRef } from 'react';
// // import { ChevronDown } from 'lucide-react';

// // interface FAQItem {
// //   question: string;
// //   answer: string;
// // }

// // export function FAQSection({ faqs }: { faqs: FAQItem[] }) {
// //   const [openIndex, setOpenIndex] = useState<number | null>(0);
// //   const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

// //   const toggle = (index: number) => {
// //     setOpenIndex(openIndex === index ? null : index);
// //   };

// //   return (
// //     <section className="mt-16 max-w-3xl mx-auto px-4">
// //       <div className="mb-8">
// //         <h2 className="text-[22px] font-semibold text-[#111]">
// //           Frequently Asked Questions
// //         </h2>
// //         <p className="text-sm text-[#777] mt-1">
// //           Clear answers to help you understand better
// //         </p>
// //       </div>

// //       <div className="space-y-4">
// //         {faqs.map((faq, idx) => {
// //           const isOpen = openIndex === idx;

// //           return (
// //             <div
// //               key={idx}
// //               className="bg-white border border-[#f0f0f0] rounded-lg transition-all duration-200 hover:border-[#e6e6e6]"
// //             >
// //               <button
// //                 onClick={() => toggle(idx)}
// //                 className="w-full flex justify-between items-start text-left px-5 py-4"
// //               >
// //                 <span className="text-[15px] font-medium text-[#222] leading-6">
// //                   {faq.question}
// //                 </span>
// //                 <ChevronDown
// //                   className={`w-4 h-4 mt-1 ml-3 transition-transform duration-200 ${
// //                     isOpen ? 'rotate-180 text-[#111]' : 'text-[#bbb]'
// //                   }`}
// //                 />
// //               </button>

// //               <div
// //                 ref={(el) => {
// //                   contentRefs.current[idx] = el; // void return – no explicit return
// //                 }}
// //                 style={{
// //                   maxHeight: isOpen
// //                     ? contentRefs.current[idx]?.scrollHeight
// //                     : 0,
// //                 }}
// //                 className="overflow-hidden transition-all duration-300 ease-in-out"
// //               >
// //                 <div className="px-5 pb-4 text-[14px] text-[#555] leading-6">
// //                   {faq.answer.split('\n').map((para, i) => (
// //                     <p key={i} className="mb-2 last:mb-0">
// //                       {para}
// //                     </p>
// //                   ))}
// //                 </div>
// //               </div>
// //             </div>
// //           );
// //         })}
// //       </div>
// //     </section>
// //   );
// // }

