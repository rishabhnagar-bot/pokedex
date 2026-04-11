/**
 * HomePage.tsx — The single page of this application.
 */

import { useState, useCallback } from 'react';
import { Navbar } from '../../components/common/Navbar';
import { TypeFilter } from '../../components/TypeFilter';
import { PokemonGrid } from '../../components/PokemonGrid';
import { PokemonModal } from '../../components/PokemonModal';
import { TeamDrawer } from '../../components/TeamDrawer';
import { CaughtAnimation } from '../../components/CaughtAnimation';
import { CardOpenEffect } from '../../components/CardOpenEffect';
import { usePokemonList } from '../../hooks/usePokemonList';
import { useTypeFilter } from '../../hooks/useTypeFilter';
import { useSearch } from '../../hooks/useSearch';
import { useTeam } from '../../hooks/useTeam';
import type { PokemonListItem, TeamMember } from '../../types';
import { MAX_TEAM_SIZE } from '../../utils/constants';
import { playCatchSound, getTier } from '../../utils/catchSound';
import type { SoundTier } from '../../utils/catchSound';
import { fetchPokemonDetail } from '../../api';
import styles from './HomePage.module.css';

interface HomePageProps {
  onBack: () => void;
}

export function HomePage({ onBack }: HomePageProps) {
  const [selectedPokemonId, setSelectedPokemonId] = useState<number | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [caughtPokemon, setCaughtPokemon] = useState<{ name: string; sprite: string; tier: SoundTier } | null>(null);
  const [openingCard, setOpeningCard] = useState<{ sprite: string; name: string } | null>(null);

  const { pokemon, isLoading, isInitialLoading, error, hasMore, loadMore } = usePokemonList();
  const { types, activeType, setActiveType, filterPokemon, isLoading: typesLoading } = useTypeFilter();
  const { searchPokemon } = useSearch();
  const { team, addMember, removeMember, clearTeam, updateMemberStats } = useTeam();

  const typeFiltered = filterPokemon(pokemon);
  const visiblePokemon = searchPokemon(typeFiltered);
  const teamIds = new Set(team.map((m) => m.id));
  const isTeamFull = team.length >= MAX_TEAM_SIZE;

  const handleCardClick = useCallback((p: PokemonListItem) => {
    setOpeningCard({ sprite: p.sprite, name: p.name });
    setSelectedPokemonId(p.id);
  }, []);

  const handleAddTeam = (member: TeamMember) => {
    addMember(member);
    const tier = getTier(member.types.map((t) => t.name));
    playCatchSound(tier);
    setCaughtPokemon({ name: member.name, sprite: member.sprite, tier });
    fetchPokemonDetail(member.id).then((detail) => {
      updateMemberStats(member.id, detail.stats);
    }).catch(() => {});
  };

  const handleReset = () => {
    clearTeam();
    setActiveType(null);
  };

  return (
    <div className={styles.page}>
      {/* White card containing navbar + filter + grid */}
      <div className={styles.card}>
        <Navbar
          team={team}
          onTeamClick={() => setIsDrawerOpen(true)}
          onBack={onBack}
          onReset={handleReset}
        />

        <TypeFilter
          types={types}
          activeType={activeType}
          onSelect={setActiveType}
          isLoading={typesLoading}
        />

        <main className={styles.main}>
          <PokemonGrid
            pokemon={visiblePokemon}
            teamIds={teamIds}
            isTeamFull={isTeamFull}
            isInitialLoading={isInitialLoading}
            isLoadingMore={isLoading && !isInitialLoading}
            error={error}
            hasMore={hasMore && !activeType}
            onCardClick={handleCardClick}
            onAddTeam={handleAddTeam}
            onRemoveTeam={removeMember}
            onLoadMore={loadMore}
          />
        </main>
      </div>

      {/* ── Floating Battle Team FAB ── */}
      <button
        className={`${styles.fab} ${isTeamFull ? styles.fabFull : ''}`}
        onClick={() => setIsDrawerOpen(true)}
        aria-label={`Battle Team — ${team.length} of 6`}
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
        <span>Battle Team</span>
        {team.length > 0 && (
          <span className={styles.fabBadge}>{team.length}</span>
        )}
      </button>

      <TeamDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        team={team}
        onRemove={removeMember}
        onClear={clearTeam}
      />

      <PokemonModal
        pokemonId={selectedPokemonId}
        onClose={() => setSelectedPokemonId(null)}
      />

      <CaughtAnimation
        pokemon={caughtPokemon}
        onDone={() => setCaughtPokemon(null)}
      />

      <CardOpenEffect
        pokemon={openingCard}
        onDone={() => setOpeningCard(null)}
      />
    </div>
  );
}
