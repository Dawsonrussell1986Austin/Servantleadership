import { CategoryId } from '../content/types';

/** Two-stop gradient per category (used for shelves and cover tints). */
const GRADIENTS: Record<CategoryId, [string, string]> = {
  money: ['#3F8466', '#27604A'],
  fear: ['#B05541', '#82382A'],
  deals: ['#BE883F', '#8C601F'],
  launching: ['#C76A3A', '#993F1E'],
  partners: ['#3C8A84', '#256661'],
  team: ['#4A66A6', '#2E467C'],
  conversations: ['#9C5B72', '#6E3B4F'],
  wins: ['#CFA23E', '#A2761E'],
  rhythms: ['#5C6E88', '#475670'],
  focus: ['#6E5DA0', '#483C72'],
};

const SHORT: Record<CategoryId, string> = {
  money: 'MONEY',
  fear: 'FEAR',
  deals: 'DEALS',
  launching: 'LAUNCH',
  partners: 'PARTNERS',
  team: 'TEAM',
  conversations: 'TALKS',
  wins: 'WINS',
  rhythms: 'RHYTHMS',
  focus: 'FOCUS',
};

export const categoryColor = (id: CategoryId): string => GRADIENTS[id]?.[0] ?? '#9C6B3F';

export const categoryGradient = (id: CategoryId): [string, string] =>
  GRADIENTS[id] ?? ['#C9A77E', '#9C6B3F'];

/** Short, single-word labels for the narrow cover chip. */
export const shortCategoryLabel: Record<CategoryId, string> = SHORT;

export const sectionLabel: Record<string, string> = {
  call: 'Be Still',
  scripture: 'The Word',
  reflection: 'Reflection',
  prayer: 'Prayer',
  response: 'Pray This Back',
  benediction: 'Go in Peace',
};
