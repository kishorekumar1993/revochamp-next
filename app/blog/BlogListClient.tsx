'use client';

import { useState, useEffect, useCallback } from 'react';
import { BlogSummary } from '@/types/blog';
import CategoryFilter from '@/components/blog/CategoryFilter';
import SearchBar from '@/components/blog/SearchBar';
import Pagination from '@/components/blog/Pagination';
import dynamic from 'next/dynamic';

const LazyBlogCard = dynamic(() => import('@/components/blog/BlogCard'), {
  loading: () => <BlogCardSkeleton />,
});

interface Props {
  initialCategory: string | null;
  initialQuery: string;
  initialPage: number;
}

function BlogCardSkeleton() {
  return (
    <div className="animate-pulse w-full">
      <div className="h-48 sm:h-56 md:h-64 bg-gradient-to-br from-slate-200 to-slate-100 rounded-lg mb-4 w-full" />
      <div className="h-4 bg-slate-200 rounded w-3/4 mb-3" />
      <div className="h-4 bg-slate-200 rounded w-full mb-2" />
      <div className="h-4 bg-slate-200 rounded w-2/3" />
    </div>
  );
}

export default function BlogListClient({ initialCategory, initialQuery, initialPage }: Props) {
  const [posts, setPosts] = useState<BlogSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [category, setCategory] = useState(initialCategory);
  const [query, setQuery] = useState(initialQuery);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      let url: string;
      if (category && category !== 'All') {
        url = `https://json.revochamp.site/blog/category/${category.toLowerCase()}/page-${page}.json`;
      } else {
        url = `https://json.revochamp.site/blog/page/page-${page}.json`;
      }
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      let data = await res.json();
      let postsArray = Array.isArray(data) ? data : data.data || [];
      if (query) {
        postsArray = postsArray.filter((post: BlogSummary) =>
          post.title.toLowerCase().includes(query.toLowerCase()) ||
          post.category?.toLowerCase().includes(query.toLowerCase())
        );
      }
      setPosts(postsArray);
      setTotalPages(10);
    } catch (err) {
      console.error(err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [page, category, query]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleCategoryChange = (newCategory: string | null) => {
    setCategory(newCategory);
    setPage(1);
  };

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 overflow-x-hidden">
      {/* Hero Header */}
      {/* <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 lg:py-20">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8 sm:mb-10 md:mb-12">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-2 sm:mb-4">
                Discover Insights &<br className="hidden sm:block" />
                <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  {category && category !== 'All' ? category : 'Expert Articles'}
                </span>
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-slate-400 max-w-2xl mt-3 sm:mt-4">
                {getHeadlineDescription(category)}
              </p>
            </div>

            <div className="mb-6">
              <CategoryFilter activeCategory={category} onSelect={handleCategoryChange} />
            </div>
          </div>
        </div>
      </div> */}


      <div className="bg-ink text-white py-6 md:py-12 px-4 md:px-12">
         <div className="max-w-7xl mx-auto">
           <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl font-bold break-words">
             {category && category !== 'All' ? category : 'All'}{' '}
             <span className="text-gold italic">Articles</span>
           </h1>
           <p className="text-white/40 mt-3 max-w-2xl text-sm sm:text-base">
             {getHeadlineDescription(category)}
           </p>
         </div>

         {/* Horizontally scrollable category filter on mobile */}
         <div className="overflow-x-auto whitespace-nowrap pb-2 -mx-4 px-4 md:mx-0 md:px-0 mt-6">
           <CategoryFilter activeCategory={category} onSelect={handleCategoryChange} />
         </div>
       </div>


      {/* Main content area */}
      <div className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-8 sm:mb-10 md:mb-12 items-stretch sm:items-center justify-between">
          <div className="flex-1 min-w-0">
            <SearchBar initialQuery={query} onSearch={handleSearch} />
          </div>
          <div className="flex items-center justify-between sm:justify-end gap-4">
            <span className="text-xs sm:text-sm text-slate-600 font-medium whitespace-nowrap">
              {posts.length} {posts.length === 1 ? 'article' : 'articles'}
            </span>
          </div>
        </div>

        {/* 🔒 FORCE SINGLE COLUMN BELOW 500px (defensive override) */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 w-full force-mobile-single-col">
            {[...Array(6)].map((_, i) => (
              <BlogCardSkeleton key={i} />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 sm:py-20 md:py-24">
            <div className="text-6xl sm:text-7xl mb-4">📚</div>
            <p className="text-lg sm:text-xl text-slate-600 font-medium mb-2">No articles found</p>
            <p className="text-sm sm:text-base text-slate-500 text-center px-4">
              Try adjusting your search or explore other categories
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1  sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 auto-rows-max w-full force-mobile-single-col">
            {posts.map((post, idx) => (
              <div
                key={`${post.slug}-${idx}`}
                className="animate-fadeIn w-full"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <LazyBlogCard post={post} featured={idx === 0} />
              </div>
            ))}
          </div>
        )}

        {posts.length > 0 && (
          <div className="mt-12 sm:mt-16 md:mt-20">
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        )}
      </div>

      {/* 🛡️ Defensive styles + mobile force single column */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }

        /* Force 1 column on small screens regardless of Tailwind overrides */
        @media (max-width: 500px) {
          .force-mobile-single-col {
            grid-template-columns: 1fr !important;
            display: grid !important;
          }
        }

        /* Prevent image overflow */
        img {
          max-width: 100%;
          height: auto;
        }

        /* Debug helper – comment out in production */
        /* body::after {
          content: "Debug: grid-cols-1 active";
          position: fixed;
          bottom: 4px;
          left: 4px;
          background: black;
          color: lime;
          padding: 2px 6px;
          font-size: 10px;
          z-index: 9999;
          border-radius: 4px;
        } */
      `}</style>
    </div>
  );
}

function getHeadlineDescription(category: string | null): string {
  const desc: Record<string, string> = {
    All: 'Stay informed with curated content spanning technology, business, and everything in between.',
    AI: 'Explore the latest breakthroughs in artificial intelligence and machine learning.',
    Technology: 'Discover emerging tech trends and digital innovations.',
    Business: 'Strategic insights for modern entrepreneurs and business leaders.',
    Finance: 'Navigate financial decisions with expert guidance and analysis.',
    Insurance: 'Understanding insurance in a changing world.',
    Startups: 'Build, scale, and grow your startup with proven strategies.',
    Health: 'Wellness insights to help you live your best life.',
    Education: 'Learning strategies for personal and professional development.',
  };
  return desc[category || 'All'] || 'Browse articles in this category.';
}

// 'use client';

// import { useState, useEffect, useCallback } from 'react';
// import { BlogSummary } from '@/types/blog';
// import BlogCard from '@/components/blog/BlogCard';
// import CategoryFilter from '@/components/blog/CategoryFilter';
// import SearchBar from '@/components/blog/SearchBar';
// import Pagination from '@/components/blog/Pagination';
// import dynamic from 'next/dynamic';

// // Dynamically import non-critical components
// const LazyBlogCard = dynamic(() => import('@/components/blog/BlogCard'), {
//   loading: () => <div className="h-96 bg-gray-100 animate-pulse rounded-xl" />,
// });

// interface Props {
//   initialCategory: string | null;
//   initialQuery: string;
//   initialPage: number;
// }

// export default function BlogListClient({ initialCategory, initialQuery, initialPage }: Props) {
//   const [posts, setPosts] = useState<BlogSummary[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [page, setPage] = useState(initialPage);
//   const [totalPages, setTotalPages] = useState(1);
//   const [category, setCategory] = useState(initialCategory);
//   const [query, setQuery] = useState(initialQuery);

//   const fetchPosts = useCallback(async () => {
//     setLoading(true);
//     try {
//       let url: string;
//       if (category && category !== 'All') {
//         url = `https://json.revochamp.site/blog/category/${category.toLowerCase()}/page-${page}.json`;
//       } else {
//         url = `https://json.revochamp.site/blog/page/page-${page}.json`;
//       }
//       const res = await fetch(url);
//       if (!res.ok) throw new Error(`HTTP ${res.status}`);
//       let data = await res.json();
//       let postsArray = Array.isArray(data) ? data : data.data || [];
//       if (query) {
//         postsArray = postsArray.filter((post: BlogSummary) =>
//           post.title.toLowerCase().includes(query.toLowerCase()) ||
//           post.category?.toLowerCase().includes(query.toLowerCase())
//         );
//       }
//       setPosts(postsArray);
//       // Adjust totalPages based on your API – this is a placeholder
//       setTotalPages(10);
//     } catch (err) {
//       console.error(err);
//       setPosts([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [page, category, query]);

//   useEffect(() => {
//     fetchPosts();
//   }, [fetchPosts]);

//   const handleCategoryChange = (newCategory: string | null) => {
//     setCategory(newCategory);
//     setPage(1);
//   };

//   const handleSearch = (newQuery: string) => {
//     setQuery(newQuery);
//     setPage(1);
//   };

//   return (
//     <div className="min-h-screen bg-cream">
//       {/* Header with responsive padding and typography */}
//       <div className="bg-ink text-white py-6 md:py-12 px-4 md:px-12">
//         <div className="max-w-7xl mx-auto">
//           <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl font-bold break-words">
//             {category && category !== 'All' ? category : 'All'}{' '}
//             <span className="text-gold italic">Articles</span>
//           </h1>
//           <p className="text-white/40 mt-3 max-w-2xl text-sm sm:text-base">
//             {getHeadlineDescription(category)}
//           </p>
//         </div>

//         {/* Horizontally scrollable category filter on mobile */}
//         <div className="overflow-x-auto whitespace-nowrap pb-2 -mx-4 px-4 md:mx-0 md:px-0 mt-6">
//           <CategoryFilter activeCategory={category} onSelect={handleCategoryChange} />
//         </div>
//       </div>

//       {/* Main content area */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
//         {/* Search row: stacks on mobile, side-by-side on larger screens */}
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
//           <div className="w-full sm:w-auto">
//             <SearchBar initialQuery={query} onSearch={handleSearch} />
//           </div>
//           <span className="text-muted text-sm">{posts.length} articles</span>
//         </div>

//         {loading ? (
//           // Responsive skeleton grid matching the post grid
//           <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">

//             {[...Array(8)].map((_, i) => (
//               <div key={i} className="h-96 bg-gray-200 animate-pulse rounded-xl" />
//             ))}
//           </div>
//         ) : posts.length === 0 ? (
//           <div className="text-center py-20">
//             <p className="text-muted">No articles found.</p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
//             {posts.map((post, idx) => (
//               <LazyBlogCard key={`${post.slug}-${idx}`} post={post} featured={idx === 0} />
//             ))}
//           </div>
//         )}

//         <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
//       </div>
//     </div>
//   );
// }

// function getHeadlineDescription(category: string | null): string {
//   const desc: Record<string, string> = {
//     All: 'Insights, ideas and practical guides...',
//     AI: 'Artificial intelligence advancements...',
//     Technology: 'Latest tech trends...',
//     Business: 'Business strategies...',
//     Finance: 'Financial guidance...',
//     Insurance: 'Insurance industry trends...',
//     Startups: 'Startup tips...',
//     Health: 'Health and wellness insights...',
//     Education: 'Learning strategies...',
//   };
//   return desc[category || 'All'] || 'Browse articles in this category.';
// }

// // 'use client';

// // import { useState, useEffect, useCallback } from 'react';
// // import { BlogSummary } from '@/types/blog';
// // import BlogCard from '@/components/blog/BlogCard';
// // import CategoryFilter from '@/components/blog/CategoryFilter';
// // import SearchBar from '@/components/blog/SearchBar';
// // import Pagination from '@/components/blog/Pagination';
// // import dynamic from 'next/dynamic';

// // // Dynamically import non-critical components
// // const LazyBlogCard = dynamic(() => import('@/components/blog/BlogCard'), {
// //   loading: () => <div className="h-96 bg-gray-100 animate-pulse rounded-xl" />,
// // });

// // interface Props {
// //   initialCategory: string | null;
// //   initialQuery: string;
// //   initialPage: number;
// // }

// // export default function BlogListClient({ initialCategory, initialQuery, initialPage }: Props) {
// //   const [posts, setPosts] = useState<BlogSummary[]>([]);
// //   const [loading, setLoading] = useState(true);
// //   const [page, setPage] = useState(initialPage);
// //   const [totalPages, setTotalPages] = useState(1);
// //   const [category, setCategory] = useState(initialCategory);
// //   const [query, setQuery] = useState(initialQuery);

// //   const fetchPosts = useCallback(async () => {
// //     setLoading(true);
// //     try {
// //       let url: string;
// //       if (category && category !== 'All') {
// //         url = `https://json.revochamp.site/blog/category/${category.toLowerCase()}/page-${page}.json`;
// //       } else {
// //         url = `https://json.revochamp.site/blog/page/page-${page}.json`;
// //       }
// //       const res = await fetch(url);
// //       if (!res.ok) throw new Error(`HTTP ${res.status}`);
// //       let data = await res.json();
// //       let postsArray = Array.isArray(data) ? data : data.data || [];
// //       if (query) {
// //         postsArray = postsArray.filter((post: BlogSummary) =>
// //           post.title.toLowerCase().includes(query.toLowerCase()) ||
// //           post.category?.toLowerCase().includes(query.toLowerCase())
// //         );
// //       }
// //       setPosts(postsArray);
// //       // You'll need to adjust totalPages – maybe from a separate endpoint
// //       setTotalPages(10); // placeholder – implement based on your API
// //     } catch (err) {
// //       console.error(err);
// //       setPosts([]);
// //     } finally {
// //       setLoading(false);
// //     }
// //   }, [page, category, query]);

// //   useEffect(() => {
// //     fetchPosts();
// //   }, [fetchPosts]);

// //   const handleCategoryChange = (newCategory: string | null) => {
// //     setCategory(newCategory);
// //     setPage(1);
// //   };

// //   const handleSearch = (newQuery: string) => {
// //     setQuery(newQuery);
// //     setPage(1);
// //   };

// //   return (
// //     <div className="min-h-screen bg-cream">
// //       <div className="bg-ink text-white py-12 px-6 md:px-12">
// //         <div className="max-w-7xl mx-auto">
// //           <h1 className="font-serif text-5xl md:text-7xl font-bold">
// //             {category && category !== 'All' ? category : 'All'}{' '}
// //             <span className="text-gold italic">Articles</span>
// //           </h1>
// //           <p className="text-white/40 mt-4 max-w-2xl">
// //             {getHeadlineDescription(category)}
// //           </p>
// //         </div>
// //         <CategoryFilter activeCategory={category} onSelect={handleCategoryChange} />
// //       </div>

// //       <div className="max-w-7xl mx-auto px-6 py-12">
// //         <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
// //           <SearchBar initialQuery={query} onSearch={handleSearch} />
// //           <span className="text-muted text-sm">{posts.length} articles</span>
// //         </div>

// //         {loading ? (
// // <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
// //               {[...Array(6)].map((_, i) => (
// //               <div key={i} className="h-96 bg-gray-200 animate-pulse rounded-xl" />
// //             ))}
// //           </div>
// //         ) : posts.length === 0 ? (
// //           <div className="text-center py-20">
// //             <p className="text-muted">No articles found.</p>
// //           </div>
// //         ) : (
// // <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
// //               {posts.map((post, idx) => (
// //               <LazyBlogCard key={`${post.slug}-${idx}`} post={post} featured={idx === 0} />
// //             ))}
// //           </div>
// //         )}

// //         <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
// //       </div>
// //     </div>
// //   );
// // }

// // function getHeadlineDescription(category: string | null): string {
// //   const desc: Record<string, string> = {
// //     All: 'Insights, ideas and practical guides...',
// //     AI: 'Artificial intelligence advancements...',
// //     Technology: 'Latest tech trends...',
// //     Business: 'Business strategies...',
// //     Finance: 'Financial guidance...',
// //     Insurance: 'Insurance industry trends...',
// //     Startups: 'Startup tips...',
// //     Health: 'Health and wellness insights...',
// //     Education: 'Learning strategies...',
// //   };
// //   return desc[category || 'All'] || 'Browse articles in this category.';
// // }