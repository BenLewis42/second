/**
 * Automation: generate new pages from unfilled tags, optionally output fact-check prompt.
 * For use with Cursor Automations or GitHub Actions.
 *
 * Usage:
 *   AUTOMATION_LIMIT=2 npm run automation-unfilled-tags           # generate up to 2 drafts, print paths
 *   npm run automation-unfilled-tags -- --with-claims             # also output combined fact-check prompt
 *
 * Output: one created file path per line (stdout); if --with-claims, then a line
 * "---FACT_CHECK_PROMPT---" and the combined prompt for Cursor fact-checking.
 */
import path from 'path';
import {
  getSuggestedTopicsFromUnfilledTags,
  writeDraftArticle,
} from '../lib/article-suggestions';
import { extractClaims, buildMultiFileCursorOutput } from './extract-claims';

const LIMIT = Math.max(1, parseInt(process.env.AUTOMATION_LIMIT ?? '1', 10));
const WITH_CLAIMS = process.argv.includes('--with-claims');

async function main() {
  const suggestions = await getSuggestedTopicsFromUnfilledTags();
  if (suggestions.length === 0) {
    process.stderr.write('No unfilled tags to generate.\n');
    return;
  }

  const toGenerate = suggestions.slice(0, LIMIT);
  const createdPaths: string[] = [];

  for (const topic of toGenerate) {
    const result = await writeDraftArticle(topic);
    if (result.written) {
      const rel = path.relative(process.cwd(), result.path);
      createdPaths.push(rel.split(path.sep).join(path.posix.sep));
      process.stdout.write(createdPaths[createdPaths.length - 1] + '\n');
    }
  }

  if (createdPaths.length === 0) {
    process.stderr.write('No new files written (all candidates already had pages).\n');
    return;
  }

  if (WITH_CLAIMS && createdPaths.length > 0) {
    const results = createdPaths.map((p) => extractClaims(path.resolve(process.cwd(), p)));
    const prompt = buildMultiFileCursorOutput(results);
    if (prompt) {
      process.stdout.write('---FACT_CHECK_PROMPT---\n');
      process.stdout.write(prompt);
    }
  }
}

main().catch((e) => {
  process.stderr.write(String(e) + '\n');
  process.exit(1);
});
