# Remaining Primitives & Components Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Spinner, Skeleton, Button icon affordances, DropdownMenu completeness, Input native attrs, Textarea auto-grow, a form-field family, Avatar, and an optional Nuxt module to `@myghf/ui`, with tests, docs, and a minor changeset.

**Architecture:** Follow the existing component pattern (`<script setup lang="ts">`, `tv` variants, `cn()`, Reka UI primitives, `Icon`). A shared `formField` injection context lets `FormField` wire `for`/`id`/`aria-describedby`/`aria-invalid`/`required` into `Label`/`Input`/`Textarea`/`Select` (explicit props win). A second Vite lib entry (`src/nuxt.ts`) ships an optional `@nuxt/kit` module.

**Tech Stack:** Vue 3.5, TypeScript, Reka UI 2.x, lucide-vue-next, tailwind-variants, Vite (lib build) + vite-plugin-dts, Vitest + @vue/test-utils, VitePress, `@nuxt/kit` (optional peer).

**Spec:** `docs/superpowers/specs/2026-09-27-remaining-primitives-design.md`

## Global Constraints

- **Tokens only** — no hex; use `--myghf-*` tokens / Tailwind classes and `toneClasses`.
- **Dark mode** — every new component correct under `.dark`; add `dark:` where tokens alone are insufficient.
- **RTL** — logical utilities (`ps/pe/ms/me/start/end`, `text-start/end`) and `rtl:` for directional icons; never physical `left/right`.
- **Accessibility** — correct roles/`aria-*`, `focus-visible:ring-primary-500`, keyboard operability, disabled/loading states.
- **Styling API** — `tv` for variant maps, `cn()` for consumer classes.
- **Extend, never break** — additive props only; existing component behaviour must not regress.
- **Exports** — add every new value and type to `src/index.ts`; add the new runtime names to `EXPECTED` in `src/index.spec.ts`.
- **Coverage guard** — `src/lib/docsCoverage.spec.ts` maps every runtime export to a docs page; each task that adds an export MUST also create its docs page and add its `MAP` entries, or `npm test` fails.
- **No new runtime dependencies** except `@nuxt/kit` (optional peer + devDependency for our build).
- **No PrimeIcons** — no `pi pi-*` handling or name mapping anywhere.
- **Gate per task** — `npm run typecheck && npm test`; docs tasks additionally run `npm run docs:build`.
- Docs follow the established pattern: fixed template (overview → examples → props → events → slots → exposed → a11y → dark/RTL), live `<Demo>` examples, and `<<<` pointing at the SAME demo `.vue` file.
- Final task adds one `minor` changeset; never hand-edit `version`/`CHANGELOG.md`.

## Review Focus

1. **No regression in existing components** (Input/Textarea/Select/Button): explicit props win over context; with no `FormField` provider the components behave exactly as before. Tests in Tasks 2–4.
2. **`Textarea` auto-grow in jsdom** (no layout engine): `scrollHeight` is 0 — the resize must not crash or set NaN heights, and tests must mock `scrollHeight`. Task 3.
3. **Multi-entry build validity:** `dist/index.js`, `dist/nuxt.js`, `dist/index.d.ts`, `dist/nuxt.d.ts` all emitted and the `./nuxt` export resolves. Task 10.
4. **Core entry stays framework-agnostic:** `dist/index.js` must not import `@nuxt/kit` (module is tree-shaken/separate entry). Task 10.
5. **Accessibility of new components:** `Spinner` status/label, `Avatar` accessible name, `Label`/`FormField` wiring, icon-only `Button` `aria-label`. Tests in Tasks 1, 5, 7, 8.

---

## Task 1: Form-field family (context, Label, FormField, FormDescription, FormMessage)

