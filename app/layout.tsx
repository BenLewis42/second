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
        <Header />
        <main className="layout-main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
