import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked, Renderer } from 'marked';
import { contentDir } from './content';

export interface Frontmatter {
  title: string;
  category: string;
  tags: string[];
  date: string;
  excerpt?: string;
  /** true if content is still a placeholder stub; automation uses this to decide what to populate. */
  stub?: boolean;
  /** true after fact-check has been applied; automation uses this to decide what to fact-check. */
  verified?: boolean;
  /** Notion page ID this was migrated from, if any. */
  notionId?: string;
}

export interface ContentFile {
  frontmatter: Frontmatter;
  content: string;
  slug: string;
  htmlContent?: string;
  category?: string;
  subcategory?: string;
}

/** Slug for heading `id` — stable, URL-safe, unique per document. */
export function slugifyHeadingId(raw: string, usedIds: Set<string>): string {
  let base = raw
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  if (!base) base = 'section';
  let id = base;
  let n = 2;
  while (usedIds.has(id)) {
    id = `${base}-${n++}`;
  }
  usedIds.add(id);
  return id;
}

export function markdownToHtml(content: string): string {
  const usedIds = new Set<string>();
  const renderer = new Renderer();
  renderer.heading = (text: string, level: number, raw: string) => {
    const id = slugifyHeadingId(raw, usedIds);
    return `<h${level} id="${id}">${text}</h${level}>\n`;
  };
  const out = marked.parse(content, { renderer });
  if (typeof out !== 'string') {
    throw new Error('markdownToHtml: expected synchronous marked output');
  }
  return out;
}

export async function getContentFiles(
  category: string,
  subcategory?: string
): Promise<ContentFile[]> {
  const dir = subcategory
    ? path.join(contentDir, category.toLowerCase(), subcategory)
    : path.join(contentDir, category.toLowerCase());

  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir).filter((file) => file.endsWith('.md'));

  return files.map((file) => {
    const filePath = path.join(dir, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(fileContent);
    const slug = file.replace('.md', '');

    return {
      frontmatter: data as Frontmatter,
      content,
      slug,
    };
  });
}

export async function getContentFile(
  category: string,
  subcategory: string,
  slug: string
): Promise<ContentFile | null> {
  const filePath = path.join(
    contentDir,
    category.toLowerCase(),
    subcategory,
    `${slug}.md`
  );

  if (!fs.existsSync(filePath)) return null;

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);
  const htmlContent = markdownToHtml(content);

  return {
    frontmatter: data as Frontmatter,
    content,
    slug,
    htmlContent,
  };
}

function discoverCategories(): string[] {
  if (!fs.existsSync(contentDir)) return [];
  return fs.readdirSync(contentDir).filter(
    (f) => fs.statSync(path.join(contentDir, f)).isDirectory()
  );
}

export async function getAllTags(): Promise<string[]> {
  const categories = discoverCategories();
  const allTags = new Set<string>();

  for (const category of categories) {
    const categoryPath = path.join(contentDir, category);
    if (!fs.existsSync(categoryPath)) continue;

    const subcategories = fs.readdirSync(categoryPath);
    for (const subcategory of subcategories) {
      const files = await getContentFiles(
        category,
        subcategory
      );
      files.forEach((file) => {
        file.frontmatter.tags?.forEach((tag) => allTags.add(tag));
      });
    }
  }

  return Array.from(allTags).sort();
}

export async function getContentByTag(tag: string): Promise<ContentFile[]> {
  const categories = discoverCategories();
  const results: ContentFile[] = [];

  for (const category of categories) {
    const categoryPath = path.join(contentDir, category);
    if (!fs.existsSync(categoryPath)) continue;

    const subcategories = fs.readdirSync(categoryPath);
    for (const subcategory of subcategories) {
      const files = await getContentFiles(category, subcategory);
      files.forEach((file) => {
        if (file.frontmatter.tags?.includes(tag)) {
          results.push({
            ...file,
            category: category,
            subcategory: subcategory,
          });
        }
      });
    }
  }

  return results;
}

