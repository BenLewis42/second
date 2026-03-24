'use client';

import articlePaths from '@/lib/article-paths.json';

function normalizePath(p: string): string {
  const t = p.replace(/\/$/, '') || '/';
  return t;
}

export default function SurpriseMeButton() {
  const paths = articlePaths as string[];

  function go() {
    if (paths.length === 0) return;
    const current = normalizePath(
      typeof window !== 'undefined' ? window.location.pathname : ''
    );
    let next = paths[Math.floor(Math.random() * paths.length)];
    if (paths.length > 1) {
      let guard = 0;
      while (normalizePath(next) === current && guard++ < 32) {
        next = paths[Math.floor(Math.random() * paths.length)];
      }
    }
    window.location.href = next;
  }

  if (paths.length === 0) return null;

  return (
    <button
      type="button"
      className="header-surprise"
      onClick={go}
      aria-label="Open a random entry"
    >
      Surprise me
    </button>
  );
}
