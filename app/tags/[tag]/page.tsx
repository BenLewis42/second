import Link from 'next/link';
import Breadcrumbs from '@/app/components/breadcrumbs';
import { redirect } from 'next/navigation';
import { getAllTags, getContentByTag, getContentPathBySlug } from '@/lib/markdown';

interface Props {
  params: { tag: string };
}

export async function generateStaticParams() {
  const tags = await getAllTags();
  return tags.map((tag) => ({
    tag: tag.replace(/\s+/g, '-').toLowerCase(),
  }));
}

export default async function TagPage({ params }: Props) {
  const tagSlug = decodeURIComponent(params.tag).toLowerCase().replace(/\s+/g, '-');
  const contentPath = await getContentPathBySlug(tagSlug);
  if (contentPath) {
    redirect(`/${contentPath.category}/${contentPath.subcategory}/${tagSlug}`);
  }

  const files = await getContentByTag(params.tag);
  const displayTag = tagSlug.replace(/-/g, ' ');

  return (
    <div className="page-wrapper">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Wiki', href: '/tags' },
          { label: `#${displayTag}` },
        ]}
      />

      <h1>#{displayTag}</h1>
      <p className="tags-intro">
        {files.length === 0
          ? 'No entries with this tag yet.'
          : `${files.length} ${files.length === 1 ? 'entry' : 'entries'} tagged with this concept:`}
      </p>

      {files.length > 0 && (
        <div className="entries-grid">
          {files.map((file) => (
            <Link
              key={file.slug}
              href={`/${file.category}/${file.subcategory}/${file.slug}`}
              className="card"
            >
              <h2 className="tag-entry-title">{file.frontmatter.title}</h2>
              {file.frontmatter.excerpt && (
                <p className="entry-excerpt">{file.frontmatter.excerpt}</p>
              )}
              <div className="tag-container entry-inline-tags">
                {file.frontmatter.tags?.map((t) => (
                  <span key={t} className="tag">{t}</span>
                ))}
              </div>
              <span className="tag-category">{file.frontmatter.category}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
