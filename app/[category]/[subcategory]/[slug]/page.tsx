import Link from 'next/link';
import { getCategories } from '@/lib/content';
import { getContentFile, getContentFiles, getBacklinks, getRelatedContent, getAllContent } from '@/lib/markdown';
import { convertWikiLinks } from '@/lib/markdown';

interface Props {
  params: {
    category: string;
    subcategory: string;
    slug: string;
  };
}

export async function generateStaticParams() {
  const categories = getCategories();
  const params: Array<{
    category: string;
    subcategory: string;
    slug: string;
  }> = [];

  for (const cat of categories) {
    for (const subcat of cat.subcategories) {
      const files = await getContentFiles(cat.name, subcat);
      files.forEach((file) => {
        params.push({
          category: cat.name,
          subcategory: subcat,
          slug: file.slug,
        });
      });
    }
  }

  return params;
}

export default async function ContentPage({ params }: Props) {
  const file = await getContentFile(
    params.category,
    params.subcategory,
    params.slug
  );

  if (!file) {
    return (
      <div style={{ maxWidth: '56rem', margin: '0 auto', padding: '3rem 1.5rem' }}>
        <h1>Content not found</h1>
      </div>
    );
  }

  // Get all content for wiki link conversion
  const allContent = await getAllContent();

  // Convert wiki-style links
  const processedContent = convertWikiLinks(file.htmlContent || '', allContent);

  // Get backlinks and related content
  const backlinks = await getBacklinks(params.category, params.subcategory, params.slug);
  const relatedContent = await getRelatedContent(
    file.frontmatter.tags || [],
    params.slug,
    5
  );

  return (
    <div style={{ maxWidth: '56rem', margin: '0 auto', padding: '3rem 1.5rem' }}>
      <Link
        href={`/${params.category}/${params.subcategory}`}
        className="back-link"
      >
        ← Back to{' '}
        {params.subcategory.charAt(0).toUpperCase() +
          params.subcategory.slice(1)}
      </Link>

      <article style={{ marginTop: '2rem' }}>
        <header style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            {file.frontmatter.title}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.875rem' }}>
              {new Date(file.frontmatter.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
            <div className="tag-container" style={{ margin: 0, justifyContent: 'flex-end' }}>
              {file.frontmatter.tags?.map((tag) => (
                <Link
                  key={tag}
                  href={`/tags/${tag.replace(/\s+/g, '-').toLowerCase()}`}
                  className="tag"
                  style={{ textDecoration: 'none', fontSize: '0.75rem' }}
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        </header>

        <div
          style={{
            lineHeight: '1.75',
            color: 'var(--text-primary)',
            marginBottom: '3rem',
          }}
          dangerouslySetInnerHTML={{ __html: processedContent }}
        />
      </article>

      <hr style={{ margin: '3rem 0', border: 'none', borderTop: '1px solid #e0e0e0' }} />

      {/* Related Content */}
      {relatedContent.length > 0 && (
        <div style={{ marginBottom: '3rem' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Related Concepts</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Entries sharing common tags with this topic:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
            {relatedContent.map((related) => (
              <Link
                key={related.slug}
                href={`/${related.category}/${related.subcategory}/${related.slug}`}
                className="card"
                style={{ textDecoration: 'none' }}
              >
                <h4 style={{ fontWeight: 'bold', color: 'var(--link-color)', marginBottom: '0.25rem' }}>
                  {related.frontmatter.title}
                </h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  {related.frontmatter.excerpt || 'No description'}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Backlinks */}
      {backlinks.length > 0 && (
        <div style={{ marginBottom: '3rem' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Referenced By</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Entries that link to this topic:
          </p>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {backlinks.map((backlink) => (
              <li key={backlink.slug}>
                <Link
                  href={`/${backlink.category}/${backlink.subcategory}/${backlink.slug}`}
                  className="back-link"
                >
                  {backlink.frontmatter.title}
                </Link>
                <span style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem', marginLeft: '0.5rem' }}>
                  ({backlink.subcategory})
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: '0.5rem' }}>
        <h4 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>💡 Wiki Tips</h4>
        <ul style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <li>• Click tags above to explore related concepts</li>
          <li>• Navigate through connections and backlinks</li>
          <li>• Use the tag explorer to discover topics</li>
        </ul>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <Link
          href={`/${params.category}/${params.subcategory}`}
          className="back-link"
        >
          ← View all in {params.subcategory}
        </Link>
      </div>
    </div>
  );
}
