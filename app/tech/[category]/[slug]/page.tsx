
// app/tech/[category]/[slug]/page.tsx

import { Metadata } from "next";
import { fetchTopics, fetchTutorial } from "@/lib/fetchTutorial";
import TutorialClient from "@/components/tutorial/TutorialClient";
import { notFound } from "next/navigation";

// ============================================================
// 1. generateStaticParams – fetches all [category, slug] pairs at build time
// ============================================================
export async function generateStaticParams() {
  const categoriesRes = await fetch('https://json.revochamp.site/tech/category.json');
  const data = await categoriesRes.json();
  const courses = data.courses || [];

  const allParams = [];

  for (const course of courses) {
    const category = course.slug;
    try {
      const topicsRes = await fetch(`https://json.revochamp.site/${category}/topics.json`);
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
// ============================================================
// 2. generateMetadata – dynamic SEO for each tutorial
// ============================================================
export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {
  const { category, slug } = await params;
  try {
    const data = await fetchTutorial(category, slug);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://revochamp.com";
    const pageUrl = `${baseUrl}/tech/${category}/${slug}`;
    const imageUrl = data.meta?.image
      ? data.meta.image.startsWith("http")
        ? data.meta.image
        : `${baseUrl}${data.meta.image}`
      : `${baseUrl}/og-default.png`;

    return {
      title: `${data.title} - Learn ${category.toUpperCase()} | Revochamp`,
      description:
        data.subtitle ||
        `Master ${data.title} with interactive examples, quizzes, and code exercises.`,
      keywords: [data.title, category, "tutorial", "coding", "programming", "learn"].join(", "),
      authors: [{ name: "Revochamp Team", url: baseUrl }],
      alternates: { canonical: pageUrl },
      openGraph: {
        title: data.title,
        description: data.subtitle || `Master ${data.title} with interactive examples.`,
        url: pageUrl,
        siteName: "Revochamp",
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: `${data.title} tutorial`,
          },
        ],
        locale: "en_US",
        type: "article",
        authors: ["Revochamp Team"],
        tags: [category, "tutorial", "coding"],
      },
      twitter: {
        card: "summary_large_image",
        title: data.title,
        description: data.subtitle || `Master ${data.title} with interactive examples.`,
        images: [imageUrl],
        creator: "@revochamp",
        site: "@revochamp",
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
      verification: {
        google: process.env.GOOGLE_SITE_VERIFICATION,
      },
    };
  } catch (error) {
    console.error("Metadata generation failed for:", slug, error);
    return {
      title: "Tutorial Not Found | Revochamp",
      robots: { index: false },
    };
  }
}

// ============================================================
// 3. Helper: generate structured data (JSON-LD)
// ============================================================
function generateStructuredData(tutorialData: any, category: string, slug: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://revochamp.com";
  const url = `${baseUrl}/tech/${category}/${slug}`;
  const imageUrl = tutorialData.meta?.image
    ? tutorialData.meta.image.startsWith("http")
      ? tutorialData.meta.image
      : `${baseUrl}${tutorialData.meta.image}`
    : `${baseUrl}/og-default.png`;

  const schemaType = tutorialData.quiz?.length > 0 ? "Course" : "TechArticle";

  const structuredData = {
    "@context": "https://schema.org",
    "@type": schemaType,
    headline: tutorialData.title,
    description: tutorialData.subtitle || `Master ${tutorialData.title} with interactive examples.`,
    url: url,
    image: imageUrl,
    datePublished: tutorialData.publishedAt || new Date().toISOString(),
    dateModified: tutorialData.updatedAt || tutorialData.publishedAt || new Date().toISOString(),
    author: {
      "@type": "Organization",
      name: "Revochamp",
      url: baseUrl,
      logo: `${baseUrl}/logo.png`,
    },
    publisher: {
      "@type": "Organization",
      name: "Revochamp",
      logo: { "@type": "ImageObject", url: `${baseUrl}/logo.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    keywords: [category, "tutorial", "coding", tutorialData.title].join(", "),
    inLanguage: "en-US",
    isAccessibleForFree: true,
  };

  if (schemaType === "Course") {
    Object.assign(structuredData, {
      provider: {
        "@type": "Organization",
        name: "Revochamp",
        sameAs: baseUrl,
      },
      hasCourseInstance: {
        "@type": "CourseInstance",
        courseMode: ["online", "self-paced"],
        timeRequired: tutorialData.readTime || "PT1H",
      },
    });
  }

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: category.charAt(0).toUpperCase() + category.slice(1),
        item: `${baseUrl}/tech/${category}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: tutorialData.title,
        item: url,
      },
    ],
  };

  return { structuredData, breadcrumbData };
}

// ============================================================
// 4. Main page component (server component)
// ============================================================
export default async function TutorialPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;

  // Fetch tutorial data and all topics in parallel
  const [tutorialData, topics] = await Promise.all([
    fetchTutorial(category, slug).catch(() => null),
    fetchTopics(category).catch(() => []),
  ]);

  if (!tutorialData) {
    notFound();
  }

  const allTopics = topics.map((topic: any) => ({ slug: topic.slug }));
  const { structuredData, breadcrumbData } = generateStructuredData(tutorialData, category, slug);

  return (
    <>
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
      <TutorialClient
        initialData={tutorialData}
        category={category}
        slug={slug}
        allTopics={allTopics}
      />
    </>
  );
}