**Files:**
- Create: `src/lib/formField.ts`
- Create: `src/components/label/Label.vue`, `src/components/label/label.spec.ts`
- Create: `src/components/form-field/FormField.vue`, `FormDescription.vue`, `FormMessage.vue`, `src/components/form-field/form-field.spec.ts`
- Create: `docs/components/form-field.md` + `docs/.vitepress/theme/demos/form-field/*.vue`
- Modify: `src/index.ts`, `src/index.spec.ts`, `src/lib/docsCoverage.spec.ts`

**Interfaces:**
- Produces: `FormFieldContext`, `formFieldKey`, `useFormField()`; components `Label`, `FormField`, `FormDescription`, `FormMessage`.

- [ ] **Step 1: Write the failing specs**

`src/lib/formField.spec.ts` and `src/components/form-field/form-field.spec.ts` covering: `useFormField()` returns `null` with no provider; `FormField` generates an id and provides context; `Label` inside `FormField` gets `for` equal to the generated id; `FormDescription`/`FormMessage` render only when content exists; `Label.required` renders an accessible-hidden marker.

- [ ] **Step 2: Run them and confirm failure**

Run: `npx vitest run src/lib/formField.spec.ts src/components/form-field/form-field.spec.ts`
Expected: FAIL (modules missing).

- [ ] **Step 3: Implement `src/lib/formField.ts`**

```ts
import { inject, type ComputedRef, type InjectionKey } from 'vue'

export interface FormFieldContext {
  id: ComputedRef<string>
  describedBy: ComputedRef<string | undefined>
  invalid: ComputedRef<boolean>
  required: ComputedRef<boolean>
}
export const formFieldKey: InjectionKey<FormFieldContext> = Symbol('myghf-form-field')
export function useFormField(): FormFieldContext | null {
  return inject(formFieldKey, null)
}
```

- [ ] **Step 4: Implement `Label`, `FormField`, `FormDescription`, `FormMessage`**

- `Label.vue`: props `for?: string`, `required?: boolean`; `const field = useFormField()`; `const forId = computed(() => props.for ?? field?.id.value)`; renders `<label :for="forId" class="text-sm font-medium text-foreground text-start">` + slot + required marker `<span v-if="required" class="text-error-600" aria-hidden="true">*</span>`.
- `FormField.vue`: props `label?`, `description?`, `error?`, `required?`, `invalid?`, `id?`; call `useId()` once in setup (`const generatedId = useId()`), then `const fieldId = computed(() => props.id ?? generatedId)`; `invalid = computed(() => props.invalid ?? Boolean(props.error))`; `describedBy` joins `${fieldId}-description` / `${fieldId}-error` only when the corresponding content exists; `provide(formFieldKey, { id: fieldId, describedBy, invalid, required })`; renders label (prop or `label` slot via `Label`), default slot, then `FormDescription`/`FormMessage` when `description`/`error` or their slots exist.
- `FormDescription.vue`: props `id?: string`; renders `<p :id="id" class="text-sm text-muted"><slot /></p>`. `FormField` passes `:id="`${fieldId}-description`"` and renders it only when description content exists.
- `FormMessage.vue`: props `id?: string`; renders `<p :id="id" role="alert" class="text-sm text-error-600"><slot /></p>`, only when content exists.

Use `useId` from `vue` (Vue 3.5). Guard against `useId` absence only if needed (it is available).

- [ ] **Step 5: Run the specs, then typecheck**

Run: `npx vitest run src/lib/formField.spec.ts src/components/form-field/form-field.spec.ts src/components/label/label.spec.ts && npm run typecheck`
Expected: PASS.

- [ ] **Step 6: Export and document**

Add to `src/index.ts`: `Label`, `FormField`, `FormDescription`, `FormMessage`, and `useFormField` + types (`FormFieldContext`); add the runtime names to `EXPECTED` in `src/index.spec.ts`. Create `docs/components/form-field.md` (documenting `Label`/`FormField`/`FormDescription`/`FormMessage`/`useFormField`) with at least one live demo, and add `MAP` entries in `src/lib/docsCoverage.spec.ts` for the five new runtime exports → `components/form-field.md`.

