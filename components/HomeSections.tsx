import type { Lang } from '@/lib/i18n';
import About from './About';
import Gains from './Gains';
import Gallery from './Gallery';
import Hero from './Hero';
import Join from './Join';
import Journey from './Journey';
import Programme from './Programme';
import Targets from './Targets';
import Team from './Team';

/**
 * Section order, and the argument for it:
 *
 *   who we are → why us → what YOU gain → what's the proof →
 *   who we are as people → how you join
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
      <Programme lang={lang} />
      <Journey lang={lang} />
      <Gallery lang={lang} />
      <Team lang={lang} />
      <Join lang={lang} />
    </>
  );
}
