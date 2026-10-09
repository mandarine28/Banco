import { questionsMarques } from './questions/marques';
import { questionsDisvertissement } from './questions/divertissement';
import { questionsGeographie } from './questions/geographie';

export const questions = [
  ...questionsMarques,
  ...questionsDisvertissement,
  ...questionsGeographie,
];
