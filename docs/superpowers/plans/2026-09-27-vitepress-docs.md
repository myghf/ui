# VitePress Documentation Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a full VitePress documentation site under `docs/` for the entire `@myghf/ui` public surface, with live demos, hand-written API tables, and brand-aligned dark mode.

**Architecture:** VitePress rooted at `docs/` (with `srcExclude` for `docs/superpowers/**`), extended by a small custom theme that imports the library's tokens and runs Tailwind with the MYGHF preset. Demos are real `.vue` files that import from `@myghf/ui` (aliased to `src/index.ts`), rendered inside a shared `<Demo>` preview pane and shown via VitePress's native `<<<` snippet import.

**Tech Stack:** VitePress 1.x, Vue 3.5, Tailwind CSS 3.4 (MYGHF preset), PostCSS + autoprefixer, Markdown, Shiki (via VitePress).

**Spec:** `docs/superpowers/specs/2026-09-27-vitepress-docs-design.md`

## Global Constraints

- VitePress root is `docs/`; `srcExclude: ['superpowers/**']` so specs/plans are never built as pages.
- English only; no i18n locales.
- Local/dev only: scripts `docs:dev`, `docs:build`, `docs:preview`. No CI workflow.
- Docs never ship: `package.json` `files`, `exports`, and runtime code are unchanged.
- `@myghf/ui` is aliased to `src/index.ts` in `docs/.vitepress/config.ts`, so demos render current source.
- Tailwind runs in the docs build via `docs/postcss.config.js` with an explicit config path to `docs/tailwind.config.js`; that config uses `../src/tailwindPreset.js` and `content: { relative: true, files: ['./**/*.md', './.vitepress/**/*.{vue,ts}', '../src/**/*.{vue,ts}'] }`. The `relative: true` form is required because Tailwind resolves globs from the process cwd (the repo root), not the config file's directory.
- `docs/.vitepress/theme/custom.css` imports `src/tokens.css` and overrides VitePress brand variables from `--myghf-primary-*`.
- Demo pattern (every example):
  ```md
  <script setup>
  import X from '../.vitepress/theme/demos/<component>/<name>.vue'
  </script>

  <Demo><X /></Demo>

  <<< ../.vitepress/theme/demos/<component>/<name>.vue
  ```
  The `<<<` path MUST be the same file as the `<script setup>` import.
- Demo `.vue` files import components from `@myghf/ui` (the alias) — consumer-style code.
- Component pages use the fixed template: overview → live examples → props table → events table → slots table → exposed methods (if any) → accessibility notes → dark/RTL notes. Tables are hand-written and must match the component's `<script setup>` props/defaults and emitted events exactly.
- Follow `DESIGN.md`: tokens-first (no raw hex), logical utilities (`ps/pe/ms/me/start/end`), `rtl:` variants, blue as primary.
- Brand tokens are not re-declared in dark mode; document that consumer `:root` overrides survive.
- Do not modify `src/**` runtime code. The only non-`docs/` changes are `package.json` (scripts + devDependencies), `package-lock.json`, and the empty changeset.
- Final task adds an empty changeset (`npx changeset add --empty`) per `AGENTS.md`; never edit `version`/`CHANGELOG.md`.
- Verification per task: `npm run docs:build` must pass (dead links fail the build). Run `npm run typecheck && npm test` after Task 1 and in the final task.

## Review Focus

1. **Prop/event/slot tables must match the component source.** An implementer could invent props. Each page's table is checked against the component's `<script setup>` and the barrel export; Task 9 adds a coverage guard, and reviewers spot-check tables against source.
2. **Shown code must equal the rendered demo.** Structurally enforced by `<<<` pointing at the same file as the render import; reviewers verify each page's two paths match.
3. **Demos must actually switch with the docs dark toggle.** `custom.css` must import `src/tokens.css` and the alias/preset must be wired; Task 1 verifies the home demo and Task 9 verifies a component demo under dark.
4. **`docs:build` must pass with no dead links** after every task (VitePress fails on dead internal links and missing `<<<` targets).
5. **Tailwind preflight must not break VitePress chrome.** Task 1 enables preflight and visually checks the nav/sidebar/home; if it breaks, scope a demo-only reset rather than disabling preflight.

---

## Task 1: Scaffold the site, theme, and home page

