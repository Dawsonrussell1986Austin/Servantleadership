import { Ionicons } from '@expo/vector-icons';
import { CategoryId } from '../content/types';

export const CATEGORY_ICON: Record<CategoryId, keyof typeof Ionicons.glyphMap> = {
  money: 'cash-outline',
  fear: 'alert-circle-outline',
  deals: 'briefcase-outline',
  launching: 'rocket-outline',
  partners: 'people-circle-outline',
  team: 'people-outline',
  conversations: 'chatbubbles-outline',
  wins: 'trophy-outline',
  rhythms: 'partly-sunny-outline',
  focus: 'compass-outline',
};
