/**
 * useTypeFilter.ts — Manages type filter chips and client-side filtering.
 *
 * Responsibilities:
 *   - Fetch all available Pokémon types from the API on mount.
 *   - Track which type (if any) is currently selected.
 *   - Expose a filtered list derived from the full Pokémon list.
 *
 * Usage:
 *   const { types, activeType, setActiveType, filterPokemon } = useTypeFilter();
 *   const visible = filterPokemon(allPokemon);
 */

import { useCallback, useEffect, useState } from 'react';
import { fetchPokemonTypes } from '../api';
import type { PokemonListItem, PokemonType } from '../types';

interface UseTypeFilterReturn {
  types: PokemonType[];
  activeType: string | null;
  setActiveType: (typeName: string | null) => void;
  /** Filters a list of Pokémon by the currently selected type */
  filterPokemon: (pokemon: PokemonListItem[]) => PokemonListItem[];
  isLoading: boolean;
}

export function useTypeFilter(): UseTypeFilterReturn {
  const [types, setTypes] = useState<PokemonType[]>([]);
  const [activeType, setActiveType] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPokemonTypes()
      .then(setTypes)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const filterPokemon = useCallback(
    (pokemon: PokemonListItem[]): PokemonListItem[] => {
      if (!activeType) return pokemon;
      return pokemon.filter((p) => p.types.some((t) => t.name === activeType));
    },
    [activeType]
  );

  return { types, activeType, setActiveType, filterPokemon, isLoading };
}