**Files:**
- Modify: `package.json` (scripts + devDependencies)
- Create: `docs/.vitepress/config.ts`
- Create: `docs/.vitepress/theme/index.ts`
- Create: `docs/.vitepress/theme/custom.css`
- Create: `docs/.vitepress/theme/Demo.vue`
- Create: `docs/tailwind.config.js`
- Create: `docs/postcss.config.js`
- Create: `docs/index.md`

**Interfaces:**
- Produces: the `@myghf/ui` alias; the global `<Demo>` component (`background?: 'surface' | 'muted' | 'grid'`, default `'surface'`); the Tailwind/PostCSS wiring; the site nav/sidebar skeleton. All later tasks depend on these.

- [ ] **Step 1: Install devDependencies**

Run: `npm install -D vitepress autoprefixer postcss`
Expected: `package.json` devDependencies and `package-lock.json` updated.

- [ ] **Step 2: Add scripts to `package.json`**

```json
"docs:dev": "vitepress dev docs",
"docs:build": "vitepress build docs",
"docs:preview": "vitepress preview docs"
```

- [ ] **Step 3: Create the Tailwind and PostCSS configs**

`docs/tailwind.config.js`:

```js
import preset from '../src/tailwindPreset.js'

export default {
  presets: [preset],
  content: {
    relative: true,
    files: ['./**/*.md', './.vitepress/**/*.{vue,ts}', '../src/**/*.{vue,ts}'],
  },
}
```

`docs/postcss.config.js` (explicit config path because the process cwd is the repo root):

```js
import { fileURLToPath } from 'node:url'

export default {
  plugins: {
    tailwindcss: { config: fileURLToPath(new URL('./tailwind.config.js', import.meta.url)) },
    autoprefixer: {},
  },
}
```

- [ ] **Step 4: Create the VitePress config**

`docs/.vitepress/config.ts` sets `title`, `description`, `lang: 'en'`,
`srcExclude: ['superpowers/**']`, the nav (Guide, Components, Composables, Utilities, Tokens,
GitHub), a grouped sidebar, `search: { provider: 'local' }`, edit links, and:

```ts
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  // ...title/description/srcExclude/themeConfig...
  vite: {
    resolve: {
      alias: { '@myghf/ui': fileURLToPath(new URL('../../src/index.ts', import.meta.url)) },
    },
  },
})
```

- [ ] **Step 5: Create the theme**

`docs/.vitepress/theme/index.ts` extends `DefaultTheme`, registers `Demo`, and imports `custom.css`.
`docs/.vitepress/theme/custom.css` starts with `@import '../../../src/tokens.css';` and overrides
`--vp-c-brand-1/-2/-3` from the `--myghf-primary-*` tokens, plus `.myghf-demo` pane styles (padding,
border, radius, optional grid background).
`docs/.vitepress/theme/Demo.vue` renders its slot inside `<div class="myghf-demo" :class="...">`.

- [ ] **Step 6: Create the home page**

`docs/index.md` uses VitePress's home layout: hero (name, tagline, `npm install @myghf/ui` action)
and feature cards linking to Theming, RTL, Accessibility, and Components.

- [ ] **Step 7: Build and check**

Run: `npm run docs:build`
Expected: PASS, no dead links. Run `npm run docs:preview` and confirm the home page renders, the nav
and sidebar appear, and Tailwind preflight has not visibly broken the VitePress chrome (Review Focus
5).

- [ ] **Step 8: Confirm the library is unaffected and commit**

Run: `npm run typecheck && npm test`

```bash
git add package.json package-lock.json docs/
git commit -m "docs: scaffold VitePress site, theme and home page"
```

---

## Task 2: Guide pages

**Files:**
- Create: `docs/guide/introduction.md`, `installation.md`, `setup.md`, `theming.md`, `rtl.md`,
  `accessibility.md`, `icons.md`
- Modify: `docs/.vitepress/config.ts` (sidebar guide entries)

**Interfaces:**
- Consumes: the site skeleton and `<Demo>` from Task 1.
- Produces: the guide content that component pages link to.

- [ ] **Step 1: Write the seven guide pages**

Use `README.md`, `DESIGN.md`, and the actual exports as sources of truth. Required content:
- `introduction.md`: what the library is, brand context, principles, links to `DESIGN.md`.
- `installation.md`: requirements (Vue `^3.5`, Tailwind `^3.4`), `npm install @myghf/ui`, entry points.
- `setup.md`: import `tokens.css`, load the preset, `content` globs, a minimal working example.
- `theming.md`: the `--myghf-*` model (RGB channels + `<alpha-value>`), overriding tokens, dark mode
  (`.dark` / `data-theme="dark"`, the caveat that `dark:` utilities require `.dark`), `useTheme`/
  `createTheme`, `ThemeToggle`, and that brand scales are not re-declared in dark.
