import Link from 'next/link';
import { getCategories } from '@/lib/content';

export const metadata = {
  title: 'Second Brain - Home',
};

export default function Home() {
  const categories = getCategories();

  return (
    <div className="page-wrapper">
      <div className="page-section">
        <h1>Welcome to My Second Brain</h1>
        <p className="intro-text">
          A curated cultural wiki collecting interesting insights, observations, and
          knowledge about art and philosophy. Explore topics, ideas, and the
          interconnections between creative and philosophical thought.
        </p>
      </div>

      <div className="card-highlight page-section">
        <h2 className="heading-reset">🔍 Explore as a Wiki</h2>
        <p className="section-description">
          This wiki uses interconnected concepts, tags, and backlinks to help you navigate and discover relationships between ideas.
        </p>
        <Link
          href="/tags"
          className="btn"
        >
          Start Exploring by Tags →
        </Link>
      </div>

      <div className="grid grid-2 page-section">
        {categories.map((category) => (
          <div key={category.name} className="card">
            <h2 className="heading-reset">{category.label}</h2>
            <p className="section-description">
              {category.name === 'philosophy'
                ? 'Philosophers, concepts, and ideas'
                : 'Artists, movements, and artistic traditions'}
            </p>
            <div className="flex-col gap-small">
              {category.subcategories.map((subcategory) => (
                <Link
                  key={subcategory}
                  href={`/${category.name}/${subcategory}`}
                  className="subcategory-link"
                >
                  {subcategory.charAt(0).toUpperCase() +
                    subcategory.slice(1)}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="grid-featured page-section">
        <Link
          href="/tags"
          className="card"
          style={{ textDecoration: 'none' }}
        >
          <h3 className="heading-reset">Tag Explorer 🏷️</h3>
          <p className="section-description">
            Browse all topics and concepts by tags
          </p>
        </Link>
        <div className="card">
          <h3 className="heading-reset">Wiki Links 🔗</h3>
          <p className="section-description">
            Use [[concept]] syntax to link entries
          </p>
        </div>
        <div className="card">
          <h3 className="heading-reset">Backlinks 🔄</h3>
          <p className="section-description">
            See what entries reference each page
          </p>
        </div>
      </div>

      <div className="card-highlight">
        <h3 className="heading-reset">About This Wiki</h3>
        <p className="text-link page-section">
          This is a living document of curiosity and learning. Content is
          organized by topic with tags for easy discovery. Each entry includes
          key ideas, related concepts, and references for deeper exploration.
        </p>
        <h4>Wiki Features:</h4>
        <ul className="wiki-features">
          <li>✓ Topic-based organization (Philosophers, Artists, Concepts, Movements)</li>
          <li>✓ Tag system for cross-referencing content</li>
          <li>✓ Wiki-style [[concept]] links that auto-convert</li>
          <li>✓ Backlinks showing what entries reference each page</li>
          <li>✓ Related content suggestions based on shared tags</li>
          <li>✓ Tag explorer for navigation and discovery</li>
          <li>✓ Connection graph visualization of concept relationships</li>
        </ul>
      </div>
    </div>
  );
}
