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
      <div style={{ maxWidth: '56rem', margin: '0 auto', padding: '3rem 1.5rem' }}>
        <h1>Content not found</h1>
      </div>
    );
  }

  const files = await getContentFiles(params.category, params.subcategory);

  return (
    <div style={{ maxWidth: '56rem', margin: '0 auto', padding: '3rem 1.5rem' }}>
      <Link href={`/${params.category}`} className="back-link">
        ← Back to {category.label}
      </Link>

      <h1>
        {params.subcategory.charAt(0).toUpperCase() +
          params.subcategory.slice(1)}
      </h1>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {files.length === 0 ? (
          <p style={{ color: '#4b5563' }}>No entries yet in this category.</p>
        ) : (
          files.map((file) => (
            <Link
              key={file.slug}
              href={`/${params.category}/${params.subcategory}/${file.slug}`}
              className="card"
              style={{ textDecoration: 'none' }}
            >
              <h2 style={{ marginTop: 0, fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                {file.frontmatter.title}
              </h2>
              {file.frontmatter.excerpt && (
                <p style={{ color: '#4b5563', marginBottom: '0.75rem' }}>
                  {file.frontmatter.excerpt}
                </p>
              )}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                <div className="tag-container" style={{ margin: 0, flex: 1 }}>
                  {file.frontmatter.tags?.slice(0, 3).map((tag) => (
                    <span key={tag} className="tag" style={{ margin: '0.125rem' }}>
                      {tag}
                    </span>
                  ))}
                </div>
                <span style={{ fontSize: '0.75rem', color: '#4b5563', flexShrink: 0 }}>
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
