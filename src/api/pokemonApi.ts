/**
 * pokemonApi.ts — All functions that talk to the PokeAPI.
 *
 * This is the only file in the project that makes fetch() calls to the
 * external API. Keeping all network logic here makes it easy to swap
 * the API client (e.g. axios, react-query fetcher) later without
 * touching components or hooks.
 *
 * Each function:
 *   1. Fetches the raw API response.
 *   2. Transforms it into a clean domain type from src/types/pokemon.ts.
 *   3. Returns the clean type — callers never see raw API shapes.
 */

import type {
  RawPokemonListResponse,
  RawPokemonDetail,
  RawPokemonSpecies,
  RawTypeListResponse,
} from '../types/api';
import type { PokemonListItem, PokemonDetail, PokemonType } from '../types/pokemon';
import { TYPE_COLORS } from '../utils/typeColors';

const BASE_URL = 'https://pokeapi.co/api/v2';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Extract the numeric ID from a PokeAPI resource URL */
function idFromUrl(url: string): number {
  const parts = url.replace(/\/$/, '').split('/');
  return Number(parts[parts.length - 1]);
}

/** Build a PokemonType with its display color */
function buildType(name: string): PokemonType {
  return {
    name,
    color: TYPE_COLORS[name] ?? '#777',
  };
}

// ---------------------------------------------------------------------------
// API functions
// ---------------------------------------------------------------------------

/**
 * fetchPokemonList
 * GET /pokemon?limit=40&offset=0
 *
 * Returns a lightweight list of Pokémon (id, name, sprite, types).
 * The list endpoint doesn't include types/sprites, so we fire parallel
 * detail requests for each item on the page. Cached by the browser after
 * the first load because PokeAPI sets long cache-control headers.
 *
 * @param limit  - Number of Pokémon per page (default 40)
 * @param offset - Pagination offset
 */
export async function fetchPokemonList(
  limit = 40,
  offset = 0
): Promise<{ items: PokemonListItem[]; total: number }> {
  const res = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
  if (!res.ok) throw new Error(`Failed to fetch Pokémon list (${res.status})`);

  const data: RawPokemonListResponse = await res.json();

  // Fetch minimal detail (types + sprite) for each result in parallel
  const items = await Promise.all(
    data.results.map(async (entry) => {
      const id = idFromUrl(entry.url);
      const detail = await fetchRawDetail(String(id));
      return rawDetailToListItem(detail);
    })
  );

  return { items, total: data.count };
}

/**
 * fetchPokemonDetail
 * GET /pokemon/{id}  +  GET /pokemon-species/{id}
 *
 * Returns the full PokemonDetail including stats, moves, abilities,
 * and flavor text from the species endpoint.
 */
export async function fetchPokemonDetail(idOrName: string | number): Promise<PokemonDetail> {
  const [detail, species] = await Promise.all([
    fetchRawDetail(String(idOrName)),
    fetchRawSpecies(String(idOrName)),
  ]);

  const listItem = rawDetailToListItem(detail);
  const flavorText = extractFlavorText(species);
  const genus = extractGenus(species);

  return {
    ...listItem,
    height: detail.height,
    weight: detail.weight,
    baseExperience: detail.base_experience,
    abilities: detail.abilities.map((a) => a.ability.name),
    stats: detail.stats.map((s) => ({
      name: s.stat.name,
      baseStat: s.base_stat,
    })),
    moves: detail.moves.map((m) => ({
      name: m.move.name,
      levelLearnedAt: m.version_group_details[0]?.level_learned_at ?? 0,
      learnMethod: m.version_group_details[0]?.move_learn_method.name ?? 'unknown',
    })),
    flavorText,
    genus,
  };
}

/**
 * fetchPokemonTypes
 * GET /type
 *
 * Returns all available Pokémon types for the filter chips.
 * We exclude utility types like "unknown" and "shadow".
 */
export async function fetchPokemonTypes(): Promise<PokemonType[]> {
  const res = await fetch(`${BASE_URL}/type`);
  if (!res.ok) throw new Error(`Failed to fetch types (${res.status})`);

  const data: RawTypeListResponse = await res.json();

  return data.results
    .filter((t) => t.name !== 'unknown' && t.name !== 'shadow')
    .map((t) => buildType(t.name));
}

// ---------------------------------------------------------------------------
// Private helpers (not exported)
// ---------------------------------------------------------------------------

async function fetchRawDetail(idOrName: string): Promise<RawPokemonDetail> {
  const res = await fetch(`${BASE_URL}/pokemon/${idOrName}`);
  if (!res.ok) throw new Error(`Failed to fetch Pokémon detail for "${idOrName}" (${res.status})`);
  return res.json();
}

async function fetchRawSpecies(idOrName: string): Promise<RawPokemonSpecies> {
  const res = await fetch(`${BASE_URL}/pokemon-species/${idOrName}`);
  if (!res.ok) throw new Error(`Failed to fetch species for "${idOrName}" (${res.status})`);
  return res.json();
}

function rawDetailToListItem(detail: RawPokemonDetail): PokemonListItem {
  return {
    id: detail.id,
    name: detail.name,
    sprite:
      detail.sprites.other['official-artwork'].front_default ??
      detail.sprites.front_default ??
      '',
    types: detail.types.map((t) => buildType(t.type.name)),
  };
}

function extractFlavorText(species: RawPokemonSpecies): string {
  const entry = species.flavor_text_entries.find((e) => e.language.name === 'en');
  // Clean up escape characters the API embeds in flavor text
  return entry?.flavor_text.replace(/[\n\f\r]/g, ' ') ?? '';
}

function extractGenus(species: RawPokemonSpecies): string {
  const entry = species.genera.find((g) => g.language.name === 'en');
  return entry?.genus ?? '';
}
