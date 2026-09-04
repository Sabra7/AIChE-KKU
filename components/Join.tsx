import { pick, type Lang } from '@/lib/i18n';
import JoinButton from './JoinButton';
import Reveal from './Reveal';
import Socials from './Socials';

/**
 * The peak of the journey: one action, alone. The social links sit quietly
 * beneath it rather than competing with it, and there is no contact form —
 * the chapter has no official inbox yet, so joining is the point of contact.
 */
export default function Join({ lang }: { lang: Lang }) {
  return (
    <section className="sect join" id="join">
      <div className="shell">
        {/* The molecular joint motif, one last time. */}
        <Reveal>
          <svg
            className="joint"
            viewBox="0 0 600 26"
            preserveAspectRatio="none"
            aria-hidden="true"
            style={{ maxWidth: 280, marginInline: 'auto', marginBottom: '2.5rem' }}
          >
            <line x1="10" y1="13" x2="290" y2="13" pathLength={1} />
            <line x1="310" y1="13" x2="590" y2="13" pathLength={1} />
            <circle cx="300" cy="13" r="4" />
          </svg>
        </Reveal>

        <Reveal delay={1}>
          <h2>{pick(lang, 'الطريق يبدأ بنموذج واحد.', 'It starts with one form.')}</h2>
        </Reveal>

        <Reveal as="p" delay={2}>
          {pick(
            lang,
            'مفتوح لجميع طلاب جامعة الملك خالد، من أي تخصص. لا خبرة مطلوبة — ما نبحث عنه هو من يريد أن يبني شيئًا قبل أن يتخرج.',
            "Open to every King Khalid University student, from any major. No experience required — we're looking for people who want to build something before they graduate.",
          )}
        </Reveal>

        <Reveal delay={3}>
          <JoinButton lang={lang} size="lg" />
        </Reveal>

        <Reveal delay={4}>
          <Socials />
        </Reveal>
      </div>
    </section>
  );
}
