'use client';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>A personal second brain for art and philosophy</p>
        <p className="footer-note">
          Built with{' '}
          <a
            href="https://nextjs.org"
            className="footer-link"
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
