# Stubs and fact-check (copy-paste to another LLM)

**To populate stubs and fact-check using another LLM (no in-app automation):** follow **[LLM_WORKFLOW.md](LLM_WORKFLOW.md)**. It tells you exactly what to run, what to copy, and how to apply the answers.

Summary: run `output-stubs-for-llm` → copy `.stubs-for-llm.txt` to another LLM → save reply to `.stub-llm-responses.txt` → run `apply-stub-responses`. Same idea for fact-check with `output-fact-check-for-llm` and `.fact-check-for-llm.txt`.

---

## Concepts (reference)

- **Unfilled tag**: A tag used by one or more entries but with no dedicated content page (e.g. `/tags/existentialism` lists entries, but there is no `content/.../existentialism.md`).
- **stub** (frontmatter): `true` = placeholder content; automation should **populate** this file. Set to `false` after populating.
- **verified** (frontmatter): `true` = fact-check applied; automation can skip. Set to `true` after applying fact-check. Unverified pages are in the fact-check queue.
- **Goal**: No stubs and no unverified pages. The pipeline uses these tags to build the **populate queue** (all `stub: true`) and **fact-check queue** (all `verified: false`).

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run tag-stubs-and-unverified` | Tag all content with `stub` and `verified` in frontmatter (from content detection). |
| `npm run suggest-articles` | List all suggested topics (broken wiki links **and** unfilled tags). |
| `npm run generate-article -- <slug>` | Generate one draft by slug (from suggestions or ad hoc). |
| **`npm run output-stubs-for-llm`** | Write all stubs to `.stubs-for-llm.txt` for copy to another LLM. |
| **`npm run apply-stub-responses -- <file>`** | Apply LLM reply file (`.stub-llm-responses.txt`) back to content files. |
| **`npm run output-fact-check-for-llm`** | Write fact-check prompt to `.fact-check-for-llm.txt` for copy to another LLM. |
| `npm run automation-full-pipeline` | Tag + build queues (optional; for reference). |
| `npm run automation-fact-check -- path1 path2` | Output one combined fact-check prompt for multiple files. |
| `npm run extract-claims -- [--cursor] <file>` | Extract claims for one or more files (JSON or Cursor prompt). |
| `npm run apply-fact-check -- <file>` | Print prompt to apply fact-check results; instructs to set `verified: true`. |

## Full pipeline (no stubs, no unverified)

**Full pipeline = populate all stubs + fact-check all unverified.** Both steps are required. No API key. Populate and fact-check are driven by **stub** and **verified** tags.

```bash
AUTOMATION_LIMIT=3 npm run automation-full-pipeline
```

**What the pipeline does:** 1) **Tag all content** with `stub` and `verified` (from content + frontmatter). 2) **Create drafts** from unfilled tags (new files get `stub: true`, `verified: false`). 3) **Populate queue** = all paths with `stub: true` → `.automation-populate-queue.txt`. 4) **Fact-check queue** = all paths with `verified: false` → `.automation-fact-check-queue.txt`. 5) **Instructions** and fact-check prompt (from unverified files that have claims).

**Recommended:** Use the copy-paste workflow in [LLM_WORKFLOW.md](LLM_WORKFLOW.md) (output stubs/fact-check to files → copy to another LLM → apply).

**Stats (logged at end):** Tagged (stubs / unverified counts), drafted paths, populate queue path, fact-check queue path, fact-check prompt file.

## 1. Fact-check after generation (single or batch)

**Option A – Single file (existing workflow)**  
For each new file:

```bash
npm run extract-claims -- --cursor content/philosophy/concepts/foo.md
# Paste output into Cursor, get verdicts, then:
npm run apply-fact-check -- content/philosophy/concepts/foo.md
# Paste that into Cursor, paste the fact-check reply below the line, copy revised markdown into the file.
```

**Option B – Batch (multiple new pages)**  
After generating several pages, build one combined prompt:

```bash
npm run automation-fact-check -- content/philosophy/concepts/a.md content/people/figures/b.md
```

Paste the output into Cursor. Reply with verdicts for each entry, **prefixing each entry’s block with** `## <file path>` (e.g. `## content/philosophy/concepts/a.md`). Then run `npm run apply-fact-check -- <file>` for each file and paste the corresponding part of the reply into the apply prompt.

## 2. Optional: draft-only (no stub/verified queues)

To only generate new drafts and get a fact-check prompt for them:

```bash
AUTOMATION_LIMIT=2 npm run automation-unfilled-tags -- --with-claims
```

Output: one path per line, then `---FACT_CHECK_PROMPT---` and the prompt. Prefer `automation-full-pipeline` for the full populate + fact-check workflow.

## 3. GitHub Actions

A workflow can generate drafts from unfilled tags and save the fact-check prompt as an artifact.

Example (create `.github/workflows/automation-unfilled-tags.yml`):

```yaml
name: Generate pages from unfilled tags

on:
  schedule:
    - cron: '0 12 * * 1'   # Mondays noon UTC
  workflow_dispatch:

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install
        run: npm ci

      - name: Generate from unfilled tags
        id: gen
        env:
          AUTOMATION_LIMIT: 2
        run: |
          npm run automation-unfilled-tags -- --with-claims > automation-out.txt 2>automation-err.txt
          grep -v '^---FACT_CHECK_PROMPT---' automation-out.txt | grep . > created-paths.txt || true
          ( grep '^---FACT_CHECK_PROMPT---' -A 999999 automation-out.txt || true ) | tail -n +2 > fact-check-prompt.txt

      - name: Upload fact-check prompt
        uses: actions/upload-artifact@v4
        with:
          name: fact-check-prompt
          path: fact-check-prompt.txt

      - name: Upload created paths
        uses: actions/upload-artifact@v4
        with:
          name: created-paths
          path: created-paths.txt
```

You can then open the `fact-check-prompt` artifact and paste it into Cursor (or a Cursor Automation) to fact-check, then apply per file.

## Summary

- **Main workflow:** [LLM_WORKFLOW.md](LLM_WORKFLOW.md) — output stubs and fact-check to files, copy to another LLM, apply responses.
- **stub** and **verified** frontmatter tag every page. Run **`npm run tag-stubs-and-unverified`** first, then **`output-stubs-for-llm`** or **`output-fact-check-for-llm`**.
- **GitHub**: Optional workflow in section 3 for scheduled draft generation.
