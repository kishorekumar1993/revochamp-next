
'use client';

import { useState, useEffect, useCallback } from 'react';
import { BlogSummary } from '@/types/blog';
import BlogCard from '@/components/blog/BlogCard';
import CategoryFilter from '@/components/blog/CategoryFilter';
import SearchBar from '@/components/blog/SearchBar';
import Pagination from '@/components/blog/Pagination';
import dynamic from 'next/dynamic';

// Dynamically import non-critical components
const LazyBlogCard = dynamic(() => import('@/components/blog/BlogCard'), {
  loading: () => <div className="h-96 bg-gray-100 animate-pulse rounded-xl" />,
});

interface Props {
  initialCategory: string | null;
  initialQuery: string;
  initialPage: number;
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
      // You'll need to adjust totalPages – maybe from a separate endpoint
      setTotalPages(10); // placeholder – implement based on your API
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
    <div className="min-h-screen bg-cream">
      <div className="bg-ink text-white py-12 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-serif text-5xl md:text-7xl font-bold">
            {category && category !== 'All' ? category : 'All'}{' '}
            <span className="text-gold italic">Articles</span>
          </h1>
          <p className="text-white/40 mt-4 max-w-2xl">
            {getHeadlineDescription(category)}
          </p>
        </div>
        <CategoryFilter activeCategory={category} onSelect={handleCategoryChange} />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <SearchBar initialQuery={query} onSearch={handleSearch} />
          <span className="text-muted text-sm">{posts.length} articles</span>
        </div>

        {loading ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-96 bg-gray-200 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted">No articles found.</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, idx) => (
              <LazyBlogCard key={`${post.slug}-${idx}`} post={post} featured={idx === 0} />
            ))}
          </div>
        )}

        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
}

function getHeadlineDescription(category: string | null): string {
  const desc: Record<string, string> = {
    All: 'Insights, ideas and practical guides...',
    AI: 'Artificial intelligence advancements...',
    Technology: 'Latest tech trends...',
    Business: 'Business strategies...',
    Finance: 'Financial guidance...',
    Insurance: 'Insurance industry trends...',
    Startups: 'Startup tips...',
    Health: 'Health and wellness insights...',
    Education: 'Learning strategies...',
  };
  return desc[category || 'All'] || 'Browse articles in this category.';
}

// 'use client';

// import { useState, useEffect, useRef } from 'react';
// import { BlogSummary } from '@/types/blog';
// import BlogCard from '@/components/blog/BlogCard';
// import CategoryFilter from '@/components/blog/CategoryFilter';
// import SearchBar from '@/components/blog/SearchBar';
// import Pagination from '@/components/blog/Pagination';

// interface Props {
//   initialPosts: BlogSummary[];
//   initialPage: number;
//   totalPages: number;
//   initialCategory: string | null;
//   initialQuery: string;
// }

// export default function BlogListClient({
//   initialPosts,
//   initialPage,
//   totalPages: initialTotalPages,
//   initialCategory,
//   initialQuery,
// }: Props) {
//   const [posts, setPosts] = useState(initialPosts);
//   const [loading, setLoading] = useState(false);
//   const [page, setPage] = useState(initialPage);
//   const [totalPages, setTotalPages] = useState(initialTotalPages);
//   const [category, setCategory] = useState(initialCategory);
//   const [query, setQuery] = useState(initialQuery);

// //   // Fetch data when page, category, or query changes

// // 1. Add a ref to track if it's the first mount
// const isFirstMount = useRef(true);
// useEffect(() => {
//   const abortController = new AbortController();

//   const fetchData = async () => {
//     setLoading(true);
    
//     // Build the direct URL based on category
//     let url;
//     if (category && category !== 'All') {
//       url = `https://json.revochamp.site/blog/category/${category.toLowerCase()}/page-${page}.json`;
//     } else {
//       url = `https://json.revochamp.site/blog/page/page-${page}.json`;
//     }

//     try {
//       const res = await fetch(url, { signal: abortController.signal });
//       if (!res.ok) throw new Error(`HTTP ${res.status}`);
//       let data = await res.json();
      
//       // Normalize data (handle raw array or {data: []} shape)
//       let postsArray = Array.isArray(data) ? data : (data.data || []);
      
//       // Apply search filter if query exists
//       if (query) {
//         // postsArray = postsArray.filter(post =>
//         postsArray = postsArray.filter((post: { title: string; excerpt: string; }) =>
//           post.title?.toLowerCase().includes(query.toLowerCase()) ||
//           post.excerpt?.toLowerCase().includes(query.toLowerCase())
//         );
//       }
      
//       setPosts(postsArray);
//       setTotalPages(1); // Adjust if your JSON includes totalPages
//     } catch (err) {
//       if (err instanceof Error && err.name !== 'AbortError') {
//         console.error('Fetch error:', err);
//         setPosts([]);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchData();
//   return () => abortController.abort();
// }, [page, category, query]);


//   const handleCategoryChange = (newCategory: string | null) => {
    
//     setCategory(newCategory);
//     setPage(1); // Reset to first page when category changes
//   };

//   const handleSearch = (newQuery: string) => {
//     setQuery(newQuery);
//     setPage(1); // Reset to first page when search query changes
//   };

//   return (
//     <>
//       <div className="min-h-screen bg-cream">
//         <div className="bg-ink text-white py-12 px-6 md:px-12">
//           <div className="max-w-7xl mx-auto">
//             {/* <h1 className="font-serif text-5xl md:text-7xl font-bold"> */}
//               <h1 className="font-serif text-5xl md:text-7xl font-bold min-h-[80px]">
//               {category && category !== 'All' ? category : 'All'}{' '}
//               <span className="text-gold italic">Articles</span>
//             </h1>
//             {/* <p className="text-white/40 mt-4 max-w-2xl"> */}
//               <p className="text-white/40 mt-4 max-w-2xl min-h-[24px]">
//               {getHeadlineDescription(category)}
//             </p>
//           </div>
//           <CategoryFilter activeCategory={category} onSelect={handleCategoryChange} />
//         </div>

//         <div className="max-w-7xl mx-auto px-6 py-12">
//           <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
//             <SearchBar initialQuery={query} onSearch={handleSearch} />
//             <span className="text-muted text-sm">{posts.length} articles</span>
//           </div>

//           {loading ? (
//             <div className="flex justify-center py-20">Loading...</div>
//           ) : posts.length === 0 ? (
//             <div className="text-center py-20">
//               <p className="text-muted">No articles found.</p>
//             </div>
//           ) : (
//             // <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
//             <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 min-h-[600px]">
//               {posts.map((post, idx) => (
//                 <BlogCard key={`${post.slug}-${idx}`} post={post} featured={idx === 0} />
//                 // <BlogCard key={post.slug} post={post} featured={idx === 0} />
//               ))}
//             </div>
//           )}

//           <Pagination
//             currentPage={page}
//             totalPages={totalPages}
//             onPageChange={setPage}
//           />
//         </div>
//       </div>
//     </>
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
