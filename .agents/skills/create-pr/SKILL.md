---
name: create-pr
description: Commit scoped repository changes, push a feature branch, open or update a GitHub pull request, and check CI when the user asks to make or submit a PR. Leaves merging to the user.
---

# Create a pull request

Deliver a reviewable GitHub PR for the user's requested changes. An explicit
request to create a PR authorizes the necessary scoped commit, branch push, and
PR creation; normal tool permissions still apply. Merely drafting a PR description
does not authorize those actions.

## Establish scope

Read applicable AGENTS.md files, repository contribution instructions, and PR
templates. Inspect status, staged and unstaged diffs, relevant untracked files,
the current branch, recent commits, remotes, and the intended base branch.
Use the repository's default branch unless the user specifies another base.

Preserve unrelated edits and staged changes. Include only the requested work.
If the scope or target repository cannot be established, ask a focused question
before committing or pushing. If there are no changes or unmerged commits, report
that rather than manufacturing a change to open a PR.

## Prepare and commit

Use a dedicated feature branch. Fetch the base when needed to assess the PR diff;
inspect existing ahead commits before including them. Never push directly to the
base branch, rewrite existing history, or force-push without explicit authorization.
Reuse an existing task branch and PR where appropriate.

Run the repository's relevant checks. Fix failures caused by this task within
scope; report unrelated failures and unavailable checks. Keep incomplete work in
a draft PR, explaining the concrete blockers.

For code or executable configuration changes, use the local
[ponytail-review skill](../ponytail-review/SKILL.md) on the scoped PR diff and
connected code. Scale the review to the change; documentation-only changes need
link and command accuracy checks. Resolve concrete blockers within task scope
and carry unresolved findings into the PR description. This is a self-review,
not an independent approval or permission to merge.

Use the local [commit-message-storyteller skill](../commit-message-storyteller/SKILL.md)
for every commit message. If it is not
available, disclose the missing skill and draft a Conventional Commit from the
actual diff, explaining purpose and behavior without invented evidence.
Stage the scoped files or hunks and inspect the final staged diff immediately
before committing. Preserve commit hooks; review and restage any hook edits.

## Push and open

Push the task branch with upstream tracking. Prefer connected GitHub tools when
available; use the authenticated GitHub CLI as a fallback. Check for an existing
PR from this branch before creating another. Resolve the actual remote repository
and branch names rather than using hardcoded account names or paths.

Use a Conventional Commit PR title that describes the entire change, including
any existing commits in scope. Use the local [PR-writing skill](../pr/SKILL.md)
to draft the body, giving the repository's own PR template precedence. Include
only observed validation results and material limitations; keep detail
proportional to the change.
For CLI multiline bodies, write a temporary file and use `--body-file`.

## Verify and deliver

Confirm the PR URL, head and base branches, and changed files. Inspect the PR's
actual check runs; do not treat branch pushes or required-check settings as proof
that CI ran. Read `.github/workflows/` and the applicable branch rules to identify
the expected Actions jobs and required checks. Follow their actual commands and
triggers; do not substitute local checks for GitHub results.

Verify checks belong to the latest PR revision. After each push or title change,
wait for the affected workflows again with periodic progress updates. Treat
missing expected runs, pending checks, and failures as unresolved. Accept skipped
or neutral results only when the workflow conditions and branch rules permit
them; explain any expected job that did not run. If a check
fails, read its logs and fix the cause within scope; avoid rerunning unchanged
failures. If checks are blocked on permissions, external service quota, or approval,
report the blocker rather than weakening repository protections.

Never disable or bypass Actions, remove required checks, add skip-CI markers, or
weaken validation merely to get a green PR. Changes to workflow behavior must be
part of the user's requested scope. Leave the PR open and report any blocking
checks so the user can decide when to merge.

Finish with the PR link, commit summary, CI result, and any remaining blocker.
This skill ends with the PR open for the user to review and merge. Never merge,
enable auto-merge, add it to a merge queue, or approve it on the user's behalf.
Passing checks means ready for the user's review, not permission to merge.
