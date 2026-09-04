/**
 * Chemistry icon set — drawn for this project rather than pulled from a
 * general icon library, so the line weight and the vocabulary (flask, gear,
 * bond, benzene) match the logo.
 *
 * `IconSprite` renders the symbol definitions once per page; `Icon` references
 * them. Strokes inherit currentColor, so a single set serves both the light
 * sections and the dark GAINS section.
 */

export type IconName =
  | 'helmet'
  | 'flask'
  | 'bond'
  | 'gear'
  | 'signal'
  | 'sprout'
  | 'microscope'
  | 'drop';

export function Icon({ name, className = '' }: { name: IconName; className?: string }) {
  return (
    <svg className={`ico ${className}`} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <use href={`#i-${name}`} />
    </svg>
  );
}

export function IconSprite() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
      <defs>
        <symbol id="i-helmet" viewBox="0 0 24 24">
          <path d="M3.5 16a8.5 8.5 0 0117 0" />
          <path d="M2.5 16h19v1.6a1.4 1.4 0 01-1.4 1.4H3.9a1.4 1.4 0 01-1.4-1.4z" />
          <path d="M9.6 8.1V5.4a1 1 0 011-1h2.8a1 1 0 011 1v2.7" />
          <path d="M12 8.2V16" />
        </symbol>

        <symbol id="i-flask" viewBox="0 0 24 24">
          <path d="M9.5 3h5" />
          <path d="M10.6 3v6.2L5.4 17.6A2 2 0 007.1 20.7h9.8a2 2 0 001.7-3.1l-5.2-8.4V3" />
          <path d="M7.6 14.4c2.6-1.4 5.4 1.4 8 0" />
          <circle cx="11" cy="17.4" r=".9" fill="currentColor" stroke="none" />
        </symbol>

        <symbol id="i-bond" viewBox="0 0 24 24">
          <circle cx="5" cy="6.5" r="2.1" />
          <circle cx="18.6" cy="8.4" r="2.1" />
          <circle cx="11.4" cy="14.6" r="2.1" />
          <circle cx="4.6" cy="19" r="1.6" />
          <path d="M6.9 7.6l3 5.3M13.3 13.4l3.6-3.4M10.1 16.3L6 18.3" />
        </symbol>

        <symbol id="i-gear" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="3.2" />
          <path d="M12 2.6v2.6M12 18.8v2.6M21.4 12h-2.6M5.2 12H2.6M18.6 5.4l-1.8 1.8M7.2 16.8l-1.8 1.8M18.6 18.6l-1.8-1.8M7.2 7.2L5.4 5.4" />
          <circle cx="12" cy="12" r="7.4" strokeDasharray="2.4 3.1" />
        </symbol>

        <symbol id="i-signal" viewBox="0 0 24 24">
          <polygon points="12,6.4 15.6,8.5 15.6,12.6 12,14.7 8.4,12.6 8.4,8.5" />
          <path d="M5.6 4.6a9.4 9.4 0 000 11.9M18.4 4.6a9.4 9.4 0 010 11.9" />
          <path d="M12 17.6V21M8.9 21h6.2" />
        </symbol>

        <symbol id="i-sprout" viewBox="0 0 24 24">
          <path d="M12 21v-8.2" />
          <path d="M12 12.8C12 9.4 9.3 6.7 5.9 6.7c0 3.4 2.7 6.1 6.1 6.1z" />
          <path d="M12 12.8c0-3 2.4-5.4 5.4-5.4 0 3-2.4 5.4-5.4 5.4z" />
          <path d="M8.6 21h6.8" />
        </symbol>

        <symbol id="i-microscope" viewBox="0 0 24 24">
          <path d="M6.6 20.6h13.8" />
          <path d="M9.4 20.6a5.6 5.6 0 007.6-7.9" />
          <path d="M11.4 6.1l3.4 5.3a2 2 0 01-.6 2.8l-1.7 1.1a2 2 0 01-2.8-.6L6.3 9.4a2 2 0 01.6-2.8l1.7-1.1a2 2 0 012.8.6z" />
          <path d="M4.4 12.2l2.5-1.6M13.6 3.4l2.1 3.3" />
        </symbol>

        <symbol id="i-drop" viewBox="0 0 24 24">
          <path d="M12 3.2s5.9 6.4 5.9 10.2a5.9 5.9 0 11-11.8 0C6.1 9.6 12 3.2 12 3.2z" />
          <path d="M9.3 13.9a2.7 2.7 0 002.7 2.7" />
        </symbol>
      </defs>
    </svg>
  );
}
