'use client';

export default function Header() {
  return (
    <header className="header">
      <nav className="header-nav">
        <div className="header-container">
          <a href="/" className="header-logo">
            🧠 Second Brain
          </a>
          <div className="header-links">
            <a
              href="/people"
              className="nav-link"
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              People
            </a>
            <a
              href="/philosophy"
              className="nav-link"
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              Philosophy
            </a>
            <a
              href="/art"
              className="nav-link"
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              Art
            </a>
            <a
              href="/tags"
              className="nav-link-active"
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--link-color-hover)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--link-color)'}
            >
              🔍 Wiki
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}
