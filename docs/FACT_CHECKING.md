# Fact-checking workflow

Use this to keep wiki content verifiable and to catch unsupported claims before they’re treated as fact.

## 1. Extract claims from an entry

From the project root:

```bash
npm run extract-claims -- content/people/figures/plato.md
```

Output is JSON to stdout:

- **file** – path to the file
- **hasSourcesSection** – whether it has a `## Sources` (or `### Sources`) section
- **claims** – list of short, factual-looking sentences (heuristic: verbs like “was”, “believed”, “developed”, or years, etc.)

Redirect to a file to review or feed into a later step:

```bash
npm run extract-claims -- content/philosophy/concepts/renaissance.md > claims-renaissance.json
```

Multiple files:

```bash
npm run extract-claims -- content/people/figures/plato.md content/philosophy/concepts/beauty.md
```

If a file has no `## Sources` section, the script prints a note to stderr. Add a Sources section and links or citations so claims can be checked.

## 2. Verify claims

- Open the JSON and go through each item in **claims**.
- For each claim, check against the **Sources** (or other trusted references).
- Fix or remove claims that aren’t supported; add or correct sources as needed.

## 3. Convention for entries

- Every factual entry should end with a **Sources** section (URLs or citations) that you have verified yourself.
- When generating or editing content, list only sources you have actually checked—do not invent or guess URLs or citations. Add sources after you confirm they exist and match the entry.

## Optional: run on all content

To get claims for every markdown file under `content/`:

**PowerShell:**

```powershell
Get-ChildItem -Path content -Recurse -Filter "*.md" | ForEach-Object { $_.FullName } | Join-String -Separator " "
```

Then pass that list to the script, or use a small loop that calls `extract-claims` per file and appends to a report.

## 4. Verify claims in Cursor (no API key)

Use Cursor’s built-in LLM so you don’t need an external API or key:

1. Run extract-claims with **`--cursor`** to get a single block you can paste into Cursor chat:

```bash
npm run extract-claims -- --cursor content/people/figures/friedrich-nietzsche.md
```

2. Copy the full output (the short prompt + numbered claims and/or quotes).
3. Paste it into a **new Cursor chat**. The model will verify each item and reply using the **reply format** at the end of the block: for each item, one line like `N. VERDICT - reason`; if INACCURATE, add `Correct: ...`. End with `## New facts to check` and any new items. That structured reply is used in the next step.

No extra setup or API key; verification uses the same LLM connection Cursor already uses.

## 5. Receive fact checks: apply updates and get new facts to check

After you have the fact-check reply from Cursor:

1. Run the apply prompt for the **same entry**:

```bash
npm run apply-fact-check -- content/people/figures/friedrich-nietzsche.md
```

2. Copy the printed prompt (it includes the file path and entry title).
3. Paste it into a **new Cursor chat** (or the same chat, after the fact-check reply).
4. **Below the line that says "Fact-check results (paste below this line):"**, paste the full fact-check reply (the model’s verdicts and any "Correct: ..." or "## New facts to check").
5. Send. The model will:
   - **Make these updates** – Apply the suggested corrections (fix or remove INACCURATE items; use "Correct: ..." text where given).
   - **Make any further additions** – Add or expand content if it deems it necessary (e.g. caveats, context). It must **not** invent or fabricate sources: no made-up URLs, citations, or reference lists. Add a Sources section only if you supply real, verified links yourself afterward.
   - **Provide new facts for checking** – Output revised markdown for the page, then a "## New facts to check" section with any new claims or quotes to verify.

6. Copy the revised markdown into the wiki file. If the model suggested that a Sources section is needed, add one yourself with links you have verified (e.g. open SEP or Britannica and paste the actual URL). Use the "## New facts to check" list as the next set of items to verify (e.g. paste into a follow-up fact-check chat, or run `extract-claims --cursor` again after saving if you prefer to re-extract from the updated file).

Summary: **extract → fact-check in Cursor → apply-fact-check prompt + paste reply → get updated page + new facts → (optional) verify new facts and repeat.**

## Later: automation

For the full automation (unfilled tags → populate stubs → fact-check unverified), see [AUTOMATION.md](AUTOMATION.md). Use `npm run automation-full-pipeline` for populate + fact-check queues, and `npm run automation-fact-check` to build a combined fact-check prompt for multiple files.

You can extend this (e.g. run extract-claims in CI, or add a step that fails if too many claims are marked INACCURATE after Cursor verification). The scripts only report; they do not modify the wiki.
