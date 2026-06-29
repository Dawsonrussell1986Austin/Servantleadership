import { colors } from './theme';
import { CategoryId } from '../content/types';

export const categoryColor = (id: CategoryId): string => {
  switch (id) {
    case 'pressure':
      return colors.pressure;
    case 'people':
      return colors.people;
    case 'wins':
      return colors.wins;
    case 'rhythms':
      return colors.rhythms;
    default:
      return colors.accent;
  }
};

/** A two-stop gradient per category for cover art. */
export const categoryGradient = (id: CategoryId): [string, string] => {
  switch (id) {
    case 'pressure':
      return ['#C2604B', '#8E3B2C'];
    case 'people':
      return ['#5E7E68', '#3C5544'];
    case 'wins':
      return ['#C08A4F', '#8A5A2E'];
    case 'rhythms':
      return ['#6B7C99', '#46546E'];
    default:
      return ['#C9A77E', '#9C6B3F'];
  }
};

/** Short, single-word-ish labels for the narrow cover chip. */
export const shortCategoryLabel: Record<CategoryId, string> = {
  pressure: 'PRESSURE',
  people: 'PEOPLE',
  wins: 'MOMENTS',
  rhythms: 'RHYTHMS',
};

export const sectionLabel: Record<string, string> = {
  call: 'Be Still',
  scripture: 'The Word',
  reflection: 'Reflection',
  prayer: 'Prayer',
  response: 'Pray This Back',
  benediction: 'Go in Peace',
};
