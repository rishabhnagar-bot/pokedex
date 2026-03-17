/**
 * typeColors.ts — Mapping of Pokémon type names to their display colors.
 *
 * Used in two places:
 *   1. api/pokemonApi.ts — attaches a color when building PokemonType objects.
 *   2. components/TypeFilter — colors the filter chip backgrounds.
 *   3. components/PokemonCard — colors the type badge pills on each card.
 *
 * Colors are chosen to match the Figma design and the official Pokémon
 * type palette commonly used in official games.
 */

export const TYPE_COLORS: Record<string, string> = {
  normal: '#A8A77A',
  fire: '#EE8130',
  water: '#6390F0',
  electric: '#F7D02C',
  grass: '#7AC74C',
  ice: '#96D9D6',
  fighting: '#C22E28',
  poison: '#A33EA1',
  ground: '#E2BF65',
  flying: '#A98FF3',
  psychic: '#F95587',
  bug: '#A6B91A',
  rock: '#B6A136',
  ghost: '#735797',
  dragon: '#6F35FC',
  dark: '#705746',
  steel: '#B7B7CE',
  fairy: '#D685AD',
};
