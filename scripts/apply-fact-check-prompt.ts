/**
 * Print a prompt for applying fact-check results and getting new facts to check.
 * Usage: npm run apply-fact-check -- <path-to.md>
 *
 * 1. Run extract-claims --cursor, paste into Cursor, get fact-check reply.
 * 2. Run this script with the same file path.
 * 3. Paste the script output into Cursor, then paste the fact-check reply below the placeholder.
 * 4. Model applies updates, suggests additions, and lists new facts to check.
 */
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const APPLY_PROMPT = `Apply the fact-check results below to this wiki entry.

**File to update:** \`{file}\`
**Entry title:** {title}

Do the following in order:

1. **Make these updates** – Apply every suggested change from the fact-check (fix or remove INACCURATE items; note UNCERTAIN for follow-up). For any "Correct: ..." use that text in the entry.
2. **Set \`verified: true\`** in the YAML frontmatter so automation knows this page has been fact-checked.
3. **Make any further additions** – If you deem it necessary, add or expand content (e.g. missing context, caveats). Keep the same tone and structure. Do not invent or add sources, URLs, or citations; only the user may add verified references.
4. **Provide new facts for checking** – After the revised content, add a section "## New facts to check" with a numbered list of any new factual claims or quoted passages that should be verified (from your edits or additions). If there are none, write "None."

Output format:
- First: the full revised markdown for the page (frontmatter + body, no "## New facts to check" inside the page content).
- Then: a clear separator (e.g. "---") and the section "## New facts to check" with the numbered list (or "None.").

Fact-check results (paste below this line):
`;

function main(): void {
  const argv = process.argv.slice(2);
  if (argv.length === 0) {
    console.error('Usage: npm run apply-fact-check -- <file.md>');
    console.error('Example: npm run apply-fact-check -- content/people/figures/plato.md');
    process.exit(1);
  }

  const mdPath = path.resolve(process.cwd(), argv[0]);
  if (!fs.existsSync(mdPath)) {
    console.error('File not found:', argv[0]);
    process.exit(1);
  }

  const raw = fs.readFileSync(mdPath, 'utf-8');
  const { data } = matter(raw);
  const title = (data?.title as string) || path.basename(mdPath, '.md');
  const file = path.relative(process.cwd(), mdPath).split(path.sep).join(path.posix.sep);

  console.log(APPLY_PROMPT.replace(/\{file\}/g, file).replace(/\{title\}/g, title));
}

main();
