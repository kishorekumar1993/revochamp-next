"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ContentRenderer } from "./ContentRenderer";
import { ShareButtons } from "./ShareButtons";
import { TableOfContents } from "./TableOfContents";
import { NewsletterBox } from "./NewsletterBox";
import { FAQSection } from "./FAQSection";
import { BlogPost, ContentItem, ContentType } from "@/types/blog-detail";

export function NewspaperBlogDesign({
  post,
  slug,
}: {
  post: BlogPost;
  slug: string;
}) {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const headings = post.content
    .filter((item) => item.type === ContentType.heading)
    .map((item) => item.value);
  const stats = post.stats.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#F7F4EF]">
      {/* Sticky header */}
      <header className="sticky top-0 z-20 bg-[#F7F4EF]/95 backdrop-blur-sm border-b border-[#0F0E0C]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center text-sm">
          <div className="flex items-center gap-2">
            <span className="text-[#C8401E] font-medium">RevoChamp</span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-[#6B6760]">
            <span>{getJournalName(post.categories)}</span>
            <span className="w-1 h-1 rounded-full bg-[#6B6760]/40" />
            <span>{formatDate(post.date)}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden md:inline-block px-3 py-1 bg-[#C8401E]/10 border border-[#C8401E]/20 text-[#C8401E] text-xs rounded-full">
              {formatCategories(post.categories)}
            </span>
            <button
              onClick={() => setIsSidebarVisible((v) => !v)}
              className="md:hidden"
            >
              ☰
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        {/* Hero section */}
        <div className="grid md:grid-cols-[1fr_0.7fr] gap-8 items-start mb-12">
          <div>
            <div className="inline-block bg-[#C8401E] text-white text-xs px-2 py-1 mb-4">
              {post.categories.slice(0, 3).join(" · ").toUpperCase()}
            </div>
            <h1 className="font-serif text-3xl md:text-5xl font-bold leading-tight">
              {post.title}
            </h1>
            {post.subtitle && (
              <p className="text-[#6B6760] text-lg mt-4">{post.subtitle}</p>
            )}
            <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-b border-[#DDD9D2]">
              <span className="text-sm">
                <span className="font-medium">By</span> {post.author}
              </span>
              <span className="text-sm">{formatDate(post.date)}</span>
              <span className="text-sm">{post.readTime}</span>
            </div>
          </div>
          {stats.length > 0 && (
            <div className="space-y-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="border-l-4 border-[#C8401E] pl-4"
                >
                  <div className="text-3xl font-serif font-bold text-[#C8401E]">
                    {stat.value}
                  </div>
                  <div className="text-sm text-[#6B6760]">{stat.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Featured image */}
        {post.featuredImage && (
          <div className="mb-10 rounded-sm overflow-hidden">
            <Image
              src={post.featuredImage}
              alt={post.title}
              width={1200}
              height={600}
              className="w-full object-cover"
            />
          </div>
        )}

        {/* 2‑column layout */}
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
          {/* Main content */}
          <article className="flex-1 prose prose-lg max-w-none">
            <ContentRenderer items={post.content} />
            <div className="mt-12 pt-6 border-t border-[#DDD9D2]">
              <ShareButtons
                url={`https://revochamp.site/blog/${slug}`}
                title={post.title}
              />
            </div>
          </article>

          {/* Sidebar (Table of Contents, Tools, Newsletter) */}
          <aside className="w-full md:w-80 lg:w-96 space-y-8">
            <TableOfContents headings={headings} />
            {/* Stats card */}
            <div className="bg-[#0F0E0C] text-white p-6 text-center">
              <div className="text-5xl font-serif font-bold text-[#C8401E]">
                40%
              </div>
              <p className="text-sm text-[#B0ADA8] mt-2">
                Improvement in forecast accuracy with AI‑powered CRM
              </p>
            </div>
            {/* Tools / related / newsletter */}
            <div className="space-y-6">
              <SideSection title="Top CRM Platforms · 2026">
                <ToolCard
                  name="Salesforce CRM"
                  desc="Gold standard for enterprise AI with Einstein integration."
                />
                <ToolCard
                  name="HubSpot CRM"
                  desc="Premier choice for startups seeking powerful automation."
                />
                <ToolCard
                  name="Zoho CRM"
                  desc="Affordable and feature‑rich with Zia AI predictions."
                />
              </SideSection>
              <SideSection title="Topics">
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 border border-[#DDD9D2] text-xs text-[#6B6760]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </SideSection>
              <SideSection title="Related">
                {post.related.map((rel) => (
                  <Link
                    key={rel}
                    href={`/blog/${rel}`}
                    className="block py-2 text-sm hover:text-[#C8401E]"
                  >
                    → {slugToTitle(rel)}
                  </Link>
                ))}
              </SideSection>
              <NewsletterBox />
            </div>
          </aside>
        </div>

        {/* FAQ Section */}
        {post.faq && post.faq.length > 0 && <FAQSection faqs={post.faq} />}

        {/* Related posts (full width) */}

        {post.related.length > 0 && (
          <section className="mt-16 pt-4 border-t border-[#2a2a2a]">
            {/* Title */}
            <p className="text-[12px] tracking-[0.15em] text-[#5f5a54] uppercase mb-5">
              RELATED ARTICLES
            </p>

            {/* List */}
            <ul className="list-none m-0 p-0 space-y-5">
              {post.related.map((rel) => (
                <li key={rel} className="flex items-start gap-4">
                  {/* Custom Bullet */}
                  <span className="mt-[8px] w-[5px] h-[5px] bg-[#2a2a2a] flex-shrink-0" />

                  {/* Link Text */}
                  <Link
                    href={`/blog/${rel}`}
                    className="text-[16px] leading-[1.7] text-[#1f1f1f] hover:text-black transition-colors no-underline"
                    style={{ textDecoration: "none" }}
                  >
                    {slugToTitle(rel)}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
}

// Helper functions
function getJournalName(cats: string[]): string {
  if (cats.includes("crm")) return "CRM Journal";
  if (cats.includes("ai")) return "AI Journal";
  return "RevoChamp Journal";
}

function formatCategories(cats: string[]): string {
  if (cats.length <= 2) return cats.join(" • ");
  return `${cats.slice(0, 2).join(" • ")} +${cats.length - 2}`;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function slugToTitle(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// Subcomponents
function SideSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-xs font-medium tracking-wider text-[#6B6760] border-b border-[#DDD9D2] pb-2 mb-3">
        {title.toUpperCase()}
      </h3>
      {children}
    </div>
  );
}

function ToolCard({ name, desc }: { name: string; desc: string }) {
  return (
    <div className="py-3 border-b border-[#DDD9D2] last:border-0">
      <p className="font-medium">{name}</p>
      <p className="text-sm text-[#6B6760]">{desc}</p>
    </div>
  );
}
