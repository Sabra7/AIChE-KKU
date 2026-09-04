import type { Config } from 'tailwindcss';

/**
 * The brand palette and type scale live here so utilities stay in sync with
 * the CSS custom properties declared in app/globals.css. Change a value in
 * one place only: globals.css owns the runtime variables, this file mirrors
 * them for Tailwind's autocomplete and utility generation.
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
