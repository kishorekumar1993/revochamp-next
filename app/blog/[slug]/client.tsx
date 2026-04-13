// app/blog/[slug]/client.tsx
'use client';

import { useEffect } from 'react';
import { generateArticleJsonLd, generateFaqJsonLd, generateBreadcrumbJsonLd } from '@/lib/blog-seo-utils';
import { NewspaperBlogDesign } from '@/components/blog/NewspaperBlogDesign';
import { BlogPost } from '@/types/blog-detail';

export default function BlogDetailClient({ post, slug }: { post: BlogPost; slug: string }) {
  useEffect(() => {
    // Pass the original post object – the SEO utility now accepts BlogPost from blog-detail
    const articleJson = generateArticleJsonLd(post, slug);
    const breadcrumbJson = generateBreadcrumbJsonLd(post.title, slug);
    const faqJson = post.faq ? generateFaqJsonLd(post.faq) : null;

    const injectScript = (id: string, json: object) => {
      let script = document.getElementById(id) as HTMLScriptElement | null;
      if (!script) {
        script = document.createElement('script');
        script.id = id;
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(json);
    };

    injectScript('article-schema', articleJson);
    injectScript('breadcrumb-schema', breadcrumbJson);
    if (faqJson) injectScript('faq-schema', faqJson);

    return () => {
      const ids = ['article-schema', 'breadcrumb-schema', 'faq-schema'];
      ids.forEach(id => document.getElementById(id)?.remove());
    };
  }, [post, slug]);

  return <NewspaperBlogDesign post={post} slug={slug} />;
}
