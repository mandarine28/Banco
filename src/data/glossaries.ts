import type { Glossary } from './types';
import { glossaryCinema } from './glossaries/cinema';
import { glossaryHarryPotter } from './glossaries/harry-potter';
import { glossaryMarques } from './glossaries/marques';
import { glossaryMusique } from './glossaries/musique';
import { glossaryCultureG } from './glossaries/cultureg';
import { glossaryDivertissement } from './glossaries/divertissement';
import { glossaryGeographie } from './glossaries/geographie';
import { glossarySport } from './glossaries/sport';

/** Glossaire de traduction des réponses, par identifiant de thème. */
export const glossaries: Record<string, Glossary> = {
  cinema: glossaryCinema,
  'harry-potter': glossaryHarryPotter,
  sport: glossarySport,
  geographie: glossaryGeographie,
  'culture-generale': glossaryCultureG,
  musique: glossaryMusique,
  divertissement: glossaryDivertissement,
  marques: glossaryMarques,
};
