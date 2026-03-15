import Link from 'next/link';
import { getCategories, formatCategoryName } from '@/lib/content';
import { getAllContent, getAllTags } from '@/lib/markdown';
import { buildContentGraph } from '@/lib/graph';

export const metadata = {
  title: 'Second Brain - Home',
};

export default async function Home() {
  const categories = getCategories();
  const [allContent, allTags, graph] = await Promise.all([
    getAllContent(),
    getAllTags(),
    buildContentGraph(),
  ]);

  const subcategoryCounts = new Map<string, number>();
  allContent.forEach((file) => {
    const key = `${file.category}/${file.subcategory}`;
    subcategoryCounts.set(key, (subcategoryCounts.get(key) || 0) + 1);
  });

  // Sort categories by entry count (richest first)
  const categoryCounts = new Map<string, number>();
  allContent.forEach((f) => {
    categoryCounts.set(f.category, (categoryCounts.get(f.category) || 0) + 1);
  });
  const sortedCategories = [...categories].sort(
    (a, b) => (categoryCounts.get(b.name) || 0) - (categoryCounts.get(a.name) || 0)
  );

  // Tag frequency from actual content
  const tagFreq = new Map<string, number>();
  allContent.forEach((f) => {
    f.frontmatter.tags?.forEach((t) => {
      tagFreq.set(t, (tagFreq.get(t) || 0) + 1);
    });
  });
  const topTags = Array.from(tagFreq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 18)
    .map(([tag, count]) => ({ tag, count }));

  // Slugs that map to a real entry for direct linking
  const slugToPath = new Map<string, { category: string; subcategory: string }>();
  allContent.forEach((f) =>
    slugToPath.set(f.slug, { category: f.category, subcategory: f.subcategory })
  );
  function tagHref(tag: string): string {
    const path = slugToPath.get(tag);
    return path ? `/${path.category}/${path.subcategory}/${tag}` : `/tags/${tag}`;
  }

  // Featured entries: longest / most connected, non-stub
  const featured = [...allContent]
    .filter((f) => !f.frontmatter.stub)
    .sort((a, b) => b.content.length - a.content.length)
    .slice(0, 6);

  // Recent entries
  const recentEntries = [...allContent]
    .filter((f) => Boolean(f.frontmatter?.date))
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime()
    )
    .slice(0, 6);

  return (
    <div className="page-wrapper">
      <div className="page-section">
        <h1>Second</h1>
        <p className="intro-text">
          A personal commonplace book spanning computer science, philosophy,
          social science, and more. {allContent.length} entries across{' '}
          {categories.length} categories.
        </p>
      </div>

      {/* Top tags from real content */}
      <div className="page-section">
        <h2>Explore by Topic</h2>
        <div className="tag-container">
          {topTags.map(({ tag, count }) => (
            <Link key={tag} href={tagHref(tag)} className="tag">
              <span>{tag}</span>
              <span className="tag-count">({count})</span>
            </Link>
          ))}
        </div>
        <Link href="/tags" className="btn-secondary btn tags-cta">
          All {allTags.length} tags →
        </Link>
      </div>

      {/* Featured entries — the richest content */}
      <div className="page-section">
        <h2>Featured</h2>
        <p className="section-description">Deepest entries by volume:</p>
        <div className="entries-grid">
          {featured.map((file) => (
            <Link
              key={`${file.category}/${file.subcategory}/${file.slug}`}
              href={`/${file.category}/${file.subcategory}/${file.slug}`}
              className="card"
            >
              <div className="entry-footer">
                <div className="flex-col">
                  <h3 className="entry-title heading-reset">
                    {file.frontmatter.title}
                  </h3>
                  {file.frontmatter.excerpt && (
                    <p className="entry-excerpt">
                      {file.frontmatter.excerpt}
                    </p>
                  )}
                  <div className="tag-container entry-inline-tags">
                    {(file.frontmatter.tags || []).slice(0, 4).map((tag) => (
                      <span key={tag} className="tag tag-small">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="text-tertiary">
                    {categoryCounts.get(file.category)
                      ? sortedCategories.find((c) => c.name === file.category)?.label
                      : file.frontmatter.category}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Wiki snapshot */}
      <div className="card-highlight page-section">
        <h2 className="heading-reset">Wiki Snapshot</h2>
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-number">{graph.nodes.length}</div>
            <div className="stat-label">Entries</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{allTags.length}</div>
            <div className="stat-label">Tags</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{graph.links.length}</div>
            <div className="stat-label">Tag Connections</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">
              {graph.nodes.length > 0
                ? (graph.links.length / graph.nodes.length).toFixed(1)
                : '0.0'}
            </div>
            <div className="stat-label">Avg Connections</div>
          </div>
        </div>
      </div>

      {/* Categories — sorted by richness, only those with content */}
      <div className="page-section">
        <h2>Browse by Category</h2>
        <div className="grid grid-2">
          {sortedCategories.map((category) => (
            <div key={category.name} className="card">
              <h3 className="heading-reset">{category.label}</h3>
              <p className="section-description">
                {categoryCounts.get(category.name) || 0}{' '}
                {(categoryCounts.get(category.name) || 0) === 1 ? 'entry' : 'entries'}
              </p>
              <div className="flex-col gap-small">
                {category.subcategories.map((subcategory) => (
                  <Link
                    key={subcategory}
                    href={`/${category.name}/${subcategory}`}
                    className="subcategory-link"
                  >
                    {formatCategoryName(subcategory)}{' '}
                    <span className="text-tertiary">
                      (
                      {subcategoryCounts.get(
                        `${category.name}/${subcategory}`
                      ) || 0}
                      )
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent entries */}
      {recentEntries.length > 0 && (
        <div className="page-section">
          <h2>Recently Updated</h2>
          <div className="entries-grid">
            {recentEntries.map((file) => (
              <Link
                key={`${file.category}/${file.subcategory}/${file.slug}`}
                href={`/${file.category}/${file.subcategory}/${file.slug}`}
                className="card"
              >
                <div className="entry-footer">
                  <div className="flex-col">
                    <h3 className="entry-title heading-reset">
                      {file.frontmatter.title}
                    </h3>
                    <div className="tag-container entry-inline-tags">
                      {(file.frontmatter.tags || []).slice(0, 3).map((tag) => (
                        <span key={tag} className="tag tag-small">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="text-tertiary">
                      {sortedCategories.find((c) => c.name === file.category)?.label}
                    </span>
                  </div>
                  <span className="entry-date">
                    {new Date(file.frontmatter.date).toLocaleDateString(
                      'en-US',
                      { year: 'numeric', month: 'short', day: 'numeric' }
                    )}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
