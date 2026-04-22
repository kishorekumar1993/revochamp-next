import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { Analytics } from "@vercel/analytics/next"   // ✅ add this import


const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
  fallback: ['system-ui', 'arial'],
});

// ❌ REMOVED – These caused the build error because they used conditionals.
// Next.js requires static string values for these exports.
// export const dynamic = process.env.NODE_ENV === 'production' ? 'force-static' : 'auto';
// export const revalidate = process.env.NODE_ENV === 'production' ? 3600 : undefined;

// ✅ If you need static generation in production, you can set them as plain strings:
// export const dynamic = 'force-static';
// export const revalidate = 3600;
// But for now, removing them fixes the development error.

// Viewport configuration
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#1e3a8a',
  colorScheme: 'light',
};

// Base URL for production
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://revochamp.site';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  // Basic SEO
title: {
  default: 'RevoChamp – Free Programming Courses, Tech Blogs, Coding Tools & Developer Resources',
  template: '%s | RevoChamp',
},
description:
  'RevoChamp is an all-in-one developer platform offering free programming courses, tech blogs, coding tools, API tester, UI builder, AI utilities, and interview preparation to accelerate your tech career.',  // Keywords
  keywords: [
    'free programming courses',
    'learn coding online',
    'web development tutorial',
    'mobile app development',
    'AI courses',
    'DevOps training',
    'cloud computing',
    'Python courses',
    'JavaScript tutorial',
    'React course',
    'Flutter development',
    'backend development',
    'frontend development',
    'full stack developer',
    'programming for beginners',
    'tech education',
    'online learning',
    'coding bootcamp',
    'software development',
    'computer science',
  // Core Learning
  'free programming courses',
  'learn coding online',
  'programming for beginners',
  'online coding classes',
  'tech education platform',
  'software development tutorials',

  // Frontend & Web
  'frontend development',
  'web development tutorial',
  'JavaScript tutorial',
  'TypeScript tutorial',
  'React course',
  'Next.js tutorial',
  'responsive web design',

  // Mobile Development
  'Flutter development',
  'Flutter app development course',
  'mobile app development',
  'Android development',
  'iOS development',
  'React Native tutorial',

  // Backend & APIs
  'backend development',
  'Node.js backend',
  'REST API development',
  'API development',
  'GraphQL tutorial',
  'microservices architecture',

  // Databases
  'SQL tutorial',
  'NoSQL database',
  'MongoDB tutorial',
  'Firebase backend',

  // AI & Trending
  'AI courses',
  'AI for developers',
  'AI code generator',
  'generate code using AI',
  'prompt engineering',
  'low code platform',

  // DevOps & Cloud
  'DevOps training',
  'Docker tutorial',
  'Kubernetes basics',
  'CI/CD pipeline',
  'cloud computing',
  'AWS for beginners',

  // Tools (Your USP)
  'free developer tools',
  'API tester online',
  'Postman alternative',
  'UI builder tool',
  'drag and drop UI builder',
  'Flutter UI builder',
  'form builder online',
  'JSON to model generator',
  'code generator tool',

  // Blogs & Content
  'tech blogs',
  'programming blog',
  'coding tutorials',
  'developer articles',

  // Career & Interview
  'coding interview preparation',
  'mock interview practice',
  'software engineer interview questions',
  'technical interview guide',
  'full stack developer roadmap',

  // Architecture & Quality
  'clean architecture',
  'design patterns in software',
  'unit testing',
  'test automation',
  'web security',
  'JWT authentication',

  // Branding
  'RevoChamp',
  'RevoChamp platform',
  'developer learning platform'
],
  authors: [{ name: 'RevoChamp', url: BASE_URL }],

  // Robots configuration
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Verification - Replace with actual codes
  verification: {
    google: '56YLlB_RvfQRzIYP_38zH5rvbOppQmeWgvZvlXYu358',
    // google: process.env.GOOGLE_VERIFICATION_CODE || 'your-google-verification-code',
  },

  // Canonical URL
  alternates: {
    canonical: BASE_URL,
    languages: {
      'en-US': BASE_URL,
      en: BASE_URL,
    },
  },

  // Open Graph / Facebook
  openGraph: {
title: {
  default: 'RevoChamp – Free Programming Courses, Tech Blogs, Coding Tools & Developer Resources',
  template: '%s | RevoChamp',
},
description:
  'RevoChamp is an all-in-one developer platform offering free programming courses, tech blogs, coding tools, API tester, UI builder, AI utilities, and interview preparation to accelerate your tech career.',  // Keywords
     url: BASE_URL,
    siteName: 'RevoChamp',
    images: [
      {
        url: `${BASE_URL}/og-image-home.jpg`,
        width: 1200,
        height: 630,
        alt: 'RevoChamp - Free Programming Courses',
        type: 'image/jpeg',
      },
      {
        url: `${BASE_URL}/og-image-courses.jpg`,
        width: 1200,
        height: 630,
        alt: 'RevoChamp Course Library',
        type: 'image/jpeg',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },

  // Twitter
  twitter: {
    card: 'summary_large_image',
    site: '@revochamp',
    creator: '@revochamp',
    title: 'RevoChamp - Free Programming Courses',
    description: 'Master modern tech skills with 100% free programming courses. Start your journey today!',
    images: {
      url: `${BASE_URL}/twitter-image.jpg`,
      alt: 'RevoChamp Twitter Card',
    },
  },

  // Additional SEO
  category: 'education',
  classification: 'Online Learning Platform',
  creator: 'RevoChamp',
  publisher: 'RevoChamp',
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },

  // App Links
  appleWebApp: {
    capable: true,
    title: 'RevoChamp',
    statusBarStyle: 'black-translucent',
  },

  // Icons
  icons: {
    icon: [
      { url: '/favicon.png?v=2', type: 'image/png' },
    ],
    apple: [{ url: '/apple-icon-180.png', sizes: '180x180', type: 'image/png' }],
    shortcut: ['/shortcut-icon.png'],
  },

  manifest: '/manifest.json',
  referrer: 'origin-when-cross-origin',
};

