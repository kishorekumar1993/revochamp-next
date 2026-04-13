// components/blog/ContentRenderer.tsx
"use client";

import Image from "next/image";
import { ContentItem, ContentType } from "@/types/blog-detail";
import { FeatureBox } from "./FeatureBox";
import { TipSection } from "./Tips";
import {  FeatureList } from "./BlogList";

export function ContentRenderer({ items }: { items: ContentItem[] }) {
  return (
    <div className="prose prose-lg max-w-none">
      {items.map((item, idx) => {
        // Generate a stable key – use item index + type as fallback
        const key = `${item.type}-${idx}`;

        switch (item.type) {
          case ContentType.heading:
            // Heading levels can be inferred from value (e.g., 'h2', 'h3') or add a level field
            return (
              <h2 key={key} className="text-2xl font-serif font-bold mt-8 mb-4">
                {item.value}
              </h2>
            );

          case ContentType.text:
            // return <p key={key} className="mb-4 text-[#2C2A27] leading-relaxed">{item.value}</p>;
            return (
              <p
                key={key}
                className="max-w-2xl mx-auto mb-6 text-base md:text-lg text-[#3A3732] leading-relaxed md:leading-loose font-serif selection:bg-[#C8401E]/10"
                style={{
                  textRendering: "optimizeLegibility",
                  WebkitFontSmoothing: "antialiased",
                }}
              >
                {item.value}
              </p>
            );
          case ContentType.code:
            return (
              <pre
                key={key}
                className="bg-[#1E1E1E] text-[#D4D4D4] p-4 rounded-md overflow-x-auto my-4"
              >
                <code className={`language-${item.language || "text"}`}>
                  {item.value}
                </code>
              </pre>
            );

     
// Inside switch:
case ContentType.list:  // or replace existing 'list' case
  return <FeatureList key={key} raw={item.value}  />;
          case ContentType.image:
            return (
              <figure key={key} className="my-6">
                <Image
                  src={item.imageUrl || ""}
                  alt={item.caption || "Blog image"}
                  width={800}
                  height={500}
                  className="rounded-md w-full h-auto object-cover"
                  sizes="(max-width: 768px) 100vw, 800px"
                />
                {item.caption && (
                  <figcaption className="text-sm text-center text-[#6B6760] mt-2">
                    {item.caption}
                  </figcaption>
                )}
              </figure>
            );

          case ContentType.table:
            if (!item.headers || !item.rows) return null;
            return (
              <div key={key} className="overflow-x-auto my-6">
                <table className="min-w-full border border-[#DDD9D2] text-sm">
                  <thead>
                    <tr className="bg-[#F0EFEA] border-b border-[#DDD9D2]">
                      {item.headers.map((header, i) => (
                        <th key={i} className="px-4 py-2 text-left font-medium">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {item.rows.map((row, i) => (
                      <tr
                        key={i}
                        className="border-b border-[#DDD9D2] last:border-0"
                      >
                        {row.map((cell, j) => (
                          <td key={j} className="px-4 py-2">
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
            return (
              <div
                key={key}
                className="bg-[#FFF3E0] border-l-4 border-[#C8401E] p-4 my-4 italic"
              >
                {item.value}
              </div>
            );
          case ContentType.tip:
            return <TipSection key={`tip-${key}`} value={item.value} />;
          case ContentType.warning:
            return (
              <div
                key={key}
                className="bg-[#FFE8E8] border-l-4 border-[#C8401E] p-4 my-4"
              >
                <p className="font-semibold text-[#C8401E]">⚠️ Warning</p>
                <p>{item.value}</p>
              </div>
            );

          case ContentType.cta:
            return (
              <div
                key={key}
                className="bg-[#0F0E0C] text-white text-center p-6 my-6 rounded-md"
              >
                <p className="text-lg font-medium">{item.value}</p>
                {item.caption && (
                  <button className="mt-3 bg-[#C8401E] px-4 py-2 text-sm rounded-sm">
                    {item.caption}
                  </button>
                )}
              </div>
            );

          case ContentType.feature_box:
            return (
              <FeatureBox
                key={`feature-${key}`}
                text={item.value} // Mapping your JSON 'value' to the 'text' prop
                // customTitle={item.headers} // Passes title if exists in JSON
                // icon={<YourIconComponent />} // You can map icons here based on item.type or item.category
              />
            );

          default:
            // Fallback for unknown types
            return (
              <div key={key} className="my-2">
                {item.value}
              </div>
            );
        }
      })}
    </div>
  );
}
