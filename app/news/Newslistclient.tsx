'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface ApiResponse {
  page: number;
  totalPages: number;
  data: ApiArticle[];
}

interface ApiArticle {
  slug: string;
  title: string;
  summary: string;
  date: string;
  categories?: string[];      // some articles may not have categories
  image?: string;             // some may use featuredImage instead
  featuredImage?: string;
}

interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  categories: string[];
  image: string;
  date: string;
  author: string;
  readTime: string;
}

interface Props {
  initialCategory: string | null;
  initialQuery: string;
  initialPage: number;
}

// Helper functions
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function estimateReadTime(text: string): string {
  const words = text.split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

const AUTHORS = ['Sarah Chen', 'Michael Rodriguez', 'James Wilson', 'Emma Thompson', 'David Park', 'Lisa Anderson'];
function getRandomAuthor(): string {
  return AUTHORS[Math.floor(Math.random() * AUTHORS.length)];
}

function extractCategories(articles: ApiArticle[]): string[] {
  const categoriesSet = new Set<string>();
  articles.forEach(article => {
    if (article.categories && Array.isArray(article.categories)) {
      article.categories.forEach(cat => categoriesSet.add(cat));
    }
  });
  return ['All News', ...Array.from(categoriesSet).sort()];
}

// Components
function NewsCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-56 md:h-72 bg-gradient-to-br from-neutral-200 to-neutral-100 rounded-lg mb-4" />
      <div className="h-4 bg-neutral-200 rounded w-1/4 mb-3" />
      <div className="h-5 bg-neutral-200 rounded w-3/4 mb-2" />
      <div className="h-4 bg-neutral-200 rounded w-full mb-4" />
      <div className="h-3 bg-neutral-200 rounded w-1/3" />
    </div>
  );
}

