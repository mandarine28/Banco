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
];
