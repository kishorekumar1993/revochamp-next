/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: "export", // ← Enables static HTML export

  images: {
    // domains is deprecated in newer Next.js; use remotePatterns instead
    remotePatterns: [
      {
        protocol: "https",
        hostname: "revochamp.site",
      },
      {
        protocol: "https",
        hostname: "json.revochamp.site",
      },
    ],
    formats: ["image/avif", "image/webp"],
    // unoptimized: true, // Required for static export when using next/image
  },

  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  // swcMinify: true,

  // ⚠️ Headers are ignored in static export (they require a server)
  // They will only work if you deploy to a server environment (not static hosting)
  // Consider removing or keeping them if you might switch back to server mode
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "X-Robots-Tag",
            value: "index, follow",
          },
        ],
      },
      {
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
