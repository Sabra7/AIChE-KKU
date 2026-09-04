import type { Config } from 'tailwindcss';

/**
 * Why Tailwind is installed when no utility class is used anywhere.
 *
 * Every style in this project is handwritten in app/globals.css — a search of
 * app/, components/, lib/ and data/ turns up no Tailwind utility at all. What
 * the dependency still earns its place for is `@tailwind base`, the first line
 * of globals.css: it injects Preflight, and the handwritten CSS is authored on
 * top of that reset rather than duplicating it. Preflight is what supplies
 * border-box sizing everywhere, zeroed default margins, `display:block` on
 * images, and font inheritance into buttons and form controls. Remove the
 * package without writing a replacement reset first and the layout shifts in
 * places that are easy to miss.
 *
 * `@tailwind components` and `@tailwind utilities` currently emit nothing, and
 * the whole of globals.css sits inside `@layer base`, so the cascade is flat.
 *
 * The theme below therefore does no work at build time. It is kept as the
 * written record of the design system: the same tokens globals.css declares as
 * CSS custom properties, in the form Tailwind would need if utilities are ever
 * adopted. globals.css owns the runtime values — change one there and mirror
 * it here, never the reverse.
 */
const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './data/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#F5F1EE',
        surface: '#FBF9F7',
        ink: '#0D3E6B',
        'ink-2': '#075B91',
        accent: '#8BCB32',
        'green-mid': '#3B9E18',
        'green-deep': '#237A13',
      },
      fontFamily: {
        en: ['var(--font-space-grotesk)', 'system-ui', 'sans-serif'],
        ar: ['var(--font-plex-arabic)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        sm: '7px',
        md: '14px',
        lg: '20px',
      },
      maxWidth: {
        shell: '1180px',
      },
      transitionTimingFunction: {
        brand: 'cubic-bezier(.22,.61,.36,1)',
      },
    },
  },
  plugins: [],
};

export default config;
