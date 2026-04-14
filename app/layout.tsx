import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
// import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
  fallback: ['system-ui', 'arial'],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#1e3a8a',
  colorScheme: 'light',
};

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://revochamp.site';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'RevoChamp - Free Programming Courses & Tech Learning Platform',
    template: '%s | RevoChamp',
  },
  description:
    'Learn Flutter, React, Backend, DevOps, AI and more with RevoChamp. Free online programming courses designed for developers. Start your tech career today!',
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
  ],
  authors: [{ name: 'RevoChamp', url: BASE_URL }],
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
  verification: {
    google: process.env.GOOGLE_VERIFICATION_CODE || 'your-google-verification-code',
  },
  alternates: {
    canonical: BASE_URL,
    languages: {
      'en-US': BASE_URL,
      en: BASE_URL,
    },
  },
  openGraph: {
    title: 'RevoChamp - Free Programming Courses & Tech Learning Platform',
    description:
      'Master modern tech skills with 100% free programming courses. Learn Flutter, React, Backend, DevOps, AI and more. Start your journey today!',
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
  category: 'education',
  classification: 'Online Learning Platform',
  creator: 'RevoChamp',
  publisher: 'RevoChamp',
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  appleWebApp: {
    capable: true,
    title: 'RevoChamp',
    statusBarStyle: 'black-translucent',
  },
  icons: {
    icon: [{ url: '/favicon.png?v=2', type: 'image/png' }],
    apple: [{ url: '/apple-icon-180.png', sizes: '180x180', type: 'image/png' }],
    shortcut: ['/shortcut-icon.png'],
  },
  manifest: '/manifest.json',
  referrer: 'origin-when-cross-origin',
};

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
  founders: [{ '@type': 'Person', name: 'RevoChamp Team' }],
  address: { '@type': 'PostalAddress', addressCountry: 'US' },
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

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'RevoChamp',
  url: BASE_URL,
  description: 'Free programming courses and tech learning platform',
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: `${BASE_URL}/courses?search={search_term_string}` },
    'query-input': 'required name=search_term_string',
  },
  inLanguage: 'en-US',
  copyrightYear: '2026',
  copyrightHolder: { '@type': 'Organization', name: 'RevoChamp' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Optional: preconnect for any external fonts if you add them later */}
        {/* <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" /> */}
      </head>
      <body className="antialiased">
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
      </body>
    </html>
  );
}