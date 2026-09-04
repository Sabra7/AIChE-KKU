import { socials } from '@/data/site';

/**
 * Renders only the channels that actually have a URL in data/site.ts.
 * An icon with no link behind it is worse than no icon at all.
 */
export default function Socials() {
  return (
    <div className="social">
      {socials.linkedin && (
        <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
          <svg width="21" height="21" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M4.98 3.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5zM2.9 21h4.2V9.4H2.9V21zM9.6 9.4V21h4.2v-6.2c0-1.7.9-2.6 2.2-2.6 1.2 0 2 .8 2 2.6V21h4.2v-6.9c0-3.5-1.9-5.1-4.4-5.1-2 0-2.9 1.1-3.4 1.9h-.1V9.4H9.6z" />
          </svg>
        </a>
      )}
      {socials.tiktok && (
        <a href={socials.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok">
          <svg width="21" height="21" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M16.5 2h-3v13.1a2.6 2.6 0 11-2.2-2.6V9.4a5.7 5.7 0 105.2 5.7V9.3a6.6 6.6 0 003.8 1.2V7.4a3.7 3.7 0 01-3.8-3.6V2z" />
          </svg>
        </a>
      )}
    </div>
  );
}
