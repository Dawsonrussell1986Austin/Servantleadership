/**
 * Visual language for Founded — per the Founded Style Guide.
 *
 * A warm, editorial system: cream paper, a bold terracotta accent, a
 * high-contrast display serif (DM Serif Display) for headlines and Scripture,
 * and Archivo for everything in the UI. Georgia is kept for long-form reading
 * body, where a display serif would be unreadable.
 */

export const colors = {
  // Paper — warm cream
  paper: '#F4F0E9',
  paperRaised: '#FBF9F4',
  paperDeep: '#EAE0D2',

  // Ink
  ink: '#1A1613',
  inkSoft: '#5F574D',
  inkFaint: '#8A8177',

  // Accent — terracotta clay
  accent: '#BF4A2B',
  accentSoft: '#E0A98F',

  // Categories
  pressure: '#A8503E',
  people: '#4E6B57',
  wins: '#BF4A2B',
  rhythms: '#5A6B86',

  line: '#E2D8C8',
  white: '#FFFFFF',
};

// Font families (loaded in app/_layout). DM Serif Display is the editorial
// display face; Archivo handles all UI text; Georgia is the reading body.
export const fonts = {
  display: 'DMSerifDisplay_400Regular',
  displayExtra: 'DMSerifDisplay_400Regular',
  displaySemibold: 'DMSerifDisplay_400Regular',
  displayItalic: 'DMSerifDisplay_400Regular_Italic',
  sans: 'Archivo_500Medium',
  sansMedium: 'Archivo_500Medium',
  sansSemibold: 'Archivo_600SemiBold',
  sansBold: 'Archivo_700Bold',
  sansExtra: 'Archivo_800ExtraBold',
  serif: 'Georgia',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radius = {
  sm: 10,
  md: 16,
  lg: 24,
};

export const type = {
  // Display / headings — DM Serif Display
  hero: { fontFamily: fonts.display, fontSize: 40, lineHeight: 44 },
  title: { fontFamily: fonts.display, fontSize: 28, lineHeight: 34 },
  heading: { fontFamily: fonts.display, fontSize: 21, lineHeight: 27 },
  // Small UI text — Archivo
  label: { fontFamily: fonts.sansBold, fontSize: 11, letterSpacing: 1.4 },
  caption: { fontFamily: fonts.sansMedium, fontSize: 14, lineHeight: 20 },

  // Reading — serif
  body: { fontFamily: fonts.serif, fontSize: 19, lineHeight: 31 },
  scripture: { fontFamily: fonts.serif, fontSize: 20, lineHeight: 32, fontStyle: 'italic' as const },
};
