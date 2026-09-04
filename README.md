# AIChE-KKU

A fully bilingual site for the AIChE student chapter at King Khalid University,
Abha — Arabic and English as two separately rendered static trees, not a
runtime string swap.

<!-- LIVE SITE: replace with the production URL once the domain is live -->
<!-- SCREENSHOT 1 (Arabic home, /):  ![Arabic home](docs/screenshot-ar.png) -->
<!-- SCREENSHOT 2 (English home, /en):  ![English home](docs/screenshot-en.png) -->

## Built with

| Tool | Role |
| --- | --- |
| Next.js 15 | App Router, static generation, two route groups |
| React 19 | Server Components by default; client only where motion needs it |
| TypeScript | Content in `data/` is typed, so a malformed entry fails the build |
| GSAP | ScrollTrigger, loaded on demand by the one section that needs it |
| next/font | Space Grotesk and IBM Plex Sans Arabic, self-hosted at build time |

## Design decisions

**Two route groups instead of one `[lang]` segment.** A single dynamic segment
would mean deciding the language inside the render, which leaves `<html lang>`
and `<html dir>` to be corrected after first paint — an RTL page visibly
flipping direction as it loads. `app/(ar)` and `app/(en)` each own a root
layout that hands `Shell` a fixed `lang`, so the direction is already correct
in the served HTML and each language is a real indexable URL.

**The skills section is pinned with `position: sticky`, not GSAP's pin.**
GSAP's pin injects measured heights into the layout, and any viewport resize
while the section is pinned makes it slip out of place. Sticky lets the browser
recompute for itself; ScrollTrigger is left with a single job — reading scroll
progress — which cannot desync anything. If GSAP fails to load, the viewport is
narrow, or reduced motion is requested, the section renders as a plain list
with identical content.

**One `requestAnimationFrame` loop drives every pointer-following effect.**
`components/PointerMotion.tsx` owns the hero's three parallax depth layers, the
accent glow and the gallery drift in a single loop. A listener and a loop per
component would mean several layout reads per frame and elements that visibly
drift out of sync with each other. Effects that need *element-relative*
coordinates instead — card tilt, button fill origin, tap ripples — stay on
per-element listeners, because they only need to run while the pointer is
actually on that element.

---

Front-end only. No database, no API routes, no admin panel, no environment
variables. All content lives in TypeScript files under `data/`, all images in
`public/`, and the site builds to static pages.

```bash
npm install
npm run dev      # http://localhost:3000
```

That is the whole setup. If it asks you for a database or a `.env` file,
something has been added that should not have been.

- Arabic is at `/`
- English is at `/en`

---

## The three edits you will actually make

### Add a workshop

Open `data/workshops.ts` and add an entry to the `workshops` array:

```ts
{
  id: 'process-safety-101',        // unique, lowercase, no spaces
  titleAr: 'أساسيات سلامة العمليات',
  titleEn: 'Process Safety 101',
  kind: 'workshop',                // workshop | course | session | visit | competition
  termAr: 'الفصل الأول',
  termEn: 'Term 1',
  trainerAr: 'اسم المدرّب',        // optional
  trainerEn: 'Trainer name',       // optional
  featured: true,                  // shows on the home page
}
```

Only entries with `featured: true` appear on the home page — aim for six to
eight. Everything else is reachable through the "show all" button, which
appears by itself once there are more workshops than featured ones.

The three `SAMPLE` entries currently in the file are placeholders. Delete them
as real titles arrive.

### Add a team member

1. Put the photo in `public/team/` as `firstname.jpg`.
   **Portrait 3:4, face in the upper third, at least 600×800px.** Anything
   smaller looks soft on a desktop grid.
2. Add an entry to `leadership` or `committees` in `data/team.ts`.

