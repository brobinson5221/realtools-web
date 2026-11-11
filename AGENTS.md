# Agent instructions

## Project context

Read `README.md`, `pyproject.toml`, and `.github/workflows/` before making changes.
Discover source layout, run commands, and test commands from the current project.
Keep this guidance updated as the project grows.

This template starts without application code, a test runner, or build and
deployment workflows. Introduce those only when the project needs them.

## Setup and dependencies

Run commands from the repository root. Use uv and follow the Python version in
`.python-version` and `project.requires-python`.

```sh
uv sync --locked
uv run pre-commit install
```

Use `uv run` for project commands, `uv add PACKAGE` for runtime dependencies, and
`uv add --dev PACKAGE` for development tools. Commit `pyproject.toml` and `uv.lock`
together when dependencies change. After renaming a new template copy, run
`uv lock` before syncing.

## Validation

Follow the Ruff configuration in `pyproject.toml`. Before submitting changes:

```sh
uv run --locked ruff check .
uv run --locked ruff format --check .
uv run --locked pre-commit run --all-files
```

Apply formatting with `uv run ruff format .`. Review hook changes and stage them
before retrying a commit. Run relevant tests when the project has them; report
what ran and what could not be checked. Lint success is not a passing test suite.

## Commits and pull requests

Work on a feature branch, preserve unrelated user edits, and submit changes through
pull requests. Push, create PRs, and merge only within the user's authorization.

Use Conventional Commits for commit subjects and PR titles, such as
`feat: add CSV import` or `docs: explain setup`. Always use the
`commit-message-storyteller` skill when available and base messages on the staged
diff.

The included workflows check Ruff and PR titles. Use squash merging with the PR
title as the commit message. Each repository created from the template needs its
own rulesets and merge settings; verify those settings before assuming checks
are required.

## Current documentation

Use Context7 MCP for library, framework, SDK, API, CLI, and cloud-service
documentation, including setup, syntax, configuration, and library-specific bugs.
Prefer Context7 over web search even for familiar APIs.

1. Call `resolve-library-id` first unless an exact `/org/project` ID is supplied.
2. Select the most relevant reputable match, using a version-specific ID when
   appropriate. Refine mismatched searches.
3. Call `query-docs` with that ID and a focused query per concept.
4. Base the implementation or answer on the fetched documentation.

General programming concepts, business-logic debugging, and refactoring or review
without library-specific questions do not need Context7. If it is unavailable,
use official documentation and disclose the fallback.
