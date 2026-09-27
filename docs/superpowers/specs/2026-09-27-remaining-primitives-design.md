# Remaining Primitives & Components — Design Spec

- **Date:** 2026-09-27
- **Status:** Approved (pending written-spec review)
- **Package:** `@myghf/ui`
- **Scope:** Spinner, Skeleton, Button icon affordances, DropdownMenu completeness, Input native attrs,
  Textarea auto-grow, the form-field family, Avatar, and an optional Nuxt module

## 1. Context

`@myghf/ui` is the MYGHF shared Vue 3 + Reka UI + Tailwind 3 design system. An audit of v0.3.0 for
the **AHC Auditorium** app (Nuxt 4 + PrimeVue, being migrated) found components/behaviours the
library lacks. This change adds them without breaking existing public APIs.

Conventions to follow exactly: `<script setup lang="ts">`, `tailwind-variants` (`tv`) for variant
maps, `cn()` for class merging, Reka UI primitives, `Icon`/lucide for icons, tokens-only styling.

## 2. Goals

1. `Spinner` and `Skeleton` loading primitives.
2. `Button` icon affordances (`icon`, `iconTrailing`, `iconPos`) and a leading spinner while loading.
3. Complete `DropdownMenu` (item icons/disabled, Separator, Label, Group).
4. `Input` native `type` + form attributes.
5. `Textarea` auto-grow.
6. A form-field family (`Label`, `FormField`, `FormDescription`, `FormMessage`, `useFormField`) that
   auto-wires `for`/`id`/`aria-describedby`/`aria-invalid`/`required`.
7. `Avatar` with initials fallback.
8. An optional Nuxt module exported at `@myghf/ui/nuxt`.
9. Tests, docs pages, and a `minor` changeset for all of the above.

## 3. Non-goals

- **No PrimeIcons (`pi pi-*`) support or primeicons→lucide name mapping.** Consumers pass lucide names.
- No changes to existing public APIs beyond additive props (extend, never break).
- No new runtime dependencies; `@nuxt/kit` is an optional peer (+ devDependency for our own build).
- No Storybook; docs stay in VitePress.

## 4. Decisions (confirmed)

| Topic | Decision |
| --- | --- |
| Nuxt auto-import | **On by default** (`autoImports: true`), disable via module option. |
| Button `loading` | Keep the **label visible**; show a leading spinning `LoaderCircle` (replaces the leading icon). |
| Avatar initials | First letters of **up to two words** (`Magdi Yacoub` → `MY`; `Magdi` → `M`); `initials` overrides. |
| Form-field precedence | Explicit component props win over the `FormField` context; no provider ⇒ today's behaviour. |
| `Icon` rendering | Icons use the existing `Icon` component (lucide names); `animate-spin` is passed as a class. |

## 5. Deliverables

### 5.1 `Spinner` (`src/components/spinner/Spinner.vue` → `Spinner`)

- Props: `size?: 'sm' | 'default' | 'lg'` (default `'default'`), `label?: string` (default
  `"Loading…"`), `tone?: Tone` (default `'info'`).
- Renders `<span role="status" aria-live="polite">` containing a lucide `LoaderCircle`
  (`animate-spin`, `aria-hidden`) and an `sr-only` `<span>{{ label }}</span>`.
- Colour from `toneClasses[tone].icon` (default `text-primary-500`); sizes `size-4` / `size-5` /
  `size-6`. No hex; inherits `currentColor` otherwise.

### 5.2 `Skeleton` (`src/components/skeleton/Skeleton.vue` → `Skeleton`)

- Props: `rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full'` (default `'md'`), `width?: string`,
  `height?: string`.
- Renders `<div class="animate-pulse bg-surface-muted" :class="roundedClass" :style="{ width, height }" v-bind="$attrs">`
  with a `default` slot that overrides the bare block (empty div = the placeholder).
