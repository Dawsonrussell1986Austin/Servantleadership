/**
 * Visual language for Founded — "Daylight" direction (Vesper redesign).
 *
 * A warm, bookish system: cream paper, terracotta accent, a classic text
 * serif (Source Serif 4) for headlines and Scripture — set roman, with true
 * italics for ledes — and Instrument Sans for all UI text. Dark, moody
 * gradient tiles carry the library; everything else stays light and quiet.
 */

export const colors = {
  // Paper — warm cream
  paper: '#FAF6EF',
  paperRaised: '#FFFFFF',
  paperDeep: '#F0EAE0',

  // Ink — warm near-black
  ink: '#211D16',
  inkSoft: '#5C554A',
  inkFaint: '#A89E8D',

  // Accent — terracotta clay
  accent: '#C65A33',
  accentSoft: '#E0A98F',

  // Categories
  pressure: '#A8503E',
  people: '#4E6B57',
  wins: '#C65A33',
  rhythms: '#5A6B86',

  line: '#E7DFD2',
  white: '#FFFFFF',
};

/**
 * Dark tile gradients (deep navy / charcoal / umber / teal / plum), used for
 * category and hero tiles: white serif title over a moody two-stop wash.
 */
export const tileGradients: [string, string][] = [
  ['#0F2231', '#173042'], // deep navy
  ['#2A2B31', '#3A3B42'], // charcoal
  ['#341F14', '#3A2A1C'], // umber brown
  ['#12222E', '#1C3038'], // dark teal
  ['#241F33', '#322B45'], // plum
];

// Font families (loaded in app/_layout). Source Serif 4 is the editorial
// serif; Instrument Sans handles all UI text; the serif doubles as the
// long-form reading body.
export const fonts = {
  display: 'SourceSerif4_600SemiBold',
  displayExtra: 'SourceSerif4_700Bold',
  displaySemibold: 'SourceSerif4_600SemiBold',
  displayItalic: 'SourceSerif4_400Regular_Italic',
  sans: 'InstrumentSans_500Medium',
  sansMedium: 'InstrumentSans_500Medium',
  sansSemibold: 'InstrumentSans_600SemiBold',
  sansBold: 'InstrumentSans_700Bold',
  sansExtra: 'InstrumentSans_700Bold',
  serif: 'SourceSerif4_400Regular',
  serifItalic: 'SourceSerif4_400Regular_Italic',
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
  // Display / headings — Source Serif 4
  hero: { fontFamily: fonts.display, fontSize: 38, lineHeight: 44 },
  title: { fontFamily: fonts.display, fontSize: 27, lineHeight: 34 },
  heading: { fontFamily: fonts.display, fontSize: 21, lineHeight: 27 },
  // Small UI text — Instrument Sans
  label: { fontFamily: fonts.sansBold, fontSize: 11, letterSpacing: 1.4 },
  caption: { fontFamily: fonts.sansMedium, fontSize: 14, lineHeight: 20 },

  // Reading — serif
  body: { fontFamily: fonts.serif, fontSize: 19, lineHeight: 31 },
  scripture: { fontFamily: fonts.serifItalic, fontSize: 20, lineHeight: 32 },
};
