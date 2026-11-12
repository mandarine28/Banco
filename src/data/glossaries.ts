import type { Glossary } from './types';
import { glossaryArt } from './glossaries/art-litterature';
import { glossaryRetro } from './glossaries/retro-gaming';
import { glossaryAnime } from './glossaries/anime';
import { glossaryFootball } from './glossaries/football';
import { glossaryDessinsAnimes } from './glossaries/dessins-animes';
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
  'art-litterature': glossaryArt,
  'retro-gaming': glossaryRetro,
  anime: glossaryAnime,
  football: glossaryFootball,
  'dessins-animes': glossaryDessinsAnimes,
  'harry-potter': glossaryHarryPotter,
  sport: glossarySport,
  geographie: glossaryGeographie,
  'culture-generale': glossaryCultureG,
  musique: glossaryMusique,
  divertissement: glossaryDivertissement,
  marques: glossaryMarques,
};
