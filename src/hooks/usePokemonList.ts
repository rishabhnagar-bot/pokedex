/**
 * usePokemonList.ts — Fetches and paginates the main Pokémon gallery.
 *
 * Responsibilities:
 *   - Load the first page on mount.
 *   - Expose a `loadMore` function that appends the next 40 Pokémon.
 *   - Track loading and error states.
 *   - Track whether there are more pages to load (for the "Load More" button).
 *
 * The hook does NOT handle type filtering — that is done client-side
 * by the useTypeFilter hook which wraps the output of this hook.
 *
 * Usage:
 *   const { pokemon, isLoading, error, loadMore, hasMore } = usePokemonList();
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchPokemonList } from '../api';
import type { PokemonListItem } from '../types';
import { PAGE_SIZE } from '../utils/constants';

interface UsePokemonListReturn {
  pokemon: PokemonListItem[];
  isLoading: boolean;
  /** True only during the initial load (not during "load more") */
  isInitialLoading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
}

export function usePokemonList(): UsePokemonListReturn {
  const [pokemon, setPokemon] = useState<PokemonListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);

  // Use a ref for offset so loadMore always captures the latest value
  // without needing to be in the dependency array.
  const offsetRef = useRef(0);

  const load = useCallback(async (offset: number, isInitial: boolean) => {
    setIsLoading(true);
    if (isInitial) setIsInitialLoading(true);
    setError(null);

    try {
      const { items, total: totalCount } = await fetchPokemonList(PAGE_SIZE, offset);
      setPokemon((prev) => (isInitial ? items : [...prev, ...items]));
      setTotal(totalCount);
      offsetRef.current = offset + items.length;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load Pokémon');
    } finally {
      setIsLoading(false);
      if (isInitial) setIsInitialLoading(false);
    }
  }, []);

  // Load first page on mount
  useEffect(() => {
    load(0, true);
  }, [load]);

  const loadMore = useCallback(() => {
    if (!isLoading) {
      load(offsetRef.current, false);
    }
  }, [isLoading, load]);

  const hasMore = pokemon.length < total;

  return { pokemon, isLoading, isInitialLoading, error, hasMore, loadMore };
}
