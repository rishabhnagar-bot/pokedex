import type {
  RawPokemonListResponse,
  RawPokemonDetail,
  RawPokemonSpecies,
  RawTypeListResponse,
  RawChainLink,
} from '../types/api';
import type { PokemonListItem, PokemonDetail, PokemonType, EvolutionStage } from '../types/pokemon';
import { TYPE_COLORS } from '../utils/typeColors';
import { POKEAPI_BASE } from '../utils/constants';

function idFromUrl(url: string): number {
  const parts = url.replace(/\/$/, '').split('/');
  return Number(parts[parts.length - 1]);
}

function buildType(name: string): PokemonType {
  return { name, color: TYPE_COLORS[name] ?? '#777' };
}

export async function fetchPokemonList(
  limit = 40,
  offset = 0
): Promise<{ items: PokemonListItem[]; total: number }> {
  const res = await fetch(`${POKEAPI_BASE}/pokemon?limit=${limit}&offset=${offset}`);
  if (!res.ok) throw new Error(`Failed to fetch Pokémon list (${res.status})`);

  const data: RawPokemonListResponse = await res.json();

  // Fetch types + sprite for each item in parallel (list endpoint doesn't include them)
  const items = await Promise.all(
    data.results.map(async (entry) => {
      const id = idFromUrl(entry.url);
      const detail = await fetchRawDetail(String(id));
      return rawDetailToListItem(detail);
    })
  );

  return { items, total: data.count };
}

export async function fetchPokemonDetail(idOrName: string | number): Promise<PokemonDetail> {
  const [detail, species] = await Promise.all([
    fetchRawDetail(String(idOrName)),
    fetchRawSpecies(String(idOrName)),
  ]);

  const listItem = rawDetailToListItem(detail);
  const flavorText = extractFlavorText(species);
  const genus = extractGenus(species);
  const evolutionChain = await fetchEvolutionChain(species.evolution_chain.url);
  const hiddenAbilityEntry = detail.abilities.find((a) => a.is_hidden);

  return {
    ...listItem,
    height: detail.height,
    weight: detail.weight,
    baseExperience: detail.base_experience,
    abilities: detail.abilities.filter((a) => !a.is_hidden).map((a) => a.ability.name),
    hiddenAbility: hiddenAbilityEntry?.ability.name ?? null,
    stats: detail.stats.map((s) => ({ name: s.stat.name, baseStat: s.base_stat })),
    moves: detail.moves.map((m) => ({
      name: m.move.name,
      levelLearnedAt: m.version_group_details[0]?.level_learned_at ?? 0,
      learnMethod: m.version_group_details[0]?.move_learn_method.name ?? 'unknown',
    })),
    flavorText,
    genus,
    catchRate: species.capture_rate,
    growthRate: species.growth_rate.name,
    evolutionChain,
  };
}

// Excludes utility types (unknown, shadow) that aren't real game types
export async function fetchPokemonTypes(): Promise<PokemonType[]> {
  const res = await fetch(`${POKEAPI_BASE}/type`);
  if (!res.ok) throw new Error(`Failed to fetch types (${res.status})`);

  const data: RawTypeListResponse = await res.json();
  return data.results
    .filter((t) => t.name !== 'unknown' && t.name !== 'shadow')
    .map((t) => buildType(t.name));
}

async function fetchRawDetail(idOrName: string): Promise<RawPokemonDetail> {
  const res = await fetch(`${POKEAPI_BASE}/pokemon/${idOrName}`);
  if (!res.ok) throw new Error(`Failed to fetch Pokémon "${idOrName}" (${res.status})`);
  return res.json();
}

async function fetchRawSpecies(idOrName: string): Promise<RawPokemonSpecies> {
  const res = await fetch(`${POKEAPI_BASE}/pokemon-species/${idOrName}`);
  if (!res.ok) throw new Error(`Failed to fetch species "${idOrName}" (${res.status})`);
  return res.json();
}

async function fetchEvolutionChain(url: string): Promise<EvolutionStage[]> {
  const res = await fetch(url);
  if (!res.ok) return [];
  const data: { chain: RawChainLink } = await res.json();

  const stages: EvolutionStage[] = [];

  const walk = async (link: RawChainLink, minLevel: number | null) => {
    const id = idFromUrl(link.species.url);
    try {
      const raw = await fetchRawDetail(String(id));
      stages.push({ ...rawDetailToListItem(raw), minLevel });
    } catch {
      // skip stages we can't fetch
    }
    for (const next of link.evolves_to) {
      await walk(next, next.evolution_details[0]?.min_level ?? null);
    }
  };

  await walk(data.chain, null);
  return stages;
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
  return entry?.flavor_text.replace(/[\n\f\r]/g, ' ') ?? '';
}

function extractGenus(species: RawPokemonSpecies): string {
  const entry = species.genera.find((g) => g.language.name === 'en');
  return entry?.genus ?? '';
}
