import Link from 'next/link';
import { getCategories } from '@/lib/content';
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
        <h1>Second Brain</h1>
        <p className="intro-text">
          A small cultural wiki connecting art and philosophy through tags,
          wiki-links, and references. Browse by category, explore by tags, and
          follow connections between entries.
        </p>
      </div>

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
        <Link href="/tags" className="btn">
          Explore by Tags
        </Link>
      </div>

      <div className="grid grid-2 page-section">
        {categories.map((category) => (
          <div key={category.name} className="card">
            <h2 className="heading-reset">{category.label}</h2>
            <p className="section-description">
              {category.name === 'people'
                ? 'Philosophers, artists, and figures'
                : category.name === 'philosophy'
                  ? 'Concepts'
                  : 'Movements'}
            </p>
            <div className="flex-col gap-small">
              {category.subcategories.map((subcategory) => (
                <Link
                  key={subcategory}
                  href={`/${category.name}/${subcategory}`}
                  className="subcategory-link"
                >
                  {subcategory.charAt(0).toUpperCase() +
                    subcategory.slice(1)}{' '}
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

      {recentEntries.length > 0 && (
        <div className="page-section">
          <h2>Recent Entries</h2>
          <p className="section-description">
            Latest entries by their frontmatter date:
          </p>
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
                    {file.frontmatter.excerpt && (
                      <p className="entry-excerpt">
                        {file.frontmatter.excerpt}
                      </p>
                    )}
                    <div className="tag-container entry-inline-tags">
                      {(file.frontmatter.tags || [])
                        .slice(0, 5)
                        .map((tag) => (
                          <span key={tag} className="tag tag-small">
                            {tag}
                          </span>
                        ))}
                    </div>
                    <span className="text-tertiary">
                      {file.frontmatter.category}
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

      <div className="card-highlight">
        <h3 className="heading-reset">How to Use This Wiki</h3>
        <p className="section-description">
          Entries connect in two main ways: tags (for discovery) and wiki-links
          (for direct references). On any entry page you can also see “Referenced
          By” backlinks and tag-based related entries.
        </p>
        <ul className="wiki-features">
          <li>✓ Browse by category and subcategory</li>
          <li>✓ Explore concepts via tags</li>
          <li>✓ Use wiki links: <code>[[Concept Name]]</code></li>
          <li>✓ See “Referenced By” backlinks on entry pages</li>
          <li>✓ See related entries based on shared tags</li>
        </ul>
      </div>
    </div>
  );
}
