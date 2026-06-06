import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar({ onEnquiryClick, onJoinTrainingClick }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileExpanded, setMobileExpanded] = useState({ 'About Us': false, 'Courses': false });
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleNavLinkClick = (e, path) => {
    if (path.startsWith('http')) return;

    if (location.pathname === '/') {
      if (path === '/') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setIsOpen(false);
      } else if (path.startsWith('/')) {
        const sectionId = path.substring(1);
        const element = document.getElementById(`${sectionId}-section`);
        if (element) {
          e.preventDefault();
          element.scrollIntoView({ behavior: 'smooth' });
          setIsOpen(false);
        }
      }
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    {
      name: 'About Us',
      dropdown: [
        { name: 'About Us', path: '/about' },
        { name: 'Our Team', path: '/team' },
      ],
    },
    { name: 'Gallery', path: '/gallery' },
    {
      name: 'Courses',
      dropdown: [
        { name: 'Courses', path: '/courses' },
        { name: 'Careers', path: '/career' },
      ],
    },
    { name: 'Contact Us', path: '/contact' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-[40] transition-all duration-300 px-4 md:px-8 pointer-events-none ${
          scrolled ? 'pt-2' : 'pt-4'
        }`}
      >
        <div
          className={`max-w-7xl mx-auto transition-all duration-300 rounded-full border border-white/5 pointer-events-auto ${
            scrolled
              ? 'glass-panel bg-dark-900/75 py-2.5 px-6 shadow-glow-violet/10'
              : 'bg-transparent py-4 px-4'
          }`}
        >
          <div className="flex items-center justify-between">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 relative">
                <svg className="w-full h-full text-transparent" viewBox="0 0 100 100">
                  <defs>
                    <linearGradient id="navLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#8B5CF6" stopOpacity="1" />
                      <stop offset="100%" stopColor="#06B6D4" stopOpacity="1" />
                    </linearGradient>
                  </defs>
                  <polygon
                    points="50,8 88,30 88,70 50,92 12,70 12,30"
                    stroke="url(#navLogoGrad)"
                    strokeWidth="4"
                    fill="none"
                  />
                  <circle cx="50" cy="50" r="3" fill="#06B6D4" />
                  <path d="M32 38 V62 H44" stroke="url(#navLogoGrad)" strokeWidth="6" strokeLinecap="round" fill="none" />
                  <path d="M54 38 H46 V47 H54 V59 H46" stroke="url(#navLogoGrad)" strokeWidth="6" strokeLinecap="round" fill="none" />
                  <path d="M68 38 H60 V47 H68 V59 H60" stroke="url(#navLogoGrad)" strokeWidth="6" strokeLinecap="round" fill="none" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-outfit text-lg md:text-xl font-extrabold tracking-wider bg-gradient-to-r from-white via-slate-100 to-primary-cyan bg-clip-text text-transparent group-hover:to-primary-violet transition-all duration-300">
                  LIGAND SOFTWARE
                </span>
                <span className="text-[8px] font-mono tracking-wider text-slate-400 uppercase hidden sm:block">
                  Exclusive Softwares for Innovative Minds
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                if (link.dropdown) {
                  const isDropdownActive = activeDropdown === link.name;
                  const isSubLinkActive = link.dropdown.some((sub) => location.pathname === sub.path);

                  return (
                    <div
                      key={link.name}
                      className="relative py-2"
                      onMouseEnter={() => setActiveDropdown(link.name)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      <button
                        className={`px-4 py-1.5 text-sm font-medium font-outfit tracking-wide transition-colors duration-200 hover:text-white flex items-center gap-1.5 cursor-pointer rounded-full ${
                          isSubLinkActive ? 'text-primary-cyan' : 'text-slate-300'
                        }`}
                      >
                        {link.name}
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform duration-200 ${
                            isDropdownActive ? 'rotate-180 text-primary-cyan' : 'text-slate-400'
                          }`}
                        />
                      </button>

                      <AnimatePresence>
                        {isDropdownActive && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute left-0 mt-2.5 w-44 glass-panel rounded-2xl p-2 border border-white/10 shadow-glass-md flex flex-col gap-1 z-50 bg-dark-900/95"
                          >
                            {link.dropdown.map((sub) => (
                              <NavLink
                                key={sub.name}
                                to={sub.path}
                                onClick={(e) => handleNavLinkClick(e, sub.path)}
                                className={({ isActive }) =>
                                  `px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-xl transition-all duration-200 text-left cursor-pointer ${
                                    isActive
                                      ? 'bg-gradient-to-r from-primary-violet/20 to-primary-cyan/20 border border-primary-cyan/30 text-primary-cyan shadow-glow-cyan/5'
                                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                                  }`
                                }
                              >
                                {sub.name}
                              </NavLink>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }

                return (
                  <NavLink
                    key={link.name}
                    to={link.path}
                    onClick={(e) => handleNavLinkClick(e, link.path)}
                    className={({ isActive }) =>
                      `relative px-4 py-2 text-sm font-medium font-outfit tracking-wide transition-colors duration-200 hover:text-white rounded-full ${
                        isActive ? 'text-primary-cyan' : 'text-slate-300'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {link.name}
                        {isActive && (
                          <motion.div
                            layoutId="activeNavIndicator"
                            className="absolute inset-0 bg-white/[0.04] border border-white/10 rounded-full -z-10 shadow-glass-sm"
                            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </nav>

            {/* Desktop CTAs */}
            <div className="hidden lg:flex items-center gap-3">
              <a
                href="https://liganddevelopers.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold uppercase tracking-wider text-primary-cyan hover:text-white px-4 py-2 border border-primary-cyan/30 rounded-full hover:bg-primary-cyan/10 transition-all cursor-pointer"
              >
                LSM Platform
              </a>
              <button
                onClick={onJoinTrainingClick}
                className="group text-xs font-semibold uppercase tracking-wider text-dark-900 bg-gradient-to-r from-primary-violet to-primary-cyan px-5 py-2.5 rounded-full hover:shadow-glow-violet/30 transition-all duration-300 flex items-center gap-1.5 cursor-pointer hover:scale-105"
              >
                Join Training
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden text-slate-300 hover:text-white p-2 rounded-xl border border-white/5 hover:border-white/15 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* ─── Mobile Side Drawer ─────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="drawer-backdrop"
              className="fixed inset-0 z-[45] bg-black/60 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Drawer Panel */}
            <motion.aside
              key="drawer-panel"
              className="fixed top-0 right-0 bottom-0 z-[50] w-[280px] max-w-[85vw] lg:hidden flex flex-col bg-dark-900/98 backdrop-blur-xl border-l border-white/10 overflow-y-auto"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', ease: [0.76, 0, 0.24, 1], duration: 0.4 }}
            >
              {/* Decorative glows */}
              <div className="absolute top-1/4 -left-10 w-48 h-48 bg-primary-violet/15 rounded-full blur-[80px] pointer-events-none" />
              <div className="absolute bottom-1/4 right-0 w-48 h-48 bg-primary-cyan/10 rounded-full blur-[80px] pointer-events-none" />

              {/* Drawer Header */}
              <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/[0.07]">
                <span className="font-outfit text-sm font-bold tracking-widest text-slate-400 uppercase">
                  Menu
                </span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Nav Links */}
              <nav className="flex flex-col gap-1 px-4 pt-4 flex-1">
                {navLinks.map((link, idx) => {
                  if (link.dropdown) {
                    const isExpanded = mobileExpanded[link.name];
                    const isSubActive = link.dropdown.some((sub) => location.pathname === sub.path);

                    return (
                      <motion.div
                        key={link.name}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 + idx * 0.05 }}
                      >
                        <button
                          onClick={() =>
                            setMobileExpanded((prev) => ({
                              ...prev,
                              [link.name]: !prev[link.name],
                            }))
                          }
                          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold font-outfit tracking-wide transition-colors cursor-pointer ${
                            isSubActive
                              ? 'text-primary-cyan bg-primary-cyan/5'
                              : 'text-slate-300 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          {link.name}
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-200 ${
                              isExpanded ? 'rotate-180 text-primary-cyan' : 'text-slate-500'
                            }`}
                          />
                        </button>

                        <AnimatePresence initial={false}>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.22, ease: 'easeInOut' }}
                              className="overflow-hidden"
                            >
                              <div className="ml-4 mt-1 mb-1 flex flex-col gap-0.5 border-l-2 border-white/10 pl-3">
                                {link.dropdown.map((sub) => {
                                  const isSubItemActive = location.pathname === sub.path;
                                  return (
                                    <Link
                                      key={sub.name}
                                      to={sub.path}
                                      onClick={(e) => {
                                        setIsOpen(false);
                                        handleNavLinkClick(e, sub.path);
                                      }}
                                      className={`block px-3 py-2 rounded-lg text-sm font-outfit transition-colors cursor-pointer ${
                                        isSubItemActive
                                          ? 'text-primary-cyan font-semibold bg-primary-cyan/5'
                                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                                      }`}
                                    >
                                      {sub.name}
                                    </Link>
                                  );
                                })}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  }

                  const isActive = location.pathname === link.path;
                  return (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 + idx * 0.05 }}
                    >
                      <Link
                        to={link.path}
                        onClick={(e) => {
                          setIsOpen(false);
                          handleNavLinkClick(e, link.path);
                        }}
                        className={`block px-4 py-3 rounded-xl text-sm font-semibold font-outfit tracking-wide transition-colors cursor-pointer ${
                          isActive
                            ? 'text-primary-cyan bg-primary-cyan/5 border border-primary-cyan/15'
                            : 'text-slate-300 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {link.name}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              {/* Drawer Footer CTAs */}
              <motion.div
                className="px-4 pb-8 pt-4 border-t border-white/[0.07] flex flex-col gap-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <a
                  href="https://liganddevelopers.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center py-2.5 rounded-full border border-primary-cyan/30 text-primary-cyan hover:text-white hover:bg-primary-cyan/10 font-semibold font-outfit tracking-wide text-sm transition-all cursor-pointer"
                >
                  LSM Platform
                </a>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onJoinTrainingClick();
                  }}
                  className="w-full text-center py-2.5 rounded-full bg-gradient-to-r from-primary-violet to-primary-cyan text-dark-900 font-bold font-outfit tracking-wide flex items-center justify-center gap-2 cursor-pointer text-sm"
                >
                  Join Training
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}