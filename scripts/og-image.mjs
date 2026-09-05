/**
 * Regenerates the Open Graph share images.
 *
 * Run `node scripts/og-image.mjs` from the repo root after changing the logo,
 * the chapter name in data/site.ts, or the palette.
 *
 * Requirements, none of which the app itself needs:
 *   - a network connection — it pulls the two site fonts as TTFs;
 *   - Node >= 22.6, because it imports data/site.ts directly and relies on
 *     Node's own TypeScript type stripping;
 *   - `sharp`, which arrives as an optional dependency of Next rather than a
 *     declared one. `npm install --omit=optional`, or a platform Next ships no
 *     sharp binary for, leaves it absent; `npm install sharp` fixes that.
 *
 * Why a script producing static PNGs instead of `opengraph-image.tsx`:
 * `ImageResponse` renders through Satori, which shapes Arabic glyphs correctly
 * but lays the words out left-to-right — it implements no bidi algorithm, so
 * "جامعة الملك خالد — أبها" comes out reversed, and `direction: 'rtl'` does not
 * fix it. librsvg, which sharp renders SVG through, does full bidi via Pango,
 * so it is the only one of the two that can be trusted with the Arabic image.
 *
 * Fonts reach librsvg through a throwaway fontconfig file rather than being
 * installed system-wide, so running this leaves nothing on the machine.
 */
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const W = 1200;
const H = 630;
const PAD = 96;

// Straight from globals.css — the image must not introduce a colour the site
// does not already use.
const BG = '#F5F1EE';
const INK = '#0D3E6B';
const INK_2 = '#075B91';
const ACCENT = '#8BCB32';
const GREEN_DEEP = '#237A13';

// Google ships one file per weight and folds the weight into the family name
// for anything that is not Regular or Bold. Naming the exact family is more
// predictable than asking fontconfig to pick a weight it may not hold.
const AR_BOLD = 'IBM Plex Sans Arabic';
const AR_SEMI = 'IBM Plex Sans Arabic SemiBold';
const EN_BOLD = 'Space Grotesk';
const EN_MED = 'Space Grotesk Medium';

async function downloadFonts() {
  const work = mkdtempSync(join(tmpdir(), 'og-fonts-'));
  let n = 0;
  for (const [family, axis] of [
    ['IBM+Plex+Sans+Arabic', 'wght@600;700'],
    ['Space+Grotesk', 'wght@500;700'],
  ]) {
    // The ancient UA matters: modern ones get woff2 back, which fontconfig
    // will not index.
    const css = await fetch(`https://fonts.googleapis.com/css2?family=${family}:${axis}`, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
    }).then((r) => r.text());
    for (const m of css.matchAll(/src:\s*url\((https:[^)]+\.ttf)\)/g)) {
      writeFileSync(join(work, `f${n++}.ttf`), Buffer.from(await fetch(m[1]).then((r) => r.arrayBuffer())));
    }
  }
  // fontconfig indexes unreliably when its cache directory does not exist:
  // the scan half-succeeds and some families silently fall back.
  mkdirSync(join(work, 'cache'), { recursive: true });
  writeFileSync(
    join(work, 'fonts.conf'),
    `<?xml version="1.0"?><!DOCTYPE fontconfig SYSTEM "fonts.dtd"><fontconfig>` +
      `<dir>${work}</dir><cachedir>${join(work, 'cache')}</cachedir></fontconfig>`,
  );
  return work;
}

