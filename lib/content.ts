import fs from 'fs';
import path from 'path';

export interface ContentCategory {
  name: string;
  label: string;
  subcategories: string[];
}

/** Canonical content root; used by markdown, article-suggestions, and content helpers. */
export const contentDir = path.join(process.cwd(), 'content');

export function getCategories(): ContentCategory[] {
  const categories: ContentCategory[] = [];

  const dirs = fs.readdirSync(contentDir);
  dirs.forEach((dir) => {
    const categoryPath = path.join(contentDir, dir);
    if (fs.statSync(categoryPath).isDirectory()) {
      const subcategories = fs
        .readdirSync(categoryPath)
        .filter(
          (f) =>
            fs.statSync(path.join(categoryPath, f)).isDirectory()
        );

      categories.push({
        name: dir,
        label: dir.charAt(0).toUpperCase() + dir.slice(1),
        subcategories,
      });
    }
  });

  return categories;
}

export function formatCategoryName(name: string): string {
  return name
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function slugToPath(slug: string): string {
  return slug.replace(/-/g, ' ');
}
