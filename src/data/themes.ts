import type { Theme } from './types';

export const themes: Theme[] = [
  {
    id: 'marques', label: 'Marques mondiales', icon: 'tag-outline',
    labelByLang: { en: 'Global Brands', de: 'Weltmarken', es: 'Marcas mundiales', it: 'Marchi mondiali', pt: 'Marcas mundiais' },
  },
  {
    id: 'divertissement', label: 'Divertissement', icon: 'television-play',
    labelByLang: { en: 'Entertainment', de: 'Unterhaltung', es: 'Entretenimiento', it: 'Intrattenimento', pt: 'Entretenimento' },
  },
  {
    id: 'geographie', label: 'Géographie', icon: 'earth',
    labelByLang: { en: 'Geography', de: 'Geographie', es: 'Geografía', it: 'Geografia', pt: 'Geografia' },
  },
  {
    id: 'culture-generale', label: 'Culture générale', icon: 'lightbulb-outline',
    labelByLang: { en: 'General Knowledge', de: 'Allgemeinwissen', es: 'Cultura general', it: 'Cultura generale', pt: 'Conhecimentos gerais' },
  },
  {
    id: 'cinema', label: 'Cinéma', icon: 'movie-open',
    labelByLang: { en: 'Cinema', de: 'Kino', es: 'Cine', it: 'Cinema', pt: 'Cinema' },
  },
  {
    id: 'sport', label: 'Sport', icon: 'soccer',
    labelByLang: { en: 'Sport', de: 'Sport', es: 'Deporte', it: 'Sport', pt: 'Esporte' },
  },
  {
    id: 'musique', label: 'Musique', icon: 'music',
    labelByLang: { en: 'Music', de: 'Musik', es: 'Música', it: 'Musica', pt: 'Música' },
  },
];

export const themeById = (id: string) => themes.find((t) => t.id === id);
