/**
 * Automation: extract claims from multiple files and output one combined fact-check prompt.
 * Use after generating new pages so one Cursor run can fact-check all.
 *
 * Usage:
 *   npm run automation-fact-check -- path/to/a.md path/to/b.md
 *   echo "path1 path2" | xargs npm run automation-fact-check --
 *
 * Output: combined prompt (stdout). Reply format: prefix each entry's verdicts with "## <file path>".
 * Then run apply-fact-check for each file with the relevant part of the reply.
 */
import path from 'path';
import fs from 'fs';
import { extractClaims, buildMultiFileCursorOutput } from './extract-claims';

function main() {
  const paths = process.argv.slice(2).filter((p) => !p.startsWith('--'));
  if (paths.length === 0) {
    process.stderr.write('Usage: npm run automation-fact-check -- <file.md> [file2.md ...]\n');
    process.exit(1);
  }

  const resolved = paths.map((p) => path.resolve(process.cwd(), p));
  for (const p of resolved) {
    if (!fs.existsSync(p)) {
      process.stderr.write('File not found: ' + p + '\n');
      process.exit(1);
    }
  }

  const results = resolved.map((p) => extractClaims(p));
  const prompt = buildMultiFileCursorOutput(results);
  if (prompt) {
    process.stdout.write(prompt);
  } else {
    process.stderr.write('No claims or quotes found in the given files.\n');
  }
}

main();
