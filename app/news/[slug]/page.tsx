import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { NewsDetailClient } from './Newsdetailclient';

// Types for the API response
interface ArticleStats {
  value: string;
  label: string;
}

interface ContentBlock {
  type: 'heading' | 'text' | 'cta';
  value: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface MetaData {
  title: string;
  description: string;
}

interface ArticleData {
  slug: string;
  title: string;
  subtitle: string;
  author: string;
  date: string;
  categories: string[];
  tags: string[];
  readTime: string;
  featuredImage: string;
  stats: ArticleStats[];
  content: ContentBlock[];
  meta: MetaData;
  faq: FAQItem[];
  related: string[]; // slugs of related articles
}

// Fetch article data from the JSON API
async function getArticle(slug: string): Promise<ArticleData | null> {
  try {
    const res = await fetch(`https://json.revochamp.site/blog/${slug}.json`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });
    if (!res.ok) return null;
    const data: ArticleData = await res.json();
    return data;
  } catch (error) {
    console.error(`Failed to fetch article ${slug}:`, error);
    return null;
  }
}

// Generate static params from the list of articles (from page-1.json)
export async function generateStaticParams() {
  try {
    const res = await fetch('https://json.revochamp.site/blog/page/page-1.json');
    if (!res.ok) return [];
    const json = await res.json();
    const articles = json.data || [];
    return articles.map((article: { slug: string }) => ({ slug: article.slug }));
  } catch (error) {
    console.error('Failed to generate static params:', error);
    return [];
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) {
    return { title: 'Article Not Found' };
  }
  return {
    title: article.meta?.title || article.title,
    description: article.meta?.description || article.subtitle,
    authors: [{ name: article.author }],
    openGraph: {
      title: article.title,
      description: article.subtitle,
      images: [{ url: article.featuredImage, width: 1200, height: 630 }],
      type: 'article',
      publishedTime: new Date(article.date).toISOString(),
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.subtitle,
      images: [article.featuredImage],
    },
  };
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) {
    notFound();
  }
  return <NewsDetailClient article={article} />;
}

// // app/news/[slug]/page.tsx
// import { notFound } from 'next/navigation';
// import type { Metadata } from 'next';
// import { NewsDetailClient } from './Newsdetailclient';
// // import { NewsDetailClient } from './Newsdetailclient';

