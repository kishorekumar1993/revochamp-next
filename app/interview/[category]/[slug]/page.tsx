import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import TestClient from './TestClient';
import StructuredData from './StructuredData';
import { fetchTestSession } from '@/lib/testService';

// ✅ For static export: dynamicParams must be false (or omitted – default is false)
export const dynamicParams = false;

interface PageProps {
  params: Promise<{ category: string; slug: string }>;
}

// Generate all known test pages at build time
export async function generateStaticParams() {
  // Fetch list of categories (no revalidate option – build‑time only)
  let categoriesRes: Response;
  try {
    categoriesRes = await fetch('https://json.revochamp.site/tech/category.json');
    if (!categoriesRes.ok) return [];
  } catch {
    // If the categories endpoint fails, build continues with no static paths
    return [];
  }

  const data = await categoriesRes.json();
  const courses = data.courses || [];
  const allParams: Array<{ category: string; slug: string }> = [];

  for (const course of courses) {
    const category = course.slug;
    try {
      const topicsRes = await fetch(
        `https://json.revochamp.site/mockinterview/${category}/topics.json`
      );
      if (!topicsRes.ok) {
        console.warn(`Skipping ${category} – topics endpoint returned ${topicsRes.status}`);
        continue;
      }
      const topics = await topicsRes.json();
      for (const topic of topics) {
        allParams.push({ category, slug: topic.slug });
      }
    } catch (error) {
      console.warn(`Skipping ${category} – failed to fetch topics:`, error);
    }
  }
  return allParams;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, slug } = await params;
  const session = await fetchTestSession(category, slug);

  if (!session) {
    return {
      title: 'Mock Test | RevoChamp',
      robots: 'index, follow',
    };
  }

  const title = `${session.title} | ${capitalize(category)} Mock Test | RevoChamp`;
  const description = session.description;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://revochamp.site/interview/${category}/${slug}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: 'index, follow',
    alternates: { canonical: `https://revochamp.site/interview/${category}/${slug}` },
    keywords: [
      `${category} mock test`,
      `${session.title} interview questions`,
      'technical interview prep',
      'FAANG interview practice',
      ...session.topics.map((t) => `${category} ${t}`),
    ],
  };
}

export default async function Page({ params }: PageProps) {
  const { category, slug } = await params;
  const session = await fetchTestSession(category, slug);

  if (!session) {
    notFound();
  }

  return (
    <>
      <StructuredData session={session} category={category} slug={slug} />
      <TestClient session={session} category={category} />
    </>
  );
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
