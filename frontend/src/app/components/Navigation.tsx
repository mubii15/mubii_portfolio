import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';

export function Navigation() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/', label: 'Portfolio' }, // Assuming Portfolio links to section; using '/' for now or anchor if needed. User asked for "Portfolio, Contact, About" top nav. 
    // Actually, usually Portfolio Home is the gallery. 
    { path: '/contact', label: 'Contact' },
    { path: '/about', label: 'About' },
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 px-8 py-6 mix-blend-difference"
    >
      <div className="flex items-center justify-between">
        <Link to="/" className="text-xl tracking-tighter text-white relative z-50">
          MUBARAK ISMAIL
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-8 text-sm tracking-wide uppercase">
          {navItems.slice(1).map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`relative transition-opacity hover:opacity-100 ${location.pathname === item.path ? 'opacity-100' : 'opacity-50'
                }`}
            >
              {item.label}
              {location.pathname === item.path && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute -bottom-1 left-0 right-0 h-px bg-white"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
            </Link>
          ))}
        </div>

        {/* Mobile Navigation Toggle */}
        <button
          className="md:hidden text-white relative z-50 uppercase text-xs tracking-widest"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? 'Close' : 'Menu'}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-black flex flex-col items-center justify-center z-40"
          >
            <div className="flex flex-col gap-8 text-center">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`text-2xl tracking-widest uppercase transition-opacity ${location.pathname === item.path ? 'opacity-100' : 'opacity-50'
                    }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
