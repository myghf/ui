# Development

How to work on `@myghf/ui` locally: install, run the checks, build the package, and preview the
documentation site.

## Requirements

| Tool | Version | Notes |
| --- | --- | --- |
| Node.js | `>= 22.14` | CI builds and publishes with Node 24 |
| npm | `>= 11.5.1` | Bundled with Node 24 |

This repository commits `package-lock.json` and uses **npm**. Do not switch package managers, and
never hand-edit the lockfile — regenerate it with `npm install`.

## Install

```bash
npm ci
```

`npm ci` installs exactly the locked dependency tree, which is what CI uses.

## Commands

```bash
npm ci                 # clean install from the lockfile
npm run typecheck      # vue-tsc --noEmit
npm test               # vitest run (single, non-watch run)
npm run build          # vite build + copy tokens.css and tailwindPreset.js into dist/
npm run docs:dev       # VitePress dev server for docs/
npm run docs:build     # production build of the docs site
npm run docs:preview   # serve the built docs site locally
npm run changeset      # add a changeset (alias of `npx changeset`)
```

## Before you commit

Run the same gates CI runs:

```bash
npm run typecheck && npm test
```

For any documentation change, also build the site — VitePress fails the build on dead links and on
missing `<<<` snippet targets:

```bash
npm run docs:build
```

## Repository layout

```
src/
  index.ts              public entry — re-export everything consumers import
  tokens.css            design tokens (--myghf-*), exported as @myghf/ui/tokens.css
  tailwindPreset.js     Tailwind preset, exported as @myghf/ui/tailwind-preset
  components/<name>/    one folder per component (+ <name>.spec.ts colocated)
  lib/                  shared utilities and their tests
docs/                   VitePress documentation site
.changeset/             Changesets config and pending changeset files
dist/                   build output (gitignored, generated — never edit or commit)
```

## Contributing

- **Tokens first.** Use `--myghf-*` variables or the preset's Tailwind classes. Never hard-code a
  hex value; add a token only when no existing token fits.
- **Component pattern.** Add a new component under `src/components/<name>/` with a colocated
  `<name>.spec.ts`, then re-export it from `src/index.ts`.
- **Bilingual / RTL.** Prefer logical utilities (`ps-*`, `pe-*`, `ms-*`, `me-*`, `start-*`,
  `end-*`, `text-start`, `text-end`) over physical ones and use the `rtl:` variant for directional
  icons. Set `font-ar` on Arabic content.
- **Accessibility.** Interactive elements must be keyboard reachable, expose accessible names, and
  verify contrast against the palette before shipping.
- **`dist/` is generated.** Never edit it or commit it.
- **Versioning is owned by Changesets.** Do not hand-edit `version` in `package.json` or
  `CHANGELOG.md`.
- **Every user-visible change needs a changeset.** Commit the generated `.changeset/*.md` file with
  your code. Docs- or infra-only changes that need no release can use an empty changeset:
  ```bash
  npx changeset add --empty
  ```

## Documentation site

The docs are a [VitePress](https://vitepress.dev) site whose source lives in `docs/`.

```bash
npm run docs:dev       # live-reloading dev server
npm run docs:build     # static build (also validates all links)
npm run docs:preview   # preview the production build
```

Demos are Vue single-file components under `docs/.vitepress/theme/demos/<group>/`. A page renders
one inside `<Demo>` and includes its source with a `<<<` snippet that points at **the same file**:

```md
<Demo background="muted">
  <YourDemo />
</Demo>

<<< ../.vitepress/theme/demos/<group>/your-demo.vue
```

`<Demo>` accepts a `background` prop: `'surface'` (default), `'muted'`, or `'grid'`. Demos import
from `@myghf/ui` exactly like consumers, and the docs alias resolves that to `src/`.

## Releases

Releases are merge-driven and run in GitHub Actions. Adding a changeset and opening a pull request
into `main` is the whole workflow; when the PR merges, CI opens a **Version Packages** pull request,
and merging that publishes to npm with provenance. Do not run `npm publish`, `npm version`, or push
`v*` tags as part of normal work.

## Further reading

- [`AGENTS.md`](https://github.com/myghf/ui/blob/main/AGENTS.md) — contributor and release
  conventions, including the Changesets flow and CI troubleshooting.
- [`DESIGN.md`](https://github.com/myghf/ui/blob/main/DESIGN.md) — brand rules: logo, palette,
  typography, dark mode, and how to build with the library.
- [Theming guide](/guide/theming) and [design tokens reference](/reference/tokens).
