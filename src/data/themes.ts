import type { Theme } from './types';

export const themes: Theme[] = [
  { id: 'cuisine', label: 'Cuisine', icon: 'hamburger' },
  { id: 'sport', label: 'Sport', icon: 'soccer' },
  { id: 'geographie', label: 'Géographie', icon: 'earth' },
  { id: 'cinema', label: 'Cinéma', icon: 'movie-open' },
  { id: 'animaux', label: 'Animaux', icon: 'paw' },
  { id: 'musique', label: 'Musique', icon: 'music' },
];

export const themeById = (id: string) => themes.find((t) => t.id === id);