- Rounded map: `none` → `''`, `sm` → `rounded-sm`, `md` → `rounded-md`, `lg` → `rounded-lg`,
  `full` → `rounded-full`.

### 5.3 `Button` extensions (`src/components/button/Button.vue`)

Additive props: `icon?: string`, `iconTrailing?: string`, `iconPos?: 'start' | 'end'` (default
`'start'`). Existing props/defaults unchanged.

- Leading slot content: when `loading` → `<Icon name="loader-circle" class="animate-spin" aria-hidden />`;
  else when `iconPos === 'start'` and `icon` → `<Icon :name="icon" aria-hidden />`.
- Trailing: when `iconTrailing` → `<Icon :name="iconTrailing" aria-hidden />`; else when
  `iconPos === 'end'` and `icon` → trailing `<Icon :name="icon" aria-hidden />`.
- Label stays visible during loading (`<slot>{{ label }}</slot>`), `aria-busy="true"` while loading,
  `data-loading` retained. `isDisabled` still true while loading.
- Icon-only sizes (`icon`, `icon-sm`) unchanged; `aria-label` continues to pass through `$attrs`.
- Base keeps `[&_svg]:size-4`.

### 5.4 DropdownMenu completeness (`src/components/dropdown-menu/`)

- `DropdownMenuItem`: add `icon?: string` and `disabled?: boolean` (default `false`). Render
  `<Icon v-if="icon" :name="icon" class="size-4 shrink-0" />` before the slot; forward
  `:disabled="disabled"` to Reka's item; guard `select` so it is not emitted when disabled. Keep
  `variant`.
- `DropdownMenuSeparator.vue`: Reka `DropdownMenuSeparator`, `class="my-1 h-px bg-border"`,
  `role="separator"`.
- `DropdownMenuLabel.vue`: Reka `DropdownMenuLabel`, `class="px-2 py-1.5 text-xs font-medium text-muted"`.
- `DropdownMenuGroup.vue`: Reka `DropdownMenuGroup` (role `group`).
- Export all four new pieces (plus the existing three) from `src/index.ts`.

### 5.5 `Input` native attributes (`src/components/input/Input.vue`)

Additive props: `type?: string` (default `'text'`), `id?: string`, `name?: string`,
`autocomplete?: string`, `required?: boolean`. Bind to the inner `<input>`; keep the wrapper,
leading/trailing icons, sizing, and `$attrs` fallthrough unchanged. Native types
(`email`/`search`/`tel`/`url`/`date`/`time`/`datetime-local`) work as-is.

### 5.6 `Textarea` auto-grow (`src/components/textarea/Textarea.vue`)

Additive props: `autoResize?: boolean` (default `false`), `maxRows?: number`.

- `rows` remains the minimum height.
- When `autoResize`, set height to `scrollHeight` on input and whenever `modelValue` changes; add
  `resize-none`; when `maxRows` is set, cap height at `maxRows ×` the computed line-height and set
  `overflow-y: auto`.
- Recompute on `modelValue` change via `watch`; remove listeners/timers on unmount.

### 5.7 Form-field family

**Context (`src/lib/formField.ts`)** — exported:

```ts
export interface FormFieldContext {
  id: ComputedRef<string>
  describedBy: ComputedRef<string | undefined> // joins the description/error ids that exist
  invalid: ComputedRef<boolean>
  required: ComputedRef<boolean>
}
export const formFieldKey: InjectionKey<FormFieldContext>
export function useFormField(): FormFieldContext | null // null when no provider
```

**`Label.vue`** (`src/components/label/` → `Label`): props `for?: string`, `required?: boolean`;
renders `<label>` with `text-sm font-medium text-foreground text-start`; `for` falls back to the
context `id`; `required` renders an `aria-hidden` marker (`*`).