- [ ] **Step 7: Full gate and commit**

Run: `npm run typecheck && npm test && npm run docs:build`

```bash
git add src/lib/formField.ts src/lib/formField.spec.ts src/components/label src/components/form-field src/index.ts src/index.spec.ts src/lib/docsCoverage.spec.ts docs/components/form-field.md docs/.vitepress/theme/demos/form-field
git commit -m "feat: add form-field family with context wiring"
```

---

## Task 2: `Input` native attributes + form-field wiring

**Files:**
- Modify: `src/components/input/Input.vue`
- Create: `src/components/input/input.spec.ts`
- Modify: `src/lib/docsCoverage.spec.ts` (none — `Input` already mapped)

**Interfaces:**
- Consumes: `useFormField` (Task 1).
- Produces: additive `Input` props `type`, `id`, `name`, `autocomplete`, `required`.

- [ ] **Step 1: Write the failing spec**

Cover: `type` defaults to `text` and is applied; `type="email"` applied; `id`/`name`/`autocomplete`/`required` forwarded; `required` reflected as the `required` attribute; inside a `FormField`, the input gets the generated `id`, `aria-describedby` (when description/error exist), `aria-invalid`, and `required`; an explicit `id` prop beats the context; outside a provider it renders as today (no `aria-*`).

- [ ] **Step 2: Run it and confirm failure** — `npx vitest run src/components/input/input.spec.ts`

- [ ] **Step 3: Implement**

Add the props (default `type: 'text'`). `const field = useFormField()`. Compute `id = props.id ?? field?.id.value`, `invalid = props.invalid ?? field?.invalid.value ?? false`, `required = props.required ?? field?.required.value ?? false`, `describedBy = field?.describedBy.value`. Bind `:id`, `:type`, `:name`, `:autocomplete`, `:required`, `:aria-invalid="invalid || undefined"`, `:aria-describedby="describedBy"` on the inner `<input>`; keep `v-bind="attrs"` last so consumer attrs still win. Do not change the wrapper/icon layout or sizing.

- [ ] **Step 4: Gate and commit**

Run: `npx vitest run src/components/input/input.spec.ts && npm run typecheck && npm test`

```bash
git add src/components/input
git commit -m "feat(Input): native type/attrs and form-field wiring"
```

---

## Task 3: `Textarea` auto-grow + form-field wiring

**Files:**
- Modify: `src/components/textarea/Textarea.vue`
- Create: `src/components/textarea/textarea.spec.ts`

**Interfaces:**
- Consumes: `useFormField` (Task 1).
- Produces: additive `Textarea` props `autoResize`, `maxRows`; form-field wiring.

- [ ] **Step 1: Write the failing spec**

Cover: `autoResize` adds `resize-none` and sets the element height from `scrollHeight` (mock `Object.defineProperty(el, 'scrollHeight', { value: 120 })` and stub `getComputedStyle` for `lineHeight`); height updates on input and when `modelValue` changes; `maxRows` caps the height; no provider ⇒ no `aria-*`; inside a `FormField` the `id`/`aria-describedby`/`aria-invalid`/`required` are applied; the component does not throw when `scrollHeight` is `0` (jsdom default).

- [ ] **Step 2: Run it and confirm failure** — `npx vitest run src/components/textarea/textarea.spec.ts`

- [ ] **Step 3: Implement**

Add `autoResize?: boolean` (default `false`) and `maxRows?: number`. Keep `rows` as the minimum. `const el = ref<HTMLTextAreaElement>()`. `resize()`: if `!autoResize || !el.value` return; set `el.value.style.height = 'auto'`; compute `next = el.value.scrollHeight`; if `maxRows`, cap at `maxRows * lineHeight` where `lineHeight = parseFloat(getComputedStyle(el.value).lineHeight) || 0`; set `height = next ? `${capped}px` : ''`. Call on `@input` (after emit) and in `watch(() => props.modelValue, resize, { flush: 'post' })`. Add `resize-none` and `overflow-y-auto` (when capped) to the class list. Form-field wiring mirrors Task 2. No listeners leak (nothing global added).

