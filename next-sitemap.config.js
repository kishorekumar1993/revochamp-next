/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://revochamp.site',
  // ✅ IMPORTANT: Keep false — we manage robots.txt manually in public/robots.txt
  // Setting true would OVERWRITE public/robots.txt on every build and lose our custom sitemap entries
  generateRobotsTxt: false,
  generateIndexSitemap: false,
  changefreq: 'weekly',
  priority: 0.7,
  sitemapSize: 5000,
  exclude: ['/api/*'],
  transform: async (config, path) => {
    // Custom priority based on path
    let priority = 0.7;
    let changefreq = 'weekly';
    
    if (path === '/') {
      priority = 1.0;
      changefreq = 'daily';
    } else if (path.startsWith('/tech/courses')) {
      priority = 0.9;
      changefreq = 'daily';
    } else if (path.startsWith('/tech')) {
      priority = 0.8;
      changefreq = 'weekly';
    }
    
    return {
      loc: path,
      changefreq,
      priority,
      lastmod: new Date().toISOString(),
    };
  },
};