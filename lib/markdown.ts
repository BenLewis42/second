import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

export interface Frontmatter {
  title: string;
  category: 'Philosophers' | 'Concepts' | 'Artists' | 'Movements';
  tags: string[];
  date: string;
  excerpt?: string;
}

export interface ContentFile {
  frontmatter: Frontmatter;
  content: string;
  slug: string;
  htmlContent?: string;
  category?: string;
  subcategory?: string;
}

const contentDir = path.join(process.cwd(), 'content');

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
  const htmlContent = await marked(content);

  return {
    frontmatter: data as Frontmatter,
    content,
    slug,
    htmlContent: htmlContent.toString(),
  };
}

export async function getAllTags(): Promise<string[]> {
  const categories = ['philosophy', 'art'];
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
  const categories = ['philosophy', 'art'];
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

// Wiki link conversion: [[concept-name]] -> [Concept Name](link)
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
      return `[${linkText}](${url})`;
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
  const categories = ['philosophy', 'art'];
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
  const categories = ['philosophy', 'art'];
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
