import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { canPass, currentQuestion, type GameState, MAX_BID, minimumBid } from '@/game/engine';
import { colors, fonts } from '@/theme';

type Props = {
  state: GameState;
  onBid: (amount: number) => void;
  onPass: () => void;
};

export function AuctionPhase({ state, onBid, onPass }: Props) {
  const insets = useSafeAreaInsets();
  const { auction } = state;
  const bidder = state.teams[auction.current];
  const min = minimumBid(state);
  const [chosen, setChosen] = useState(min);
  const amount = Math.max(chosen, min);
  const passAllowed = canPass(state);
  const rawSubject = currentQuestion(state).subject;
  const subject = rawSubject.charAt(0).toUpperCase() + rawSubject.slice(1).toLowerCase();

  return (
    <View style={styles.wrapper}>
      {/* Zone bleue — round + badge équipe + carte question + instruction */}
      <View style={styles.blueZone}>
        <Text style={styles.roundLabel}>
          Round {state.round + 1}/{state.roundCount}
        </Text>

        <View style={styles.teamBadge}>
          <Text style={styles.teamBadgeText} numberOfLines={1}>
            {bidder.name}
          </Text>
        </View>

        <View style={styles.questionCard}>
          <Text style={styles.questionText}>{subject}</Text>
        </View>

        <Text style={styles.instruction}>
          Combien de réponses pouvez-vous citer en 60 secondes ?
        </Text>
      </View>

      {/* Panel crème — qui ouvre + stepper + boutons */}
      <View style={[styles.creamPanel, { paddingBottom: Math.max(insets.bottom + 30, 48) }]}>
        <View style={styles.opensRow}>
          <View style={styles.teamIdentifier}>
            <View style={[styles.teamDot, { backgroundColor: bidder.color }]} />
            <Text style={styles.teamNameText} numberOfLines={1}>
              {bidder.name}
            </Text>
          </View>
          <Text style={styles.opensText}>
            {auction.highest ? 'surenchérit ou passe' : 'ouvre les enchères'}
          </Text>
        </View>

        <View style={styles.stepperRow}>
          <Pressable
            onPress={() => setChosen(Math.max(min, amount - 1))}
            hitSlop={16}
            accessibilityRole="button"
            accessibilityLabel="Diminuer la mise"
          >
            <Text style={styles.stepBtn}>-</Text>
          </Pressable>

          <View style={styles.bidBadge}>
            <Text style={styles.bidValue}>{amount}</Text>
          </View>

          <Pressable
            onPress={() => setChosen(Math.min(MAX_BID, amount + 1))}
            hitSlop={16}
            accessibilityRole="button"
            accessibilityLabel="Augmenter la mise"
          >
            <Text style={styles.stepBtn}>+</Text>
          </Pressable>
        </View>

        <View style={styles.btnStack}>
          <Pressable
            onPress={() => onBid(amount)}
            accessibilityRole="button"
            accessibilityLabel={`Miser ${amount}`}
            style={styles.btnMiserWrap}
          >
            <LinearGradient
              colors={['#fb940e', '#f2c512']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.btnInner}
            >
              <Text style={styles.btnMiserText}>MISER {amount}</Text>
            </LinearGradient>
          </Pressable>

          <Pressable
            onPress={onPass}
            accessibilityRole="button"
            accessibilityLabel="Passer"
            style={[styles.btnPasserWrap, !passAllowed && styles.hidden]}
            pointerEvents={passAllowed ? 'auto' : 'none'}
          >
            <View style={styles.btnPasserInner}>
              <Text style={styles.btnPasserText}>PASSER</Text>
            </View>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  blueZone: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    gap: 24,
    alignItems: 'center',
  },
  roundLabel: {
    fontFamily: fonts.displayMedium,
    fontSize: 16,
    color: colors.cream,
  },
  teamBadge: {
    backgroundColor: colors.pink,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    maxWidth: '80%',
  },
  teamBadgeText: {
    fontFamily: fonts.displayMedium,
    fontSize: 20,
    color: colors.cream,
  },
  questionCard: {
    backgroundColor: colors.cream,
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 20,
    width: '100%',
  },
  questionText: {
    fontFamily: fonts.display,
    fontSize: 34,
    lineHeight: 39,
    color: colors.purpleDeep,
  },
  instruction: {
    fontFamily: fonts.displayMedium,
    fontSize: 20,
    color: colors.cream,
    textAlign: 'center',
    lineHeight: 26,
  },

  creamPanel: {
    backgroundColor: colors.cream,
    borderTopLeftRadius: 48,
    borderTopRightRadius: 48,
    paddingTop: 40,
    paddingHorizontal: 24,
    gap: 24,
    alignItems: 'center',
  },
  opensRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
    width: '100%',
  },
  teamIdentifier: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  teamDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  teamNameText: {
    fontFamily: fonts.displayMedium,
    fontSize: 20,
    color: colors.purple,
  },
  opensText: {
    fontFamily: fonts.displayMedium,
    fontSize: 20,
    color: colors.purpleDeep,
  },

  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  stepBtn: {
    fontFamily: fonts.displayMedium,
    fontSize: 40,
    color: colors.pink,
    width: 32,
    textAlign: 'center',
    lineHeight: 50,
  },
  bidBadge: {
    backgroundColor: colors.purpleDeep,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    minWidth: 55,
    alignItems: 'center',
  },
  bidValue: {
    fontFamily: fonts.displayMedium,
    fontSize: 40,
    color: colors.cream,
    lineHeight: 50,
  },

  btnStack: {
    width: '100%',
    gap: 16,
  },
  btnMiserWrap: {
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
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 51,
  },
  btnMiserText: {
    fontFamily: fonts.display,
    fontSize: 24,
    color: colors.cream,
  },
  btnPasserWrap: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#a15c03',
    shadowColor: '#a15c03',
    shadowOffset: { width: -1, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  btnPasserInner: {
    backgroundColor: '#fffbf5',
    borderRadius: 14,
    paddingHorizontal: 24,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 51,
  },
  btnPasserText: {
    fontFamily: fonts.display,
    fontSize: 24,
    color: colors.purpleDeep,
  },
  hidden: {
    opacity: 0,
  },
});
