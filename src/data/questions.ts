import { questionsMarques } from './questions/marques';
import { questionsDisvertissement } from './questions/divertissement';
import { questionsGeographie } from './questions/geographie';
import { questionsCultureG } from './questions/cultureg';
import { questionsCinema } from './questions/cinema';

export const questions = [
  ...questionsMarques,
  ...questionsDisvertissement,
  ...questionsGeographie,
  ...questionsCultureG,
  ...questionsCinema,
];
