'use client';

import { useState, useEffect } from 'react';
import { navItems } from '@/config/navigation';
import ThemeToggle from './ThemeToggle';

const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 16);
    fn();
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-[background-color,border-color,box-shadow] duration-200 ${
        scrolled ? 'bg-paper/90 backdrop-blur-md border-b border-rule shadow-sm' : ''
      }`}
      aria-label="Primary"
    >
      <div className="max-w-[820px] mx-auto px-5 flex h-12 items-center justify-between">
        <a href="#home" className="font-mono text-sm text-ink hover:text-accent transition-colors">
          m.elsheikh
        </a>

        <ul className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <li key={item.id}>
              <a href={`#${item.id}`} className="text-xs text-ink-muted hover:text-ink transition-colors">
                {item.name}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 -mr-2 text-ink-muted hover:text-ink"
            aria-label="Menu"
            aria-expanded={open}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              {open
                ? <path strokeLinecap="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-rule bg-paper/95 backdrop-blur-md">
          <ul className="max-w-[820px] mx-auto px-5 py-3 space-y-1">
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={() => setOpen(false)}
                  className="block py-2 text-sm text-ink-muted hover:text-ink transition-colors"
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
