export const colors = {
  white: '#FFFFFF',
  black: '#111111',

  purple: '#A64BE8',
  purpleDeep: '#7A14B8',
  purpleBright: '#B867F2',
  lavender: '#CD94F0',
  purpleLight: '#C77DFF',

  pink: '#EA1E63',
  pinkDark: '#C2185B',
  pinkShadow: '#8C1B47',

  teal: '#5BE5D6',
  tealDark: '#15B1A1',
  tealShadow: '#1C8277',

  yellow: '#FDD54C',
  yellowDark: '#E8A51B',
  yellowShadow: '#B07E22',

  orange: '#FBB040',
  orangeShadow: '#F7CF9A',
  pinkSoft: '#F7A1BF',
  muted: '#9A9A9A',
  labelOnPurple: '#F3E2FF',
  inputPlaceholder: '#EEDCFB',
} as const;

/** Couleurs proposées aux équipes, dans l'ordre d'attribution par défaut. */
export const teamColors = ['#FBB040', '#16D3C3', '#F21F66', '#4FB3FF'] as const;

export const fonts = {
  // Titres et boutons : police arrondie.
  display: 'Quicksand_700Bold',
  displayMedium: 'Quicksand_600SemiBold',
  // Questions et libellés.
  body: 'Roboto_700Bold',
  bodyRegular: 'Roboto_500Medium',
} as const;
