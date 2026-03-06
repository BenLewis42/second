import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { contentDir } from './content';
import { getAllContent, getAllTags, getContentByTag, getContentPathBySlug } from './markdown';
import type { ContentFile } from './markdown';

const WIKI_LINK_REGEX = /\[\[([^\]]+)\]\]/g;

export interface SuggestedTopic {
  /** Display title (from first reference, or slug title-cased) */
  title: string;
  /** Slug for filename and URLs */
  slug: string;
  /** Suggested category: philosophy | art */
  category: string;
  /** Suggested subcategory: philosophers | concepts | artists | movements */
  subcategory: string;
  /** Why this was suggested */
  reason: 'broken_wiki_link' | 'frequent_tag';
  /** Number of articles that link to or reference this */
  referenceCount: number;
  /** Articles that link to this (for broken links) or use this tag */
  referringSlugs: Array<{ category: string; subcategory: string; slug: string; title: string }>;
  /** Tags to consider for the new article (from referring articles) */
  suggestedTags: string[];
}

/**
 * Extract all [[wiki link]] targets from a markdown string.
 * Returns normalized slugs (lowercase, hyphens).
 */
function extractWikiLinkTargets(rawContent: string): string[] {
  const targets: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = WIKI_LINK_REGEX.exec(rawContent)) !== null) {
    const raw = match[1].trim();
    const slug = raw
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '');
    if (slug) targets.push(slug);
  }
  return targets;
}

/**
 * Get raw link text (as written in source) for each wiki link in content.
 */
function extractWikiLinksWithText(rawContent: string): Array<{ slug: string; raw: string }> {
  const results: Array<{ slug: string; raw: string }> = [];
  let match: RegExpExecArray | null;
  const re = new RegExp(WIKI_LINK_REGEX.source, 'g');
  while ((match = re.exec(rawContent)) !== null) {
    const raw = match[1].trim();
    const linkTarget = raw.includes('|') ? raw.split('|')[0].trim() : raw;
    const displayText = raw.includes('|') ? raw.split('|')[1]?.trim() || linkTarget : raw;
    const slug = linkTarget
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '');
    if (slug) results.push({ slug, raw: displayText });
  }
  return results;
}

/**
 * Build a set of existing slugs and a map from slug to file info.
 */
async function getExistingContentMap(): Promise<
  Map<string, { category: string; subcategory: string; slug: string; title: string }>
> {
  const all = await getAllContent();
  const map = new Map<string, { category: string; subcategory: string; slug: string; title: string }>();
  for (const file of all) {
    if (!file.category || !file.subcategory) continue;
    map.set(file.slug, {
      category: file.category,
      subcategory: file.subcategory,
      slug: file.slug,
      title: file.frontmatter.title,
    });
    const titleSlug = file.frontmatter.title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '');
    if (titleSlug && !map.has(titleSlug)) {
      map.set(titleSlug, {
        category: file.category,
        subcategory: file.subcategory,
        slug: file.slug,
        title: file.frontmatter.title,
      });
    }
  }
  return map;
}

/**
 * Infer category and subcategory for a missing topic from its referring articles.
 */
function inferCategory(
  referringSlugs: SuggestedTopic['referringSlugs'],
  slug: string
): { category: string; subcategory: string } {
  const subcats = referringSlugs.map((r) => r.subcategory);
  const isPhilosopher = /^(plato|aristotle|nietzsche|kant|hegel|socrates|descartes|wittgenstein|schopenhauer|wagner)$/i.test(slug);
  const isArtist = /^(leonardo|michelangelo|picasso|monet|van-gogh|rembrandt)$/i.test(slug);
  if (isPhilosopher || isArtist) return { category: 'people', subcategory: 'figures' };

  const philosophyCount = referringSlugs.filter((r) => r.category === 'philosophy').length;
  const artCount = referringSlugs.filter((r) => r.category === 'art').length;
  const category = artCount > philosophyCount ? 'art' : 'philosophy';
  if (category === 'philosophy') {
    if (subcats.includes('concepts')) return { category: 'philosophy', subcategory: 'concepts' };
    return { category: 'philosophy', subcategory: 'concepts' };
  }
  if (subcats.includes('movements')) return { category: 'art', subcategory: 'movements' };
  return { category: 'art', subcategory: 'movements' };
}

/**
 * Suggest new articles based on broken wiki links (referenced but no page exists).
 */
export async function getSuggestedTopicsFromConnections(): Promise<SuggestedTopic[]> {
  const allContent = await getAllContent();
  const existingMap = await getExistingContentMap();

  const missingCounts = new Map<
    string,
    { rawTitle: string; referring: SuggestedTopic['referringSlugs']; tags: Set<string> }
  >();

  for (const file of allContent) {
    if (!file.category || !file.subcategory) continue;
    const fullContent = typeof file.content === 'string' ? file.content : '';
    const links = extractWikiLinksWithText(fullContent);
    const refInfo = {
      category: file.category,
      subcategory: file.subcategory,
      slug: file.slug,
      title: file.frontmatter.title,
    };

    for (const { slug, raw } of links) {
      if (existingMap.has(slug)) continue;
      const entry = missingCounts.get(slug) ?? {
        rawTitle: raw,
        referring: [],
        tags: new Set<string>(),
      };
      entry.referring.push(refInfo);
      file.frontmatter.tags?.forEach((t) => entry.tags.add(t));
      missingCounts.set(slug, entry);
    }
  }

  const suggestions: SuggestedTopic[] = [];
  for (const [slug, data] of missingCounts) {
    if (data.referring.length === 0) continue;
    const { category, subcategory } = inferCategory(data.referring, slug);
    const title = data.rawTitle
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
    suggestions.push({
      title: title || slug,
      slug,
      category,
      subcategory,
      reason: 'broken_wiki_link',
      referenceCount: data.referring.length,
      referringSlugs: data.referring,
      suggestedTags: Array.from(data.tags).slice(0, 10),
    });
  }

  return suggestions.sort((a, b) => b.referenceCount - a.referenceCount);
}

