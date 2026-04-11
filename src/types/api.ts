/**
 * api.ts — Raw shapes returned directly by the PokeAPI.
 *
 * These interfaces are only used inside src/api/pokemonApi.ts to type
 * the fetch responses before we transform them into our clean domain
 * types defined in pokemon.ts.
 *
 * Rule: nothing outside of src/api/ should import from this file.
 */

/** Generic named resource reference used all over the API */
export interface NamedAPIResource {
  name: string;
  url: string;
}

/** GET /pokemon?limit=40&offset=0 */
export interface RawPokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: NamedAPIResource[];
}

/** GET /pokemon/{id} */
export interface RawPokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number | null;
  sprites: {
    front_default: string | null;
    other: {
      'official-artwork': {
        front_default: string | null;
      };
    };
  };
  types: Array<{
    slot: number;
    type: NamedAPIResource;
  }>;
  stats: Array<{
    base_stat: number;
    stat: NamedAPIResource;
  }>;
  moves: Array<{
    move: NamedAPIResource;
    version_group_details: Array<{
      level_learned_at: number;
      move_learn_method: NamedAPIResource;
    }>;
  }>;
  abilities: Array<{
    ability: NamedAPIResource;
    is_hidden: boolean;
  }>;
}

/** GET /pokemon-species/{id} */
export interface RawPokemonSpecies {
  id: number;
  name: string;
  capture_rate: number;
  growth_rate: { name: string; url: string };
  evolution_chain: { url: string };
  genera: Array<{
    genus: string;
    language: NamedAPIResource;
  }>;
  flavor_text_entries: Array<{
    flavor_text: string;
    language: NamedAPIResource;
    version: NamedAPIResource;
  }>;
}

/** GET <evolution_chain_url> */
export interface RawEvolutionChain {
  chain: RawChainLink;
}

export interface RawChainLink {
  species: NamedAPIResource;
  evolution_details: Array<{ min_level: number | null }>;
  evolves_to: RawChainLink[];
}

/** GET /type */
export interface RawTypeListResponse {
  count: number;
  results: NamedAPIResource[];
}
