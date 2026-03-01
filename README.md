# Second Brain - Art & Philosophy Wiki

A web-published personal knowledge base for collecting, organizing, and sharing interesting information on art and philosophy as an interconnected cultural wiki.

## Features

- 📚 Topic-based organization (Philosophers, Artists, Concepts, Movements)
- 🏷️ **Tag system** for cross-referencing content
- 🔗 **Wiki-style links** (`[[concept-name]]`) that auto-convert to internal links
- 🔄 **Backlinks** showing which entries reference each page
- 🔍 **Related content suggestions** based on shared tags
- 🎨 **Tag explorer** for discovering and navigating topics
- 📊 **Connection graph** showing relationships between concepts
- 📅 Dated entries with metadata
- 🎨 Clean, readable web interface
- 📱 Responsive design
- 🚀 Built with modern web technologies (Next.js)
- 🌐 Ready to publish on GitHub Pages or Netlify

## Wiki as a Knowledge System

This project is designed as a **cultural wiki** where concepts, ideas, and people are interconnected through multiple navigation methods:

### 1. **Wiki-Style Links**
Write organic connections using `[[concept-name]]` syntax:
```markdown
---
title: "Aristotle"
---

## Overview
Aristotle was influenced by [[Plato]] but developed his own philosophy.
His ideas on [[virtue-ethics]] shaped Western thought.
```

Links automatically convert to internal page links. If a link target doesn't exist, it appears as a broken link indicator.

### 2. **Tags for Discovery**
Every entry has tags that group related concepts across categories:
```yaml
---
title: "Sfumato Technique"
category: "Concepts"
tags: ["renaissance", "painting-technique", "leonardo-da-vinci", "atmospheric-perspective"]
---
```

**Benefits:**
- Explore all entries tagged "renaissance" across both Art and Philosophy
- Discover unexpected connections between artists and philosophers from the same period
- Build semantic relationships without rigid hierarchies

### 3. **Backlinks & References**
When viewing an entry, see:
- **Related Concepts**: Other entries sharing tags
- **Referenced By**: Which entries link to this page via `[[wiki-links]]`

This creates a bidirectional relationship map of your knowledge.

### 4. **Tag Explorer**
Visit `/tags` to:
- See all tags with frequency counts
- View tag statistics and relationships
- Browse entries by tag
- Discover most-connected concepts

### 5. **Connection Graph**
The system maintains a graph of all connections to show:
- Total nodes (entries)
- Total links (relationships)
- Average connections per entry
- Most connected concepts

## Project Structure

```
.
├── content/                    # Your actual content files (for the web project)
│   ├── philosophy/
│   │   ├── philosophers/      # Individual philosopher entries
│   │   └── concepts/          # Philosophical concepts
│   └── art/
│       ├── artists/           # Individual artist entries
│       └── movements/         # Art movements
├── Philosophy/                 # Philosophy raw text files (for manual collection)
│   ├── Philosophers/
│   └── Concepts/
├── Art/                        # Art raw text files (for manual collection)
│   ├── Artists/
│   └── Movements/
├── app/                        # Next.js app (pages and components)
│   ├── components/            # React components (Header, Footer)
│   ├── tags/                  # Tag explorer pages
│   ├── [category]/            # Dynamic category routes
│   │   ├── page.tsx
│   │   ├── [subcategory]/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/
│   │   │       └── page.tsx   # Individual entry pages with backlinks
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Home page
│   └── globals.css            # Global styles
├── lib/                        # Utility functions
│   ├── markdown.ts            # Markdown parsing, wiki links, backlinks
│   ├── content.ts             # Content organization
│   └── graph.ts               # Connection graph building
├── package.json
├── next.config.js             # Next.js configuration
└── tsconfig.json              # TypeScript configuration
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn

### Installation

1. Clone or download this repository
2. Navigate to the project directory:
   ```bash
   cd second
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Adding Content

### Creating Entries

Entries are Markdown files with YAML frontmatter. Create files in the appropriate directory:

**Structure:** `content/[category]/[subcategory]/[filename].md`

**Example:** `content/philosophy/concepts/virtue-ethics.md`

```markdown
---
title: "Virtue Ethics"
category: "Concepts"
tags: ["ethics", "aristotle", "character", "eudaimonia"]
date: "2026-02-28"
excerpt: "An approach to ethics emphasizing character development and human flourishing"
---

## Overview

Virtue ethics is a philosophical approach that emphasizes...

## Concepts

### Arete (Excellence)
The concept of [[Arete]] is central to virtue ethics. It refers to...

### Eudaimonia
[[Eudaimonia]], often translated as flourishing or happiness, is...

## Related Philosophers

- [[Aristotle]] - Founder of virtue ethics
- [[Plato]] - Influenced Aristotle's thinking
- [[Stoics]] - Developed their own virtue system

## Connection to Art

The pursuit of excellence ([[Arete]]) in virtue ethics parallels the artist's pursuit of [[Technical Excellence]] in their craft.

---
```

### Frontmatter Fields

- **title** (required): Name of the entry
- **category** (required): "Philosophers", "Concepts", "Artists", or "Movements"
- **tags** (required): Array of tags for categorization and connection
- **date** (required): Publication date (YYYY-MM-DD format)
- **excerpt** (optional): Brief summary shown in lists

