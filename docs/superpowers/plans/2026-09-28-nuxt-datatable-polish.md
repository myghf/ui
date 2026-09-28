# Nuxt + DataTable Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix three polish issues in `@myghf/ui`: make the Nuxt module's Tailwind wiring explicit/optional/idempotent, add a loading state to `DataTable`, and auto-import composables/utilities (not just components).

**Architecture:** Extend `src/nuxt.ts` (module options, loud/idempotent Tailwind wiring, `addImports` for composables/utilities) and `src/components/data-table/DataTable.vue` (loading props rendering `Skeleton` placeholder rows). Update docs and add one `minor` changeset.

**Tech Stack:** Vue 3.5, TypeScript, Reka UI, Tailwind 3, `@nuxt/kit` (optional peer), Vitest + `@vue/test-utils`, VitePress.

**Spec:** The task brief in the conversation (three fixes). No separate spec file.

## Global Constraints

- **No new hard dependencies.** Only optional peer deps are allowed: add `@nuxtjs/tailwindcss` (optional peer). Do not add it as a dependency or devDependency.
- Keep the core package framework-agnostic; `dist/index.js` must not import `@nuxt/kit`.
- Tokens only (no hex); logical/RTL utilities; dark-mode correct.
- Do not change existing public APIs; extend only.
- No PrimeIcons (`pi pi-*`) handling anywhere.
- Gate per task: `npm run typecheck && npm test`. Tasks touching the build run `npm run build`; docs tasks run `npm run docs:build`.
- One `minor` changeset in the final task; never hand-edit `version`/`CHANGELOG.md`.

## Review Focus

1. **Non-Nuxt consumers unaffected** — `dist/index.js` still has no `@nuxt/kit` import; the module stays behind `@myghf/ui/nuxt`. Check in Task 1's build step.
2. **Tailwind wiring idempotency** — running the module `setup` twice must not duplicate the content glob or the preset. Tested in Task 1.
3. **`autoImports` resolution** — `true` enables both; `false` disables both; an object enables each key independently (unspecified keys default to `true`); `prefix` affects components only. Tested in Task 1.
4. **`DataTable` non-loading path unchanged** — sorting, expansion, empty state, striping, and `cell-<id>` slots still work. Regression tests in Task 2.
5. **`DataTable` loading a11y** — wrapper `aria-busy="true"`, an `sr-only` `loadingLabel`, placeholder rows are not clickable/expandable, and the empty state is suppressed. Tested in Task 2.

---

## Task 1: Nuxt module — Tailwind wiring + auto-imports

**Files:**
- Modify: `src/nuxt.ts`
- Modify: `src/nuxt.spec.ts`
- Modify: `package.json` (optional peer), `package-lock.json`

**Interfaces:**
- Produces: `ModuleOptions { autoImports?: boolean | { components?: boolean; composables?: boolean }; prefix?: string; tailwind?: boolean }`; exported `AUTO_IMPORT_COMPONENTS`, `AUTO_IMPORT_COMPOSABLES`, `AUTO_IMPORT_UTILITIES`.

- [ ] **Step 1: Write the failing tests** (`src/nuxt.spec.ts`)

- `getOptions({}, nuxtStub)` defaults include `tailwind: true`.
- `AUTO_IMPORT_COMPOSABLES` contains `useTheme`, `createTheme`, `useToast`, `createToastStore`, `toastKey`.
- `AUTO_IMPORT_UTILITIES` contains `cn`, `toneClasses`, `toPascalCase`, `resolveIconName`, `toNumberOrNull`, `mergeFormatOptions` (and the date/locale helpers).
- Sync guard: `AUTO_IMPORT_COMPONENTS ∪ AUTO_IMPORT_COMPOSABLES ∪ AUTO_IMPORT_UTILITIES` equals `Object.keys(import * as ui from './index')`.
- Option resolution (test a small exported helper `resolveAutoImports(option)`): `true` → `{ components: true, composables: true }`; `false` → both `false`; `{}` → both `true`; `{ components: false }` → `{ components: false, composables: true }`; `{ composables: false }` → `{ components: true, composables: false }`.

