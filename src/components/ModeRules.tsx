import { BlurView } from 'expo-blur';
import type { ReactNode } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Modal, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { ENCHERE_ACTIF_XML, SURVIE_ACTIF_XML } from '@/components/modeIllustrationsXml';
import { Pressable } from '@/components/Pressable';
import { useLang } from '@/lib/LangContext';
import { getT } from '@/lib/i18n';
import { colors, fonts } from '@/theme';

export type RulesMode = 'auction' | 'survie';

/** Liste numérotée (étapes) ou à puces. */
function Steps({ items, numbered = false }: { items: string[]; numbered?: boolean }) {
  return (
    <View style={styles.steps}>
      {items.map((item, i) => (
        <View key={item} style={styles.stepRow}>
          {numbered ? (
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>{i + 1}</Text>
            </View>
          ) : (
            <View style={styles.bullet} />
          )}
          <Text style={styles.text}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

/** Règles d'un mode : titre + illustration, étapes, et les points pour les enchères ; footer est rendu en bas de la carte. */
export function ModeRulesCard({ mode, footer }: { mode: RulesMode; footer?: ReactNode }) {
  const { lang } = useLang();
  const r = getT(lang).rules;
  const isAuction = mode === 'auction';

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title} accessibilityRole="header">
          {isAuction ? r.auctionTitle : r.survieTitle}
        </Text>
        <View
          style={styles.illustration}
          pointerEvents="none"
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        >
          <SvgXml xml={isAuction ? ENCHERE_ACTIF_XML : SURVIE_ACTIF_XML} width="100%" height="100%" />
        </View>
      </View>
      {isAuction ? (
        <>
          <Steps items={r.auctionSteps} numbered />
          <View style={styles.divider} />
          <Text style={styles.subtitle}>{r.pointsTitle}</Text>
          <Steps items={r.auctionPoints} />
        </>
      ) : (
        <Steps items={r.survieSteps} numbered />
      )}
      {footer}
    </View>
  );
}

/** Même carte, en fenêtre par-dessus l'écran ; `mode` null = fermée. */
export function ModeRulesModal({ mode, onClose }: { mode: RulesMode | null; onClose: () => void }) {
  const { lang } = useLang();
  const r = getT(lang).rules;

  return (
    <Modal visible={mode !== null} transparent animationType="fade" statusBarTranslucent onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} sound={false} accessibilityLabel={r.close}>
        {/* Fond flouté + voile sombre : la carte se détache nettement de l'écran derrière */}
        <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} pointerEvents="none" />
        <View style={[StyleSheet.absoluteFill, styles.dim]} pointerEvents="none" />
        {/* Pressable vide : un tap sur la carte ne ferme pas la fenêtre */}
        <Pressable style={styles.modalContent} onPress={() => {}} sound={false} accessible={false}>
          {/* Défile si la carte dépasse (petits écrans) */}
          <ScrollView style={styles.modalScroll} bounces={false} showsVerticalScrollIndicator={false}>
            {mode ? (
              <ModeRulesCard
                mode={mode}
                footer={
                  <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel={r.close} style={styles.closeWrap}>
                    <LinearGradient
                      colors={['#fb940e', '#f2c512']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.closeBtn}
                    >
                      <Text style={styles.closeText}>{r.close}</Text>
                    </LinearGradient>
                  </Pressable>
                }
              />
            ) : null}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fef9e6',
    borderRadius: 16,
    padding: 20,
    gap: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    flex: 1,
    fontFamily: fonts.display,
    fontSize: 22,
    color: colors.purpleDeep,
  },
  illustration: {
    width: 96,
    height: 76,
  },
  subtitle: {
    fontFamily: fonts.display,
    fontSize: 17,
    color: colors.purpleDeep,
  },
  text: {
    flex: 1,
    fontFamily: fonts.displayMedium,
    fontSize: 15,
    lineHeight: 22,
    color: colors.purpleDeep,
  },
  steps: {
    gap: 12,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  stepNumber: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.purple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontFamily: fonts.display,
    fontSize: 14,
    color: colors.cream,
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 7,
    backgroundColor: colors.pink,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(12,45,100,0.12)',
  },
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  dim: {
    backgroundColor: 'rgba(6,18,40,0.72)',
  },
  modalContent: {
    width: '100%',
    maxWidth: 452,
    maxHeight: '100%',
    flexShrink: 1,
  },
  // Ne prend que la hauteur de la carte (centrage), rétrécit et défile seulement si elle dépasse
  modalScroll: {
    flexGrow: 0,
    flexShrink: 1,
  },
  closeWrap: {
    marginTop: 6,
  },
  closeBtn: {
    height: 51,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#a15c03',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#a15c03',
    shadowOffset: { width: -1, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  closeText: {
    fontFamily: fonts.displayMedium,
    fontSize: 20,
    color: colors.cream,
  },
});
