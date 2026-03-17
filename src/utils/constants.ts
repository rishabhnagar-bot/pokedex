/**
 * constants.ts — App-wide magic numbers and configuration.
 *
 * Centralizing these prevents scattered hard-coded values and makes
 * it easy to tweak behaviour without hunting through multiple files.
 */

/** Number of Pokémon loaded per page (matches the Figma spec) */
export const PAGE_SIZE = 40;

/** Maximum number of Pokémon allowed in the battle team */
export const MAX_TEAM_SIZE = 6;

/** Base URL for PokeAPI — single place to update if the URL ever changes */
export const POKEAPI_BASE = 'https://pokeapi.co/api/v2';

/**
 * Ordered list of standard base stat names.
 * Used to ensure stats are always displayed in the same order
 * regardless of the order returned by the API.
 */
export const STAT_ORDER = [
  'hp',
  'attack',
  'defense',
  'special-attack',
  'special-defense',
  'speed',
] as const;

/** Tab identifiers for the Pokémon detail modal */
export const MODAL_TABS = ['stats', 'moves', 'about'] as const;
export type ModalTab = (typeof MODAL_TABS)[number];

/** Tab identifiers for the Team Builder drawer */
export const DRAWER_TABS = ['team', 'stats', 'coverage'] as const;
export type DrawerTab = (typeof DRAWER_TABS)[number];
