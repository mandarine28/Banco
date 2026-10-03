import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native';

import { Card } from '@/components/Card';
import { normalize, searchAnswers, suggestions } from '@/game/answers';
import { contract, currentPrompt, currentQuestion, type GameState, remaining } from '@/game/engine';
import { searchWikipedia, type WikiResult } from '@/services/wikipedia';
import { colors, fonts } from '@/theme';

type Props = {
  state: GameState;
  onToggle: (label: string) => void;
  onAdjust: (delta: 1 | -1) => void;
  /** Lance une recherche web (le chrono est mis en pause par l'écran de partie). */
  onWebSearch: (query: string) => void;
};

const MAX_WIDTH = 500;
const SIDE_PADDING = 14;
const GAP = 8;

type WikiState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'done'; result: WikiResult | null }
  | { status: 'error' };

export function PlayPhase({ state, onToggle, onAdjust, onWebSearch }: Props) {
  const { width } = useWindowDimensions();
  const question = currentQuestion(state);
  const { amount } = contract(state);
  const team = state.teams[contract(state).team];
  const left = remaining(state);
  const [query, setQuery] = useState('');
  const [wiki, setWiki] = useState<WikiState>({ status: 'idle' });

  const chipWidth = (Math.min(width, MAX_WIDTH) - SIDE_PADDING * 2 - GAP * 2) / 3;
  const searching = normalize(query).length > 0;
  const list = searching ? searchAnswers(question, query) : suggestions(question, state.found);

  const updateQuery = (text: string) => {
    setQuery(text);
    setWiki({ status: 'idle' });
  };

  const toggle = (label: string) => {
    onToggle(label);
    if (searching) updateQuery('');
  };

  // Recherche web avec le thème de la question pour cibler les résultats.
  const context = question.subject;
  const searchWeb = () => onWebSearch(`${query.trim()} ${context}`);

  const checkWikipedia = async () => {
    setWiki({ status: 'loading' });
    try {
      setWiki({ status: 'done', result: await searchWikipedia(query.trim(), context) });
    } catch {
      setWiki({ status: 'error' });
    }
  };

  return (
    <>
      <Card style={styles.counterCard}>
        <View style={styles.counter}>
          <CounterButton
            icon="minus"
            label="Une bonne réponse : retirer 1"
            onPress={() => onAdjust(1)}
            color={team.color}
          />
          <Text style={[styles.count, { color: team.color }]} accessibilityLabel={`${left} réponses restantes sur ${amount}`}>
            {left}
          </Text>
          <CounterButton
            icon="plus"
            label="Corriger : ajouter 1"
            onPress={() => onAdjust(-1)}
            disabled={left >= amount}
            color={team.color}
          />
        </View>
        <Text style={styles.counterCaption}>
          RÉPONSE{left > 1 ? 'S' : ''} À TROUVER SUR {amount}
        </Text>
      </Card>

      <Card style={styles.questionCard}>
        <Text style={styles.prompt}>{currentPrompt(state)}</Text>
      </Card>

      <View style={styles.search}>
        <MaterialCommunityIcons name="magnify" size={22} color={colors.purple} />
        <TextInput
          value={query}
          onChangeText={updateQuery}
          placeholder="Vérifier une réponse…"
          placeholderTextColor={colors.muted}
          autoCorrect={false}
          autoCapitalize="characters"
          returnKeyType="search"
          accessibilityLabel="Rechercher une réponse"
          style={styles.searchInput}
        />
        {query ? (
          <>
            <Pressable onPress={() => updateQuery('')} accessibilityRole="button" accessibilityLabel="Effacer" hitSlop={8}>
              <MaterialCommunityIcons name="close-circle" size={20} color={colors.muted} />
            </Pressable>
            <Pressable
              onPress={searchWeb}
              accessibilityRole="button"
              accessibilityLabel="Chercher sur Google (met le chrono en pause)"
              hitSlop={8}
              style={styles.webButton}
            >
              <MaterialCommunityIcons name="google" size={18} color={colors.white} />
            </Pressable>
          </>
        ) : null}
      </View>

      {searching && list.length === 0 ? (
        <Card style={styles.missing}>
          <Text style={styles.missingText}>« {query.trim().toUpperCase()} » n’est pas dans la base.</Text>
          <View style={styles.missingActions}>
            <ActionChip label="VALIDER QUAND MÊME" tone="teal" onPress={() => toggle(query.trim().toUpperCase())} />
            <ActionChip label="CHERCHER SUR GOOGLE" tone="purple" onPress={searchWeb} />
            <ActionChip label="WIKIPÉDIA" tone="purple" onPress={checkWikipedia} />
          </View>
          {wiki.status === 'loading' ? <ActivityIndicator color={colors.purple} /> : null}
          {wiki.status === 'error' ? (
            <Text style={styles.wikiNote}>Recherche web indisponible : vérifiez la connexion.</Text>
          ) : null}
          {wiki.status === 'done' ? (
            wiki.result ? (
              <View style={styles.wiki}>
                <Text style={styles.wikiTitle}>{wiki.result.title}</Text>
                <Text style={styles.wikiExtract}>{wiki.result.extract}…</Text>
                <Text style={styles.wikiNote}>Source : Wikipédia. À vous de juger si la réponse est valable.</Text>
              </View>
            ) : (
              <Text style={styles.wikiNote}>Aucun article Wikipédia trouvé.</Text>
            )
          ) : null}
        </Card>
      ) : null}

      <View style={styles.grid}>
        {list.map((label) => {
          const found = state.found.includes(label);
          return (
            <Pressable
              key={label}
              onPress={() => toggle(label)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: found }}
              accessibilityLabel={label}
              style={({ pressed }) => [
                styles.chip,
                { width: chipWidth },
                found && styles.chipFound,
                pressed && styles.chipPressed,
              ]}
            >
              <Text style={[styles.chipLabel, found && styles.chipLabelFound]} numberOfLines={2}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </>
  );
}

type CounterButtonProps = {
  icon: 'minus' | 'plus';
  label: string;
  onPress: () => void;
  color: string;
  disabled?: boolean;
};

function CounterButton({ icon, label, onPress, color, disabled = false }: CounterButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={8}
      style={({ pressed }) => [
        styles.counterButton,
        { borderColor: disabled ? colors.muted : color },
        pressed && styles.chipPressed,
      ]}
    >
      <MaterialCommunityIcons name={icon} size={34} color={disabled ? colors.muted : color} />
    </Pressable>
  );
}

function ActionChip({ label, tone, onPress }: { label: string; tone: 'teal' | 'purple'; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.action,
        { backgroundColor: tone === 'teal' ? colors.tealDark : colors.purple },
        pressed && styles.chipPressed,
      ]}
    >
      <Text style={styles.actionLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  counterCard: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  counter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 28,
  },
  counterButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  count: {
    minWidth: 70,
    textAlign: 'center',
    fontFamily: fonts.display,
    fontSize: 72,
    lineHeight: 84,
  },
  counterCaption: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 12,
    letterSpacing: 1,
  },
  questionCard: {
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  prompt: {
    color: colors.black,
    fontFamily: fonts.body,
    fontSize: 19,
    textAlign: 'center',
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 48,
    paddingLeft: 16,
    paddingRight: 8,
    borderRadius: 24,
    backgroundColor: colors.white,
    borderWidth: 3,
    borderColor: colors.lavender,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    outlineWidth: 0,
    color: colors.black,
    fontFamily: fonts.body,
    fontSize: 16,
  },
  webButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.purple,
  },
  missing: {
    gap: 12,
    padding: 16,
  },
  missingText: {
    color: colors.black,
    fontFamily: fonts.body,
    fontSize: 15,
    textAlign: 'center',
  },
  missingActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  action: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
  },
  actionLabel: {
    color: colors.white,
    fontFamily: fonts.display,
    fontSize: 14,
  },
  wiki: {
    gap: 4,
  },
  wikiTitle: {
    color: colors.purple,
    fontFamily: fonts.display,
    fontSize: 18,
  },
  wikiExtract: {
    color: colors.black,
    fontFamily: fonts.bodyRegular,
    fontSize: 14,
    lineHeight: 20,
  },
  wikiNote: {
    color: colors.muted,
    fontFamily: fonts.bodyRegular,
    fontSize: 12,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GAP,
  },
  chip: {
    minHeight: 40,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  chipFound: {
    backgroundColor: colors.tealDark,
  },
  chipPressed: {
    opacity: 0.7,
  },
  chipLabel: {
    color: colors.black,
    fontFamily: fonts.body,
    fontSize: 12,
    textAlign: 'center',
  },
  chipLabelFound: {
    color: colors.white,
  },
});
