'use client';

export default function Header() {
  return (
    <header style={{
      borderBottom: '1px solid var(--border-color)',
      backgroundColor: 'var(--bg-primary)',
      position: 'sticky',
      top: 0,
      zIndex: 40
    }}>
      <nav style={{ maxWidth: '56rem', margin: '0 auto', padding: '1rem 1.5rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <a href="/" style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: 'var(--text-primary)',
            textDecoration: 'none'
          }}>
            🧠 Second Brain
          </a>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <a
              href="/philosophy"
              style={{
                color: 'var(--text-primary)',
                textDecoration: 'none',
                transition: 'opacity 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              Philosophy
            </a>
            <a
              href="/art"
              style={{
                color: 'var(--text-primary)',
                textDecoration: 'none',
                transition: 'opacity 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              Art
            </a>
            <a
              href="/tags"
              style={{
                color: 'var(--link-color)',
                fontWeight: '500',
                textDecoration: 'none',
                transition: 'color 0.2s'
              }}
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
