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

export const sectionLabel: Record<string, string> = {
  call: 'Be Still',
  scripture: 'The Word',
  reflection: 'Reflection',
  prayer: 'Prayer',
  response: 'Pray This Back',
  benediction: 'Go in Peace',
};
