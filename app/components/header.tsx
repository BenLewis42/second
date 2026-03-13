'use client';

const navCategories = [
  { href: '/people', label: 'People' },
  { href: '/philosophy', label: 'Philosophy' },
  { href: '/cs', label: 'CS' },
  { href: '/science', label: 'Science' },
  { href: '/social-science', label: 'Social Science' },
  { href: '/spirit', label: 'Spirit' },
  { href: '/culture', label: 'Culture' },
];

export default function Header() {
  return (
    <header className="header">
      <nav className="header-nav">
        <div className="header-container">
          <a href="/" className="header-logo">
            Second
          </a>
          <div className="header-links">
            {navCategories.map((cat) => (
              <a
                key={cat.href}
                href={cat.href}
                className="nav-link"
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                {cat.label}
              </a>
            ))}
            <a
              href="/tags"
              className="nav-link-active"
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--link-color-hover)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--link-color)'}
            >
              Wiki
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}
