/**
 * useSearch.ts — Fuzzy search with 300 ms debounce for the Pokémon grid.
 *
 * Algorithm: substring match first (fast), then subsequence match (fuzzy).
 * "pika" matches "pikachu", "pkm" also matches because p→k→m appear in order.
 */

import { useCallback, useEffect, useState } from 'react';
import type { PokemonListItem } from '../types';

function fuzzyMatch(query: string, name: string): boolean {
  const q = query.toLowerCase().trim();
  const t = name.toLowerCase();
  if (!q) return true;
  // Fast path — simple substring
  if (t.includes(q)) return true;
  // Subsequence: every char in q appears in order inside t
  let qi = 0;
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) qi++;
  }
  return qi === q.length;
}

interface UseSearchReturn {
  query: string;
  setQuery: (q: string) => void;
  /** Stable reference — only changes when debouncedQuery changes */
  searchPokemon: (pokemon: PokemonListItem[]) => PokemonListItem[];
  hasQuery: boolean;
}

export function useSearch(): UseSearchReturn {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const id = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(id);
  }, [query]);

  const searchPokemon = useCallback(
    (pokemon: PokemonListItem[]): PokemonListItem[] => {
      if (!debouncedQuery.trim()) return pokemon;
      return pokemon.filter((p) => fuzzyMatch(debouncedQuery, p.name));
    },
    [debouncedQuery]
  );

  return { query, setQuery, searchPokemon, hasQuery: debouncedQuery.trim().length > 0 };
}
