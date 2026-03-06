# Automation: Unfilled Tags → Page Generation → Fact-Check

This doc describes how to generate new wiki pages from **unfilled tags**, **populate** them with an LLM, and **fact-check** them. The full pipeline leaves nothing incomplete and logs simple stats.

## Concepts

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
| **`npm run automation-full-pipeline`** | **Full pipeline**: tag all → create drafts → **populate queue** (stubs) + **fact-check queue** (unverified) → instructions. No API key. |
| `npm run automation-fact-check -- path1 path2` | Output one combined fact-check prompt for multiple files. |
| `npm run extract-claims -- [--cursor] <file>` | Extract claims for one or more files (JSON or Cursor prompt). |
| `npm run apply-fact-check -- <file>` | Print prompt to apply fact-check results; instructs to set `verified: true`. |

## Full pipeline (no stubs, no unverified)

**Full pipeline = populate all stubs + fact-check all unverified.** Both steps are required. No API key. Populate and fact-check are driven by **stub** and **verified** tags.

```bash
AUTOMATION_LIMIT=3 npm run automation-full-pipeline
```

**What the pipeline does:** 1) **Tag all content** with `stub` and `verified` (from content + frontmatter). 2) **Create drafts** from unfilled tags (new files get `stub: true`, `verified: false`). 3) **Populate queue** = all paths with `stub: true` → `.automation-populate-queue.txt`. 4) **Fact-check queue** = all paths with `verified: false` → `.automation-fact-check-queue.txt`. 5) **Instructions** and fact-check prompt (from unverified files that have claims).

**What Cursor Automation does (see section 4):** Populate every file in the populate queue; when writing back, set `stub: false`. Fact-check every file in the fact-check queue; when applying results, set `verified: true`. Re-run the pipeline until both queues are empty.

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

## 4. Cursor Automations (no stubs, no unverified; no API key)

Use [Cursor Automations](https://cursor.com/docs/cloud-agent/automations) so that **every page is populated and verified**. The automation uses the **best LLM model available** in Cursor.

1. **Create an automation** at [cursor.com/automations](https://cursor.com/automations).
2. **Trigger**: e.g. Schedule (weekly) or GitHub (e.g. push to `main`).
3. **Instructions** for the agent:

   - Clone the repo and run `npm install`.
   - Run **`npm run automation-full-pipeline`** (e.g. `AUTOMATION_LIMIT=3`). The pipeline tags all content with **stub** and **verified**, then writes:
     - **`.automation-populate-queue.txt`** – all paths with `stub: true` (need to be populated).
     - **`.automation-fact-check-queue.txt`** – all paths with `verified: false` (need to be fact-checked).
     - **`.automation-populate-instructions.md`** – full instructions.
   - **Populate** every path in `.automation-populate-queue.txt`: expand stubs into full entries (best model). When you write a file back, set **`stub: false`** in the frontmatter.
   - **Fact-check** every path in `.automation-fact-check-queue.txt`: run `npm run automation-fact-check -- <paths from file>`, save output to `.automation-fact-check-prompt.txt`, get verdicts, then for each path run `npm run apply-fact-check -- <path>` and apply the reply. When you apply fact-check to a file, set **`verified: true`** in the frontmatter.
   - Re-run **`npm run automation-full-pipeline`** (use `AUTOMATION_LIMIT=0` to skip new drafts). Repeat until both queues are empty (no stubs, no unverified pages).
   - Commit and push.

4. **MCPs**: Ensure the automation has git and file read/write so it can clone, run scripts, edit files, and commit.

**Goal**: When the process is done, there are **no stubs** and **no unverified pages**; the queues are driven entirely by the `stub` and `verified` frontmatter tags.

## Summary

- **stub** and **verified** frontmatter tag every page. Automation uses these to build the **populate queue** (stubs) and **fact-check queue** (unverified).
- Run **`npm run tag-stubs-and-unverified`** to sync tags; run **`npm run automation-full-pipeline`** to create drafts (optional), tag all, and write both queues + instructions.
- Cursor Automation populates all stubs (set `stub: false` when done) and fact-checks all unverified (set `verified: true` when done). Re-run the pipeline until both queues are empty.
- **GitHub**: Use the workflow in section 3 to generate on a schedule; use Cursor Automations (section 4) for the full no-stub, no-unverified flow.
