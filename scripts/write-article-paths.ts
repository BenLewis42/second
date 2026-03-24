/**
 * Writes lib/article-paths.json for the Surprise me button (client bundle).
 * Runs via prebuild / predev.
 */
import fs from 'fs';
import path from 'path';
import { getAllContent } from '../lib/markdown';

async function main() {
  const base = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/$/, '');
  const all = await getAllContent();
  const paths = all.map((f) => {
    const p = `/${f.category}/${f.subcategory}/${f.slug}/`.replace(/\/{2,}/g, '/');
    return base ? `${base}${p}` : p;
  });
  const out = path.join(process.cwd(), 'lib', 'article-paths.json');
  fs.writeFileSync(out, JSON.stringify(paths), 'utf-8');
  console.log(`Wrote ${paths.length} paths -> ${out}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
