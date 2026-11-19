import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Animated, PanResponder, StyleSheet, Text, View } from 'react-native';

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { ExpandIcon } from '@/components/ExpandIcon';
import { Pressable } from '@/components/Pressable';
import { monthGrid, recentWeeks, shiftDay, shiftMonth } from '@/lib/calendar';
import type { DailyHistoryEntry } from '@/lib/soloStorage';
import { colors, fonts } from '@/theme';

import { usePageScrollLock } from './DailyPage';
import { MonthPicker } from './MonthPicker';
import { scoreOf } from './useDailyHistory';

// 1er janvier 2024 : un lundi, pour écrire les initiales des jours dans la langue du joueur
const MONDAY = new Date(2024, 0, 1);
// Vue par défaut, plus épurée qu'un mois entier
const RECENT_WEEKS = 2;
// Toujours 6 lignes en vue mois : la zone garde la même hauteur d'un mois à l'autre
const MONTH_ROWS = 6;
// Glissé (px) au-delà duquel le calendrier prend le geste ; part de la zone à franchir pour changer de période
const SWIPE_CAPTURE = 6;
const SWIPE_COMMIT = 0.25;
const SWIPE_VELOCITY = 0.5;
// Vers une période future (rien à voir) : le calendrier résiste au lieu de suivre le doigt
const FUTURE_RESISTANCE = 0.25;
const SLIDE_MS = 220;
const monthOf = (day: string) => ({ year: Number(day.slice(0, 4)), month: Number(day.slice(5, 7)) - 1 });

type Weeks = (string | null)[][];
type Axis = 'x' | 'y';

type Props = {
  entries: DailyHistoryEntry[];
  locale: string;
  today: string;
  /** Premier jour où un défi était possible (installation) : les jours d'avant sont estompés. */
  firstDay: string;
  selectedDay: string | null;
  onSelectDay: (day: string) => void;
  labels: { prev: string; next: string; monthView: string; weeksView: string; pickMonth: string; close: string };
};

/**
 * Deux dernières semaines (ou mois entier via l'icône agrandir), comme l'agenda d'Apple : pastille sous chaque jour joué,
 * aujourd'hui en rond plein ; un glissé (haut/bas ou gauche/droite) fait défiler la période voisine sous le doigt.
 */
