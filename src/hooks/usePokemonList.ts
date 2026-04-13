import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchPokemonList } from '../api';
import type { PokemonListItem } from '../types';
import { PAGE_SIZE } from '../utils/constants';

interface UsePokemonListReturn {
  pokemon: PokemonListItem[];
  isLoading: boolean;
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

  // Ref so loadMore always sees the latest offset without needing it as a dep
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

  useEffect(() => {
    load(0, true);
  }, [load]);

  const loadMore = useCallback(() => {
    if (!isLoading) load(offsetRef.current, false);
  }, [isLoading, load]);

  return { pokemon, isLoading, isInitialLoading, error, hasMore: pokemon.length < total, loadMore };
}
