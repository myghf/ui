# AGENTS.md

Guidance for AI agents (and humans) working in the `@myghf/ui` repository.

## Project at a glance

- **What it is:** the MYGHF shared Vue 3 design system — Tailwind-based, app-agnostic components.
- **Package:** `@myghf/ui` (scoped, public on npm), currently versioned by Changesets. This is a
  **single package**, not a monorepo.
- **Stack:** Vue 3, Vite (library build), TypeScript, Tailwind CSS, Vitest.
- **Package manager:** npm. `package-lock.json` is committed — use `npm`, never switch to
  yarn/pnpm, and never hand-edit the lockfile (regenerate with `npm install`).

## Layout

```
src/
  index.ts              public entry — re-export everything consumers import
  tokens.css            design tokens (--ahc-*), exported as @myghf/ui/tokens.css
  tailwindPreset.js     Tailwind preset, exported as @myghf/ui/tailwind-preset
  components/<name>/     one folder per component (+ <name>.spec.ts colocated)
  lib/                  shared utilities and their tests
dist/                   build output (gitignored, generated — never edit or commit)
.changeset/             Changesets config and pending changeset files
.github/workflows/      CI (publish.yml)
```

## Common commands

```bash
npm ci                 # clean install from the lockfile (use this in CI)
npm run typecheck      # vue-tsc --noEmit
npm test               # vitest run
npm run build          # vite build + copy tokens.css and tailwindPreset.js into dist/
npm run changeset      # add a changeset (alias of `npx changeset`)
```

Before committing any code change, run at minimum:

```bash
npm run typecheck && npm test
```

## Ground rules

1. **`dist/` is generated.** Never edit it or commit it (it is gitignored).
2. **Do not hand-edit `version` in `package.json` or `CHANGELOG.md`.** Changesets owns both.
3. **Every user-visible change needs a changeset** (see below). Infra/docs-only changes that need
   no release can use an empty changeset: `npx changeset add --empty`.
4. **Never run `npm publish`, `npm version`, or create/push `v*` git tags** as part of normal work.
   Publishing happens only through the release workflow. The sole exception is the emergency
   procedure at the bottom of this file.
5. Keep new components consistent with the existing `src/components/<name>/` pattern and re-export
   them from `src/index.ts`.

## Deployment / release flow

Releases are **merge-driven** and run entirely in GitHub Actions. The workflow is
`.github/workflows/publish.yml`, triggered on every push to `main`.

```
push to main
 ├─ select-mode   contents: read                     → decides version | publish | none
 ├─ version       contents: write, pull-requests: write → bump + CHANGELOG, open/update Version Packages PR
 ├─ pack          contents: read                     → typecheck, test, build, pack tarballs
 └─ publish       contents: write, id-token: write   → npm publish (OIDC) + git tag + GitHub Release
```

Key properties:

- Publishing uses **npm Trusted Publishing (OIDC)** — there is no `NPM_TOKEN` secret.
- `id-token: write` is granted **only** to the `publish` job, and that job consumes tarballs
  packed in the unprivileged `pack` job (so the OIDC-bearing job runs no build scripts).
- Provenance is generated automatically (public repo + public package).
- The workflow only publishes when the package's current version is not yet on npm.

### Adding a change (the normal path)

```bash
npx changeset                                  # interactive: choose package, bump, summary
# or non-interactive:
npx changeset --patch @myghf/ui -m "fix: correct Button focus ring"
npx changeset --minor @myghf/ui -m "feat: add Combobox component"
```

Commit the generated `.changeset/*.md` file with your code and open a PR into `main`.
When the PR merges:

1. `select-mode` sees a changeset → mode `version`.
2. The `version` job runs `changeset version`, bumps `package.json`, updates `CHANGELOG.md`, and
   opens (or updates) a **`Version Packages`** PR.
3. You review and **merge that PR**.
4. `select-mode` now sees no changesets and an unpublished version → mode `publish`; `pack`
   builds and tests; `publish` publishes to npm and creates the `vX.Y.Z` tag + GitHub Release.