**`FormField.vue`** (`src/components/form-field/` → `FormField`): props `label?`, `description?`,
`error?`, `required?`, `invalid?`, `id?`. Generates a stable id (Vue `useId`) when absent; provides
the context; `invalid` defaults to `Boolean(error)`. Slots: `default`, `label`, `description`,
`error`. Renders the label, the default slot, and — only when content exists — the description and
error via `FormDescription`/`FormMessage`.

**`FormDescription.vue`** → `FormDescription`: `<p :id class="text-sm text-muted">`; renders only
when the slot/prop has content; uses the context `descriptionId`.

**`FormMessage.vue`** → `FormMessage`: `<p :id role="alert" class="text-sm text-error-600">`;
renders only when content exists; uses the context `errorId`.

**Wiring:** `Input`, `Textarea`, and `Select` call `useFormField()` and apply, with **explicit props
winning**: `id` (prop ?? context), `aria-describedby` (context `describedBy`), `aria-invalid`
(`invalid` prop ?? context), `required` (prop ?? context). With no provider they behave exactly as
today. `Select` applies these to its `SelectTrigger`.

### 5.8 `Avatar` (`src/components/avatar/Avatar.vue` → `Avatar`)

Props: `src?: string`, `alt?: string`, `name?: string`, `initials?: string`,
`size?: 'sm' | 'default' | 'lg' | 'xl'` (default `'default'`).

- Initials: `initials` prop, else derived from `name` (first letters of up to two words, uppercased;
  single word → first letter).
- With a working `src`: `<img :src :alt class="… object-cover rounded-full">`; on `@error` fall back
  to initials.
- Fallback: `<span role="img" :aria-label="alt ?? name ?? initials">` with initials, using
  `toneClasses.info.soft` (token colours) and `rounded-full font-medium`.
- Sizes: `sm` → `size-6 text-xs`, `default` → `size-8 text-sm`, `lg` → `size-10 text-base`,
  `xl` → `size-14 text-lg`.

### 5.9 Nuxt module (`src/nuxt.ts` → `@myghf/ui/nuxt`)

`defineNuxtModule` from `@nuxt/kit`, `meta.configKey = 'myghfUi'`, defaults
`{ autoImports: true, prefix: '' }`. In `setup`:

- `nuxt.options.build.transpile.push('@myghf/ui')`.
- `nuxt.options.css.unshift('@myghf/ui/tokens.css')`.
- Tailwind (alongside `@nuxtjs/tailwindcss`): append `./node_modules/@myghf/ui/dist/**/*.js` to the
  Tailwind `content` array and push the imported `@myghf/ui/tailwind-preset` object into `presets`.
  Access the Tailwind options defensively (the key comes from `@nuxtjs/tailwindcss`, which is not a
  dependency of this package).
- When `autoImports` is true, register the component exports via `addComponent` (named exports from
  `@myghf/ui`).
- The module is a no-op for non-Nuxt consumers (it is only loaded via `@myghf/ui/nuxt`).

**Packaging:** `vite.config.ts` becomes a multi-entry lib build
(`{ index: src/index.ts, nuxt: src/nuxt.ts }`, `fileName: (f, name) => `${name}.js``,
`external` gains `@nuxt/kit`); `vite-plugin-dts` emits `dist/index.d.ts` and `dist/nuxt.d.ts`.
`package.json` adds a `"./nuxt"` export (`types` + `import`) and `@nuxt/kit` as a devDependency and
an **optional** peer (`peerDependenciesMeta`).

## 6. Cross-cutting requirements

- **Tokens only** — no hex; use `--myghf-*`/Tailwind classes and `toneClasses`.
- **Dark mode** — every new component correct under `.dark`; add `dark:` where the token layer is
  insufficient.
- **RTL** — logical utilities (`ps/pe/ms/me/start/end`, `text-start/end`) and `rtl:` for directional
  icons; no physical `left/right`.
- **Accessibility** — correct roles/`aria-*`, `focus-visible:ring-primary-500`, keyboard support,
  disabled/loading states.
