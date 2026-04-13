import { Metadata } from "next";
import { Course } from "@/types/course";
import React from "react";
import { type } from "os";
// ==================== BASE CONFIG ====================
export const SITE_CONFIG = {
  name: "RevoChamp",
  url: "https://revochamp.site/tech",
  twitterHandle: "@revochamp",
  defaultImage: "/og-image.png",
};

// ==================== JSON-LD SCHEMA GENERATORS ====================

/** Generates schema for a collection page (e.g., /courses) */
export function generateCollectionPageSchema(
  courses: Course[],
  pageTitle: string,
  pageDescription: string,
  pageUrl: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: pageTitle,
    description: pageDescription,
    url: pageUrl,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: courses.length,
      itemListElement: courses.slice(0, 10).map((course, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Course",
          name: course.title,
          description: course.description,
          provider: {
            "@type": "Organization",
            name: SITE_CONFIG.name,
            sameAs: SITE_CONFIG.url,
          },
          url: `${SITE_CONFIG.url}/courses/${course.slug}`,
        },
      })),
    },
  };
}

export function generateArticleSchema({
  title,
  description,
  url,
  image,
  publishedTime,
  modifiedTime,
}: {
  title: string;
  description: string;
  url: string;
  image: string;
  publishedTime: string;
  modifiedTime: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: description,
    image: image,
    author: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_CONFIG.url}/logo.png`,
      },
    },
    datePublished: publishedTime,
    dateModified: modifiedTime,
    mainEntityOfPage: url,
  };
}
/** Generates schema for a single course page */
export function generateCourseSchema(course: Course) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.description,
    provider: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      sameAs: SITE_CONFIG.url,
    },
    url: `${SITE_CONFIG.url}/courses/${course.slug}`,
    image: `${SITE_CONFIG.url}${SITE_CONFIG.defaultImage}`,
    educationalLevel: course.level,
    timeRequired: course.duration,
    teaches: course.topics.join(", "),
    audience: {
      "@type": "EducationalAudience",
      educationalRole: course.level,
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      courseWorkload: course.duration,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: course.rating || 4.8,
      ratingCount: course.studentCount,
    },
  };
}

/** Generates FAQPage schema */
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/** Generates BreadcrumbList schema */
export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/** Generates Organization schema (for homepage or global) */
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    logo: `${SITE_CONFIG.url}/logo.png`,
    sameAs: [
      "https://twitter.com/revochamp",
      "https://www.facebook.com/revochamp",
      "https://www.linkedin.com/company/revochamp",
    ],
  };
}

/** Generates WebSite schema (for root layout) */
export function generateWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_CONFIG.url}/courses?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

// ==================== NEXT.JS METADATA HELPERS ====================

interface MetadataParams {
  title: string;
  description: string;
  url: string;
  image?: string;
  keywords?: string[];
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: { name: string; url?: string }[];
  noIndex?: boolean;
}

/** Constructs a complete Next.js Metadata object */
export function constructMetadata({
  title,
  description,
  url,
  image = `${SITE_CONFIG.url}/og-image.png`,
  keywords = [],
  type = "website",
  publishedTime,
  modifiedTime,
  authors,
  noIndex = false,
}: MetadataParams): Metadata {
  const fullTitle = title.includes(SITE_CONFIG.name)
    ? title
    : `${title} | ${SITE_CONFIG.name}`;

  return {
    title: fullTitle,
    description,
    keywords: keywords,
    authors: authors,
    robots: noIndex ? "noindex, nofollow" : "index, follow, max-image-preview:large",
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_CONFIG.name,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type,
      publishedTime,
      modifiedTime,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
      creator: SITE_CONFIG.twitterHandle,
      site: SITE_CONFIG.twitterHandle,
    },
    alternates: {
      canonical: url,
    },
  };
}

// ==================== UTILITY: INJECT JSON-LD ====================
// (Used in layout or page components)

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}