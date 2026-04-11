import type { PokemonDetail } from '../../../types';
import { formatHeight, formatWeight } from '../../../utils/statHelpers';
import styles from './AboutTab.module.css';

interface AboutTabProps {
  detail: PokemonDetail;
}

function formatGrowthRate(name: string): string {
  const map: Record<string, string> = {
    slow: 'Slow',
    medium: 'Medium',
    fast: 'Fast',
    'medium-slow': 'Medium Slow',
    'slow-then-very-fast': 'Erratic',
    'fast-then-very-slow': 'Fluctuating',
  };
  return map[name] ?? name.replace(/-/g, ' ');
}

function IconBox({ children }: { children: React.ReactNode }) {
  return <span className={styles.iconBox}>{children}</span>;
}

export function AboutTab({ detail }: AboutTabProps) {
  return (
    <div className={styles.wrapper}>

      {/* ── Pokédex Entry ── */}
      {detail.flavorText && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <IconBox>
              {/* open book */}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
              </svg>
            </IconBox>
            <span className={styles.sectionTitle}>Pokédex Entry</span>
          </div>
          <div className={styles.sectionBody}>
            <p className={styles.flavorText}>{detail.flavorText}</p>
          </div>
        </section>
      )}

      {/* ── Training ── */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <IconBox>
            {/* dumbbell */}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="12" r="2.5"/>
              <path d="M8.5 12h7"/><path d="M2 12h1.5"/><path d="M20.5 12H22"/>
              <path d="M3.5 9.5v5"/><path d="M20.5 9.5v5"/>
            </svg>
          </IconBox>
          <span className={styles.sectionTitle}>Training</span>
        </div>
        <div className={styles.sectionBody}>
          <div className={styles.grid2}>
            <div className={styles.gridCell}>
              <span className={styles.gridLabel}>Base EXP</span>
              <span className={styles.gridValue}>{detail.baseExperience ?? '—'}</span>
            </div>
            <div className={styles.gridCell}>
              <span className={styles.gridLabel}>Catch Rate</span>
              <span className={styles.gridValue}>{detail.catchRate}</span>
            </div>
          </div>
          <div className={styles.gridCell} style={{ marginTop: '0.6rem' }}>
            <span className={styles.gridLabel}>Growth Rate</span>
            <span className={styles.gridValue}>{formatGrowthRate(detail.growthRate)}</span>
          </div>
        </div>
      </section>

      {/* ── Physical Attributes ── */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <IconBox>
            {/* bandage / ruler */}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M10 10.01v.01"/><path d="M14 14.01v.01"/>
              <path d="m7 21 10-10L7 1 3 5l4 6-4 4z"/>
              <path d="M3 5c0 1.7.68 3.26 1.76 4.4"/>
              <path d="M17 3l4 4-10 10-4-4z"/>
            </svg>
          </IconBox>
          <span className={styles.sectionTitle}>Physical Attributes</span>
        </div>
        <div className={styles.sectionBody}>
          <div className={styles.grid2}>
            <div className={styles.gridCell}>
              <span className={styles.gridLabel}>Height</span>
              <span className={styles.gridValue}>{formatHeight(detail.height)}</span>
            </div>
            <div className={styles.gridCell}>
              <span className={styles.gridLabel}>Weight</span>
              <span className={styles.gridValue}>{formatWeight(detail.weight)}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Evolution Chain ── */}
      {detail.evolutionChain.length > 1 && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <IconBox>
              {/* chain links */}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
              </svg>
            </IconBox>
            <span className={styles.sectionTitle}>Evolution Chain</span>
          </div>
          <div className={styles.sectionBody}>
            <div className={styles.evoChain}>
              {detail.evolutionChain.map((stage, i) => (
                <div key={stage.id} className={styles.evoChainInner}>
                  {i > 0 && (
                    <div className={styles.evoArrow}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                      </svg>
                      {stage.minLevel && (
                        <span className={styles.evoLevel}>Lv. {stage.minLevel}</span>
                      )}
                    </div>
                  )}
                  <div className={styles.evoStage}>
                    <img src={stage.sprite} alt={stage.name} className={styles.evoSprite} />
                    <span className={styles.evoName}>{stage.name}</span>
                    <div className={styles.evoDots}>
                      {stage.types.map((t) => (
                        <span
                          key={t.name}
                          className={styles.evoDot}
                          style={{ backgroundColor: t.color }}
                          title={t.name}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Classification ── */}
      {detail.genus && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <IconBox>
              {/* sparkle */}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275Z"/>
              </svg>
            </IconBox>
            <span className={styles.sectionTitle}>Classification</span>
          </div>
          <div className={styles.sectionBody}>
            <span className={styles.genusChip}>{detail.genus}</span>
          </div>
        </section>
      )}
    </div>
  );
}
