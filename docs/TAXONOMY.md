# Content taxonomy

This document defines **where notes live** under `content/` so the wiki stays navigable as it grows. URLs follow the path: `/{category}/{subcategory}/{slug}`.

## Top-level categories

| Category | Use for | Not for |
|----------|---------|---------|
| **people** | Named individuals (thinkers, artists, public figures) when the entry is *about the person*. | Generic roles or unnamed groups—use **social-science** or **culture** if the topic is the phenomenon, not a biography. |
| **philosophy** | Philosophical ideas, schools, arguments, and meta-philosophy tied to discourse (ethics, mind, justice, movements). | Purely artistic movements with little philosophical framing—prefer **culture**; technical logic/CS theory—**cs**. |
| **culture** | Arts, media, literature, film, design, and broad cultural topics (places, practices, contemporary culture). | Hard sciences or social institutions—use **science** or **social-science**. |
| **science** | Empirical and natural sciences, health, environment, measurement—topics where evidence and method matter most. | Philosophy of science as *discourse* can sit in **philosophy**; applied tech—**cs**. |
| **social-science** | Society, institutions, economics, law, history-as-discipline, groups, communication, politics *as systems*. | Individual biographies—**people**; purely cultural taste—**culture**. |
| **cs** | Computing, languages, security, algorithms, AI *as technical practice*. | Technology’s social effects without a CS core—**social-science** or **culture**. |
| **spirit** | Religious and spiritual traditions, practices, and related worldviews *as lived or classified*. | Secular philosophy only—**philosophy**. |
| **reference** | Lists, quotes, reading logs, crosswords, and other **meta** or **collection** pages that point elsewhere rather than argue a thesis. | Standalone essays or deep dives—put them in the substantive category that matches the topic. |

When two categories seem right, prefer the one that matches **the primary reason someone would open the note**.

## Subcategories (current)

Paths are fixed segments under each category; add new subfolders only when you have several related notes and a clear label.

### people

- **figures** — Individual people (one primary subject per file is typical).

### philosophy

- **concepts** — Ideas, movements, and thematic entries (not tied to one person’s bio).

### culture

- **art** — Visual arts, movements, craft tied to art history or practice.
- **film** — Cinema, directors, films as objects of study.
- **literature** — Written work, genres, authors when the focus is literary (not only biography—author-as-bio can be **people**).
- **topics** — Cross-cutting cultural themes (places, fashion, games, journalism, etc.) that are not only one medium.

### science

- **topics** — Scientific subject areas and applied science notes.

### social-science

- **topics** — Institutions, behavior, economics, history, language, etc.
- **politics** — Power, activism, policy, geopolitics—when the lens is political even if culture overlaps.

### cs

- **fundamentals** — Core CS, data, algorithms, theory adjacent to computing.
- **languages** — Programming languages and language-specific notes.
- **security** — Cybersecurity and related technical security topics.

### spirit

- **traditions** — Lineages, religions, texts, classifications.
- **practices** — Meditation, mindfulness, ritual practice.

### reference

- **collections** — Curated lists (quotes, reading, maps, jokes, etc.) and indexes.

## Rules for expansion

1. **Prefer an existing subcategory** if the note clearly fits; avoid a new folder for one-off files.
2. **Add a new subcategory** when you expect **multiple** entries and the name is stable (kebab-case, one concept per folder).
3. **Add a new top-level category** only for a sustained corpus that would clutter an existing bucket; update this doc and `README.md` when you do.
4. **Match frontmatter** — `category` in YAML should describe the same domain as the folder (see project conventions); routing is driven by the file path.
5. **Slug** — Filename (`slug.md`) becomes part of the URL; choose slugs that stay valid if you later move the file only when you accept URL changes or add redirects.

## Quick decision flow

1. Is it mainly **one person**? → **people/figures** (or **culture**/**philosophy** if it is really about a work/movement with the person secondary).
2. Is it **philosophical content** without being a bio? → **philosophy/concepts**.
3. Is it **art / film / lit / general culture**? → **culture** (pick subfolder).
4. Is it **empirical / natural / medical / technical science**? → **science/topics**.
5. Is it **society, economy, law, politics-as-system**? → **social-science** (**topics** vs **politics**).
6. Is it **code / systems / security / PL**? → **cs**.
7. Is it **religious or spiritual** in subject? → **spirit**.
8. Is it mostly **links, lists, or a grab bag**? → **reference/collections**.

---

*Update this file when you add or rename folders under `content/`.*
