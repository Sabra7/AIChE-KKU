'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

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
        The frame holds a photo and nothing else. The bio used to be laid over
        it -- a veil, the text, and a toggle, all absolutely positioned inside
        this box -- which is why equalise() had to stretch every frame to fit
        the longest bio: on a phone that meant a 165px-wide box forced to 436px
        against a declared aspect-ratio of 3/4, i.e. a box overriding its own
        ratio by 2.4x. .gal figure is the same clip pattern with no such
        override and it never glitched; this one did, on iOS, every time a row
        scrolled in. So the bio moved out, and the frame went back to being an
        aspect-ratio box with a single source of truth for its height.
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
      </div>

      <h3>{name}</h3>
      <p className="card__role">{pick(lang, member.roleAr, member.roleEn)}</p>
      {member.majorAr && (
        <p className="card__major">{pick(lang, member.majorAr, member.majorEn)}</p>
      )}
      {member.flagAr && (
        <p className="card__flag">{pick(lang, member.flagAr, member.flagEn ?? member.flagAr)}</p>
      )}

      {/*
        The bio, in the supervisor card's idiom: a bordered box with an accent
        edge on the inline-start. It opens on a real tap rather than on hover,
        which is what the photo overlay was only ever pretending to do on a
        phone -- a touch browser leaves :hover stuck on whatever was tapped
        last, so the old reveal had to be fenced off behind (hover:hover) and
        touch got the button instead. One control now, on every device.

        The height animates with grid-template-rows 0fr -> 1fr, so nothing has
        to measure anything: no scrollHeight read, no inline height, no resize
        listener. That is the whole of what equalise() used to do.
      */}
      {bio && (
        <div className="card__bio">
          <button
            className="card__bioBtn"
            type="button"
            aria-expanded={open}
            onClick={() => onToggle(open ? null : member.id)}
            data-ripple
          >
            <span>{pick(lang, ui.readBioAr, ui.readBioEn)}</span>
            <i className="card__bioChev" aria-hidden="true" />
          </button>
          <div className="card__bioWrap">
            <p className="card__bioTxt">{bio}</p>
          </div>
        </div>
      )}

      {/* Icons sit below the role, never over the photo, at a 44px target. */}
      {(links.length > 0 || member.code) && (
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

          {/*
            Decorative, and aria-hidden for it: the card already carries
            "Website designer & developer" as its flag line, so a reader that
            announced this too would say it twice -- the second time as
            "less-than slash greater-than".
          */}
          {member.code && (
            <span className="card__code" aria-hidden="true">
              &lt;/&gt;
            </span>
          )}
        </div>
      )}
    </article>
  );
}

export default function Team({ lang }: { lang: Lang }) {
  // One bio at a time, across both groups.
  const [openBio, setOpenBio] = useState<string | null>(null);

  /**
   * Tap anywhere outside the open card to close its bio.
   *
   * `pointerdown` rather than `click` so this settles before a tap on another
   * card's toggle runs: this clears the open id, then that button's onClick
   * sets its own — so the tapped bio opens instead of merely closing the last.
   *
   * A tap inside the open card is left alone: the visitor is reading the bio,
   * and only the card's own button should close it.
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

  return (
    <section className="sect sect--tint" id="team">
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
