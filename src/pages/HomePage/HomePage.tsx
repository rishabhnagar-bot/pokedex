/**
 * HomePage.tsx — The single page of this application.
 */

import { useState, useCallback } from 'react';
import { Users } from 'lucide-react';
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

  return (
    <div className={styles.page}>
      {/* White card containing navbar + filter + grid */}
      <div className={styles.card}>
        <Navbar onBack={onBack} />

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
        <Users size={17} aria-hidden />
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
