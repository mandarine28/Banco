export const colors = {
  white: '#FFFFFF',
  black: '#111111',

  // Famille bleue (anciennement violette — Figma Banco)
  purple: '#266de4',
  purpleDeep: '#0c2d64',
  purpleBright: '#4d8ff0',
  purpleLight: '#7aadf5',
  lavender: '#ADC8F0',

  // Orange accent (anciennement rose)
  pink: '#fb940e',
  pinkDark: '#d97c00',
  pinkShadow: '#9e5500',

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
  labelOnPurple: '#fef1c3',
  inputPlaceholder: '#b8cef7',

  // Fond crème principal (accueil Figma)
  cream: '#FEF6D7',
} as const;

/** Couleurs proposées aux équipes, dans l'ordre d'attribution par défaut. */
export const teamColors = ['#FBB040', '#16D3C3', '#F21F66', '#4FB3FF'] as const;

export const fonts = {
  // Titres et gros boutons : M PLUS Rounded 1c ExtraBold.
  display: 'MPLUSRounded1c_800ExtraBold',
  displayMedium: 'MPLUSRounded1c_500Medium',
  // Questions et libellés.
  body: 'MPLUSRounded1c_700Bold',
  bodyRegular: 'MPLUSRounded1c_400Regular',
} as const;