- **Exports** — add all values and types to `src/index.ts`; types resolve from `dist/*.d.ts`.
- **Styling API** — `tv` for variant maps, `cn()` for consumer classes.

## 7. Tests

Vitest + `@vue/test-utils` (+ jsdom where needed), colocated `*.spec.ts`, following existing
patterns (assert DOM/attributes; listener spies rather than `emitted()`). Coverage:

- `Spinner`: role/`aria-live`, sr-only label, `tone` colour class, sizes.
- `Skeleton`: rounded variants, width/height style, `animate-pulse bg-surface-muted`, slot override.
- `Button`: leading/trailing icons, `iconPos`, loading keeps label + `aria-busy`, icon-only size.
- `DropdownMenuItem`: icon render, `disabled` forwards and suppresses `select`; Separator/Label/Group
  render with expected classes/roles.
- `Input`: `type` applied, native attrs forwarded, form-field wiring.
- `Textarea`: `autoResize` sets height from `scrollHeight` (mock `scrollHeight`; jsdom has no layout),
  `maxRows` cap, cleanup on unmount.
- Form field: `FormField` generates/provides ids; `Label` `for`; `Input`/`Textarea`/`Select` receive
  `id`/`aria-describedby`/`aria-invalid`/`required`; explicit props win; no-provider parity.
- `Avatar`: `img` with `alt`, initials derivation, error fallback, sizes.
- `nuxt`: module defaults/options exported (unit-level import of the module definition; no Nuxt
  runtime needed).

## 8. Documentation

New VitePress pages: `components/spinner`, `components/skeleton`, `components/avatar`,
`components/form-field` (covering `Label`/`FormDescription`/`FormMessage`/`useFormField`), and a
Nuxt integration page (`guide/nuxt`). Updates: `components/button` (icons/loading),
`components/input` (native attrs + form field), `components/textarea` (auto-grow),
`components/select` (form-field wiring: `id`/`required` props, `aria-invalid`/`aria-required`, corrected
"invalid is visual-only" wording), and `components/dropdown-menu` (icon/disabled/Separator/Label/Group).
Update `components/index.md` and the sidebar/nav. Each page follows the existing template (overview → examples → props → events →
slots → a11y → dark/RTL) with live `<Demo>` examples.

## 9. Release

One `minor` changeset describing the additions. No `major` (no breaking changes). Update `README.md`
only if the component list changes materially (optional).

## 10. Risks & mitigations

| Risk | Mitigation |
| --- | --- |
| Multi-entry lib build + dts emits a broken `./nuxt` entry | Configure entries explicitly and assert `dist/nuxt.js` + `dist/nuxt.d.ts` in the build check. |
| `@nuxt/kit` version drift (Nuxt 4) | Optional peer with a permissive range; devDependency for our build; the module is tree-shaken out of the core entry. |
| Tailwind preset injection needs the preset object, not a string | Import `@myghf/ui/tailwind-preset` at module build time and push the object; access `@nuxtjs/tailwindcss` options defensively. |
| `Textarea` auto-grow is unmeasurable in jsdom | Mock `scrollHeight`/`getComputedStyle` in tests; guard for `textareaRef` absence. |
| Form-field wiring could regress existing components | Explicit props win; `useFormField()` returns `null` without a provider; keep existing specs green. |
| `erasableSyntaxOnly` / `noUnusedLocals` strictness | No enums/parameter properties; keep imports used. |

## 11. Acceptance criteria

1. `npm run typecheck` passes.
2. `npm test` passes, with new specs for every new component/prop.
3. `npm run build` emits the new components plus `dist/nuxt.js`/`dist/nuxt.d.ts`, and `package.json`
   exposes `./nuxt`.
4. Every new component has a docs page; updated pages reflect the new props; sidebar/index updated.
5. A `minor` changeset exists.
6. No `pi pi-*`/PrimeIcons handling anywhere.
