# Stubs and fact-check via another LLM (copy-paste workflow)

No automation. You output content to files, copy to another LLM, paste answers back, then run scripts to apply.

---

## Part 1: Populate all stubs

### Step 1 – Tag and output stubs

In the repo root:

```bash
npm run tag-stubs-and-unverified
npm run output-stubs-for-llm
```

This creates **`.stubs-for-llm.txt`** with instructions and every stub file (path + full content). Stubs are files that still have placeholder text.

### Step 2 – Copy to another LLM

1. Open **`.stubs-for-llm.txt`**.
2. Copy **the entire file** (instructions + all stub blocks).
3. Paste into your other LLM (Claude, ChatGPT, etc.).
4. Ask it to expand each stub into a full wiki entry, keeping the same format: `## FILE: path` then the full markdown, separated by `---`.

### Step 3 – Save the LLM’s reply and apply

1. Paste the LLM’s **full reply** into a new file in the repo: **`.stub-llm-responses.txt`**.
2. Run:

```bash
npm run apply-stub-responses -- .stub-llm-responses.txt
```

This writes each `## FILE: path` block back to the corresponding file under `content/`.

### Step 4 – Re-tag

```bash
npm run tag-stubs-and-unverified
```

Stub count should drop (populated files get `stub: false`). Repeat from Step 1 if you still have stubs.

---

## Part 2: Fact-check all unverified pages

### Step 1 – Output fact-check prompt

```bash
npm run tag-stubs-and-unverified
npm run output-fact-check-for-llm
```

This creates **`.fact-check-for-llm.txt`** with instructions and a combined fact-check prompt (all claims from unverified files).

### Step 2 – Copy to another LLM

1. Open **`.fact-check-for-llm.txt`**.
2. Copy the **whole file**.
3. Paste into your other LLM.
4. Get back verdicts for each claim (ACCURATE / INACCURATE / UNCERTAIN + reason). The reply should use `## content/path/to/file.md` before each file’s verdicts and end each entry with `## New facts to check` or `None.`

### Step 3 – Apply verdicts to each file

For **each** file that had verdicts:

1. Run (use the real path from the fact-check reply):

```bash
npm run apply-fact-check -- content/philosophy/concepts/ethics.md
```

2. Copy the **printed prompt** (the block that ends with “Fact-check results (paste below this line):”).
3. Paste that into your LLM.
4. **Below the line**, paste **that file’s** fact-check verdicts from Step 2.
5. Ask the LLM to output the revised markdown (with corrections applied and **`verified: true`** in the frontmatter).
6. Save the LLM’s revised markdown into the same file (e.g. `content/philosophy/concepts/ethics.md`), replacing the old content.

### Step 4 – Re-tag

```bash
npm run tag-stubs-and-unverified
```

Unverified count should drop. Repeat from Part 2 Step 1 if you still have unverified pages.

---

## Quick reference

| Goal | Command(s) | File you copy to LLM | What you do with the reply |
|------|------------|----------------------|-----------------------------|
| Populate stubs | `npm run tag-stubs-and-unverified` then `npm run output-stubs-for-llm` | `.stubs-for-llm.txt` | Save reply as `.stub-llm-responses.txt`, run `npm run apply-stub-responses -- .stub-llm-responses.txt` |
| Fact-check | `npm run tag-stubs-and-unverified` then `npm run output-fact-check-for-llm` | `.fact-check-for-llm.txt` | Get verdicts; for each file run `npm run apply-fact-check -- <path>`, paste prompt + verdicts into LLM, save revised markdown to the file |

All paths are under `content/` (e.g. `content/philosophy/concepts/ethics.md`).
