// app/tools/meta-analyzer/actions.ts
'use server';

export interface MetaTags {
  url: string;
  title: string | null;
  description: string | null;
  keywords: string | null;
  author: string | null;
  viewport: string | null;
  robots: string | null;
  canonical: string | null;
  language: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  ogUrl: string | null;
  ogType: string | null;
  ogSiteName: string | null;
  twitterCard: string | null;
  twitterTitle: string | null;
  twitterDescription: string | null;
  twitterImage: string | null;
  twitterSite: string | null;
  favicon: string | null;
  charset: string | null;
}

export async function analyzeMetaTags(url: string): Promise<{ success: boolean; data?: MetaTags; error?: string }> {
  try {
    // Validate and normalize URL
    let targetUrl = url.trim();
    if (!/^https?:\/\//i.test(targetUrl)) {
      targetUrl = 'https://' + targetUrl;
    }
    new URL(targetUrl); // throws if invalid

    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; DevToolsMetaAnalyzer/1.0)',
      },
    });

    if (!response.ok) {
      return { success: false, error: `Failed to fetch URL: ${response.status} ${response.statusText}` };
    }

    const html = await response.text();
    
    // Helper to extract meta content
    const getMeta = (name: string, property?: boolean): string | null => {
      const attr = property ? 'property' : 'name';
      const regex = new RegExp(`<meta\\s+${attr}=["']${name}["']\\s+content=["']([^"']*)["']`, 'i');
      const match = html.match(regex);
      return match ? match[1] : null;
    };

    // Extract title
    const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : null;

    // Extract charset
    const charsetMatch = html.match(/<meta\s+charset=["']?([^"'>\s]+)/i);
    const charset = charsetMatch ? charsetMatch[1] : null;

    // Extract favicon
    const faviconMatch = html.match(/<link[^>]*rel=["'](?:shortcut )?icon["'][^>]*href=["']([^"']*)["']/i);
    const favicon = faviconMatch ? faviconMatch[1] : null;

    // Extract canonical
    const canonicalMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i);
    const canonical = canonicalMatch ? canonicalMatch[1] : null;

    const data: MetaTags = {
      url: targetUrl,
      title,
      description: getMeta('description'),
      keywords: getMeta('keywords'),
      author: getMeta('author'),
      viewport: getMeta('viewport'),
      robots: getMeta('robots'),
      canonical,
      language: html.match(/<html[^>]*lang=["']([^"']*)["']/i)?.[1] || null,
      ogTitle: getMeta('og:title', true),
      ogDescription: getMeta('og:description', true),
      ogImage: getMeta('og:image', true),
      ogUrl: getMeta('og:url', true),
      ogType: getMeta('og:type', true),
      ogSiteName: getMeta('og:site_name', true),
      twitterCard: getMeta('twitter:card'),
      twitterTitle: getMeta('twitter:title'),
      twitterDescription: getMeta('twitter:description'),
      twitterImage: getMeta('twitter:image'),
      twitterSite: getMeta('twitter:site'),
      favicon,
      charset,
    };

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to analyze URL' };
  }
}