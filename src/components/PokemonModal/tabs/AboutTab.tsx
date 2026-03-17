/**
 * AboutTab.tsx — "About" tab inside the Pokémon detail modal.
 *
 * Content (from PokeAPI pokemon-species endpoint):
 *   - Flavor text / species description  ← main focus, shown prominently
 *   - Genus (e.g. "Seed Pokémon")
 *   - Height and Weight
 *   - Abilities
 *   - Base Experience
 */

import type { PokemonDetail } from '../../../types';
import { formatHeight, formatWeight } from '../../../utils/statHelpers';
import styles from './AboutTab.module.css';

interface AboutTabProps {
  detail: PokemonDetail;
}

export function AboutTab({ detail }: AboutTabProps) {
  return (
    <div className={styles.wrapper}>

      {/* Species description from the species API — most prominent element */}
      {detail.flavorText ? (
        <blockquote className={styles.description}>
          {detail.flavorText}
        </blockquote>
      ) : (
        <p className={styles.noDescription}>No description available.</p>
      )}

      {/* Info grid */}
      <dl className={styles.grid}>
        {detail.genus && (
          <div className={styles.entry}>
            <dt>Species</dt>
            <dd>{detail.genus}</dd>
          </div>
        )}

        <div className={styles.entry}>
          <dt>Height</dt>
          <dd>{formatHeight(detail.height)}</dd>
        </div>

        <div className={styles.entry}>
          <dt>Weight</dt>
          <dd>{formatWeight(detail.weight)}</dd>
        </div>

        <div className={styles.entry}>
          <dt>Abilities</dt>
          <dd>{detail.abilities.map((a) => a.replace(/-/g, ' ')).join(', ')}</dd>
        </div>

        {detail.baseExperience !== null && (
          <div className={styles.entry}>
            <dt>Base Exp.</dt>
            <dd>{detail.baseExperience}</dd>
          </div>
        )}
      </dl>
    </div>
  );
}
