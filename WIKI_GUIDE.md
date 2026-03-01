# 🔗 Cultural Wiki Usage Guide

This guide explains how to use the interconnected wiki system to create a knowledge network of art and philosophy.

## Understanding the Wiki

Your second brain is not just a collection of articles—it's a **cultural wiki** where concepts, people, and ideas are connected through multiple navigation layers:

1. **Wiki Links** - Explicit connections between entries
2. **Tags** - Thematic groupings across categories
3. **Backlinks** - Inverse references showing impact
4. **Related Content** - Suggested connections based on tags

## 1. Wiki-Style Links

### How to Write Wiki Links

Use `[[concept-name]]` syntax in your markdown content:

```markdown
## Key Ideas

[[Aristotle]] built upon the work of [[Plato]], but diverged significantly 
in his approach to [[metaphysics]] and [[ethics]].

The [[Renaissance]] was influenced by the rediscovery of [[ancient-greece|ancient Greek]] texts.
```

### Rules for Wiki Links

- **Exact matches preferred**: `[[Leonardo da Vinci]]` links to entry titled "Leonardo da Vinci"  
- **Slugified fallback**: `[[leonardo-da-vinci]]` auto-matches "Leonardo da Vinci" entry
- **Label optional**: `[[concept-name|Display Text]]` - coming soon
- **Broken links appear red**: If no matching entry exists

### Link Targets

Links can point to:
- Entry titles: `[[Aristotle]]` → links to philosopher named Aristotle
- Concept pages: `[[Virtue Ethics]]` → links to concept page
- Artist names: `[[Michelangelo]]` → works across categories
- Movements: `[[Romanticism]]` → links to art/philosophy movements

## 2. Tag System

### Why Tags Matter

Tags are your **discovery mechanism**. Unlike hierarchical organization, tags create **multiple valid paths** through your knowledge.

### Tagging Strategy

#### Period Tags
```yaml
tags: 
  - "ancient-greece"
  - "renaissance"
  - "modern-era"
  - "contemporary"
```

#### Method/Discipline Tags
```yaml
tags:
  - "phenomenology"
  - "empiricism"
  - "dialectic-method"
  - "observation-based"
  - "abstract-art"
  - "figurative-art"
```

#### Person/Creator Tags
```yaml
tags:
  - "plato-school"
  - "aristotle-influenced"
  - "leonardo-da-vinci"
  - "inspired-by-renaissance"
```

#### Concept Tags
```yaml
tags:
  - "ethics"
  - "metaphysics"
  - "beauty"
  - "aesthetics"
  - "human-flourishing"
```

### Real-World Example

**Entry: Raphael (Artist)**
```yaml
---
title: "Raphael"
tags: ["renaissance", "italian-artist", "harmony", "balance", "mathematical-proportion"]
---
```

**Entry: Plato (Philosopher)**
```yaml
---
title: "Plato"
tags: ["ancient-greece", "forms", "idealism", "mathematical-proportion", "harmony", "beauty"]
---
```

**Result**: Both appear under "mathematical-proportion" and "harmony" tags, revealing philosophical parallels!

## 3. Building Connection Webs

### Connect Across Categories

Use tags to bridge Art and Philosophy:

```yaml
# Immanuel Kant (Philosopher)
tags: ["aesthetic-theory", "beauty", "judgment"]

# Neoclassical Art (Movement)
tags: ["aesthetic-theory", "proportions", "reason"}
```

### Create Cluster Tags

Group related concepts under umbrella tags:

```yaml
# Virtue Ethics (Concept)
tags: ["virtue-ethics", "aristotelian-philosophy", "character-development"]

# Renaissance Art (Movement)
tags: ["virtue-ethics-parallel", "craft-mastery", "human-potential"]
```

### Temporal Connections

```yaml
# Ancient Greece (all philosophers)
tags: ["ancient-greece", "athenian-philosophy"]

# Greek-Inspired Art (movements)
tags: ["ancient-greece-influence", "neoclassical"]
```

## 4. Navigating the Wiki

### The Tag Explorer (`/tags`)

Visit the tag explorer to:
- See all tags with frequency counts
- Understand which concepts are most developed
- Spot underexplored areas
- Find connection hubs

**What it shows:**
- Wiki statistics (total entries, connections, average links)
- All tags sorted by frequency
- Top 10 most-used concepts

### Individual Entry Page

Each entry displays:

1. **Title & Metadata**
   - Publication date
   - Clickable tags (go to tag page)

2. **Content**
   - Wiki links auto-converted to clickable links
   - Broken links highlighted in red
   - Suggests missing entries

3. **Related Concepts Section**
   - Entries sharing tags with this page
   - Shows thematic connections
   - Great for discovering adjacent topics

