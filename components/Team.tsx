'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';

import { pick, type Lang } from '@/lib/i18n';
import { SocialMark, SOCIAL_LABELS, type SocialKey } from '@/lib/socials';
import { ui } from '@/lib/ui';
import { committees, leadership, supervisor, type Member } from '@/data/team';
import Reveal from './Reveal';

/** Two-letter fallback drawn from the English name. */
const initialsOf = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('');

/**
 * `open` is owned by <Team>, not by the card, so that opening one bio closes
 * whichever was open before. Two cards holding their own booleans left every
 * bio the visitor had ever tapped stacked open behind each other.
 */
function MemberCard({
  member,
  lang,
  open,
  onToggle,
}: {
  member: Member;
  lang: Lang;
  open: boolean;
  /** Pass a member id to open it, or null to close whatever is open. */
  onToggle: (id: string | null) => void;
}) {
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
        a single small value that transitions once, off `none`. The veil and the
        bio move on opacity, and are visibility:hidden between times so a closed
        card carries no painted overlay and reads as collapsed to a screen
        reader. Visually identical to animating the blur, and it holds 60fps.
      */}
      <div className="card__ph">
        {member.photo ? (
          <Image
            src={member.photo}
            alt={`${name} — ${pick(lang, member.roleAr, member.roleEn)}`}
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

        {/*
          Touch devices have no hover, so the bio needs a real control. It sits
          in the frame's bottom corner rather than under the card: the photo is
          what it acts on, and below the card it read as a stray chip stranded
          in the corner. It must live inside .card__ph because that is the
          positioned ancestor — and the rounded overflow that keeps it tucked
          into the frame.
        */}
        {bio && (
          <button
            className="card__toggle"
            type="button"
            aria-expanded={open}
            onClick={() => onToggle(open ? null : member.id)}
            data-ripple
          >
            {pick(lang, ui.readBioAr, ui.readBioEn)}
          </button>
        )}
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
          {links.map(([key, url]) => {
            // A mailto: has nothing to open in a new tab; Chrome hands back a
            // blank one and leaves it there. target/rel belong on real
            // navigations only, which is also the only place noopener matters.
            const external = url.startsWith('http');
            return (
              <a
                key={key}
                href={url}
                target={external ? '_blank' : undefined}
                rel={external ? 'noopener noreferrer' : undefined}
                aria-label={`${SOCIAL_LABELS[key]} — ${name}`}
              >
                <SocialMark name={key} />
              </a>
            );
          })}
        </div>
      )}
    </article>
  );
}

export default function Team({ lang }: { lang: Lang }) {
  const rootRef = useRef<HTMLElement>(null);
  // One bio at a time, across both groups.
  const [openBio, setOpenBio] = useState<string | null>(null);

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

    // The bio is measured top-aligned, not in its painted centred state.
    // align-items:center splits an overflowing bio evenly above and below the
    // box, and overflow above the padding edge is unreachable -- it never
    // enters the scrollable overflow region. Centred, a bio therefore reports
    // (frame + text) / 2, short by half its own overflow, and the two engines
    // round that split differently. Top-aligned, all of the overflow falls
    // block-end and scrollHeight is exactly padding + text in both.
    frames.forEach((f) => (f.style.minHeight = ''));
    bios.forEach((b) => (b.style.alignItems = 'flex-start'));

    const tallest = Math.max(...bios.map((b) => b.scrollHeight));

    bios.forEach((b) => (b.style.alignItems = ''));
    frames.forEach((f) => (f.style.minHeight = `${tallest + 36}px`));
  }, []);

  /**
   * Tap anywhere outside the open card to close its bio.
   *
   * `pointerdown` rather than `click` so this settles before a tap on another
   * card's toggle runs: this clears the open id, then that button's onClick
   * sets its own — so the tapped bio opens instead of merely closing the last.
   *
   * A tap inside the open card is left alone. The bio covers the whole frame,
   * so "inside" means the visitor is reading it; only its own button closes it.
   */
  useEffect(() => {
    if (!openBio) return;

    const onPointerDown = (e: PointerEvent) => {
      if (e.target instanceof Element && e.target.closest('.card.open')) return;
      setOpenBio(null);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenBio(null);
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [openBio]);

  useEffect(() => {
    let alive = true;
    equalise();

    // The first pass runs against the fallback face, because next/font swaps
    // the real one in asynchronously. Arabic and Latin metrics differ enough
    // that a bio measured before the swap under-sizes every frame on the page.
    document.fonts?.ready.then(() => {
      if (alive) equalise();
    });

    let timer: ReturnType<typeof setTimeout>;
    let lastWidth = window.innerWidth;
    const onResize = () => {
      // Width only. iOS Safari fires resize every time the URL bar collapses
      // or expands under a scroll, and that is a height change: it cannot
      // alter how a single bio wraps, but it was rewriting min-height on every
      // frame on the page mid-scroll.
      if (window.innerWidth === lastWidth) return;
      lastWidth = window.innerWidth;
      clearTimeout(timer);
      timer = setTimeout(equalise, 150);
    };
    window.addEventListener('resize', onResize);
    return () => {
      alive = false;
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
              alt={`${pick(lang, supervisor.nameAr, supervisor.nameEn)} — ${pick(
                lang,
                supervisor.roleAr,
                supervisor.roleEn,
              )}${pick(lang, '، ', ', ')}${pick(lang, supervisor.affiliationAr, supervisor.affiliationEn)}`}
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
              <MemberCard
                key={m.id}
                member={m}
                lang={lang}
                open={openBio === m.id}
                onToggle={setOpenBio}
              />
            ))}
          </div>
        </div>

        <div className="grp">
          <Reveal as="p" className="grp__t">
            {pick(lang, 'رؤساء اللجان', 'Committee heads')}
          </Reveal>
          <div className="team">
            {committees.map((m) => (
              <MemberCard
                key={m.id}
                member={m}
                lang={lang}
                open={openBio === m.id}
                onToggle={setOpenBio}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
