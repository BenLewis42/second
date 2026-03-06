/**
 * List suggested new articles from broken wiki links and unfilled tags.
 * Run: npm run suggest-articles  (uses tsx)
 */
import {
  getAllSuggestedTopics,
  type SuggestedTopic,
} from '../lib/article-suggestions';

function formatTopic(t: SuggestedTopic): string {
  const refs = t.referringSlugs.slice(0, 5).map((r) => r.title).join(', ');
  const more = t.referringSlugs.length > 5 ? ` (+${t.referringSlugs.length - 5} more)` : '';
  const reason = t.reason === 'frequent_tag' ? 'unfilled tag' : 'broken wiki link';
  return [
    `  ${t.title} (${t.slug})`,
    `    -> ${t.category}/${t.subcategory}  [${t.referenceCount} refs]  (${reason})`,
    `    Referred by: ${refs}${more}`,
    `    Tags: ${t.suggestedTags.slice(0, 5).join(', ')}`,
  ].join('\n');
}

async function main() {
  const suggestions = await getAllSuggestedTopics();
  if (suggestions.length === 0) {
    console.log('No suggested topics. Every wiki link points to an existing page and every tag has a dedicated page.');
    return;
  }
  console.log('Suggested new articles (broken wiki links + unfilled tags):\n');
  suggestions.forEach((t) => console.log(formatTopic(t) + '\n'));
  console.log(
    `\nTo generate a draft: npm run generate-article -- <slug>\nExample: npm run generate-article -- existentialism`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
