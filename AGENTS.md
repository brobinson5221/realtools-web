# Agent instructions

## Project context

Read `README.md`, `pyproject.toml`, and `.github/workflows/` before making changes.
Discover source layout, run commands, and test commands from the current project.
Keep this guidance updated as the project grows.

Real App Tools uses a FastAPI backend and a React frontend built with Vite. The
card upgrade calculator is the first tool.

- `realapp_tools/main.py` registers API routers under `/api/v1`.
- `realapp_tools/tools/card_upgrade/` holds calculator logic and input validation
  in `calculator.py` and HTTP registration in `routes.py`.
- `frontend/src/main.jsx` mounts the React app. `frontend/src/tools/card-upgrade/`
  holds the calculator UI and styles. It calls `/api/v1/card-upgrade/compare`.
- `tests/` contains Python `unittest` tests.

## Setup and dependencies

Run commands from the repository root. Use uv and follow the Python version in
`.python-version` and `project.requires-python`.

```sh
uv sync --locked
uv run pre-commit install
```

Use `uv run --locked` for Python commands. Use `uv add PACKAGE` for runtime
dependencies and `uv add --dev PACKAGE` for development tools. Update
`pyproject.toml` and `uv.lock` together when Python dependencies change.

Use `npm --prefix frontend ci` to install frontend dependencies. Update
`frontend/package.json` and `frontend/package-lock.json` together when frontend
dependencies change. On Windows PowerShell, use `npm.cmd` if script execution
policy blocks `npm`.

Follow the README to start the API and Vite in separate terminals. The Vite proxy
routes `/api` to the Python server on port 8000. Stop task-started dev servers and
remove temporary folders created for the task when they are no longer needed.

## Validation

Follow the Python, Ruff lint, and Ruff formatting settings in `pyproject.toml`.
For Markdown edits, read the repository's `.markdownlint.json` and apply its rules.
The VS Code markdownlint extension uses this file.

Before submitting Python changes:

```sh
uv run --locked ruff check .
uv run --locked ruff format --check .
uv run --locked pre-commit run --all-files
uv run --locked python -m unittest discover -s tests
```

Apply formatting with `uv run --locked ruff format .`. Review any hook edits
before staging them and retrying a commit. For frontend changes, run
`npm --prefix frontend run build`. For changes to the calculator flow, verify
that editing inputs in the browser updates the result through the Python API.
Report which checks ran and any that could not run.

## Commits and pull requests

For coding tasks, work in a dedicated Git worktree and feature branch. Follow
this repository's `.agents/skills/create-pr/SKILL.md` to finish each task with a
scoped commit, branch push, and pull request, unless the user requests a different
deliverable. This workflow authorizes those actions for the requested task.
Use the repository's review, commit-message, and PR-writing skills as directed
by `create-pr`. Verify GitHub checks on the latest PR head and leave the PR open
for the user to review and merge.

Work on a feature branch, preserve unrelated user edits, and submit changes through
pull requests. Push, create PRs, and merge only within the user's authorization.

Use Conventional Commits for commit subjects and PR titles, such as
`feat: add CSV import` or `docs: explain setup`. Always use the
`commit-message-storyteller` skill when available and base messages on the staged
diff.

The included workflows check Ruff and PR titles. Verify the repository rulesets
to determine which checks are required. Use squash merging with the PR title as
the commit message.

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
