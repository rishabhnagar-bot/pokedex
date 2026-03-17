/**
 * usePokemonDetail.ts — Fetches full detail for a single Pokémon.
 *
 * Called when the user clicks a card and the detail modal opens.
 * Caches previously loaded Pokémon in a ref so re-opening the same
 * modal doesn't trigger a new network request.
 *
 * Usage:
 *   const { detail, isLoading, error } = usePokemonDetail(selectedId);
 *
 * Pass `null` as the id when no Pokémon is selected (modal is closed).
 */

import { useEffect, useRef, useState } from 'react';
import { fetchPokemonDetail } from '../api';
import type { PokemonDetail } from '../types';

interface UsePokemonDetailReturn {
  detail: PokemonDetail | null;
  isLoading: boolean;
  error: string | null;
}

export function usePokemonDetail(idOrName: number | string | null): UsePokemonDetailReturn {
  const [detail, setDetail] = useState<PokemonDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simple in-memory cache: map of id/name → PokemonDetail
  const cache = useRef<Map<string, PokemonDetail>>(new Map());

  useEffect(() => {
    if (idOrName === null) {
      setDetail(null);
      return;
    }

    const key = String(idOrName);

    // Serve from cache if available
    if (cache.current.has(key)) {
      setDetail(cache.current.get(key)!);
      return;
    }

    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchPokemonDetail(idOrName);
        cache.current.set(key, data);
        if (!cancelled) setDetail(data);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load detail');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    load();

    // Cleanup: ignore stale responses if the id changes quickly
    return () => {
      cancelled = true;
    };
  }, [idOrName]);

  return { detail, isLoading, error };
}
