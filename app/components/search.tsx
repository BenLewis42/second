'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export interface SearchEntry {
  title: string;
  excerpt: string;
  tags: string[];
  category: string;
  subcategory: string;
  slug: string;
  body: string;
}

interface SearchResult {
  item: SearchEntry;
  titleIndices: [number, number][];
  bodyIndices: [number, number][];
  excerptIndices: [number, number][];
  matchedOn: 'title' | 'tags' | 'excerpt' | 'body';
}

function findAllIndices(text: string, phrase: string): [number, number][] {
  const indices: [number, number][] = [];
  const lower = text.toLowerCase();
  const target = phrase.toLowerCase();
  let pos = 0;
  while (pos < lower.length) {
    const idx = lower.indexOf(target, pos);
    if (idx === -1) break;
    indices.push([idx, idx + target.length - 1]);
    pos = idx + 1;
  }
  return indices;
}

function searchEntries(entries: SearchEntry[], query: string): SearchResult[] {
  const q = query.toLowerCase();
  const results: SearchResult[] = [];

  for (const item of entries) {
    const titleIndices = findAllIndices(item.title, q);
    const bodyIndices = findAllIndices(item.body, q);
    const excerptIndices = findAllIndices(item.excerpt, q);
    const tagMatch = item.tags.some((t) => t.toLowerCase().includes(q));

    if (titleIndices.length || bodyIndices.length || excerptIndices.length || tagMatch) {
      const matchedOn = titleIndices.length
        ? 'title'
        : excerptIndices.length
          ? 'excerpt'
          : bodyIndices.length
            ? 'body'
            : 'tags';
      results.push({ item, titleIndices, bodyIndices, excerptIndices, matchedOn });
    }
  }

  results.sort((a, b) => {
    const order = { title: 0, tags: 1, excerpt: 2, body: 3 };
    return order[a.matchedOn] - order[b.matchedOn];
  });

  return results.slice(0, 40);
}

function formatCategory(s: string) {
  return s
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

type HighlightParts = { text: string; bold: boolean }[];

function buildHighlight(text: string, indices: [number, number][]): HighlightParts {
  if (!indices.length || !text) return [{ text, bold: false }];
  const parts: HighlightParts = [];
  let cursor = 0;
  for (const [start, end] of indices) {
    if (start > cursor) parts.push({ text: text.slice(cursor, start), bold: false });
    parts.push({ text: text.slice(start, end + 1), bold: true });
    cursor = end + 1;
  }
  if (cursor < text.length) parts.push({ text: text.slice(cursor), bold: false });
  return parts;
}

function extractSnippet(
  body: string,
  indices: [number, number][],
  radius = 80
): HighlightParts | null {
  if (!indices.length || !body) return null;

  const first = indices[0];
  const start = Math.max(0, first[0] - radius);
  const end = Math.min(body.length, first[1] + radius + 1);
  const slice = body.slice(start, end);

  const localIndices: [number, number][] = indices
    .filter(([s, e]) => s >= start && e < end)
    .map(([s, e]) => [s - start, e - start] as [number, number]);

  const parts = buildHighlight(slice, localIndices);
  const prefix = start > 0 ? '...' : '';
  const suffix = end < body.length ? '...' : '';

  if (prefix) parts[0] = { ...parts[0], text: prefix + parts[0].text };
  const last = parts[parts.length - 1];
  parts[parts.length - 1] = { ...last, text: last.text + suffix };

  return parts;
}

function renderParts(parts: HighlightParts) {
  return parts.map((p, j) =>
    p.bold ? <mark key={j}>{p.text}</mark> : <span key={j}>{p.text}</span>
  );
}

export default function Search({ entries }: { entries: SearchEntry[] }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setSelectedIdx(0);
      return;
    }
    setResults(searchEntries(entries, query));
    setSelectedIdx(0);
  }, [query, entries]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (results.length === 0) return;
        setSelectedIdx((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (results.length === 0) return;
        setSelectedIdx((i) => Math.max(i - 1, 0));
      } else if (e.key === 'Enter' && results[selectedIdx]) {
        const item = results[selectedIdx].item;
        window.location.href = `/${item.category}/${item.subcategory}/${item.slug}/`;
      }
    },
    [results, selectedIdx]
  );

  useEffect(() => {
    function onGlobalKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        inputRef.current?.blur();
        setQuery('');
      }
    }
    window.addEventListener('keydown', onGlobalKey);
    return () => window.removeEventListener('keydown', onGlobalKey);
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (query.length < 2 || results.length === 0) return;
    const el = document.querySelector<HTMLElement>(`[data-search-idx="${selectedIdx}"]`);
    el?.scrollIntoView({ block: 'nearest', behavior: 'auto' });
  }, [selectedIdx, results, query]);

  return (
    <div className="search-container" role="search" aria-label="Search this site">
      <div className="search-input-wrap">
        <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          ref={inputRef}
          type="search"
          className="search-input"
          placeholder="Search entries..."
          aria-label="Search entries by title, tags, or text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          spellCheck={false}
        />
        <kbd className="search-kbd">
          {typeof navigator !== 'undefined' && /Mac/.test(navigator.userAgent) ? '⌘' : 'Ctrl'}+K
        </kbd>
      </div>

      {query.length >= 2 && (
        <div className="search-results">
          {results.length === 0 ? (
            <div className="search-empty" role="status" aria-live="polite">
              No results for &ldquo;{query}&rdquo;
            </div>
          ) : (
            <div className="search-result-list">
              <div className="search-result-count" role="status" aria-live="polite">
                {results.length} result{results.length !== 1 ? 's' : ''}
              </div>
              {results.map((r, i) => {
                const titleParts = r.titleIndices.length
                  ? buildHighlight(r.item.title, r.titleIndices)
                  : null;

                const snippet = r.bodyIndices.length
                  ? extractSnippet(r.item.body, r.bodyIndices)
                  : r.excerptIndices.length
                    ? buildHighlight(r.item.excerpt, r.excerptIndices)
                    : null;

                const showStaticExcerpt = !snippet && r.item.excerpt;

                return (
                  <a
                    key={`${r.item.category}/${r.item.subcategory}/${r.item.slug}`}
                    data-search-idx={i}
                    href={`/${r.item.category}/${r.item.subcategory}/${r.item.slug}/`}
                    className={`search-result-item ${i === selectedIdx ? 'search-result-selected' : ''}`}
                    onMouseEnter={() => setSelectedIdx(i)}
                  >
                    <div className="search-result-title">
                      {titleParts ? renderParts(titleParts) : r.item.title}
                    </div>
                    {snippet ? (
                      <div className={r.bodyIndices.length ? 'search-result-snippet' : 'search-result-excerpt'}>
                        {renderParts(snippet)}
                      </div>
                    ) : showStaticExcerpt ? (
                      <div className="search-result-excerpt">{r.item.excerpt}</div>
                    ) : null}
                    <div className="search-result-meta">
                      <span className="search-result-category">
                        {formatCategory(r.item.category)}
                      </span>
                      {r.item.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="tag tag-small">{tag}</span>
                      ))}
                    </div>
                  </a>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