- [ ] **Step 4: Gate and commit**

Run: `npx vitest run src/components/textarea/textarea.spec.ts && npm run typecheck && npm test`

```bash
git add src/components/textarea
git commit -m "feat(Textarea): auto-grow and form-field wiring"
```

---

## Task 4: `Select` form-field wiring

**Files:**
- Modify: `src/components/select/Select.vue`
- Create: `src/components/select/select.spec.ts`

**Interfaces:**
- Consumes: `useFormField` (Task 1).

- [ ] **Step 1: Write the failing spec**

Cover: with a `FormField` ancestor, the `SelectTrigger` receives the generated `id`, `aria-describedby`, `aria-invalid`, and `required`; an explicit `invalid` prop beats context; no provider ⇒ unchanged output.

- [ ] **Step 2: Run it and confirm failure** — `npx vitest run src/components/select/select.spec.ts`

- [ ] **Step 3: Implement**

`const field = useFormField()`; compute `id`, `invalid`, `required`, `describedBy` as in Task 2; bind `:id`, `:aria-invalid="invalid || undefined"`, `:aria-describedby="describedBy"`, `:required` on `SelectTrigger` (which already binds `$attrs`).

- [ ] **Step 4: Gate and commit**

Run: `npx vitest run src/components/select/select.spec.ts && npm run typecheck && npm test`

```bash
git add src/components/select
git commit -m "feat(Select): form-field wiring"
```

---

## Task 5: `Spinner`

**Files:**
- Create: `src/components/spinner/Spinner.vue`, `src/components/spinner/spinner.spec.ts`
- Create: `docs/components/spinner.md` + `docs/.vitepress/theme/demos/spinner/*.vue`
- Modify: `src/index.ts`, `src/index.spec.ts`, `src/lib/docsCoverage.spec.ts`

**Interfaces:**
- Produces: `Spinner`.

- [ ] **Step 1: Write the failing spec** — `role="status"` + `aria-live="polite"`, an `sr-only` label with the default `Loading…` and a custom `label`, `tone="danger"` applies `text-error-500` (via `toneClasses.danger.icon`), size classes for `sm`/`lg`.

- [ ] **Step 2: Run it and confirm failure** — `npx vitest run src/components/spinner/spinner.spec.ts`

- [ ] **Step 3: Implement `Spinner.vue`**

```ts
const props = withDefaults(defineProps<{
  size?: 'sm' | 'default' | 'lg'
  label?: string
  tone?: Tone
}>(), { size: 'default', label: 'Loading…', tone: 'info' })
```
Render `<span role="status" aria-live="polite" :class="cn('inline-flex items-center', toneClasses[tone].icon)">` with `<Icon name="loader-circle" class="animate-spin" :size="iconSize" aria-hidden="true" />` and `<span class="sr-only">{{ label }}</span>`; sizes map to `size-4/5/6`.

- [ ] **Step 4: Gate, document, commit**

Run: `npx vitest run src/components/spinner/spinner.spec.ts && npm run typecheck && npm test && npm run docs:build`

Add `Spinner` to `src/index.ts` + `EXPECTED`; create `docs/components/spinner.md` + demo; add the `MAP` entry (`Spinner` → `components/spinner.md`).

```bash
git add src/components/spinner src/index.ts src/index.spec.ts src/lib/docsCoverage.spec.ts docs/components/spinner.md docs/.vitepress/theme/demos/spinner
git commit -m "feat: add Spinner"
```

---

## Task 6: `Skeleton`