## How to bump versions

**Do not edit the version yourself.** You declare the *intent* with a changeset, and Changesets
computes and applies the bump in CI:

| Changeset bump | When to use |
| -------------- | ----------- |
| `patch` | Bug fixes, internal changes, no public API change |
| `minor` | New components, new props/exports, backward-compatible behavior |
| `major` | Breaking changes to exports, props, or tokens |

Multiple pending changesets are collapsed into a single bump when the `version` job runs. If two
changes need different bumps, add two changesets; the largest bump wins.

Notes:

- You do **not** run `changeset version` in a normal PR — CI does it. Running it locally is only
  part of the emergency procedure.
- Pre-1.0 (`0.x`), Changesets applies `major`/`minor`/`patch` literally; choose deliberately
  because a `major` bump moves `0.1.0 → 1.0.0`.
- `npx changeset status` exits 1 when packages changed but no changeset exists — that is expected
  feedback, not a broken tool.

## One-time setup (external, not in this repo)

If a release run fails, check these before changing code:

1. **npm Trusted Publisher** is configured on `npmjs.com/package/@myghf/ui` under
   Settings → Trusted publishing → GitHub Actions with user `myghf`, repo `ui`, workflow
   `publish.yml`, and **`npm publish` allowed**. Configs created after 2026-09-03 default to
   stage-only publishing and must explicitly permit `npm publish`.
2. **Actions may create pull requests.** If Organization Settings → Actions → General → Workflow
   permissions has this disabled, the repo toggle is greyed out and the `version` job cannot open
   the Version Packages PR. Either have an org owner enable it, or add a `RELEASE_TOKEN` repo
   secret (fine-grained token with `contents: write` + `pull-requests: write`); the workflow
   already prefers `RELEASE_TOKEN` over `GITHUB_TOKEN`.
3. Publishing requires **Node ≥ 22.14.0** and **npm ≥ 11.5.1** (CI uses Node 24 with npm bundled).

## Troubleshooting

| Symptom | Cause / fix |
| ------- | ----------- |
| `ENEEDAUTH` / "Unable to authenticate" in `publish` | Trusted Publisher fields don't match. They are case-sensitive: `myghf` / `ui` / `publish.yml`. Ensure `id-token: write` is present. |
| "GitHub Actions is not permitted to create or approve pull requests" | See setup item 2 above. |
| `select-mode` = `none` on a push that should release | No changesets were found, or the version is already on npm. Add a changeset. |
| `changeset status` exits 1 | Expected when files changed without a changeset; add one (or `--empty`). |
| Published to npm but no release run happened | Changesets publishes directly; there is no tag-triggered workflow. Check the `publish` job run for this push to `main`. |
| Version Packages PR has no CI checks | PRs opened with `GITHUB_TOKEN` don't trigger workflows. This is expected; the PR only changes version/CHANGELOG. |

## Emergency manual release (last resort)

Only when CI is broken **and** a human explicitly asks you to publish by hand. Prefer fixing CI.

Because the tag-triggered workflow was removed, pushing a tag will **not** double-publish. Replicate
what CI does locally so the CHANGELOG and version history stay consistent:

```bash
git checkout main && git pull
npx changeset version                 # bump package.json + write CHANGELOG
git add -A && git commit -m "Version packages"
npm run typecheck && npm test         # don't skip the gates CI would have run
npm run build
npx changeset publish --otp <2FA_CODE> # publishes to npm and creates the vX.Y.Z tag
git push --follow-tags
```

Warnings:

- This needs interactive npm auth + a 2FA one-time code; it bypasses the trusted-publishing path.
- Do **not** use raw `npm version && npm publish` — it skips `CHANGELOG.md` generation and leaves
  Changesets' state out of sync. Always go through `changeset version` / `changeset publish`.
- Record what you did in the PR/issue so the bypass is visible to maintainers.