export function DailyCalendar({ entries, locale, today, firstDay, selectedDay, onSelectDay, labels }: Props) {
  // Doigt posé sur le calendrier : la page ne défile pas en même temps
  const lockPageScroll = usePageScrollLock();
  const [showMonth, setShowMonth] = useState(false);
  const [view, setView] = useState(() => monthOf(today));
  // Vue semaines : dernier jour de la période montrée, décalé de 2 semaines par glissé
  const [anchor, setAnchor] = useState(today);
  const [width, setWidth] = useState(0);
  const [picking, setPicking] = useState(false);
  const [drag] = useState(() => new Animated.ValueXY());

  const byDay = new Map(entries.map((entry) => [entry.day, entry]));
  const weekdays = Array.from({ length: 7 }, (_, i) =>
    new Date(MONDAY.getFullYear(), 0, 1 + i).toLocaleDateString(locale, { weekday: 'narrow' }),
  );
  const periodAt = (offset: number): Weeks => {
    if (!showMonth) return recentWeeks(shiftDay(anchor, offset * 7 * RECENT_WEEKS), RECENT_WEEKS);
    const { year, month } = shiftMonth(view.year, view.month, offset);
    const grid: Weeks = monthGrid(year, month);
    return [...grid, ...Array.from({ length: MONTH_ROWS - grid.length }, () => Array<null>(7).fill(null))];
  };
  const rows = showMonth ? MONTH_ROWS : RECENT_WEEKS;
  const height = rows * ROW + (rows - 1) * ROW_GAP;
  const titleDate = showMonth ? new Date(view.year, view.month, 1) : new Date(`${anchor}T12:00:00`);
  const monthTitle = titleDate.toLocaleDateString(locale, { month: 'long', year: 'numeric' });
  const current = monthOf(today);
  // Pas d'avance au-delà de la période d'aujourd'hui : il n'y a encore rien à voir
  const atPresent = showMonth ? view.year === current.year && view.month === current.month : anchor >= today;
  const move = (delta: -1 | 1) => {
    if (delta > 0 && atPresent) return;
    if (showMonth) setView((v) => shiftMonth(v.year, v.month, delta));
    else setAnchor((a) => shiftDay(a, delta * 7 * RECENT_WEEKS));
  };
  const toggleView = () => {
    // Chaque vue repart d'aujourd'hui
    setView(current);
    setAnchor(today);
    setShowMonth((value) => !value);
  };
  // Mois choisi dans la liste : on passe en vue mois dessus
  const pickMonth = (value: { year: number; month: number }) => {
    setView(value);
    setShowMonth(true);
    setPicking(false);
  };

  // Valeurs lues par le geste (créé une seule fois pour ne pas le perdre en plein glissé)
  const live = useRef({ move, atPresent, width, height });
  useEffect(() => {
    live.current = { move, atPresent, width, height };
  });
  // Nouvelle période affichée : on la recentre avant l'affichage, sans à-coup
  useLayoutEffect(() => {
    drag.setValue({ x: 0, y: 0 });
  }, [drag, anchor, view, showMonth]);

  // eslint-disable-next-line react-hooks/refs -- live n'est lu que dans les rappels du geste, jamais au rendu
  const [pan] = useState(() => {
    let axis: Axis | null = null;
    const offsetOf = (dx: number, dy: number) => {
      const value = axis === 'x' ? dx : dy;
      return value < 0 && live.current.atPresent ? value * FUTURE_RESISTANCE : value;
    };
    const settle = (to: number, after?: () => void) => {
      Animated.timing(axis === 'x' ? drag.x : drag.y, { toValue: to, duration: SLIDE_MS, useNativeDriver: true }).start(after);
    };
    return PanResponder.create({
      onMoveShouldSetPanResponderCapture: (_, g) => Math.abs(g.dx) > SWIPE_CAPTURE || Math.abs(g.dy) > SWIPE_CAPTURE,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: (_, g) => {
        axis = Math.abs(g.dx) > Math.abs(g.dy) ? 'x' : 'y';
      },
      onPanResponderMove: (_, g) => {
        const value = offsetOf(g.dx, g.dy);
        drag.setValue(axis === 'x' ? { x: value, y: 0 } : { x: 0, y: value });
      },
      onPanResponderRelease: (_, g) => {
        const { width: w, height: h, atPresent: blocked, move: go } = live.current;
        const size = axis === 'x' ? w : h;
        const value = offsetOf(g.dx, g.dy);
        const velocity = axis === 'x' ? g.vx : g.vy;
        // Vers le haut ou vers la gauche : période suivante, comme l'agenda d'Apple
        const step: -1 | 1 = value < 0 ? 1 : -1;
        const passed = Math.abs(value) > size * SWIPE_COMMIT || Math.abs(velocity) > SWIPE_VELOCITY;
        if (!passed || (step > 0 && blocked)) return settle(0);
        settle(-step * size, () => go(step));
      },
      onPanResponderTerminate: () => settle(0),
    });
  });

  const renderWeeks = (weeks: Weeks) =>
    weeks.map((week, w) => (
      <View key={w} style={styles.row}>
        {week.map((day, i) => {
          if (!day) return <View key={i} style={styles.cell} />;
          const entry = byDay.get(day);
          const isToday = day === today;
          const isSelected = selectedDay === day;
          const number = (
            <>
              <View style={[styles.number, isToday && styles.numberToday, isSelected && styles.numberSelected, day < firstDay && styles.beforeInstall]}>
                <Text style={[styles.dayText, isToday && styles.dayTextToday]}>{Number(day.slice(8, 10))}</Text>
              </View>
              {/* Pastille sous le numéro : un défi a été joué ce jour-là */}
              <View style={[styles.dot, entry ? styles.dotPlayed : null]} />
            </>
          );
          if (!entry) return <View key={day} style={styles.cell}>{number}</View>;
          return (
            <Pressable
              key={day}
              onPress={() => onSelectDay(day)}
              accessibilityRole="button"
              accessibilityLabel={`${new Date(`${day}T12:00:00`).toLocaleDateString(locale, { day: 'numeric', month: 'long' })}, ${scoreOf(entry)}`}
              accessibilityState={{ selected: isSelected }}
              style={styles.cell}
            >
              {number}
            </Pressable>
          );
        })}
      </View>
    ));

  // Période voisine posée de chaque côté, sur les deux axes : elle apparaît sous le doigt quel que soit le sens du glissé
  const neighbours = [
    { offset: -1, style: { left: -width } },
    { offset: 1, style: { left: width } },
    { offset: -1, style: { top: -height } },
    { offset: 1, style: { top: height } },
  ];

  return (
    // Toute la zone du calendrier : tant qu'un doigt y est posé, la page ne défile pas
    <View
      style={styles.card}
      onTouchStart={() => lockPageScroll(true)}
      onTouchEnd={() => lockPageScroll(false)}
      onTouchCancel={() => lockPageScroll(false)}
      {...pan.panHandlers}
    >
      <View style={styles.header}>
        {/* Toucher le mois ouvre le choix du mois et de l'année */}
        <Pressable onPress={() => setPicking(true)} accessibilityRole="button" accessibilityLabel={`${monthTitle}, ${labels.pickMonth}`} hitSlop={8} style={styles.titleBtn}>
          <Text style={styles.month}>{monthTitle.charAt(0).toUpperCase() + monthTitle.slice(1)}</Text>
          <MaterialCommunityIcons name="chevron-down" size={22} color={colors.cream} />
        </Pressable>
        {/* Même icône que l'agrandissement de la liste des réponses en jeu */}
        <Pressable
          onPress={toggleView}
          accessibilityRole="button"
          accessibilityLabel={showMonth ? labels.weeksView : labels.monthView}
          hitSlop={10}
          style={styles.viewToggle}
        >
          <ExpandIcon collapse={showMonth} color={colors.cream} size={22} />
        </Pressable>
      </View>
      <View style={styles.row}>
        {weekdays.map((label, i) => (
          <Text key={i} style={styles.weekday}>{label.toUpperCase()}</Text>
        ))}
      </View>
      <View
        accessible
        accessibilityRole="adjustable"
        accessibilityLabel={monthTitle}
        accessibilityActions={[{ name: 'increment', label: labels.next }, { name: 'decrement', label: labels.prev }]}
        onAccessibilityAction={(e) => move(e.nativeEvent.actionName === 'increment' ? 1 : -1)}
        onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
        style={[styles.viewport, { height }]}
      >
        <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ translateX: drag.x }, { translateY: drag.y }] }]}>
          <View style={styles.grid}>{renderWeeks(periodAt(0))}</View>
          {width > 0
            ? neighbours.map(({ offset, style }, i) => (
                <View key={i} style={[styles.grid, styles.neighbour, style]} pointerEvents="none">
                  {renderWeeks(periodAt(offset))}
                </View>
              ))
            : null}
        </Animated.View>
      </View>
      {picking ? (
        <MonthPicker
          value={showMonth ? view : monthOf(anchor)}
          latest={current}
          locale={locale}
          labels={{ title: labels.pickMonth, prev: labels.prev, next: labels.next, close: labels.close }}
          onPick={pickMonth}
          onClose={() => setPicking(false)}
        />
      ) : null}
    </View>
  );
}