// Wiki link conversion: [[concept-name]] -> <a href="/...">Concept Name</a>
export function convertWikiLinks(
  content: string,
  allFiles: ContentFile[]
): string {
  const wikiLinkRegex = /\[\[([^\]]+)\]\]/g;

  return content.replace(wikiLinkRegex, (match, linkText) => {
    const slug = linkText
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '');

    // Find matching file
    const matchingFile = allFiles.find(
      (f) => f.slug === slug || f.frontmatter.title.toLowerCase() === linkText.toLowerCase()
    );

    if (matchingFile && matchingFile.category && matchingFile.subcategory) {
      const url = `/${matchingFile.category}/${matchingFile.subcategory}/${matchingFile.slug}`;
      // We are operating on already-rendered HTML, so return a real <a> tag,
      // not markdown link syntax, to avoid showing the raw URL in the article.
      return `<a href="${url}">${linkText}</a>`;
    }

    // Return original if not found (styled as broken link)
    return `<span class="wiki-link-broken">${linkText}</span>`;
  });
}

// Find all files that reference this file
export async function getBacklinks(
  targetCategory: string,
  targetSubcategory: string,
  targetSlug: string
): Promise<ContentFile[]> {
  const categories = discoverCategories();
  const backlinks: ContentFile[] = [];
  const targetTitle = targetSlug
    .replace(/-/g, ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  for (const category of categories) {
    const categoryPath = path.join(contentDir, category);
    if (!fs.existsSync(categoryPath)) continue;

    const subcategories = fs.readdirSync(categoryPath);
    for (const subcategory of subcategories) {
      const files = fs.readdirSync(path.join(categoryPath, subcategory));
      
      for (const file of files) {
        if (!file.endsWith('.md')) continue;
        
        const filePath = path.join(categoryPath, subcategory, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const slug = file.replace('.md', '');

        // Check if this file links to our target
        const wikiLinkRegex = /\[\[([^\]]+)\]\]/g;
        let match;
        let hasLink = false;

        while ((match = wikiLinkRegex.exec(fileContent)) !== null) {
          const linkedTitle = match[1];
          if (
            linkedTitle.toLowerCase() === targetTitle.toLowerCase() ||
            linkedTitle.toLowerCase().replace(/\s+/g, '-') === targetSlug
          ) {
            hasLink = true;
            break;
          }
        }

        if (hasLink) {
          const { data } = matter(fileContent);
          backlinks.push({
            frontmatter: data as Frontmatter,
            content: fileContent,
            slug: slug,
            category: category,
            subcategory: subcategory,
          });
        }
      }
    }
  }

  return backlinks;
}

// Get all content with metadata for building connection graphs
export async function getAllContent(): Promise<
  Array<ContentFile & { category: string; subcategory: string }>
> {
  const categories = discoverCategories();
  const allContent: Array<ContentFile & { category: string; subcategory: string }> = [];

  for (const category of categories) {
    const categoryPath = path.join(contentDir, category);
    if (!fs.existsSync(categoryPath)) continue;

    const subcategories = fs.readdirSync(categoryPath);
    for (const subcategory of subcategories) {
      const files = await getContentFiles(category, subcategory);
      files.forEach((file) => {
        allContent.push({
          ...file,
          category: category,
          subcategory: subcategory,
        });
      });
    }
  }

  return allContent;
}

/** Return category/subcategory for a content slug, or null if no page exists. */
export async function getContentPathBySlug(
  slug: string
): Promise<{ category: string; subcategory: string } | null> {
  const all = await getAllContent();
  const normalized = slug.toLowerCase().trim().replace(/\s+/g, '-');
  const found = all.find(
    (f) => f.slug === normalized || f.slug === slug
  );
  return found ? { category: found.category, subcategory: found.subcategory } : null;
}

// Get related content based on shared tags
export async function getRelatedContent(
  tags: string[],
  excludeSlug: string,
  limit = 5
): Promise<ContentFile[]> {
  const allContent = await getAllContent();
  const related = allContent
    .filter((file) => file.slug !== excludeSlug)
    .map((file) => {
      const sharedTagCount = file.frontmatter.tags?.filter((tag) =>
        tags.includes(tag)
      ).length || 0;
      return { file, sharedTagCount };
    })
    .filter((item) => item.sharedTagCount > 0)
    .sort((a, b) => b.sharedTagCount - a.sharedTagCount)
    .slice(0, limit)
    .map((item) => item.file);

  return related;
}
