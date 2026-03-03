# Theming Guide

This guide explains how to customize colors, fonts, and themes in your wiki.

## Fonts

The wiki uses a serif pairing suited to long-form reading and a cultural/knowledge aesthetic:

- **Headings:** [Fraunces](https://fonts.google.com/specimen/Fraunces) – variable serif with character, used for all headings and the logo.
- **Body:** [Lora](https://fonts.google.com/specimen/Lora) – readable serif for article and UI text.

Fonts are loaded from Google Fonts in [app/globals.css](app/globals.css). To change them, update the `@import` at the top of `globals.css` and the CSS variables:

```css
--font-heading: 'Fraunces', Georgia, serif;
--font-body: 'Lora', Georgia, serif;
--font-mono: 'ui-monospace', 'Cascadia Code', Menlo, monospace;
```

## CSS Variables System

All colors in the wiki are controlled by CSS variables defined in [app/globals.css](app/globals.css). This allows automatic light/dark mode support.

### Light Mode Variables (default)

Light mode uses warm stone neutrals (`#fafaf9`, `#1c1917`) for a softer look:

```css
:root {
  --font-heading: 'Fraunces', Georgia, serif;
  --font-body: 'Lora', Georgia, serif;
  --bg-primary: #fafaf9;           /* Warm off-white */
  --bg-secondary: #f5f5f4;          /* Card/footer */
  --bg-tertiary: #e7e5e4;           /* Code, inputs */
  --text-primary: #1c1917;          /* Near black */
  --text-secondary: #44403c;        /* Body secondary */
  --text-tertiary: #78716c;         /* Meta, faded */
  --border-color: #e7e5e4;          /* Borders */
  --link-color: #2563eb;            /* Links */
  --link-color-hover: #1d4ed8;     /* Link hover */
  --accent-solid: #2563eb;         /* Progress, accents */
  --quote-border: #3b82f6;          /* Blockquote left border */
  --error-text / --error-border / --error-bg;  /* Broken wiki links */
  --btn-secondary-bg: #57534e;      /* Secondary buttons */
  /* + tag and card variables */
}
```

### Dark Mode Variables

When the user's OS is set to dark mode, stone-style dark variables are applied:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: #0c0a09;          /* Warm black */
    --bg-secondary: #1c1917;         /* Cards, footer */
    --bg-tertiary: #292524;         /* Code, inputs */
    --text-primary: #fafaf9;        /* Off-white */
    --text-secondary: #e7e5e4;     /* Secondary */
    --text-tertiary: #a8a29e;      /* Meta */
    --quote-border: #60a5fa;       /* Blockquote */
    --error-*: dark-mode red variants;
    /* + same structure as light */
  }
}
```

## Customizing Colors

### Quick Color Changes

Edit the variables in [app/globals.css](app/globals.css): the first `:root` block (light mode) and the `@media (prefers-color-scheme: dark)` block (dark mode).

For example, to change the primary accent color from blue to purple:

**Light mode:**
```css
--link-color: #a855f7;          /* Purple instead of blue */
--link-color-hover: #9333ea;    /* Darker purple on hover */
```

**Dark mode:**
```css
--link-color: #d8b4fe;          /* Light purple */
--link-color-hover: #e9d5ff;    /* Lighter purple on hover */
```

### Using Variables in React Components

When adding new colors, always use CSS variables with the `var()` function:

```tsx
// ✅ CORRECT - Uses CSS variables
<div style={{ color: 'var(--text-primary)' }}>
  Main text
</div>

// ❌ WRONG - Hardcoded color
<div style={{ color: '#111827' }}>
  Main text
