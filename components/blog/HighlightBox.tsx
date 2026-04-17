// // components/blog/HighlightBox.tsx
// "use client";

// import ReactMarkdown from "react-markdown";

// export function HighlightBox({ text }: { text: string }) {
//   // Fix 1: Replace any broken Unicode replacement character (� or \uFFFD) with 📌
//   const fixedText = text.replace(/[\uFFFD�]/g, "📌");
  
//   const lines = fixedText.split(/\r?\n/).filter(line => line.trim().length > 0);

//   // Check if this looks like a list (at least 2 lines, each starting with a bullet or emoji)
//   const isList = lines.length > 1 && lines.every(line => 
//     /^[\s]*[📌🔹🔸▪️➡️▶️•\-*]/.test(line)
//   );

//   if (isList) {
//     return (
//       <div className="rounded-2xl overflow-hidden shadow-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50">
//         <div className="border-l-4 border-amber-600 p-5 lg:p-6">
//           <div className="space-y-2">
//             {lines.map((line, idx) => {
//               // Extract the bullet (emoji or symbol) and the content
//               let match = line.match(/^[\s]*([📌🔹🔸▪️➡️▶️•\-*])\s*(.*)/);
//               if (!match) {
//                 // If no bullet found, treat whole line as content and use default bullet
//                 return (
//                   <div key={idx} className="flex gap-2">
//                     {/* <span className="text-amber-700 text-base leading-snug flex-shrink-0">📌</span> */}
//                     <div className="text-amber-900 text-sm leading-relaxed">
//                       <ReactMarkdown
//                         components={{
//                           p: ({ children }) => <>{children}</>,
//                           strong: ({ children }) => <strong className="font-semibold text-amber-900">{children}</strong>,
//                         }}
//                       >
//                         {line.trim()}
//                       </ReactMarkdown>
//                     </div>
//                   </div>
//                 );
//               }
//               const [, bullet, content] = match;
//               return (
//                 <div key={idx} className="flex gap-2">
//                   <div className="text-amber-900 text-sm leading-relaxed">
//                     <ReactMarkdown
//                       components={{
//                         p: ({ children }) => <>{children}</>,
//                         strong: ({ children }) => <strong className="font-semibold text-amber-900">{children}</strong>,
//                       }}
//                     >
//                       {content}
//                     </ReactMarkdown>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Plain text (single line or no bullets) – render as normal markdown
//   return (
//     <div className="rounded-2xl overflow-hidden shadow-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50">
//       <div className="border-l-4 border-amber-600 p-5 lg:p-6">
//         <div className="prose prose-sm max-w-none text-amber-900">
//           <ReactMarkdown>{fixedText}</ReactMarkdown>
//         </div>
//       </div>
//     </div>
//   );
// }

// components/blog/HighlightBox.tsx
"use client";

import ReactMarkdown from "react-markdown";

export function HighlightBox({ text }: { text: string }) {
  const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
  
  // Detect if content is a list: at least 2 lines and each line starts with a bullet/emoji/number
  const isList = lines.length > 1 && lines.every(line => 
    /^[\s]*[📌🔹🔸▪️➡️▶️•\-\*\d+\.\s]/.test(line)
  );

  // If it's a list, render as a clean bullet list (no extra 📌 icon)
  if (isList) {
    return (
      <div className="rounded-2xl overflow-hidden shadow-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50">
        <div className="border-l-4 border-amber-600 p-5 lg:p-6">
          <div className="flex gap-3">
            <div className="text-amber-700 text-lg leading-tight">📌</div>
            <div className="flex-1">
              {lines.map((line, idx) => {
                // Remove leading bullet/emoji
                const cleanLine = line.replace(/^[\s]*[📌🔹🔸▪️➡️▶️•\-\*\d+\.\s]+/, "");
                return (
                  <div key={idx} className="flex gap-2 mb-2 last:mb-0">
                    <span className="text-amber-600 text-base leading-tight">•</span>
                    <div className="text-amber-900 text-sm leading-relaxed">
                      <ReactMarkdown components={{ p: ({ children }) => <>{children}</> }}>
                        {cleanLine}
                      </ReactMarkdown>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Otherwise, render as normal markdown (no extra bullets, no static 📌)
  return (
    <div className="rounded-2xl overflow-hidden shadow-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50">
      <div className="border-l-4 border-amber-600 p-5 lg:p-6">
        <div className="prose prose-sm max-w-none text-amber-900">
          <ReactMarkdown>{text}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
// // // components/blog/HighlightBox.tsx
// // "use client";

// // import ReactMarkdown from "react-markdown";

// // export function HighlightBox({ text }: { text: string }) {
// //   return (
// //     <div className="rounded-2xl overflow-hidden shadow-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50">
// //       <div className="border-l-4 border-amber-600 p-6 lg:p-8">
// //         <div className="flex gap-4">
// //           <div className="text-3xl mt-1">📌</div>
// //           <div className="flex-1">
// //             <div className="prose prose-sm max-w-none text-amber-900 [&_strong]:text-amber-800 [&_em]:text-amber-700">
// //               <ReactMarkdown>{text}</ReactMarkdown>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }
