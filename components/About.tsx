import type { DualDate as Dual } from '@/lib/dates';
import { pick, type Lang } from '@/lib/i18n';
import DualDate from './DualDate';
import Reveal from './Reveal';

/**
 * Sticky storytelling: the summary pins on the left while four beats scroll
 * past on the right. The dot beside each beat fills with accent green as it
 * enters — the section's one piece of motion.
 */

interface Beat {
  id: string;
  /** Prefixes the title, in both calendars. The date is kept out of the title
      string so <Num> can isolate it — an Arabic h3 will otherwise reorder it. */
  date?: Dual;
  titleAr: string;
  titleEn: string;
  bodyAr: string;
  bodyEn: string;
}

const beats: Beat[] = [
  {
    id: 'idea',
    titleAr: 'الفكرة',
    titleEn: 'The idea',
    bodyAr:
      'قسم الهندسة الكيميائية في أبها فيه طلاب طموحون، وما ينقصهم ليس الاجتهاد بل المنفذ: مكان يجرّبون فيه القيادة والتنظيم والبحث قبل التخرج.',
    bodyEn:
      'The Chemical Engineering department in Abha has no shortage of ambition. What was missing was an outlet — somewhere to practise leadership, organising and research before graduation.',
  },
  {
    id: 'charter',
    // July 2021 fell in Dhu al-Qi'dah / Dhu al-Hijjah 1442. The exact charter
    // date is not known, so the copy names the year, never the Hijri month.
    date: { greg: '2021', hijri: '1442' },
    titleAr: 'الاعتماد',
    titleEn: 'Chartered',
    bodyAr:
      'في يوليو 2021م الموافق 1442هـ اعتمد المعهد الأمريكي للمهندسين الكيميائيين الجامعة فرعًا طلابيًا رسميًا، ضمن المنطقة الدولية.',
    bodyEn:
      'In July 2021 (1442 AH) the American Institute of Chemical Engineers granted the university official Student Chapter status, within the International Region.',
  },
  {
    id: 'aim',
    titleAr: 'الهدف',
    titleEn: 'The aim',
    bodyAr:
      'ألا يتخرج الطالب بشهادة فقط، بل بخبرة قادها بنفسه: ورشة نفّذها، فعالية نظّمها، ملصق بحثي وقف خلفه وشرحه.',
    bodyEn:
      'That a student graduates with more than a degree — with experience they led themselves: a workshop they ran, an event they organised, a research poster they stood behind and explained.',
  },
  {
    id: 'impact',
    titleAr: 'الأثر',
    titleEn: 'The impact',
    bodyAr: 'ورش ودورات وزيارات ومعارض ومؤتمرات، وحضور ثابت في كلية الهندسة على شطريها.',
    bodyEn:
      'Workshops, courses, industry visits, expos and conferences — and a steady presence across both sections of the College of Engineering.',
  },
];

export default function About({ lang }: { lang: Lang }) {
  return (
    <section className="sect sect--tint" id="about">
      <div className="shell story">
        <Reveal className="story__stick">
          <h2>{pick(lang, 'من نحن', 'Who we are')}</h2>
          <p>
            {pick(
              lang,
              'الفرع الطلابي للمعهد الأمريكي للمهندسين الكيميائيين بجامعة الملك خالد. نصل بين ما يُدرَّس في القاعة وما يُطلب في الصناعة، ونضع طلاب أبها داخل أكبر مجتمع مهني للهندسة الكيميائية في العالم.',
              "The King Khalid University student chapter of the American Institute of Chemical Engineers. We close the gap between what is taught in the classroom and what industry asks for, and place students in Abha inside the world's largest professional community for chemical engineering.",
            )}
          </p>
        </Reveal>

        <ol className="beats">
          {beats.map((b) => (
            <Reveal as="li" key={b.id} className="beat">
              <h3>
                {b.date && (
                  <>
                    <DualDate lang={lang} date={b.date} inline /> —{' '}
                  </>
                )}
                {pick(lang, b.titleAr, b.titleEn)}
              </h3>
              <p>{pick(lang, b.bodyAr, b.bodyEn)}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
