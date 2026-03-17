/**
 * HomePage.tsx — The single page of this application.
 *
 * Owns all top-level state coordination:
 *   - Which Pokémon is selected (opens PokemonModal)
 *   - Whether the TeamDrawer is open
 *
 * Data flow:
 *   usePokemonList  → raw list of all loaded Pokémon
 *   useTypeFilter   → filtered subset based on active type chip
 *   useTeam         → current team members (from TeamContext)
 *
 * Layout:
 *   <Navbar>           ← sticky top bar with theme toggle + Battle Team button
 *   <TypeFilter>       ← horizontal type chip row
 *   <PokemonGrid>      ← responsive card grid with Load More
 *   <PokemonModal>     ← portal-style modal (conditionally rendered)
 *   <TeamDrawer>       ← slide-in right drawer
 */

import { useState } from 'react';
import { Navbar } from '../../components/common/Navbar';
import { TypeFilter } from '../../components/TypeFilter';
import { PokemonGrid } from '../../components/PokemonGrid';
import { PokemonModal } from '../../components/PokemonModal';
import { TeamDrawer } from '../../components/TeamDrawer';
import { usePokemonList } from '../../hooks/usePokemonList';
import { useTypeFilter } from '../../hooks/useTypeFilter';
import { useTeam } from '../../hooks/useTeam';
import type { TeamMember } from '../../types';
import { MAX_TEAM_SIZE } from '../../utils/constants';
import styles from './HomePage.module.css';

interface HomePageProps {
  onBack: () => void;
}

export function HomePage({ onBack }: HomePageProps) {
  const [selectedPokemonId, setSelectedPokemonId] = useState<number | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Data hooks
  const { pokemon, isLoading, isInitialLoading, error, hasMore, loadMore } = usePokemonList();
  const { types, activeType, setActiveType, filterPokemon, isLoading: typesLoading } = useTypeFilter();
  const { team, addMember, clearTeam } = useTeam();

  // Derived data
  const filteredPokemon = filterPokemon(pokemon);
  const teamIds = new Set(team.map((m) => m.id));
  const isTeamFull = team.length >= MAX_TEAM_SIZE;

  const handleAddTeam = (member: TeamMember) => {
    addMember(member);
  };

  const handleReset = () => {
    clearTeam();
    setActiveType(null);
  };

  return (
    <div className={styles.page}>
      <Navbar
        teamCount={team.length}
        onTeamClick={() => setIsDrawerOpen(true)}
        onBack={onBack}
        onReset={handleReset}
      />

      <main className={styles.main}>
        {/* Type filter chips — always rendered; shows skeleton while loading */}
        <TypeFilter
          types={types}
          activeType={activeType}
          onSelect={setActiveType}
          isLoading={typesLoading}
        />

        {/* Pokémon grid */}
        <PokemonGrid
          pokemon={filteredPokemon}
          teamIds={teamIds}
          isTeamFull={isTeamFull}
          isInitialLoading={isInitialLoading}
          isLoadingMore={isLoading && !isInitialLoading}
          error={error}
          hasMore={hasMore && !activeType} // Hide "Load More" when type filter is active
          onCardClick={setSelectedPokemonId}
          onAddTeam={handleAddTeam}
          onLoadMore={loadMore}
        />
      </main>

      {/* Detail modal */}
      <PokemonModal
        pokemonId={selectedPokemonId}
        onClose={() => setSelectedPokemonId(null)}
      />

      {/* Team drawer */}
      <TeamDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
}
