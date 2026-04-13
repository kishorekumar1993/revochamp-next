import { Metadata } from 'next';
import { TopicSEOConfig } from '@/types/topic';

const SITE_URL = 'https://revochamp.site';

export function generateTopicPageMetadata(config: TopicSEOConfig): Metadata {
  const { pageTitle, metaDescription, canonicalUrl, ogImageUrl, keywords } = config;

  return {
    title: pageTitle,
    description: metaDescription,
    keywords: keywords.join(', '),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'en': canonicalUrl,
        'x-default': `${canonicalUrl}?hl=en`,
      },
    },
    openGraph: {
      title: pageTitle,
      description: metaDescription,
      url: canonicalUrl,
      siteName: 'RevoChamp',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: pageTitle,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: metaDescription,
      images: [ogImageUrl],
    },
    robots: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  };
}