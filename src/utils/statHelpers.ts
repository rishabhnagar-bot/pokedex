import type { PokemonStat, AggregatedStat } from '../types';

export const MAX_BASE_STAT = 255;

// Replaces API kebab-case names with spaces for display
export const formatName = (name: string) => name.replace(/-/g, ' ');

export function statPercent(baseStat: number): number {
  return Math.min(100, Math.round((baseStat / MAX_BASE_STAT) * 100));
}

// Short labels — used in the Pokémon detail modal stat bars
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

// Full labels — used in the team drawer stats tab
export function formatStatNameFull(name: string): string {
  const labels: Record<string, string> = {
    hp: 'HP',
    attack: 'Attack',
    defense: 'Defense',
    'special-attack': 'Special Attack',
    'special-defense': 'Special Defense',
    speed: 'Speed',
  };
  return labels[name] ?? formatName(name);
}

export function formatGrowthRate(name: string): string {
  const map: Record<string, string> = {
    slow: 'Slow',
    medium: 'Medium',
    fast: 'Fast',
    'medium-slow': 'Medium Slow',
    'slow-then-very-fast': 'Erratic',
    'fast-then-very-slow': 'Fluctuating',
  };
  return map[name] ?? formatName(name);
}

export function aggregateTeamStats(memberStats: PokemonStat[][]): AggregatedStat[] {
  const totals: Record<string, number> = {};
  for (const stats of memberStats) {
    for (const stat of stats) {
      totals[stat.name] = (totals[stat.name] ?? 0) + stat.baseStat;
    }
  }
  return Object.entries(totals).map(([name, total]) => ({ name, total }));
}

export function formatHeight(decimetres: number): string {
  return `${parseFloat((decimetres / 10).toFixed(1))} m`;
}

export function formatWeight(hectograms: number): string {
  return `${parseFloat((hectograms / 10).toFixed(1))} kg`;
}
