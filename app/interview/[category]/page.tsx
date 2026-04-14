import { Metadata } from 'next';
import MockInterviewClient from './MockInterviewClient';
import StructuredData from './StructuredData';
import { fetchTopics, fetchConfig } from '@/lib/mockInterview';

// ✅ Enable Incremental Static Regeneration (ISR)
export const revalidate = 60;

// ✅ Correct PageProps for Next.js 15+ (params is a Promise)
interface PageProps {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  const fallbackCategories = [
    'html',
    'javascript',
    'reactjs',
    'typescript',
    'tailwind-css',
    'angular',
    'vuejs',
    'web-performance-optimization',
    'nodejs-express',
    'python-backend',
    'graphql-api-design',
    'java-spring-boot',
    'go-backend-development',
    'microservices-architecture',
    'docker-kubernetes',
    'cicd-pipelines',
    'terraform-essentials',
    'monitoring-prometheus',
    'linux-for-devops',
    'machine-learning-basics',
    'deep-learning',
    'nlp-with-python',
    'computer-vision',
    'generative-ai',
    'flutter',
    'reactnative',
    'android-kotlin',
    'ios-swift',
    'flutter-advanced',
    'aws-fundamentals',
    'azure-cloud-essentials',
    'google-cloud-platform',
    'cloud-architecture-design',
    'serverless-architecture',
    'cloud-security',
    'sql-fundamentals',
    'advanced-sql-optimization',
    'mongodb-complete-guide',
    'postgresql-deep-dive',
    'redis-caching',
    'database-design-architecture',
    'software-testing-fundamentals',
    'automation-testing-selenium',
    'api-testing-postman',
    'performance-testing',
    'unit-testing-tdd',
    'mobile-app-testing',
    'cyber-security-fundamentals',
    'ethical-hacking',
    'web-security',
    'network-security',
    'cloud-security-cyber',
    'security-operations-soc',
    'ui-ux-fundamentals',
    'figma-mastery',
    'ux-research',
    'wireframing-prototyping',
    'design-systems-ui-architecture',
    'mobile-app-ui-design',
    'system-design-fundamentals',
    'high-level-design',
    'low-level-design',
    'scalable-microservices',
    'real-time-systems',
    'system-design-interview',
    'git-github-mastery',
    'vs-code-productivity',
    'postman-api-testing',
    'docker-for-developers',
    'linux-command-line',
    'jira-agile-tools',
    'dsa-for-interviews',
    'coding-interview-problems',
    'system-design-interview-prep',
    'frontend-interview-prep',
    'backend-interview-prep',
    'hr-behavioral-interviews',
  ];

  try {
    // ✅ Prevent Cloudflare caching of this build‑time fetch
    const res = await fetch('https://json.revochamp.site/tech/category.json', {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const courses = data.courses || [];
    const apiCategories = [...new Set(courses.map((c: any) => c.category))] as string[];
    const apiSlugs = apiCategories.map((cat) =>
      cat.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    );
    const allSlugs = [...new Set([...apiSlugs, ...fallbackCategories])];
    return allSlugs.filter(Boolean).map((category) => ({ category }));
  } catch (error) {
    console.error('generateStaticParams error:', error);
    return fallbackCategories.map((category) => ({ category }));
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category: categorySlug } = await params; // ✅ await the promise

  const displayCategory = categorySlug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  try {
    // ✅ fetchTopics already uses revalidate: 60 (updated in lib)
    const topics = await fetchTopics(categorySlug);
    const popularTopics = topics.slice(0, 5).map((t) => t.title);
    const title = `${displayCategory} Mock Interview Tests `;
    const description = `Prepare for ${displayCategory} interviews with ${topics.length}+ tests. Practice ${popularTopics
      .slice(0, 3)
      .join(', ')}. Free AI feedback.`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `https://revochamp.site/tech/mock-interview/${categorySlug}`,
        images: [`https://revochamp.site/og-images/mock-interview/${categorySlug}.png`],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        site: '@revochamp',
        creator: '@revochamp',
        title,
        description,
        images: [`https://revochamp.site/og-images/mock-interview/${categorySlug}.png`],
      },
      robots: 'index, follow',
      alternates: { canonical: `https://revochamp.site/tech/mock-interview/${categorySlug}` },
    };
  } catch {
    // ✅ Improved fallback metadata
    return {
      title: `${displayCategory} Mock Interview | RevoChamp`,
      description: `Practice ${displayCategory} interview questions with AI.`,
    };
  }
}

export default async function Page({ params }: PageProps) {
  const { category: categorySlug } = await params; // ✅ await the promise

  try {
    const [topics, config] = await Promise.all([
      fetchTopics(categorySlug),
      fetchConfig(categorySlug).catch(() => null),
    ]);

    // ✅ Instead of 404, render the client with empty topics (better for SEO)
    return (
      <>
        <StructuredData category={categorySlug} topics={topics} config={config} />
        <MockInterviewClient
          category={categorySlug}
          initialTopics={topics || []}
          config={config}
        />
      </>
    );
  } catch (error) {
    console.error('Page error:', error);
    // ✅ Graceful fallback – show empty state rather than 404
    return (
      <>
        <StructuredData category={categorySlug} topics={[]} config={null} />
        <MockInterviewClient
          category={categorySlug}
          initialTopics={[]}
          config={null}
        />
      </>
    );
  }
}
