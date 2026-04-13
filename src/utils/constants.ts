export const PAGE_SIZE = 40;
export const MAX_TEAM_SIZE = 6;
export const POKEAPI_BASE = 'https://pokeapi.co/api/v2';

// Stats are always shown in this order regardless of API response order
export const STAT_ORDER = [
  'hp',
  'attack',
  'defense',
  'special-attack',
  'special-defense',
  'speed',
] as const;

export const MODAL_TABS = ['stats', 'moves', 'about'] as const;
export type ModalTab = (typeof MODAL_TABS)[number];

export const DRAWER_TABS = ['team', 'stats', 'coverage'] as const;
export type DrawerTab = (typeof DRAWER_TABS)[number];
