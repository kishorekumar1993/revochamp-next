// app/blog/[slug]/page.tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import BlogDetailClient from "./client";
import { fetchBlogBySlug, getAllBlogSlugs } from "@/lib/blog-detail-service";
import { BlogPost } from "@/types/blog-detail";

type Props = { params: Promise<{ slug: string }> }; // ✅ fixed typo

export async function generateStaticParams() {
  const slugs = await getAllBlogSlugs();
  console.log("Generated slugs count:", slugs.length);
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = await fetchBlogBySlug(slug);
    const description = extractDescription(post);
    const imageUrl =
      post.featuredImage || "https://revochamp.site/blog/og-default.jpg";
    return {
      title: `${post.title}`,
      description,
      openGraph: {
        title: post.title,
        description,
        images: [{ url: imageUrl, width: 1200, height: 630, alt: post.title }],
        type: "article",
        publishedTime: post.date.toISOString(),
        authors: [post.author],
        tags: post.tags,
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description,
        images: [imageUrl],
      },
      alternates: {
        canonical: `https://revochamp.site/blog/${slug}`,
      },
    };
  } catch {
    return {
      title: "Not Found",
      description: "The requested article does not exist.",
    };
  }
}

function extractDescription(post: BlogPost): string {
  if (post.meta?.description) return post.meta.description;
  const firstText =
    post.content.find((item) => item.type === "text")?.value || "";
  const clean = firstText.replace(/\n/g, " ").trim();
  return clean.length > 160
    ? clean.slice(0, 157) + "..."
    : clean || `Read ${post.title} on Revochamp.`;
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  let post;
  try {
    post = await fetchBlogBySlug(slug);
  } catch {
    notFound();
  }
  return <BlogDetailClient post={post} slug={slug} />;
}
