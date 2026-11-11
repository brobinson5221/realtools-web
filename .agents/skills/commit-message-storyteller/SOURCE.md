# Source and adaptation

Original: [Commit Message Storyteller — Awesome Copilot](https://awesome-copilot.github.com/skill/commit-message-storyteller/)

Repository: <https://github.com/github/awesome-copilot/tree/main/skills/commit-message-storyteller>

Reviewed on 2026-10-19. Latest commit affecting the source skill at review:
`252f342650f04b6c79b67c447edecc7a5965b8f7`.

Reviewed both original files:

- `SKILL.md`
- `references/conventional-commits-guide.md`

The source has one supporting reference and no executable scripts or image assets.
The repository uses the MIT license, included in LICENSE.txt.

This Codex adaptation preserves intent-focused Conventional Commits, the main
type taxonomy, optional scopes, short-message handling, related-change grouping,
and the copyable-message output with a brief explanation.

Changes for Codex:

- Replace Copilot paste instructions with repository inspection through available
  Codex tools, while retaining supplied-diff and description-only use.
- Narrow discovery to commit-message work rather than general diff review.
- Distinguish staged, unstaged, and untracked content, including partial staging.
- Ground motivation, issue references, metrics, and validation claims in evidence.
- Honor repository conventions and distinguish style defaults from specification rules.
- Preserve breaking-change footers without issue numbers and explain migrations.
- Suggest logical splits without changing the index, stashing, or rewriting history.
- Separate message drafting from authorized staging, committing, and pushing.
- Add optional Codex UI metadata and a separate installation guide.

The reference examples were rewritten to avoid unsupported quantitative claims;
they are explicitly fictional. No Copilot tooling, MCP service, or additional
skill is required. This is an independent skill, not an extension of or replacement
for acquire-codebase-knowledge.