// // Mock data - replace with real API call
// const MOCK_ARTICLES: Record<string, any> = {
//   'ai-revolution-2024': {
//     id: '1',
//     slug: 'ai-revolution-2024',
//     title: 'The AI Revolution: How Machine Learning is Reshaping Industries',
//     subtitle: 'From healthcare to finance, artificial intelligence is transforming every sector of the economy at an unprecedented pace.',
//     category: 'AI & ML',
//     image: 'https://images.unsplash.com/photo-1677442d019cecf8dc0b47dc1d4d27c0?w=1200&h=630&fit=crop',
//     date: 'January 15, 2024',
//     author: 'Sarah Chen',
//     authorImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop',
//     authorBio: 'Technology correspondent with 10 years of experience covering AI and innovation.',
//     readTime: '8 min read',
//     content: 'The artificial intelligence revolution...',
//     tags: ['AI', 'Machine Learning', 'Technology', 'Innovation', 'Future of Work'],
//     relatedArticles: [
//       {
//         slug: 'startup-funding-surge',
//         title: 'Startup Funding Reaches $50B in Q1 2024',
//         category: 'Startups',
//         image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
//       },
//       {
//         slug: 'tech-stock-rally',
//         title: 'Tech Stocks Rally on Strong Earnings Reports',
//         category: 'Markets',
//         image: 'https://images.unsplash.com/photo-1611974259348-dfb5b5b5b2f0?w=400&h=300&fit=crop',
//       },
//       {
//         slug: 'web3-future',
//         title: 'The Future of Web3: Decentralized or Centralized?',
//         category: 'Technology',
//         image: 'https://images.unsplash.com/photo-1639322537231-2f206e06af84?w=400&h=300&fit=crop',
//       },
//     ],
//   },
//   'startup-funding-surge': {
//     id: '2',
//     slug: 'startup-funding-surge',
//     title: 'Startup Funding Reaches $50B in Q1 2024',
//     subtitle: 'Despite economic headwinds, venture capital continues to pour into innovative startups globally.',
//     category: 'Startups',
//     image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=630&fit=crop',
//     date: 'January 14, 2024',
//     author: 'Michael Rodriguez',
//     authorImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop',
//     authorBio: 'Senior venture capital analyst tracking startup ecosystems.',
//     readTime: '6 min read',
//     content: 'The startup ecosystem continues to thrive...',
//     tags: ['Startups', 'Funding', 'Venture Capital', 'Tech'],
//     relatedArticles: [
//       {
//         slug: 'ai-revolution-2024',
//         title: 'The AI Revolution: How Machine Learning is Reshaping Industries',
//         category: 'AI & ML',
//         image: 'https://images.unsplash.com/photo-1677442d019cecf8dc0b47dc1d4d27c0?w=400&h=300&fit=crop',
//       },
//       {
//         slug: 'tech-stock-rally',
//         title: 'Tech Stocks Rally on Strong Earnings Reports',
//         category: 'Markets',
//         image: 'https://images.unsplash.com/photo-1611974259348-dfb5b5b5b2f0?w=400&h=300&fit=crop',
//       },
//       {
//         slug: 'business-trends-2024',
//         title: '5 Business Trends to Watch in 2024',
//         category: 'Business',
//         image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
//       },
//     ],
//   },
//   'tech-stock-rally': {
//     id: '3',
//     slug: 'tech-stock-rally',
//     title: 'Tech Stocks Rally on Strong Earnings Reports',
//     subtitle: 'Major technology companies exceed investor expectations with robust Q4 earnings.',
//     category: 'Markets',
//     image: 'https://images.unsplash.com/photo-1611974259348-dfb5b5b5b2f0?w=1200&h=630&fit=crop',
//     date: 'January 13, 2024',
//     author: 'James Wilson',
//     authorImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop',
//     authorBio: 'Financial market analyst and investment strategist.',
//     readTime: '5 min read',
//     content: 'The technology sector shows strong performance...',
//     tags: ['Markets', 'Tech Stocks', 'Finance', 'Trading'],
//     relatedArticles: [
//       {
//         slug: 'crypto-comeback',
//         title: 'Cryptocurrency Market Shows Signs of Recovery',
//         category: 'Finance',
//         image: 'https://images.unsplash.com/photo-1621504211117-ba8f672f237b?w=400&h=300&fit=crop',
//       },
//       {
//         slug: 'ai-revolution-2024',
//         title: 'The AI Revolution: How Machine Learning is Reshaping Industries',
//         category: 'AI & ML',
//         image: 'https://images.unsplash.com/photo-1677442d019cecf8dc0b47dc1d4d27c0?w=400&h=300&fit=crop',
//       },
//       {
//         slug: 'startup-funding-surge',
//         title: 'Startup Funding Reaches $50B in Q1 2024',
//         category: 'Startups',
//         image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
//       },
//     ],
//   },
//   'crypto-comeback': {
//     id: '4',
//     slug: 'crypto-comeback',
//     title: 'Cryptocurrency Market Shows Signs of Recovery',
//     subtitle: 'Bitcoin and Ethereum surge amid renewed investor confidence and institutional adoption.',
//     category: 'Finance',
//     image: 'https://images.unsplash.com/photo-1621504211117-ba8f672f237b?w=1200&h=630&fit=crop',
//     date: 'January 12, 2024',
//     author: 'Emma Thompson',
//     authorImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop',
//     authorBio: 'Cryptocurrency and blockchain specialist.',
//     readTime: '7 min read',
//     content: 'The crypto market momentum builds...',
//     tags: ['Crypto', 'Bitcoin', 'Finance', 'Blockchain'],
//     relatedArticles: [
//       {
//         slug: 'tech-stock-rally',
//         title: 'Tech Stocks Rally on Strong Earnings Reports',
//         category: 'Markets',
//         image: 'https://images.unsplash.com/photo-1611974259348-dfb5b5b5b2f0?w=400&h=300&fit=crop',
//       },
//       {
//         slug: 'web3-future',
//         title: 'The Future of Web3: Decentralized or Centralized?',
//         category: 'Technology',
//         image: 'https://images.unsplash.com/photo-1639322537231-2f206e06af84?w=400&h=300&fit=crop',
//       },
//       {
//         slug: 'startup-funding-surge',
//         title: 'Startup Funding Reaches $50B in Q1 2024',
//         category: 'Startups',
//         image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
//       },
//     ],
//   },
//   'web3-future': {
//     id: '5',
//     slug: 'web3-future',
//     title: 'The Future of Web3: Decentralized or Centralized?',
//     subtitle: 'Industry experts debate the true nature and future direction of decentralized internet technology.',
//     category: 'Technology',
//     image: 'https://images.unsplash.com/photo-1639322537231-2f206e06af84?w=1200&h=630&fit=crop',
//     date: 'January 11, 2024',
//     author: 'David Park',
//     authorImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop',
//     authorBio: 'Web3 architect and decentralized systems expert.',
//     readTime: '9 min read',
//     content: 'The Web3 ecosystem evolves...',
//     tags: ['Web3', 'Blockchain', 'Decentralization', 'Future Tech'],
//     relatedArticles: [
//       {
//         slug: 'crypto-comeback',
//         title: 'Cryptocurrency Market Shows Signs of Recovery',
//         category: 'Finance',
//         image: 'https://images.unsplash.com/photo-1621504211117-ba8f672f237b?w=400&h=300&fit=crop',
//       },
//       {
//         slug: 'ai-revolution-2024',
//         title: 'The AI Revolution: How Machine Learning is Reshaping Industries',
//         category: 'AI & ML',
//         image: 'https://images.unsplash.com/photo-1677442d019cecf8dc0b47dc1d4d27c0?w=400&h=300&fit=crop',
//       },
//       {
//         slug: 'startup-funding-surge',
//         title: 'Startup Funding Reaches $50B in Q1 2024',
//         category: 'Startups',
//         image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
//       },
//     ],
//   },
//   'business-trends-2024': {
//     id: '6',
//     slug: 'business-trends-2024',
//     title: '5 Business Trends to Watch in 2024',
//     subtitle: 'From automation to sustainability, these are the trends reshaping the business landscape.',
//     category: 'Business',
//     image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=630&fit=crop',
//     date: 'January 10, 2024',
//     author: 'Lisa Anderson',
//     authorImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop',
//     authorBio: 'Business strategy consultant and trend analyst.',
//     readTime: '6 min read',
//     content: 'Business transformation accelerates...',
//     tags: ['Business', 'Trends', 'Strategy', 'Growth'],
//     relatedArticles: [
//       {
//         slug: 'ai-revolution-2024',
//         title: 'The AI Revolution: How Machine Learning is Reshaping Industries',
//         category: 'AI & ML',
//         image: 'https://images.unsplash.com/photo-1677442d019cecf8dc0b47dc1d4d27c0?w=400&h=300&fit=crop',
//       },
//       {
//         slug: 'startup-funding-surge',
//         title: 'Startup Funding Reaches $50B in Q1 2024',
//         category: 'Startups',
//         image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
//       },
//       {
//         slug: 'tech-stock-rally',
//         title: 'Tech Stocks Rally on Strong Earnings Reports',
//         category: 'Markets',
//         image: 'https://images.unsplash.com/photo-1611974259348-dfb5b5b5b2f0?w=400&h=300&fit=crop',
//       },
//     ],
//   },
// };

// type Props = { params: Promise<{ slug: string }> };

// export async function generateStaticParams() {
//   return Object.keys(MOCK_ARTICLES).map((slug) => ({ slug }));
// }

// export async function generateMetadata({ params }: Props): Promise<Metadata> {
//   const { slug } = await params;
//   const article = MOCK_ARTICLES[slug];

//   if (!article) {
//     return { title: 'Article Not Found' };
//   }

//   return {
//     title: `${article.title} | NewsHub`,
//     description: article.subtitle,
//     authors: [{ name: article.author }],
//     openGraph: {
//       title: article.title,
//       description: article.subtitle,
//       images: [{ url: article.image, width: 1200, height: 630 }],
//       type: 'article',
//       publishedTime: new Date(article.date).toISOString(),
//     },
//     twitter: {
//       card: 'summary_large_image',
//       title: article.title,
//       description: article.subtitle,
//       images: [article.image],
//     },
//     alternates: {
//       canonical: `https://newshub.example.com/news/${slug}`,
//     },
//   };
// }

// export default async function NewsDetailPage({ params }: Props) {
//   const { slug } = await params;
//   const article = MOCK_ARTICLES[slug];

//   if (!article) {
//     notFound();
//   }

//   return <NewsDetailClient article={article} />;
// }