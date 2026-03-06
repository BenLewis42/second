/**
 * Tag all content files with stub and verified in frontmatter.
 * Run after adding new content or to sync tags with actual content.
 * Usage: npm run tag-stubs-and-unverified
 */
import { tagAllContent, getStubPaths, getUnverifiedPaths } from '../lib/stub-verified';

function main() {
  console.log('Tagging all content (stub / verified)...\n');
  const results = tagAllContent();
  const stubs = results.filter((r) => r.stub);
  const unverified = results.filter((r) => !r.verified);

  console.log(`Tagged ${results.length} files.`);
  console.log(`  Stubs:     ${stubs.length}  ${stubs.map((r) => r.path).join(', ') || '(none)'}`);
  console.log(`  Unverified: ${unverified.length}  ${unverified.map((r) => r.path).join(', ') || '(none)'}`);

  const stubPaths = getStubPaths();
  const unverifiedPaths = getUnverifiedPaths();
  console.log('\nCurrent queues (for automation):');
  console.log('  getStubPaths():    ', stubPaths.length, stubPaths.slice(0, 5).join(', ') + (stubPaths.length > 5 ? '...' : ''));
  console.log('  getUnverifiedPaths():', unverifiedPaths.length, unverifiedPaths.slice(0, 5).join(', ') + (unverifiedPaths.length > 5 ? '...' : ''));
}

main();
