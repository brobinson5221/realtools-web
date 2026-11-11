# Python project template

Start a Python 3.15 project with uv dependency management, Ruff linting and
formatting, and Conventional Commits enforced through pre-commit and Commitizen.
GitHub Actions checks linting and formatting on every push and pull request.

This is a bare starting point: add your own source files and tests when you need
them. There is no application entry point or package build configuration.

## Create your project

1. Select **Use this template → Create a new repository** on GitHub.
2. Give your new repository a name, then clone it:

   ```sh
   git clone https://github.com/YOUR-USERNAME/YOUR-PROJECT.git
   cd YOUR-PROJECT
   ```

3. In [pyproject.toml](pyproject.toml), change `project.name` from `py-template`
   to your project name. Replace this README with your project's documentation
   after setup.

> [!NOTE]
> If you are maintaining the original template, enable **Settings → General →
> Template repository** on GitHub to make **Use this template** available.

## Set up locally

Install Git and [uv](https://docs.astral.sh/uv/getting-started/installation/), and
keep both available on your PATH. From your new project's directory, run:

```sh
uv lock
uv sync --locked
uv run pre-commit install
```

`uv lock` updates the lockfile after renaming the project. uv uses the Python
3.15 pin in [.python-version](.python-version), downloads Python if needed, and
installs the development tools into `.venv`.

The hook installation enables both `pre-commit` and `commit-msg` checks. Every
developer must install hooks in their own clone; Git does not copy installed hooks.
For later clones of your renamed project, start with `uv sync --locked`.

## Develop

Add dependencies with uv:

```sh
uv add requests
uv add --dev pytest
```

These are examples; neither dependency is included in the template. Commit
`pyproject.toml` and `uv.lock` whenever dependencies change. Keep `.venv` out of Git.

Check and format your code:

```sh
uv run ruff check --fix .
uv run ruff format .
uv run pre-commit run --all-files
```

Ruff uses a 100-character line length and the lint rules configured in
[pyproject.toml](pyproject.toml). Adjust those rules to suit your project.

## Commit changes

Stage your changes, then use Commitizen's prompts:

```sh
git add .
uv run cz commit
```

Ordinary commits work too, using a Conventional Commit message:

```sh
git commit -m "feat: add CSV import"
```

Ruff checks staged Python files before committing; Commitizen validates the commit
message. If Ruff edits files, review and stage the changes, then retry the commit.

## GitHub checks

The [Checks workflow](.github/workflows/checks.yml) installs locked dependencies
with Python 3.15 and runs:

```sh
uv run --locked ruff check .
uv run --locked ruff format --check .
```

Check results in your repository's **Actions** tab. CI reports lint and formatting
errors without editing files. The template does not yet include automated tests
or individual commit-message validation in CI.

The [PR title workflow](.github/workflows/pr-title.yml) checks pull request titles
against Conventional Commits, for example `docs: clarify template setup`. It runs
when a PR is opened, updated, reopened, or its title is edited. Direct pushes do
not trigger this workflow. Use squash merging with the PR title as the commit
message to carry the validated title into your project's history.
