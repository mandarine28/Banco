import type { Theme } from './types';

export const themes: Theme[] = [
  {
    id: 'marques', label: 'Marques mondiales', icon: 'tag-outline',
    labelByLang: { en: 'Global Brands', de: 'Weltmarken', es: 'Marcas mundiales' },
  },
  {
    id: 'divertissement', label: 'Divertissement', icon: 'television-play',
    labelByLang: { en: 'Entertainment', de: 'Unterhaltung', es: 'Entretenimiento' },
  },
  {
    id: 'geographie', label: 'Géographie', icon: 'earth',
    labelByLang: { en: 'Geography', de: 'Geographie', es: 'Geografía' },
  },
  {
    id: 'culture-generale', label: 'Culture générale', icon: 'lightbulb-outline',
    labelByLang: { en: 'General Knowledge', de: 'Allgemeinwissen', es: 'Cultura general' },
  },
  {
    id: 'cinema', label: 'Cinéma', icon: 'movie-open',
    labelByLang: { en: 'Cinema', de: 'Kino', es: 'Cine' },
  },
  {
    id: 'sport', label: 'Sport', icon: 'soccer',
    labelByLang: { en: 'Sport', de: 'Sport', es: 'Deporte' },
  },
  {
    id: 'musique', label: 'Musique', icon: 'music',
    labelByLang: { en: 'Music', de: 'Musik', es: 'Música' },
  },
];

export const themeById = (id: string) => themes.find((t) => t.id === id);
