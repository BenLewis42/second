/**
 * Generate a draft article for a suggested topic (by slug) or a new topic.
 * Run: npm run generate-article -- <slug>
 */
import {
  getSuggestedTopicsFromConnections,
  writeDraftArticle,
  generateDraftOutline,
  type SuggestedTopic,
} from '../lib/article-suggestions';
import path from 'path';

function slugify(raw: string): string {
  return raw
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '');
}

async function main() {
  const arg = process.argv[2];
  if (!arg) {
    console.log('Usage: npm run generate-article -- <slug-or-title>');
    console.log('Example: npm run generate-article -- existentialism');
    process.exit(1);
  }

  const suggestions = await getSuggestedTopicsFromConnections();
  const slug = slugify(arg);
  let topic: SuggestedTopic | undefined = suggestions.find((t) => t.slug === slug);

  if (!topic) {
    const title = arg
      .split(/[\s-]+/)
      .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
    topic = {
      title,
      slug,
      category: 'philosophy',
      subcategory: 'concepts',
      reason: 'broken_wiki_link',
      referenceCount: 0,
      referringSlugs: [],
      suggestedTags: ['concept'],
    };
  }

  const result = await writeDraftArticle(topic);
  if (result.written) {
    console.log('Created draft:', path.relative(process.cwd(), result.path));
  } else {
    console.log('File already exists:', result.path);
    console.log('Preview of outline:\n');
    console.log(generateDraftOutline(topic));
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
