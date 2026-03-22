---
title: Tags
category: Reference
tags:
  - meta
  - tags
  - navigation
date: '2024-01-07'
excerpt: How tags work in this wiki—cross-cutting labels that complement folders and wiki links.
stub: false
verified: false
notionId: f96b9da5-91e8-42b8-9ff4-015ff146cc2c
---

# Tags

In this project, **tags** are YAML frontmatter labels on each markdown file. They power the **tag explorer** (`/tags` in the built site), **related entries** (shared tags), and the **connection graph** statistics—not the folder path.

## Why use tags

- **Cross categories** — e.g. `renaissance` can touch [[Art]], [[Philosophy]], and [[History]] without forcing one parent folder.
- **Discovery** — readers find a note from a theme they care about, not only from the category tree.
- **Consistency** — prefer reusing existing tags over inventing near-duplicates (`critical-theory` vs `critical theory` style drift).

## Good tagging habits

1. **3–8 tags** per entry is usually enough; avoid turning the frontmatter into a second essay.
2. **Stable, kebab-case or short phrases** that match how you already write elsewhere in the repo.
3. **Mix scope levels** when useful: one period tag, one method or medium, one “hook” tag (person, movement, region).

## Tags vs wiki links

- **`[[Wiki links]]`** express **explicit** relationships (“this page discusses that page”).
- **Tags** group pages **thematically** even when the body does not name every sibling.

Use both: links for argument, tags for browse and clustering.

## See also

- [[Maps]] — other navigational indexes.
- [[Philosophy]] — example of a large hub that benefits from consistent tagging.
