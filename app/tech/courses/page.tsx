import { Metadata } from "next";
import { Suspense } from "react"; // ✅ Add this import
import { fetchCourses } from "@/lib/course-service";
import CourseClient from "./course-client";
import { cache } from "react";

export const revalidate = 3600;

const getCourses = cache(async () => {
  try {
    return await fetchCourses();
  } catch (error) {
    console.error("Failed to fetch courses:", error);
    return { courses: [], categories: [] };
  }
});

export async function generateMetadata(): Promise<Metadata> {
  const { courses } = await getCourses();
  const courseCount = courses?.length ?? 100;
  
  return {
    title: "Free Programming Courses | Learn Frontend, Backend, AI, DevOps | RevoChamp",
    description: `Access ${courseCount}+ free programming courses including Frontend, Backend, Mobile, AI & ML, DevOps, Cloud Computing. Start your tech career today.`,
    openGraph: {
      title: "Free Programming Courses | RevoChamp",
      description: `Access ${courseCount}+ free programming courses. All courses 100% free with certificates.`,
      url: "https://revochamp.site/tech/courses",
      images: [{ url: "https://revochamp.site/tech/og-image-courses.jpg" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Free Programming Courses | RevoChamp",
      description: `Access ${courseCount}+ free programming courses. Learn Frontend, Backend, AI, DevOps and more.`,
      images: ["https://revochamp.site/tech/og-image-courses.jpg"],
    },
  };
}

export default async function CoursesPage() {
  const { courses, categories } = await getCourses();

  const jsonLdOrg = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "RevoChamp",
    url: "https://revochamp.site",
    logo: "https://revochamp.site/logo.png",
    sameAs: ["https://twitter.com/revochamp", "https://linkedin.com/company/revochamp", "https://github.com/revochamp"],
    description: "Free online programming courses designed for developers.",
    email: "contact@revochamp.site",
  };

  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://revochamp.site" },
      { "@type": "ListItem", position: 2, name: "All Courses", item: "https://revochamp.site/tech/courses" },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />
      {/* ✅ Wrap with Suspense */}
      <Suspense fallback={<div>Loading courses...</div>}>
        <CourseClient initialCourses={courses} initialCategories={categories} />
      </Suspense>
    </>
  );
}
