# VitePress Documentation Site — Design Spec

- **Date:** 2026-09-27
- **Status:** Approved (pending written-spec review)
- **Package:** `@myghf/ui`
- **Scope:** A full, detailed documentation site for the entire public API of the library, built with VitePress, served locally (no deployment workflow).

## 1. Context

`@myghf/ui` is a public Vue 3 + Tailwind component library (currently `0.2.0`). It has a
`README.md` (setup + a component table), a `DESIGN.md` (brand rules), and colocated tests, but no
browsable documentation. The public surface has grown to ~20 components (several with
sub-components), composables, utilities, design tokens, and a Tailwind preset.

The repository is a single npm package (`files: ["dist"]`), so documentation never ships to
consumers. `docs/` currently contains only the Superpowers specs and plans.

## 2. Goals

1. A VitePress site under `docs/` documenting the **full public surface**: every component and
   sub-component, composables, utilities, tokens, and the Tailwind preset.
2. Live, interactive examples that render the real components from `src/`, each with copyable,
   syntax-highlighted source.
3. Guides for installation, setup, theming/dark mode, RTL/bilingual, accessibility, and icons.
4. Hand-written props/events/slots reference tables per component.
5. Correct dark mode in both the docs UI and the demos.

## 3. Non-goals

- No deployment workflow or hosting (local/dev only, per the decision below).
- No internationalized docs site (English only, no i18n scaffolding).
- No auto-generated API tables from TypeScript types.
- No changes to the published package's exports, `files`, or runtime behavior.
- No Storybook; VitePress is the docs framework.

## 4. Decisions (confirmed)

| Topic | Decision |
| --- | --- |
| Site location | VitePress root is `docs/`; `docs/superpowers/**` excluded from the build via `srcExclude`. |
| Deployment | Local/dev only: `docs:dev` / `docs:build` / `docs:preview`. No CI workflow. |
| Languages | English only; no i18n locales. |
| Demo format | Live previews + copyable code, via a shared `<Demo>` component and VitePress's native `<<<` snippet import. |
| API reference | Hand-written props/events/slots tables. |
| Coverage | Full public surface (components, composables, utilities, tokens, preset). |

## 5. Architecture

### 5.1 Layout

```
docs/
  .vitepress/
    config.ts                    # site config: title, nav, sidebar, search, markdown, vite
    theme/
      index.ts                   # extends default theme; registers <Demo>; imports CSS
      custom.css                 # brand accents + demo styles; imports src/tokens.css
      Demo.vue                   # branded preview pane wrapping a slot
      demos/<component>/*.vue    # one file per live example
  index.md                       # home (hero)
  guide/
    introduction.md
    installation.md
    setup.md
    theming.md
    rtl.md
    accessibility.md
    icons.md
  components/
    index.md
    <component>.md               # one page per component
  composables/
    use-theme.md
    use-toast.md
  utilities/
    cn.md
    date.md
    locale.md
    number.md
    icons.md
    tones.md
  reference/
    tokens.md
    tailwind-preset.md
  development.md
```

`docs/superpowers/specs/**` and `docs/superpowers/plans/**` remain in place and are excluded from
the site build.

### 5.2 Build configuration

New devDependencies: `vitepress` (latest 1.x), `autoprefixer`, `postcss`. (`tailwindcss` is already
a devDependency.)

New `package.json` scripts:

```json
"docs:dev": "vitepress dev docs",
"docs:build": "vitepress build docs",
"docs:preview": "vitepress preview docs"
```

`docs/.vitepress/config.ts`:

- `title`/`description`/`lang: 'en'`.
- `srcExclude: ['superpowers/**']`.
- `themeConfig`: nav (Guide, Components, Composables, Utilities, Tokens, GitHub), a grouped sidebar,
  `search: { provider: 'local' }`, `editLink`, `footer`, `socialLinks` (GitHub).
- `vite.resolve.alias`: `@myghf/ui` → `fileURLToPath(new URL('../../src/index.ts', import.meta.url))`,
  so demos import from `@myghf/ui` exactly like consumers and always render the current source.
