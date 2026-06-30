/**
 * Visual language for Founded.
 * Modern, airy chrome — a clean geometric sans (Inter) for everything in the UI,
 * and a warm serif (Georgia) reserved for the reading itself, on a near-white
 * paper background. The feel: a calm modern reading app, not a busy product.
 */

export const colors = {
  // Paper — near-white, faintly warm
  paper: '#FBFAF7',
  paperRaised: '#FFFFFF',
  paperDeep: '#F1EEE8',

  // Ink
  ink: '#201C17',
  inkSoft: '#6E655A',
  inkFaint: '#A79F93',

  // Accent — a quiet liturgical gold/clay
  accent: '#9C6B3F',
  accentSoft: '#C9A77E',

  // Categories
  pressure: '#A8503E',
  people: '#4E6B57',
  wins: '#9C6B3F',
  rhythms: '#5A6B86',

  line: '#ECE8E0',
  white: '#FFFFFF',
};

// Font families (loaded in app/_layout). Bricolage Grotesque is the
// characterful display face for headings; Inter handles small UI text;
// Georgia is reserved for the reading itself.
export const fonts = {
  display: 'BricolageGrotesque_700Bold',
  displayExtra: 'BricolageGrotesque_800ExtraBold',
  displaySemibold: 'BricolageGrotesque_600SemiBold',
  sans: 'Inter_500Medium',
  sansMedium: 'Inter_500Medium',
  sansSemibold: 'Inter_600SemiBold',
  sansBold: 'Inter_700Bold',
  sansExtra: 'Inter_800ExtraBold',
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
  // Display / headings — Bricolage Grotesque
  hero: { fontFamily: fonts.displayExtra, fontSize: 32, lineHeight: 38 },
  title: { fontFamily: fonts.display, fontSize: 25, lineHeight: 31 },
  heading: { fontFamily: fonts.displaySemibold, fontSize: 19, lineHeight: 25 },
  // Small UI text — Inter
  label: { fontFamily: fonts.sansBold, fontSize: 11, letterSpacing: 1.4 },
  caption: { fontFamily: fonts.sansMedium, fontSize: 14, lineHeight: 20 },

  // Reading — serif
  body: { fontFamily: fonts.serif, fontSize: 19, lineHeight: 31 },
  scripture: { fontFamily: fonts.serif, fontSize: 20, lineHeight: 32, fontStyle: 'italic' as const },
};
