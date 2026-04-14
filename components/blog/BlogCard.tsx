"use client";

import Link from "next/link";
import { BlogSummary } from "@/types/blog";
import Image from "next/image";
import { useMemo } from "react";

export default function BlogCard({
  post,
  featured = false,
}: {
  post: BlogSummary;
  featured?: boolean;
}) {
  // ✅ Memoize date (performance)
  const formattedDate = useMemo(() => {
    return new Date(post.date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }, [post.date]);

  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <div className="bg-white border border-border hover:shadow-lg transition-all duration-300 h-full flex flex-col">
        {/* ✅ Image */}
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={post.image || "/fallback.jpg"}
            alt={`${post.title} blog image`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            priority={featured}
            placeholder="blur"
            blurDataURL="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
      quality={70}                  // 🔥 reduce size
  fetchPriority="high"          // 🔥 LCP fix

     />
        </div>

        {/* ✅ Content */}
        <div className="p-5 flex flex-col flex-grow">
          {post.category && (
            <span className="text-red text-xs font-semibold uppercase tracking-wider">
              {post.category}
            </span>
          )}

          <h3 className="font-serif text-xl font-bold mt-2 group-hover:text-red transition-colors line-clamp-2">
            {post.title}
          </h3>

          <p className="text-muted text-sm mt-2 line-clamp-2">
            {post.summary}
          </p>

          <div className="flex items-center gap-2 mt-4 text-xs text-muted">
            <span>{formattedDate}</span>
            <span>•</span>
            <span>{post.readTime || 5} min read</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// "use client";

// import Link from "next/link";
// import { BlogSummary } from "@/types/blog";
// import Image from "next/image";
// import { useMemo } from "react";

// export default function BlogCard({
//   post,
//   featured = false,
// }: {
//   post: BlogSummary;
//   featured?: boolean;
// }) {
//   // ✅ Memoize date (performance)
//   const formattedDate = useMemo(() => {
//     return new Date(post.date).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     });
//   }, [post.date]);

//   return (
//     <Link href={`/blog/${post.slug}`} className="group block">
//       <div className="bg-white border border-border hover:shadow-lg transition-all duration-300 h-full flex flex-col">

//         {/* ✅ Image */}
//         <div className="relative h-48 w-full overflow-hidden">
//           <Image
//             src={post.image || "/fallback.jpg"} // ✅ fallback
//             alt={`${post.title} blog image`} // ✅ better alt
//             fill
//             sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//             className="object-cover group-hover:scale-105 transition-transform duration-500"
//             priority={featured} // ✅ LCP fix
//             placeholder="blur" // ✅ CLS fix
//             blurDataURL="/blur.png" // small base64 or static
//           />
//         </div>

//         {/* ✅ Content */}
//         <div className="p-5 flex flex-col flex-grow">
//           {post.category && (
//             <span className="text-red text-xs font-semibold uppercase tracking-wider">
//               {post.category}
//             </span>
//           )}

//           <h3 className="font-serif text-xl font-bold mt-2 group-hover:text-red transition-colors line-clamp-2">
//             {post.title}
//           </h3>

//           <p className="text-muted text-sm mt-2 line-clamp-2">
//             {post.summary}
//           </p>

//           <div className="flex items-center gap-2 mt-4 text-xs text-muted">
//             <span>{formattedDate}</span>
//             <span>•</span>
//             <span>{post.readTime || 5} min read</span>
//           </div>
//         </div>
//       </div>
//     </Link>
//   );
// }

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
// //               priority={false}
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