</div>
```

### Using Variables in CSS Classes

In [app/globals.css](app/globals.css), use variables for all colors:

```css
/* ✅ CORRECT */
.my-component {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

/* ❌ WRONG */
.my-component {
  background: #f9fafb;
  color: #111827;
  border: 1px solid #e5e7eb;
}
```

## Variable Reference

| Variable | Light | Dark | Purpose |
|----------|-------|------|---------|
| `--font-heading` | Fraunces | (same) | Headings, logo |
| `--font-body` | Lora | (same) | Body text |
| `--font-mono` | ui-monospace… | (same) | Code |
| `--bg-primary` | #fafaf9 | #0c0a09 | Main page background |
| `--bg-secondary` | #f5f5f4 | #1c1917 | Cards, footer |
| `--bg-tertiary` | #e7e5e4 | #292524 | Inputs, code blocks |
| `--text-primary` | #1c1917 | #fafaf9 | Main text, headings |
| `--text-secondary` | #44403c | #e7e5e4 | Secondary text |
| `--text-tertiary` | #78716c | #a8a29e | Meta, faded text |
| `--border-color` | #e7e5e4 | #292524 | Borders, dividers |
| `--link-color` | #2563eb | #60a5fa | Links |
| `--link-color-hover` | #1d4ed8 | #93c5fd | Link hover |
| `--accent-solid` | #2563eb | #60a5fa | Progress bar, solid accents |
| `--quote-border` | #3b82f6 | #60a5fa | Blockquote left border |
| `--error-text` / `--error-bg` / `--error-border` | red variants | dark red | Broken wiki links |
| `--btn-secondary-bg` | #57534e | #78716c | Secondary button |
| `--tag-bg` / `--tag-border` / `--tag-text` | blue gradients | dark blue | Tags |
| `--card-hover-bg` / `--card-hover-border` | blue tint | dark | Card hover |

## Common Patterns

### Text Color

```tsx
// Main text (headings, body) - uses CSS class
<h1>Title</h1>  // inherits --text-primary

// Secondary text
<p style={{ color: 'var(--text-secondary)' }}>Secondary info</p>

// Faded text (dates, metadata)
<span style={{ color: 'var(--text-tertiary)' }}>Meta text</span>
```

### Links and Buttons

```tsx
<a href="/" style={{
  color: 'var(--link-color)',
  textDecoration: 'none'
}}>
  Link
</a>

// Hover effect (without Tailwind)
<a onMouseEnter={(e) => e.currentTarget.style.color = 'var(--link-color-hover)'}
   onMouseLeave={(e) => e.currentTarget.style.color = 'var(--link-color)'}>
  Hoverable link
</a>
```

### Cards and Containers

```tsx
<div style={{
  background: 'var(--bg-secondary)',
  border: `1px solid var(--border-color)`,
  padding: '1.5rem',
  borderRadius: '0.5rem'
}}>
  Card content
</div>
```

### Hover States

```tsx
<div style={{
  border: `1px solid var(--border-color)`,
  transition: 'all 0.2s'
}}
onMouseEnter={(e) => {
  e.currentTarget.style.borderColor = 'var(--card-hover-border)';
  e.currentTarget.style.backgroundColor = 'var(--card-hover-bg)';
}}
onMouseLeave={(e) => {
  e.currentTarget.style.borderColor = 'var(--border-color)';
  e.currentTarget.style.backgroundColor = 'transparent';
}}>
  Hoverable card
</div>
```

## Checking for Hardcoded Colors

To find hardcoded colors that should use variables, search for hex color codes in TSX files:

```bash
# Search for hardcoded colors (regex)
grep -r "#[0-9a-f]\{6\}" app/ --include="*.tsx"
```

Replace patterns:
- `#ffffff`, `#f9fafb`, `#f3f4f6` → `var(--bg-*)`
- `#000000`, `#111827`, `#4b5563`, `#666666`, `#999999` → `var(--text-*)`
- `#e5e7eb` → `var(--border-color)`
- `#2563eb`, `#1d4ed8` → `var(--link-color*)`

## Testing Dark Mode

### On macOS
Settings → General → Appearance → Dark

### On Windows 10+
Settings → Personalization → Colors → Dark

### In Browser (Chrome DevTools)
1. Open DevTools (F12)
2. Command Palette (Ctrl+Shift+P)
3. Type "Emulate CSS media feature prefers-color-scheme"
4. Select "prefers-color-scheme: dark"

## Troubleshooting

**Colors don't change in dark mode:**
- Check that the element uses `var(--color-name)` not hardcoded colors
- Verify the variable exists in the `@media (prefers-color-scheme: dark)` block in globals.css
- Force refresh the browser (Ctrl+Shift+R)

**Some elements still have wrong colors:**
- Search the component file for hardcoded hex colors
- Replace with appropriate `var(--*)` variable

**Need a new color variable:**
- Add it to both the main `:root` block (light) and the `prefers-color-scheme: dark` block
- Use consistent naming: `--purpose-modifier` (e.g., `--accent-bright`)
- Document it in this file's Variable Reference table

## Future Theme Systems

To add theme switching (light/dark toggle button), you would:
1. Store user preference in localStorage
2. Set `data-theme` attribute on `<html>` element
3. Add CSS rules like: `html[data-theme="dark"] { ... }`

This is currently not implemented since the system uses OS preferences, but the variable-based system makes it easy to add later.
