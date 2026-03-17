/**
 * statHelpers.ts — Utility functions for working with Pokémon stats.
 *
 * Used by:
 *   - PokemonModal StatsTab — to render stat bars and labels.
 *   - TeamDrawer StatsTab   — to compute combined team stats.
 */

import type { PokemonStat, AggregatedStat } from '../types';

/** Maximum possible base stat value (used to calculate bar width %) */
export const MAX_BASE_STAT = 255;

/**
 * Returns the percentage width (0–100) for a stat bar visualization.
 * Clamps between 0 and 100 to handle edge cases.
 */
export function statPercent(baseStat: number): number {
  return Math.min(100, Math.round((baseStat / MAX_BASE_STAT) * 100));
}

/**
 * Returns a human-readable label for internal stat names.
 * e.g. "special-attack" → "Sp. Atk"
 */
export function formatStatName(name: string): string {
  const labels: Record<string, string> = {
    hp: 'HP',
    attack: 'Attack',
    defense: 'Defense',
    'special-attack': 'Sp. Atk',
    'special-defense': 'Sp. Def',
    speed: 'Speed',
  };
  return labels[name] ?? name;
}

/**
 * Aggregates stats across multiple team members by summing each stat.
 * Used in the Team Builder drawer's Stats tab.
 */
export function aggregateTeamStats(memberStats: PokemonStat[][]): AggregatedStat[] {
  const totals: Record<string, number> = {};

  for (const stats of memberStats) {
    for (const stat of stats) {
      totals[stat.name] = (totals[stat.name] ?? 0) + stat.baseStat;
    }
  }

  return Object.entries(totals).map(([name, total]) => ({ name, total }));
}

/**
 * Formats a Pokémon's height from decimetres to a readable string.
 * e.g. 7 → "0.7 m"
 */
export function formatHeight(decimetres: number): string {
  return `${(decimetres / 10).toFixed(1)} m`;
}

/**
 * Formats a Pokémon's weight from hectograms to kilograms.
 * e.g. 69 → "6.9 kg"
 */
export function formatWeight(hectograms: number): string {
  return `${(hectograms / 10).toFixed(1)} kg`;
}
