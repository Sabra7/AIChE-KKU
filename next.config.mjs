/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Serve modern formats; next/image adds lazy loading + srcset automatically.
    formats: ['image/avif', 'image/webp'],
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
