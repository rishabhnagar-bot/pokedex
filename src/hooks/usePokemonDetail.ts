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

  // Simple in-memory cache so reopening the same modal skips the network
  const cache = useRef<Map<string, PokemonDetail>>(new Map());

  useEffect(() => {
    if (idOrName === null) {
      setDetail(null);
      return;
    }

    const key = String(idOrName);
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
    return () => { cancelled = true; };
  }, [idOrName]);

  return { detail, isLoading, error };
}