**Files:**
- Create: `src/components/skeleton/Skeleton.vue`, `src/components/skeleton/skeleton.spec.ts`
- Create: `docs/components/skeleton.md` + demos
- Modify: `src/index.ts`, `src/index.spec.ts`, `src/lib/docsCoverage.spec.ts`

**Interfaces:**
- Produces: `Skeleton`.

- [ ] **Step 1: Write the failing spec** — `animate-pulse bg-surface-muted` present; `rounded` variants map to `rounded-*`; `width`/`height` become inline styles; a default slot replaces the bare block; attrs fall through.

- [ ] **Step 2: Run it and confirm failure** — `npx vitest run src/components/skeleton/skeleton.spec.ts`

- [ ] **Step 3: Implement `Skeleton.vue`**

`tv` base `animate-pulse bg-surface-muted`, `rounded` variant map; `<div :class="skeleton({ rounded })" :style="{ width, height }" v-bind="$attrs"><slot /></div>`.

- [ ] **Step 4: Gate, document, commit** (export + `EXPECTED` + `docs/components/skeleton.md` + `MAP` entry)

Run: `npx vitest run src/components/skeleton/skeleton.spec.ts && npm run typecheck && npm test && npm run docs:build`

```bash
git add src/components/skeleton src/index.ts src/index.spec.ts src/lib/docsCoverage.spec.ts docs/components/skeleton.md docs/.vitepress/theme/demos/skeleton
git commit -m "feat: add Skeleton"
```

---

## Task 7: `Avatar`

**Files:**
- Create: `src/components/avatar/Avatar.vue`, `src/components/avatar/avatar.spec.ts`
- Create: `docs/components/avatar.md` + demos
- Modify: `src/index.ts`, `src/index.spec.ts`, `src/lib/docsCoverage.spec.ts`

**Interfaces:**
- Produces: `Avatar`.

- [ ] **Step 1: Write the failing spec** — with `src` renders `<img :alt>`; `@error` falls back to initials; initials derived from `name` (`Magdi Yacoub` → `MY`, `Magdi` → `M`), `initials` overrides; fallback has `role="img"` + `aria-label`; size classes.

- [ ] **Step 2: Run it and confirm failure** — `npx vitest run src/components/avatar/avatar.spec.ts`

- [ ] **Step 3: Implement `Avatar.vue`**

`initials` computed: `props.initials ?? derive(props.name)` where `derive` trims, splits on whitespace, takes up to two words, first char uppercased, joined (single word → first char). `errored` ref reset by `watch(() => props.src)`. Sizes `sm/default/lg/xl` → `size-6 text-xs` / `size-8 text-sm` / `size-10 text-base` / `size-14 text-lg`. Image branch: `<img :src :alt class="… rounded-full object-cover" @error="errored = true" />`. Fallback: `<span role="img" :aria-label="alt ?? name ?? initials" :class="cn(sizeClass, toneClasses.info.soft, 'inline-flex items-center justify-center rounded-full font-medium')">{{ initials }}</span>`.

- [ ] **Step 4: Gate, document, commit** (export + `EXPECTED` + `docs/components/avatar.md` + `MAP` entry)

Run: `npx vitest run src/components/avatar/avatar.spec.ts && npm run typecheck && npm test && npm run docs:build`

```bash
git add src/components/avatar src/index.ts src/index.spec.ts src/lib/docsCoverage.spec.ts docs/components/avatar.md docs/.vitepress/theme/demos/avatar
git commit -m "feat: add Avatar"
```

---

## Task 8: `Button` icon affordances

**Files:**
- Modify: `src/components/button/Button.vue`
- Create: `src/components/button/button.spec.ts`

**Interfaces:**
- Produces: additive `Button` props `icon`, `iconTrailing`, `iconPos`.

- [ ] **Step 1: Write the failing spec**

