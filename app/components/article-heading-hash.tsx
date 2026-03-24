'use client';

import { useEffect } from 'react';

const SCROLL_ROOT = 'article.article .article-content';
const HEADING_SELECTOR = `${SCROLL_ROOT} h1, ${SCROLL_ROOT} h2, ${SCROLL_ROOT} h3, ${SCROLL_ROOT} h4, ${SCROLL_ROOT} h5, ${SCROLL_ROOT} h6`;

function headerOffset(): number {
  const header = document.querySelector('.header');
  const h = header?.getBoundingClientRect().height ?? 56;
  return h + 12;
}

function listHeadings(): HTMLElement[] {
  return Array.from(document.querySelectorAll<HTMLElement>(HEADING_SELECTOR)).filter(
    (el) => el.id && el.isConnected
  );
}

function activeHeadingId(headings: HTMLElement[], scrollY: number): string | null {
  if (headings.length === 0) return null;
  const probe = scrollY + headerOffset();
  let best: HTMLElement | null = null;
  for (const h of headings) {
    const top = h.getBoundingClientRect().top + window.scrollY;
    if (top <= probe) best = h;
    else break;
  }
  return best?.id ?? null;
}

function scrollToHeadingId(rawId: string) {
  if (!rawId) return;
  let id: string;
  try {
    id = decodeURIComponent(rawId);
  } catch {
    id = rawId;
  }
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'auto', block: 'start' });
}

function syncHashFromScroll() {
  const headings = listHeadings();
  const id = activeHeadingId(headings, window.scrollY);
  const base = `${window.location.pathname}${window.location.search}`;
  const next = id ? `${base}#${id}` : base;
  const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  if (next !== current) {
    history.replaceState(null, '', next);
  }
}

/**
 * Keeps the URL hash in sync with the current markdown heading while scrolling
 * (replaceState — no extra history entries). Restores scroll when using Back/Forward
 * or opening a shared link with #heading-id.
 */
export default function ArticleHeadingHash() {
  useEffect(() => {
    const applyHashScroll = () => {
      const raw = window.location.hash.slice(1);
      if (raw) {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => scrollToHeadingId(raw));
        });
      }
    };

    applyHashScroll();

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        if (listHeadings().length > 0) syncHashFromScroll();
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('popstate', applyHashScroll);
    window.addEventListener('hashchange', applyHashScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('popstate', applyHashScroll);
      window.removeEventListener('hashchange', applyHashScroll);
    };
  }, []);

  return null;
}
