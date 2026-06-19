import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/forum/:path*',
        destination: '/',
        permanent: false,
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://pagead2.googlesyndication.com https://fundingchoicesmessages.google.com https://adservice.google.com https://tpc.googlesyndication.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https: blob:",
              "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://www.google-analytics.com https://analytics.google.com https://www.googletagmanager.com https://region1.google-analytics.com https://pagead2.googlesyndication.com https://fundingchoicesmessages.google.com https://*.doubleclick.net",
              "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://fundingchoicesmessages.google.com",
              "frame-ancestors 'none'",
            ].join('; '),
          },
        ],
      },
    ]
  },
};

export default nextConfig;
