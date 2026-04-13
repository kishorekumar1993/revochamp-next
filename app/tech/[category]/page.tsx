// app/tech/[category]/page.tsx

import { notFound } from 'next/navigation';
import { fetchTopics, fetchConfig } from '@/lib/api/topics';
import { generateTopicPageMetadata } from '@/lib/seo/metadata';
import {
  generateOrganizationSchema,
  generateCollectionPageSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
} from '@/lib/seo/schemas';
import TopicsClient from './TopicsClient';
import Script from 'next/script';

type Props = {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

// ✅ ADD THIS FUNCTION – REQUIRED FOR STATIC EXPORT
export async function generateStaticParams() {
  // Fetch the list of all course slugs from your JSON endpoint
  const res = await fetch('https://json.revochamp.site/tech/category.json');
  const data = await res.json();
  const courses = data.courses || [];

  // Return an array of { category: slug } for each course
  return courses.map((course: { slug: string }) => ({
    category: course.slug,
  }));
}

export async function generateMetadata({ params }: Props) {
  const { category } = await params;
  const topics = await fetchTopics(category).catch(() => []);
  const popularTopics = topics.slice(0, 10).map(t => t.title);
  const capitalized = category.charAt(0).toUpperCase() + category.slice(1);

  const seoConfig = {
    category: capitalized,
    topicCount: topics.length,
    popularTopics,
    canonicalUrl: `https://revochamp.site/tech/${category.toLowerCase()}`,
    ogImageUrl: `https://revochamp.site/tech/og-images/${category.toLowerCase()}.png`,
    pageTitle: `${capitalized} Tutorials | Learn ${capitalized} Programming | RevoChamp`,
    metaDescription: `Master ${capitalized} with ${topics.length}+ free tutorials. Learn ${popularTopics.slice(0, 3).join(', ')}, and more. Step-by-step guides for beginners to advanced developers.`,
    keywords: [
      category.toLowerCase(),
      `${category} tutorials`,
      `learn ${category}`,
      `${category} programming`,
      `${category} guide`,
      `${category} examples`,
      `${category} course`,
      `${category} for beginners`,
      `advanced ${category}`,
      ...popularTopics.map(t => `${category} ${t}`),
      `free ${category} tutorials`,
      `online ${category} course`,
    ],
  };

  return generateTopicPageMetadata(seoConfig);
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  
  try {
    const [topics, config] = await Promise.all([
      fetchTopics(category),
      fetchConfig(category),
    ]);

    if (!topics.length) notFound();

    const capitalized = category.charAt(0).toUpperCase() + category.slice(1);
    const popularTopics = topics.slice(0, 10).map(t => t.title);
    const description = `Master ${capitalized} with ${topics.length}+ free tutorials.`;

    // Prepare JSON-LD schemas
    const organizationSchema = generateOrganizationSchema();
    const collectionSchema = generateCollectionPageSchema(
      capitalized,
      topics,
      description,
      `https://revochamp.site/tech/${category.toLowerCase()}`
    );
    const breadcrumbSchema = generateBreadcrumbSchema([
      { name: 'Home', url: 'https://revochamp.site/' },
      { name: 'Tech Tutorials', url: 'https://revochamp.site/tech' },
      { name: 'All Courses', url: 'https://revochamp.site/tech/courses' },
      { name: capitalized, url: `https://revochamp.site/tech/${category.toLowerCase()}` },
    ]);
    const faqSchema = generateFAQSchema(getDefaultFAQs(capitalized, topics.length));

    return (
      <>
        {/* Inject JSON-LD structured data */}
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <Script
          id="collection-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
        />
        <Script
          id="breadcrumb-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        <Script
          id="faq-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />

        {/* Hidden SEO headings for crawlers */}
        <div style={{ position: 'absolute', left: '-9999px', top: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}>
          <h1>{capitalized} Tutorials - Learn {capitalized} Programming</h1>
          <h2>Comprehensive {capitalized} Learning Resources</h2>
        </div>

        <TopicsClient
          initialTopics={topics}
          initialConfig={config}
          category={category}
        />
      </>
    );
  } catch (error) {
    console.error('Error loading category:', error);
    notFound();
  }
}

function getDefaultFAQs(category: string, topicCount: number) {
  return [
    {
      question: `What is ${category} and why should I learn it?`,
      answer: `${category} is a powerful technology used for modern application development. Learning ${category} opens doors to high-demand job opportunities. Our tutorials cover everything from basics to advanced concepts.`,
    },
    {
      question: `How long does it take to learn ${category}?`,
      answer: `The basics of ${category} can be learned in 2-4 weeks with consistent practice (2-3 hours daily). Intermediate proficiency takes 2-3 months, while mastery requires 6-12 months of regular coding.`,
    },
    {
      question: `Is ${category} good for beginners?`,
      answer: `Yes! ${category} has excellent documentation, a supportive community, and many beginner-friendly resources. Start with our beginner tutorials that cover fundamental concepts.`,
    },
    {
      question: `What can I build with ${category}?`,
      answer: `With ${category}, you can build web applications, mobile apps, desktop software, backend services, APIs, games, AI/ML applications, and more.`,
    },
    {
      question: `Are these ${category} tutorials really free?`,
      answer: `Yes! All ${topicCount}+ tutorials on RevoChamp are completely free. We believe in democratizing tech education.`,
    },
  ];
}

// import { notFound } from 'next/navigation';
// import { fetchTopics, fetchConfig } from '@/lib/api/topics';
// import { generateTopicPageMetadata } from '@/lib/seo/metadata';
// import {
//   generateOrganizationSchema,
//   generateCollectionPageSchema,
//   generateBreadcrumbSchema,
//   generateFAQSchema,
// } from '@/lib/seo/schemas';
// import TopicsClient from './TopicsClient';
// import Script from 'next/script';

// type Props = {
//   params: Promise<{ category: string }>;
//   searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
// };


// export async function generateMetadata({ params }: Props) {
//   const { category } = await params;
//   const topics = await fetchTopics(category).catch(() => []);
//   const popularTopics = topics.slice(0, 10).map(t => t.title);
//   const capitalized = category.charAt(0).toUpperCase() + category.slice(1);

//   const seoConfig = {
//     category: capitalized,
//     topicCount: topics.length,
//     popularTopics,
//     canonicalUrl: `https://revochamp.site/tech/${category.toLowerCase()}`,
//     ogImageUrl: `https://revochamp.site/tech/og-images/${category.toLowerCase()}.png`,
//     pageTitle: `${capitalized} Tutorials | Learn ${capitalized} Programming | RevoChamp`,
//     metaDescription: `Master ${capitalized} with ${topics.length}+ free tutorials. Learn ${popularTopics.slice(0, 3).join(', ')}, and more. Step-by-step guides for beginners to advanced developers.`,
//     keywords: [
//       category.toLowerCase(),
//       `${category} tutorials`,
//       `learn ${category}`,
//       `${category} programming`,
//       `${category} guide`,
//       `${category} examples`,
//       `${category} course`,
//       `${category} for beginners`,
//       `advanced ${category}`,
//       ...popularTopics.map(t => `${category} ${t}`),
//       `free ${category} tutorials`,
//       `online ${category} course`,
//     ],
//   };

//   return generateTopicPageMetadata(seoConfig);
// }

// export default async function CategoryPage({ params }: Props) {
//   const { category } = await params;
  
//   try {
//     const [topics, config] = await Promise.all([
//       fetchTopics(category),
//       fetchConfig(category),
//     ]);

//     if (!topics.length) notFound();

//     const capitalized = category.charAt(0).toUpperCase() + category.slice(1);
//     const popularTopics = topics.slice(0, 10).map(t => t.title);
//     const description = `Master ${capitalized} with ${topics.length}+ free tutorials.`;

//     // Prepare JSON-LD schemas
//     const organizationSchema = generateOrganizationSchema();
//     const collectionSchema = generateCollectionPageSchema(
//       capitalized,
//       topics,
//       description,
//       `https://revochamp.site/tech/${category.toLowerCase()}`
//     );
//     const breadcrumbSchema = generateBreadcrumbSchema([
//       { name: 'Home', url: 'https://revochamp.site/' },
//       { name: 'Tech Tutorials', url: 'https://revochamp.site/tech' },
//       { name: 'All Courses', url: 'https://revochamp.site/tech/courses' },
//       { name: capitalized, url: `https://revochamp.site/tech/${category.toLowerCase()}` },
//     ]);
//     const faqSchema = generateFAQSchema(getDefaultFAQs(capitalized, topics.length));

//     return (
//       <>
//         {/* Inject JSON-LD structured data */}
//         <Script
//           id="organization-schema"
//           type="application/ld+json"
//           dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
//         />
//         <Script
//           id="collection-schema"
//           type="application/ld+json"
//           dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
//         />
//         <Script
//           id="breadcrumb-schema"
//           type="application/ld+json"
//           dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
//         />
//         <Script
//           id="faq-schema"
//           type="application/ld+json"
//           dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
//         />

//         {/* Hidden SEO headings for crawlers */}
//         <div style={{ position: 'absolute', left: '-9999px', top: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}>
//           <h1>{capitalized} Tutorials - Learn {capitalized} Programming</h1>
//           <h2>Comprehensive {capitalized} Learning Resources</h2>
//         </div>

//         <TopicsClient
//           initialTopics={topics}
//           initialConfig={config}
//           category={category}
//         />
//       </>
//     );
//   } catch (error) {
//     console.error('Error loading category:', error);
//     notFound();
//   }
// }

// function getDefaultFAQs(category: string, topicCount: number) {
//   return [
//     {
//       question: `What is ${category} and why should I learn it?`,
//       answer: `${category} is a powerful technology used for modern application development. Learning ${category} opens doors to high-demand job opportunities. Our tutorials cover everything from basics to advanced concepts.`,
//     },
//     {
//       question: `How long does it take to learn ${category}?`,
//       answer: `The basics of ${category} can be learned in 2-4 weeks with consistent practice (2-3 hours daily). Intermediate proficiency takes 2-3 months, while mastery requires 6-12 months of regular coding.`,
//     },
//     {
//       question: `Is ${category} good for beginners?`,
//       answer: `Yes! ${category} has excellent documentation, a supportive community, and many beginner-friendly resources. Start with our beginner tutorials that cover fundamental concepts.`,
//     },
//     {
//       question: `What can I build with ${category}?`,
//       answer: `With ${category}, you can build web applications, mobile apps, desktop software, backend services, APIs, games, AI/ML applications, and more.`,
//     },
//     {
//       question: `Are these ${category} tutorials really free?`,
//       answer: `Yes! All ${topicCount}+ tutorials on RevoChamp are completely free. We believe in democratizing tech education.`,
//     },
//   ];
// }