'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState, type ReactElement } from 'react';

import { pick, type Lang } from '@/lib/i18n';
import { ui } from '@/lib/ui';
import { committees, leadership, supervisor, type Member, type SocialKey } from '@/data/team';
import Reveal from './Reveal';

const SOCIAL_ICONS: Record<SocialKey, ReactElement> = {
  linkedin: (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M4.98 3.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5zM2.9 21h4.2V9.4H2.9V21zM9.6 9.4V21h4.2v-6.2c0-1.7.9-2.6 2.2-2.6 1.2 0 2 .8 2 2.6V21h4.2v-6.9c0-3.5-1.9-5.1-4.4-5.1-2 0-2.9 1.1-3.4 1.9h-.1V9.4H9.6z" />
    </svg>
  ),
  github: (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2a10 10 0 00-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.4-3.4-1.4-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.7.4-1.1.6-1.4-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.7 1a9.4 9.4 0 015 0c1.9-1.3 2.7-1 2.7-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.4 4.7-4.6 5 .4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5A10 10 0 0012 2z" />
    </svg>
  ),
};

/** Two-letter fallback drawn from the English name. */
const initialsOf = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('');

function MemberCard({ member, lang }: { member: Member; lang: Lang }) {
  const [open, setOpen] = useState(false);

  if (member.soon) {
    return (
      <article className="card">
        <div className="card__ph card__ph--soon">{pick(lang, ui.soonAr, ui.soonEn)}</div>
        <h3>{pick(lang, member.nameAr, member.nameEn)}</h3>
        <p className="card__role">{pick(lang, ui.soonAr, ui.soonEn)}</p>
      </article>
    );
  }

  const name = pick(lang, member.nameAr, member.nameEn);
  const bio = pick(lang, member.bioAr ?? '', member.bioEn ?? '');
  const links = Object.entries(member.links) as Array<[SocialKey, string]>;

  return (
    <article className={`card${open ? ' open' : ''}`} data-tilt="5">
      {/*
        The photo blurs on hover and a white veil carries the bio over it.

        Note what is NOT happening: blur() is not tweened frame by frame. It is
        a single small value that transitions once, with will-change:filter
        keeping it on the compositor. The veil and the bio move on opacity
        alone. Visually identical to animating the blur, and it holds 60fps.
      */}
      <div className="card__ph">
        {member.photo ? (
          <Image
            src={member.photo}
            alt={name}
            fill
            sizes="(max-width: 700px) 50vw, (max-width: 1000px) 33vw, 25vw"
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <span className="card__initials">{initialsOf(member.nameEn)}</span>
        )}
        {/* Specular highlight: follows the pointer via --sx/--sy, paint only. */}
        <span className="card__sheen" />
        <span className="card__veil" />
        {bio && <p className="card__bio">{bio}</p>}
      </div>

      <h3>
        {name}
        {member.code && <span className="card__code"> &lt;/&gt;</span>}
      </h3>
      <p className="card__role">{pick(lang, member.roleAr, member.roleEn)}</p>
      {member.majorAr && (
        <p className="card__major">{pick(lang, member.majorAr, member.majorEn)}</p>
      )}
      {member.flagAr && (
        <p className="card__flag">{pick(lang, member.flagAr, member.flagEn ?? member.flagAr)}</p>
      )}

      {/* Icons sit below the role, never over the photo, at a 44px target. */}
      {links.length > 0 && (
        <div className="card__links">
          {links.map(([key, url]) => (
            <a
              key={key}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${key} — ${name}`}
            >
              {SOCIAL_ICONS[key]}
            </a>
          ))}
        </div>
      )}

      {/* Touch devices have no hover, so the bio needs a real control. */}
      {bio && (
        <button
          className="card__toggle"
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          data-ripple
        >
          {pick(lang, ui.readBioAr, ui.readBioEn)}
        </button>
      )}
    </article>
  );
}

export default function Team({ lang }: { lang: Lang }) {
  const rootRef = useRef<HTMLElement>(null);

  /**
   * Give every photo frame the same height, sized to the longest bio, so a
   * short bio reads as deliberate rather than as a card that failed to fill.
   */
  const equalise = useCallback(() => {
    const root = rootRef.current;
    if (!root) return;
    const bios = Array.from(root.querySelectorAll<HTMLElement>('.card__bio'));
    if (!bios.length) return;

    const frames = Array.from(root.querySelectorAll<HTMLElement>('.card__ph'));
    frames.forEach((f) => (f.style.minHeight = ''));
    const tallest = Math.max(...bios.map((b) => b.scrollHeight));
    frames.forEach((f) => (f.style.minHeight = `${tallest + 36}px`));
  }, []);

  useEffect(() => {
    equalise();
    let timer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(timer);
      timer = setTimeout(equalise, 150);
    };
    window.addEventListener('resize', onResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', onResize);
    };
  }, [equalise, lang]);

  return (
    <section className="sect sect--tint" id="team" ref={rootRef}>
      <div className="shell">
        <Reveal className="sect__head">
          <h2>{pick(lang, 'الفريق', 'The team')}</h2>
        </Reveal>

        {/*
          Academic supervision is named first and laid out horizontally. It has
          to read as accreditation — not as one more board member in the grid.
        */}
        <Reveal className="sup">
          <div className="sup__ph">
            <Image
              src={supervisor.photo}
              alt={pick(lang, supervisor.nameAr, supervisor.nameEn)}
              width={264}
              height={352}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <div>
            <p className="sup__role">{pick(lang, supervisor.roleAr, supervisor.roleEn)}</p>
            <h3>{pick(lang, supervisor.nameAr, supervisor.nameEn)}</h3>
            <p className="sup__sub">
              {pick(lang, supervisor.affiliationAr, supervisor.affiliationEn)}
            </p>
          </div>
        </Reveal>

        {/*
          Leadership is a plain four-across row, same grid as the committees.
          An explanatory note used to sit beside it; it was removed because the
          four cards already say what it said — two of them read
          "Vice President — Male / Female Section" on their face.
        */}
        <div className="grp">
          <Reveal as="p" className="grp__t">
            {pick(lang, 'القيادة التنفيذية', 'Executive leadership')}
          </Reveal>
          <div className="team">
            {leadership.map((m) => (
              <MemberCard key={m.id} member={m} lang={lang} />
            ))}
          </div>
        </div>

        <div className="grp">
          <Reveal as="p" className="grp__t">
            {pick(lang, 'رؤساء اللجان', 'Committee heads')}
          </Reveal>
          <div className="team">
            {committees.map((m) => (
              <MemberCard key={m.id} member={m} lang={lang} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