- `markdown`: default (VitePress Shiki highlighting powers the `<<<` code blocks).

Tailwind runs inside the docs build:

- `docs/tailwind.config.js` uses the library preset (`../src/tailwindPreset.js`) with
  `content: ['./**/*.md', './.vitepress/**/*.{vue,ts}', '../src/**/*.{vue,ts}']`.
- `docs/postcss.config.js` registers `tailwindcss` with an explicit config path to
  `docs/tailwind.config.js` (Tailwind otherwise resolves its config from the process cwd, which is
  the repo root) plus `autoprefixer`.
- VitePress's root is `docs/`, so Vite picks up `docs/postcss.config.js` and the library's own
  `vite build` is unaffected.

### 5.3 Theme

`docs/.vitepress/theme/index.ts` extends `DefaultTheme`, registers `<Demo>` globally, and imports
`custom.css`. `custom.css` imports `src/tokens.css` and overrides VitePress's brand CSS variables
(`--vp-c-brand-*`) with `--myghf-primary-*`, plus styles for the demo pane.

Dark mode needs no custom wiring: VitePress adds `.dark` to `<html>`, which is the library's dark
selector, so the docs theme toggle drives both the VitePress UI and every live demo.

### 5.4 Demo pattern

Each example is a small `.vue` file under `docs/.vitepress/theme/demos/<component>/`. A page uses:

```md
<script setup>
import BasicButton from '../.vitepress/theme/demos/button/basic.vue'
</script>

<Demo><BasicButton /></Demo>

<<< ../.vitepress/theme/demos/button/basic.vue
```

- `<Demo>` renders its slot in a branded, padded preview pane.
- `<<< <relative-path>` is VitePress's native snippet import: it renders the demo's source with
  Shiki highlighting and VitePress's built-in copy button, so no `?raw` import is needed.
- Demo files import components from `@myghf/ui` (the alias), so they read like consumer code.

`Demo.vue` props: `background?: 'surface' | 'muted' | 'grid'` (default `surface`) for preview
padding/background. It renders only the preview; the code block is the separate `<<<` snippet.

## 6. Content inventory

### 6.1 Home (`index.md`)

Hero (brand name, tagline, `npm install @myghf/ui` snippet, actions to Guide and Components) plus
feature cards linking to Theming, RTL, Accessibility, and Components.

### 6.2 Guide

| Page | Contents |
| --- | --- |
| `guide/introduction.md` | What the library is, brand context, design principles, links to `DESIGN.md`. |
| `guide/installation.md` | Requirements (Vue `^3.5`, Tailwind `^3.4`), install command, package entry points. |
| `guide/setup.md` | Importing `tokens.css`, the Tailwind preset, `content` globs, a minimal working example. |
| `guide/theming.md` | Token model (`--myghf-*`, RGB channels + opacity), overriding tokens, dark mode (`.dark` / `data-theme`, the `.dark`-required caveat for `dark:`), `useTheme`/`createTheme`, `ThemeToggle`. |
| `guide/rtl.md` | `dir="rtl"`, `font-ar`, logical utilities, `rtl:` variants, per-component RTL notes. |
| `guide/accessibility.md` | Focus management, roles/`aria`, keyboard support, contrast rules, known gaps. |
| `guide/icons.md` | Usage guidance for icons; lucide names and how the `Icon` component resolves them. |

### 6.3 Components (one page each)

Each page follows a fixed template: overview, live examples, props table, events table, slots table,
exposed methods (if any), accessibility notes, and dark/RTL notes.

- **Actions & display:** `button`, `tag`, `alert` (also documents the `Message` alias),
  `theme-toggle`, `icon`.
- **Form:** `input`, `input-number`, `textarea`, `password`, `checkbox`, `select`, `select-button`,
  `date-picker`, `tree-select`, `transfer-list`.
- **Overlays:** `dialog`, `drawer`, `dropdown-menu`, `toaster` (documents `useToast`, `Toaster`,
  `createToastStore`).
