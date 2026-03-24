import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Not found — Second',
  description: 'This path does not exist in this commonplace book.',
};

export default function NotFound() {
  return (
    <div className="page-wrapper not-found-page">
      <h1>Page not found</h1>
      <p className="not-found-lead">
        There is no entry or section at this URL. It may have moved, or the link may be wrong.
      </p>
      <ul className="not-found-links">
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/search">Search</Link>
        </li>
        <li>
          <Link href="/tags">Wiki (tags)</Link>
        </li>
      </ul>
      <p className="not-found-hint text-secondary">
        Use <strong>Surprise me</strong> in the header to open a random entry.
      </p>
    </div>
  );
}
