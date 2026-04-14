
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
      // Adjust totalPages based on your API – this is a placeholder
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
    <div className="min-h-screen bg-cream">
      {/* Header with responsive padding and typography */}
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        {/* Search row: stacks on mobile, side-by-side on larger screens */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className="w-full sm:w-auto">
            <SearchBar initialQuery={query} onSearch={handleSearch} />
          </div>
          <span className="text-muted text-sm">{posts.length} articles</span>
        </div>

        {loading ? (
          // Responsive skeleton grid matching the post grid
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">

            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-96 bg-gray-200 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted">No articles found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
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
//       // You'll need to adjust totalPages – maybe from a separate endpoint
//       setTotalPages(10); // placeholder – implement based on your API
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
//       <div className="bg-ink text-white py-12 px-6 md:px-12">
//         <div className="max-w-7xl mx-auto">
//           <h1 className="font-serif text-5xl md:text-7xl font-bold">
//             {category && category !== 'All' ? category : 'All'}{' '}
//             <span className="text-gold italic">Articles</span>
//           </h1>
//           <p className="text-white/40 mt-4 max-w-2xl">
//             {getHeadlineDescription(category)}
//           </p>
//         </div>
//         <CategoryFilter activeCategory={category} onSelect={handleCategoryChange} />
//       </div>

//       <div className="max-w-7xl mx-auto px-6 py-12">
//         <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
//           <SearchBar initialQuery={query} onSearch={handleSearch} />
//           <span className="text-muted text-sm">{posts.length} articles</span>
//         </div>

//         {loading ? (
// <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
//               {[...Array(6)].map((_, i) => (
//               <div key={i} className="h-96 bg-gray-200 animate-pulse rounded-xl" />
//             ))}
//           </div>
//         ) : posts.length === 0 ? (
//           <div className="text-center py-20">
//             <p className="text-muted">No articles found.</p>
//           </div>
//         ) : (
// <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
//               {posts.map((post, idx) => (
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