import Link from 'next/link';
import { getAllTags, getContentByTag } from '@/lib/markdown';

interface Props {
  params: {
    tag: string;
  };
}

export async function generateStaticParams() {
  const tags = await getAllTags();
  return tags.map((tag) => ({
    tag: tag.replace(/\s+/g, '-').toLowerCase(),
  }));
}

export default async function TagPage({ params }: Props) {
  const decodedTag = decodeURIComponent(params.tag).replace(/-/g, ' ');
  const files = await getContentByTag(decodedTag);

  return (
    <div style={{ maxWidth: '56rem', margin: '0 auto', padding: '3rem 1.5rem' }}>
      <Link href="/tags" className="back-link">
        ← Back to All Tags
      </Link>

      <h1>#{decodedTag}</h1>
      <p style={{ color: '#4b5563', marginBottom: '2rem' }}>
        {files.length === 1
          ? '1 entry'
          : `${files.length} entries`} tagged with this concept
      </p>

      <div>
        {files.length === 0 ? (
          <p style={{ color: '#4b5563' }}>No entries found with this tag.</p>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {files.map((file) => (
              <Link
                key={file.slug}
                href={`/${file.category}/${file.subcategory}/${file.slug}`}
                className="card"
                style={{ textDecoration: 'none' }}
              >
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#2563eb' }}>
                    {file.frontmatter.title}
                  </h2>
                  {file.frontmatter.excerpt && (
                    <p style={{ color: '#4b5563', marginBottom: '0.75rem' }}>
                      {file.frontmatter.excerpt}
                    </p>
                  )}
                  <div className="tag-container" style={{ margin: 0 }}>
                    {file.frontmatter.tags?.map((tag) => (
                      <span key={tag} className="tag" style={{ margin: '0.125rem' }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#4b5563', marginTop: '0.5rem', display: 'block' }}>
                    {file.frontmatter.category}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