- `rtl.md`: `dir="rtl"`, `font-ar`, logical utilities, `rtl:` variants, per-component notes.
- `accessibility.md`: focus, roles/`aria`, keyboard, contrast rules, known gaps.
- `icons.md`: icon usage guidance and lucide naming (distinct from `components/icon.md` and
  `utilities/icons.md`).

Where a live example helps (e.g. dark-mode toggle, RTL block), use the Task 1 demo pattern.

- [ ] **Step 2: Wire the sidebar and build**

Add the guide pages to the sidebar in `docs/.vitepress/config.ts`, then run `npm run docs:build`.
Expected: PASS, no dead links.

- [ ] **Step 3: Commit**

```bash
git add docs/guide docs/.vitepress/config.ts
git commit -m "docs: add guide pages"
```

---

## Task 3: Components index + actions & display pages

**Files:**
- Create: `docs/components/index.md`
- Create: `docs/components/{button,tag,alert,theme-toggle,icon}.md`
- Create: `docs/.vitepress/theme/demos/<component>/*.vue` (one or more per page)
- Modify: `docs/.vitepress/config.ts` (sidebar components section)

**Interfaces:**
- Consumes: `<Demo>` and the demo pattern.
- Produces: the component page template other component tasks copy.

- [ ] **Step 1: Write the page template and index**

`docs/components/index.md` lists the components that exist so far, grouped by category with links.
It MUST only link to pages that already exist — later component tasks append their own group to it
(so `docs:build` never sees a dead link). Establish the fixed page template
(overview → examples → props → events → slots → exposed → a11y → dark/RTL) by writing `button.md`
fully first.

- [ ] **Step 2: Write the pages against source**

For each of `button`, `tag`, `alert`, `theme-toggle`, `icon`, read
`src/components/<name>/<Name>.vue` (and `src/index.ts` for the export names) and document the exact
props, defaults, events, and slots. Note `Alert` is also exported as `Message`. Include at least one
live demo per page using the demo pattern.

- [ ] **Step 3: Wire the sidebar and build**

Run: `npm run docs:build`
Expected: PASS, no dead links or missing `<<<` targets.

- [ ] **Step 4: Commit**

```bash
git add docs/components docs/.vitepress/theme/demos docs/.vitepress/config.ts
git commit -m "docs: add actions and display component pages"
```

---

## Task 4: Form component pages

**Files:**
- Create: `docs/components/{input,input-number,textarea,password,checkbox,select,select-button,date-picker,tree-select,transfer-list}.md`
- Create: `docs/.vitepress/theme/demos/<component>/*.vue`
- Modify: `docs/components/index.md` (append the form group)
- Modify: `docs/.vitepress/config.ts` (sidebar)

**Interfaces:**
- Consumes: the Task 3 template.
- Produces: form-component documentation.

- [ ] **Step 1: Write the ten pages against source**

Read each `src/components/<name>/<Name>.vue` and document exact props/defaults/events/slots. For
`InputNumber` include the `number | null` v-model, min/max/step/integer/locale/formatOptions/currency,
and the `role="spinbutton"`/`aria-invalid`/`aria-valuetext` behavior. For `DatePicker` document
`mode`, `hourFormat`, `minuteStep`, `locale`, `labels` (+ `label-*` slots), `weekStartsOn`, and
`defaultOpen`. Include at least one live demo per page. Append the form group to
`docs/components/index.md`.

- [ ] **Step 2: Wire the sidebar and build**

Run: `npm run docs:build`
Expected: PASS, no dead links.

- [ ] **Step 3: Commit**

```bash
git add docs/components docs/.vitepress/theme/demos docs/.vitepress/config.ts
git commit -m "docs: add form component pages"
```

---

## Task 5: Overlay component pages

**Files:**
- Create: `docs/components/{dialog,drawer,dropdown-menu,toast}.md`
- Create: `docs/.vitepress/theme/demos/<component>/*.vue`
- Modify: `docs/components/index.md` (append the overlays group)
- Modify: `docs/.vitepress/config.ts` (sidebar)