### File Naming

Use kebab-case (lowercase with hyphens) for filenames:
- ✅ `leonardo-da-vinci.md`
- ✅ `virtue-ethics.md`
- ❌ `Leonardo da Vinci.md`

### Wiki Link Syntax

Use `[[concept-name]]` to link within your wiki:
- `[[Aristotle]]` - Links to the Aristotle entry
- `[[Virtue Ethics]]` - Links to the Virtue Ethics entry
- Links work across categories (Philosophy and Art)
- If a link doesn't match any entry, it appears as a broken link

### Tags Best Practices

- Use lowercase with hyphens: `renaissance-art`, `ancient-philosophy`
- Create bridges between categories: Use same tag for Philosophy and Art content
- Use period tags: `ancient-greece`, `renaissance`, `modern-era`
- Use method tags: `phenomenology`, `dialectic`, `empiricism`
- Use connection tags: Link related people/movements

**Example tags for natural connections:**
```
# Leonardo da Vinci entry
tags: ["renaissance", "italian-artist", "scientific-observation", "anatomy", "engineering"]

# Leo's anatomy notes entry
tags: ["renaissance", "scientific-observation", "anatomy", "leonardo-da-vinci", "observation-method"]

# Aristotle entry
tags: ["ancient-greece", "philosopher", "observation-method", "ethics", "metaphysics"]
```

People viewing "Renaissance" tag will see both art and philosophy entries. Those viewing "observation-method" will see Leonardo and Aristotle connected conceptually.

## Publishing to the Web

### Option 1: GitHub Pages (Free)

1. Push your repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/second-brain.git
   git push -u origin main
   ```

2. Go to your GitHub repository Settings → Pages

3. Set Source to "GitHub Actions"

4. The repository includes a workflow file (`.github/workflows/deploy.yml`) that will automatically build and deploy on each push

5. Your site will be published at `https://yourusername.github.io/second-brain`

### Option 2: Netlify (Free Tier)

1. Push your repository to GitHub/GitLab/Bitbucket

2. Connect your repository to Netlify at [netlify.com](https://netlify.com)

3. Build settings:
   - Branch: `main`
   - Build command: `npm run build && npm run export`
   - Publish directory: `out`

4. Deploy!

### Option 3: Vercel (Free Tier - Optimal)

1. Visit [vercel.com](https://vercel.com)

2. Click "New Project" and import your GitHub repository

3. Vercel will auto-detect Next.js and configure itself

4. Deploy with one click!

## Building for Production

```bash
npm run build
```

This creates an optimized build ready for deployment.

## Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Run production build locally
- `npm run export` - Export as static HTML (for GitHub Pages)

## Customization

### Styling

Edit `app/globals.css` to customize the appearance. The current style uses:
- Clean, minimalist design
- Inter font family
- Blue accent colors
- Responsive grid layouts

### Adding New Categories

1. Create new folder structure in `content/`:
   ```
   content/category-name/
   ├── subcategory1/
   └── subcategory2/
   ```

2. Add markdown files in the subcategory folders

3. The navigation will auto-update

### Modifying the Layout

- Header (with Wiki link): `app/components/header.tsx`
- Footer: `app/components/footer.tsx`
- Home page: `app/page.tsx`
- Tag explorer: `app/tags/page.tsx`

## Tips for Building Your Cultural Wiki

- **Be consistent**: Use similar formatting and structure across entries
- **Cross-reference strategically**: Use `[[wiki-links]]` to show relationships
- **Tag generously**: Think about how concepts might be browsed together
- **Build semantic connections**: Use tags to bridge Art and Philosophy entries
- **Create entry clusters**: Related entries grouped by shared tags help discovery
- **Write excerpts**: Help readers quickly understand entry content
- **Update regularly**: Add new insights and observations as you learn
- **Test links**: Remember `[[broken-links]]` appear in red - fix them!

## Understanding the Wiki Graph

The system automatically builds a knowledge graph showing:
- **Nodes**: Each entry (philosopher, artist, concept, movement)
- **Links**: Connections based on shared tags
- **Depth**: How far related concepts extend

Visit `/tags` to see graph statistics:
- Total entries and connections
- Average connections per entry
- Most frequently used tags
- Most interconnected concepts

This helps identify:
- Well-developed topic areas
- Gaps in your knowledge
- Natural clusters of related ideas
- Bridge concepts that connect domains

## Future Enhancements

- Interactive connection graph visualization
- Full-text search across entries
- RSS feed generation
- Social sharing buttons
- Comment/discussion functionality
- Graph visualization with D3.js
- Related entries sidebar on every page
- Most recent entries feed

## Technologies Used

- **Next.js 14** - React framework for production
- **TypeScript** - Type-safe JavaScript
- **gray-matter** - YAML frontmatter parsing
- **marked** - Markdown to HTML parsing
- **CSS** - Pure CSS, no frameworks (minimal footprint)

## License

This is your personal knowledge base. Use it however you like!

## Credits

Built to be a flexible, publishable personal knowledge management system with wiki-style linking and discovery features.

---

**Happy learning and sharing!** 🧠✨

Start by exploring the `/tags` page to understand how the wiki works, or dive into Philosophy or Art to begin reading and adding content.

