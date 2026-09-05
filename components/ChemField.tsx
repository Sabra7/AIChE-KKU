import type { CSSProperties } from 'react';

/**
 * The chemistry field — the animated background motif.
 *
 * Four things are drawn, and every one of them is chemistry rather than
 * generic ornament: benzene rings, gears (process plant), covalent bonds with
 * a charge running along them, and Bohr atoms with orbiting electrons. It is
 * the same vocabulary as the logo and the section joints, so the background
 * never reads as stock decoration bolted on.
 *
 * TWO CANVASES, ONE MOTIF
 * A single wide viewBox cannot serve both screen shapes. With
 * `preserveAspectRatio="slice"`, a 1400-unit-wide canvas on a 390px phone is
 * cropped to roughly its middle third — which is why the field was, in
 * practice, invisible on a phone. So the composition is authored twice: once
 * for landscape space and once for a portrait one, and CSS shows exactly one.
 * `display:none` on the other also stops its animations, so nothing is paid
 * for the canvas that is not on screen.
 *
 * Sizes are in user units that land at roughly 1:1 CSS pixels on both
 * canvases, so a ring is the same physical size on a laptop and on a phone.
 *
 * `pointer` opts the field into the parallax that PointerMotion drives; the
 * three [data-depth] layers are what make the motif read as space behind the
 * type rather than one flat sheet sliding under it.
 */

type Variant = 'hero' | 'gains';

/** [x, y] in the canvas's own user units. */
type Spot = [number, number];
/** [x, y, scale] — atoms are the one motif drawn at more than one size. */
type AtomSpot = [number, number, number];

interface Composition {
  viewBox: string;
  bonds: string[];
  cogs: Spot[];
  rings: Spot[];
  atoms: AtomSpot[];
}

/** Landscape: laptops and up. */
const WIDE: Composition = {
  viewBox: '0 0 1400 800',
  bonds: [
    'M150,130 L430,250 L700,90',
    'M1090,360 L1210,190',
    'M120,480 L330,700 L770,720 L980,640',
    'M1090,360 L1310,480',
    'M700,90 L1090,360',
    'M430,250 L330,700',
  ],
  cogs: [
    [430, 250],
    [1090, 360],
    [120, 480],
    [770, 720],
  ],
  rings: [
    [150, 130],
    [1210, 190],
    [980, 640],
    [330, 700],
    [700, 90],
    [1310, 480],
  ],
  atoms: [
    [880, 470, 1],
    [250, 300, 0.8],
  ],
};

/**
 * Portrait: phones. Same vocabulary, re-composed for a tall box.
 *
 * The atoms are the one motif placed against the CONTENT rather than just the
 * canvas. A phone hero is type from edge to edge between roughly y=300 and
 * y=650, so an atom in the middle of the canvas is simply hidden behind the
 * headline. One sits below that band, where the hero has room; the other sits
 * above it, which is also the slice a phone sees of the much shorter GAINS
 * box, so neither section is left without one.
 */
const TALL: Composition = {
  viewBox: '0 0 420 860',
  bonds: [
    'M62,118 L192,232 L338,150',
    'M338,150 L378,436',
    'M60,470 L128,600 L330,612',
    'M192,232 L60,470',
    'M128,600 L250,830',
  ],
  cogs: [
    [192, 232],
    [128, 600],
  ],
  rings: [
    [62, 118],
    [338, 150],
    [60, 470],
    [378, 436],
    [330, 612],
    [250, 830],
  ],
  atoms: [
    [320, 755, 0.9],
    [60, 300, 0.75],
  ],
};

/** Index-keyed custom property; drives per-element stagger from CSS. */
const step = (i: number) => ({ ['--i' as string]: i }) as CSSProperties;

/**
 * Class names are written out in full, never assembled as `chem--${variant}`.
 * The whole of globals.css sits inside `@layer base`, and Tailwind tree-shakes
 * a layer against the class names it can find as literal strings in the files
 * it scans. An interpolated name is invisible to that scan, so the matching
 * rule is silently dropped from the built stylesheet — no error, no warning,
 * just a rule that never arrives.
 */
const VARIANT_CLASS: Record<Variant, string> = {
  hero: 'chem--hero',
  gains: 'chem--gains',
};
const SHAPE_CLASS = { wide: 'chem--wide', tall: 'chem--tall' } as const;

/**
 * A Bohr atom: three tilted shells, each spinning in its own plane, with a
 * pair of electrons riding it.
 *
 * Drawn inline rather than as a `<use>` of a shared definition, because the
 * shells animate and CSS selectors do not reliably reach inside a `<use>`
 * shadow tree. The electron pair is not only chemistry — it also keeps each
 * shell's bounding box symmetric, which is what lets `transform-box:fill-box`
 * spin it around its true centre instead of wobbling off-axis.
 */
