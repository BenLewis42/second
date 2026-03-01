import Link from 'next/link';
import { getCategories } from '@/lib/content';

export const metadata = {
  title: 'Second Brain - Home',
};

export default function Home() {
  const categories = getCategories();

  return (
    <div style={{ maxWidth: '56rem', margin: '0 auto', padding: '3rem 1.5rem' }}>
      <div style={{ marginBottom: '3rem' }}>
        <h1>Welcome to My Second Brain</h1>
        <p style={{ fontSize: '1.125rem', color: '#4b5563', maxWidth: '42rem' }}>
          A curated cultural wiki collecting interesting insights, observations, and
          knowledge about art and philosophy. Explore topics, ideas, and the
          interconnections between creative and philosophical thought.
        </p>
      </div>

      <div className="card-highlight" style={{ marginBottom: '3rem' }}>
        <h2 style={{ marginTop: 0 }}>🔍 Explore as a Wiki</h2>
        <p style={{ color: '#1e3a8a', marginBottom: '1rem' }}>
          This wiki uses interconnected concepts, tags, and backlinks to help you navigate and discover relationships between ideas.
        </p>
        <Link
          href="/tags"
          className="btn"
        >
          Start Exploring by Tags →
        </Link>
      </div>

      <div className="grid grid-2" style={{ marginBottom: '3rem' }}>
        {categories.map((category) => (
          <div key={category.name} className="card">
            <h2 style={{ marginTop: 0 }}>{category.label}</h2>
            <p style={{ color: '#4b5563', marginBottom: '1rem' }}>
              {category.name === 'philosophy'
                ? 'Philosophers, concepts, and ideas'
                : 'Artists, movements, and artistic traditions'}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {category.subcategories.map((subcategory) => (
                <Link
                  key={subcategory}
                  href={`/${category.name}/${subcategory}`}
                  style={{
                    color: '#2563eb',
                    textDecoration: 'none',
                    padding: '0.25rem 0'
                  }}
                >
                  {subcategory.charAt(0).toUpperCase() +
                    subcategory.slice(1)}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', marginBottom: '3rem' }}>
        <Link
          href="/tags"
          className="card"
          style={{ textDecoration: 'none' }}
        >
          <h3 style={{ marginTop: 0 }}>Tag Explorer 🏷️</h3>
          <p style={{ color: '#4b5563' }}>
            Browse all topics and concepts by tags
          </p>
        </Link>
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Wiki Links 🔗</h3>
          <p style={{ color: '#4b5563' }}>
            Use [[concept]] syntax to link entries
          </p>
        </div>
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Backlinks 🔄</h3>
          <p style={{ color: '#4b5563' }}>
            See what entries reference each page
          </p>
        </div>
      </div>

      <div className="card-highlight">
        <h3 style={{ marginTop: 0 }}>About This Wiki</h3>
        <p style={{ color: '#1e3a8a', marginBottom: '1rem' }}>
          This is a living document of curiosity and learning. Content is
          organized by topic with tags for easy discovery. Each entry includes
          key ideas, related concepts, and references for deeper exploration.
        </p>
        <h4>Wiki Features:</h4>
        <ul style={{ color: '#1e3a8a' }}>
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
