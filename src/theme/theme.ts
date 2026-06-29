/**
 * Visual language for Servant.
 * Warm paper tones, muted ink, generous breathing room — a space that feels
 * more like an open prayer book than a productivity app.
 */

export const colors = {
  // Paper
  paper: '#F6F1E7',
  paperRaised: '#FCF8F0',
  paperDeep: '#EDE5D5',

  // Ink
  ink: '#2B2722',
  inkSoft: '#5A5247',
  inkFaint: '#8C8273',

  // Accent — a quiet liturgical gold/clay
  accent: '#9C6B3F',
  accentSoft: '#C9A77E',

  // Categories
  pressure: '#A8503E', // clay red — the hard days
  people: '#4E6B57', // sage green — relationships
  wins: '#9C6B3F', // gold — the high moments
  rhythms: '#5A6B86', // slate blue — daily practice

  line: '#E2D8C6',
  white: '#FFFFFF',
};

export const fonts = {
  // System serif gives a printed, devotional feel without bundling font files.
  serif: 'Georgia',
  sans: 'System',
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
  sm: 8,
  md: 14,
  lg: 22,
};

export const type = {
  hero: { fontFamily: fonts.serif, fontSize: 34, lineHeight: 42 },
  title: { fontFamily: fonts.serif, fontSize: 26, lineHeight: 34 },
  heading: { fontFamily: fonts.serif, fontSize: 20, lineHeight: 28 },
  body: { fontFamily: fonts.serif, fontSize: 19, lineHeight: 31 },
  scripture: { fontFamily: fonts.serif, fontSize: 20, lineHeight: 32, fontStyle: 'italic' as const },
  label: { fontFamily: fonts.sans, fontSize: 12, letterSpacing: 1.5 },
  caption: { fontFamily: fonts.sans, fontSize: 14, lineHeight: 20 },
};
