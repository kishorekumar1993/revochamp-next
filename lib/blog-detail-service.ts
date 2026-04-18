// lib/blog-detail-service.ts
import { BlogPost } from "@/types/blog-detail";
import { fetchBlogPage, fetchCategoryPage } from "./blog-service";

const BASE_URL = 'https://json.revochamp.site/blog';

// All categories that exist on your server (from your sidebar)
const ALL_CATEGORIES = [
  'ai', 'technology', 'business', 'finance', 'insurance',
  'startups', 'health', 'education', 'politics',
  'international', 'entertainment'
];

// ✅ Fetch ALL slugs from main feed (paginated) + all categories (paginated)
export async function getAllBlogSlugs(): Promise<string[]> {
  const slugsSet = new Set<string>();

  // 1. Main feed – iterate until no more data
  let page = 1;
  let hasMore = true;
  while (hasMore) {
    const res = await fetchBlogPage(page);
    if (!res.data.length) break;  // no posts → stop
    res.data.forEach(post => slugsSet.add(post.slug));
    hasMore = page < res.totalPages;
    page++;
  }

  // 2. Each category – iterate through all its pages
  for (const cat of ALL_CATEGORIES) {
    let catPage = 1;
    let catHasMore = true;
    while (catHasMore) {
      const catRes = await fetchCategoryPage(cat, catPage);
      if (!catRes.data.length) break;
      catRes.data.forEach(post => slugsSet.add(post.slug));
      catHasMore = catPage < catRes.totalPages;
      catPage++;
    }
  }

  const slugs = Array.from(slugsSet);
  console.log(`✅ getAllBlogSlugs found ${slugs.length} slugs`);
  return slugs;
}

// ✅ Fetch a single post – try root, then each category folder
export async function fetchBlogBySlug(slug: string): Promise<BlogPost> {
  // Try root URL first
  let url = `${BASE_URL}/${slug}.json`;
  let res = await fetch(url, { next: { revalidate: 10 } });

  // If not found, try each category folder
  if (!res.ok) {
    for (const cat of ALL_CATEGORIES) {
      const catUrl = `${BASE_URL}/${cat}/${slug}.json`;
      const catRes = await fetch(catUrl, { next: { revalidate: 10 } });
      if (catRes.ok) {
        res = catRes;
        break;
      }
    }
  }

  if (!res.ok) {
    throw new Error(`Failed to fetch ${slug} from root or any category`);
  }

  const data = await res.json();

  return {
    slug: data.slug,
    title: data.title,
    subtitle: data.subtitle,
    author: data.author,
    date: new Date(data.date),
    categories: data.categories || [],
    tags: data.tags || [],
    readTime: data.readTime,
    featuredImage: data.featuredImage,
    stats: data.stats || [],
    content: data.content || [],
    meta: data.meta,
    faq: data.faq,
    related: data.related || [],
    design: data.design,
  };
}

// // lib/blog-detail-service.ts
// import { BlogPost } from "@/types/blog-detail";
// import { fetchBlogPage, fetchCategoryPage } from "./blog-service"; // we need category fetcher

// const BASE_URL = 'https://json.revochamp.site/blog';

// // List all categories that exist on your JSON server
// const ALL_CATEGORIES = [
//   'ai', 'technology', 'business', 'finance', 'insurance',
//   'startups', 'health', 'education', 'politics',
//   'international', 'entertainment'
// ];

// export async function getAllBlogSlugs(): Promise<string[]> {
//   const slugsSet = new Set<string>();

//   // Main feed
//   let page = 1;
//   let hasMore = true;

//   while (hasMore) {
//     try {
//       const res = await fetchBlogPage(page);
//       res.data.forEach(post => slugsSet.add(post.slug));
//       hasMore = page < res.totalPages;
//       page++;
//     } catch (e) {
//       console.error('Error fetching main page:', page);
//       break; // prevent build crash
//     }
//   }

//   // Categories
//   for (const cat of ALL_CATEGORIES) {
//     let catPage = 1;
//     let catHasMore = true;

//     while (catHasMore) {
//       try {
//         const res = await fetchCategoryPage(cat, catPage);
//         res.data.forEach(post => slugsSet.add(post.slug));
//         catHasMore = catPage < res.totalPages;
//         catPage++;
//       } catch (e) {
//         console.warn(`Skipping category ${cat}, page ${catPage}`);
//         break;
//       }
//     }
//   }