- **Navigation:** `tabs` (documents `TabsList`, `TabsTrigger`, `TabsContent`).
- **Data:** `table` (documents `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell`,
  `TableEmpty`, `TablePagination`), `data-table`, `tree-table`.
- `components/index.md` is an index grouped by category with links.

### 6.4 Composables

- `composables/use-theme.md` — `useTheme`, `createTheme`, options/defaults, SSR behavior, the
  singleton-vs-factory distinction.
- `composables/use-toast.md` — `useToast`, `createToastStore`, `toastKey`, severities, positions,
  duration, queueing, the `<Toaster>` provider requirement.

### 6.5 Utilities

`cn`, `date` (`toISODate`, `toTime`, `toMinutes`, `clampTime`, `sortRange`, `dateToValue`,
`valueToDate`, `buildHourOptions`, `buildMinuteOptions`, `to12Hour`, `from12Hour`), `locale`
(`getFirstDayOfWeek`, `getWeekdayLabels`, `getMonthLabel`, `formatLocalizedDate`,
`formatLocalizedTime`), `number` (`toNumberOrNull`, `mergeFormatOptions`), `icons`
(`toPascalCase`, `resolveIconName`), `tones` (`toneClasses`, `Tone`, `ToneClasses`).

The three icon-related pages have distinct scopes: `components/icon.md` documents the `Icon`
component API, `guide/icons.md` is usage guidance, and `utilities/icons.md` documents the
`resolveIconName`/`toPascalCase` helpers.

### 6.6 Reference

- `reference/tokens.md` — every `--myghf-*` variable, light and dark values, the dark selector, and
  the consumer-override rule (brand scales are not re-declared in dark).
- `reference/tailwind-preset.md` — colors, fonts, shadows, and the `darkMode` setting.

### 6.7 Development

`development.md` — local commands (`npm ci`, `typecheck`, `test`, `build`, `docs:dev`), contributing
notes, and links to `AGENTS.md` and `DESIGN.md`.

## 7. Testing & verification

- `npm run docs:build` must succeed. VitePress fails the build on dead links, so all internal links
  and `<<<` paths are validated by the build.
- `npm run typecheck && npm test` must stay green (the library is unchanged).
- Manual smoke check with `docs:preview`: nav, sidebar, local search, dark-mode toggle (verify
  demos switch), and one demo per category rendering correctly.
- No CI workflow is added; verification is local.

## 8. Risks & mitigations

| Risk | Mitigation |
| --- | --- |
| Tailwind preflight clashes with VitePress's own CSS | Enable preflight (the library's `border`/`border-box` utilities need it), verify the VitePress UI in preview; if it visibly breaks, scope a minimal reset for demos only. |
| Tailwind resolves the wrong config (cwd is the repo root) | Pass an explicit config path in `docs/postcss.config.js`. |
| `@myghf/ui` alias missing at build time | Alias is declared in `docs/.vitepress/config.ts`; `docs:build` catches it. |
| Demo snippet paths drift from the `.vue` files | `docs:build` fails on a missing `<<<` target or dead link. |
| SSR rendering of reka-based components during build | VitePress renders pages SSR; if a component needs browser APIs, wrap the demo in `<ClientOnly>`. |
| Library build accidentally affected by docs config | Tailwind/PostCSS configs live under `docs/`; `vite build` (library) is unchanged. |

## 9. Release

- Infra/docs-only change with no effect on the published package, so it ships an **empty changeset**
  (`npx changeset add --empty`) per `AGENTS.md`.
- `package.json` gains devDependencies and scripts; `files`, exports, and runtime code are untouched.

## 10. Acceptance criteria

1. `docs:dev` serves a branded VitePress site; `docs:build` passes with no dead links.
2. Every public export has a documented page: all components/sub-components, composables,
   utilities, tokens, and the preset.
3. Component pages show at least one live example with copyable, highlighted source.
4. The site's dark-mode toggle changes both the VitePress UI and the live demos.
5. `docs/superpowers/**` is not built as site pages.
6. `npm run typecheck && npm test` still pass; the published package is unchanged.
7. An empty changeset exists.
