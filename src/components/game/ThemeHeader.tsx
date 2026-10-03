import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { themeById } from '@/data/themes';
import { currentQuestion, type GameState } from '@/game/engine';
import { colors, fonts } from '@/theme';

/** Numéro de round et thème annoncé (la question reste cachée jusqu'au chrono). */
export function ThemeHeader({ state }: { state: GameState }) {
  const theme = themeById(currentQuestion(state).theme);

  return (
    <View style={styles.container}>
      <Text style={styles.round}>
        ROUND {state.round + 1}/{state.roundCount}
      </Text>
      <View style={styles.theme}>
        {theme ? (
          <MaterialCommunityIcons
            name={theme.icon as keyof typeof MaterialCommunityIcons.glyphMap}
            size={40}
            color={colors.orange}
          />
        ) : null}
        <Text style={styles.label} numberOfLines={1} accessibilityLabel={`Thème : ${theme?.label ?? ''}`}>
          {(theme?.label ?? currentQuestion(state).theme).toUpperCase()}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 6,
  },
  round: {
    color: colors.purple,
    fontFamily: fonts.display,
    fontSize: 20,
  },
  theme: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  label: {
    flexShrink: 1,
    color: colors.black,
    fontFamily: fonts.display,
    fontSize: 36,
  },
});
