# Conventional Commits and narrative guidance

Adapted from the Awesome Copilot reference guide. See ../SOURCE.md for provenance.
Specification: <https://www.conventionalcommits.org/en/v1.0.0/>

## Types and scopes

| Type | Purpose |
| --- | --- |
| `feat` | Add a capability |
| `fix` | Correct faulty behavior |
| `refactor` | Restructure without changing behavior |
| `perf` | Improve performance; quantify only with evidence |
| `docs` | Change documentation only |
| `style` | Change formatting without changing logic |
| `test` | Add or update tests |
| `build` | Change build tooling or dependencies, when the project uses this type |
| `ci` | Change CI workflows |
| `chore` | Other maintenance under project conventions |
| `revert` | Undo a prior change; cite a verified commit when available |

Conventional Commits specifies `feat`, `fix`, and breaking-change notation;
the other types are common conventions. Subject length, imperative mood, and
wrapping are style defaults, not requirements of the specification.

Use a short component noun such as `auth`, `api`, or `payments` for scope.
Reuse established vocabulary rather than alternating `user` and `users`.
Omit scope for global changes or when no component name helps the reader.

## Explain a supported reason

Examples below are fictional. Their facts and issue references must not be
copied into a real message without evidence.

```text
fix(api): preserve the final record on each results page

The pagination boundary excludes the last record in each page. Include
the boundary record so clients can traverse results without missing entries.
```

```text
refactor(validation): share email validation across entry points

Registration and profile updates duplicate the same validation rules.
Use one validator so future rule changes apply consistently to both paths.
```

```text
perf(dashboard): load charts when their panels open

The dashboard eagerly imports charts that remain hidden on initial load.
Defer those imports until their panels open to reduce initial loading work.
```

Avoid unsupported claims about speedups or conversion rates. Describe the
mechanism when there are no measurements. Distinguish an expected benefit
from a verified outcome.

## Footers and breaking changes

Use `Refs #123` for related work and `Closes #123` only for a resolved issue.
Do not invent an issue reference. No issue number does not mean no footers:
breaking changes and project-required trailers are independent of issues.

```text
feat(api)!: remove the version-one search endpoint

Consolidate search on the version-two response contract.

BREAKING CHANGE: /api/v1/search is removed. Clients must use /api/v2/search
and read results from the items field.
```

The specification permits either `!` or a breaking-change footer; this skill
defaults to both to make the incompatibility and migration clear. Preserve
project rules when they specify another valid convention.

## Review the story

Check that the message answers the supported parts of: what was missing or
wrong, why this approach was chosen, and what changes for users or maintainers.
Omit unknown motivations rather than filling gaps with plausible history.

Replace vague subjects such as `updates` or `misc changes` with a concrete
action. Suggest separate messages for unrelated changes. Respect an explicit
request for a WIP checkpoint; this skill does not authorize stashing work or
restructuring commits.
