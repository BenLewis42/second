import type { Metadata } from 'next';
import Header from './components/header';
import Footer from './components/footer';
import './globals.css';

export const metadata: Metadata = {
  title: 'Second Brain - Art & Philosophy',
  description:
    'A personal second brain collecting interesting information on art and philosophy',
  openGraph: {
    title: 'Second Brain - Art & Philosophy',
    description:
      'A personal second brain collecting interesting information on art and philosophy',
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
      <body style={{ margin: 0, padding: 0 }}>
        <Header />
        <main style={{ minHeight: '100vh' }}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
