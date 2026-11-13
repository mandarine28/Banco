import { APP_STORE_ID } from './appUpdate.ts';

type Row = { team: { name: string }; score: number; rank: number };
type Texts = { shareWin: (team: string) => string; shareTie: string; shareInvite: string };

// Lien web : s'ouvre chez un ami qui n'a pas l'app, contrairement au lien itms-apps de la mise à jour
export const PUBLIC_STORE_URL = `https://apps.apple.com/app/id${APP_STORE_ID}`;

/** Texte envoyé par la feuille de partage : vainqueur, classement, lien de l'app. */
export function buildShareMessage(rows: readonly Row[], texts: Texts): string {
  const winners = rows.filter((row) => row.rank === 1);
  const title = winners.length === 1 ? texts.shareWin(winners[0].team.name) : texts.shareTie;
  const lines = rows.map((row) => `${row.rank}. ${row.team.name} — ${row.score}`);
  return [title, '', ...lines, '', `${texts.shareInvite} ${PUBLIC_STORE_URL}`].join('\n');
}
