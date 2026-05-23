import { MetadataRoute } from 'next'
import { getAllBlogSlugs } from '@/lib/blog-detail-service'

// ✅ Required for static export
export const dynamic = 'force-static'

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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://revochamp.site'
  const now = new Date()

  let dynamicItems: MetadataRoute.Sitemap = [];

  try {
    const res = await fetch('https://json.revochamp.site/tech/category.json');
    if (res.ok) {
      const data = await res.json();
      const courses = data.courses || [];

      // 1. Add course main category pages (e.g. /tech/html, /tech/reactjs)
      courses.forEach((course: any) => {
        dynamicItems.push({
          url: `${baseUrl}/tech/${course.slug}`,
          lastModified: now,
          changeFrequency: 'weekly',
          priority: 0.8,
        });
      });

      // 2. Fetch topics for each category and add lesson URLs in parallel
      const topicsPromises = courses.map(async (course: any) => {
        const slug = course.slug;
        try {
          const topicsRes = await fetch(`https://json.revochamp.site/${slug}/topics.json`);
          if (topicsRes.ok) {
            const topicsData = await topicsRes.json();
            return topicsData.map((topic: any) => ({
              url: `${baseUrl}/tech/${slug}/${topic.slug}`,
              lastModified: now,
              changeFrequency: 'monthly',
              priority: 0.7,
            }));
          }
        } catch (e) {
          // ignore
        }
        return [];
      });

      const allTopicsResults = await Promise.all(topicsPromises);
      allTopicsResults.forEach((topicsList) => {
        dynamicItems = dynamicItems.concat(topicsList);
      });

      // 3. Add all mock interview categories
      const apiCategories = [...new Set(courses.map((c: any) => c.category))] as string[];
      const apiSlugs = apiCategories.map((cat) =>
        cat.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      );
      const allInterviewSlugs = [...new Set([...apiSlugs, ...fallbackCategories])].filter(Boolean);

      allInterviewSlugs.forEach((slug) => {
        dynamicItems.push({
          url: `${baseUrl}/interview/${slug}`,
          lastModified: now,
          changeFrequency: 'weekly',
          priority: 0.8,
        });
      });

      // 4. Fetch dynamic mock interview test pages (detailed tests per category)
      const interviewTestsPromises = courses.map(async (course: any) => {
        const slug = course.slug;
        try {
          const mockRes = await fetch(`https://json.revochamp.site/mockinterview/${slug}/topics.json`);
          if (mockRes.ok) {
            const mockData = await mockRes.json();
            return mockData.map((topic: any) => ({
              url: `${baseUrl}/interview/${slug}/${topic.slug}`,
              lastModified: now,
              changeFrequency: 'weekly',
              priority: 0.7,
            }));
          }
        } catch (e) {
          // ignore
        }
        return [];
      });

      const allInterviewTestsResults = await Promise.all(interviewTestsPromises);
      allInterviewTestsResults.forEach((testsList) => {
        dynamicItems = dynamicItems.concat(testsList);
      });

      // 5. Fetch all dynamic blog posts
      try {
        const blogSlugs = await getAllBlogSlugs();
        blogSlugs.forEach((slug: string) => {
          dynamicItems.push({
            url: `${baseUrl}/blog/${slug}`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.8,
          });
        });
      } catch (blogErr) {
        console.error('Error fetching blog slugs for sitemap:', blogErr);
      }
    }
  } catch (err) {
    console.error('Error generating dynamic sitemap:', err);
  }

  const staticItems: MetadataRoute.Sitemap = [
    // ─── Home ───────────────────────────────────────────────
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },

    // ─── Tech / Courses ─────────────────────────────────────
    {
      url: `${baseUrl}/tech/courses`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },

    // ─── Blog ───────────────────────────────────────────────
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },

    // ─── Interview ──────────────────────────────────────────
    {
      url: `${baseUrl}/interview`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },

    // ─── News ───────────────────────────────────────────────
    {
      url: `${baseUrl}/news`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    },

    // ─── Tools Hub ──────────────────────────────────────────
    {
      url: `${baseUrl}/tools`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },

    // ─── Tech Tools ─────────────────────────────────────────
    {
      url: `${baseUrl}/tools/tech`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tools/tech/base64`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tools/tech/color-converter`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tools/tech/csv-to-json`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tools/tech/hash-generator`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tools/tech/image-compressor`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tools/tech/ip-lookup`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tools/tech/json-formatter`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tools/tech/jwt-debugger`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tools/tech/lorem-ipsum`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tools/tech/meta-analyzer`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tools/tech/password-generator`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tools/tech/password-strength`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tools/tech/qr-generator`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tools/tech/regex-tester`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tools/tech/sql-formatter`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tools/tech/ssl-checker`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tools/tech/timestamp-converter`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tools/tech/unit-converter`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tools/tech/url-parser`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tools/tech/url-shortener`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tools/tech/uuid-generator`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },

    // ─── Finance Tools ──────────────────────────────────────
    {
      url: `${baseUrl}/tools/finance`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tools/finance/car-loan-calculator`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tools/finance/compound-interest-calculator`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tools/finance/education-loan-calculator`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tools/finance/emi-calculator`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tools/finance/fd-calculator`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tools/finance/gst-calculator`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tools/finance/health-insurance-calculator`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tools/finance/home-loan-calculator`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tools/finance/income-tax-calculator`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tools/finance/life-insurance-calculator`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tools/finance/loan-eligibility`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tools/finance/lumpsum-calculator`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tools/finance/mf-returns-calculator`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tools/finance/personal-loan-calculator`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tools/finance/rd-calculator`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tools/finance/savings-calculator`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tools/finance/sip-calculator`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tools/finance/sip-goal-planner`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tools/finance/swp-calculator`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tools/finance/term-insurance-calculator`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tools/finance/ulip-calculator`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },

    // ─── Health Tools ────────────────────────────────────────
    {
      url: `${baseUrl}/tools/health`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tools/health/baby-gender-predictor`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tools/health/baby-growth`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tools/health/baby-sleep-tracker`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tools/health/breastfeeding-tracker`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tools/health/diaper-tracker`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tools/health/due-date-calculator`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tools/health/fertile-window`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tools/health/fertility-assessment`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tools/health/health-calculator`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tools/health/hospital-bag-checklist`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tools/health/hydration-calculator`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tools/health/implantation-calculator`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tools/health/ivf-prediction`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tools/health/kick-counter`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tools/health/newborn-weight-tracker`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tools/health/ovulation-calculator`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tools/health/period-calculator`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tools/health/pregnancy-conception`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tools/health/pregnancy-due-date`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tools/health/pregnancy-symptom-checker`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tools/health/pregnancy-weight-gain`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tools/health/teething-calculator`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tools/health/vaccination-reminder`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },

    // ─── Marketing Tools ─────────────────────────────────────
    {
      url: `${baseUrl}/tools/marketing`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tools/marketing/keyword-density`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },

    // ─── Static / Info Pages ─────────────────────────────────
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
  ];

  return [...staticItems, ...dynamicItems];
}