**Interfaces:**
- Consumes: the Task 3 template, `useToast`/`Toaster`.
- Produces: overlay documentation.

- [ ] **Step 1: Write the four pages against source**

Read each component's source. For `drawer` document `v-model:open`, positions
`left|right|top|bottom|start|end`, sizes, backdrop/closeOnEscape/closeOnOutside/preventScroll
(including the `preventScroll: false` + `backdrop: false` caveat). For `toast` (`Toaster.vue`,
`Toast.vue`, `useToast.ts`) document `<Toaster>` as the required provider, `useToast()`'s
setup-only contract, severities, the six positions, duration (0 = persistent), and queueing. Use
`<ClientOnly>` around demos that need browser APIs if SSR fails (Review Focus / risks). Include at
least one live demo per page. Append the overlays group to `docs/components/index.md`.

- [ ] **Step 2: Wire the sidebar and build**

Run: `npm run docs:build`
Expected: PASS, no dead links.

- [ ] **Step 3: Commit**

```bash
git add docs/components docs/.vitepress/theme/demos docs/.vitepress/config.ts
git commit -m "docs: add overlay component pages"
```

---

## Task 6: Navigation and data component pages

**Files:**
- Create: `docs/components/{tabs,table,data-table,tree-table}.md`
- Create: `docs/.vitepress/theme/demos/<component>/*.vue`
- Modify: `docs/components/index.md` (append the navigation and data groups)
- Modify: `docs/.vitepress/config.ts` (sidebar)

**Interfaces:**
- Consumes: the Task 3 template.
- Produces: navigation/data documentation.

- [ ] **Step 1: Write the four pages against source**

Read the components and their sub-components. `tabs.md` documents `TabsList`, `TabsTrigger`,
`TabsContent`; `table.md` documents `TableHeader`, `TableBody`, `TableRow`, `TableHead`,
`TableCell`, `TableEmpty`, `TablePagination`; `data-table.md` and `tree-table.md` document their
column/type props (`DataTableFeatures`, `TreeTableColumn`, `TreeNode`). Include at least one live
demo per page; data demos may use small static datasets defined inline in the demo `.vue`. Append the navigation and data groups to `docs/components/index.md`.

- [ ] **Step 2: Wire the sidebar and build**

Run: `npm run docs:build`
Expected: PASS, no dead links.

- [ ] **Step 3: Commit**

```bash
git add docs/components docs/.vitepress/theme/demos docs/.vitepress/config.ts
git commit -m "docs: add navigation and data component pages"
```

---

## Task 7: Composables and utilities pages

**Files:**
- Create: `docs/composables/{use-theme,use-toast}.md`
- Create: `docs/utilities/{cn,date,locale,number,icons,tones}.md`
- Modify: `docs/.vitepress/config.ts` (sidebar)

**Interfaces:**
- Consumes: the exports in `src/index.ts` and the `src/lib/*` sources.
- Produces: composable/utility documentation.

- [ ] **Step 1: Write the pages against source**

- `use-theme.md`: `useTheme`, `createTheme`, options/defaults, SSR behavior, singleton vs factory.
- `use-toast.md`: `useToast`, `createToastStore`, `toastKey`, severities, positions, duration,
  queueing, the `<Toaster>` requirement.
- Utilities: document every exported helper with signature, parameters, return value, and a short
  example: `cn`; date (`toISODate`, `toTime`, `toMinutes`, `clampTime`, `sortRange`, `dateToValue`,
  `valueToDate`, `buildHourOptions`, `buildMinuteOptions`, `to12Hour`, `from12Hour`); locale (`getFirstDayOfWeek`,
  `getWeekdayLabels`, `getMonthLabel`, `formatLocalizedDate`, `formatLocalizedTime`); number
  (`toNumberOrNull`, `mergeFormatOptions`); icons (`toPascalCase`, `resolveIconName`); tones
  (`toneClasses`, `Tone`, `ToneClasses`).

- [ ] **Step 2: Wire the sidebar and build**

Run: `npm run docs:build`
Expected: PASS, no dead links.

- [ ] **Step 3: Commit**

```bash
git add docs/composables docs/utilities docs/.vitepress/config.ts
git commit -m "docs: add composable and utility pages"
```

---

## Task 8: Reference and development pages

**Files:**
- Create: `docs/reference/tokens.md`, `docs/reference/tailwind-preset.md`, `docs/development.md`
- Modify: `docs/.vitepress/config.ts` (sidebar)

