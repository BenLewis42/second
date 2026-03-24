import Link from 'next/link';
import { notFound } from 'next/navigation';
import ArticleHeadingHash from '@/app/components/article-heading-hash';
import Breadcrumbs from '@/app/components/breadcrumbs';
import { formatCategoryName, getCategories } from '@/lib/content';
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
    notFound();
  }

  const categories = getCategories();
  const categoryMeta = categories.find((c) => c.name === params.category);
  const categoryLabel = categoryMeta?.label ?? formatCategoryName(params.category);
  const subLabel = formatCategoryName(params.subcategory);

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
    <div className="page-wrapper">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: categoryLabel, href: `/${params.category}` },
          { label: subLabel, href: `/${params.category}/${params.subcategory}` },
          { label: file.frontmatter.title },
        ]}
      />

      <article className="article">
        <ArticleHeadingHash />
        <header className="article-header">
          <h1 className="article-title">
            {file.frontmatter.title}
          </h1>
          <div className="article-meta">
            <span className="article-date">
              {new Date(file.frontmatter.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
            <div className="tag-container">
              {file.frontmatter.tags?.map((tag) => (
                <Link
                  key={tag}
                  href={`/tags/${tag.replace(/\s+/g, '-').toLowerCase()}`}
                  className="tag tag-small"
                  style={{ textDecoration: 'none' }}
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        </header>

        <div
          className="article-content"
          dangerouslySetInnerHTML={{ __html: processedContent }}
        />
      </article>

      <hr className="section-divider" />

      {/* Related Content */}
      {relatedContent.length > 0 && (
        <div className="related-section">
          <h3 className="related-title">Related Concepts</h3>
          <p className="section-description">
            Entries sharing common tags with this topic:
          </p>
          <div className="related-grid">
            {relatedContent.map((related) => (
              <Link
                key={related.slug}
                href={`/${related.category}/${related.subcategory}/${related.slug}`}
                className="card"
                style={{ textDecoration: 'none' }}
              >
                <h4 className="related-item-title">
                  {related.frontmatter.title}
                </h4>
                <p className="related-item-excerpt">
                  {related.frontmatter.excerpt || 'No description'}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Backlinks */}
      {backlinks.length > 0 && (
        <div className="backlinks-section">
          <h3 className="backlinks-title">Referenced By</h3>
          <p className="section-description">
            Entries that link to this topic:
          </p>
          <ul className="backlinks-list">
            {backlinks.map((backlink) => (
              <li key={backlink.slug}>
                <Link
                  href={`/${backlink.category}/${backlink.subcategory}/${backlink.slug}`}
                  className="back-link"
                >
                  {backlink.frontmatter.title}
                </Link>
                <span className="backlink-category">
                  ({backlink.subcategory})
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="wiki-tips">
        <h4>💡 Wiki Tips</h4>
        <ul>
          <li>• Click tags above to explore related concepts</li>
          <li>• Navigate through connections and backlinks</li>
          <li>• Use the tag explorer to discover topics</li>
        </ul>
      </div>

      <div className="final-nav">
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