Cover: leading `icon` renders an `Icon`; `iconTrailing` renders at the end; `iconPos="end"` moves `icon` to the end; `loading` keeps the label text visible, shows a spinning icon (`animate-spin`), sets `aria-busy="true"` and `data-loading`; `disabled`/`loading` disable the button; an icon-only `size="icon"` button forwards `aria-label`.

- [ ] **Step 2: Run it and confirm failure** — `npx vitest run src/components/button/button.spec.ts`

- [ ] **Step 3: Implement**

Add the three props (`iconPos` default `'start'`). Template order: leading icon (`loading` → `<Icon name="loader-circle" class="animate-spin" aria-hidden="true" />`, else `iconPos === 'start' && icon` → `<Icon :name="icon" aria-hidden="true" />`), then `<slot>{{ label }}</slot>`, then trailing (`iconTrailing` → `<Icon :name="iconTrailing" aria-hidden="true" />`, else `iconPos === 'end' && icon` → `<Icon :name="icon" aria-hidden="true" />`). Add `:aria-busy="loading || undefined"`. Keep `data-loading`, `isDisabled`, base classes, and sizes.

- [ ] **Step 4: Gate and commit**

Run: `npx vitest run src/components/button/button.spec.ts && npm run typecheck && npm test`

```bash
git add src/components/button
git commit -m "feat(Button): icon affordances and loading spinner"
```

---

## Task 9: DropdownMenu completeness

**Files:**
- Modify: `src/components/dropdown-menu/DropdownMenuItem.vue`
- Create: `src/components/dropdown-menu/DropdownMenuSeparator.vue`, `DropdownMenuLabel.vue`, `DropdownMenuGroup.vue`
- Create: `src/components/dropdown-menu/dropdown-menu.spec.ts`
- Modify: `src/index.ts`, `src/index.spec.ts`, `src/lib/docsCoverage.spec.ts`

**Interfaces:**
- Produces: `DropdownMenuSeparator`, `DropdownMenuLabel`, `DropdownMenuGroup`; additive `DropdownMenuItem` props `icon`, `disabled`.

