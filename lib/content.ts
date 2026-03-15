import fs from 'fs';
import path from 'path';

export interface ContentCategory {
  name: string;
  label: string;
  subcategories: string[];
}

/** Canonical content root; used by markdown, article-suggestions, and content helpers. */
export const contentDir = path.join(process.cwd(), 'content');

const LABEL_OVERRIDES: Record<string, string> = {
  cs: 'CS',
  'social-science': 'Social Science',
};

function dirLabel(dir: string): string {
  if (LABEL_OVERRIDES[dir]) return LABEL_OVERRIDES[dir];
  return dir
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function getCategories(): ContentCategory[] {
  const categories: ContentCategory[] = [];

  const dirs = fs.readdirSync(contentDir);
  dirs.forEach((dir) => {
    const categoryPath = path.join(contentDir, dir);
    if (fs.statSync(categoryPath).isDirectory()) {
      const subcategories = fs
        .readdirSync(categoryPath)
        .filter((f) => {
          const sub = path.join(categoryPath, f);
          if (!fs.statSync(sub).isDirectory()) return false;
          return fs.readdirSync(sub).some((s) => s.endsWith('.md'));
        });

      if (subcategories.length === 0) return;

      categories.push({
        name: dir,
        label: dirLabel(dir),
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
