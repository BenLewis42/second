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
    <div className="page-wrapper">
      <Link href="/tags" className="back-link">
        ← Back to All Tags
      </Link>

      <h1>#{decodedTag}</h1>
      <p className="tags-intro">
        {files.length === 1
          ? '1 entry'
          : `${files.length} entries`} tagged with this concept
      </p>

      <div>
        {files.length === 0 ? (
          <p className="text-secondary">No entries found with this tag.</p>
        ) : (
          <div className="entries-grid">
            {files.map((file) => (
              <Link
                key={file.slug}
                href={`/${file.category}/${file.subcategory}/${file.slug}`}
                className="card"
                style={{ textDecoration: 'none' }}
              >
                <div>
                  <h2 className="tag-entry-title">
                    {file.frontmatter.title}
                  </h2>
                  {file.frontmatter.excerpt && (
                    <p className="entry-excerpt">
                      {file.frontmatter.excerpt}
                    </p>
                  )}
                  <div className="tag-container entry-inline-tags">
                    {file.frontmatter.tags?.map((tag) => (
                      <span key={tag} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="tag-category">
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
