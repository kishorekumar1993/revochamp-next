'use client';

import { useState, useEffect, useRef } from 'react';
import { BlogSummary } from '@/types/blog';
import BlogCard from '@/components/blog/BlogCard';
import CategoryFilter from '@/components/blog/CategoryFilter';
import SearchBar from '@/components/blog/SearchBar';
import Pagination from '@/components/blog/Pagination';
import { BlogStructuredDataList } from '@/components/blog/StructuredData';

interface Props {
  initialPosts: BlogSummary[];
  initialPage: number;
  totalPages: number;
  initialCategory: string | null;
  initialQuery: string;
}

export default function BlogListClient({
  initialPosts,
  initialPage,
  totalPages: initialTotalPages,
  initialCategory,
  initialQuery,
}: Props) {
  const [posts, setPosts] = useState(initialPosts);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [category, setCategory] = useState(initialCategory);
  const [query, setQuery] = useState(initialQuery);

//   // Fetch data when page, category, or query changes

// 1. Add a ref to track if it's the first mount
const isFirstMount = useRef(true);
useEffect(() => {
  console.log('🔥 useEffect triggered:', { page, category, query });
  const abortController = new AbortController();

  const fetchData = async () => {
    setLoading(true);
    
    // Build the direct URL based on category
    let url;
    if (category && category !== 'All') {
      url = `https://json.revochamp.site/blog/category/${category.toLowerCase()}/page-${page}.json`;
    } else {
      url = `https://json.revochamp.site/blog/page/page-${page}.json`;
    }

    try {
      const res = await fetch(url, { signal: abortController.signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      let data = await res.json();
      
      // Normalize data (handle raw array or {data: []} shape)
      let postsArray = Array.isArray(data) ? data : (data.data || []);
      
      // Apply search filter if query exists
      if (query) {
        // postsArray = postsArray.filter(post =>
        postsArray = postsArray.filter((post: { title: string; excerpt: string; }) =>
          post.title?.toLowerCase().includes(query.toLowerCase()) ||
          post.excerpt?.toLowerCase().includes(query.toLowerCase())
        );
      }
      
      setPosts(postsArray);
      setTotalPages(1); // Adjust if your JSON includes totalPages
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        console.error('Fetch error:', err);
        setPosts([]);
      }
    } finally {
      setLoading(false);
    }
  };

  fetchData();
  return () => abortController.abort();
}, [page, category, query]);

// useEffect(() => {
//   // 2. Skip the very first fetch because we already have initialPosts
//   if (isFirstMount.current) {
//     isFirstMount.current = false;
//     return;
//   }

//   const abortController = new AbortController();

//   const fetchData = async () => {
//     setLoading(true);
//     const params = new URLSearchParams();
//     params.set('page', String(page));
    
//     // Normalize "All" to not send a category param
//     if (category && category !== 'All') {
//       params.set('category', category);
//     }
//     if (query) params.set('q', query);

//     try {
//       const res = await fetch(`/api/blog?${params.toString()}`, {
//         signal: abortController.signal,
//       });

//       // ✅ Log the response text if it's not OK to see the HTML error
//       if (!res.ok) {
//         const errorText = await res.text();
//         console.error("Server Error:", errorText);
//         throw new Error(`HTTP ${res.status}`);
//       }

//       const data = await res.json();
//       setPosts(data.data || []);
//       setTotalPages(data.totalPages || 1);
//     } catch (err) {
//       if (err instanceof Error && err.name !== 'AbortError') {
//         console.error('Fetch error:', err);
//         // Don't clear posts on error, or handle specifically
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchData();
//   return () => abortController.abort();
// }, [page, category, query]);

  const handleCategoryChange = (newCategory: string | null) => {
    console.log('handleCategoryChange received:', newCategory);

    setCategory(newCategory);
    setPage(1); // Reset to first page when category changes
  };

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    setPage(1); // Reset to first page when search query changes
  };

  return (
    <>
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
            <div className="flex justify-center py-20">Loading...</div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted">No articles found.</p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, idx) => (
                <BlogCard key={post.slug} post={post} featured={idx === 0} />
              ))}
            </div>
          )}

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      </div>
    </>
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
