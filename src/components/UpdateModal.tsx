import { Linking } from 'react-native';

import { ConfirmModal } from '@/components/InfoModal';
import { APP_STORE_URL } from '@/lib/appUpdate';
import { getT } from '@/lib/i18n';
import { useLang } from '@/lib/LangContext';

/** « Mise à jour disponible » : ouvre la fiche App Store, ou se referme jusqu'au prochain lancement. */
export function UpdateModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const t = getT(useLang().lang);
  return (
    <ConfirmModal
      visible={visible}
      title={t.common.updateTitle}
      // Titre long (« Nouvelles questions et packs ! ») : 2 lignes plutôt qu'une police réduite
      titleLines={2}
      message={t.common.updateMsg}
      confirmLabel={t.common.updateBtn}
      confirmIcon="download"
      cancelLabel={t.shop.later}
      onConfirm={() => {
        onClose();
        Linking.openURL(APP_STORE_URL).catch(() => {});
      }}
      onCancel={onClose}
    />
  );
}