//   console.log("TOTAL SLUGS:", slugsSet.size);

//   return Array.from(slugsSet);
// }

// // // ✅ Collect ALL slugs from main feed + every category (paginated)
// // export async function getAllBlogSlugs(): Promise<string[]> {
// //   const slugsSet = new Set<string>();

// //   // 1. Main feed (All posts) – paginate through all pages
// //   let page = 1;
// //   let hasMore = true;
// //   while (hasMore) {
// //     const res = await fetchBlogPage(page);
// //     res.data.forEach(post => slugsSet.add(post.slug));
// //     hasMore = page < res.totalPages;
// //     page++;
// //   }

// //   // 2. Each category – paginate through all its pages
// //   for (const cat of ALL_CATEGORIES) {
// //     let catPage = 1;
// //     let catHasMore = true;
// //     while (catHasMore) {
// //       const catRes = await fetchCategoryPage(cat, catPage);
// //       catRes.data.forEach(post => slugsSet.add(post.slug));
// //       catHasMore = catPage < catRes.totalPages;
// //       catPage++;
// //     }
// //   }

// //   return Array.from(slugsSet);
// // }

// // ✅ Fetch a single post – try root first, then category folders
// export async function fetchBlogBySlug(slug: string): Promise<BlogPost> {
//   // 1. Try root URL
//   let url = `${BASE_URL}/${slug}.json`;
//   let res = await fetch(url, { next: { revalidate: 10 } });

//   // 2. If not found, try each category folder
//   if (!res.ok) {
//     for (const cat of ALL_CATEGORIES) {
//       const catUrl = `${BASE_URL}/${cat}/${slug}.json`;
//       const catRes = await fetch(catUrl, { next: { revalidate: 10 } });
//       if (catRes.ok) {
//         res = catRes;
//         break;
//       }
//     }
//   }

//   if (!res.ok) throw new Error(`Failed to fetch ${slug}`);
//   const data = await res.json();

//   // Parse and return as BlogPost (same as before)
//   return {
//     slug: data.slug,
//     title: data.title,
//     subtitle: data.subtitle,
//     author: data.author,
//     date: new Date(data.date),
//     categories: data.categories || [],
//     tags: data.tags || [],
//     readTime: data.readTime,
//     featuredImage: data.featuredImage,
//     stats: data.stats || [],
//     content: data.content || [],
//     meta: data.meta,
//     faq: data.faq,
//     related: data.related || [],
//     design: data.design,
//   };
// }

// // import { BlogPost } from "@/types/blog-detail";
// // import { fetchBlogPage } from "./blog-service";


// // const BASE_URL = 'https://json.revochamp.site/blog';

// // // Correct URL patterns based on your working links
// // const ALL_POSTS_URL = (page: number) => `${BASE_URL}/page/page-${page}.json`;
// // const CATEGORY_URL = (category: string, page: number) => `${BASE_URL}/${category}/page-${page}.json`;
// // const SINGLE_POST_URL = (slug: string) => `${BASE_URL}/${slug}.json`;

// // export async function fetchBlogBySlug(slug: string): Promise<BlogPost> {
// //   const url = `${BASE_URL}/${slug}.json`;
// //   const res = await fetch(url, { next: { revalidate: 10 } });
// //   if (!res.ok) throw new Error(`Failed to fetch ${slug}`);
// //   const data = await res.json();
  
// //   // Parse and return as BlogPost type
// //   return {
// //     slug: data.slug,
// //     title: data.title,
// //     subtitle: data.subtitle,
// //     author: data.author,
// //     date: new Date(data.date), // ensure Date object
// //     categories: data.categories || [],
// //     tags: data.tags || [],
// //     readTime: data.readTime,
// //     featuredImage: data.featuredImage,
// //     stats: data.stats || [],
// //     content: data.content || [],
// //     meta: data.meta,
// //     faq: data.faq,
// //     related: data.related || [],
// //     design: data.design,
// //   };
// // }
// // export async function getAllBlogSlugs(): Promise<string[]> {
// //   const firstPage = await fetchBlogPage(1);
// //   return firstPage.data.map(post => post.slug);
// // }