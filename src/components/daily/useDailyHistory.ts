import { useEffect, useState } from 'react';

import { getAnswers } from '@/game/answers';
import { daysInclusive } from '@/lib/calendar';
import { dailyQuestion } from '@/lib/dailyQuestion';
import type { Lang } from '@/lib/i18n';
import { loadInstallDate } from '@/lib/installDate';
import { type DailyRecord, dayKey, nextStreak } from '@/lib/solo';
import { type DailyHistoryEntry, loadDailyHistory, loadDailyRecord } from '@/lib/soloStorage';

export const scoreOf = (entry: DailyHistoryEntry) => entry.score ?? entry.found.length;

/** Défis joués (avec celui connu seulement par la série), série en cours, meilleur score, et jours où un défi était possible. */
export function useDailyHistory(lang: Lang) {
  const [savedHistory, setHistory] = useState<DailyHistoryEntry[]>([]);
  const [record, setRecord] = useState<DailyRecord | null>(null);
  const [installDate, setInstallDate] = useState<string | null>(null);
  useEffect(() => {
    loadDailyHistory().then(setHistory);
    loadDailyRecord().then(setRecord);
    loadInstallDate().then(setInstallDate);
  }, []);

  const today = dayKey(new Date());
  // Série encore vivante si le dernier défi date d'aujourd'hui ou d'hier
  const streakAlive = record !== null && (record.day === today || nextStreak(record, today) > 1);
  // Défi joué avant l'historique : connu seulement par la série, sa question se retrouve à partir de la date
  const missing = record !== null && !savedHistory.some((entry) => entry.day === record.day);
  const recovered = missing ? dailyQuestion(record.day) : null;
  const history: DailyHistoryEntry[] = record && recovered
    ? [{ day: record.day, questionId: recovered.id, found: [], total: getAnswers(recovered, lang).length, score: record.score }, ...savedHistory]
    : savedHistory;

  // Premier jour possible : l'installation, ou un défi plus ancien (joué avant la mise à jour qui note cette date)
  const firstDay = [installDate ?? today, ...history.map((entry) => entry.day)].reduce((min, day) => (day < min ? day : min));

  return {
    today,
    history,
    firstDay,
    possible: daysInclusive(firstDay, today),
    streak: streakAlive ? record.streak : 0,
    best: history.reduce((max, entry) => Math.max(max, scoreOf(entry)), 0),
  };
}
