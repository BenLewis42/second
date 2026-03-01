import Link from 'next/link';
import { getCategories } from '@/lib/content';
import { getContentFiles } from '@/lib/markdown';

interface Props {
  params: {
    category: string;
    subcategory: string;
  };
}

export async function generateStaticParams() {
  const categories = getCategories();
  const params: Array<{
    category: string;
    subcategory: string;
  }> = [];

  categories.forEach((cat) => {
    cat.subcategories.forEach((subcat) => {
      params.push({
        category: cat.name,
        subcategory: subcat,
      });
    });
  });

  return params;
}

export default async function SubcategoryPage({ params }: Props) {
  const categories = getCategories();
  const category = categories.find((c) => c.name === params.category);

  if (!category || !category.subcategories.includes(params.subcategory)) {
    return (
      <div className="page-wrapper">
        <h1>Content not found</h1>
      </div>
    );
  }

  const files = await getContentFiles(params.category, params.subcategory);

  return (
    <div className="page-wrapper">
      <Link href={`/${params.category}`} className="back-link">
        ← Back to {category.label}
      </Link>

      <h1>
        {params.subcategory.charAt(0).toUpperCase() +
          params.subcategory.slice(1)}
      </h1>

      <div className="entries-grid">
        {files.length === 0 ? (
          <p className="text-secondary">No entries yet in this category.</p>
        ) : (
          files.map((file) => (
            <Link
              key={file.slug}
              href={`/${params.category}/${params.subcategory}/${file.slug}`}
              className="card"
              style={{ textDecoration: 'none' }}
            >
              <h2 className="entry-title">
                {file.frontmatter.title}
              </h2>
              {file.frontmatter.excerpt && (
                <p className="entry-excerpt">
                  {file.frontmatter.excerpt}
                </p>
              )}
              <div className="entry-footer">
                <div className="tag-container entry-tags">
                  {file.frontmatter.tags?.slice(0, 3).map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="entry-date">
                  {new Date(file.frontmatter.date).toLocaleDateString()}
                </span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
