import { LinearGradient } from 'expo-linear-gradient';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fonts } from '@/theme';

export type InfoContent = { title: string; message: string };

type Props = {
  content: InfoContent | null;
  onClose: () => void;
};

/** Fenêtre d'explication (remplace Alert, qui ne s'affiche pas sur le web). */
export function InfoModal({ content, onClose }: Props) {
  return (
    <Modal visible={content !== null} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Fermer">
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

type ConfirmProps = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
};

/** Fenêtre de confirmation à deux boutons — même DA que PauseModal. */
export function ConfirmModal({ visible, title, message, confirmLabel, onConfirm, onCancel }: ConfirmProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable style={pauseStyles.backdrop} onPress={onCancel} accessibilityLabel="Annuler">
        <Pressable style={pauseStyles.card} onPress={() => {}}>
          <Text style={pauseStyles.title}>{title}</Text>
          <Text style={pauseStyles.message}>{message}</Text>
          <View style={confirmStyles.actions}>
            <Pressable onPress={onCancel} accessibilityRole="button" style={confirmStyles.cancelBtn}>
              <Text style={confirmStyles.cancelText}>ANNULER</Text>
            </Pressable>
            <Pressable onPress={onConfirm} accessibilityRole="button" style={pauseStyles.btnWrap}>
              <LinearGradient
                colors={['#fb940e', '#f2c512']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={pauseStyles.btnInner}
              >
                <Text style={pauseStyles.btnText}>{confirmLabel}</Text>
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
  if (!visible) return null;
  return (
    <View style={pauseStyles.backdrop} pointerEvents="box-none">
      <View style={pauseStyles.card}>
        <Text style={pauseStyles.title}>Jeu en pause</Text>
        <Text style={pauseStyles.message}>Vérifiez la réponse puis{'\n'}reprenez la partie.</Text>
        <Pressable onPress={onResume} accessibilityRole="button" style={pauseStyles.btnWrap}>
          <LinearGradient
            colors={['#fb940e', '#f2c512']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={pauseStyles.btnInner}
          >
            <Text style={pauseStyles.btnText}>REPRENDRE</Text>
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
