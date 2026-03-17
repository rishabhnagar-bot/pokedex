/**
 * App.tsx — Application root and page router.
 *
 * Two views:
 *   'landing' — full-screen hero (LandingPage)
 *   'home'    — main Pokédex grid (HomePage)
 *
 * Providers are mounted OUTSIDE the view switch so that team and theme
 * state persist when the user navigates back to the landing page and
 * returns to the grid — their team is still intact.
 *
 * On browser refresh: useState resets to 'landing' and all context
 * state (team, theme) reinitialises to defaults automatically.
 */

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import { TeamProvider } from './context/TeamContext';
import { LandingPage } from './pages/LandingPage';
import { HomePage } from './pages/HomePage';

type View = 'landing' | 'home';

function App() {
  const [view, setView] = useState<View>('landing');

  return (
    <ThemeProvider>
      <TeamProvider>
        <AnimatePresence mode="wait">
          {view === 'landing' ? (
            <LandingPage key="landing" onStart={() => setView('home')} />
          ) : (
            <HomePage key="home" onBack={() => setView('landing')} />
          )}
        </AnimatePresence>
      </TeamProvider>
    </ThemeProvider>
  );
}

export default App;
