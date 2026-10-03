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

/** Fenêtre de confirmation à deux boutons. */
export function ConfirmModal({ visible, title, message, confirmLabel, onConfirm, onCancel }: ConfirmProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable style={styles.backdrop} onPress={onCancel} accessibilityLabel="Annuler">
        <Pressable style={styles.card} onPress={() => {}}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.actions}>
            <Pressable onPress={onCancel} accessibilityRole="button" style={[styles.button, styles.secondary]}>
              <Text style={[styles.buttonLabel, styles.secondaryLabel]}>ANNULER</Text>
            </Pressable>
            <Pressable onPress={onConfirm} accessibilityRole="button" style={[styles.button, styles.danger]}>
              <Text style={styles.buttonLabel}>{confirmLabel}</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

type PauseProps = {
  visible: boolean;
  secondsLeft: number;
  onResume: () => void;
};

/** Chrono suspendu (recherche web en cours) : reprise à la main par les joueurs. */
export function PauseModal({ visible, secondsLeft, onResume }: PauseProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onResume}>
      <View style={styles.backdrop}>
        <View style={[styles.card, styles.pauseCard]}>
          <Text style={styles.title}>CHRONO EN PAUSE</Text>
          <Text style={styles.pauseTime}>{secondsLeft} s</Text>
          <Text style={[styles.message, styles.centered]}>Vérifiez la réponse, puis reprenez la partie.</Text>
          <Pressable onPress={onResume} accessibilityRole="button" style={[styles.button, styles.resume]}>
            <Text style={styles.buttonLabel}>REPRENDRE</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
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
