import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import type { ComponentProps, ReactNode } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';

import { getT } from '@/lib/i18n';
import { useLang } from '@/lib/LangContext';
import { colors, fonts } from '@/theme';
import { Pressable } from '@/components/Pressable';

export type InfoContent = { title: string; message: string };

type Props = {
  content: InfoContent | null;
  onClose: () => void;
};

/** Fenêtre d'explication (remplace Alert, qui ne s'affiche pas sur le web). */
export function InfoModal({ content, onClose }: Props) {
  const t = getT(useLang().lang);
  return (
    <Modal visible={content !== null} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel={t.shop.close}>
        <Pressable style={styles.card} onPress={() => {}}>
          <Text style={styles.title}>{content?.title}</Text>
          <Text style={styles.message}>{content?.message}</Text>
          <Pressable onPress={onClose} accessibilityRole="button" style={styles.button}>
            <Text style={styles.buttonLabel}>OK</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

type ConfirmProps = {
  visible: boolean;
  /** Affiché au-dessus du titre (ex. badge d'équipe). */
  header?: ReactNode;
  title: string;
  /** Lignes du titre avant réduction de la police (1 par défaut). */
  titleLines?: number;
  /** Facultatif quand `children` explique déjà tout (ex. illustration). */
  message?: string;
  /** Contenu affiché sous le message (ex. choix d'un pack). */
  children?: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  /** Pictos devant les libellés : rendent l'effet du bouton lisible d'un coup d'œil. */
  confirmIcon?: IconName;
  cancelIcon?: IconName;
  onConfirm: () => void;
  /** Sans onCancel, le bouton secondaire n'est pas affiché. */
  onCancel?: () => void;
  /** Tap hors carte / retour Android — par défaut onCancel. */
  onDismiss?: () => void;
  /** Affiche une croix de fermeture en haut à droite de la carte. */
  onClose?: () => void;
  closeLabel?: string;
};

/** Fenêtre de confirmation à deux boutons — même DA que PauseModal. */
export function ConfirmModal({
  visible,
  header,
  title,
  titleLines = 1,
  message,
  children,
  confirmLabel,
  cancelLabel,
  confirmIcon,
  cancelIcon,
  onConfirm,
  onCancel,
  onDismiss = onCancel,
  onClose,
  closeLabel,
}: ConfirmProps) {
  const t = getT(useLang().lang);
  const cancelText = cancelLabel ?? t.common.cancel;
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onDismiss}>
      <Pressable style={pauseStyles.backdrop} onPress={onDismiss} accessibilityLabel={cancelText}>
        <Pressable style={pauseStyles.card} onPress={() => {}}>
          {onClose ? (
            <Pressable
              onPress={onClose}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel={closeLabel ?? t.shop.close}
              style={confirmStyles.closeBtn}
            >
              <MaterialCommunityIcons name="close" size={28} color={colors.purpleDeep} />
            </Pressable>
          ) : null}
          {header}
          <Text style={pauseStyles.title} numberOfLines={titleLines} adjustsFontSizeToFit>
            {title}
          </Text>
          {message ? <Text style={pauseStyles.message}>{message}</Text> : null}
          {children}
          <View style={confirmStyles.actions}>
            {onCancel ? (
              <Pressable onPress={onCancel} accessibilityRole="button" style={confirmStyles.cancelBtn}>
                <View style={confirmStyles.labelRow}>
                  {cancelIcon ? <MaterialCommunityIcons name={cancelIcon} size={26} color={colors.purpleDeep} /> : null}
                  <Text style={[confirmStyles.cancelText, confirmStyles.labelText]} numberOfLines={1} adjustsFontSizeToFit>
                    {cancelText}
                  </Text>
                </View>
              </Pressable>
            ) : null}
            <Pressable onPress={onConfirm} accessibilityRole="button" style={pauseStyles.btnWrap}>
              <LinearGradient
                colors={['#fb940e', '#f2c512']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={pauseStyles.btnInner}
              >
                <View style={confirmStyles.labelRow}>
                  {confirmIcon ? <MaterialCommunityIcons name={confirmIcon} size={26} color={colors.cream} /> : null}
                  <Text style={[pauseStyles.btnText, confirmStyles.labelText]} numberOfLines={1} adjustsFontSizeToFit>
                    {confirmLabel}
                  </Text>
                </View>
              </LinearGradient>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

type PauseProps = {
  visible: boolean;
  onResume: () => void;
};

/**
 * Chrono suspendu : View absolue (pas Modal) pour laisser les chips scrollables.
 * pointerEvents="box-none" sur le fond — touches passent au travers, sauf sur la carte.
 */
export function PauseModal({ visible, onResume }: PauseProps) {
  const t = getT(useLang().lang);
  if (!visible) return null;
  return (
    <View style={pauseStyles.backdrop} pointerEvents="box-none">
      <View style={pauseStyles.card}>
        <Text style={pauseStyles.title}>{t.common.pausedTitle}</Text>
        <Text style={pauseStyles.message}>{t.common.pausedMsg}</Text>
        <Pressable onPress={onResume} accessibilityRole="button" style={pauseStyles.btnWrap}>
          <LinearGradient
            colors={['#fb940e', '#f2c512']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={pauseStyles.btnInner}
          >
            <Text style={pauseStyles.btnText}>{t.survie.resume}</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}

/** Petite pastille « i » placée en exposant d'un libellé. */
export function InfoBadge({ onPress, label }: { onPress: () => void; label: string }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={`À propos : ${label}`} hitSlop={10}>
      <View style={styles.badge}>
        <Text style={styles.badgeLabel}>i</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: 'rgba(40,0,70,0.55)',
  },
  card: {
    width: '100%',
    maxWidth: 400,
    gap: 14,
    padding: 24,
    borderRadius: 28,
    backgroundColor: colors.white,
  },
  title: {
    color: colors.purple,
    fontFamily: fonts.display,
    fontSize: 22,
  },
  message: {
    color: colors.black,
    fontFamily: fonts.bodyRegular,
    fontSize: 16,
    lineHeight: 23,
  },
  button: {
    alignSelf: 'flex-end',
    paddingHorizontal: 26,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.teal,
  },
  pauseCard: {
    alignItems: 'center',
  },
  pauseTime: {
    color: colors.orange,
    fontFamily: fonts.display,
    fontSize: 48,
  },
  centered: {
    textAlign: 'center',
  },
  resume: {
    alignSelf: 'center',
    paddingHorizontal: 36,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
    gap: 10,
  },
  secondary: {
    alignSelf: 'auto',
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.lavender,
  },
  secondaryLabel: {
    color: colors.purple,
  },
  danger: {
    alignSelf: 'auto',
    backgroundColor: colors.pink,
  },
  buttonLabel: {
    color: colors.white,
    fontFamily: fonts.display,
    fontSize: 17,
  },
  badge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.lavender,
  },
  badgeLabel: {
    color: colors.white,
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 18,
  },
});

const pauseStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: 'rgba(5,20,46,0.80)',
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fef1cb',
    borderRadius: 24,
    paddingHorizontal: 48,
    paddingVertical: 48,
    alignItems: 'center',
    gap: 24,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 34,
    color: colors.purpleDeep,
    textAlign: 'center',
  },
  message: {
    fontFamily: fonts.displayMedium,
    fontSize: 18,
    color: colors.purpleDeep,
    textAlign: 'center',
    lineHeight: 22,
  },
  btnWrap: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#a15c03',
    shadowColor: '#a15c03',
    shadowOffset: { width: -1, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  btnInner: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    fontFamily: fonts.display,
    fontSize: 24,
    color: colors.cream,
  },
});

const confirmStyles = StyleSheet.create({
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
  },
  labelRow: {
    maxWidth: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  // Le libellé rétrécit pour laisser la place au picto au lieu de le pousser hors du bouton
  labelText: {
    flexShrink: 1,
  },
  actions: {
    width: '100%',
    gap: 12,
  },
  cancelBtn: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.purpleDeep,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 51,
  },
  cancelText: {
    fontFamily: fonts.display,
    fontSize: 24,
    color: colors.purpleDeep,
  },
});
