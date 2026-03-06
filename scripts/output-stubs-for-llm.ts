/**
 * Output all stub files to a single file for copy-paste to another LLM.
 * Run: npm run tag-stubs-and-unverified  (then this)
 *      npm run output-stubs-for-llm
 * Output: .stubs-for-llm.txt (instructions + one block per stub: ## FILE: path then content, ---)
 */
import fs from 'fs';
import path from 'path';
import { getStubPaths } from '../lib/stub-verified';

const OUT = '.stubs-for-llm.txt';

const INSTRUCTIONS = `Expand each stub below into a full wiki entry. Follow these rules:

- Keep YAML frontmatter; set "excerpt" to one sentence and "stub: false".
- Keep the sections: ## Overview, ## Key Ideas, ## Connections, ## Sources. Replace placeholders with 2-5 sentences. Use [[wiki-link]] for related topics.
- In ## Sources write: "Add verified sources after fact-checking." Do not invent URLs.

Exact output format (you must use this structure for every file):

## FILE: <path exactly as given below>

<full markdown for this file, including --- frontmatter --- and all sections>

---

## FILE: <next path>

<full markdown>

---

Repeat for every file. Each block starts with "## FILE: " then the path, then a blank line, then the complete markdown. Blocks are separated by "---" on its own line (no "---" between path and content except the frontmatter delimiter inside the markdown).

---
`;

function main() {
  const stubPaths = getStubPaths();
  if (stubPaths.length === 0) {
    process.stderr.write('No stubs. Run npm run tag-stubs-and-unverified first.\n');
    process.exit(1);
  }

  const blocks: string[] = [INSTRUCTIONS];
  for (const p of stubPaths) {
    const abs = path.join(process.cwd(), p);
    const raw = fs.readFileSync(abs, 'utf-8');
    blocks.push(`## FILE: ${p}\n\n${raw}\n\n---\n`);
  }

  fs.writeFileSync(OUT, blocks.join('\n'), 'utf-8');
  process.stdout.write(`Wrote ${stubPaths.length} stubs to ${OUT}\n`);
}

main();
