/**
 * index.ts — Barrel export for all types.
 *
 * Import types from here: `import type { PokemonDetail } from '@/types'`
 * instead of navigating to individual files.
 */

export * from './pokemon';
export * from './team';
// api.ts is intentionally NOT re-exported here — keep raw API shapes internal.
