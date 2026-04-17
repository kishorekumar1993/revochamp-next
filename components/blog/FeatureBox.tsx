// components/blog/FeatureBox.tsx
"use client";

import ReactMarkdown from "react-markdown";

export function FeatureBox({ text }: { text: string }) {
  return (
    <div className="rounded-2xl overflow-hidden shadow-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="border-l-4 border-blue-600 p-6 lg:p-8">
        <div className="flex gap-4">
          <div className="text-3xl mt-1">⭐</div>
          <div className="flex-1">
            <div className="prose prose-sm max-w-none [&_strong]:text-blue-700 [&_em]:text-blue-600">
              <ReactMarkdown>{text}</ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// // components/blog/FeatureBox.tsx
// "use client";

// import { ReactNode } from "react";

// interface FeatureBoxProps {
//   text?: string;
//   title?: string;
//   icon?: ReactNode;
// }

// export function FeatureBox({ text, title, icon }: FeatureBoxProps) {
//   if (!text || typeof text !== "string") return null;

//   // Split into lines for processing
//   const lines = text.split("\n");
//   let extractedTitle: string | null = null;
//   let content = text;

//   // Check if first line starts with ** and ends with ** or contains ** ... **:
//   const firstLine = lines[0]?.trim();
//   const boldMatch = firstLine?.match(/^\*\*(.+?)\*\*(?::\s*)?(.*)$/);
//   if (boldMatch) {
//     // Title is the bold part, remove colon if present
//     extractedTitle = boldMatch[1].replace(/:$/, "").trim();
//     // The rest of first line becomes part of content
//     const restOfFirstLine = boldMatch[2].trim();
//     const remainingLines = lines.slice(1).join("\n").trim();
//     content = restOfFirstLine + (remainingLines ? "\n" + remainingLines : "");
//   }

//   const displayTitle = title ?? extractedTitle;

//   return (
//     <div className="my-12">
//       <div className="relative bg-[#FDFBF7] border border-[#E6E2DB] rounded-sm shadow-sm">
//         {/* Top accent line */}
//         <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#C8401E]" />

//         <div className="p-6 md:p-7">
//           {/* Header */}
//           <div className="flex items-start gap-3 mb-5">
//             {icon && (
//               <div className="flex-shrink-0 mt-0.5 text-2xl text-[#C8401E]">
//                 {icon}
//               </div>
//             )}
//             {displayTitle && (
//               <div>
//                 <h3 className="font-serif text-xl md:text-2xl font-bold text-[#1A1816] tracking-tight leading-tight">
//                   {displayTitle}
//                 </h3>
//                 <div className="w-10 h-px bg-[#C8401E] mt-2" />
//               </div>
//             )}
//           </div>

//           {/* Content */}
//           <div className="prose prose-sm max-w-none text-[#3A3732] leading-relaxed">
//             <ContentParser content={content} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// function ContentParser({ content }: { content: string }) {
//   const lines = content.split("\n");
//   const elements: ReactNode[] = [];

//   const processInline = (text: string) => {
//     // Match **bold** and *italic*
//     const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
//     return parts.map((part, idx) => {
//       if (part.startsWith("**") && part.endsWith("**")) {
//         return (
//           <strong key={idx} className="font-semibold text-[#C8401E]">
//             {part.slice(2, -2)}
//           </strong>
//         );
//       }
//       if (part.startsWith("*") && part.endsWith("*")) {
//         return (
//           <em key={idx} className="italic text-[#6B6760]">
//             {part.slice(1, -1)}
//           </em>
//         );
//       }
//       return part;
//     });
//   };

//   let i = 0;
//   while (i < lines.length) {
//     const line = lines[i].trim();
//     if (line === "") {
//       elements.push(<div key={`space-${i}`} className="h-3" />);
//       i++;
//       continue;
//     }

//     // Bullet point
//     if (line.startsWith("- ") || line.startsWith("• ")) {
//       const bulletText = line.slice(2);
//       elements.push(
//         <div key={`bullet-${i}`} className="flex gap-3 my-1.5">
//           <span className="text-[#C8401E] select-none text-base leading-6">•</span>
//           <div className="flex-1 text-[#3A3732] leading-relaxed">
//             {processInline(bulletText)}
//           </div>
//         </div>
//       );
//       i++;
//       continue;
//     }

//     // Subheading: **Something** (standalone or with trailing)
//     const subMatch = line.match(/^\*\*(.+?)\*\*(.*)$/);
//     if (subMatch) {
//       const boldText = subMatch[1];
//       const rest = subMatch[2].trim();
//       elements.push(
//         <div key={`subhead-${i}`} className="mt-4 mb-1">
//           <span className="font-bold text-[#1A1816] text-base border-l-2 border-[#C8401E] pl-2">
//             {boldText}
//           </span>
//           {rest && (
//             <span className="ml-1 text-[#3A3732]">{processInline(rest)}</span>
//           )}
//         </div>
//       );
//       i++;
//       continue;
//     }

//     // Section heading ending with colon (short line)
//     if (line.endsWith(":") && line.length < 60 && !line.includes("**")) {
//       elements.push(
//         <h4 key={`heading-${i}`} className="font-semibold text-[#1A1816] text-sm uppercase tracking-wide mt-4 mb-1">
//           {processInline(line)}
//         </h4>
//       );
//       i++;
//       continue;
//     }

//     // Regular paragraph
//     elements.push(
//       <p key={`para-${i}`} className="my-2 leading-relaxed text-[#3A3732]">
//         {processInline(line)}
//       </p>
//     );
//     i++;
//   }

//   return <div className="space-y-1">{elements}</div>;
// }