- [ ] **Step 2: Run and confirm failure** — `npx vitest run src/nuxt.spec.ts`

- [ ] **Step 3: Implement the module** (`src/nuxt.ts`)

- `import { addComponent, addImports, defineNuxtModule, logger } from '@nuxt/kit'`.
- `ModuleOptions` as above; `defaults: { autoImports: true, prefix: '', tailwind: true }`.
- Export `resolveAutoImports(option: ModuleOptions['autoImports']): { components: boolean; composables: boolean }` (boolean → both; object → each key `?? true`).
- Export `AUTO_IMPORT_COMPONENTS` (unchanged list), `AUTO_IMPORT_COMPOSABLES` (`useTheme`, `createTheme`, `useToast`, `createToastStore`, `toastKey`), `AUTO_IMPORT_UTILITIES` (all remaining runtime exports: `cn`, the date/locale/number/icon helpers, `toneClasses`).
- Tailwind branch:
  - If `options.tailwind === false` → skip entirely.
  - Else read `(nuxt.options as ...).tailwindcss`; if present → `tw.config ??= {}`; add the glob to `content` only if `!content.includes('./node_modules/@myghf/ui/dist/**/*.js')`; push the imported preset object to `presets` only if `!presets.includes(preset)`.
  - Else → `logger.warn('@nuxtjs/tailwindcss was not detected, so the @myghf/ui Tailwind preset and content glob were NOT added automatically. Add \'./node_modules/@myghf/ui/dist/**/*.js\' to your Tailwind `content` and \'@myghf/ui/tailwind-preset\' to your `presets`, or set `myghfUi: { tailwind: false }` to silence this.')`. Do not throw.
- Auto-imports: resolve the option; when `components` → `addComponent({ name: `${prefix}${name}`, export: name, filePath: '@myghf/ui' })`; when `composables` → `addImports({ name, from: '@myghf/ui' })` for each of `AUTO_IMPORT_COMPOSABLES` and `AUTO_IMPORT_UTILITIES` (unprefixed).

- [ ] **Step 4: `package.json` optional peer**

Add `"@nuxtjs/tailwindcss": "^6.0.0"` to `peerDependencies` and `"@nuxtjs/tailwindcss": { "optional": true }` to `peerDependenciesMeta` (keep the existing peers).

- [ ] **Step 5: Run the tests, typecheck, and build**

Run: `npx vitest run src/nuxt.spec.ts && npm run typecheck && npm test && npm run build`
Verify: `dist/nuxt.js` + `dist/nuxt.d.ts` exist; `grep -c "@nuxt/kit" dist/index.js` is `0`.

- [ ] **Step 6: Commit**

```bash
git add src/nuxt.ts src/nuxt.spec.ts package.json package-lock.json
git commit -m "fix(nuxt): explicit/idempotent Tailwind wiring and composable auto-imports"
```

---

## Task 2: `DataTable` loading state

**Files:**
- Modify: `src/components/data-table/DataTable.vue`
- Create/modify: `src/components/data-table/data-table.spec.ts` (or extend an existing DataTable spec if present)

**Interfaces:**
- Produces: additive props `loading`, `loadingRows`, `loadingLabel`.

- [ ] **Step 1: Write the failing tests**

- `loading: true, loadingRows: 3` renders 3 placeholder rows, each with one `Skeleton` per column; the data rows are not rendered.
- Wrapper has `aria-busy="true"`; an `sr-only` element contains `loadingLabel` (default `Loading…`; custom respected).
- Empty state (`No results`) is suppressed while loading; shown when `loading: false` and `data: []`.
- Non-loading: real rows render; clicking a row still emits `update:expanded` when `expandable`; placeholder rows do not respond.

