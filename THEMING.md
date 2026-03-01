# Theming Guide

This guide explains how to customize colors and themes in your wiki.

## CSS Variables System

All colors in the wiki are controlled by CSS variables defined in [app/globals.css](app/globals.css). This allows automatic light/dark mode support.

### Light Mode Variables (default)

```css
:root {
  --bg-primary: #ffffff;           /* Main background */
  --bg-secondary: #f9fafb;         /* Card/footer backgrounds */
  --bg-tertiary: #f3f4f6;          /* Input/code block backgrounds */
  --text-primary: #000000;         /* Main text, headings */
  --text-secondary: #000000;       /* Secondary text */
  --text-tertiary: #666666;        /* Faded text, meta info */
  --border-color: #e5e7eb;         /* Borders, dividers */
  --link-color: #2563eb;           /* Links */
  --link-color-hover: #1d4ed8;     /* Link hover state */
  --tag-bg: linear-gradient(...);  /* Tag background gradient */
  --tag-border: #93c5fd;           /* Tag border */
  --tag-text: #1e40af;             /* Tag text color */
  --card-hover-bg: #eff6ff;        /* Card hover background */
  --card-hover-border: #60a5fa;    /* Card hover border */
}
```

### Dark Mode Variables

When user's OS is set to dark mode, these variables override the light mode ones:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: #0a0a0a;         /* Very dark background */
    --bg-secondary: #1a1a1a;       /* Slightly lighter background */
    --bg-tertiary: #2a2a2a;        /* Even lighter background */
    --text-primary: #ffffff;       /* White text */
    --text-secondary: #ffffff;     /* White text (same as primary) */
    --text-tertiary: #e0e0e0;      /* Light gray text */
    --border-color: #3a3a3a;       /* Dark borders */
    --link-color: #60a5fa;         /* Light blue links */
    --link-color-hover: #93c5fd;   /* Lighter blue on hover */
    --tag-bg: linear-gradient(...);/* Dark blue gradient */
    --tag-border: #3b82f6;         /* Blue border */
    --tag-text: #dbeafe;           /* Light text */
    --card-hover-bg: #1a1a1a;      /* Dark card hover */
    --card-hover-border: #60a5fa;  /* Blue border on hover */
  }
}
```

## Customizing Colors

### Quick Color Changes

Edit the variables in [app/globals.css](app/globals.css) lines 5-19 (light mode) and lines 22-38 (dark mode).

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
| `--bg-primary` | #ffffff | #0a0a0a | Main page background |
| `--bg-secondary` | #f9fafb | #1a1a1a | Cards, footer backgrounds |
| `--bg-tertiary` | #f3f4f6 | #2a2a2a | Input fields, code blocks |
| `--text-primary` | #000000 | #ffffff | Main text, headings |
| `--text-secondary` | #000000 | #ffffff | Secondary text (same as primary in both modes) |
| `--text-tertiary` | #666666 | #e0e0e0 | Meta text, faded text |
| `--border-color` | #e5e7eb | #3a3a3a | Borders, dividers, lines |
| `--link-color` | #2563eb | #60a5fa | Links, blue accents |
| `--link-color-hover` | #1d4ed8 | #93c5fd | Link hover state |
| `--tag-bg` | Blue gradient | Dark blue gradient | Tag button background |
| `--tag-border` | #93c5fd | #3b82f6 | Tag button border |
| `--tag-text` | #1e40af | #dbeafe | Tag button text |
| `--card-hover-bg` | #eff6ff | #1a1a1a | Card on hover |
| `--card-hover-border` | #60a5fa | #60a5fa | Card border on hover |

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
- Verify the variable exists in the dark mode block (lines 21-39 in globals.css)
- Force refresh the browser (Ctrl+Shift+R)

**Some elements still have wrong colors:**
- Search the component file for hardcoded hex colors
- Replace with appropriate `var(--*)` variable

**Need a new color variable:**
- Add it to both light mode (line 5-19) and dark mode (line 22-39) blocks
- Use consistent naming: `--purpose-modifier` (e.g., `--accent-bright`)
- Document it in this file's Reference section

## Future Theme Systems

To add theme switching (light/dark toggle button), you would:
1. Store user preference in localStorage
2. Set `data-theme` attribute on `<html>` element
3. Add CSS rules like: `html[data-theme="dark"] { ... }`

This is currently not implemented since the system uses OS preferences, but the variable-based system makes it easy to add later.
