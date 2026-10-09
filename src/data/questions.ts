import { questionsMarques } from './questions/marques';
import { questionsDisvertissement } from './questions/divertissement';
import { questionsGeographie } from './questions/geographie';
import { questionsCultureG } from './questions/cultureg';

export const questions = [
  ...questionsMarques,
  ...questionsDisvertissement,
  ...questionsGeographie,
  ...questionsCultureG,
];
