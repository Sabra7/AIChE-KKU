import { pick, type Lang } from '@/lib/i18n';
import { ui } from '@/lib/ui';
import DualDate from './DualDate';

/**
 * Copyright year. Two values now, and both are set by hand — bump them
 * together. September 2026 falls inside 1448 AH (16 Jun 2026 – 4 Jun 2027).
 */
const YEAR = { greg: '2026', hijri: '1448' };

export default function Footer({ lang }: { lang: Lang }) {
  return (
    <footer className="ftr">
      <div className="shell ftr__in">
        <p className="ftr__c">
          © <DualDate lang={lang} date={YEAR} inline /> AIChE —{' '}
          {pick(lang, 'الفرع الطلابي بجامعة الملك خالد', 'King Khalid University Student Chapter')}
        </p>
        {/* One clean line, 12px, no technology name-dropping. */}
        <p className="ftr__c en">
          {ui.creditPrefix}{' '}
          <a href={ui.creditUrl} target="_blank" rel="noopener noreferrer">
            {ui.creditName}
          </a>
        </p>
      </div>
    </footer>
  );
}
