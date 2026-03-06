/**
 * Apply stub responses from another LLM: read a file with "## FILE: path" + content blocks, write each to the path.
 * Run: npm run apply-stub-responses -- .stub-llm-responses.txt
 */
import fs from 'fs';
import path from 'path';

function main() {
  const fileArg = process.argv[2];
  if (!fileArg || !fs.existsSync(path.resolve(process.cwd(), fileArg))) {
    process.stderr.write('Usage: npm run apply-stub-responses -- <file.txt>\n');
    process.stderr.write('  File should contain blocks: ## FILE: content/.../file.md\n\n<markdown>\n\n---\n');
    process.exit(1);
  }

  let raw = fs.readFileSync(path.resolve(process.cwd(), fileArg), 'utf-8');
  raw = raw.replace(/\r\n/g, '\n');
  // Split only at --- that separates files (followed by ## FILE:), not frontmatter ---
  const blocks = raw.split(/\n---\n\n(?=## FILE: )/).map((b) => b.trim()).filter(Boolean);

  let applied = 0;
  for (const block of blocks) {
    const match = block.match(/^## FILE:\s*(\S+)\s*\n\n([\s\S]*)$/m);
    if (!match) continue;
    const [, filePath, content] = match;
    const abs = path.join(process.cwd(), filePath.split('/').join(path.sep));
    if (!path.relative(process.cwd(), abs).startsWith('content')) {
      process.stderr.write(`Skipping path outside content/: ${filePath}\n`);
      continue;
    }
    if (!content || content.length < 50) {
      process.stderr.write(`Skipping empty/short content for ${filePath}\n`);
      continue;
    }
    fs.writeFileSync(abs, content.trimEnd() + '\n', 'utf-8');
    process.stdout.write(`Wrote ${filePath}\n`);
    applied++;
  }

  process.stdout.write(`Applied ${applied} files.\n`);
}

main();
