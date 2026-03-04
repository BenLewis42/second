import Link from 'next/link';
import { getAllTags, getAllContent } from '@/lib/markdown';
import { buildContentGraph } from '@/lib/graph';

export const metadata = {
  title: 'Tags - Wiki Explorer',
};

export default async function TagsPage() {
  const [tags, graph, allContent] = await Promise.all([
    getAllTags(),
    buildContentGraph(),
    getAllContent(),
  ]);

  const slugToPath = new Map<string, { category: string; subcategory: string }>();
  allContent.forEach((f) => slugToPath.set(f.slug, { category: f.category, subcategory: f.subcategory }));

  const tagFrequency = new Map<string, number>();
  graph.nodes.forEach((node) => {
    node.tags.forEach((tag) => {
      tagFrequency.set(tag, (tagFrequency.get(tag) || 0) + 1);
    });
  });

  const sortedTags = Array.from(tagFrequency.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([tag, count]) => ({ tag, count }));

  function tagHref(tag: string): string {
    const path = slugToPath.get(tag);
    return path ? `/${path.category}/${path.subcategory}/${tag}` : `/tags/${tag}`;
  }

  return (
    <div className="page-wrapper">
      <Link href="/" className="back-link">
        ← Back to Home
      </Link>

      <h1>Explore by Tags</h1>
      <p className="tags-intro">
        Click a tag to open that page. Tags with a dedicated entry go straight to it; others list entries that use the tag.
      </p>

      <div className="card-highlight page-section">
        <h2 className="heading-reset">Wiki Statistics</h2>
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-number">{graph.nodes.length}</div>
            <div className="stat-label">Entries</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{sortedTags.length}</div>
            <div className="stat-label">Tags</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{graph.links.length}</div>
            <div className="stat-label">Connections</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">
              {graph.nodes.length > 0 ? (graph.links.length / graph.nodes.length).toFixed(1) : '0.0'}
            </div>
            <div className="stat-label">Avg Connections</div>
          </div>
        </div>
      </div>

      <div className="all-tags-section">
        <h2>All Tags</h2>
        <div className="tag-container">
          {sortedTags.map(({ tag, count }) => (
            <Link key={tag} href={tagHref(tag)} className="tag">
              <span>{tag}</span>
              <span className="tag-count">({count})</span>
            </Link>
          ))}
        </div>
      </div>

      <hr className="section-divider" />

      <div className="card-highlight">
        <h3 className="heading-reset">Top Tags</h3>
        <p className="section-description">
          Most used tags; click to open the page or see entries.
        </p>
        <div className="top-tags-list">
          {sortedTags.slice(0, 10).map(({ tag, count }, i) => (
            <div key={tag} className="top-tag-item">
              <span className="top-tag-label">
                {i + 1}. <Link href={tagHref(tag)} className="subcategory-link">{tag}</Link>
              </span>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ '--fill-width': `${(count / sortedTags[0].count) * 100}%` } as React.CSSProperties}
                />
              </div>
              <span className="top-tag-count">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
