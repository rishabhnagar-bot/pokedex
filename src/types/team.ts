/**
 * team.ts — Types related to the Team Builder feature.
 *
 * The team is a collection of up to 6 Pokémon that the user assembles.
 * These types are consumed by TeamContext and the TeamDrawer component.
 */

import type { PokemonListItem, PokemonStat, PokemonType } from './pokemon';

/** A single slot in the user's battle team */
export interface TeamMember extends PokemonListItem {
  stats: PokemonStat[];
}

/** Shape of the team state held in TeamContext */
export interface TeamState {
  members: TeamMember[];
}

/**
 * Aggregated stats shown in the Team Stats tab of the drawer.
 * Each stat is the sum of that stat across all team members.
 */
export interface AggregatedStat {
  name: string;
  total: number;
}

/**
 * Type coverage entry shown in the Type Coverage tab.
 * Tells the user which types are represented and how many members cover each.
 */
export interface TypeCoverageEntry {
  type: PokemonType;
  /** How many team members have this type */
  count: number;
}
