/**
 * Run automation + fact-check tests and print pass/fail.
 * Usage: npm run test-automation   (or: npx tsx scripts/test-automation.ts)
 */
import path from 'path';
import fs from 'fs';
import { getSuggestedTopicsFromUnfilledTags, getUnfilledTags } from '../lib/article-suggestions';
import { getStubPaths, getUnverifiedPaths, isStubContent } from '../lib/stub-verified';
import { extractClaims, buildMultiFileCursorOutput } from './extract-claims';

const contentRoot = path.join(process.cwd(), 'content');

function ok(name: string, pass: boolean, detail?: string): void {
  const status = pass ? 'PASS' : 'FAIL';
  const msg = detail ? `${name}: ${status} (${detail})` : `${name}: ${status}`;
  console.log(msg);
  if (!pass) process.exitCode = 1;
}

async function main() {
  console.log('--- Automation tests ---\n');

  // 1. Unfilled tags / suggestions
  const unfilled = await getUnfilledTags();
  ok('Unfilled tags', Array.isArray(unfilled), `${unfilled.length} tags`);

  const suggestions = await getSuggestedTopicsFromUnfilledTags();
  ok('Suggested topics from unfilled tags', Array.isArray(suggestions), `${suggestions.length} topics`);

  // 2. Fact-check extraction on a real content file
  const formsPath = path.join(contentRoot, 'philosophy', 'concepts', 'forms.md');
  if (fs.existsSync(formsPath)) {
    const result = extractClaims(formsPath);
    ok('Extract claims (forms.md)', result.claims.length > 0, `${result.claims.length} claims`);
    const cursorOut = buildMultiFileCursorOutput([result]);
    ok('Fact-check prompt build', cursorOut.length > 200 && cursorOut.includes('Reply format'), 'has intro + reply format');
  } else {
    ok('Extract claims (forms.md)', false, 'file missing');
  }

  // 3. Apply-fact-check prompt (script exists and would print; we only check the module)
  const applyPath = path.join(process.cwd(), 'scripts', 'apply-fact-check-prompt.ts');
  ok('Apply-fact-check script exists', fs.existsSync(applyPath));

  // 4. automation-fact-check: multi-file prompt
  const idealismPath = path.join(contentRoot, 'philosophy', 'concepts', 'idealism.md');
  if (fs.existsSync(formsPath) && fs.existsSync(idealismPath)) {
    const results = [formsPath, idealismPath].map((p) => extractClaims(p));
    const multi = buildMultiFileCursorOutput(results);
    ok('Multi-file fact-check prompt', multi.includes('## File:') && multi.includes('Reply format'), '2 files');
  }

  // 5. Stub/verified queues (tagging drives populate and fact-check)
  const stubPaths = getStubPaths();
  const unverifiedPaths = getUnverifiedPaths();
  ok('Stub paths (for populate)', Array.isArray(stubPaths), `${stubPaths.length} stubs`);
  ok('Unverified paths (for fact-check)', Array.isArray(unverifiedPaths), `${unverifiedPaths.length} unverified`);
  const stubPhrase = 'Add a brief overview and why this topic matters';
  ok('Stub detection', isStubContent(stubPhrase) && !isStubContent('The Theory of Forms is a central doctrine'), 'phrase match');

  console.log('\n--- Done ---');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
