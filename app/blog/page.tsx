import { BlogStructuredDataList } from "@/components/blog/BlogStructuredData";
import BlogListClient from "./BlogListClient";
import { BlogSummary } from "@/types/blog";
import { fetchBlogPage, fetchCategoryPage } from "@/lib/blog-service";

export const revalidate = 3600;

interface PageProps {
  searchParams?: Promise<{ page?: string; category?: string; q?: string }>;
}

export default async function BlogPage({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {};

  const page = Number(params.page ?? 1);
  const category = params.category ?? null;
  const query = params.q ?? "";

  let initialPosts: BlogSummary[] = [];
  let totalPages = 1;

  try {
    let response;

    if (category && category !== "All") {
      response = await fetchCategoryPage(category.toLowerCase(), page);
    } else {
      response = await fetchBlogPage(page);
    }

    initialPosts = response?.data ?? [];
    totalPages = response?.totalPages ?? 1;
  } catch (err) {
    console.error("Blog fetch failed:", err);
    initialPosts = [];
    totalPages = 1;
  }

  return (
    <>
      {initialPosts.length > 0 && (
        <BlogStructuredDataList posts={initialPosts} />
      )}

      <BlogListClient
        initialPosts={initialPosts}
        initialPage={page}
        totalPages={totalPages}
        initialCategory={category}
        initialQuery={query}
      />
    </>
  );
}

// // app/blog/page.tsx
// import { fetchBlogPage, fetchCategoryPage } from "@/lib/blog-service";
// import BlogListClient from "./BlogListClient";
// import { BlogSummary } from "@/types/blog";
// import { BlogStructuredDataList } from "@/components/blog/BlogStructuredData";

// // ✅ Correct type for Next.js 15
// interface PageProps {
//   searchParams?: Promise<{ page?: string; category?: string; q?: string }>;
// }

// export default async function BlogPage({ searchParams }: PageProps) {
//   // ✅ await the promise
//   const params = await searchParams || {};

//   const page = parseInt(params.page || "1");
//   const category = params.category || null;
//   const query = params.q || "";

//   let initialPosts: BlogSummary[] = [];
//   let totalPages = 1;

//   try {
//     let response;
//     if (category && category !== "All") {
//       response = await fetchCategoryPage(category.toLowerCase(), page);
//     } else {
//       response = await fetchBlogPage(page);
//     }
//     initialPosts = response?.data || [];
//     totalPages = response?.totalPages || 1;
//   } catch (err) {
//     console.error("Blog fetch failed:", err);
//   }

//   return (
//     <>
//       <BlogStructuredDataList posts={initialPosts} />
//       <BlogListClient
//         initialPosts={initialPosts}
//         initialPage={page}
//         totalPages={totalPages}
//         initialCategory={category}
//         initialQuery={query}
//       />
//     </>
//   );
// }

// // import { fetchBlogPage, fetchCategoryPage } from "@/lib/blog-service";
// // import BlogListClient from "./BlogListClient";
// // import { BlogSummary } from "@/types/blog";
// // import { BlogStructuredDataList } from "@/components/blog/BlogStructuredData";

// // // No revalidate, no dynamic – this page will be fully static
// // interface PageProps {
// //   searchParams?: { page?: string; category?: string; q?: string };
// // }

// // export default async function BlogPage({ searchParams }: PageProps) {
// //   const params = searchParams; // ✅ NO await, NO Promise

// //   const page = parseInt(params?.page || "1");
// //   const category = params?.category || null;
// //   const query = params?.q || "";

// //   let initialPosts: BlogSummary[] = [];
// //   let totalPages = 1;

// //   try {
// //     let response;
// //     if (category && category !== "All") {
// //       response = await fetchCategoryPage(category.toLowerCase(), page);
// //     } else {
// //       response = await fetchBlogPage(page);
// //     }
// //     initialPosts = response?.data || [];
// //     totalPages = response?.totalPages || 1;
// //   } catch (err) {
// //     console.error("Blog fetch failed:", err);
// //   }

// //   return (
// //     <>
// //       {/* ✅ Schema only once (SERVER SIDE) */}
// //       <BlogStructuredDataList posts={initialPosts} />

// //       {/* ✅ Client UI */}
// //       <BlogListClient
// //         initialPosts={initialPosts}
// //         initialPage={page}
// //         totalPages={totalPages}
// //         initialCategory={category}
// //         initialQuery={query}
// //       />
// //     </>
// //   );
// // }