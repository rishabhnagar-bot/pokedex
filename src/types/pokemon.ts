/**
 * pokemon.ts — Core domain types for Pokémon data.
 *
 * These interfaces mirror what we store in state after transforming
 * raw PokeAPI responses. They are used throughout the app (components,
 * hooks, context) as the single source of truth for Pokémon shapes.
 */

/** A lightweight Pokémon entry returned by the list endpoint */
export interface PokemonListItem {
  id: number;
  name: string;
  /** Sprite URL for the card thumbnail */
  sprite: string;
  types: PokemonType[];
}

/** A Pokémon type (e.g. "fire", "water") */
export interface PokemonType {
  name: string;
  /** Hex color used for type badges — populated from utils/typeColors.ts */
  color: string;
}

/** Full detail for a single Pokémon — used in the detail modal */
export interface PokemonDetail extends PokemonListItem {
  height: number; // decimetres
  weight: number; // hectograms
  abilities: string[];
  stats: PokemonStat[];
  moves: PokemonMove[];
  /** Flavor text from the species endpoint (lore description) */
  flavorText: string;
  /** Genus e.g. "Seed Pokémon" */
  genus: string;
  /** Base experience */
  baseExperience: number | null;
}

export interface PokemonStat {
  name: string; // e.g. "hp", "attack"
  baseStat: number;
}

export interface PokemonMove {
  name: string;
  /** Level at which the move is learned (0 = not via leveling) */
  levelLearnedAt: number;
  learnMethod: string; // e.g. "level-up", "machine"
}
