'use client';

import { useEffect } from 'react';

const navCategories = [
  { href: '/people', label: 'People' },
  { href: '/philosophy', label: 'Philosophy' },
  { href: '/cs', label: 'CS' },
  { href: '/science', label: 'Science' },
  { href: '/social-science', label: 'Social Science' },
  { href: '/spirit', label: 'Spirit' },
  { href: '/culture', label: 'Culture' },
  { href: '/reference', label: 'Reference' },
];

export default function Header() {
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
              <a
                key={cat.href}
                href={cat.href}
                className="nav-link"
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                {cat.label}
              </a>
            ))}
            <a
              href="/tags"
              className="nav-link-active"
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--link-color-hover)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--link-color)'}
            >
              Wiki
            </a>
            <a href="/search" className="header-search-link">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              Search
              <kbd>⌘K</kbd>
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}