// JSON-LD structured data for Organization
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: 'RevoChamp',
  url: BASE_URL,
  logo: `${BASE_URL}/logo.png`,
  sameAs: [
    'https://twitter.com/revochamp',
    'https://www.linkedin.com/company/revochamp',
    'https://github.com/revochamp',
    'https://www.facebook.com/revochamp',
    'https://www.youtube.com/@revochamp',
  ],
  description: 'Free online programming courses and tech learning platform',
  email: 'support@revochamp.site',
  foundingDate: '2024',
  founders: [
    {
      '@type': 'Person',
      name: 'RevoChamp Team',
    },
  ],
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'US',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    email: 'support@revochamp.site',
    availableLanguage: ['English'],
  },
  teaches: ['Programming', 'Web Development', 'Mobile Development', 'AI & Machine Learning', 'DevOps', 'Cloud Computing'],
  educationalLevel: ['Beginner', 'Intermediate', 'Advanced'],
  offers: {
    '@type': 'Offer',
    category: 'Free',
    price: '0',
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
  },
};

// JSON-LD for WebSite schema
const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'RevoChamp',
  url: BASE_URL,
  description: 'Free programming courses and tech learning platform',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${BASE_URL}/courses?search={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
  inLanguage: 'en-US',
  copyrightYear: '2026',
  copyrightHolder: {
    '@type': 'Organization',
    name: 'RevoChamp',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {/* Remove extension-added attributes before hydration */}
        <Script
          id="fix-extension-attributes"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var attrs = ['fdprocessedid', 'data-extension-version'];
                function clean() {
                  attrs.forEach(function(attr) {
                    document.querySelectorAll('[' + attr + ']').forEach(function(el) {
                      el.removeAttribute(attr);
                    });
                  });
                }
                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', clean);
                } else {
                  clean();
                }
                // Prevent future additions via MutationObserver
                var observer = new MutationObserver(function(mutations) {
                  mutations.forEach(function(mutation) {
                    if (mutation.type === 'attributes' && attrs.includes(mutation.attributeName)) {
                      mutation.target.removeAttribute(mutation.attributeName);
                    }
                  });
                });
                observer.observe(document.documentElement, { attributes: true, subtree: true });
              })();
            `,
          }}
        />
        {/* Your existing JSON‑LD scripts */}
        <Script
          id="organization-schema"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <Script
          id="website-schema"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        {children}
        <Analytics />   {/* ✅ add this line */}

      </body>
    </html>
  );
}
