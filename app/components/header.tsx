'use client';

import { useEffect, useState } from 'react';
import SurpriseMeButton from './surprise-me-button';

const navCategories = [
  { href: '/people', label: 'People' },
  { href: '/philosophy', label: 'Philosophy' },
  { href: '/cs', label: 'CS' },
  { href: '/science', label: 'Science' },
  { href: '/social-science', label: 'Social Sci' },
  { href: '/spirit', label: 'Spirit' },
  { href: '/culture', label: 'Culture' },
  { href: '/reference', label: 'Ref' },
];

export default function Header() {
  const [shortcutLabel, setShortcutLabel] = useState('Ctrl+K');

  useEffect(() => {
    if (typeof navigator !== 'undefined' && /Mac/.test(navigator.userAgent)) {
      setShortcutLabel('⌘K');
    }
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        window.location.href = '/search/';
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <header className="header">
      <nav className="header-nav">
        <div className="header-container">
          <a href="/" className="header-logo">
            Second
          </a>
          <div className="header-links">
            {navCategories.map((cat) => (
              <a key={cat.href} href={cat.href} className="nav-link">
                {cat.label}
              </a>
            ))}
            <a href="/tags" className="nav-link-active">
              Wiki
            </a>
            <SurpriseMeButton />
            <a href="/search" className="header-search-link">
              [search]
              <kbd>{shortcutLabel}</kbd>
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}
