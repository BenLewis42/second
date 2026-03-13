/**
 * Stub and verified tagging for automation: determine what to populate and what to fact-check.
 * - stub: true = placeholder content; automation should populate.
 * - verified: true = fact-check applied; automation should skip fact-check.
 */
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { contentDir } from './content';
import type { Frontmatter } from './markdown';

/** Phrases that indicate stub/placeholder content (draft template only; case-insensitive). */
export const STUB_PHRASES = [
  'Add a brief overview and why this topic matters',
  'Add a one-sentence summary',
  'Outline main ideas. Use [[wiki-links]]',
  'Add sources after verification (URLs or citations)',
  'List related entries and movements',
];

export function isStubContent(body: string): boolean {
  const lower = body.toLowerCase();
  return STUB_PHRASES.some((phrase) => lower.includes(phrase.toLowerCase()));
}

/** Get all content .md paths (relative to cwd, with content/ prefix, forward slashes). */
export function getAllContentPaths(): string[] {
  const paths: string[] = [];
  if (!fs.existsSync(contentDir)) return paths;
  const categories = fs.readdirSync(contentDir);
  for (const cat of categories) {
    const catPath = path.join(contentDir, cat);
    if (!fs.statSync(catPath).isDirectory()) continue;
    const subcats = fs.readdirSync(catPath);
    for (const sub of subcats) {
      const subPath = path.join(catPath, sub);
      if (!fs.statSync(subPath).isDirectory()) continue;
      const files = fs.readdirSync(subPath).filter((f) => f.endsWith('.md'));
      for (const file of files) {
        const rel = path.join('content', cat, sub, file).split(path.sep).join(path.posix.sep);
        paths.push(rel);
      }
    }
  }
  return paths;
}

export interface ContentMeta {
  path: string;
  stub: boolean;
  verified: boolean;
}

function readMeta(filePath: string): ContentMeta | null {
  const abs = path.join(process.cwd(), filePath);
  if (!fs.existsSync(abs)) return null;
  const raw = fs.readFileSync(abs, 'utf-8');
  const { data, content } = matter(raw);
  const fm = data as Record<string, unknown>;
  const stub = fm.stub === true || (fm.stub !== false && isStubContent(content));
  const verified = fm.verified === true;
  return { path: filePath, stub, verified };
}

/** Paths of files that are stubs (frontmatter or content detection). */
export function getStubPaths(): string[] {
  return getAllContentPaths()
    .map(readMeta)
    .filter((m): m is ContentMeta => m !== null && m.stub)
    .map((m) => m.path);
}

/** Paths of files that are not verified (verified !== true). */
export function getUnverifiedPaths(): string[] {
  return getAllContentPaths()
    .map(readMeta)
    .filter((m): m is ContentMeta => m !== null && !m.verified)
    .map((m) => m.path);
}

/** Update frontmatter stub/verified for one file; write back. */
export function setStubVerified(filePath: string, stub: boolean, verified: boolean): void {
  const abs = path.join(process.cwd(), filePath);
  const absAlt = path.join(contentDir, filePath);
  const resolved = fs.existsSync(abs) ? abs : absAlt;
  if (!fs.existsSync(resolved)) return;
  const raw = fs.readFileSync(resolved, 'utf-8');
  const { data, content } = matter(raw);
  const fm = { ...(data as Record<string, unknown>), stub, verified };
  const newRaw = matter.stringify(content, fm, { lineWidth: 1000 } as never);
  fs.writeFileSync(resolved, newRaw, 'utf-8');
}

/** Tag all content: set stub/verified in frontmatter from content detection and current frontmatter. */
export function tagAllContent(): { path: string; stub: boolean; verified: boolean }[] {
  const all = getAllContentPaths();
  const results: { path: string; stub: boolean; verified: boolean }[] = [];
  for (const filePath of all) {
    const abs = path.join(process.cwd(), filePath);
    if (!fs.existsSync(abs)) continue;
    const raw = fs.readFileSync(abs, 'utf-8');
    const { data, content } = matter(raw);
    const fm = data as Record<string, unknown>;
    const detectedStub = isStubContent(content);
    const stub = fm.stub === true || (fm.stub !== false && detectedStub);
    const verified = fm.verified === true;
    const next = { ...fm, stub, verified };
    const newRaw = matter.stringify(content, next, { lineWidth: 1000 } as never);
    fs.writeFileSync(abs, newRaw, 'utf-8');
    results.push({ path: filePath, stub, verified });
  }
  return results;
}
