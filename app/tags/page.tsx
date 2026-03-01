import Link from 'next/link';
import { getAllTags, getContentByTag } from '@/lib/markdown';
import { buildContentGraph } from '@/lib/graph';

export const metadata = {
  title: 'Tags - Wiki Explorer',
};

export default async function TagsPage() {
  const tags = await getAllTags();
  const graph = await buildContentGraph();

  // Count tag frequencies
  const tagFrequency = new Map<string, number>();
  graph.nodes.forEach((node) => {
    node.tags.forEach((tag) => {
      tagFrequency.set(tag, (tagFrequency.get(tag) || 0) + 1);
    });
  });

  // Sort tags by frequency
  const sortedTags = Array.from(tagFrequency.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([tag, count]) => ({ tag, count }));

  return (
    <div className="page-wrapper">
      <Link href="/" className="back-link">
        ← Back to Home
      </Link>

      <h1>Explore by Tags</h1>
      <p className="tags-intro">
        Navigate the cultural wiki by topics and concepts. Click any tag to see
        all related content.
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
              {(graph.links.length / graph.nodes.length).toFixed(1)}
            </div>
            <div className="stat-label">Avg Connections</div>
          </div>
        </div>
      </div>

      <div className="all-tags-section">
        <h2>All Tags</h2>
        <div className="tag-container">
          {sortedTags.map(({ tag, count }) => (
            <Link
              key={tag}
              href={`/tags/${tag}`}
              className="tag"
            >
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
          Most frequently used concepts in the cultural wiki:
        </p>
        <div className="top-tags-list">
          {sortedTags.slice(0, 10).map(({ tag, count }, i) => (
            <div key={tag} className="top-tag-item">
              <span className="top-tag-label">
                {i + 1}. {tag}
              </span>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${(count / sortedTags[0].count) * 100}%`,
                  }}
                />
              </div>
              <span className="top-tag-count">
                {count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
