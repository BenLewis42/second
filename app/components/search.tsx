'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Fuse, { type IFuseOptions, type FuseResult } from 'fuse.js';

export interface SearchEntry {
  title: string;
  excerpt: string;
  tags: string[];
  category: string;
  subcategory: string;
  slug: string;
  body: string;
}

const fuseOptions: IFuseOptions<SearchEntry> = {
  keys: [
    { name: 'title', weight: 3 },
    { name: 'tags', weight: 2 },
    { name: 'excerpt', weight: 1.5 },
    { name: 'body', weight: 0.5 },
  ],
  threshold: 0.35,
  includeMatches: true,
  minMatchCharLength: 2,
  ignoreLocation: true,
};

function formatCategory(s: string) {
  return s
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

type HighlightParts = { text: string; bold: boolean }[];

function highlightMatch(
  text: string,
  indices: readonly [number, number][] | undefined
): string | HighlightParts {
  if (!indices || !text) return text;
  const chars = [...text];
  const highlighted: boolean[] = new Array(chars.length).fill(false);
  for (const [start, end] of indices) {
    for (let i = start; i <= end && i < chars.length; i++) highlighted[i] = true;
  }
  const parts: HighlightParts = [];
  let cur = { text: '', bold: highlighted[0] };
  for (let i = 0; i < chars.length; i++) {
    if (highlighted[i] !== cur.bold) {
      parts.push(cur);
      cur = { text: '', bold: highlighted[i] };
    }
    cur.text += chars[i];
  }
  parts.push(cur);
  return parts;
}

function extractSnippet(
  body: string,
  indices: readonly [number, number][] | undefined,
  radius = 60
): HighlightParts | null {
  if (!indices || indices.length === 0 || !body) return null;

  const firstMatch = indices[0];
  const start = Math.max(0, firstMatch[0] - radius);
  const end = Math.min(body.length, firstMatch[1] + radius + 1);

  const slice = body.slice(start, end);
  const offsetIndices: [number, number][] = indices
    .filter(([s, e]) => s >= start && e < end)
    .map(([s, e]) => [s - start, e - start] as [number, number]);

  const prefix = start > 0 ? '...' : '';
  const suffix = end < body.length ? '...' : '';

  const parts = highlightMatch(slice, offsetIndices);
  if (!Array.isArray(parts)) return null;

  if (prefix) parts[0] = { ...parts[0], text: prefix + parts[0].text };
  const last = parts[parts.length - 1];
  parts[parts.length - 1] = { ...last, text: last.text + suffix };

  return parts;
}

export default function Search({ entries }: { entries: SearchEntry[] }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<FuseResult<SearchEntry>[]>([]);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const fuseRef = useRef<Fuse<SearchEntry> | null>(null);

  useEffect(() => {
    fuseRef.current = new Fuse(entries, fuseOptions);
  }, [entries]);

  useEffect(() => {
    if (!fuseRef.current || query.length < 2) {
      setResults([]);
      setSelectedIdx(0);
      return;
    }
    const r = fuseRef.current.search(query, { limit: 30 });
    setResults(r);
    setSelectedIdx(0);
  }, [query]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIdx((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
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

  return (
    <div className="search-container">
      <div className="search-input-wrap">
        <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          className="search-input"
          placeholder="Search entries..."
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
            <div className="search-empty">No results for &ldquo;{query}&rdquo;</div>
          ) : (
            <div className="search-result-list">
              <div className="search-result-count">{results.length} result{results.length !== 1 ? 's' : ''}</div>
              {results.map((r, i) => {
                const titleMatch = r.matches?.find((m) => m.key === 'title');
                const bodyMatch = r.matches?.find((m) => m.key === 'body');
                const excerptMatch = r.matches?.find((m) => m.key === 'excerpt');
                const titleParts = highlightMatch(r.item.title, titleMatch?.indices);

                const snippet = bodyMatch
                  ? extractSnippet(r.item.body, bodyMatch.indices)
                  : excerptMatch
                    ? highlightMatch(r.item.excerpt, excerptMatch.indices)
                    : null;
                const showStaticExcerpt = !snippet && r.item.excerpt;

                return (
                  <a
                    key={`${r.item.category}/${r.item.subcategory}/${r.item.slug}`}
                    href={`/${r.item.category}/${r.item.subcategory}/${r.item.slug}/`}
                    className={`search-result-item ${i === selectedIdx ? 'search-result-selected' : ''}`}
                    onMouseEnter={() => setSelectedIdx(i)}
                  >
                    <div className="search-result-title">
                      {Array.isArray(titleParts)
                        ? titleParts.map((p, j) =>
                            p.bold ? <mark key={j}>{p.text}</mark> : <span key={j}>{p.text}</span>
                          )
                        : r.item.title}
                    </div>
                    {snippet && Array.isArray(snippet) ? (
                      <div className="search-result-snippet">
                        {snippet.map((p, j) =>
                          p.bold ? <mark key={j}>{p.text}</mark> : <span key={j}>{p.text}</span>
                        )}
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
