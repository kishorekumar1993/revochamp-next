'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface ArticleStats {
  value: string;
  label: string;
}

interface ContentBlock {
  type: 'heading' | 'text' | 'cta' | 'tip' | 'divider' | 'feature_box' | 'list' | 'stat_card' | 'insight';
  value: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface ArticleData {
  slug: string;
  title: string;
  subtitle: string;
  author: string;
  date: string;
  categories: string[];
  tags: string[];
  readTime: string;
  featuredImage: string;
  stats: ArticleStats[];
  content: ContentBlock[];
  faq: FAQItem[];
  related: string[];
}

export function NewsDetailClient({ article }: { article: ArticleData }) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const formattedDate = new Date(article.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (window.scrollY / scrollHeight) * 100;
      setScrollProgress(scrolled);
      setIsHeaderSticky(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Helper to parse markdown-like formatting (bold, links, etc.)
  const parseMarkdown = (text: string) => {
    // Convert **bold** to <strong>
    let processed = text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-neutral-900">$1</strong>');
    // Convert *italic* to <em>
    processed = processed.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
    // Convert bullet points (lines starting with - or •) to list items
    processed = processed.replace(/^[•\-]\s+(.*)$/gm, '<li class="ml-4 mb-1">$1</li>');
    return <span dangerouslySetInnerHTML={{ __html: processed }} />;
  };

  const renderContent = (block: ContentBlock, idx: number) => {
    switch (block.type) {
      case 'heading':
        return (
          <h2 key={idx} className="text-2xl md:text-3xl font-bold mt-12 mb-4 text-neutral-900 scroll-mt-20">
            {block.value}
          </h2>
        );

      case 'text':
        const lines = block.value.split('\n');
        return (
          <div key={idx} className="prose prose-lg max-w-none mb-6">
            {lines.map((line, i) => {
              if (line.includes(':') && !line.startsWith('-') && !line.startsWith('•')) {
                const [key, ...rest] = line.split(':');
                const value = rest.join(':').trim();
                return (
                  <p key={i} className="mb-2">
                    <strong className="text-neutral-900">{key.trim()}:</strong> {value}
                  </p>
                );
              }
              return <p key={i} className="mb-4 leading-relaxed">{line}</p>;
            })}
          </div>
        );

      case 'tip':
        return (
          <div key={idx} className="bg-amber-50 border-l-4 border-amber-500 rounded-r-lg p-5 my-6">
            <div className="flex items-start gap-3">
              <span className="text-amber-600 text-xl">💡</span>
              <div className="flex-1 text-amber-800">
                {parseMarkdown(block.value)}
              </div>
            </div>
          </div>
        );

      case 'insight':
        return (
          <div key={idx} className="bg-blue-50 border-l-4 border-blue-500 rounded-r-lg p-5 my-6">
            <div className="flex items-start gap-3">
              <span className="text-blue-600 text-xl">⚖️</span>
              <div className="flex-1 text-blue-800 font-medium">
                {parseMarkdown(block.value)}
              </div>
            </div>
          </div>
        );

      case 'feature_box':
        return (
          <div key={idx} className="bg-gradient-to-br from-neutral-50 to-neutral-100 border border-neutral-200 rounded-xl p-6 my-8 shadow-sm">
            <div className="prose prose-neutral max-w-none">
              {block.value.split('\n\n').map((paragraph, i) => {
                if (paragraph.startsWith('-') || paragraph.startsWith('•')) {
                  const items = paragraph.split('\n').filter(l => l.trim());
                  return (
                    <ul key={i} className="space-y-2 mt-2">
                      {items.map((item, j) => (
                        <li key={j} className="flex items-start gap-2">
                          <span className="text-blue-600 mt-1">▹</span>
                          <span>{item.replace(/^[•\-]\s*/, '')}</span>
                        </li>
                      ))}
                    </ul>
                  );
                }
                return <p key={i} className="mb-2">{parseMarkdown(paragraph)}</p>;
              })}
            </div>
          </div>
        );

      case 'list':
        return (
          <div key={idx} className="my-6">
            <div className="prose prose-lg max-w-none">
              {block.value.split('\n\n').map((section, i) => {
                if (section.includes(':\n')) {
                  const [title, ...rest] = section.split(':\n');
                  const listText = rest.join(':\n');
                  return (
                    <div key={i}>
                      <h3 className="text-xl font-semibold mt-4 mb-2">{title}</h3>
                      <ul className="space-y-2 mb-4">
                        {listText.split('\n').filter(l => l.trim()).map((item, j) => (
                          <li key={j} className="flex items-start gap-2">
                            <span className="text-blue-600 mt-1">•</span>
                            <span>{item.replace(/^[•\-]\s*/, '')}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                }
                if (section.startsWith('-') || section.startsWith('•')) {
                  const items = section.split('\n').filter(l => l.trim());
                  return (
                    <ul key={i} className="space-y-2 my-4">
                      {items.map((item, j) => (
                        <li key={j} className="flex items-start gap-2">
                          <span className="text-blue-600 mt-1">•</span>
                          <span>{item.replace(/^[•\-]\s*/, '')}</span>
                        </li>
                      ))}
                    </ul>
                  );
                }
                return <p key={i} className="mb-3">{parseMarkdown(section)}</p>;
              })}
            </div>
          </div>
        );

      case 'stat_card':
        return (
          <div key={idx} className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 my-8 text-white shadow-lg">
            <div className="flex items-center justify-center text-center">
              <p className="text-xl font-semibold leading-relaxed">
                {parseMarkdown(block.value)}
              </p>
            </div>
          </div>
        );

      case 'divider':
        return (
          <div key={idx} className="relative my-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-neutral-400 text-sm">✦ ✦ ✦</span>
            </div>
          </div>
        );

      case 'cta':
        return (
          <div key={idx} className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 my-10 text-center shadow-lg">
            <p className="text-white text-xl font-semibold">{parseMarkdown(block.value)}</p>
            <button className="mt-6 px-8 py-3 bg-white text-blue-600 rounded-lg font-bold hover:bg-blue-50 transition transform hover:scale-105">
              Get Started
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Progress Bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-blue-600 to-blue-400 z-50 transition-all duration-300"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Sticky Header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isHeaderSticky ? 'bg-white/95 backdrop-blur-md border-b border-neutral-200 shadow-sm' : 'bg-white'
        }`}
      >
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <Link href="/news" className="font-bold text-neutral-900 hover:text-blue-600 transition flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to News
          </Link>
          {isHeaderSticky && (
            <h1 className="hidden md:block text-lg font-bold text-neutral-900 flex-1 mx-4 truncate">
              {article.title}
            </h1>
          )}
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-lg border border-neutral-300 text-neutral-700 font-medium hover:bg-neutral-100 transition flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 md:px-6 py-12">
        <article>
          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-6">
            {article.categories.map((cat) => (
              <Link
                key={cat}
                href={`/news?category=${encodeURIComponent(cat)}`}
                className="inline-block px-4 py-1.5 text-xs font-bold uppercase tracking-wide bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition"
              >
                {cat}
              </Link>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 mb-4 leading-tight">
            {article.title}
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-neutral-600 mb-6 leading-relaxed">
            {article.subtitle}
          </p>

          {/* Stats Row */}
          {/* {article.stats && article.stats.length > 0 && (
            <div className="flex flex-wrap gap-6 mb-8 border-y border-neutral-200 py-4">
              {article.stats.map((stat) => (
                <div key={stat.label} className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-neutral-900">{stat.value}</span>
                  <span className="text-sm text-neutral-500">{stat.label}</span>
                </div>
              ))}
            </div>
          )} */}
{article.stats?.length > 0 && (
  <div className="flex flex-wrap gap-6 border-y border-neutral-200 py-4 mb-8" aria-label="Article statistics">
    <ul className="flex flex-wrap gap-6">
      {article.stats.map((stat, index) => (
        <li key={index} className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-neutral-900 tabular-nums">
            {typeof stat.value === 'number' ? stat.value : stat.value}
          </span>
          <span className="text-sm text-neutral-500">{stat.label}</span>
        </li>
      ))}
    </ul>
  </div>
)}
          {/* Article Meta */}
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center border-t border-b border-neutral-200 py-6 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                {article.author.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-neutral-900">{article.author}</p>
                <p className="text-sm text-neutral-500">Digital Economy Analyst</p>
              </div>
            </div>
            <div className="flex gap-6 md:gap-8 ml-auto text-sm text-neutral-600">
              <div>
                <span className="block text-xs text-neutral-400 mb-1">Published</span>
                <time className="font-medium">{formattedDate}</time>
              </div>
              <div>
                <span className="block text-xs text-neutral-400 mb-1">Reading Time</span>
                <span className="font-medium">{article.readTime}</span>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="mb-12">
            <div className="relative h-96 md:h-[500px] w-full rounded-xl overflow-hidden shadow-md">
              <Image
                src={article.featuredImage}
                alt={article.title}
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
                priority
              />
            </div>
          </div>

          {/* Dynamic Content */}
          <div className="mb-12">
            {article.content.map((block, idx) => renderContent(block, idx))}
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="border-t border-neutral-200 pt-8 mb-12">
              <h3 className="text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l5 5a2 2 0 01.586 1.414V19a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z" />
                </svg>
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/news?q=${encodeURIComponent(tag)}`}
                    className="px-4 py-2 rounded-full bg-neutral-100 text-neutral-700 text-sm font-medium hover:bg-neutral-200 hover:text-neutral-900 transition"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* FAQ Section */}
          {article.faq && article.faq.length > 0 && (
            <div className="border-t border-neutral-200 pt-8 mb-12">
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {article.faq.map((faq, idx) => (
                  <div key={idx} className="border border-neutral-200 rounded-lg overflow-hidden shadow-sm">
                    <button
                      onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                      className="w-full text-left px-6 py-4 bg-neutral-50 hover:bg-neutral-100 transition flex justify-between items-center"
                    >
                      <span className="font-semibold text-neutral-900">{faq.question}</span>
                      <svg
                        className={`w-5 h-5 text-neutral-600 transition-transform duration-200 ${activeFaq === idx ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {activeFaq === idx && (
                      <div className="px-6 py-4 border-t border-neutral-200 bg-white">
                        <p className="text-neutral-600 leading-relaxed">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Articles */}
          {article.related && article.related.length > 0 && (
            <div className="border-t border-neutral-200 pt-8">
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">You Might Also Like</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {article.related.map((slug) => (
                  <Link
                    key={slug}
                    href={`/news/${slug}`}
                    className="group block p-5 border border-neutral-200 rounded-xl hover:shadow-md transition-all duration-300 bg-white"
                  >
                    <h3 className="font-semibold text-neutral-900 group-hover:text-blue-600 transition line-clamp-2">
                      {slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </h3>
                    <div className="mt-3 flex items-center text-blue-600 text-sm font-medium group-hover:translate-x-1 transition">
                      Read article
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* Newsletter Signup */}
        <section className="mt-16 py-12 px-8 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl text-white shadow-xl">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-3">Stay Ahead with Our Newsletter</h2>
            <p className="text-blue-100 mb-6">
              Get the latest insights, trends, and expert tips delivered straight to your inbox.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-5 py-3 rounded-lg text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-white"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-lg bg-white text-blue-600 font-bold hover:bg-blue-50 transition transform hover:scale-105"
              >
                Subscribe
              </button>
            </form>
            <p className="text-xs text-blue-100 mt-4">No spam, unsubscribe anytime.</p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 bg-neutral-50 mt-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-neutral-900 mb-4 text-lg">NewsHub</h3>
              <p className="text-sm text-neutral-600">Your trusted source for breaking news and insights.</p>
            </div>
            <div>
              <h4 className="font-semibold text-neutral-900 mb-4">Categories</h4>
              <ul className="space-y-2 text-sm text-neutral-600">
                <li><Link href="/news?category=Technology" className="hover:text-neutral-900">Technology</Link></li>
                <li><Link href="/news?category=Business" className="hover:text-neutral-900">Business</Link></li>
                <li><Link href="/news?category=Finance" className="hover:text-neutral-900">Finance</Link></li>
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
            <p>&copy; {new Date().getFullYear()} NewsHub. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style>{`
        .prose {
          --tw-prose-body: #3b3b3b;
          --tw-prose-headings: #171717;
          --tw-prose-links: #2563eb;
          --tw-prose-bold: #171717;
        }
        .prose p {
          margin-bottom: 1.25rem;
        }
        .prose strong {
          color: #171717;
        }
        .scroll-mt-20 {
          scroll-margin-top: 5rem;
        }
      `}</style>
    </div>
  );
}

// 'use client';

// import { useState, useEffect, useRef } from 'react';
// import Image from 'next/image';
// import Link from 'next/link';

// // Types (same as above)
// interface ArticleStats {
//   value: string;
//   label: string;
// }

// interface ContentBlock {
//   type: 'heading' | 'text' | 'cta';
//   value: string;
// }

// interface FAQItem {
//   question: string;
//   answer: string;
// }

// interface ArticleData {
//   slug: string;
//   title: string;
//   subtitle: string;
//   author: string;
//   date: string;
//   categories: string[];
//   tags: string[];
//   readTime: string;
//   featuredImage: string;
//   stats: ArticleStats[];
//   content: ContentBlock[];
//   faq: FAQItem[];
//   related: string[];
// }

// export function NewsDetailClient({ article }: { article: ArticleData }) {
//   const [scrollProgress, setScrollProgress] = useState(0);
//   const [isHeaderSticky, setIsHeaderSticky] = useState(false);
//   const [activeFaq, setActiveFaq] = useState<number | null>(null);
//   const contentRef = useRef<HTMLDivElement>(null);

//   // Format date
//   const formattedDate = new Date(article.date).toLocaleDateString('en-US', {
//     year: 'numeric',
//     month: 'long',
//     day: 'numeric',
//   });

//   // Scroll progress and sticky header
//   useEffect(() => {
//     const handleScroll = () => {
//       const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
//       const scrolled = (window.scrollY / scrollHeight) * 100;
//       setScrollProgress(scrolled);
//       setIsHeaderSticky(window.scrollY > 100);
//     };
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   // Helper to render content blocks
//   const renderContent = (block: ContentBlock) => {
//     switch (block.type) {
//       case 'heading':
//         return (
//           <h2 key={block.value} className="text-2xl md:text-3xl font-bold mt-12 mb-4 text-neutral-900">
//             {block.value}
//           </h2>
//         );
//       case 'text':
//         // Handle multi-line text (like "Company: ...\nFund Type: ...")
//         const lines = block.value.split('\n');
//         return (
//           <div key={block.value} className="prose prose-lg max-w-none mb-6">
//             {lines.map((line, idx) => {
//               if (line.includes(':') && !line.startsWith('-')) {
//                 const [key, ...rest] = line.split(':');
//                 const value = rest.join(':').trim();
//                 return (
//                   <p key={idx} className="mb-2">
//                     <strong className="text-neutral-900">{key.trim()}:</strong> {value}
//                   </p>
//                 );
//               }
//               return <p key={idx} className="mb-4">{line}</p>;
//             })}
//           </div>
//         );
//       case 'cta':
//         return (
//           <div key={block.value} className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 my-8 text-center">
//             <p className="text-white text-lg font-semibold">{block.value}</p>
//             <button className="mt-4 px-6 py-2 bg-white text-blue-600 rounded-lg font-bold hover:bg-blue-50 transition">
//               Get Started
//             </button>
//           </div>
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-white">
//       {/* Progress Bar */}
//       <div
//         className="fixed top-0 left-0 h-1 bg-gradient-to-r from-blue-600 to-blue-400 z-50 transition-all duration-300"
//         style={{ width: `${scrollProgress}%` }}
//       />

//       {/* Sticky Header */}
//       <header
//         className={`sticky top-0 z-40 transition-all duration-300 ${
//           isHeaderSticky ? 'bg-white/95 backdrop-blur-md border-b border-neutral-200' : 'bg-white'
//         }`}
//       >
//         <div className="max-w-4xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
//           <Link href="/news" className="font-bold text-neutral-900 hover:text-blue-600 transition">
//             ← Back to News
//           </Link>
//           {isHeaderSticky && (
//             <h1 className="hidden md:block text-lg font-bold text-neutral-900 flex-1 mx-4 truncate">
//               {article.title}
//             </h1>
//           )}
//           <button
//             onClick={() => window.print()}
//             className="px-4 py-2 rounded-lg border border-neutral-300 text-neutral-700 font-medium hover:bg-neutral-100 transition"
//           >
//             Print
//           </button>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="max-w-4xl mx-auto px-4 md:px-6 py-12">
//         <article>
//           {/* Category Badge */}
//           <div className="mb-6">
//             {article.categories.map((cat) => (
//               <span
//                 key={cat}
//                 className="inline-block px-4 py-2 text-xs font-bold uppercase tracking-wide bg-blue-100 text-blue-700 rounded-full mr-2"
//               >
//                 {cat}
//               </span>
//             ))}
//           </div>

//           {/* Title */}
//           <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 mb-4 leading-tight">
//             {article.title}
//           </h1>

//           {/* Subtitle */}
//           <p className="text-xl md:text-2xl text-neutral-600 mb-6 leading-relaxed">
//             {article.subtitle}
//           </p>

//           {/* Stats Row */}
//           {article.stats && article.stats.length > 0 && (
//             <div className="flex gap-6 mb-8 border-y border-neutral-200 py-4">
//               {article.stats.map((stat) => (
//                 <div key={stat.label}>
//                   <span className="text-2xl font-bold text-neutral-900">{stat.value}</span>
//                   <span className="text-sm text-neutral-500 ml-1">{stat.label}</span>
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* Article Meta */}
//           <div className="flex flex-col md:flex-row gap-4 items-start md:items-center border-t border-b border-neutral-200 py-6 mb-8">
//             <div>
//               <p className="font-semibold text-neutral-900">{article.author}</p>
//               <p className="text-sm text-neutral-600">Financial Expert</p>
//             </div>
//             <div className="flex gap-4 md:gap-6 ml-auto text-sm text-neutral-600 font-medium">
//               <div>
//                 <span className="block text-xs text-neutral-500 mb-1">Published</span>
//                 <time>{formattedDate}</time>
//               </div>
//               <div>
//                 <span className="block text-xs text-neutral-500 mb-1">Reading Time</span>
//                 <span>{article.readTime}</span>
//               </div>
//             </div>
//           </div>

//           {/* Featured Image */}
//           <div className="mb-12">
//             <div className="relative h-96 md:h-[500px] w-full rounded-xl overflow-hidden">
//               <Image
//                 src={article.featuredImage}
//                 alt={article.title}
//                 fill
//                 className="object-cover hover:scale-105 transition-transform duration-500"
//                 priority
//               />
//             </div>
//           </div>

//           {/* Dynamic Content */}
//           <div ref={contentRef} className="mb-12">
//             {article.content.map((block, idx) => renderContent(block))}
//           </div>

//           {/* Tags */}
//           <div className="border-t border-neutral-200 pt-8 mb-12">
//             <h3 className="text-lg font-bold text-neutral-900 mb-4">Tags</h3>
//             <div className="flex flex-wrap gap-2">
//               {article.tags.map((tag) => (
//                 <Link
//                   key={tag}
//                   href={`/news?q=${encodeURIComponent(tag)}`}
//                   className="px-4 py-2 rounded-full bg-neutral-100 text-neutral-700 text-sm font-medium hover:bg-neutral-200 transition"
//                 >
//                   #{tag}
//                 </Link>
//               ))}
//             </div>
//           </div>

//           {/* FAQ Section */}
//           {article.faq && article.faq.length > 0 && (
//             <div className="border-t border-neutral-200 pt-8 mb-12">
//               <h2 className="text-2xl font-bold text-neutral-900 mb-6">Frequently Asked Questions</h2>
//               <div className="space-y-4">
//                 {article.faq.map((faq, idx) => (
//                   <div key={idx} className="border border-neutral-200 rounded-lg overflow-hidden">
//                     <button
//                       onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
//                       className="w-full text-left px-6 py-4 bg-neutral-50 hover:bg-neutral-100 transition flex justify-between items-center"
//                     >
//                       <span className="font-semibold text-neutral-900">{faq.question}</span>
//                       <svg
//                         className={`w-5 h-5 text-neutral-600 transition-transform ${activeFaq === idx ? 'rotate-180' : ''}`}
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                       </svg>
//                     </button>
//                     {activeFaq === idx && (
//                       <div className="px-6 py-4 border-t border-neutral-200">
//                         <p className="text-neutral-600">{faq.answer}</p>
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Related Articles (as slugs – we'll link to them) */}
//           {article.related && article.related.length > 0 && (
//             <div className="border-t border-neutral-200 pt-8">
//               <h2 className="text-2xl font-bold text-neutral-900 mb-6">Related Articles</h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {article.related.map((slug) => (
//                   <Link
//                     key={slug}
//                     href={`/news/${slug}`}
//                     className="block p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition group"
//                   >
//                     <h3 className="font-semibold text-neutral-900 group-hover:text-blue-600 transition">
//                       {slug.replace(/-/g, ' ')}
//                     </h3>
//                     <span className="text-blue-600 text-sm group-hover:translate-x-1 transition">Read →</span>
//                   </Link>
//                 ))}
//               </div>
//             </div>
//           )}
//         </article>

//         {/* Newsletter Signup */}
//         <section className="mt-16 py-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl text-white px-8">
//           <div className="max-w-2xl">
//             <h2 className="text-3xl font-bold mb-3">Get the Latest News</h2>
//             <p className="text-blue-100 mb-6">
//               Subscribe to our newsletter for daily insights on technology, business, and finance.
//             </p>
//             <form className="flex flex-col md:flex-row gap-3">
//               <input
//                 type="email"
//                 placeholder="Enter your email"
//                 className="flex-1 px-4 py-3 rounded-lg text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-white"
//                 required
//               />
//               <button
//                 type="submit"
//                 className="px-6 py-3 rounded-lg bg-white text-blue-600 font-bold hover:bg-blue-50 transition"
//               >
//                 Subscribe
//               </button>
//             </form>
//             <p className="text-xs text-blue-100 mt-3">We respect your privacy. Unsubscribe anytime.</p>
//           </div>
//         </section>
//       </main>

//       {/* Footer */}
//       <footer className="border-t border-neutral-200 bg-neutral-50 mt-16">
//         <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
//             <div>
//               <h3 className="font-bold text-neutral-900 mb-4">NewsHub</h3>
//               <p className="text-sm text-neutral-600">Your trusted source for breaking news and insights.</p>
//             </div>
//             <div>
//               <h4 className="font-semibold text-neutral-900 mb-4">Categories</h4>
//               <ul className="space-y-2 text-sm text-neutral-600">
//                 <li><Link href="/news?category=Technology" className="hover:text-neutral-900">Technology</Link></li>
//                 <li><Link href="/news?category=Business" className="hover:text-neutral-900">Business</Link></li>
//                 <li><Link href="/news?category=Finance" className="hover:text-neutral-900">Finance</Link></li>
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
//             <p>&copy; 2026 NewsHub. All rights reserved.</p>
//           </div>
//         </div>
//       </footer>

//       <style>{`
//         .prose {
//           --tw-prose-body: rgb(51, 51, 51);
//           --tw-prose-headings: rgb(23, 23, 23);
//           --tw-prose-links: rgb(37, 99, 235);
//           --tw-prose-bold: rgb(23, 23, 23);
//         }
//       `}</style>
//     </div>
//   );
// }

// // 'use client';

// // import { useState, useRef, useEffect } from 'react';
// // import Image from 'next/image';
// // import Link from 'next/link';

// // interface NewsDetail {
// //   id: string;
// //   slug: string;
// //   title: string;
// //   subtitle: string;
// //   category: string;
// //   image: string;
// //   date: string;
// //   author: string;
// //   authorImage: string;
// //   authorBio: string;
// //   readTime: string;
// //   content: string;
// //   tags: string[];
// //   relatedArticles: Array<{
// //     slug: string;
// //     title: string;
// //     category: string;
// //     image: string;
// //   }>;
// // }

// // export function NewsDetailClient({ article }: { article: NewsDetail }) {
// //   const [scrollProgress, setScrollProgress] = useState(0);
// //   const [isHeaderSticky, setIsHeaderSticky] = useState(false);
// //   const contentRef = useRef<HTMLDivElement>(null);

// //   useEffect(() => {
// //     const handleScroll = () => {
// //       const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
// //       const scrolled = (window.scrollY / scrollHeight) * 100;
// //       setScrollProgress(scrolled);
// //       setIsHeaderSticky(window.scrollY > 100);
// //     };
// //     window.addEventListener('scroll', handleScroll);
// //     return () => window.removeEventListener('scroll', handleScroll);
// //   }, []);

// //   return (
// //     <div className="min-h-screen bg-white">
// //       {/* Progress Bar */}
// //       <div
// //         className="fixed top-0 left-0 h-1 bg-gradient-to-r from-blue-600 to-blue-400 z-50 transition-all duration-300"
// //         style={{ width: `${scrollProgress}%` }}
// //       />

// //       {/* Sticky Header */}
// //       <header className={`sticky top-0 z-40 transition-all duration-300 ${
// //         isHeaderSticky ? 'bg-white/95 backdrop-blur-md border-b border-neutral-200' : 'bg-white'
// //       }`}>
// //         <div className="max-w-4xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
// //           <Link href="/news" className="font-bold text-neutral-900 hover:text-blue-600 transition">
// //             ← Back to News
// //           </Link>
// //           {isHeaderSticky && (
// //             <h1 className="hidden md:block text-lg font-bold text-neutral-900 flex-1 mx-4 truncate">
// //               {article.title}
// //             </h1>
// //           )}
// //           <button
// //             onClick={() => window.print()}
// //             className="px-4 py-2 rounded-lg border border-neutral-300 text-neutral-700 font-medium hover:bg-neutral-100 transition"
// //           >
// //             Print
// //           </button>
// //         </div>
// //       </header>

// //       {/* Main Content */}
// //       <main className="max-w-4xl mx-auto px-4 md:px-6 py-12">
// //         {/* Hero Section */}
// //         <article>
// //           {/* Category Badge */}
// //           <div className="mb-6">
// //             <span className="inline-block px-4 py-2 text-xs font-bold uppercase tracking-wide bg-blue-100 text-blue-700 rounded-full">
// //               {article.category}
// //             </span>
// //           </div>

// //           {/* Title */}
// //           <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 mb-4 leading-tight">
// //             {article.title}
// //           </h1>

// //           {/* Subtitle */}
// //           <p className="text-xl md:text-2xl text-neutral-600 mb-6 leading-relaxed">
// //             {article.subtitle}
// //           </p>

// //           {/* Article Meta */}
// //           <div className="flex flex-col md:flex-row gap-4 items-start md:items-center border-t border-b border-neutral-200 py-6 mb-8">
// //             {/* Author Info */}
// //             <div className="flex items-center gap-4">
// //               <div className="w-12 h-12 rounded-full overflow-hidden bg-neutral-200 flex-shrink-0">
// //                 <Image
// //                   src={article.authorImage}
// //                   alt={article.author}
// //                   width={48}
// //                   height={48}
// //                   className="w-full h-full object-cover"
// //                 />
// //               </div>
// //               <div>
// //                 <p className="font-semibold text-neutral-900">{article.author}</p>
// //                 <p className="text-sm text-neutral-600">{article.authorBio}</p>
// //               </div>
// //             </div>

// //             {/* Reading Info */}
// //             <div className="flex gap-4 md:gap-6 ml-auto text-sm text-neutral-600 font-medium">
// //               <div>
// //                 <span className="block text-xs text-neutral-500 mb-1">Published</span>
// //                 <time>{article.date}</time>
// //               </div>
// //               <div>
// //                 <span className="block text-xs text-neutral-500 mb-1">Reading Time</span>
// //                 <span>{article.readTime}</span>
// //               </div>
// //             </div>
// //           </div>

// //           {/* Featured Image */}
// //           <div className="mb-12">
// //             <div className="relative h-96 md:h-[500px] w-full rounded-xl overflow-hidden">
// //               <Image
// //                 src={article.image}
// //                 alt={article.title}
// //                 fill
// //                 className="object-cover hover:scale-105 transition-transform duration-500"
// //                 priority
// //               />
// //             </div>
// //           </div>

// //           {/* Article Content */}
// //           <div
// //             ref={contentRef}
// //             className="prose prose-lg max-w-none mb-12"
// //             dangerouslySetInnerHTML={{
// //               __html: `
// //                 <h2>Understanding the Market Shift</h2>
// //                 <p>The technology sector has undergone significant transformation over the past few years. What once seemed like distant possibilities are now becoming everyday realities. From artificial intelligence to blockchain technology, innovation continues to reshape how we work, communicate, and do business.</p>
                
// //                 <p>Industry experts have been monitoring these changes closely, noting that the pace of change has accelerated faster than many predicted. Companies that were slow to adapt found themselves left behind, while those who embraced new technologies thrived.</p>

// //                 <h2>Key Factors Driving Change</h2>
// //                 <p>Several critical factors have contributed to this transformation:</p>
// //                 <ul>
// //                   <li><strong>Digital Acceleration:</strong> COVID-19 expedited digital transformation timelines by several years. Organizations that might have taken decades to modernize did so in months.</li>
// //                   <li><strong>Talent Evolution:</strong> A new generation of workers brings different expectations and technical skills to the workforce.</li>
// //                   <li><strong>Investment Surge:</strong> Venture capital and private equity funding reached unprecedented levels, fueling innovation.</li>
// //                   <li><strong>Regulatory Clarity:</strong> Governments began establishing clearer frameworks for emerging technologies.</li>
// //                 </ul>

// //                 <h2>Future Outlook</h2>
// //                 <p>Looking ahead, we can expect these trends to continue evolving. The companies and professionals who stay informed and adaptable will be best positioned for success in this rapidly changing landscape.</p>

// //                 <blockquote>
// //                   <p>"The future belongs to those who can anticipate change and adapt quickly," says industry analyst Jane Smith.</p>
// //                 </blockquote>

// //                 <p>In conclusion, while uncertainty remains, one thing is clear: the pace of technological change will only accelerate. Organizations must prioritize continuous learning and innovation to remain competitive in this dynamic environment.</p>
// //               `,
// //             }}
// //             style={{
// //               '--tw-prose-body': 'rgb(51, 51, 51)',
// //               '--tw-prose-headings': 'rgb(23, 23, 23)',
// //               '--tw-prose-links': 'rgb(37, 99, 235)',
// //               '--tw-prose-code': 'rgb(23, 23, 23)',
// //               '--tw-prose-quotes': 'rgb(107, 114, 128)',
// //             } as React.CSSProperties}
// //           />

// //           {/* Share Section */}
// //           <div className="border-t border-neutral-200 pt-8 mb-12">
// //             <h3 className="text-lg font-bold text-neutral-900 mb-4">Share This Article</h3>
// //             <div className="flex gap-3">
// //               {[
// //                 { name: 'Twitter', icon: '𝕏', url: `https://twitter.com/intent/tweet?text=${article.title}` },
// //                 { name: 'LinkedIn', icon: 'in', url: `https://linkedin.com/sharing/share-offsite/?url=...` },
// //                 { name: 'Facebook', icon: 'f', url: `https://facebook.com/sharer/sharer.php?u=...` },
// //               ].map((platform) => (
// //                 <a
// //                   key={platform.name}
// //                   href={platform.url}
// //                   target="_blank"
// //                   rel="noopener noreferrer"
// //                   className="w-11 h-11 rounded-lg border border-neutral-300 flex items-center justify-center text-neutral-700 font-bold hover:bg-neutral-900 hover:text-white transition"
// //                   title={`Share on ${platform.name}`}
// //                 >
// //                   {platform.icon}
// //                 </a>
// //               ))}
// //             </div>
// //           </div>

// //           {/* Tags */}
// //           <div className="border-t border-neutral-200 pt-8 mb-12">
// //             <h3 className="text-lg font-bold text-neutral-900 mb-4">Tags</h3>
// //             <div className="flex flex-wrap gap-2">
// //               {article.tags.map((tag) => (
// //                 <a
// //                   key={tag}
// //                   href={`/news?q=${tag}`}
// //                   className="px-4 py-2 rounded-full bg-neutral-100 text-neutral-700 text-sm font-medium hover:bg-neutral-200 transition"
// //                 >
// //                   #{tag}
// //                 </a>
// //               ))}
// //             </div>
// //           </div>

// //           {/* Author Box */}
// //           <div className="bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-xl p-8 mb-12 border border-neutral-200">
// //             <div className="flex gap-4 mb-4">
// //               <div className="w-16 h-16 rounded-full overflow-hidden bg-neutral-300 flex-shrink-0">
// //                 <Image
// //                   src={article.authorImage}
// //                   alt={article.author}
// //                   width={64}
// //                   height={64}
// //                   className="w-full h-full object-cover"
// //                 />
// //               </div>
// //               <div className="flex-1">
// //                 <h4 className="text-lg font-bold text-neutral-900">{article.author}</h4>
// //                 <p className="text-sm text-neutral-600 mb-2">{article.authorBio}</p>
// //                 <a href="#" className="text-blue-600 font-semibold text-sm hover:underline">
// //                   View all articles →
// //                 </a>
// //               </div>
// //             </div>
// //           </div>
// //         </article>

// //         {/* Related Articles */}
// //         {article.relatedArticles.length > 0 && (
// //           <section className="border-t border-neutral-200 pt-12">
// //             <h2 className="text-3xl font-bold text-neutral-900 mb-8">Related Articles</h2>
// //             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
// //               {article.relatedArticles.map((related) => (
// //                 <Link key={related.slug} href={`/news/${related.slug}`}>
// //                   <article className="group cursor-pointer h-full">
// //                     <div className="relative h-48 rounded-lg overflow-hidden mb-4">
// //                       <Image
// //                         src={related.image}
// //                         alt={related.title}
// //                         fill
// //                         className="object-cover group-hover:scale-110 transition-transform duration-500"
// //                       />
// //                     </div>
// //                     <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wide bg-neutral-100 text-neutral-700 rounded-full mb-3">
// //                       {related.category}
// //                     </span>
// //                     <h3 className="font-bold text-neutral-900 group-hover:text-blue-600 transition mb-2 line-clamp-2">
// //                       {related.title}
// //                     </h3>
// //                     <span className="text-blue-600 font-semibold text-sm group-hover:translate-x-1 transition-transform">
// //                       Read →
// //                     </span>
// //                   </article>
// //                 </Link>
// //               ))}
// //             </div>
// //           </section>
// //         )}

// //         {/* Newsletter Signup */}
// //         <section className="mt-16 py-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl text-white px-8">
// //           <div className="max-w-2xl">
// //             <h2 className="text-3xl font-bold mb-3">Get the Latest News</h2>
// //             <p className="text-blue-100 mb-6">
// //               Subscribe to our newsletter for daily insights on technology, business, and finance.
// //             </p>
// //             <form className="flex flex-col md:flex-row gap-3">
// //               <input
// //                 type="email"
// //                 placeholder="Enter your email"
// //                 className="flex-1 px-4 py-3 rounded-lg text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-white"
// //                 required
// //               />
// //               <button
// //                 type="submit"
// //                 className="px-6 py-3 rounded-lg bg-white text-blue-600 font-bold hover:bg-blue-50 transition"
// //               >
// //                 Subscribe
// //               </button>
// //             </form>
// //             <p className="text-xs text-blue-100 mt-3">We respect your privacy. Unsubscribe anytime.</p>
// //           </div>
// //         </section>
// //       </main>

// //       {/* Footer */}
// //       <footer className="border-t border-neutral-200 bg-neutral-50 mt-16">
// //         <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
// //           <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
// //             <div>
// //               <h3 className="font-bold text-neutral-900 mb-4">NewsHub</h3>
// //               <p className="text-sm text-neutral-600">Your trusted source for breaking news and insights.</p>
// //             </div>
// //             <div>
// //               <h4 className="font-semibold text-neutral-900 mb-4">Categories</h4>
// //               <ul className="space-y-2 text-sm text-neutral-600">
// //                 <li><a href="#" className="hover:text-neutral-900">Technology</a></li>
// //                 <li><a href="#" className="hover:text-neutral-900">Business</a></li>
// //                 <li><a href="#" className="hover:text-neutral-900">Finance</a></li>
// //               </ul>
// //             </div>
// //             <div>
// //               <h4 className="font-semibold text-neutral-900 mb-4">Company</h4>
// //               <ul className="space-y-2 text-sm text-neutral-600">
// //                 <li><a href="#" className="hover:text-neutral-900">About</a></li>
// //                 <li><a href="#" className="hover:text-neutral-900">Contact</a></li>
// //                 <li><a href="#" className="hover:text-neutral-900">Advertise</a></li>
// //               </ul>
// //             </div>
// //             <div>
// //               <h4 className="font-semibold text-neutral-900 mb-4">Legal</h4>
// //               <ul className="space-y-2 text-sm text-neutral-600">
// //                 <li><a href="#" className="hover:text-neutral-900">Privacy</a></li>
// //                 <li><a href="#" className="hover:text-neutral-900">Terms</a></li>
// //                 <li><a href="#" className="hover:text-neutral-900">Cookies</a></li>
// //               </ul>
// //             </div>
// //           </div>
// //           <div className="border-t border-neutral-200 pt-8 text-center text-sm text-neutral-600">
// //             <p>&copy; 2024 NewsHub. All rights reserved.</p>
// //           </div>
// //         </div>
// //       </footer>

// //       <style>{`
// //         .prose {
// //           --tw-prose-body: rgb(51, 51, 51);
// //           --tw-prose-headings: rgb(23, 23, 23);
// //           --tw-prose-links: rgb(37, 99, 235);
// //           --tw-prose-bold: rgb(23, 23, 23);
// //           --tw-prose-counters: rgb(107, 114, 128);
// //           --tw-prose-bullets: rgb(107, 114, 128);
// //         }

// //         .prose h2 {
// //           @apply text-2xl md:text-3xl font-bold mt-8 mb-4;
// //         }

// //         .prose p {
// //           @apply text-base md:text-lg leading-relaxed mb-6;
// //         }

// //         .prose ul {
// //           @apply space-y-3 my-6 pl-6;
// //         }

// //         .prose li {
// //           @apply text-base md:text-lg;
// //         }

// //         .prose blockquote {
// //           @apply border-l-4 border-blue-600 pl-6 py-4 italic text-lg text-neutral-700 bg-neutral-50 my-8;
// //         }

// //         .prose strong {
// //           @apply font-bold text-neutral-900;
// //         }

// //         .prose a {
// //           @apply text-blue-600 font-medium hover:underline;
// //         }
// //       `}</style>
// //     </div>
// //   );
// // }