**Interfaces:**
- Consumes: `src/tokens.css`, `src/tailwindPreset.js`, `AGENTS.md`, `DESIGN.md`.

- [ ] **Step 1: Write the reference pages**

- `reference/tokens.md`: every `--myghf-*` variable with its light value; mark the six semantic
  variables overridden under `[data-theme='dark'], .dark` with their dark values; document the dark
  selector and that brand scales are not re-declared (consumer overrides survive).
- `reference/tailwind-preset.md`: colors, font families, shadows, and the `darkMode: ['class', '.dark']`
  setting, with a note on the `.dark`-required caveat for `dark:` utilities.

- [ ] **Step 2: Write `development.md`**

Local commands (`npm ci`, `typecheck`, `test`, `build`, `docs:dev`, `docs:build`), contributing notes,
and links to `AGENTS.md` and `DESIGN.md`.

- [ ] **Step 3: Wire the sidebar and build**

Run: `npm run docs:build`
Expected: PASS, no dead links.

- [ ] **Step 4: Commit**

```bash
git add docs/reference docs/development.md docs/.vitepress/config.ts
git commit -m "docs: add reference and development pages"
```

---

## Task 9: Coverage guard, changeset, and final verification

**Files:**
- Create: `src/lib/docsCoverage.spec.ts`
- Create: `.changeset/*.md` (empty changeset)
- Modify: `docs/.vitepress/config.ts` (complete sidebar / nav)

**Interfaces:**
- Consumes: everything above.
- Produces: a guard that every public export has a page, plus the release artifact.

- [ ] **Step 1: Write the coverage guard**

Create `src/lib/docsCoverage.spec.ts` that asserts the docs cover the public surface. Use an explicit
export→page map so the test is precise rather than a fuzzy name search, for example:

```ts
const MAP: Record<string, string> = {
  Button: 'components/button.md',
  Tag: 'components/tag.md',
  Alert: 'components/alert.md',
  Message: 'components/alert.md',
  ThemeToggle: 'components/theme-toggle.md',
  Icon: 'components/icon.md',
  Input: 'components/input.md',
  InputNumber: 'components/input-number.md',
  // ...every component and sub-component...
  useTheme: 'composables/use-theme.md',
  createTheme: 'composables/use-theme.md',
  useToast: 'composables/use-toast.md',
  createToastStore: 'composables/use-toast.md',
  toastKey: 'composables/use-toast.md',
  cn: 'utilities/cn.md',
  // ...every utility...
}
```

Assert every runtime export of `src/index.ts` (via `Object.keys(import * as ui)`) appears as a key
in `MAP`, and every mapped file exists under `docs/`. This makes "full public surface" enforceable.

- [ ] **Step 2: Run the guard and the full suite**

Run: `npx vitest run src/lib/docsCoverage.spec.ts && npm test`
Expected: PASS. If a name is missing, add its page (or correct the map) before continuing.

- [ ] **Step 3: Add the empty changeset**

Run: `npx changeset add --empty`
Expected: a new `.changeset/*.md` file with an empty summary (docs/infra-only change).

- [ ] **Step 4: Final verification**

Run: `npm run docs:build && npm run typecheck && npm test`
Expected: PASS. Then `npm run docs:preview` and confirm: nav/sidebar complete, local search works, the
dark toggle switches both the VitePress UI and a component demo (Review Focus 3), and one demo per
category renders correctly.

- [ ] **Step 5: Commit**

```bash
git add src/lib/docsCoverage.spec.ts .changeset docs/.vitepress/config.ts
git commit -m "docs: add coverage guard, empty changeset and final polish"
```

---

## Self-review notes

- **Spec coverage:** Task 1 covers §5 (layout/build/theme/demo) and §6.1; Task 2 covers §6.2;
  Tasks 3–6 cover §6.3; Task 7 covers §6.4–6.5; Task 8 covers §6.6–6.7; Task 9 covers §7 (verification),
  §9 (release) and acceptance criteria 1–7. Every spec section maps to a task.
- **Review Focus:** each of the five lines has a concrete check in its owning task (props vs source,
  `<<<` path match, dark toggle in Task 9, `docs:build` per task, preflight check in Task 1).
- **Type consistency:** the `<Demo>` prop (`background`) and the alias (`@myghf/ui`) defined in
  Task 1 are used unchanged by every later task; the coverage map in Task 9 uses the export names
  from `src/index.ts`.