function NewsCard({ article, featured = false }: { article: NewsArticle; featured?: boolean }) {
  return (
    <Link href={`/news/${article.slug}`}>
      <article className="group cursor-pointer h-full">
        <div className={`relative overflow-hidden rounded-lg mb-4 ${featured ? 'h-80 md:h-96' : 'h-56 md:h-72'}`}>
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={(e) => {
              // Fallback image if loading fails
              (e.target as HTMLImageElement).src = 'https://placehold.co/800x600?text=No+Image';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-4 left-4">
            <span className="inline-block px-3 py-1.5 text-xs font-bold uppercase tracking-wide bg-white/95 text-neutral-900 rounded-full">
              {article.category}
            </span>
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-3">
            <time className="text-sm text-neutral-500 font-medium">{article.date}</time>
            <span className="text-neutral-300">•</span>
            <span className="text-sm text-neutral-500">{article.readTime}</span>
          </div>
          <h3 className={`${featured ? 'text-2xl md:text-3xl' : 'text-lg md:text-xl'} font-bold text-neutral-900 group-hover:text-blue-600 transition-colors duration-200 mb-2 line-clamp-3 leading-tight`}>
            {article.title}
          </h3>
          <p className="text-sm md:text-base text-neutral-600 line-clamp-2 mb-4 group-hover:text-neutral-700 transition-colors">
            {article.excerpt}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-500 font-medium">By {article.author}</span>
            <span className="text-blue-600 font-semibold text-sm group-hover:translate-x-2 transition-transform duration-300">
              Read →
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

function CategoryFilter({
  categories,
  activeCategory,
  onSelect,
}: {
  categories: string[];
  activeCategory: string | null;
  onSelect: (cat: string | null) => void;
}) {
  return (
    <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex gap-2 overflow-x-auto py-4 -mx-4 px-4 md:mx-0 md:px-0 md:justify-start scroll-smooth">
          {categories.map((cat) => {
            const isActive = activeCategory === cat || (cat === 'All News' && !activeCategory);
            return (
              <button
                key={cat}
                onClick={() => onSelect(cat === 'All News' ? null : cat)}
                className={`px-4 py-2 text-sm font-semibold whitespace-nowrap rounded-full transition-all duration-200 flex-shrink-0 ${
                  isActive
                    ? 'bg-neutral-900 text-white shadow-lg'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SearchBar({
  initialQuery,
  onSearch,
}: {
  initialQuery: string;
  onSearch: (q: string) => void;
}) {
  const [value, setValue] = useState(initialQuery);
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(value);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className={`relative flex items-center gap-3 px-4 py-3 bg-white border rounded-lg transition-all duration-200 ${
        isFocused ? 'border-blue-500 shadow-lg ring-1 ring-blue-200' : 'border-neutral-300 hover:border-neutral-400'
      }`}>
        <svg className="w-5 h-5 text-neutral-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search news, topics, authors..."
          className="flex-1 bg-transparent outline-none text-neutral-900 placeholder-neutral-500"
        />
        {value && (
          <button
            type="button"
            onClick={() => { setValue(''); onSearch(''); }}
            className="p-1 text-neutral-400 hover:text-neutral-600"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
    </form>
  );
}

function Pagination({ currentPage, totalPages, onPageChange }: { currentPage: number; totalPages: number; onPageChange: (page: number) => void }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 py-12">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="px-4 py-2 rounded-lg border border-neutral-300 text-neutral-700 font-medium hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        ← Previous
      </button>
      <div className="flex gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-10 h-10 rounded-lg font-medium transition ${
              currentPage === page
                ? 'bg-neutral-900 text-white'
                : 'border border-neutral-300 text-neutral-700 hover:bg-neutral-100'
            }`}
          >
            {page}
          </button>
        ))}
      </div>
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="px-4 py-2 rounded-lg border border-neutral-300 text-neutral-700 font-medium hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        Next →
      </button>
    </div>
  );
}

// Main component
export default function NewsListClient({ initialCategory, initialQuery, initialPage }: Props) {
  const [allArticles, setAllArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(initialPage);
  const [category, setCategory] = useState(initialCategory);
  const [query, setQuery] = useState(initialQuery);
  const [categoriesList, setCategoriesList] = useState<string[]>(['All News']);

  // Fetch data once
  useEffect(() => {
    async function fetchArticles() {
      setLoading(true);
      try {
        const res = await fetch('https://json.revochamp.site/blog/page/page-1.json');
        if (!res.ok) throw new Error('Failed to fetch');
        const json: ApiResponse = await res.json();

        const mapped: NewsArticle[] = json.data.map((article, idx) => {
          // Safely get categories, default to ['Uncategorized']
          const cats = article.categories && Array.isArray(article.categories) && article.categories.length > 0
            ? article.categories
            : ['Uncategorized'];
          
          // Get image URL: use image field, fallback to featuredImage, then placeholder
          const imageUrl = article.image || article.featuredImage || 'https://placehold.co/800x600?text=No+Image';

          return {
            id: `${article.slug}-${idx}`,
            slug: article.slug,
            title: article.title,
            excerpt: article.summary,
            category: cats[0],
            categories: cats,
            image: imageUrl,
            date: formatDate(article.date),
            author: getRandomAuthor(),
            readTime: estimateReadTime(article.summary),
          };
        });

        setAllArticles(mapped);
        setCategoriesList(extractCategories(json.data));
      } catch (err) {
        console.error('Failed to fetch articles:', err);
        setAllArticles([]);
      } finally {
        setLoading(false);
      }
    }
    fetchArticles();
  }, []);

  // Filtered articles based on category and search
  const filteredArticles = useMemo(() => {
    let filtered = [...allArticles];
    if (category) {
      filtered = filtered.filter(article => article.categories.includes(category));
    }
    if (query.trim()) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(lowerQuery) ||
        article.excerpt.toLowerCase().includes(lowerQuery)
      );
    }
    return filtered;
  }, [allArticles, category, query]);

  // Pagination
  const ITEMS_PER_PAGE = 9;
  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);
  const paginatedArticles = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredArticles.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredArticles, page]);

  // Handlers (reset page to 1 when filters change)
  const handleCategoryChange = (newCategory: string | null) => {
    setCategory(newCategory);
    setPage(1);
  };

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
          <div className="mb-8">
            <h1 className="text-5xl md:text-6xl font-bold text-neutral-900 mb-2">News</h1>
            <p className="text-lg text-neutral-600">Stay updated with the latest insights and trends</p>
          </div>
          <SearchBar initialQuery={query} onSearch={handleSearch} />
        </div>
      </header>

      <CategoryFilter
        categories={categoriesList}
        activeCategory={category}
        onSelect={handleCategoryChange}
      />

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        <div className="mb-8">
          <p className="text-sm text-neutral-600 font-medium">
            Showing <span className="font-bold text-neutral-900">{paginatedArticles.length}</span> of{' '}
            <span className="font-bold text-neutral-900">{filteredArticles.length}</span> articles
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <NewsCardSkeleton key={i} />
            ))}
          </div>
        ) : paginatedArticles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-5xl mb-4">📰</div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-2">No articles found</h3>
            <p className="text-neutral-600">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedArticles.map((article, idx) => (
              <div key={article.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${idx * 50}ms` }}>
                <NewsCard article={article} featured={idx === 0 && paginatedArticles.length > 0} />
              </div>
            ))}
          </div>
        )}

        {paginatedArticles.length > 0 && (
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        )}
      </main>

      <footer className="border-t border-neutral-200 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-neutral-900 mb-4">NewsHub</h3>
              <p className="text-sm text-neutral-600">Your trusted source for breaking news and insights.</p>
            </div>
            <div>
              <h4 className="font-semibold text-neutral-900 mb-4">Categories</h4>
              <ul className="space-y-2 text-sm text-neutral-600">
                <li><a href="#" className="hover:text-neutral-900">Technology</a></li>
                <li><a href="#" className="hover:text-neutral-900">Business</a></li>
                <li><a href="#" className="hover:text-neutral-900">Finance</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-neutral-900 mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-neutral-600">
                <li><a href="#" className="hover:text-neutral-900">About</a></li>
                <li><a href="#" className="hover:text-neutral-900">Contact</a></li>
                <li><a href="#" className="hover:text-neutral-900">Advertise</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-neutral-900 mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-neutral-600">
                <li><a href="#" className="hover:text-neutral-900">Privacy</a></li>
                <li><a href="#" className="hover:text-neutral-900">Terms</a></li>
                <li><a href="#" className="hover:text-neutral-900">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-neutral-200 pt-8 text-center text-sm text-neutral-600">
            <p>&copy; 2026 NewsHub. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInFromBottom {
          from { transform: translateY(16px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-in {
          animation: fadeIn 0.5s ease-out forwards, slideInFromBottom 0.5s ease-out forwards;
        }
        .fade-in { animation-name: fadeIn; }
        .slide-in-from-bottom-4 { animation-name: slideInFromBottom; }
      `}</style>
    </div>
  );
}
// 'use client';

