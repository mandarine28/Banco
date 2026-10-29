import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

import { SURVIE_TURBO } from '@/game/survie-engine';
import { colors, fonts } from '@/theme';

const FIXED_EXAMPLE = [10, 20, 30];
// Premiers tours puis plancher : null = ligne « … »
const TURBO_EXAMPLE = [
  SURVIE_TURBO.start,
  SURVIE_TURBO.start - SURVIE_TURBO.step,
  SURVIE_TURBO.start - 2 * SURVIE_TURBO.step,
  null,
  SURVIE_TURBO.min,
];

/** Mini barre de chrono façon partie : longueur proportionnelle au temps du tour. */
function Bar({ seconds, max, turbo }: { seconds: number; max: number; turbo?: boolean }) {
  const width = `${(seconds / max) * 100}%` as const;
  return (
    <View style={styles.barRow}>
      <View style={styles.track}>
        {turbo ? (
          <LinearGradient colors={['#fb940e', '#f2c512']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[styles.fill, { width }]} />
        ) : (
          <View style={[styles.fill, styles.fixedFill, { width }]} />
        )}
      </View>
      <Text style={styles.seconds}>{seconds} s</Text>
    </View>
  );
}

type Props = { fixedCaption: string; turboCaption: string };

/** Explication visuelle du chrono de survie : durées fixes contre Turbo. */
export function TimerInfoIllustration({ fixedCaption, turboCaption }: Props) {
  return (
    <View style={styles.wrap}>
      <View>
        <View style={[styles.tag, styles.tagFixed]}>
          <Text style={styles.tagText}>10 · 20 · 30 s</Text>
        </View>
        <View style={styles.body}>
          <View style={styles.bars}>
            {FIXED_EXAMPLE.map((seconds, i) => (
              <Bar key={i} seconds={seconds} max={seconds} />
            ))}
          </View>
          <Text style={styles.caption}>{fixedCaption}</Text>
        </View>
      </View>
      <View>
        <View style={[styles.tag, styles.tagTurbo]}>
          <MaterialCommunityIcons name="lightning-bolt" size={20} color={colors.cream} />
          <Text style={styles.tagText}>Turbo</Text>
        </View>
        <View style={styles.body}>
          <View style={styles.bars}>
            {TURBO_EXAMPLE.map((seconds, i) =>
              seconds === null ? (
                <Text key={i} style={styles.ellipsis}>…</Text>
              ) : (
                <Bar key={i} seconds={seconds} max={SURVIE_TURBO.start} turbo />
              ),
            )}
          </View>
          <Text style={styles.caption}>{turboCaption}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    gap: 32,
  },
  // Étiquette légèrement penchée, à cheval sur le haut du bloc : casse l'alignement trop sage
  tag: {
    zIndex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: -14,
    paddingHorizontal: 12,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 2,
    shadowOffset: { width: -1, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  tagFixed: {
    alignSelf: 'flex-start',
    marginLeft: 8,
    transform: [{ rotate: '-4deg' }],
    backgroundColor: colors.purple,
    borderColor: colors.purpleDeep,
    shadowColor: colors.purpleDeep,
  },
  tagTurbo: {
    alignSelf: 'flex-end',
    marginRight: 8,
    transform: [{ rotate: '3deg' }],
    backgroundColor: colors.pink,
    borderColor: '#a15c03',
    shadowColor: '#a15c03',
  },
  tagText: {
    fontFamily: fonts.display,
    fontSize: 18,
    color: colors.cream,
  },
  // Illustration à gauche, légende à droite, sur un fond teinté
  body: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    paddingTop: 26,
    paddingBottom: 16,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: 'rgba(12,45,100,0.08)',
  },
  bars: {
    width: '50%',
    gap: 6,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  track: {
    flex: 1,
    height: 12,
    borderRadius: 60,
    backgroundColor: colors.white,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 60,
  },
  fixedFill: {
    backgroundColor: colors.purple,
  },
  seconds: {
    width: 40,
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.purpleDeep,
    textAlign: 'right',
  },
  ellipsis: {
    fontFamily: fonts.display,
    fontSize: 15,
    lineHeight: 12,
    color: colors.purpleDeep,
    textAlign: 'center',
  },
  caption: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 18,
    lineHeight: 22,
    color: colors.purpleDeep,
    textAlign: 'left',
  },
});
