/**
 * Output fact-check prompt for all unverified files to a single file for copy-paste to another LLM.
 * Run: npm run tag-stubs-and-unverified  (then this)
 *      npm run output-fact-check-for-llm
 * Output: .fact-check-for-llm.txt (instructions + combined claim prompt)
 */
import fs from 'fs';
import path from 'path';
import { getUnverifiedPaths } from '../lib/stub-verified';
import { extractClaims, buildMultiFileCursorOutput } from './extract-claims';

const OUT = '.fact-check-for-llm.txt';

const INSTRUCTIONS = `Fact-check each claim below. For each claim reply with ACCURATE, INACCURATE, or UNCERTAIN and a short reason. Use scholarly consensus (e.g. SEP, Britannica). When in doubt, say UNCERTAIN. Do not guess.

For INACCURATE claims: add "Correct: ..." with the corrected wording when you can, so the entry can be fixed rather than removed.

Exact reply format (you must use this structure). For each file in the prompt, output:

## content/path/to/file.md
1. ACCURATE - reason
2. INACCURATE - reason. Correct: <replacement text>
3. UNCERTAIN - reason
## New facts to check
1. <any new claim to verify>
2. <or another>
None.

Use the exact file path shown under "## File:" in each block. One line per claim: "N. VERDICT - reason". If INACCURATE, add "Correct: ..." on the same line. End each file's block with "## New facts to check" then a numbered list of new claims to verify, or the single word "None."

---
`;

function main() {
  const paths = getUnverifiedPaths();
  const withContent = paths
    .map((p) => path.join(process.cwd(), p))
    .filter((p) => fs.existsSync(p));
  const results = withContent.map((p) => extractClaims(p));
  const withClaims = results.filter((r) => r.claims.length > 0 || r.quotes.length > 0);

  if (withClaims.length === 0) {
    process.stderr.write('No claims in unverified files. Populate stubs first or run tag-stubs-and-unverified.\n');
    process.exit(1);
  }

  const prompt = buildMultiFileCursorOutput(withClaims);
  fs.writeFileSync(OUT, INSTRUCTIONS + prompt, 'utf-8');
  process.stdout.write(`Wrote fact-check prompt (${withClaims.length} entries) to ${OUT}\n`);
}

main();