// import { useState, useEffect, useCallback } from 'react';
// import Link from 'next/link';
// import Image from 'next/image';
// import dynamic from 'next/dynamic';

// interface NewsArticle {
//   id: string;
//   slug: string;
//   title: string;
//   excerpt: string;
//   category: string;
//   image: string;
//   date: string;
//   author: string;
//   readTime: string;
//   featured?: boolean;
// }

// interface Props {
//   initialCategory: string | null;
//   initialQuery: string;
//   initialPage: number;
// }

// const NEWS_CATEGORIES = [
//   'All News',
//   'Technology',
//   'Business',
//   'Finance',
//   'Startups',
//   'AI & ML',
//   'Markets',
//   'Trends',
// ];

// function NewsCardSkeleton() {
//   return (
//     <div className="animate-pulse">
//       <div className="h-56 md:h-72 bg-gradient-to-br from-neutral-200 to-neutral-100 rounded-lg mb-4" />
//       <div className="h-4 bg-neutral-200 rounded w-1/4 mb-3" />
//       <div className="h-5 bg-neutral-200 rounded w-3/4 mb-2" />
//       <div className="h-4 bg-neutral-200 rounded w-full mb-4" />
//       <div className="h-3 bg-neutral-200 rounded w-1/3" />
//     </div>
//   );
// }

// function NewsCard({ article, featured = false }: { article: NewsArticle; featured?: boolean }) {
//   return (
//     <Link href={`/news/${article.slug}`}>
//       <article className="group cursor-pointer h-full">
//         {/* Image Container */}
//         <div className={`relative overflow-hidden rounded-lg mb-4 ${featured ? 'h-80 md:h-96' : 'h-56 md:h-72'}`}>
//           <Image
//             src={article.image}
//             alt={article.title}
//             fill
//             className="object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
//             sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//           />
//           {/* Overlay */}
//           <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
//           {/* Category Badge */}
//           <div className="absolute top-4 left-4">
//             <span className="inline-block px-3 py-1.5 text-xs font-bold uppercase tracking-wide bg-white/95 text-neutral-900 rounded-full">
//               {article.category}
//             </span>
//           </div>
//         </div>

