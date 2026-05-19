
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import { TeamProvider } from './context/TeamContext';
import { LandingPage } from './pages/LandingPage';
import { HomePage } from './pages/HomePage';

type View = 'landing' | 'home';

function App() {
  const [view, setView] = useState<View>(
    () => (sessionStorage.getItem('view') as View) ?? 'landing'
  );
  // sessionStorage is used to persist the current view across page reloads, so users don't lose their place if they accidentally refresh while on the HomePage. The 'view' state is initialized from sessionStorage, defaulting to 'landing' if no value is found.
  const navigate = (v: View) => {
    sessionStorage.setItem('view', v);
    setView(v);
  };

  return (
    <ThemeProvider>
      <TeamProvider>
        <AnimatePresence mode="wait">
          {view === 'landing' ? (
            <LandingPage key="landing" onStart={() => navigate('home')} />
          ) : (
            <HomePage key="home" onBack={() => navigate('landing')} />
          )}
        </AnimatePresence>
      </TeamProvider>
    </ThemeProvider>
  );
}

export default App;
