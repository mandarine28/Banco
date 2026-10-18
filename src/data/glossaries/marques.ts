import type { Glossary } from '../types';

// Les marques ne se traduisent pas : seuls les noms de jeux et de produits qui changent selon le pays figurent ici.
export const glossaryMarques: Glossary = {
  en: {
    'PUISSANCE 4': 'CONNECT FOUR', 'BATAILLE NAVALE': 'BATTLESHIP', 'QUI EST-CE ?': 'GUESS WHO', 'OPÉRATION': 'OPERATION',
    'BISOUNOURS': 'CARE BEARS', 'MONSIEUR PATATE': 'MR. POTATO HEAD',
  },
  de: {
    'PUISSANCE 4': 'VIER GEWINNT', 'BATAILLE NAVALE': 'SCHIFFE VERSENKEN',
    'QUI EST-CE ?': 'WER IST ES?', 'OPÉRATION': 'DOKTOR BIBBER',
    'BISOUNOURS': 'GLÜCKSBÄRCHIS', 'MONSIEUR PATATE': 'MR. POTATO HEAD', 'TABOO': 'TABU', 'TICKET TO RIDE': 'ZUG UM ZUG',
  },
  es: {
    'PUISSANCE 4': 'CONECTA 4', 'BATAILLE NAVALE': 'HUNDIR LA FLOTA',
    'QUI EST-CE ?': '¿QUIÉN ES QUIÉN?', 'OPÉRATION': 'OPERACIÓN',
    'BISOUNOURS': 'OSITOS CARIÑOSOS', 'MONSIEUR PATATE': 'MR. POTATO', 'TABOO': 'TABÚ', 'TICKET TO RIDE': '¡AVENTUREROS AL TREN!',
  },
};