// fontconfig reads FONTCONFIG_FILE once, when the native library initialises,
// which happens before an in-process assignment to process.env can land. So
// the first pass only fetches the fonts and re-runs this file with the
// variable already in the environment; the second pass does the drawing.
if (!process.env.OG_FONT_DIR) {
  const work = await downloadFonts();
  try {
    const run = spawnSync(process.execPath, [fileURLToPath(import.meta.url)], {
      stdio: 'inherit',
      env: { ...process.env, OG_FONT_DIR: work, FONTCONFIG_FILE: join(work, 'fonts.conf') },
    });
    process.exitCode = run.status ?? 1;
  } finally {
    rmSync(work, { recursive: true, force: true });
  }
} else {
  let sharp;
  try {
    ({ default: sharp } = await import('sharp'));
  } catch {
    console.error(
      'og-image: sharp is not installed. It normally arrives as an optional '
        + 'dependency of Next; install it directly with `npm install sharp`.',
    );
    process.exit(1);
  }
  const { site } = await import('../data/site.ts');

  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  /**
   * Renders one line on its own canvas and trims to the inked pixels, which
   * yields exact bounds. Placement is then plain arithmetic — more predictable
   * than SVG `text-anchor`, which librsvg applies inconsistently once
   * `direction` is in play.
   */
  async function line(text, { size, fill = INK, font }) {
    // No `direction` attribute on purpose: librsvg moves the text origin off
    // the canvas when it is set, and trim() then returns fragments. Pango
    // still resolves the bidi runs inside the line correctly without it.
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W * 2}" height="${size * 3}">
      <text x="20" y="${size * 1.9}" font-family="${font}" font-size="${size}"
            font-weight="700" fill="${fill}">${esc(text)}</text></svg>`;
    const { data, info } = await sharp(Buffer.from(svg))
      .png()
      .trim({ threshold: 0 })
      .toBuffer({ resolveWithObject: true });
    return { buf: data, w: info.width, h: info.height };
  }

  /** Shrinks a line until it fits the content column. */
  async function fitted(text, opts) {
    const max = W - PAD * 2;
    let size = opts.size;
    for (;;) {
      const l = await line(text, { ...opts, size });
      if (l.w <= max || size < 20) return l;
      size = Math.floor(size * Math.min(0.94, max / l.w));
    }
  }

  async function build({ out, rtl, name, university, tagline, bold, semi }) {
    const mark = await sharp('public/logo/logo-mark.png')
      .resize({ height: 132 })
      .png()
      .toBuffer({ resolveWithObject: true });

    const nameL = await fitted(name, { size: 68, font: bold });
    const uniL = await fitted(university, { size: 38, fill: INK_2, font: semi });
    const tagL = await fitted(tagline, { size: 27, fill: GREEN_DEEP, font: EN_MED });

    const RULE_W = 132;
    const RULE_H = 6;
    const gaps = [34, 22, 34, 30];
    const blockH =
      mark.info.height + gaps[0] + nameL.h + gaps[1] + uniL.h + gaps[2] + RULE_H + gaps[3] + tagL.h;

    let y = Math.round((H - blockH) / 2);
    // Arabic hangs off the right edge, English off the left, matching how each
    // page actually reads.
    const place = (w) => (rtl ? W - PAD - w : PAD);

    const layers = [];
    const push = (input, w, advance) => {
      layers.push({ input, left: place(w), top: Math.round(y) });
      y += advance;
    };

    push(mark.data, mark.info.width, mark.info.height + gaps[0]);
    push(nameL.buf, nameL.w, nameL.h + gaps[1]);
    push(uniL.buf, uniL.w, uniL.h + gaps[2]);
    push(
      await sharp({ create: { width: RULE_W, height: RULE_H, channels: 4, background: ACCENT } })
        .png()
        .toBuffer(),
      RULE_W,
      RULE_H + gaps[3],
    );
    push(tagL.buf, tagL.w, tagL.h);

    await sharp({ create: { width: W, height: H, channels: 4, background: BG } })
      .composite(layers)
      .png({ compressionLevel: 9 })
      .toFile(out);

    console.log(`wrote ${out}`);
  }

  await build({
    out: 'app/(ar)/opengraph-image.png',
    rtl: true,
    bold: AR_BOLD,
    semi: AR_SEMI,
    name: site.nameAr,
    university: site.universityAr,
    tagline: site.tagline,
  });

  await build({
    out: 'app/(en)/opengraph-image.png',
    rtl: false,
    bold: EN_BOLD,
    semi: EN_MED,
    name: site.nameEn,
    university: site.universityEn,
    tagline: site.tagline,
  });
}
