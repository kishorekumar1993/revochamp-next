// components/TableOfContents.tsx
"use client";

import { useEffect, useState } from "react";

export function TableOfContents({ headings }: { headings: string[] }) {
  const [activeId, setActiveId] = useState("");
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    if (!headings.length) return;

    // Intersection Observer for active heading
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "0px 0px -50% 0px", threshold: 0 },
    );

    headings.forEach((h) => {
      const el = document.getElementById(slugify(h));
      if (el) observer.observe(el);
    });

    // Sticky scroll handler
    const handleScroll = () => {
      setIsSticky(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [headings]);

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    heading: string,
  ) => {
    e.preventDefault();
    const id = slugify(heading);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.pushState(null, "", `#${id}`);
    }
  };

  if (!headings.length) return null;

  return (
    <div className="hidden lg:block">
      <div
        className={`transition-all duration-300 ${
          isSticky
            ? "sticky top-24 py-4 px-4 rounded-lg bg-white border border-slate-200 shadow-lg"
            : ""
        }`}
      >
        <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-4 px-4">
          📖 In This Article
        </h3>
        <ul className="space-y-2">
          {headings.map((h, index) => {
            const slug = slugify(h);
            const isActive = activeId === slug;
            return (
              <li key={`${h}-${index}`}>
                {" "}
                {/* ✅ unique key */}
                <a
                  href={`#${slug}`}
                  onClick={(e) => handleClick(e, h)}
                  className={`block px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-blue-100 text-blue-700 font-semibold border-l-2 border-blue-600"
                      : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                  aria-current={isActive ? "location" : undefined}
                >
                  {h}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// // components/TableOfContents.tsx
// 'use client';
// import { useEffect, useState } from 'react';
// import { ContentItem, ContentType } from '@/types/blog-detail';
// import ReactMarkdown from 'react-markdown';

// export function TableOfContents({ headings }: { headings: string[] }) {
//   const [activeId, setActiveId] = useState('');

//   // Intersection Observer to highlight active heading
//   useEffect(() => {
//     if (!headings.length) return;

//     const observer = new IntersectionObserver(
//       (entries) => {
//         const visible = entries.filter((e) => e.isIntersecting);
//         if (visible.length) {
//           setActiveId(visible[0].target.id);
//         }
//       },
//       { rootMargin: '0px 0px -40% 0px', threshold: 0.1 }
//     );

//     headings.forEach((h) => {
//       const el = document.getElementById(slugify(h));
//       if (el) observer.observe(el);
//     });

//     return () => observer.disconnect();
//   }, [headings]);

//   // Manual click handler for navigation
//   const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, heading: string) => {
//     e.preventDefault();
//     const id = slugify(heading);
//     const element = document.getElementById(id);
//     if (element) {
//       element.scrollIntoView({ behavior: 'smooth', block: 'start' });
//       history.pushState(null, '', `#${id}`);
//     } else {
//       // Fallback: find by text content (in case ID missing)
//       const headingsList = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
//       const target = headingsList.find((h) => h.textContent?.trim() === heading);
//       if (target) {
//         target.scrollIntoView({ behavior: 'smooth', block: 'start' });
//         history.pushState(null, '', `#${slugify(heading)}`);
//       }
//     }
//   };

//   if (!headings.length) return null;

//   return (
//     <div className="hidden md:block">
//       <h3 className="text-xs font-semibold tracking-wider text-[#6B6760] border-b pb-2 mb-3">
//         IN THIS ARTICLE
//       </h3>
//       <ul className="space-y-2 text-sm">
//         {headings.map((h) => {
//           const slug = slugify(h);
//           const isActive = activeId === slug;
//           return (
//             <li key={h}>
//               <a
//                 href={`#${slug}`}
//                 onClick={(e) => handleClick(e, h)}
//                 className={`hover:text-[#C8401E] transition-colors ${
//                   isActive ? 'text-[#C8401E] font-medium' : 'text-[#1f1f1f]'
//                 }`}
//                 aria-current={isActive ? 'location' : undefined}
//               >
//                 {h}
//               </a>
//             </li>
//           );
//         })}
//       </ul>
//     </div>
//   );
// }

// export function ContentRenderer({ items }: { items: ContentItem[] }) {
//   return (
//     <>
//       {items.map((item, idx) => {
//         switch (item.type) {
//           case ContentType.heading:
//             const id = slugify(item.value);
//             return (
//               <h2 key={idx} id={id} className="scroll-mt-20 text-2xl font-bold mt-8 mb-4">
//                 {item.value}
//               </h2>
//             );
//           case ContentType.text:
//             return (
//               <p key={idx} className="mb-4 leading-relaxed text-gray-800">
//                 {item.value}
//               </p>
//             );
//           case ContentType.image:
//             return (
//               <figure key={idx} className="my-6">
//                 <img src={item.value} alt={item.caption || ''} className="rounded-lg w-full" />
//                 {item.caption && <figcaption className="text-sm text-center mt-2 text-gray-500">{item.caption}</figcaption>}
//               </figure>
//             );
//           case ContentType.list:
//             return (
//               <ul key={idx} className="list-disc pl-6 mb-4 space-y-1">
//                 {/* {item.items?.map((li, i) => <li key={i}>{li}</li>)} */}
//               </ul>
//             );
//           case ContentType.stat_card:
//             return (
//               <blockquote key={idx} className="border-l-4 border-[#C8401E] pl-4 italic my-4 text-gray-700">
//                 <ReactMarkdown>{item.value}</ReactMarkdown>
//               </blockquote>
//             );
//           default:
//             return null;
//         }
//       })}
//     </>
//   );
// }
// export function slugify(text: string): string {
//   const slug = text
//     .toLowerCase()
//     .replace(/[^a-z0-9]+/g, '-')
//     .replace(/^-|-$/g, '');
//   return slug || 'heading';
// }
