import type { Lang } from '@/lib/i18n';
import About from './About';
import Gains from './Gains';
import Gallery from './Gallery';
import Hero from './Hero';
import Join from './Join';
import Journey from './Journey';
import Partners from './Partners';
import Targets from './Targets';
import Team from './Team';

/**
 * Section order, and the argument for it:
 *
 *   who we are → why us → what YOU gain → what's the proof →
 *   who we are as people → who stands with us → how you join
 *
 * "What you gain" sits before the evidence on purpose. A prospective member
 * decides whether to keep reading there, not in the numbers.
 */
export default function HomeSections({ lang }: { lang: Lang }) {
  return (
    <>
      <Hero lang={lang} />
      <About lang={lang} />
      <Targets lang={lang} />
      <Gains lang={lang} />
      {/*
        Programme is parked, not deleted. It only had placeholder titles to
        show, and a card reading "the rest load from workshops.ts" is internal
        note, not copy for a visitor. components/Programme.tsx and
        data/workshops.ts are untouched: once the real titles land, restore the
        import and the line here, and put `program` back into ui.navAr/navEn
        and NAV_ORDER in lib/ui.ts.
      */}
      <Journey lang={lang} />
      <Gallery lang={lang} />
      <Team lang={lang} />
      <Partners lang={lang} />
      <Join lang={lang} />
    </>
  );
}
