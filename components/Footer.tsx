import { pick, type Lang } from '@/lib/i18n';
import { ui } from '@/lib/ui';
import Num from './Num';

export default function Footer({ lang }: { lang: Lang }) {
  return (
    <footer className="ftr">
      <div className="shell ftr__in">
        <p className="ftr__c">
          © <Num>2026</Num> AIChE —{' '}
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
