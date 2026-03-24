import Link from 'next/link';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/app/components/breadcrumbs';import { getCategories } from '@/lib/content';

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
    notFound();
  }

  return (
    <div className="page-wrapper">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: category.label },
        ]}
      />

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