//         {/* Content */}
//         <div>
//           {/* Meta Info */}
//           <div className="flex items-center gap-2 mb-3">
//             <time className="text-sm text-neutral-500 font-medium">{article.date}</time>
//             <span className="text-neutral-300">•</span>
//             <span className="text-sm text-neutral-500">{article.readTime}</span>
//           </div>

//           {/* Title */}
//           <h3 className={`${featured ? 'text-2xl md:text-3xl' : 'text-lg md:text-xl'} font-bold text-neutral-900 group-hover:text-blue-600 transition-colors duration-200 mb-2 line-clamp-3 leading-tight`}>
//             {article.title}
//           </h3>

//           {/* Excerpt */}
//           <p className="text-sm md:text-base text-neutral-600 line-clamp-2 mb-4 group-hover:text-neutral-700 transition-colors">
//             {article.excerpt}
//           </p>

//           {/* Author & Read More */}
//           <div className="flex items-center justify-between">
//             <span className="text-xs text-neutral-500 font-medium">By {article.author}</span>
//             <span className="text-blue-600 font-semibold text-sm group-hover:translate-x-2 transition-transform duration-300">
//               Read →
//             </span>
//           </div>
//         </div>
//       </article>
//     </Link>
//   );
// }

// function CategoryFilter({
//   activeCategory,
//   onSelect,
// }: {
//   activeCategory: string | null;
//   onSelect: (cat: string | null) => void;
// }) {
//   return (
//     <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-neutral-200">
//       <div className="max-w-7xl mx-auto px-4 md:px-6">
//         <div className="flex gap-2 overflow-x-auto py-4 -mx-4 px-4 md:mx-0 md:px-0 md:justify-start scroll-smooth">
//           {NEWS_CATEGORIES.map((cat) => {
//             const isActive = activeCategory === cat || (cat === 'All News' && !activeCategory);
//             return (
//               <button
//                 key={cat}
//                 onClick={() => onSelect(cat === 'All News' ? null : cat)}
//                 className={`px-4 py-2 text-sm font-semibold whitespace-nowrap rounded-full transition-all duration-200 flex-shrink-0 ${
//                   isActive
//                     ? 'bg-neutral-900 text-white shadow-lg'
//                     : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
//                 }`}
//               >
//                 {cat}
//               </button>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// }

// function SearchBar({
//   initialQuery,
//   onSearch,
// }: {
//   initialQuery: string;
//   onSearch: (q: string) => void;
// }) {
//   const [value, setValue] = useState(initialQuery);
//   const [isFocused, setIsFocused] = useState(false);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     onSearch(value);
//   };

//   return (
//     <form onSubmit={handleSubmit} className="w-full max-w-2xl">
//       <div className={`relative flex items-center gap-3 px-4 py-3 bg-white border rounded-lg transition-all duration-200 ${
//         isFocused ? 'border-blue-500 shadow-lg ring-1 ring-blue-200' : 'border-neutral-300 hover:border-neutral-400'
//       }`}>
//         <svg className="w-5 h-5 text-neutral-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//         </svg>
        
//         <input
//           type="text"
//           value={value}
//           onChange={(e) => setValue(e.target.value)}
//           onFocus={() => setIsFocused(true)}
//           onBlur={() => setIsFocused(false)}
//           placeholder="Search news, topics, authors..."
//           className="flex-1 bg-transparent outline-none text-neutral-900 placeholder-neutral-500"
//         />

//         {value && (
//           <button
//             type="button"
//             onClick={() => { setValue(''); onSearch(''); }}
//             className="p-1 text-neutral-400 hover:text-neutral-600"
//           >
//             <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//               <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
//             </svg>
//           </button>
//         )}
//       </div>
//     </form>
//   );
// }

// function Pagination({ currentPage, totalPages, onPageChange }: { currentPage: number; totalPages: number; onPageChange: (page: number) => void }) {
//   if (totalPages <= 1) return null;

//   return (
//     <div className="flex items-center justify-center gap-2 py-12">
//       <button
//         disabled={currentPage === 1}
//         onClick={() => onPageChange(currentPage - 1)}
//         className="px-4 py-2 rounded-lg border border-neutral-300 text-neutral-700 font-medium hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
//       >
//         ← Previous
//       </button>

//       <div className="flex gap-1">
//         {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//           <button
//             key={page}
//             onClick={() => onPageChange(page)}
//             className={`w-10 h-10 rounded-lg font-medium transition ${
//               currentPage === page
//                 ? 'bg-neutral-900 text-white'
//                 : 'border border-neutral-300 text-neutral-700 hover:bg-neutral-100'
//             }`}
//           >
//             {page}
//           </button>
//         ))}
//       </div>

