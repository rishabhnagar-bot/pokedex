import { useCallback, useEffect, useState } from 'react';
import { fetchPokemonTypes } from '../api';
import type { PokemonListItem, PokemonType } from '../types';

interface UseTypeFilterReturn {
  types: PokemonType[];
  activeType: string | null;
  setActiveType: (typeName: string | null) => void;
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
