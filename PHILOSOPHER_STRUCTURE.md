# Philosopher Entry Structure Guide

This document establishes a consistent structure for philosopher entries in the cultural wiki. Following this template ensures entries are comprehensive, interconnected, and easy to navigate.

## Standard Philosopher Entry Structure

### 1. **Frontmatter (YAML)**

```yaml
---
title: "Philosopher Name"
category: "Philosophers"
tags: ["tag1", "tag2", "period", "specialty", "related-concepts"]
date: "YYYY-MM-DD"
excerpt: "Brief 1-2 sentence summary of who they were and what they're known for."
---
```

**Guidelines:**
- `excerpt`: Quick overview mentioning time period, nationality, and main contribution
- `tags`: Include period (e.g., "ancient-greek", "19th-century"), specialty (e.g., "metaphysics", "ethics"), and related movements/people
- Use lowercase with hyphens for multi-word tags

---

### 2. **Biography Section** (New addition - focuses on influences and impact)

```markdown
### Biography

[Name] ([Birth-Death]) was a [nationality] philosopher [key historical context]. Influenced by [[predecessor/teacher]], they developed [main contribution]. Their ideas shaped [[movement1]], [[movement2]], and influenced [[related-figure]]. [Brief note on lasting impact or interesting historical context].
```

**Key elements:**
- Lead with name, dates, and nationality
- Name 1-3 major influences using internal wiki links
- Mention how their ideas shaped subsequent movements/disciplines
- Note any important context about reception or misinterpretation
- Keep to 2-4 sentences

**Example patterns:**
- "Influenced by X, developed Y, shaped Z"
- "Student of X, founded Y, influenced Z and W"
- "Reacted against X, created Y, foundational to Z"

---

### 3. **Concepts Section** (Core ideas)

```markdown
---

### Concepts

Concept Name:

Explanation of the concept in 2-3 sentences. Include what makes it distinctive, why it matters, and how it relates to other ideas.

<br/>

<br/>

Next Concept Name:

...
```

**Guidelines:**
- Start each concept with the name as a bolded heading (no markdown formatting needed, just the name with colon)
- Explain clearly for someone unfamiliar with the philosopher
- 2-3 sentences per concept is ideal
- Separate concepts with `<br/><br/>` for visual spacing
- Use `[[wiki-links]]` to connect to related concepts, other philosophers, movements, etc.
- Typically 5-8 major concepts per philosopher

---

### 4. **Major Works Section**

```markdown
---

### Major Works

- **Work Title** - Brief description of what the work covers and its significance
- **Another Work** - Why this work matters and what major ideas it presents
```

**Guidelines:**
- Bold the work title
- 1-2 sentence description for each
- List 4-8 most important works
- Optional: group by type if many works (e.g., "Dialogues", "Essays", "Treatises")

---

### 5. **Influence/Impact Section** (Context of impact)

```markdown
---

### [Influence on Art/Influence on Science/Philosophical Legacy/etc.]

Paragraph explaining how this philosopher's ideas shaped subsequent fields, movements, or disciplines. Connection with examples.

- Bullet point examples of influence
- Another field or movement they influenced
- Specific artists or thinkers who drew from them
```

**Guidelines:**
- Head varies by philosopher ("Influence on Art", "Philosophical Legacy", "Impact on Science", etc.)
- Focus on concrete examples and connections
- Use wiki links to point to related entries
- 1 paragraph + 3-5 bullet points typical

---

### 6. **Notable Quotes Section**

```markdown
---

### Notable Quotes

> "Quote that captures the philosopher's voice or core idea."

> "Another important quote showing different aspect of thinking."
```

**Guidelines:**
- 3-5 most representative quotes
- Quotes should be memorable, distinctive, or encapsulate key ideas
- Include the most famous quotes where appropriate

---

### 7. **Related Topics Section**

```markdown
---

### Related Topics

- **[[Related Philosopher]]** - Brief explanation of relationship (teacher/student, agreed/disagreed, etc.)
- **[[Concept]]** - How it relates to this philosopher
- **[[Movement]]** - Historical context of influence
```

**Guidelines:**
- 6-10 related topics
- Prioritize: influential figures → key concepts → movements
- Single sentence for each explaining the connection
- All should be wiki-linkable entries

---

## Visual Formatting

- Section dividers: `---` (horizontal rules) with blank lines before and after
- Concept spacing: `<br/><br/>` between major concepts
- Headings: Use `###` for main sections (Biography, Concepts, Major Works, etc.)
- Internal connections: Always use `[[concept-name]]` for relating entries

---

## Examples to Reference

- **Nietzsche entry** - Good example of influence-focused biography, modern period
- **Plato entry** - Good example of ancient period, foundational thinker
- **Leonardo da Vinci** (artist, but similar structure) - Example of impact across disciplines

---

## Wiki Linking Best Practices

When writing philosopher entries:

1. **Link to influences**: `[[Aristotle]]` mentioned as teacher/influence
2. **Link to influenced figures**: Show who they shaped
3. **Link to concepts**: Both their own and related concepts
4. **Link to movements**: [[Existentialism]], [[Platonism]], etc.
5. **Link to related disciplines**: [[Art]], [[Science]], where relevant

This creates the interconnected knowledge graph that makes the wiki valuable.

---

## Checklist for New Philosopher Entry

- [ ] Frontmatter complete with relevant tags
- [ ] Biography focuses on influences received and impact given
- [ ] 5-8 major concepts explained clearly
- [ ] Concepts separated with `<br/><br/>`
- [ ] Major Works section (4-8 works)
- [ ] Influence/Impact section explaining historical significance
- [ ] 3-5 notable quotes
- [ ] Related Topics with brief explanations
- [ ] All key concepts and figures wiki-linked
- [ ] Section dividers (`---`) with proper spacing
- [ ] No inline styles used (CSS handled in globals.css)
- [ ] Date updated to current date if modified

---

## Notes

- Keep language clear and accessible - these entries should be understandable to someone encountering the philosopher for the first time
- Balance depth with brevity - aim for entries that can be read in 5-10 minutes
- Always show interconnections - a great wiki entry helps readers navigate to related ideas
- Historical accuracy is important, but so is making ideas relevant and interesting
