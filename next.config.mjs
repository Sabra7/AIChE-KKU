/** @type {import('next').NextConfig} */

/**
 * Baseline response headers.
 *
 * The site has no forms, no cookies, no session and no API routes, so these
 * are hardening rather than a fix for anything exploitable today. They cost
 * nothing and they close the defaults that browsers get wrong:
 *
 *   nosniff             stops a mis-served asset being executed as script.
 *   SAMEORIGIN          the page is never meant to be framed by a third party;
 *                       DENY would also block our own preview tooling.
 *   Referrer-Policy     outbound links (the join form, LinkedIn, TikTok,
 *                       partner accounts) leak the origin only, not the path.
 *   Permissions-Policy  nothing on the page uses these APIs, so deny them
 *                       outright rather than leaving them available.
 *
 * There is deliberately no Content-Security-Policy here. A CSP strict enough
 * to be worth having would have to allow Next's inline hydration script, which
 * means per-request nonces from middleware — and that turns two statically
 * generated pages into dynamically rendered ones. See SECURITY.md.
 */
const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
];

const nextConfig = {
  reactStrictMode: true,

  // Drops `X-Powered-By: Next.js`. It tells a scanner which framework and
  // therefore which CVE list to try, and it buys the visitor nothing.
  poweredByHeader: false,

  images: {
    // Serve modern formats; next/image adds lazy loading + srcset automatically.
    formats: ['image/avif', 'image/webp'],
  },

  // Headers are applied by the server that runs the build output. A static
  // export (see below) has no server, so these are dropped there and the
  // equivalents have to be configured on the host instead.
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },

  // -------------------------------------------------------------------------
  // Deploying to a plain static host (GitHub Pages, Netlify drop, S3)?
  // Uncomment the two lines below and run `npm run build`; the site lands
  // in ./out as pure HTML. Note that Next's image optimiser cannot run without
  // a server, so `unoptimized` is required — the images ship at their
  // original size. On Vercel, leave this commented out and keep optimisation.
  // -------------------------------------------------------------------------
  // output: 'export',
  // images: { unoptimized: true },
};

export default nextConfig;
