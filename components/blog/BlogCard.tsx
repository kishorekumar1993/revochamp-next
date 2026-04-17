// 'use client';

// import Image from 'next/image';
// import Link from 'next/link';
// import { BlogSummary } from '@/types/blog';

// interface Props {
//   post: BlogSummary;
//   featured?: boolean;
// }

// export default function BlogCard({ post, featured = false }: Props) {
//   const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
//     year: 'numeric',
//     month: 'short',
//     day: 'numeric',
//   });

//   const estimatedReadTime = post.readTime || 5;

//   return (
//     <Link href={`/blog/${post.slug}`} className="block w-full h-full">
//       <article
//         className={`
//           group relative w-full h-full bg-white rounded-xl overflow-hidden
//           border border-slate-200/50 transition-all duration-300
//           hover:shadow-xl hover:border-slate-300
//           ${featured ? 'sm:col-span-2 lg:col-span-1' : ''}
//         `}
//       >
//         {/* Image container - ensures proper containment */}
//         <div className="relative w-full h-48 sm:h-56 md:h-64 overflow-hidden bg-gradient-to-br from-slate-200 to-slate-100">
//           {post.image ? (
//             <Image
//               src={post.image}
//               alt={post.title}
//               fill
//               sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
//               className="object-cover transition-transform duration-500 group-hover:scale-105"
//               style={{ transform: 'translateZ(0)' }} // Hardware acceleration
//               priority={featured}
//             />
//           ) : (
//             <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100">
//               <svg
//                 className="w-12 h-12 text-slate-400"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={1.5}
//                   d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
//                 />
//               </svg>
//             </div>
//           )}

//           {/* Category badge */}
//           {post.category && (
//             <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10">
//               <span className="inline-block px-2.5 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs sm:text-sm font-semibold rounded-full shadow-lg">
//                 {post.category}
//               </span>
//             </div>
//           )}

//           {/* Hover overlay */}
//           <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
//         </div>

//         {/* Content */}
//         <div className="p-4 sm:p-5 md:p-6 flex flex-col h-[calc(100%-12rem)] sm:h-[calc(100%-14rem)] md:h-[calc(100%-16rem)]">
//           {/* Meta */}
//           <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-3 sm:mb-4 text-xs sm:text-sm text-slate-600">
//             <time dateTime={post.date} className="font-medium">
//               {formattedDate}
//             </time>
//             <span className="hidden sm:inline text-slate-400">•</span>
//             <span className="text-slate-600 whitespace-nowrap">
//               {estimatedReadTime} min read
//             </span>
//           </div>

//           {/* Title */}
//           <h2 className="text-base sm:text-lg md:text-xl font-bold text-slate-900 mb-3 sm:mb-4 line-clamp-3 group-hover:text-blue-600 transition-colors duration-300">
//             {post.title}
//           </h2>

//           {/* Summary */}
//           <p className="text-sm sm:text-base text-slate-600 line-clamp-3 mb-4 sm:mb-6 flex-grow">
//             {post.summary}
//           </p>

//           {/* Author & CTA */}
//           <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
//             <div className="flex items-center gap-2">
//               {post.author && (
//                 <div className="text-xs sm:text-sm text-slate-700 font-medium">
//                   By {post.author}
//                 </div>
//               )}
//             </div>

//             <div className="text-blue-500 group-hover:translate-x-1 transition-transform duration-300">
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M13 7l5 5m0 0l-5 5m5-5H6"
//                 />
//               </svg>
//             </div>
//           </div>
//         </div>
//       </article>
//     </Link>
//   );
// }
"use client";
import Link from "next/link";
import { BlogSummary } from "@/types/blog";
import Image from "next/image";

export default function BlogCard({
  post,
  featured = false,
}: {
  post: BlogSummary;
  featured?: boolean;
}) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block h-full">
      <div className="bg-white border border-border hover:shadow-lg transition-all duration-300 h-full flex flex-col rounded-xl overflow-hidden">
        {post.image && (
          <div className="relative w-full aspect-video overflow-hidden">
            <Image
              src={post.image}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              priority={featured}
              quality={75}
            />
          </div>
        )}
        <div className="p-5 flex flex-col flex-grow">
          {post.category && (
            <span className="text-red text-xs font-semibold uppercase tracking-wider">
              {post.category}
            </span>
          )}
          <h3 className="font-serif text-xl font-bold mt-2 group-hover:text-red transition-colors line-clamp-2">
            {post.title}
          </h3>
          <p className="text-muted text-sm mt-2 line-clamp-2">{post.summary}</p>
          <div className="flex items-center gap-2 mt-4 text-xs text-muted">
            <span>
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
            <span>•</span>
            <span>{post.readTime || 5} min read</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
// // "use client";
// // import Link from "next/link";
// // import { BlogSummary } from "@/types/blog";
// // import Image from "next/image";

// // export default function BlogCard({
// //   post,
// //   featured = false,
// // }: {
// //   post: BlogSummary;
// //   featured?: boolean;
// // }) {
// //   return (
// //     <Link href={`/blog/${post.slug}`} className="group block">
// //       <div className="bg-white border border-border hover:shadow-lg transition-all duration-300 h-full flex flex-col">
// //         {post.image && (
// //           <div className="relative h-48 w-full overflow-hidden">
// //             {/* <img
// //               src={post.image}
// //               alt={post.title}
// //               className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
// //             /> */}
// //             <Image
// //               src={post.image}
// //               alt={post.title}
// //               fill
// //               sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
// //               className="object-cover"
// //                 priority={featured}   // 👈 Preload the first image
// // quality={75}
// //             />
// //           </div>
// //         )}
// //         <div className="p-5 flex flex-col flex-grow">
// //           {post.category && (
// //             <span className="text-red text-xs font-semibold uppercase tracking-wider">
// //               {post.category}
// //             </span>
// //           )}
// //           <h3 className="font-serif text-xl font-bold mt-2 group-hover:text-red transition-colors line-clamp-2">
// //             {post.title}
// //           </h3>
// //           <p className="text-muted text-sm mt-2 line-clamp-2">{post.summary}</p>
// //           <div className="flex items-center gap-2 mt-4 text-xs text-muted">
// //             <span>
// //               {new Date(post.date).toLocaleDateString("en-US", {
// //                 year: "numeric",
// //                 month: "short",
// //                 day: "numeric",
// //               })}
// //             </span>{" "}
// //             <span>•</span>
// //             <span>{post.readTime || 5} min read</span>
// //           </div>
// //         </div>
// //       </div>
// //     </Link>
// //   );
// // }
