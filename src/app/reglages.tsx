import { ComingSoon } from '@/components/ComingSoon';
import { useLang } from '@/lib/LangContext';
import { getT } from '@/lib/i18n';

export default function Screen() {
  const { lang } = useLang();
  const t = getT(lang);
  return <ComingSoon title={t.pages.settings} />;
}