/** Slug-normalized tag for comparison with content slugs. */
function tagToSlug(tag: string): string {
  return tag.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
}

/**
 * Unfilled tag: used by at least one entry but has no dedicated content page.
 */
export interface UnfilledTagInfo {
  tag: string;
  slug: string;
  referenceCount: number;
  referringSlugs: Array<{ category: string; subcategory: string; slug: string; title: string }>;
  suggestedTags: string[];
}

/**
 * Get all tags that are used in the wiki but have no dedicated page (unfilled tags).
 * Sorted by reference count descending.
 */
export async function getUnfilledTags(): Promise<UnfilledTagInfo[]> {
  const allTags = await getAllTags();
  const unfilled: UnfilledTagInfo[] = [];

  for (const tag of allTags) {
    const slug = tagToSlug(tag);
    const contentPath = await getContentPathBySlug(slug);
    if (contentPath !== null) continue; // has dedicated page

    const files = await getContentByTag(tag);
    if (files.length === 0) continue;

    const referringSlugs = files
      .filter((f): f is ContentFile & { category: string; subcategory: string } => !!f.category && !!f.subcategory)
      .map((f) => ({
        category: f.category,
        subcategory: f.subcategory,
        slug: f.slug,
        title: f.frontmatter.title,
      }));

    const suggestedTags = new Set<string>();
    files.forEach((f) => f.frontmatter.tags?.forEach((t) => suggestedTags.add(t)));
    suggestedTags.delete(tag);

    unfilled.push({
      tag,
      slug,
      referenceCount: files.length,
      referringSlugs,
      suggestedTags: Array.from(suggestedTags).slice(0, 10),
    });
  }

  return unfilled.sort((a, b) => b.referenceCount - a.referenceCount);
}

/**
 * Suggest new articles based on unfilled tags (tags with no dedicated page).
 */
export async function getSuggestedTopicsFromUnfilledTags(): Promise<SuggestedTopic[]> {
  const unfilled = await getUnfilledTags();

  return unfilled.map((u) => {
    const title = u.tag
      .split(/[- ]+/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
    const { category, subcategory } = inferCategory(u.referringSlugs, u.slug);
    return {
      title: title || u.tag,
      slug: u.slug,
      category,
      subcategory,
      reason: 'frequent_tag' as const,
      referenceCount: u.referenceCount,
      referringSlugs: u.referringSlugs,
      suggestedTags: u.suggestedTags.length ? u.suggestedTags.slice(0, 6) : [u.tag, 'concept'],
    };
  });
}

/**
 * All suggested topics: broken wiki links first, then unfilled tags (by reference count).
 */
export async function getAllSuggestedTopics(): Promise<SuggestedTopic[]> {
  const [fromLinks, fromTags] = await Promise.all([
    getSuggestedTopicsFromConnections(),
    getSuggestedTopicsFromUnfilledTags(),
  ]);
  const bySlug = new Map<string, SuggestedTopic>();
  for (const t of fromLinks) bySlug.set(t.slug, t);
  for (const t of fromTags) {
    if (!bySlug.has(t.slug)) bySlug.set(t.slug, t);
  }
  return Array.from(bySlug.values()).sort((a, b) => b.referenceCount - a.referenceCount);
}

/**
 * Generate a draft markdown file for a suggested topic (frontmatter + section stubs).
 */
export function generateDraftOutline(topic: SuggestedTopic): string {
  const date = new Date().toISOString().slice(0, 10);
  const categoryLabel =
    topic.subcategory === 'figures'
      ? 'People'
      : topic.subcategory === 'concepts'
        ? 'Concepts'
        : 'Movements';

  const tags = topic.suggestedTags.length
    ? topic.suggestedTags.slice(0, 6)
    : ['concept', topic.category];

  const frontmatter = `---
title: "${topic.title}"
category: "${categoryLabel}"
tags: [${tags.map((t) => `"${t}"`).join(', ')}]
date: "${date}"
excerpt: "Add a one-sentence summary."
stub: true
verified: false
---

`;

  const sections = [
    '## Overview',
    'Add a brief overview and why this topic matters in art and philosophy.',
    '',
    '## Key Ideas',
    'Outline main ideas. Use [[wiki-links]] to connect to other entries.',
    '',
    '## Connections',
    topic.referringSlugs.length
      ? `Referenced by: ${topic.referringSlugs.map((r) => `[[${r.slug}]]`).join(', ')}.`
      : 'List related entries and movements.',
    '',
    '## Sources',
    'Add sources after verification (URLs or citations).',
  ];

  return frontmatter + sections.join('\n\n') + '\n';
}

/**
 * Write a draft article to the content folder. Does not overwrite existing files.
 */
export async function writeDraftArticle(topic: SuggestedTopic): Promise<{ path: string; written: boolean }> {
  const dir = path.join(contentDir, topic.category, topic.subcategory);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const filePath = path.join(dir, `${topic.slug}.md`);
  if (fs.existsSync(filePath)) {
    return { path: filePath, written: false };
  }
  const content = generateDraftOutline(topic);
  fs.writeFileSync(filePath, content, 'utf-8');
  return { path: filePath, written: true };
}
