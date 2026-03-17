/**
 * index.ts — Barrel export for the api module.
 *
 * Components and hooks import API functions from here:
 *   `import { fetchPokemonDetail } from '@/api'`
 */

export { fetchPokemonList, fetchPokemonDetail, fetchPokemonTypes } from './pokemonApi';
