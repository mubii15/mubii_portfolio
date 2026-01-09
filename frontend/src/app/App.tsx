import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Navigation } from './components/Navigation';
import { CustomCursor } from './components/CustomCursor';
import { Preloader } from './components/Preloader';
import { ScrollToTop } from './components/ScrollToTop';
import { Home } from './pages/Home';
import { Photography } from './pages/Photography';
import { Cinematography } from './pages/Cinematography';
import { VFX } from './pages/VFX';
import { ContemporaryArt } from './pages/ContemporaryArt';
import { About } from './pages/About';

function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <>
      <Navigation />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <PageTransition>
                <Home />
              </PageTransition>
            }
          />
          <Route
            path="/photography"
            element={
              <PageTransition>
                <Photography />
              </PageTransition>
            }
          />
          <Route
            path="/cinematography"
            element={
              <PageTransition>
                <Cinematography />
              </PageTransition>
            }
          />
          <Route
            path="/vfx"
            element={
              <PageTransition>
                <VFX />
              </PageTransition>
            }
          />
          <Route
            path="/art"
            element={
              <PageTransition>
                <ContemporaryArt />
              </PageTransition>
            }
          />
          <Route
            path="/about"
            element={
              <PageTransition>
                <About />
              </PageTransition>
            }
          />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Router>
      <div className="min-h-screen bg-black text-white">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <Preloader key="preloader" onComplete={() => setIsLoading(false)} />
          ) : (
            <>
              <ScrollToTop />
              <CustomCursor />
              <AnimatedRoutes />
            </>
          )}
        </AnimatePresence>
      </div>
    </Router>
  );
}
