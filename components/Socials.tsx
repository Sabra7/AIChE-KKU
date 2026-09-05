import { SocialMark, SOCIAL_LABELS, type SocialKey } from '@/lib/socials';
import { socials } from '@/data/site';

/**
 * Renders only the channels that actually have a URL in data/site.ts.
 * An icon with no link behind it is worse than no icon at all.
 */
export default function Socials() {
  const channels = Object.entries(socials) as Array<[SocialKey, string]>;

  return (
    <div className="social">
      {channels.map(([key, url]) =>
        url ? (
          <a
            key={key}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={SOCIAL_LABELS[key]}
          >
            <SocialMark name={key} size={21} />
          </a>
        ) : null,
      )}
    </div>
  );
}