4. **Referenced By Section**
   - Entries that link to this page via `[[wiki-links]]`
   - Shows impact and relationships
   - Reveals where this concept appears important

5. **Wiki Tips**
   - Reminder about navigation options
   - Encourages exploration

## 5. Writing for the Wiki

### Entry Template

```markdown
---
title: "Entry Title"
category: "Philosophers|Concepts|Artists|Movements"
tags: ["tag1", "tag2", "tag3-bridging-concept", "era"]
date: "2026-02-28"
excerpt: "One-sentence description of this entry"
---

## Overview

Brief introduction and context.

## Concepts

### First Idea
Explanation. Related to [[other-concept]].

### Second Idea  
Explanation referencing [[philosopher-name]] and [[art-movement]].

## Related Topics

- [[direct-connection-1]]
- [[direct-connection-2]]
- [[philosophical-parallel]]

---
```

### Best Practices

✅ **DO:**
- Use `[[wiki-links]]` for conceptual connections
- Write descriptive excerpts (1 sentence)
- Tag generously (5-8 tags per entry)
- Create bridges between Art and Philosophy
- Link to existing entries that influenced this topic
- Use consistent title capitalization

❌ **DON'T:**
- Overlink (every word doesn't need to be a link)
- Create orphan entries (link to them from existing entries)
- Use vague tag names
- Forget to tag for discoverability
- Mix categories in one entry

## 6. Common Patterns

### The "Inspired By" Pattern

```markdown
---
title: "Impressionism"
tags: ["art-movement", "19th-century", "light-perception", "perceptual-philosophy"]
---

## Philosophical Context

Impressionism was influenced by [[Kant's aesthetic theory]] and 
[[phenomenology|phenomenological approaches]] to perception.
```

### The "Method Connection" Pattern

```markdown
---
title: "Scientific Observation in Art"
tags: ["observation-method", "renaissance", "empiricism", "leonardo-da-vinci"]
---

## The Method

Both [[Aristotle's empiricism]] and [[leonardo-da-vinci|Leonardo's approach]] 
valued direct observation over pure theory.
```

### The "Historical Context" Pattern

```markdown
---
title: "Stoicism"
tags: ["ancient-greece", "ethics", "virtue-ethics", "resilience"]
---

## Context

Developed after [[Aristotle]], during the [[Hellenistic Period]].
Later influenced [[Renaissance humanism]].
```

## 7. Using Backlinks Strategically

Backlinks reveal **where your ideas matter**. If an entry has many backlinks:
- It's a foundational concept
- It's a bridge between domains
- It's widely influential in your wiki

Use this to:
- Identify central concepts that need expansion
- Spot well-developed topics
- Find natural clusters of knowledge
- Understand your knowledge landscape

## 8. Maintaining the Wiki

### Regular Maintenance

- **Monthly**: Review tag usage, look for orphaned entries
- **Per-entry**: Ensure all `[[wiki-links]]` are valid (no red broken links)
- **Quarterly**: Add cross-domain connections with new tags

### Growing the Wiki

1. Start with major figures and concepts
2. Add foundational entries first
3. Create bridges with tags
4. Fill gaps as backlinks reveal them
5. Connect across Art/Philosophy regularly

### Managing Complexity

As your wiki grows:
- Use the tag explorer to understand structure
- Look for over-tagged entries (simplify)
- Add meta-concepts when tags cluster
- Consider adding category pages in time

## 9. Quick Start Checklist

- [ ] Create Philosophers entries (Plato, Aristotle, Kant)
- [ ] Create Concepts entries (Ethics, Beauty, Knowledge)
- [ ] Create Artists entries (Leonardo, Raphael, Michelangelo)
- [ ] Link them with `[[wiki-links]]`
- [ ] Use tags to create bridges
- [ ] Visit `/tags` to see structure
- [ ] Click through related content
- [ ] Verify backlinks make sense
- [ ] Begin adding unique content

## 10. Example Flow

**You're learning about the Renaissance.**

1. Visit `/art/movements` → find "Renaissance"
2. Read entry, see `[[classical-proportion]]` link
3. Click that link, learn about proportional theory
4. See it's tagged with "mathematics"
5. Visit `/tags/mathematics` 
6. Discover both "Euclid" and "Brunelleschi" use this tag
7. Find unexpected connection between geometry and architecture
8. Create new concept entry: "Mathematics in Renaissance Art"
9. Tag it with both "renaissance" and "mathematics"
10. It now appears in both `/tags/renaissance` and `/tags/mathematics`

**This is the wiki working as intended:** discovering non-obvious connections.

---

**Remember**: The wiki is strongest when densely connected. Link generously, tag strategically, and let the structure reveal what you know and what you need to learn!