//       <button
//         disabled={currentPage === totalPages}
//         onClick={() => onPageChange(currentPage + 1)}
//         className="px-4 py-2 rounded-lg border border-neutral-300 text-neutral-700 font-medium hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
//       >
//         Next →
//       </button>
//     </div>
//   );
// }

// export default function NewsListClient({ initialCategory, initialQuery, initialPage }: Props) {
//   const [articles, setArticles] = useState<NewsArticle[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [page, setPage] = useState(initialPage);
//   const [totalPages, setTotalPages] = useState(1);
//   const [category, setCategory] = useState(initialCategory);
//   const [query, setQuery] = useState(initialQuery);

//   const fetchArticles = useCallback(async () => {
//     setLoading(true);
//     try {
//       let url = `https://api.example.com/news`;
//       if (category) url += `?category=${category}`;
//       if (query) url += `${category ? '&' : '?'}q=${query}&page=${page}`;
      
//       // Mock data - replace with real API
//       const mockArticles: NewsArticle[] = [
//         {
//           id: '1',
//           slug: 'ai-revolution-2024',
//           title: 'The AI Revolution: How Machine Learning is Reshaping Industries',
//           excerpt: 'Artificial intelligence continues to transform business landscapes at an unprecedented pace.',
//           category: 'AI & ML',
//           image: 'https://images.unsplash.com/photo-1677442d019cecf8dc0b47dc1d4d27c0?w=800&h=600&fit=crop',
//           date: 'Jan 15, 2024',
//           author: 'Sarah Chen',
//           readTime: '8 min read',
//           featured: true,
//         },
//         {
//           id: '2',
//           slug: 'startup-funding-surge',
//           title: 'Startup Funding Reaches $50B in Q1 2024',
//           excerpt: 'Despite economic headwinds, venture capital continues to pour into innovative startups.',
//           category: 'Startups',
//           image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
//           date: 'Jan 14, 2024',
//           author: 'Michael Rodriguez',
//           readTime: '6 min read',
//         },
//         {
//           id: '3',
//           slug: 'tech-stock-rally',
//           title: 'Tech Stocks Rally on Strong Earnings Reports',
//           excerpt: 'Major technology companies exceed investor expectations in Q4 earnings.',
//           category: 'Markets',
//           image: 'https://images.unsplash.com/photo-1611974259348-dfb5b5b5b2f0?w=800&h=600&fit=crop',
//           date: 'Jan 13, 2024',
//           author: 'James Wilson',
//           readTime: '5 min read',
//         },
//         {
//           id: '4',
//           slug: 'crypto-comeback',
//           title: 'Cryptocurrency Market Shows Signs of Recovery',
//           excerpt: 'Bitcoin and Ethereum surge amid renewed investor confidence.',
//           category: 'Finance',
//           image: 'https://images.unsplash.com/photo-1621504211117-ba8f672f237b?w=800&h=600&fit=crop',
//           date: 'Jan 12, 2024',
//           author: 'Emma Thompson',
//           readTime: '7 min read',
//         },
//         {
//           id: '5',
//           slug: 'web3-future',
//           title: 'The Future of Web3: Decentralized or Centralized?',
//           excerpt: 'Industry experts debate the true nature of decentralized internet.',
//           category: 'Technology',
//           image: 'https://images.unsplash.com/photo-1639322537231-2f206e06af84?w=800&h=600&fit=crop',
//           date: 'Jan 11, 2024',
//           author: 'David Park',
//           readTime: '9 min read',
//         },
//         {
//           id: '6',
//           slug: 'business-trends-2024',
//           title: '5 Business Trends to Watch in 2024',
//           excerpt: 'From automation to sustainability, here are the trends shaping business.',
//           category: 'Business',
//           image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
//           date: 'Jan 10, 2024',
//           author: 'Lisa Anderson',
//           readTime: '6 min read',
//         },
//       ];

//       setArticles(mockArticles);
//       setTotalPages(3);
//     } catch (err) {
//       console.error('Failed to fetch articles:', err);
//       setArticles([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [page, category, query]);

//   useEffect(() => {
//     fetchArticles();
//   }, [fetchArticles]);

//   const handleCategoryChange = (newCategory: string | null) => {
//     setCategory(newCategory);
//     setPage(1);
//   };