```ts
{
  id: 'sara',
  nameAr: 'سارة …',
  nameEn: 'Sara …',
  roleAr: 'لجنة الإعلام والمحتوى',
  roleEn: 'Media & Content',
  majorAr: 'هندسة كيميائية',
  majorEn: 'Chemical Engineering',
  bioAr: '…',
  bioEn: '…',
  photo: '/team/sara.jpg',         // or null
  links: { linkedin: 'https://…' } // omit a key rather than leaving it empty
}
```

No photo yet? Set `photo: null` and the card shows the member's initials on the
deep blue ground. That is a designed state, not a broken image, so it is fine
to ship.

Order in the array is the order on the page. Leadership renders as two rows of
two; committee heads render four across.

**Do not add an empty social link.** The card renders whatever keys exist in
`links` and nothing else, which is why an icon never appears without a working
destination behind it.

### Add a photo to the gallery

1. Put the image in `public/gallery/`.
2. Add an entry to `data/gallery.ts`:

```ts
{
  src: '/gallery/g10.jpg',
  captionAr: 'وصف ما يظهر فعلًا في الصورة',
  captionEn: 'A description of what is actually in the frame',
  span: 3,                          // 2 | 3 | 6 — width on the 6-column grid
}
```

The caption is also the alt text, so write it as a real description of the
photograph. Keep the gallery to eight to twelve images; it is a shortlist, not
an archive.

---

## Where everything lives

```
data/         all content — edit these
  site.ts       identity, social links, the join form URL
  team.ts       supervisor, leadership, committee heads
  workshops.ts  workshops and courses
  gallery.ts    curated photos
  timeline.ts   milestones
  targets.ts    the numbers (read the note at the top of this one)

lib/
  i18n.tsx      Lang type, dirOf, pick(ar, en), route helpers
  ui.ts         every repeated interface string, including the join CTA
  fonts.ts      next/font setup

components/   one file per section, plus small shared pieces
app/
  (ar)/         Arabic root layout + page, served at /
  (en)/en/      English root layout + page, served at /en
  globals.css   design tokens and the bespoke component styles
```

### Two rules worth keeping

**The join CTA is defined once.** Its label is `ui.joinCtaAr` / `ui.joinCtaEn`
in `lib/ui.ts` and its URL is `joinUrl` in `data/site.ts`. It renders in four
places. Change it in those two spots and every instance follows.

**Numbers must be wrapped in `<Num>`.** In a right-to-left page the browser
will otherwise render `30+` as `+30` and can reverse a range like `2026/2027`.
`components/Num.tsx` isolates the numeral so that cannot happen. This includes
years.

---

## Deploying

**Vercel** — push the repo and import it. Nothing to configure. Image
optimisation and AVIF/WebP work out of the box.

**Any static host** (GitHub Pages, Netlify drop, S3) — uncomment the two lines
at the bottom of `next.config.mjs`, run `npm run build`, and upload `./out`.
Note that Next's image optimiser needs a server, so `unoptimized: true` is
required there and images ship at their original size. Compress them yourself
before adding them if you go this route.

---

## Still outstanding

Search the codebase for `TODO` to find these in place.

- Dr. Hussein's exact academic rank and the confirmed English spelling of his
  surname — `data/team.ts`
- A portrait for Tasneem Alsharif; the supplied photo was a wide podium shot
  that could not be cropped to 3:4 — `data/team.ts`
- A higher-resolution original for Ayman Asiri; the current file is 513×488,
  below the minimum and visibly soft on desktop — `data/team.ts`
- English bios for Firas, Tasneem, Anas and Abdulmalik were drafted from the
  Arabic rather than written by them, and are marked `TODO review`
- The real workshop titles — `data/workshops.ts`
- Confirmation of the 1447 recognition wording — `data/timeline.ts`
- The production domain in `metadataBase` — both files in `app/`

---

Designed and developed by [Mohammed Sabrah](https://github.com/Sabra7).

Code is [MIT licensed](LICENSE). The site copy, the team and event photographs,
and the AIChE name and logo are not — they belong to their respective owners.
