import { pick, type Lang } from '@/lib/i18n';
import Num from './Num';
import Reveal from './Reveal';

/**
 * Sticky storytelling: the summary pins on the left while four beats scroll
 * past on the right. The dot beside each beat fills with accent green as it
 * enters — the section's one piece of motion.
 */

interface Beat {
  id: string;
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
    titleAr: '2021 — الاعتماد',
    titleEn: '2021 — Chartered',
    bodyAr:
      'في يوليو 2021 اعتمد المعهد الأمريكي للمهندسين الكيميائيين الجامعة فرعًا طلابيًا رسميًا، ضمن المنطقة الدولية.',
    bodyEn:
      'In July 2021 the American Institute of Chemical Engineers granted the university official Student Chapter status, within the International Region.',
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
                {b.id === 'charter' && lang === 'ar' ? (
                  <>
                    <Num>2021</Num> — الاعتماد
                  </>
                ) : (
                  pick(lang, b.titleAr, b.titleEn)
                )}
              </h3>
              <p>{pick(lang, b.bodyAr, b.bodyEn)}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