const NUMBER = 34;
const DOT = 6;
const DOT_GAP = 3;
const CELL = 40;
const ROW = NUMBER + DOT_GAP + DOT;
const ROW_GAP = 6;

const styles = StyleSheet.create({
  card: {
    gap: 6,
    paddingVertical: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  viewToggle: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexShrink: 1,
  },
  month: {
    flexShrink: 1,
    fontFamily: fonts.display,
    fontSize: 20,
    color: colors.cream,
  },
  // Fenêtre fixe : la période voisine glisse dedans, le reste est masqué
  viewport: {
    overflow: 'hidden',
  },
  grid: {
    gap: ROW_GAP,
  },
  neighbour: {
    position: 'absolute',
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  weekday: {
    width: CELL,
    textAlign: 'center',
    fontFamily: fonts.displayMedium,
    fontSize: 13,
    color: colors.cream,
    opacity: 0.6,
  },
  cell: {
    width: CELL,
    height: ROW,
    alignItems: 'center',
    gap: DOT_GAP,
  },
  number: {
    width: NUMBER,
    height: NUMBER,
    borderRadius: NUMBER / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Seul aujourd'hui a un fond plein, comme l'agenda d'Apple
  numberToday: {
    backgroundColor: colors.yellow,
  },
  numberSelected: {
    borderWidth: 2,
    borderColor: colors.cream,
  },
  // Avant l'installation : aucun défi n'était possible
  beforeInstall: {
    opacity: 0.35,
  },
  dayText: {
    fontFamily: fonts.displayMedium,
    fontSize: 16,
    color: colors.cream,
  },
  dayTextToday: {
    fontFamily: fonts.display,
    color: colors.purpleDeep,
  },
  // Place réservée même sans défi : les lignes gardent toutes la même hauteur
  dot: {
    width: DOT,
    height: DOT,
    borderRadius: DOT / 2,
  },
  dotPlayed: {
    backgroundColor: colors.cream,
  },
});