- [ ] **Step 1: Write the failing spec** — item renders an `Icon` when `icon` is set; `disabled` forwards to the Reka item and suppresses the `select` event (emit from the Reka item directly, as jsdom can't synthesise the pointer events); Separator renders with `role="separator"`; Label renders muted classes; Group renders `role="group"`.

- [ ] **Step 2: Run it and confirm failure** — `npx vitest run src/components/dropdown-menu/dropdown-menu.spec.ts`

- [ ] **Step 3: Implement**

- `DropdownMenuItem`: props `variant`, `icon?`, `disabled?` (default `false`); `<RekaItem :disabled="disabled" :class="itemVariants({ variant })" @select="onSelect">` where `onSelect` emits only when `!disabled`; `<Icon v-if="icon" :name="icon" class="size-4 shrink-0" />` before `<slot />`.
- `DropdownMenuSeparator`: `<DropdownMenuSeparator class="my-1 h-px bg-border" />`.
- `DropdownMenuLabel`: `<DropdownMenuLabel class="px-2 py-1.5 text-xs font-medium text-muted" />`.
- `DropdownMenuGroup`: `<DropdownMenuGroup><slot /></DropdownMenuGroup>`.

- [ ] **Step 4: Gate, export, commit**

Add the three new components to `src/index.ts` + `EXPECTED`, and add `MAP` entries pointing to the existing `components/dropdown-menu.md` (which the docs task updates).

Run: `npx vitest run src/components/dropdown-menu/dropdown-menu.spec.ts && npm run typecheck && npm test`

```bash
git add src/components/dropdown-menu src/index.ts src/index.spec.ts src/lib/docsCoverage.spec.ts
git commit -m "feat(DropdownMenu): item icons/disabled, Separator, Label, Group"
```

---

## Task 10: Nuxt module + multi-entry build

**Files:**
- Create: `src/nuxt.ts`
- Modify: `vite.config.ts`, `package.json`, `package-lock.json`
- Create: `src/nuxt.spec.ts` (module-definition unit test)

**Interfaces:**
- Produces: `@myghf/ui/nuxt` module.

- [ ] **Step 1: Install `@nuxt/kit`**

Run: `npm install -D @nuxt/kit`
Expected: devDependency added; lockfile updated.

- [ ] **Step 2: Write `src/nuxt.ts`**

```ts
import { addComponent, createResolver, defineNuxtModule } from '@nuxt/kit'

export interface ModuleOptions {
  /** Auto-import the component exports. */
  autoImports?: boolean
  /** Optional prefix for auto-imported components. */
  prefix?: string
}

export default defineNuxtModule<ModuleOptions>({
  meta: { name: '@myghf/ui', configKey: 'myghfUi' },
  defaults: { autoImports: true, prefix: '' },
  setup(options, nuxt) {
    createResolver(import.meta.url)
    nuxt.options.build.transpile.push('@myghf/ui')
    nuxt.options.css.unshift('@myghf/ui/tokens.css')
    // Tailwind (provided by @nuxtjs/tailwindcss, which is not a dependency here)
    const tw = (nuxt.options as Record<string, unknown>).tailwindcss as
      | { config?: Record<string, unknown> }
      | undefined
    if (tw) {
      tw.config ??= {}
      const content = (tw.config.content as string[] | undefined) ?? []
      content.push('./node_modules/@myghf/ui/dist/**/*.js')
      tw.config.content = content
      const presets = (tw.config.presets as unknown[] | undefined) ?? []
      presets.push('@myghf/ui/tailwind-preset')
      tw.config.presets = presets
    }
    if (options.autoImports) {
      for (const name of AUTO_IMPORT_COMPONENTS) {
        addComponent({ name: `${options.prefix}${name}`, export: name, filePath: '@myghf/ui' })
      }
    }
  },
})
```

Export `AUTO_IMPORT_COMPONENTS` (the component export names) for reuse. `src/nuxt.spec.ts` asserts the module's `meta`/defaults (`autoImports: true`, `prefix: ''`) without a Nuxt runtime.

> Tailwind presets: Tailwind accepts a preset **object**; pushing the string path only works if Tailwind resolves it. If the build check shows it unresolved, change to `presets.push((await import('@myghf/ui/tailwind-preset')).default)` inside `setup` (make `setup` async) — verify in Step 5.

- [ ] **Step 3: Multi-entry build**

`vite.config.ts`: `build.lib.entry = { index: resolve(import.meta.dirname, 'src/index.ts'), nuxt: resolve(import.meta.dirname, 'src/nuxt.ts') }`, `fileName: (_format, entryName) => `${entryName}.js``, and add `'@nuxt/kit'` to `rollupOptions.external`.

- [ ] **Step 4: `package.json` exports + optional peer**

Add:
```json
"./nuxt": { "types": "./dist/nuxt.d.ts", "import": "./dist/nuxt.js" }
```
and `peerDependenciesMeta: { "@nuxt/kit": { "optional": true } }` with `"@nuxt/kit": ">=3.0.0"` in `peerDependencies` (do not remove the existing peers).

- [ ] **Step 5: Gate and verify the build artifacts**

Run: `npx vitest run src/nuxt.spec.ts && npm run typecheck && npm test && npm run build`
Then verify: `dist/nuxt.js`, `dist/nuxt.d.ts`, `dist/index.js`, `dist/index.d.ts` exist; `grep -c "@nuxt/kit" dist/index.js` is `0` (core entry stays framework-agnostic). If the Tailwind preset string does not resolve, switch to the imported-object approach above and re-run `npm run build`.

- [ ] **Step 6: Commit**

```bash
git add src/nuxt.ts src/nuxt.spec.ts vite.config.ts package.json package-lock.json
git commit -m "feat: add optional Nuxt module and multi-entry build"
```

---

## Task 11: Documentation — new pages wiring and updates

**Files:**
- Create: `docs/guide/nuxt.md`
- Modify: `docs/components/{button,input,textarea,dropdown-menu}.md`, `docs/components/index.md`, `docs/.vitepress/config.ts` (sidebar/nav)
- Create: `docs/.vitepress/theme/demos/nuxt/*.vue` (if a demo helps)

**Interfaces:**
- Consumes: all components above; the docs demo pattern.

- [ ] **Step 1: Update the changed component pages**

- `button.md`: add `icon`/`iconTrailing`/`iconPos` to the props table and a live example; document the loading behaviour (label stays, leading spinner, `aria-busy`).
- `input.md`: add `type`/`id`/`name`/`autocomplete`/`required`; document form-field wiring.
- `textarea.md`: add `autoResize`/`maxRows`; document the `rows` minimum and form-field wiring.
- `dropdown-menu.md`: document item `icon`/`disabled` and the new `DropdownMenuSeparator`/`DropdownMenuLabel`/`DropdownMenuGroup`.

- [ ] **Step 2: Add the Nuxt guide**

`docs/guide/nuxt.md`: installing `@nuxt/kit`, adding `@myghf/ui/nuxt` to `modules`, the `myghfUi` config (`autoImports`, `prefix`), what the module wires (transpile, tokens css, Tailwind content/preset), and that it is a no-op for non-Nuxt consumers.

- [ ] **Step 3: Wire the sidebar/nav and components index**

Add `Spinner`, `Skeleton`, `Avatar`, `Form field` to the appropriate sidebar groups; add `Nuxt` under Guide; add the new pages to `docs/components/index.md` (only pages that exist).

- [ ] **Step 4: Build and commit**

Run: `npm run docs:build`
Expected: PASS, no dead links.

```bash
git add docs
git commit -m "docs: document new primitives and the Nuxt module"
```

---

## Task 12: Changeset and final verification

**Files:**
- Create: `.changeset/*.md` (minor)

- [ ] **Step 1: Add the minor changeset**

Run: `npx changeset --minor @myghf/ui -m "feat: add Spinner, Skeleton, Avatar, form-field family, Button icons, DropdownMenu completion, Input/Textarea enhancements, and an optional Nuxt module"`

- [ ] **Step 2: Full gate**

Run: `npm run typecheck && npm test && npm run build && npm run docs:build`
Expected: PASS. Confirm `dist/nuxt.js` + `dist/nuxt.d.ts` exist and `dist/index.js` contains no `@nuxt/kit` import.

- [ ] **Step 3: Confirm no PrimeIcons handling**

Run: `grep -rin --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=.git "primeicons\|pi pi-\|primeicon" src docs || echo "clean"`
Expected: `clean`.

- [ ] **Step 4: Commit**

```bash
git add .changeset
git commit -m "chore: add minor changeset for the new primitives"
```

---

## Self-review notes

- **Spec coverage:** Task 1 → §5.7; Tasks 2–4 → §5.5/§5.6/§5.7 wiring; Task 5 → §5.1; Task 6 → §5.2; Task 7 → §5.8; Task 8 → §5.3; Task 9 → §5.4; Task 10 → §5.9 + packaging; Task 11 → §8; Task 12 → §9 + acceptance criteria. Every deliverable maps to a task.
- **Review Focus:** each of the five lines has a concrete check in its owning task (regression tests, jsdom scrollHeight mock, build-artifact check, `@nuxt/kit` grep, a11y tests).
- **Coverage-guard coupling:** every task adding a runtime export also creates its docs page and `MAP` entry, so `npm test` stays green per task.
- **Type consistency:** `useFormField`/`FormFieldContext` (Task 1) are consumed unchanged by Tasks 2–4; `Tone`/`toneClasses` are reused by Spinner and Avatar; `Icon` is reused by Spinner/Button/DropdownMenuItem.
