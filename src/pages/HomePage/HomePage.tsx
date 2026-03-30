/**
 * HomePage.tsx — The single page of this application.
 */

import { useState, useCallback } from 'react';
import { Navbar } from '../../components/common/Navbar';
import { TypeFilter } from '../../components/TypeFilter';
import { SearchBar } from '../../components/SearchBar';
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

  // Data hooks
  const { pokemon, isLoading, isInitialLoading, error, hasMore, loadMore } = usePokemonList();
  const { types, activeType, setActiveType, filterPokemon, isLoading: typesLoading } = useTypeFilter();
  const { query, setQuery, searchPokemon, hasQuery } = useSearch();
  const { team, addMember, removeMember, clearTeam, updateMemberStats } = useTeam();

  // Derived data — type filter → search filter → display
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
    setQuery('');
  };

  return (
    <div className={styles.page}>
      <Navbar
        team={team}
        onTeamClick={() => setIsDrawerOpen(true)}
        onBack={onBack}
        onReset={handleReset}
      />

      <main className={styles.main}>
        <TypeFilter
          types={types}
          activeType={activeType}
          onSelect={setActiveType}
          isLoading={typesLoading}
          searchSlot={
            <SearchBar
              query={query}
              onChange={setQuery}
              resultCount={visiblePokemon.length}
              hasQuery={hasQuery}
            />
          }
        />

        <PokemonGrid
          pokemon={visiblePokemon}
          teamIds={teamIds}
          isTeamFull={isTeamFull}
          isInitialLoading={isInitialLoading}
          isLoadingMore={isLoading && !isInitialLoading}
          error={error}
          hasMore={hasMore && !activeType && !hasQuery}
          onCardClick={handleCardClick}
          onAddTeam={handleAddTeam}
          onRemoveTeam={removeMember}
          onLoadMore={loadMore}
        />
      </main>

      <PokemonModal
        pokemonId={selectedPokemonId}
        onClose={() => setSelectedPokemonId(null)}
      />

      <TeamDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
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
