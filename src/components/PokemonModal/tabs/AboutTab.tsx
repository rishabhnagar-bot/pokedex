import type { PokemonDetail } from '../../../types';
import { BookOpen, Dumbbell, Ruler, GitBranch, ArrowRight, Sparkles } from 'lucide-react';
import { formatHeight, formatWeight, formatGrowthRate } from '../../../utils/statHelpers';
import styles from './AboutTab.module.css';

interface AboutTabProps {
  detail: PokemonDetail;
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
            <IconBox><BookOpen size={14} aria-hidden /></IconBox>
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
          <IconBox><Dumbbell size={14} aria-hidden /></IconBox>
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
          <IconBox><Ruler size={14} aria-hidden /></IconBox>
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
            <IconBox><GitBranch size={14} aria-hidden /></IconBox>
            <span className={styles.sectionTitle}>Evolution Chain</span>
          </div>
          <div className={styles.sectionBody}>
            <div className={styles.evoChain}>
              {detail.evolutionChain.map((stage, i) => (
                <div key={stage.id} className={styles.evoChainInner}>
                  {i > 0 && (
                    <div className={styles.evoArrow}>
                      <ArrowRight size={14} aria-hidden />
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
            <IconBox><Sparkles size={14} aria-hidden /></IconBox>
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
