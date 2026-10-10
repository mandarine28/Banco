import { questionsMarques } from './questions/marques';
import { questionsDisvertissement } from './questions/divertissement';
import { questionsGeographie } from './questions/geographie';
import { questionsCultureG } from './questions/cultureg';
import { questionsCinema } from './questions/cinema';
import { questionsSport } from './questions/sport';

export const questions = [
  ...questionsMarques,
  ...questionsDisvertissement,
  ...questionsGeographie,
  ...questionsCultureG,
  ...questionsCinema,
  ...questionsSport,
];