function Atom({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <g className="chem__atom" transform={`translate(${x} ${y}) scale(${s})`}>
      {[0, 60, -60].map((tilt, i) => (
        // The tilt is a presentation attribute and the spin is CSS: they
        // cannot share one element, because CSS transform would replace the
        // attribute outright rather than composing with it.
        <g key={tilt} transform={`rotate(${tilt})`}>
          <g className="chem__shell" style={step(i)}>
            <ellipse className="chem__orbit" rx="34" ry="14.5" />
            <circle className="chem__e" cx="34" cy="0" r="2.9" />
            <circle className="chem__e" cx="-34" cy="0" r="2.9" />
          </g>
        </g>
      ))}
      <circle className="chem__nucleus" r="5" />
    </g>
  );
}

function Canvas({
  shape,
  composition: c,
  variant,
  pointer,
}: {
  shape: keyof typeof SHAPE_CLASS;
  composition: Composition;
  variant: Variant;
  pointer: boolean;
}) {
  return (
    <svg
      className={`chem ${VARIANT_CLASS[variant]} ${SHAPE_CLASS[shape]}`}
      data-pointer-field={pointer ? '' : undefined}
      viewBox={c.viewBox}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {/* Far layer: the bonds. They barely move, so they read as the ground. */}
      <g data-depth={pointer ? '0.45' : undefined}>
        <g>
          {c.bonds.map((d, i) => (
            <path className="chem__bond" key={d} d={d} pathLength={1} style={step(i)} />
          ))}
        </g>
        {/* The travelling charge is a second copy of each bond carrying one
            short dash. Overlaying rather than animating the bond itself keeps
            the drawn-in line permanent underneath. */}
        <g>
          {c.bonds.map((d, i) => (
            <path className="chem__pulse" key={d} d={d} pathLength={1} style={step(i)} />
          ))}
        </g>
      </g>

      {/* Mid layer: the gears turning and the atoms spinning. */}
      <g data-depth={pointer ? '0.8' : undefined}>
        <g>
          {c.cogs.map(([x, y]) => (
            <use className="chem__cog" key={`${x}-${y}`} href="#chem-cog" x={x} y={y} />
          ))}
        </g>
        {c.atoms.map(([x, y, s]) => (
          <Atom key={`${x}-${y}`} x={x} y={y} s={s} />
        ))}
      </g>

      {/* Near layer: the rings, drifting furthest. */}
      <g data-depth={pointer ? '1.3' : undefined}>
        {c.rings.map(([x, y], i) => (
          <g className="chem__ring" key={`${x}-${y}`} style={step(i)}>
            <use href="#chem-benz" x={x} y={y} />
          </g>
        ))}
      </g>
    </svg>
  );
}

export default function ChemField({
  variant,
  pointer = false,
}: {
  variant: Variant;
  /** Opt into the PointerMotion parallax. Only the hero needs it. */
  pointer?: boolean;
}) {
  return (
    <>
      <Canvas shape="wide" composition={WIDE} variant={variant} pointer={pointer} />
      <Canvas shape="tall" composition={TALL} variant={variant} pointer={pointer} />
    </>
  );
}

/**
 * The shapes every canvas reuses, defined once for the whole document.
 *
 * Rendered by Shell alongside IconSprite, because ChemField appears more than
 * once per page and duplicate ids would make `<use href="#…">` ambiguous.
 * Strokes are `currentColor`, so one definition serves the ink-on-cream hero
 * and the cream-on-ink GAINS section.
 */
export function ChemDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
      <defs>
        {/* Benzene: the outer ring plus the inner one standing in for the
            delocalised electrons. */}
        <g id="chem-benz" fill="none" stroke="currentColor">
          <polygon
            points="0,-26 22.5,-13 22.5,13 0,26 -22.5,13 -22.5,-13"
            strokeWidth="1.35"
            strokeOpacity=".62"
          />
          <polygon
            points="0,-17 14.7,-8.5 14.7,8.5 0,17 -14.7,8.5 -14.7,-8.5"
            strokeWidth="1.1"
            strokeOpacity=".4"
          />
        </g>

        <g id="chem-cog" fill="none" stroke="currentColor" strokeLinecap="round">
          <circle r="19" strokeWidth="1.35" strokeOpacity=".55" />
          <circle r="9" strokeWidth="1.1" strokeOpacity=".38" />
          <g strokeWidth="1.35" strokeOpacity=".55">
            <path d="M0,-19V-25M0,19V25M-19,0H-25M19,0H25" />
            <path d="M13.4,-13.4l4.3,-4.3M-13.4,13.4l-4.3,4.3M13.4,13.4l4.3,4.3M-13.4,-13.4l-4.3,-4.3" />
          </g>
        </g>
      </defs>
    </svg>
  );
}
