'use client';

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid #e5e7eb',
      backgroundColor: '#f9fafb',
      marginTop: '4rem'
    }}>
      <div style={{
        maxWidth: '56rem',
        margin: '0 auto',
        padding: '2rem 1.5rem',
        textAlign: 'center',
        color: '#4b5563',
        fontSize: '0.875rem'
      }}>
        <p>A personal second brain for art and philosophy</p>
        <p style={{ marginTop: '0.5rem' }}>
          Built with{' '}
          <a
            href="https://nextjs.org"
            style={{ color: '#2563eb', textDecoration: 'none' }}
            onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
            onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
          >
            Next.js
          </a>
          {' '}and published for the web
        </p>
      </div>
    </footer>
  );
}
