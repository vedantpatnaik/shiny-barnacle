import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Translate from './routes/Translate';
import Learn from './routes/Learn';
import Graph from './routes/Graph';

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.28, ease: 'easeOut' } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.2, ease: 'easeIn' } },
};

const App = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen text-white">
      <Navbar />
      <main className="px-4 sm:px-8 md:px-12 lg:px-20 pb-16 pt-8 max-w-6xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div key={location.pathname} variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <Routes location={location}>
              <Route path="/" element={<Navigate to="/translate" replace />} />
              <Route path="/translate" element={<Translate />} />
              <Route path="/learn" element={<Learn />} />
              <Route path="/graph" element={<Graph />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default App;

