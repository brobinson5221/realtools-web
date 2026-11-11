---
name: commit-message-storyteller
description: Draft Conventional Commits messages from staged changes, supplied diffs, or change descriptions, explaining the reason and impact. Use when asked to write a commit message or help commit changes; not for general code review.
---

# Commit Message Storyteller

Turn changes into concise commit messages that explain the problem, intent, and resulting behavior.

## Establish the evidence

Use the user's supplied diff, selected paths, commit range, or description as the requested scope. If working in a repository, read applicable AGENTS.md instructions and commit conventions. Recent commit subjects can help identify established types and scopes, but do not override explicit instructions.

For an unspecified request about the current changes, inspect:

```sh
git status --short
git diff --staged --stat
git diff --staged
```

Base the message on staged content when it exists. A file can contain both staged and unstaged edits; only its staged hunks belong to that message. If nothing is staged, inspect `git diff --stat` and `git diff`, and label the result as a proposal for unstaged changes. Untracked files do not appear in either diff; inspect relevant files only when they belong to the requested scope. If the scope is empty, say so rather than fabricate a commit.

Read enough relevant code to understand changed behavior when the diff alone is ambiguous. Do not claim to have inspected a full diff when output is truncated. When repository tools are unavailable, work from supplied evidence and disclose material limits; a file list alone rarely establishes the motivation.

Infer intent only when supported by the change or the user's context. Do not invent issue numbers, outages, benchmarks, user reports, alternatives considered, or test results to make a better story. Ask a focused question if missing intent materially changes the message; otherwise write a restrained, factual explanation.

## Choose the message

Follow explicit user and repository conventions. Otherwise use:

```text
<type>(<optional scope>)[!]: <imperative summary>

<problem or motivation, then resulting behavior>

<optional footers>
```

The brackets above mark optional syntax; do not emit them literally.

- Pick the type by purpose: `feat`, `fix`, `refactor`, `perf`, `docs`, `style`, `test`, `build`, `ci`, `chore`, or `revert`. Scope names should match project vocabulary; omit scope when it adds no useful precision.
- Keep the whole subject within 72 characters by default. Start the description with a lowercase imperative verb and omit a final period; preserve proper names and identifiers.
- Explain why the change matters, with enough concrete behavior to make the reason understandable. Avoid repeating the diff line by line. Include tradeoffs only when supported.
- Separate subject, body, and footers with blank lines. Wrap body prose below 100 characters when practical; preserve identifiers and URLs.
- Add issue references only when supplied or verified. Use a closing keyword only when the change resolves the issue; otherwise use `Refs`.
- For an established incompatible public contract change, use `!` and a `BREAKING CHANGE:` footer explaining the impact and migration. Do not treat every internal signature change as breaking. Preserve this footer even when there is no issue reference.
- For a short-message request, omit optional body and commentary. Retain the breaking marker and any required migration/footer information, or flag why a subject alone is insufficient.

Read [references/conventional-commits-guide.md](references/conventional-commits-guide.md) when type selection, scope, breaking changes, or narrative examples need clarification.

## Deliver and respect the requested action

Return the message in a copyable `text` code block, followed by one brief explanation of its reasoning unless the user requests message-only output.

For independent changes, suggest separate messages and identify the paths or concerns each covers. Keep tightly coupled implementation and tests together. Do not split merely because many files changed, and do not change the index just to demonstrate a suggested split.

A request to draft a message authorizes drafting. Stage or create commits only when the user's request authorizes those actions; preserve any authorization already given. When creating an authorized commit, verify its selected content immediately beforehand. Do not infer permission to amend history or push from a request to commit. Report whether you drafted a message or actually created a commit.
