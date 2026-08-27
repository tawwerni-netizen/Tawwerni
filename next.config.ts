import type { NextConfig } from "next";

/**
 * Security headers.
 *
 * These are cheap and they close whole categories of problem before any code
 * runs. No Content-Security-Policy yet: Next injects inline scripts and this
 * project has an inline pre-paint theme script, so a CSP would need nonce
 * plumbing — and a CSP that has to be loosened to `unsafe-inline` protects
 * nothing while implying it does.
 */
const securityHeaders = [
  // Don't let the site be framed — stops clickjacking the admin controls.
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Don't let a browser second-guess a declared content type.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Never leak a full URL (which can carry a reset token) to another origin.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Nothing here needs these devices; deny them by default.
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
];

/*
 * The downloader's backend.
 *
 * It needs Python, FFmpeg, Redis and long-running workers — none of which
 * Hostinger's Node hosting can run — so it lives on its own machine. The
 * rewrite below hides that: the browser only ever talks to tawwerni.com, so
 * there is no CORS preflight and no third-party-cookie problem.
 *
 * Unset in development, and unset on the server until the backend exists. The
 * page still renders in that state; requests simply 404 rather than the whole
 * config failing to build.
 */
const VD_API_ORIGIN = process.env.VD_API_ORIGIN;

const nextConfig: NextConfig = {
  poweredByHeader: false,

  async rewrites() {
    if (!VD_API_ORIGIN) return [];
    return [
      {
        source: "/api/vd/:path*",
        destination: `${VD_API_ORIGIN.replace(/\/$/, "")}/api/:path*`,
      },
    ];
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        // Nothing behind an account should ever sit in a shared cache.
        source: "/api/:path*",
        headers: [
          ...securityHeaders,
          { key: "Cache-Control", value: "no-store, max-age=0" },
        ],
      },
    ];
  },
};

export default nextConfig;
