/**
 * Full automation pipeline: tag → (optional) draft → populate queue + fact-check queue.
 * Full pipeline = populate all stubs AND fact-check all unverified. Both steps are required
 * for "no stubs, no unverified"; this script only builds the queues and prompt—Cursor Automation
 * or you perform the actual populate and fact-check, then set stub: false and verified: true.
 *
 * Usage: AUTOMATION_LIMIT=3 npm run automation-full-pipeline
 *
 * 1) Tags all content (stub/verified).
 * 2) Optionally creates drafts from unfilled tags.
 * 3) Populate queue = stub: true. Fact-check queue = verified: false.
 * 4) Writes queues, instructions, and fact-check prompt. Run populate then fact-check to complete.
 */
import path from 'path';
import fs from 'fs';
import {
  getSuggestedTopicsFromUnfilledTags,
  writeDraftArticle,
} from '../lib/article-suggestions';
import { tagAllContent, getStubPaths, getUnverifiedPaths } from '../lib/stub-verified';
import { extractClaims, buildMultiFileCursorOutput } from './extract-claims';

const LIMIT = Math.max(0, parseInt(process.env.AUTOMATION_LIMIT ?? '1', 10));
const POPULATE_QUEUE_FILE = '.automation-populate-queue.txt';
const FACT_CHECK_QUEUE_FILE = '.automation-fact-check-queue.txt';
const INSTRUCTIONS_FILE = '.automation-populate-instructions.md';
const FACT_CHECK_OUTPUT = '.automation-fact-check-prompt.txt';

interface PipelineStats {
  tagged: number;
  stubs: number;
  unverified: number;
  drafted: number;
  draftedPaths: string[];
  populateQueuePath: string | null;
  factCheckQueuePath: string | null;
  factCheckPromptPath: string | null;
  factCheckFiles: number;
}

function log(msg: string, toStderr = false): void {
  const out = toStderr ? process.stderr : process.stdout;
  out.write(msg + '\n');
}

async function main() {
  const stats: PipelineStats = {
    tagged: 0,
    stubs: 0,
    unverified: 0,
    drafted: 0,
    draftedPaths: [],
    populateQueuePath: null,
    factCheckQueuePath: null,
    factCheckPromptPath: null,
    factCheckFiles: 0,
  };

  // —— Step 0: Tag all content (stub / verified) ——
  log('Step 0: Tagging all content (stub / verified)...', true);
  const tagResults = tagAllContent();
  stats.tagged = tagResults.length;
  stats.stubs = tagResults.filter((r) => r.stub).length;
  stats.unverified = tagResults.filter((r) => !r.verified).length;
  log(`Tagged ${stats.tagged} files. Stubs: ${stats.stubs}, Unverified: ${stats.unverified}`, true);

  // —— Step 1: Create drafts from unfilled tags (if LIMIT > 0) ——
  log('Step 1: Creating drafts from unfilled tags...', true);
  const suggestions = await getSuggestedTopicsFromUnfilledTags();
  if (suggestions.length > 0 && LIMIT > 0) {
    const toGenerate = suggestions.slice(0, LIMIT);
    for (const topic of toGenerate) {
      const result = await writeDraftArticle(topic);
      if (result.written) {
        const rel = path.relative(process.cwd(), result.path);
        stats.draftedPaths.push(rel.split(path.sep).join(path.posix.sep));
      }
    }
    stats.drafted = stats.draftedPaths.length;
    if (stats.drafted > 0) {
      log(`Drafted ${stats.drafted} file(s): ${stats.draftedPaths.join(', ')}`, true);
      // Re-tag so new drafts are in stub/unverified lists
      tagAllContent();
    }
  }

  // —— Step 2: Build queues from stub and unverified ——
  log('Step 2: Building populate queue (stubs) and fact-check queue (unverified)...', true);
  const stubPaths = getStubPaths();
  const unverifiedPaths = getUnverifiedPaths();

  fs.writeFileSync(POPULATE_QUEUE_FILE, stubPaths.join('\n') + (stubPaths.length ? '\n' : ''), 'utf-8');
  stats.populateQueuePath = POPULATE_QUEUE_FILE;
  fs.writeFileSync(FACT_CHECK_QUEUE_FILE, unverifiedPaths.join('\n') + (unverifiedPaths.length ? '\n' : ''), 'utf-8');
  stats.factCheckQueuePath = FACT_CHECK_QUEUE_FILE;

  log(`Populate queue: ${stubPaths.length} path(s) -> ${POPULATE_QUEUE_FILE}`, true);
  log(`Fact-check queue: ${unverifiedPaths.length} path(s) -> ${FACT_CHECK_QUEUE_FILE}`, true);

  // —— Step 3: Instructions (populate + fact-check, set stub: false and verified: true) ——
  fs.writeFileSync(INSTRUCTIONS_FILE, getInstructions(), 'utf-8');
  log(`Instructions: ${INSTRUCTIONS_FILE}`, true);

  // —— Step 4: Fact-check prompt from unverified paths that have claims ——
  log('Step 4: Building fact-check prompt from unverified files with claims...', true);
  const results = unverifiedPaths
    .map((p) => path.resolve(process.cwd(), p))
    .filter((p) => fs.existsSync(p))
    .map((p) => extractClaims(p));
  const withClaims = results.filter((r) => r.claims.length > 0 || r.quotes.length > 0);
  stats.factCheckFiles = withClaims.length;

  if (withClaims.length > 0) {
    const prompt = buildMultiFileCursorOutput(withClaims);
    fs.writeFileSync(FACT_CHECK_OUTPUT, prompt, 'utf-8');
    stats.factCheckPromptPath = FACT_CHECK_OUTPUT;
    log(`Fact-check prompt: ${FACT_CHECK_OUTPUT} (${withClaims.length} entries)`, true);
  } else {
    log('No claims in unverified files yet. After populating stubs, re-run pipeline or run automation-fact-check on fact-check queue paths.', true);
  }

  printStats(stats);
}

