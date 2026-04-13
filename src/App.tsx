
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
