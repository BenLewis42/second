import type { Metadata } from 'next';
import Header from './components/header';
import Footer from './components/footer';
import './globals.css';

export const metadata: Metadata = {
  title: 'Second — Commonplace Book',
  description:
    'A personal commonplace book connecting knowledge through tags, wiki-links, and references.',
  openGraph: {
    title: 'Second — Commonplace Book',
    description:
      'A personal commonplace book connecting knowledge through tags, wiki-links, and references.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="layout-body">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Header />
        <main id="main-content" className="layout-main" tabIndex={-1}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
