import { questionsMarques } from './questions/marques';
import { questionsDisvertissement } from './questions/divertissement';
import { questionsGeographie } from './questions/geographie';
import { questionsCultureG } from './questions/cultureg';
import { questionsCinema } from './questions/cinema';
import { questionsSport } from './questions/sport';
import { questionsMusique } from './questions/musique';
import { questionsHarryPotter } from './questions/harry-potter';
import { questionsRapFrancais } from './questions/rap-francais';
import { questionsDresseur } from './questions/dresseur';
import { questionsArt } from './questions/art-litterature';
import { questionsRetro } from './questions/retro-gaming';
import { questionsAnime } from './questions/anime';
import { questionsFootball } from './questions/football';
import { questionsDessinsAnimes } from './questions/dessins-animes';
import { questionsJeuxVideo } from './questions/jeux-video';
import type { Lang } from '../lib/i18n';
import type { Question } from './types';

export const questions = [
  ...questionsMarques,
  ...questionsDisvertissement,
  ...questionsGeographie,
  ...questionsCultureG,
  ...questionsCinema,
  ...questionsSport,
  ...questionsMusique,
  ...questionsHarryPotter,
  ...questionsRapFrancais,
  ...questionsDresseur,
  ...questionsArt,
  ...questionsRetro,
  ...questionsAnime,
  ...questionsFootball,
  ...questionsDessinsAnimes,
  ...questionsJeuxVideo,
];

/** Questions jouables dans cette langue, limitées aux thèmes choisis (aucun thème choisi : tous). */
export const questionsFor = (lang: Lang, themes: readonly string[], pool: readonly Question[] = questions): Question[] =>
  pool.filter((q) => (!q.onlyLangs || q.onlyLangs.includes(lang)) && (themes.length === 0 || themes.includes(q.theme)));
