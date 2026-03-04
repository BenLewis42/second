/**
 * Extract factual claims from wiki markdown for verification.
 * Usage: npm run extract-claims -- <path-to.md> [path2.md ...]
 *        npm run extract-claims -- content/people/figures/plato.md
 * Output: JSON with file, hasSourcesSection, and claims[] (one per line to stdout).
 */
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const MIN_WORDS = 6;
const FACTUAL_VERBS = /\b(was|were|is|are|had|have|has|believed|said|wrote|developed|founded|influenced|born|died|argued|claimed|thought|taught|rejected|created|published|translated)\b/i;
const YEAR_PATTERN = /\b(1[0-9]{3}|2[0-9]{3})\b/; // 1000-2999

function stripMarkdown(text: string): string {
  return text
    .replace(/^#+\s*/gm, '')
    .replace(/^---\s*$/gm, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^[-*]\s+/gm, '')
    .replace(/^>\s*/gm, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function sentenceSplit(text: string): string[] {
  const normalized = text.replace(/\s+/g, ' ').trim();
  const chunks = normalized.split(/(?<=[.!?])\s+/);
  const out: string[] = [];
  for (const c of chunks) {
    const t = c.trim();
    if (t.length > 0 && t.length < 400) out.push(t);
  }
  return out;
}

function looksFactual(sentence: string): boolean {
  const words = sentence.split(/\s+/).filter(Boolean);
  if (words.length < MIN_WORDS) return false;
  if (FACTUAL_VERBS.test(sentence)) return true;
  if (YEAR_PATTERN.test(sentence)) return true;
  if (/\b(philosopher|artist|thinker|writer|author)\b/i.test(sentence)) return true;
  return false;
}

function hasSourcesSection(content: string): boolean {
  return /^(##|###)\s*Sources\s*$/im.test(content);
}

function flushQuote(acc: string[], out: string[]): void {
  if (acc.length > 0) {
    out.push(acc.join(' ').replace(/\s+/g, ' ').trim());
  }
}

function extractBlockquotes(content: string): string[] {
  const lines = content.split(/\r?\n/);
  const quotes: string[] = [];
  let current: string[] = [];
  for (const line of lines) {
    if (line.startsWith('>')) {
      current.push(line.replace(/^>\s?/, '').trim());
    } else {
      flushQuote(current, quotes);
      current = [];
    }
  }
  flushQuote(current, quotes);
  return quotes.filter((q) => q.length > 0);
}

export interface ExtractResult {
  file: string;
  title: string;
  hasSourcesSection: boolean;
  claims: string[];
  quotes: string[];
}

export function extractClaims(mdPath: string): ExtractResult {
  const raw = fs.readFileSync(mdPath, 'utf-8');
  const { data, content } = matter(raw);
  const plain = stripMarkdown(content);
  const sentences = sentenceSplit(plain);
  const claims = sentences.filter(looksFactual).filter((s) => s.length < 350);
  const quotes = extractBlockquotes(content);
  const rel = path.relative(process.cwd(), mdPath);
  return {
    file: rel.split(path.sep).join(path.posix.sep),
    title: (data?.title as string) || path.basename(mdPath, '.md'),
    hasSourcesSection: hasSourcesSection(content),
    claims,
    quotes,
  };
}

const CURSOR_PROMPT = `You are a fact-checker for an encyclopedia. For each claim below, reply with one line: ACCURATE, INACCURATE, or UNCERTAIN, then a short reason. Use scholarly consensus (e.g. SEP, Britannica). When in doubt, say UNCERTAIN. Do not guess.`;

const CURSOR_QUOTES_PROMPT = `Confirm the following quoted passages: check that each is accurately attributed and correctly transcribed (or a standard translation). For each, reply ACCURATE, INACCURATE, or UNCERTAIN with a brief reason. Do not guess.`;

const CURSOR_REPLY_FORMAT = `

---
Reply format (so your reply can be used to apply updates): For each item give one line: "N. VERDICT - reason". If VERDICT is INACCURATE, add "Correct: ..." with the corrected text. End with "## New facts to check" and list any new claims or quotes that appeared during verification (numbered).`;

const CURSOR_FLAGS = ['--cursor', '--for-cursor'];

function buildCursorOutput(r: ExtractResult): string {
  const parts: string[] = [];
  if (r.claims.length > 0) {
    const list = r.claims.map((c, i) => `${i + 1}. ${c}`).join('\n');
    parts.push(`${CURSOR_PROMPT}\n\nEntry: ${r.title}\n\nClaims:\n${list}`);
  }
  if (r.quotes.length > 0) {
    const quoteList = r.quotes.map((q, i) => `${i + 1}. ${q}`).join('\n');
    parts.push(`${parts.length ? '\n\n' : ''}${CURSOR_QUOTES_PROMPT}\n\n${quoteList}`);
  }
  return parts.length > 0 ? parts.join('') + CURSOR_REPLY_FORMAT : '';
}

function main(): void {
  const argv = process.argv.slice(2);
  const forCursor = argv.some((a) => CURSOR_FLAGS.includes(a));
  const paths = argv.filter((a) => !CURSOR_FLAGS.includes(a));

  if (paths.length === 0) {
    console.error('Usage: npm run extract-claims -- [--cursor] <file.md> [file2.md ...]');
    console.error('  --cursor   output prompt + claims for pasting into Cursor chat (no API)');
    process.exit(1);
  }

  const results: ExtractResult[] = [];
  for (const p of paths) {
    const resolved = path.resolve(process.cwd(), p);
    if (!fs.existsSync(resolved)) {
      console.error('File not found:', p);
      process.exit(1);
    }
    results.push(extractClaims(resolved));
  }

  if (forCursor && results.length === 1) {
    const cursorOut = buildCursorOutput(results[0]);
    if (cursorOut) {
      console.log(cursorOut);
      return;
    }
  }

  console.log(JSON.stringify(results.length === 1 ? results[0] : results, null, 2));

  const missingSources = results.filter((r) => !r.hasSourcesSection);
  if (missingSources.length > 0) {
    const fileList = missingSources.map((r) => r.file).join(', ');
    const verb = missingSources.length === 1 ? 'has' : 'have';
    process.stderr.write(`\nNote: ${fileList} ${verb} no "## Sources" section. Add one for verification.\n`);
  }
}

if (process.argv[1]?.includes('extract-claims')) main();
