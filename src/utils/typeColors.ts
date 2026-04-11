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
  normal:   '#A8A878',
  fire:     '#F08030',
  water:    '#6890F0',
  electric: '#F8D030',
  grass:    '#78C850',
  ice:      '#98D8D8',
  fighting: '#C03028',
  poison:   '#A040A0',
  ground:   '#E0C068',
  flying:   '#A890F0',
  psychic:  '#F85888',
  bug:      '#A8B820',
  rock:     '#B8A038',
  ghost:    '#705898',
  dragon:   '#7038F8',
  dark:     '#705848',
  steel:    '#B8B8D0',
  fairy:    '#EE99AC',
};
