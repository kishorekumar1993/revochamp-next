"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ContentRenderer } from "./ContentRenderer";
import { ShareButtons } from "./ShareButtons";
import { TableOfContents } from "./TableOfContents";
import { NewsletterBox } from "./NewsletterBox";
import { BlogPost, ContentItem, ContentType } from "@/types/blog-detail";
import ReactMarkdown from "react-markdown";

export function NewspaperBlogDesign({
  post,
  slug,
}: {
  post: BlogPost;
  slug: string;
}) {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (window.scrollY / scrollHeight) * 100;
      setScrollProgress(scrolled);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const headings = post.content
    .filter((item) => item.type === ContentType.heading)
    .map((item) => item.value);
  const stats = post.stats.slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
    {/* <div className="min-h-screen bg-[#F7F4EF]"> */}

    {/* Progress Bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 z-50 transition-all duration-300"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Sticky Navigation Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <span className="text-white text-sm font-bold">RC</span>
              </div>
              <span className="font-semibold text-slate-900">RevoChamp</span>
            </div>

            {/* Center Info - Hidden on Mobile */}
            <div className="hidden md:flex items-center gap-3 text-sm text-slate-600">
              <span className="px-2 py-1 rounded-full bg-slate-100 text-xs font-medium text-slate-700">
                {formatCategories(post.categories)}
              </span>
              <span className="text-slate-400">•</span>
              <span>{formatDate(post.date)}</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-500">{post.readTime}</span>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsSidebarVisible(!isSidebarVisible)}
              className="md:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Toggle sidebar"
            >
              <svg
                className="w-5 h-5 text-slate-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Hero Section */}
        <div className="mb-16">
          <div className="grid lg:grid-cols-[1fr_380px] gap-12 items-start">
            {/* Main Content */}
            <div>
              {/* Category Badge */}
              <div className="inline-flex items-center gap-2 mb-6">
                <span className="inline-block px-3 py-1.5 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200/50 text-blue-700 text-xs font-semibold rounded-full">
                  {post.categories.slice(0, 2).join(" • ").toUpperCase()}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-6 text-slate-900">
                {post.title}
              </h1>

              {/* Subtitle */}
              {post.subtitle && (
                <p className="text-lg lg:text-xl text-slate-600 mb-8 leading-relaxed">
                  {post.subtitle}
                </p>
              )}

              {/* Author & Meta Info */}
              <div className="flex flex-wrap gap-6 pt-6 border-t border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-400" />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {post.author}
                    </p>
                    <p className="text-xs text-slate-500">Author</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {formatDate(post.date)}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C6.5 6.253 2 10.998 2 17.25c0 5.105 3.07 9.408 7.996 11.182.3.149.573.331.82.534a4.147 4.147 0 001.946.91 4.159 4.159 0 002.238 0 4.147 4.147 0 001.946-.91c.247-.203.52-.385.82-.534C18.93 26.658 22 22.355 22 17.25c0-6.252-4.5-10.997-10-11.247zm0 13V6.253m0 13c5.5.25 10 4.995 10 11.247"
                    />
                  </svg>
                  {post.readTime}
                </div>
              </div>
            </div>

            {/* Stats Sidebar */}
            {stats.length > 0 && (
              <div className="space-y-4">
                {stats.map((stat, idx) => (
                  <div
                    key={stat.label}
                    className="group p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 cursor-default"
                    style={{
                      animationDelay: `${idx * 100}ms`,
                    }}
                  >
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Featured Image */}
        {post.featuredImage && (
          <div className="mb-16 rounded-2xl overflow-hidden shadow-2xl shadow-slate-900/10">
            <div className="relative h-96 lg:h-[500px] w-full overflow-hidden bg-slate-200">
              <Image
                src={post.featuredImage}
                alt={post.title}
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
                priority
              />
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-[1fr_320px] gap-12">
          {/* Article Content */}
<article className="prose prose-lg max-w-none overflow-x-auto">
              <ContentRenderer items={post.content} />

            {/* Share Section */}
            <div className="mt-12 pt-8 border-t border-slate-200">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">
                Share This Article
              </p>
              <ShareButtons
                url={`https://revochamp.site/blog/${slug}`}
                title={post.title}
              />
            </div>
          </article>

          {/* Sidebar */}
          {isSidebarVisible && (
            <aside className="space-y-8">
              {/* Table of Contents */}
              <TableOfContents headings={headings} />

              {/* CTA Card */}
              <div className="p-6 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-lg">
                <h3 className="font-bold text-lg mb-2">Featured Insight</h3>
                <p className="text-sm text-blue-50 mb-4">
                  40% improvement in forecast accuracy with AI-powered CRM
                </p>
                <button className="w-full py-2 px-3 rounded-lg bg-white text-blue-600 font-semibold text-sm hover:bg-blue-50 transition-colors">
                  Learn More
                </button>
              </div>

              {/* Tags */}
              <div>
                <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-4">
                  Topics
                </h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 rounded-full bg-slate-100 text-xs text-slate-700 hover:bg-blue-100 hover:text-blue-700 transition-colors cursor-pointer"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Related Articles */}
              {post.related.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-4">
                    Related Reading
                  </h3>
                  <div className="space-y-2">
                    {post.related.slice(0, 3).map((rel) => (
                      <Link
                        key={rel}
                        href={`/blog/${rel}`}
                        className="block p-3 rounded-lg bg-slate-50 hover:bg-blue-50 hover:text-blue-600 text-sm font-medium text-slate-900 transition-colors group"
                      >
                        <span className="group-hover:translate-x-1 inline-block transition-transform">
                          → {slugToTitle(rel)}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Newsletter */}
              <NewsletterBox />
            </aside>
          )}
        </div>

        {/* FAQ Section */}
        {/* {post.faq && post.faq.length > 0 && (
          <section className="mt-20 pt-12 border-t border-slate-200">
            <h2 className="text-3xl font-bold text-slate-900 mb-8">
              Frequently Asked Questions
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {post.faq.map((faq, i) => (
                <details
                  key={i}
                  className="group rounded-xl border border-slate-200 bg-white overflow-hidden hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300"
                >
                  <summary className="flex items-center justify-between p-5 cursor-pointer font-semibold text-slate-900 hover:text-blue-600 transition-colors">
                    <span>{faq.question}</span>
                    <svg
                      className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </summary>
                  <div className="px-5 pb-5 text-slate-600 text-sm border-t border-slate-100 bg-slate-50/50">
                    <ReactMarkdown >
                      {faq.answer}
                    </ReactMarkdown>
                  </div>
                </details>
              ))}
            </div>
          </section>
        )} */}

{post.faq && post.faq.length > 0 && (
  <section className="mt-20 pt-12 border-t border-slate-200">
    <h2 className="text-3xl font-bold text-slate-900 mb-8">
      Frequently Asked Questions
    </h2>
    <div className="grid md:grid-cols-1 gap-4">
      {post.faq.map((faq, i) => (
        <details
          key={faq.question || `faq-${i}`}  // ✅ unique key: use faq.id if exists, else fallback
          name="faq-accordion"         // ✅ ensures only one open at a time
          className="group rounded-xl border border-slate-200 bg-white overflow-hidden hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300"
        >
          <summary className="flex items-center justify-between p-5 cursor-pointer font-semibold text-slate-900 hover:text-blue-600 transition-colors">
            <span>{faq.question}</span>
            <svg
              className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </summary>
          <div className="px-5 pb-5 text-slate-600 text-sm border-t border-slate-100 bg-slate-50/50">
            <ReactMarkdown>
              {faq.answer}
            </ReactMarkdown>
          </div>
        </details>
      ))}
    </div>
  </section>
)}
        {/* Related Articles Section */}
        {post.related.length > 0 && (
          <section className="mt-20 pt-12 border-t border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">
              Continue Reading
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {post.related.slice(0, 3).map((rel) => (
                <Link
                  key={rel}
                  href={`/blog/${rel}`}
                  className="group rounded-xl overflow-hidden bg-white border border-slate-200 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300"
                >
                  <div className="p-6">
                    <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors mb-2">
                      {slugToTitle(rel)}
                    </h3>
                    <p className="text-sm text-slate-600 group-hover:text-slate-700">
                      Explore more insights and trends
                    </p>
                    <div className="mt-4 flex items-center text-blue-600 font-medium text-sm group-hover:translate-x-1 transition-transform">
                      Read More →
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-20 bg-slate-900 text-slate-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">RC</span>
                </div>
                <span className="font-semibold text-white">RevoChamp</span>
              </div>
              <p className="text-sm">
                India's leading authority on career trends and job market insights.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Resources
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Categories</h4>
              <ul className="space-y-2 text-sm">
                {post.categories.slice(0, 3).map((cat) => (
                  <li key={cat}>
                    <a href="#" className="hover:text-white transition-colors">
                      {cat}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Follow Us</h4>
              <div className="flex gap-4">
                {["Twitter", "LinkedIn", "Facebook"].map((platform) => (
                  <a
                    key={platform}
                    href="#"
                    className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-blue-600 flex items-center justify-center transition-colors"
                    aria-label={platform}
                  >
                    <span className="text-xs font-bold">
                      {platform.charAt(0)}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row justify-between items-center text-sm">
            <p>&copy; 2026 RevoChamp. All rights reserved.</p>
            <div className="flex gap-6 mt-4 sm:mt-0">
              <a href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Helper Functions
function getJournalName(cats: string[]): string {
  if (cats.includes("crm")) return "CRM Journal";
  if (cats.includes("ai")) return "AI Journal";
  return "RevoChamp Journal";
}

function formatCategories(cats: string[]): string {
  if (cats.length <= 2) return cats.join(" • ");
  return `${cats.slice(0, 2).join(" • ")} +${cats.length - 2}`;
}

function formatDate(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function slugToTitle(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// "use client";

// import { useState, useRef, useEffect } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { ContentRenderer } from "./ContentRenderer";
// import { ShareButtons } from "./ShareButtons";
// import { TableOfContents } from "./TableOfContents";
// import { NewsletterBox } from "./NewsletterBox";
// import { BlogFAQ } from "./FAQSection";
// import { BlogPost, ContentItem, ContentType } from "@/types/blog-detail";
// import ReactMarkdown from "react-markdown";

// export function NewspaperBlogDesign({
//   post,
//   slug,
// }: {
//   post: BlogPost;
//   slug: string;
// }) {
//   const [isSidebarVisible, setIsSidebarVisible] = useState(true);
//   const containerRef = useRef<HTMLDivElement>(null);

//   const headings = post.content
//     .filter((item) => item.type === ContentType.heading)
//     .map((item) => item.value);
//   const stats = post.stats.slice(0, 3);

//   return (
//     <div className="min-h-screen bg-[#F7F4EF]">
//       {/* Sticky header */}
//       <header className="sticky top-0 z-20 bg-[#F7F4EF]/95 backdrop-blur-sm border-b border-[#0F0E0C]/10">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center text-sm">
//           <div className="flex items-center gap-2">
//             <span className="text-[#C8401E] font-medium">RevoChamp</span>
//           </div>
//           <div className="hidden md:flex items-center gap-4 text-[#6B6760]">
//             <span>{getJournalName(post.categories)}</span>
//             <span className="w-1 h-1 rounded-full bg-[#6B6760]/40" />
//             <span>{formatDate(post.date)}</span>
//           </div>
//           <div className="flex items-center gap-3">
//             <span className="hidden md:inline-block px-3 py-1 bg-[#C8401E]/10 border border-[#C8401E]/20 text-[#C8401E] text-xs rounded-full">
//               {formatCategories(post.categories)}
//             </span>
//             <button
//               onClick={() => setIsSidebarVisible((v) => !v)}
//               className="md:hidden"
//             >
//               ☰
//             </button>
//           </div>
//         </div>
//       </header>

//       <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
//         {/* Hero section */}
//         <div className="grid md:grid-cols-[1fr_0.7fr] gap-8 items-start mb-12">
//           <div>
//             <div className="inline-block bg-[#C8401E] text-white text-xs px-2 py-1 mb-4">
//               {post.categories.slice(0, 3).join(" · ").toUpperCase()}
//             </div>
//             <h1 className="font-serif text-3xl md:text-5xl font-bold leading-tight">
//               {post.title}
//             </h1>
//             {post.subtitle && (
//               <p className="text-[#6B6760] text-lg mt-4">{post.subtitle}</p>
//             )}
//             <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-b border-[#DDD9D2]">
//               <span className="text-sm">
//                 <span className="font-medium">By</span> {post.author}
//               </span>
//               <span className="text-sm">{formatDate(post.date)}</span>
//               <span className="text-sm">{post.readTime}</span>
//             </div>
//           </div>
//           {stats.length > 0 && (
//             <div className="space-y-4">
//               {stats.map((stat) => (
//                 <div
//                   key={stat.label}
//                   className="border-l-4 border-[#C8401E] pl-4"
//                 >
//                   <div className="text-3xl font-serif font-bold text-[#C8401E]">
//                     {stat.value}
//                   </div>
//                   <div className="text-sm text-[#6B6760]">{stat.label}</div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Featured image */}
//         {post.featuredImage && (
//           <div className="mb-10 rounded-sm overflow-hidden">
//             <Image
//               src={post.featuredImage}
//               alt={post.title}
//               width={1200}
//               height={600}
//               className="w-full object-cover"
//             />
//           </div>
//         )}

//         {/* 2‑column layout */}
//         <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
//           {/* Main content */}
//           <article className="flex-1 prose prose-lg max-w-none">
//             <ContentRenderer items={post.content} />
//             <div className="mt-12 pt-6 border-t border-[#DDD9D2]">
//               <ShareButtons
//                 url={`https://revochamp.site/blog/${slug}`}
//                 title={post.title}
//               />
//             </div>
//           </article>

//           {/* Sidebar (Table of Contents, Tools, Newsletter) */}
//           <aside className="w-full md:w-80 lg:w-96 space-y-8">
//             <TableOfContents headings={headings} />
//             {/* Stats card */}
//             <div className="bg-[#0F0E0C] text-white p-6 text-center">
//               <div className="text-5xl font-serif font-bold text-[#C8401E]">
//                 40%
//               </div>
//               <p className="text-sm text-[#B0ADA8] mt-2">
//                 Improvement in forecast accuracy with AI‑powered CRM
//               </p>
//             </div>
//             {/* Tools / related / newsletter */}
//             <div className="space-y-6">
//               <SideSection title="Top CRM Platforms · 2026">
//                 <ToolCard
//                   name="Salesforce CRM"
//                   desc="Gold standard for enterprise AI with Einstein integration."
//                 />
//                 <ToolCard
//                   name="HubSpot CRM"
//                   desc="Premier choice for startups seeking powerful automation."
//                 />
//                 <ToolCard
//                   name="Zoho CRM"
//                   desc="Affordable and feature‑rich with Zia AI predictions."
//                 />
//               </SideSection>
//               <SideSection title="Topics">
//                 <div className="flex flex-wrap gap-2">
//                   {post.tags.map((tag) => (
//                     <span
//                       key={tag}
//                       className="px-2 py-1 border border-[#DDD9D2] text-xs text-[#6B6760]"
//                     >
//                       {tag}
//                     </span>
//                   ))}
//                 </div>
//               </SideSection>
//               <SideSection title="Related">
//                 {post.related.map((rel) => (
//                   <Link
//                     key={rel}
//                     href={`/blog/${rel}`}
//                     className="block py-2 text-sm hover:text-[#C8401E]"
//                   >
//                     → {slugToTitle(rel)}
//                   </Link>
//                 ))}
//               </SideSection>
//               <NewsletterBox />
//             </div>
//           </aside>
//         </div>

//         {/* FAQ Section */}
//         {/* {post.faq && post.faq.length > 0 && <BlogFAQ faqs={post.faq} />} */}
//         {post.faq && post.faq.length > 0 && (
//           <section className="mt-14">
//             <h2 className="text-xl font-semibold text-[#1f1f1f] mb-5 flex items-center gap-2">
//               <span className="w-1 h-5 bg-[#C8401E] rounded-full" />
//               Frequently Asked Questions
//             </h2>
//             <div className="space-y-3">
//               {post.faq.map((faq, i) => (
//                 <details
//                   key={i}
//                   className="group border border-[#DDD9D2] rounded-lg bg-[#FDFBF7] hover:border-[#C8401E]/40 transition"
//                 >
//                   // className="group border border-gray-200 rounded-lg
//                   bg-white"
//                   {/* > */}
//                   <summary className="flex items-center justify-between p-4 cursor-pointer list-none">
//                     <span className="font-medium text-[#1f1f1f]">
//                       {faq.question}
//                     </span>
//                     <svg
//                       className="w-4 h-4 text-gray-400 group-open:rotate-180 transition"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M19 9l-7 7-7-7"
//                       />
//                     </svg>
//                   </summary>
//                   <div className="px-4 pb-4 text-gray-600 text-sm">
//                     <ReactMarkdown>{faq.answer}</ReactMarkdown>
//                   </div>
//                 </details>
//               ))}
//             </div>
//           </section>
//         )}

//         {/* Related posts (full width) */}

//         {post.related.length > 0 && (
//           <section className="mt-16 pt-4 border-t border-[#2a2a2a]">
//             {/* Title */}
//             <p className="text-[12px] tracking-[0.15em] text-[#5f5a54] uppercase mb-5">
//               RELATED ARTICLES
//             </p>

//             {/* List */}
//             <ul className="list-none m-0 p-0 space-y-5">
//               {post.related.map((rel) => (
//                 <li key={rel} className="flex items-start gap-4">
//                   {/* Custom Bullet */}
//                   <span className="mt-[8px] w-[5px] h-[5px] bg-[#2a2a2a] flex-shrink-0" />

//                   {/* Link Text */}
//                   <Link
//                     href={`/blog/${rel}`}
//                     className="text-[16px] leading-[1.7] text-[#1f1f1f] hover:text-black transition-colors no-underline"
//                     style={{ textDecoration: "none" }}
//                   >
//                     {slugToTitle(rel)}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </section>
//         )}
//       </main>
//     </div>
//   );
// }

// // Helper functions
// function getJournalName(cats: string[]): string {
//   if (cats.includes("crm")) return "CRM Journal";
//   if (cats.includes("ai")) return "AI Journal";
//   return "RevoChamp Journal";
// }

// function formatCategories(cats: string[]): string {
//   if (cats.length <= 2) return cats.join(" • ");
//   return `${cats.slice(0, 2).join(" • ")} +${cats.length - 2}`;
// }

// function formatDate(date: Date): string {
//   return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
// }

// function slugToTitle(slug: string): string {
//   return slug
//     .split("-")
//     .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
//     .join(" ");
// }

// // Subcomponents
// function SideSection({
//   title,
//   children,
// }: {
//   title: string;
//   children: React.ReactNode;
// }) {
//   return (
//     <div>
//       <h3 className="text-xs font-medium tracking-wider text-[#6B6760] border-b border-[#DDD9D2] pb-2 mb-3">
//         {title.toUpperCase()}
//       </h3>
//       {children}
//     </div>
//   );
// }

// function ToolCard({ name, desc }: { name: string; desc: string }) {
//   return (
//     <div className="py-3 border-b border-[#DDD9D2] last:border-0">
//       <p className="font-medium">{name}</p>
//       <p className="text-sm text-[#6B6760]">{desc}</p>
//     </div>
//   );
// }
