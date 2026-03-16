import { getAllContent } from '@/lib/markdown';
import Search, { type SearchEntry } from '@/app/components/search';

export const metadata = {
  title: 'Search — Second',
};

export default async function SearchPage() {
  const allContent = await getAllContent();

  const entries: SearchEntry[] = allContent.map((file) => ({
    title: file.frontmatter.title || file.slug,
    excerpt: file.frontmatter.excerpt || '',
    tags: file.frontmatter.tags || [],
    category: file.category,
    subcategory: file.subcategory,
    slug: file.slug,
    body: file.content.replace(/^---[\s\S]*?---/, '').replace(/[#*_\[\]`>|]/g, '').trim().slice(0, 2000),
  }));

  return (
    <div className="page-wrapper">
      <div className="page-section">
        <h1>Search</h1>
        <Search entries={entries} />
      </div>
    </div>
  );
}