function getInstructions(): string {
  return `# Cursor Automation: No stubs, no unverified pages

**Full pipeline = populate (all stubs) + fact-check (all unverified).** Do both; then re-run the pipeline until both queues are empty.

Use **stub** and **verified** frontmatter to drive the workflow. When done, every page has \`stub: false\` and \`verified: true\`.

## Queues

- **\`.automation-populate-queue.txt\`** – paths with \`stub: true\`. Populate these first.
- **\`.automation-fact-check-queue.txt\`** – paths with \`verified: false\`. Fact-check these (after populating so they have claims).

## 1. Populate every file in the populate queue

For **each** path in \`.automation-populate-queue.txt\`:

1. Read the file (stub with placeholders).
2. Expand into a full wiki entry: keep frontmatter (update \`excerpt\` only), keep ## Overview, ## Key Ideas, ## Connections, ## Sources. Replace placeholders with 2–5 sentences. Use \`[[wiki-link]]\`. In ## Sources write: "Add verified sources after fact-checking."
3. **Set \`stub: false\` in the frontmatter** when you write the file back.
4. Write the complete markdown back to the same file.

## 2. Fact-check every file in the fact-check queue

1. Run: \`npm run automation-fact-check -- <path1> <path2> ...\` with all paths from \`.automation-fact-check-queue.txt\`. Save output to \`.automation-fact-check-prompt.txt\`.
2. Use that prompt in Cursor to get verdicts (ACCURATE / INACCURATE / UNCERTAIN).
3. For each path, run \`npm run apply-fact-check -- <path>\`, paste the apply prompt and the fact-check reply, and get revised markdown.
4. **Set \`verified: true\` in the frontmatter** of each file when you apply the fact-check updates.
5. Write the revised content (with \`verified: true\`) back to the file.

## 3. Repeat until done

Re-run \`npm run automation-full-pipeline\`. If \`stub\` and \`verified\` are set correctly, the queues will shrink. When both queues are empty, there are no stubs and no unverified pages.
`;
}

function printStats(s: PipelineStats): void {
  log('', true);
  log('--- Stats ---', true);
  log(`Tagged:            ${s.tagged} files (stubs: ${s.stubs}, unverified: ${s.unverified})`, true);
  log(`Drafted:           ${s.drafted} file(s)`, true);
  if (s.draftedPaths.length > 0) log(`  Paths:           ${s.draftedPaths.join(', ')}`, true);
  log(`Populate queue:    ${s.populateQueuePath ?? 'none'}`, true);
  log(`Fact-check queue:  ${s.factCheckQueuePath ?? 'none'}`, true);
  log(`Fact-check prompt: ${s.factCheckPromptPath ?? 'none'} (${s.factCheckFiles} entries with claims)`, true);
  log('----------------', true);
}

main().catch((e) => {
  process.stderr.write(String(e) + '\n');
  process.exit(1);
});
