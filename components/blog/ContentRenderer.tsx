// components/blog/ContentRenderer.tsx
"use client";

import Image from "next/image";
import { ContentItem, ContentType } from "@/types/blog-detail";
import { FeatureBox } from "./FeatureBox";
import { TipSection } from "./Tips";
import { FeatureList } from "./BlogList";
import { HighlightBox } from "./HighlightBox";
import PremiumStatCard from "./PremiumStatCard";
import ReactMarkdown from "react-markdown";

export function ContentRenderer({ items }: { items: ContentItem[] }) {
  return (
    <div className="space-y-8">
      {items.map((item, idx) => {
        const key = `${item.type}-${idx}`;

        switch (item.type) {
          case ContentType.heading: {
            const id = slugify(item.value);
            return (
              <div key={key} id={id} className="scroll-mt-24">
                <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 leading-tight">
                  {item.value}
                </h2>
                <div className="h-1 w-12 bg-gradient-to-r from-blue-600 to-purple-600 mt-4 rounded-full" />
              </div>
            );
          }

          case ContentType.text:
            return (
          <div key={key} className="text-base lg:text-lg leading-relaxed lg:leading-8 text-slate-700 max-w-3xl">
      <ReactMarkdown
        components={{
          p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
          ul: ({ children }) => <ul className="list-disc pl-6 my-3 space-y-1">{children}</ul>,
          li: ({ children }) => <li className="text-slate-700">{children}</li>,
          strong: ({ children }) => <strong className="font-semibold text-slate-900">{children}</strong>,
        }}
      >
        {item.value}
      </ReactMarkdown>
    </div>   );

          case ContentType.code:
            return (
              <div key={key} className="rounded-xl overflow-hidden shadow-lg">
                <div className="bg-slate-900 px-6 py-4 border-b border-slate-800">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    {item.language || "Code"}
                  </p>
                </div>
                <pre className="bg-slate-950 text-slate-100 p-6 overflow-x-auto text-sm leading-relaxed">
                  <code>{item.value}</code>
                </pre>
              </div>
            );

          case ContentType.list:
            return <FeatureList key={key} raw={item.value} />;

          case ContentType.image:
            return (
              <figure key={key} className="my-8">
                <div className="rounded-2xl overflow-hidden shadow-xl shadow-slate-900/10">
                  <div className="relative h-96 lg:h-[500px] w-full bg-slate-200">
                    <Image
                      src={item.imageUrl || ""}
                      alt={item.caption || "Blog image"}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 768px, 800px"
                    />
                  </div>
                </div>
                {item.caption && (
                  <figcaption className="text-sm text-slate-600 text-center mt-4 leading-relaxed">
                    {item.caption}
                  </figcaption>
                )}
              </figure>
            );

          case ContentType.table:
            if (!item.headers || !item.rows) return null;
            return (
              <div key={key} className="overflow-x-auto rounded-xl shadow-lg">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-slate-100 to-slate-50 border-b border-slate-200">
                      {item.headers.map((header, i) => (
                        <th
                          key={i}
                          className="px-6 py-4 text-left text-sm font-bold text-slate-900"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {item.rows.map((row, i) => (
                      <tr
                        key={i}
                        className="border-b border-slate-200 hover:bg-slate-50 transition-colors"
                      >
                        {row.map((cell, j) => (
                          <td key={j} className="px-6 py-4 text-sm text-slate-700">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );

          case ContentType.highlight:
            return <HighlightBox key={key} text={item.value} />;

          case ContentType.tip:
            return <TipSection key={key} value={item.value} />;

          case ContentType.warning:
            return (
              <div
                key={key}
                className="rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-6 shadow-lg shadow-amber-900/10"
              >
                <div className="flex gap-4">
                  <div className="text-2xl">⚠️</div>
                  <div className="flex-1">
                    <p className="font-bold text-amber-950 mb-2">Warning</p>
                    <p className="text-sm text-amber-900 leading-relaxed">
                      {item.value}
                    </p>
                  </div>
                </div>
              </div>
            );

          case ContentType.cta:
            return (
              <div
                key={key}
                className="rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-8 shadow-2xl shadow-blue-600/30 text-white text-center"
              >
                <p className="text-lg lg:text-xl font-bold mb-4">{item.value}</p>
                {item.caption && (
                  <button className="px-6 py-3 rounded-lg bg-white text-blue-600 font-bold hover:shadow-lg hover:shadow-white/20 transition-all transform hover:scale-105">
                    {item.caption}
                  </button>
                )}
              </div>
            );

          case ContentType.feature_box:
            return <FeatureBox key={key} text={item.value} />;

          // case ContentType.stat_card:
          //   return (
          //     <div
          //       key={key}
          //       className="rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-white shadow-2xl shadow-slate-900/30 border border-slate-700"
          //     >
          //       <blockquote className="italic text-lg leading-relaxed">
          //         {item.value}
          //       </blockquote>
          //     </div>
          //   );
          // In your original switch case:
case ContentType.stat_card:
  return (
    <div
      key={key}
      className="group relative overflow-hidden rounded-2xl bg-slate-900 p-6 transition-all hover:bg-slate-850 border border-slate-800 shadow-xl"
    >
      {/* Optional: Subtle background glow effect */}
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-blue-500/10 blur-3xl group-hover:bg-blue-500/20 transition-colors" />
      
      <div className="relative z-10 flex flex-col gap-1">
        <span className="text-sm font-medium uppercase tracking-wider text-slate-400">
          {item.headers || "Key Metric"}
        </span>
        
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold tracking-tight text-white">
            {item.value}
          </span>
          {item.caption && (
            <span className="text-sm font-semibold text-emerald-400">
              ↑ {item.caption}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
          case ContentType.divider:
            return (
              <div key={key} className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent my-8" />
            );

          default:
            return (
              <div key={key} className="p-4 bg-slate-50 rounded-lg text-slate-600 text-sm">
                {item.value}
              </div>
            );
        }
      })}
    </div>
  );
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// // components/blog/ContentRenderer.tsx
// "use client";

// import Image from "next/image";
// import { ContentItem, ContentType } from "@/types/blog-detail";
// import { FeatureBox } from "./FeatureBox";
// import { TipSection } from "./Tips";
// import {  FeatureList } from "./BlogList";
// import { HighlightBox } from "./HighlightBox";

// export function ContentRenderer({ items }: { items: ContentItem[] }) {
//   return (
//     <div className="prose prose-lg max-w-none">
//       {items.map((item, idx) => {
//         // Generate a stable key – use item index + type as fallback
//         const key = `${item.type}-${idx}`;

//         switch (item.type) {
//           case ContentType.heading:
//             // Heading levels can be inferred from value (e.g., 'h2', 'h3') or add a level field
//             return (
//               <h2 key={key} className="text-2xl font-serif font-bold mt-8 mb-4">
//                 {item.value}
//               </h2>
//             );

//           case ContentType.text:
//             // return <p key={key} className="mb-4 text-[#2C2A27] leading-relaxed">{item.value}</p>;
//             return (
//               <p
//                 key={key}
//                 className="max-w-2xl mx-auto mb-6 text-base md:text-lg text-[#3A3732] leading-relaxed md:leading-loose font-serif selection:bg-[#C8401E]/10"
//                 style={{
//                   textRendering: "optimizeLegibility",
//                   WebkitFontSmoothing: "antialiased",
//                 }}
//               >
//                 {item.value}
//               </p>
//             );
//           case ContentType.code:
//             return (
//               <pre
//                 key={key}
//                 className="bg-[#1E1E1E] text-[#D4D4D4] p-4 rounded-md overflow-x-auto my-4"
//               >
//                 <code className={`language-${item.language || "text"}`}>
//                   {item.value}
//                 </code>
//               </pre>
//             );

     
// // Inside switch:
// case ContentType.list:  // or replace existing 'list' case
//   return <FeatureList key={key} raw={item.value}  />;
//           case ContentType.image:
//             return (
//               <figure key={key} className="my-6">
//                 <Image
//                   src={item.imageUrl || ""}
//                   alt={item.caption || "Blog image"}
//                   width={800}
//                   height={500}
//                   className="rounded-md w-full h-auto object-cover"
//                   sizes="(max-width: 768px) 100vw, 800px"
//                 />
//                 {item.caption && (
//                   <figcaption className="text-sm text-center text-[#6B6760] mt-2">
//                     {item.caption}
//                   </figcaption>
//                 )}
//               </figure>
//             );

//           case ContentType.table:
//             if (!item.headers || !item.rows) return null;
//             return (
//               <div key={key} className="overflow-x-auto my-6">
//                 <table className="min-w-full border border-[#DDD9D2] text-sm">
//                   <thead>
//                     <tr className="bg-[#F0EFEA] border-b border-[#DDD9D2]">
//                       {item.headers.map((header, i) => (
//                         <th key={i} className="px-4 py-2 text-left font-medium">
//                           {header}
//                         </th>
//                       ))}
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {item.rows.map((row, i) => (
//                       <tr
//                         key={i}
//                         className="border-b border-[#DDD9D2] last:border-0"
//                       >
//                         {row.map((cell, j) => (
//                           <td key={j} className="px-4 py-2">
//                             {cell}
//                           </td>
//                         ))}
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             );

            
//           case ContentType.highlight:
//             // return (
//             //   <div
//             //     key={key}
//             //     className="bg-[#FFF3E0] border-l-4 border-[#C8401E] p-4 my-4 italic"
//             //   >
//             //     {item.value}
//             //   </div>
//             // );
//              return <HighlightBox key={idx} text={item.value} />;
//           case ContentType.tip:
//             return <TipSection key={`tip-${key}`} value={item.value} />;
//           case ContentType.warning:
//             return (
//               <div
//                 key={key}
//                 className="bg-[#FFE8E8] border-l-4 border-[#C8401E] p-4 my-4"
//               >
//                 <p className="font-semibold text-[#C8401E]">⚠️ Warning</p>
//                 <p>{item.value}</p>
//               </div>
//             );

//           case ContentType.cta:
//             return (
//               <div
//                 key={key}
//                 className="bg-[#0F0E0C] text-white text-center p-6 my-6 rounded-md"
//               >
//                 <p className="text-lg font-medium">{item.value}</p>
//                 {item.caption && (
//                   <button className="mt-3 bg-[#C8401E] px-4 py-2 text-sm rounded-sm">
//                     {item.caption}
//                   </button>
//                 )}
//               </div>
//             );

//           case ContentType.feature_box:
//             return (
//               <FeatureBox
//                 key={`feature-${key}`}
//                 text={item.value} // Mapping your JSON 'value' to the 'text' prop
//                 // customTitle={item.headers} // Passes title if exists in JSON
//                 // icon={<YourIconComponent />} // You can map icons here based on item.type or item.category
//               />
//             );

//           default:
//             // Fallback for unknown types
//             return (
//               <div key={key} className="my-2">
//                 {item.value}
//               </div>
//             );
//         }
//       })}
//     </div>
//   );
// }