- [ ] **Step 2: Run and confirm failure** — `npx vitest run src/components/data-table/data-table.spec.ts`

- [ ] **Step 3: Implement**

- Add props `loading?: boolean` (default `false`), `loadingRows?: number` (default `5`), `loadingLabel?: string` (default `'Loading…'`); import `Skeleton`.
- Wrapper: `:aria-busy="loading || undefined"`; add `<span v-if="loading" class="sr-only">{{ loadingLabel }}</span>` inside the wrapper.
- Body: when `loading`, render `<TableRow v-for="n in loadingRows" :key="'loading-' + n">` with `<TableCell v-for="c in columnCount" :key="c"><Skeleton height="1rem" rounded="sm" /></TableCell>` (tokens only; no click handler). Otherwise render the existing rows.
- Empty state: `v-if="!loading && rows.length === 0"`.
- Do not alter sorting/pagination/expansion/striping/`cell-<id>` slots.

- [ ] **Step 4: Gate and commit**

Run: `npx vitest run src/components/data-table/data-table.spec.ts && npm run typecheck && npm test`

```bash
git add src/components/data-table
git commit -m "feat(DataTable): add a loading state with skeleton rows"
```

---

## Task 3: Docs updates

**Files:**
- Modify: `docs/components/data-table.md`
- Modify: `docs/guide/nuxt.md`
- Modify: `README.md` (Nuxt integration section)

- [ ] **Step 1: `data-table.md`** — add the `loading`/`loadingRows`/`loadingLabel` props to the table and a live example (with a `loading` toggle) using the existing demo pattern.

- [ ] **Step 2: `guide/nuxt.md`** — document: the automatic Tailwind wiring requires `@nuxtjs/tailwindcss` (now an optional peer); when it is absent the module warns and you wire the preset/content manually; the `tailwind` option (default `true`); the `autoImports` object form (`{ components, composables }`, unspecified keys default `true`); and that composables/utilities are auto-imported unprefixed while `prefix` applies to components only. Update the options table.

- [ ] **Step 3: `README.md`** — in the Nuxt/integration section, note the `@nuxtjs/tailwindcss` requirement and the new options briefly.

- [ ] **Step 4: Build and commit**

Run: `npm run docs:build`

```bash
git add docs README.md
git commit -m "docs: document DataTable loading and the Nuxt module options"
```

---

## Task 4: Changeset and final verification

**Files:**
- Create: `.changeset/*.md` (minor)

- [ ] **Step 1: Changeset**

Run: `npx changeset --minor @myghf/ui -m "fix: loud/optional Nuxt Tailwind wiring, DataTable loading state, and composable auto-imports"`

- [ ] **Step 2: Full gate**

Run: `npm run typecheck && npm test && npm run build && npm run docs:build`
Verify `dist/nuxt.js`/`dist/nuxt.d.ts` exist and `dist/index.js` has no `@nuxt/kit`.

- [ ] **Step 3: PrimeIcons check**

Run: `grep -rin --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=.git --exclude-dir=.superpowers "primeicons\|pi pi-\|primeicon" src docs || echo clean`

- [ ] **Step 4: Commit**

```bash
git add .changeset
git commit -m "chore: add minor changeset for the polish fixes"
```

---

## Self-review notes

- **Coverage:** Fix 1 + Fix 3 → Task 1 (shared `src/nuxt.ts`); Fix 2 → Task 2; docs → Task 3; changeset/verification → Task 4. The three fixes are independent.
- **Review Focus:** each of the five lines has a concrete test/check in its owning task (build grep, idempotency test, option-resolution test, DataTable regression tests, loading a11y tests).
- **Type consistency:** `ModuleOptions`/`resolveAutoImports`/`AUTO_IMPORT_*` are defined once in Task 1 and referenced by the Task 1 tests; `DataTable` props are additive and consumed by Task 3's docs.
