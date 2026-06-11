import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Twitter, Instagram, Youtube } from 'lucide-react';
import { Logo } from './Logo';

export function Navigation() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/gallery/all', label: 'Portfolio' },
    { path: '/contact', label: 'Contact' },
    { path: '/about', label: 'About' },
  ];

  if (location.pathname.startsWith('/admin')) return null;
  if (location.pathname.startsWith('/project/')) return null;

  return (
    <>
      {/* Nav bar */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 px-8 py-6 mix-blend-difference"
      >
        <div className="flex items-center justify-between">
          <Link to="/" className="relative z-50 hover:opacity-80 transition-opacity">
            <Logo className="w-6 md:w-8 h-auto text-white" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex gap-8 text-sm tracking-wide uppercase">
              {navItems.slice(1).map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative transition-opacity hover:opacity-100 ${location.pathname === item.path ? 'opacity-100' : 'opacity-50'}`}
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

            <div className="flex items-center gap-6 ml-4 border-l border-white/20 pl-8">
              <a href="https://twitter.com/mubii_15" target="_blank" rel="noopener noreferrer" className="opacity-50 hover:opacity-100 transition-opacity">
                <Twitter size={18} />
              </a>
              <a href="https://www.instagram.com/mubii15" target="_blank" rel="noopener noreferrer" className="opacity-50 hover:opacity-100 transition-opacity">
                <Instagram size={18} />
              </a>
              <a href="http://youtube.com/@mubii15" target="_blank" rel="noopener noreferrer" className="opacity-50 hover:opacity-100 transition-opacity">
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-white relative z-50 uppercase text-xs tracking-widest"
            onClick={() => setIsOpen(true)}
          >
            Menu
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu — rendered via Portal directly on <body> to escape mix-blend-difference */}
      {createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 bg-black text-white flex flex-col"
              style={{ zIndex: 9999 }}
            >
              {/* Top bar */}
              <div className="flex items-center justify-between px-8 py-6">
                <Link to="/" onClick={() => setIsOpen(false)}>
                  <Logo className="w-7 h-auto text-white" />
                </Link>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white text-xs font-bold tracking-[0.3em] uppercase opacity-60 hover:opacity-100 transition-opacity"
                >
                  Close
                </button>
              </div>

              {/* Nav links */}
              <div className="flex-1 flex flex-col items-start justify-center px-10 gap-5">
                {navItems.map((item, i) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 + 0.1 }}
                  >
                    <Link
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`text-5xl font-bold tracking-tighter uppercase transition-opacity hover:opacity-100 ${
                        location.pathname === item.path ? 'opacity-100' : 'opacity-25'
                      }`}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Bottom socials */}
              <div className="flex items-center gap-8 px-10 pb-12">
                <a href="https://twitter.com/mubii_15" target="_blank" rel="noopener noreferrer" className="opacity-40 hover:opacity-100 transition-opacity">
                  <Twitter size={20} />
                </a>
                <a href="https://www.instagram.com/mubii15" target="_blank" rel="noopener noreferrer" className="opacity-40 hover:opacity-100 transition-opacity">
                  <Instagram size={20} />
                </a>
                <a href="http://youtube.com/@mubii15" target="_blank" rel="noopener noreferrer" className="opacity-40 hover:opacity-100 transition-opacity">
                  <Youtube size={20} />
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
