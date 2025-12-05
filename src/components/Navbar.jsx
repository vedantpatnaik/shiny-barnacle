import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const navItems = [
  { label: 'Translate', path: '/translate' },
  { label: 'Learn', path: '/learn' },
  { label: 'Graph', path: '/graph' },
];

const Navbar = () => {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-30 backdrop-blur-xl bg-slate/40 border-b border-white/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 md:px-12 lg:px-20 py-4 flex items-center justify-between">
        <Link to="/translate" className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-orchid to-mint flex items-center justify-center shadow-soft">
            <span className="text-slate font-semibold">AI</span>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-semibold">Indigenous Intelligence</span>
            <span className="text-sm text-white/60">Translate · Learn · Graph</span>
          </div>
        </Link>
        <nav className="flex items-center gap-1 rounded-2xl p-1 glass border border-white/10">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="relative px-4 py-2 text-sm font-medium rounded-xl text-white/80"
              >
                {active && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 bg-white/10 rounded-xl"
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  />
                )}
                <span className="relative">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;