//   const handleSearch = (newQuery: string) => {
//     setQuery(newQuery);
//     setPage(1);
//   };

//   return (
//     <div className="min-h-screen bg-white">
//       {/* Header */}
//       <header className="border-b border-neutral-200">
//         <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
//           <div className="mb-8">
//             <h1 className="text-5xl md:text-6xl font-bold text-neutral-900 mb-2">News</h1>
//             <p className="text-lg text-neutral-600">Stay updated with the latest insights and trends</p>
//           </div>
//           <SearchBar initialQuery={query} onSearch={handleSearch} />
//         </div>
//       </header>

//       {/* Category Filter */}
//       <CategoryFilter activeCategory={category} onSelect={handleCategoryChange} />

//       {/* Main Content */}
//       <main className="max-w-7xl mx-auto px-4 md:px-6 py-12">
//         {/* Article Count */}
//         <div className="mb-8">
//           <p className="text-sm text-neutral-600 font-medium">
//             Showing <span className="font-bold text-neutral-900">{articles.length}</span> articles
//           </p>
//         </div>

//         {loading ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {[...Array(6)].map((_, i) => (
//               <NewsCardSkeleton key={i} />
//             ))}
//           </div>
//         ) : articles.length === 0 ? (
//           <div className="flex flex-col items-center justify-center py-20">
//             <div className="text-5xl mb-4">📰</div>
//             <h3 className="text-2xl font-bold text-neutral-900 mb-2">No articles found</h3>
//             <p className="text-neutral-600">Try adjusting your search or filters</p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {articles.map((article, idx) => (
//               <div key={`${article.slug}-${idx}`} className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${idx * 50}ms` }}>
//                 <NewsCard article={article} featured={idx === 0 && articles.length > 0} />
//               </div>
//             ))}
//           </div>
//         )}

//         {articles.length > 0 && (
//           <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
//         )}
//       </main>

//       {/* Footer */}
//       <footer className="border-t border-neutral-200 bg-neutral-50">
//         <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
//             <div>
//               <h3 className="font-bold text-neutral-900 mb-4">NewsHub</h3>
//               <p className="text-sm text-neutral-600">Your trusted source for breaking news and insights.</p>
//             </div>
//             <div>
//               <h4 className="font-semibold text-neutral-900 mb-4">Categories</h4>
//               <ul className="space-y-2 text-sm text-neutral-600">
//                 <li><a href="#" className="hover:text-neutral-900">Technology</a></li>
//                 <li><a href="#" className="hover:text-neutral-900">Business</a></li>
//                 <li><a href="#" className="hover:text-neutral-900">Finance</a></li>
//               </ul>
//             </div>
//             <div>
//               <h4 className="font-semibold text-neutral-900 mb-4">Company</h4>
//               <ul className="space-y-2 text-sm text-neutral-600">
//                 <li><a href="#" className="hover:text-neutral-900">About</a></li>
//                 <li><a href="#" className="hover:text-neutral-900">Contact</a></li>
//                 <li><a href="#" className="hover:text-neutral-900">Advertise</a></li>
//               </ul>
//             </div>
//             <div>
//               <h4 className="font-semibold text-neutral-900 mb-4">Legal</h4>
//               <ul className="space-y-2 text-sm text-neutral-600">
//                 <li><a href="#" className="hover:text-neutral-900">Privacy</a></li>
//                 <li><a href="#" className="hover:text-neutral-900">Terms</a></li>
//                 <li><a href="#" className="hover:text-neutral-900">Cookies</a></li>
//               </ul>
//             </div>
//           </div>
//           <div className="border-t border-neutral-200 pt-8 text-center text-sm text-neutral-600">
//             <p>&copy; 2024 NewsHub. All rights reserved.</p>
//           </div>
//         </div>
//       </footer>

//       <style>{`
//         @keyframes fadeIn {
//           from { opacity: 0; }
//           to { opacity: 1; }
//         }
//         @keyframes slideInFromBottom {
//           from { transform: translateY(16px); opacity: 0; }
//           to { transform: translateY(0); opacity: 1; }
//         }
//         .animate-in {
//           animation: fadeIn 0.5s ease-out forwards, slideInFromBottom 0.5s ease-out forwards;
//         }
//         .fade-in { animation-name: fadeIn; }
//         .slide-in-from-bottom-4 { animation-name: slideInFromBottom; }
//       `}</style>
//     </div>
//   );
// }