# Cursor Automation: Full pipeline (populate + fact-check)

**Paste this into your Cursor Automation instructions at [cursor.com/automations](https://cursor.com/automations).** Use the best LLM model available. No API key required.

---

## Goal

Run the full pipeline until there are **no stubs** and **no unverified pages**. Every content file ends with `stub: false` and `verified: true` in its frontmatter.

## Setup

1. Clone the repository (or use the linked repo).
2. Run `npm install`.
3. Run the pipeline once to generate queues and instructions:
   ```bash
   AUTOMATION_LIMIT=3 npm run automation-full-pipeline
   ```
   (Use a higher number if you want more new drafts from unfilled tags; use `AUTOMATION_LIMIT=0` on later runs to skip creating new drafts.)

This creates:
- **`.automation-populate-queue.txt`** – one content path per line (all files with `stub: true`).
- **`.automation-fact-check-queue.txt`** – one content path per line (all files with `verified: false`).
- **`.automation-populate-instructions.md`** – detailed populate/fact-check steps.
- **`.automation-fact-check-prompt.txt`** – combined fact-check prompt (from unverified files that have claims).

## Step 1: Populate every file in the populate queue

For **each** path listed in `.automation-populate-queue.txt`:

1. Read the file. It is a stub with YAML frontmatter and sections: ## Overview, ## Key Ideas, ## Connections, ## Sources. Placeholder text like "Add a brief overview..." or "Referenced by: [[...]]" is present.
2. Using your **best available model**, expand it into a complete wiki entry:
   - Keep the exact YAML frontmatter; update only **`excerpt`** to one concise sentence summarizing the topic.
   - Keep the section headers. Replace every placeholder with 2–5 substantive sentences. Neutral, factual tone. Use **`[[wiki-link]]`** for related concepts, people, movements (e.g. `[[Plato]]`, `[[existentialism]]`).
   - In ## Sources write: "Add verified sources (SEP, Britannica, or academic citations) after fact-checking." Do not invent URLs or citations.
3. **Set `stub: false`** in the frontmatter.
4. Write the complete markdown back to the same file.

Process every path in the file. When done, no file in the populate queue should still be a stub.

## Step 2: Fact-check every file in the fact-check queue

1. **Build the fact-check prompt** from all paths in `.automation-fact-check-queue.txt`:
   - On Unix: `npm run automation-fact-check -- $(cat .automation-fact-check-queue.txt | tr '\n' ' ') > .automation-fact-check-prompt.txt`
   - On Windows PowerShell: read the queue file, then run `npm run automation-fact-check -- <path1> <path2> ...` with those paths and redirect output to `.automation-fact-check-prompt.txt`.
2. **Get verdicts**: Use the contents of `.automation-fact-check-prompt.txt` in this chat (or a follow-up step). For each claim, reply with ACCURATE, INACCURATE, or UNCERTAIN and a short reason. In your reply, prefix each entry's verdicts with a line: `## <file path>` (e.g. `## content/philosophy/concepts/ethics.md`). End each entry with "## New facts to check" or "None."
3. **Apply to each file**: For each path in the fact-check queue, run `npm run apply-fact-check -- <path>`. Paste that output into the chat, paste your fact-check reply below the "Fact-check results (paste below this line):" line, and produce the revised markdown. **Set `verified: true`** in the frontmatter. Write the revised content back to the file.

## Step 3: Re-run pipeline and repeat

1. Run again (no new drafts):
   ```bash
   AUTOMATION_LIMIT=0 npm run automation-full-pipeline
   ```
2. Check the stats: if **Populate queue** and **Fact-check queue** still have paths, repeat Step 1 and Step 2 for the new queue contents.
3. When both queues are empty (0 paths), the pipeline is complete.

## Step 4: Commit and push

Commit all changed and new content files and push to the remote repository.

---

## Summary

| Step | Action |
|------|--------|
| Setup | `npm install`; `AUTOMATION_LIMIT=3 npm run automation-full-pipeline` |
| 1. Populate | For each path in `.automation-populate-queue.txt`, expand stub → full entry, set `stub: false`, write back |
| 2. Fact-check | Build prompt from fact-check queue, get verdicts, apply per file, set `verified: true`, write back |
| 3. Repeat | `AUTOMATION_LIMIT=0 npm run automation-full-pipeline` until both queues empty |
| 4. Commit | Commit and push |
