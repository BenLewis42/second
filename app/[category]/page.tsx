import Link from 'next/link';
import { getCategories } from '@/lib/content';

interface Props {
  params: {
    category: string;
  };
}

export async function generateStaticParams() {
  const categories = getCategories();
  return categories.map((cat) => ({
    category: cat.name,
  }));
}

export default function CategoryPage({ params }: Props) {
  const categories = getCategories();
  const category = categories.find((c) => c.name === params.category);

  if (!category) {
    return (
      <div className="page-wrapper">
        <h1>Category not found</h1>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <Link href="/" className="back-link">
        ← Back to Home
      </Link>

      <h1>{category.label}</h1>

      <div className="grid grid-2">
        {category.subcategories.map((subcategory) => (
          <Link
            key={subcategory}
            href={`/${category.name}/${subcategory}`}
            className="card"
            style={{ textDecoration: 'none' }}
          >
            <h2 className="subcategory-heading">
              {subcategory.charAt(0).toUpperCase() +
                subcategory.slice(1)}
            </h2>
          </Link>
        ))}
      </div>
    </div>
  );
}
