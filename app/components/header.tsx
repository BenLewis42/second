'use client';

export default function Header() {
  return (
    <header style={{
      borderBottom: '1px solid #e5e7eb',
      backgroundColor: '#ffffff',
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
            color: '#111827',
            textDecoration: 'none'
          }}>
            🧠 Second Brain
          </a>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <a
              href="/philosophy"
              style={{
                color: '#4b5563',
                textDecoration: 'none',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#111827'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#4b5563'}
            >
              Philosophy
            </a>
            <a
              href="/art"
              style={{
                color: '#4b5563',
                textDecoration: 'none',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#111827'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#4b5563'}
            >
              Art
            </a>
            <a
              href="/tags"
              style={{
                color: '#2563eb',
                fontWeight: '500',
                textDecoration: 'none',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#1d4ed8'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#2563eb'}
            >
              🔍 Wiki
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}
