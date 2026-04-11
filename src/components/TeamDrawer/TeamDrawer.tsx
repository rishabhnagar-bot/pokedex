import { useEffect, useState } from 'react';
import type { MouseEvent } from 'react';
import { TeamTab } from './tabs/TeamTab';
import { TeamStatsTab } from './tabs/StatsTab';
import { CoverageTab } from './tabs/CoverageTab';
import type { TeamMember } from '../../types';
import type { DrawerTab } from '../../utils/constants';
import { DRAWER_TABS } from '../../utils/constants';
import styles from './TeamDrawer.module.css';

const TAB_LABELS: Record<DrawerTab, string> = {
  team: 'Team',
  stats: 'Stats',
  coverage: 'Coverage',
};

interface TeamDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  team: TeamMember[];
  onRemove: (id: number) => void;
  onClear: () => void;
}

export function TeamDrawer({ isOpen, onClose, team, onRemove, onClear }: TeamDrawerProps) {
  const [activeTab, setActiveTab] = useState<DrawerTab>('team');

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleClearAll = () => {
    onClear();
  };

  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <>
      {isOpen && (
        <div className={styles.backdrop} onClick={handleBackdropClick} aria-hidden="true" />
      )}

      <aside
        className={[styles.drawer, isOpen ? styles.open : ''].join(' ')}
        aria-label="Battle Team"
        role="complementary"
      >
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>Your Battle Team</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close drawer">✕</button>
        </div>

        {/* Segmented tab bar */}
        <div className={styles.tabBar}>
          <div className={styles.tabSegment} role="tablist">
            {DRAWER_TABS.map((tab) => (
              <button
                key={tab}
                role="tab"
                aria-selected={activeTab === tab}
                className={[styles.tab, activeTab === tab ? styles.tabActive : ''].join(' ')}
                onClick={() => setActiveTab(tab)}
              >
                {TAB_LABELS[tab]}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div className={styles.content}>
          {activeTab === 'team'     && <TeamTab members={team} onRemove={onRemove} onClear={handleClearAll} />}
          {activeTab === 'stats'    && <TeamStatsTab members={team} />}
          {activeTab === 'coverage' && <CoverageTab members={team} />}
        </div>
      </aside>
    </>
  );
}
