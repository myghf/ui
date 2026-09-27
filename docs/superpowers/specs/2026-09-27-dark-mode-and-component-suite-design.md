# Dark Mode + Component Suite — Design Spec

- **Date:** 2026-09-27
- **Status:** Approved (pending written-spec review)
- **Package:** `@myghf/ui`
- **Scope:** Dark theming, Toaster/useToast, Alert/Message, InputNumber, Drawer, DatePicker i18n/time options

## 1. Context

`@myghf/ui` is the shared Vue 3 design system for MYGHF / Aswan Heart Centre applications.
It is Tailwind-based, tree-shakeable, bilingual (English/Arabic, RTL), and built on reka-ui
primitives styled with `tailwind-variants`. Design tokens live in `src/tokens.css` and are exposed
to Tailwind through `src/tailwindPreset.js`. Brand rules live in `DESIGN.md`.

The library currently ships only light values: `:root` defines the semantic layer
(`--myghf-background`, `--myghf-foreground`, `--myghf-surface`, `--myghf-surface-muted`,
`--myghf-border`, `--myghf-muted`) and the brand scales (`primary`, `secondary`, `success`,
`warning`, `error`, `info`, each `50`–`900`). The preset declares no `darkMode`, and components are
authored against light surfaces.

The installed reka-ui (2.10.5, satisfying the `^2.2.0` peer range) already provides `Toast*`,
`Drawer*`, `NumberField*`, and `Dialog*` primitives, plus `@internationalized/number` and
`@internationalized/date` (3.12.4) transitively. Building on those follows the existing
`Dialog.vue` precedent.

## 2. Goals

1. Ship a dark token set with a documented dark selector, enable `darkMode` in the preset, and give
   every component variant dark values.
2. Add `<Toaster>` + `useToast()` with severity, title/description, duration, position,
   stack/queue, and dismiss.
3. Add `<Alert>` / `<Message>` reusing Tag's tones, with optional icon, closable, auto-dismiss.
4. Add `<InputNumber>` with numeric v-model, min/max/step, integer, format, and locale.
5. Add `<Drawer>` with position, backdrop, close-on-escape/outside, header/footer slots, and
   controlled open.
6. Add `hourFormat="24"`, `minuteStep`, and full i18n/RTL to `DatePicker` (labels + locale-aware
   formatting).
7. Bonus: a `useTheme` composable and a `ThemeToggle` helper.

## 3. Non-goals

- No breaking changes to existing exports, props, events, or tokens.
- No logo component (per `DESIGN.md`).
- No new brand hues; dark mode only remaps the semantic layer and tints existing scales.
- No changes to the release/CI workflow; Changesets still owns versioning.
- No Storybook/docs site; documentation stays in `README.md` and `DESIGN.md`.

## 4. Decisions (confirmed)

| Topic | Decision |
| --- | --- |
| Public API target | Fresh, idiomatic Vue 3 APIs (not PrimeVue parity). |
| Dark activation | System preference as initial default, explicit override persisted to `localStorage`, SSR-safe, both `.dark` and `data-theme="dark"` selectors. No live OS-follow after an explicit choice. |
| Toast store | provide/inject via `<Toaster>`; `useToast()` is setup-only. |
| Dark delivery | Hybrid (Approach C): dark token overrides for the neutral/semantic layer + targeted `dark:` variant classes for brand-tinted surfaces. |
| Delivery structure | One spec, one implementation plan, one PR, one `minor` changeset. |

## 5. Architecture

### 5.1 Theming layers

1. **Semantic token layer** — `:root` (light) and `[data-theme="dark"], .dark` (dark) define the
   same set of `--myghf-*` variables. Every component that styles with semantic utilities
   (`bg-surface`, `text-foreground`, `border-border`, `bg-surface-muted`, `text-muted`) adapts
   automatically and needs no per-component edit.
2. **Brand-tint layer** — components that use light brand tints (`bg-primary-100`,
   `bg-success-100`, etc.) receive explicit `dark:` variants because those tints are unreadable on
   dark surfaces.
3. **Consumer override layer** — consumers may override dark values by re-declaring the same
   variables under their own `.dark` / `[data-theme="dark"]` block after importing `tokens.css`.
   `useTheme` only toggles selectors; it never writes token values.

### 5.2 Shared tone map

Extract the Tag tone → class map into `src/lib/tones.ts`:

```ts
export type Tone = 'info' | 'success' | 'warning' | 'danger' | 'secondary'

export interface ToneClasses {
  soft: string    // tinted background + readable foreground
  outline: string // border + readable foreground
  icon: string    // text color for a leading icon
  role: 'alert' | 'status'
}

export const toneClasses: Record<Tone, ToneClasses> = { /* light + dark classes */ }
```

`Tag`, `Alert`/`Message`, and `Toast` consume `toneClasses`. `Tag` uses only `soft` and `icon`
today; `outline` and `role` are for Alert/Toast. `TagTone` is redefined as `Tone` while keeping the
existing export name so consumers' imports keep working.

## 6. Feature 1 — Dark mode

### 6.1 `src/tokens.css`

Add a dark block immediately after `:root`:

```css
[data-theme='dark'],
.dark {
  color-scheme: dark;

  /* surfaces (dark) */
  --myghf-background: 15 18 23;         /* #0f1217 */
  --myghf-foreground: 243 244 246;      /* #f3f4f6 */
  --myghf-surface: 26 30 37;            /* #1a1e25 */
  --myghf-surface-muted: 39 44 53;      /* #272c35 */
  --myghf-border: 55 61 71;             /* #373d47 */
  --myghf-muted: 156 163 175;           /* #9ca3af */
}
```

Only the semantic layer is remapped; the brand scales are unchanged. All values must pass WCAG AA
against `--myghf-surface` (body 4.5:1) before merge; `--myghf-muted` is verified as secondary text
(≈6.6:1) and `--myghf-foreground` as body text (≈15:1). `--myghf-border` is non-text and exempt.

### 6.2 `src/tailwindPreset.js`

Add a top-level key (outside `theme`):

```js
export default {
  darkMode: ['class', '.dark'],
  theme: { /* unchanged */ },
}
```

Implementation note (verified empirically on Tailwind 3.4): a comma-separated selector such as
`['selector', '.dark, [data-theme="dark"]']` generates
`:is(.dark, [data-theme="dark"], .dark, [data-theme="dark"] *)` — the descendant wildcard is only
appended to the last comma-item, so descendants of `.dark` would not match and `dark:` utilities
would silently fail. The canonical `['class', '.dark']` generates `:is(.dark *)` and is therefore
required. `[data-theme="dark"]` remains a supported, documented alias **for the token block only**;
`useTheme` applies both `.dark` and `data-theme="dark"` by default so both mechanisms work together.
Consumers who set `data-theme="dark"` by hand get token theming but not `dark:` utilities — this
caveat is documented in the README.

### 6.3 `src/lib/theme.ts` — `useTheme`

Client-only module singleton. SSR-safe: no `window`/`document` access at module load; all DOM work
is guarded and deferred to the first call on the client.

```ts
export type ThemeMode = 'light' | 'dark' | 'system'

export interface UseThemeOptions {
  storageKey?: string          // default 'myghf-theme'
  attribute?: 'both' | 'class' | 'data-theme' // default 'both'
  defaultMode?: ThemeMode      // default 'system'
}

export interface UseThemeReturn {
  mode: Ref<ThemeMode>             // explicit choice, incl. 'system'
  resolved: ComputedRef<'light' | 'dark'>
  isDark: ComputedRef<boolean>
  setMode(mode: ThemeMode): void
  toggle(): void
  enable(): void   // set 'dark'
  disable(): void  // set 'light'
  reset(): void    // set 'system' and clear storage
}

export function useTheme(options?: UseThemeOptions): UseThemeReturn
export function createTheme(options?: UseThemeOptions): UseThemeReturn
```

`createTheme()` builds an independent controller (used directly and by tests); `useTheme()` lazily
builds one shared instance on first call and returns it thereafter.

Behavior:
- Initial `mode` = stored value if valid, else `defaultMode`.
- `resolved` = `mode === 'system' ? systemPreference : mode`.
- Applying a theme writes to `<html>`: with `attribute = 'both'` (default) it sets/removes **both**
  `.dark` and `data-theme="dark"`; `'class'` or `'data-theme'` writes only that mechanism.
- `setMode` persists non-`system` values to `localStorage`; `system` and `reset` remove the key.
- OS preference is read from `window.matchMedia('(prefers-color-scheme: dark)')` at resolution time
  only; no listener is attached after an explicit choice (matches the confirmed decision).
- Multiple `useTheme()` calls return the same singleton state. Options are read on the first call;
  later calls return the existing instance and ignore new options (a dev-mode warning is emitted if
  the options differ).

### 6.4 `ThemeToggle.vue`

Accessible icon button rendered from `src/components/theme-toggle/ThemeToggle.vue`, using
`useTheme().toggle()`. Props: `size` (`sm|default|lg`), `label` (default `'Toggle theme'`).
Renders `Moon` when light and `Sun` when dark; sets `aria-label` and `aria-pressed`.

### 6.5 Per-component dark audit

Every component is audited. Neutral components need no edit; tinted/edge cases get `dark:` classes:

| Component | Dark change |
| --- | --- |
| `Button` | `dark:focus-visible:ring-offset-background`; verify hover steps on dark |
| `Tag` | tone map gains dark tint classes (via `lib/tones.ts`) |
| `Input` / `Textarea` / `Password` | token-driven; verify placeholder + invalid on dark |
| `Checkbox` | token-driven; verify checked/unchecked borders |
| `Select` / `SelectButton` | token-driven; verify open/selected states |
| `DatePicker` | selected cell stays `bg-primary-500 text-white`; hover/range tints get dark variants |
| `Dialog` | overlay `dark:bg-black/70`; surface tokens otherwise |
| `DropdownMenu` | surface/border tokens; verify hover |
| `Tabs` | verify active/hover indicators on dark |
| `Table` / `DataTable` | border/hover tokens; verify zebra/empty states |
| `TransferList` / `TreeTable` / `TreeSelect` | token-driven; verify selection tints |
| `Toaster` / `Alert` | tone map dark classes |
| `InputNumber` / `Drawer` | authored dark-ready from the start |

## 7. Feature 2 — Toaster + useToast

New `src/components/toast/` directory.

### 7.1 `Toaster.vue`

Provider + viewports, built on reka `ToastProvider`, `ToastRoot`, `ToastTitle`,
`ToastDescription`, `ToastClose`, `ToastViewport`, `ToastAction`, `ToastPortal`.

- Props: `position` (default `'top-end'`), `max` (default `4`), `duration` (default `5000`), `gap`
  (default `'0.5rem'`).
- Creates the reactive queue and `provide()`s it; `useToast()` injects it.
- Renders one `ToastViewport` per distinct position group so an individual toast's `position`
  overrides the provider default. Positions are logical:
  `top-start | top-center | top-end | bottom-start | bottom-center | bottom-end`.
- Each viewport is `:dir`-agnostic (logical classes `start-*`/`end-*`), labelled via
  `aria-label` (default `'Notifications'`).
- Toasts stack up to `max`; overflow waits in a FIFO queue and enters as visible toasts dismiss.
- Auto-dismiss after `duration` (0 = persistent); dismissal is pausable on hover/focus.
- Close button always available; swipe-to-dismiss from reka.

### 7.2 `useToast.ts`

```ts
export type ToastSeverity = 'info' | 'success' | 'warning' | 'danger' | 'secondary'
export type ToastPosition =
  | 'top-start' | 'top-center' | 'top-end'
  | 'bottom-start' | 'bottom-center' | 'bottom-end'

export interface ToastOptions {
  title?: string
  description?: string
  severity?: ToastSeverity      // default 'info'
  duration?: number             // ms; 0 = persistent; default from Toaster
  position?: ToastPosition      // overrides Toaster default
  closable?: boolean            // default true
  icon?: string                 // optional icon name override
  action?: { label: string; onClick: () => void }
}

export interface ToastItem extends ToastOptions { id: string }

export interface ToastStore extends ToastApi {
  items: Ref<ToastItem[]>
  visible: ComputedRef<ToastItem[]> // items capped at max, in insertion order
  add(options: ToastOptions): string
  remove(id: string): void
  clear(): void
  success(title: string, description?: string): string
  info(title: string, description?: string): string
  warning(title: string, description?: string): string
  danger(title: string, description?: string): string
  secondary(title: string, description?: string): string
}

export interface ToastStoreOptions {
  max?: number          // default 4
  duration?: number     // default 5000
  position?: ToastPosition // default 'top-end'
}

export function createToastStore(options?: ToastStoreOptions): ToastStore
export function useToast(): ToastStore
```

- `createToastStore(options?)` is the injectable store factory; `Toaster` calls it and `provide()`s
  the result, and `useToast()` `inject()`s it (throwing a clear error when no `<Toaster>` is
  mounted upstream). The factory is exported so specs can exercise ordering/queueing without a DOM.
- `add()` returns a generated id and applies defaults from `Toaster` props.
- Reka's `ToastRoot` owns the dismiss timer, pause/resume, and swipe gestures; the store owns
  ordering, the `max` cap, and removal. A toast's `duration` (0 = persistent) is forwarded to
  `ToastRoot`, which overrides the `ToastProvider` default.
- Severity drives reka's `type` (`foreground` for `danger`/`warning`, else `background`) and the
  tone classes; reka renders the `aria-live` announcements.

## 8. Feature 3 — Alert / Message

New `src/components/alert/Alert.vue`.

- Props: `tone` (default `'info'`), `title`, `description`, `icon` (optional; tone default when
  `showIcon`), `showIcon` (default false), `closable` (default false), `duration` (ms; 0/undefined
  = no auto-dismiss), `variant` (`'soft'` default | `'outline'`).
- Slots: default, `title`, `description`, `icon`, `actions`, `close`.
- Emits: `close`.
- Behavior: auto-dismiss timer starts on mount when `duration > 0`, pauses on hover/focus, clears
  on unmount; `closable` renders a close button.
- Accessibility: `role="alert"` for `danger`/`warning`, else `role="status"`; close button labelled
  `Close` (overridable via `closeLabel` prop).
- Exported as `Alert` and as `Message` (alias to the same component).

## 9. Feature 4 — InputNumber

New `src/components/input-number/InputNumber.vue`, built on reka `NumberFieldRoot`,
`NumberFieldInput`, `NumberFieldIncrement`, `NumberFieldDecrement`, styled to match `Input`.

- Props:
  - `modelValue?: number | null`
  - `min?: number`, `max?: number`, `step?: number` (default `1`), `stepSnapping?: boolean`
  - `integer?: boolean` (forces integer precision)
  - `locale?: string` (default: runtime locale)
  - `formatOptions?: Intl.NumberFormatOptions` (decimal default; supports `style: 'currency'` etc.)
  - `currency?: string` (shorthand: merges `{ style: 'currency', currency }` into `formatOptions`;
    explicitly passed `formatOptions` keys take precedence)
  - `prefix?: string`, `suffix?: string`
  - `showButtons?: boolean` (default false)
  - `placeholder?`, `disabled?`, `readonly?`, `invalid?`, `size?: 'sm' | 'default' | 'lg'`, `id?`,
    `name?`
- Emits `update:modelValue` as `number | null`. Empty input emits `null`.
- Clamps to `[min, max]` and rounds to precision on blur; ArrowUp/Down step by `step`.
- Accessibility: `role="spinbutton"`, `aria-valuemin/max/now`, `aria-valuetext` formatted via the
  active locale, `aria-invalid` when `invalid`.

## 10. Feature 5 — Drawer

New `src/components/drawer/Drawer.vue`, built on reka `DialogRoot`, `DialogTrigger`,
`DialogPortal`, `DialogOverlay`, `DialogContent`, `DialogClose` (not reka's `Drawer`, which is a
swipeable bottom sheet).

- Controlled: `v-model:open` (`open?: boolean`, emits `update:open`).
- Props: `position` (`'left' | 'right' | 'top' | 'bottom' | 'start' | 'end'`, default `'right'`),
  `size` (`'sm' | 'md' | 'lg' | 'full'`, default `'md'`), `backdrop` (default true),
  `closeOnEscape` (default true), `closeOnOutside` (default true), `title`, `description`,
  `showClose` (default true), `preventScroll` (default true).
- Slots: `trigger`, `header`, `default`, `footer`, `close`.
- Emits: `update:open`, `open`, `close`.
- Position class map (`left`/`right` are physical; `start`/`end` mirror them logically and flip in
  RTL via the `rtl:` variant — no runtime direction detection needed):
  - `right`: `inset-y-0 right-0 h-full w-*` / `translate-x-full`
  - `left`: `inset-y-0 left-0 h-full w-*` / `-translate-x-full`
  - `end`: `inset-y-0 end-0 h-full w-*` / `translate-x-full rtl:-translate-x-full`
  - `start`: `inset-y-0 start-0 h-full w-*` / `-translate-x-full rtl:translate-x-full`
  - `top`: `inset-x-0 top-0 w-full h-*` / `-translate-y-full`
  - `bottom`: `inset-x-0 bottom-0 w-full h-*` / `translate-y-full`
- `size` maps to `max-w-*` for horizontal drawers and `max-h-*` for vertical drawers.
- Reka requires a `DialogTitle`; when neither `title`, `header` slot, nor `$slots.header` is
  present, render a visually hidden title (`VisuallyHidden`) for screen readers.

## 11. Feature 6 — DatePicker enhancements

Extend `src/components/date-picker/DatePicker.vue`; no breaking prop changes.

### 11.1 New props

- `hourFormat?: '12' | '24'` (default `'24'`).
- `minuteStep?: number` (default `1`, clamped to `1..30`).
- `locale?: string` (BCP-47; default runtime locale, falling back to `'en'`).
- `labels?: Partial<DatePickerLabels>`:
  `{ placeholder, previousMonth, nextMonth, clear, apply, today, time, hour, minute, am, pm }`.
- `weekStartsOn?: number` (`0`–`6`, Sunday=0) overriding locale detection.

### 11.2 Behavior

- Month label and weekday headers use `Intl.DateTimeFormat(locale, ...)`; the calendar grid starts
  on `weekStartsOn ?? getFirstDayOfWeek(locale)`.
- Time is selected with hour/minute selects (plus an AM/PM select in 12h mode) instead of the
  native `type="time"` input, so `minuteStep` and `hourFormat` are honored across browsers.
- Display text is locale-formatted via `Intl.DateTimeFormat` (`dateStyle: 'medium'` for dates;
  `timeStyle: 'short'`/custom for datetime) instead of the current hard-coded ISO string.
- `labels` defaults are resolved from the locale where `Intl` can supply them and fall back to
  English strings for the rest; label slots override props.
- RTL: nav chevrons use `rtl:rotate-180`; the grid inherits `dir` so columns flow correctly.

### 11.3 New `src/lib/locale.ts` helpers

- `getFirstDayOfWeek(locale: string): number` — from `Intl.Locale(locale).weekInfo/ getWeekInfo`,
  falling back to Sunday for `en-US`-style locales and Monday otherwise.
- `getWeekdayLabels(locale: string, weekStartsOn: number): string[]` — 7 short labels in grid
  order from a fixed reference week.
- `getMonthLabel(date: Date, locale: string): string`.
- `formatLocalizedDate(date: Date, locale: string): string` and
  `formatLocalizedTime(date: Date, locale: string, hourFormat: '12' | '24'): string`.

## 12. Files

New:

```
src/components/alert/Alert.vue
src/components/alert/alert.spec.ts
src/components/drawer/Drawer.vue
src/components/drawer/drawer.spec.ts
src/components/input-number/InputNumber.vue
src/components/input-number/input-number.spec.ts
src/components/theme-toggle/ThemeToggle.vue
src/components/toast/Toaster.vue
src/components/toast/Toast.vue
src/components/toast/useToast.ts
src/components/toast/toast.spec.ts
src/lib/theme.ts
src/lib/theme.spec.ts
src/lib/tones.ts
src/lib/locale.ts
src/lib/locale.spec.ts
docs/superpowers/specs/2026-09-27-dark-mode-and-component-suite-design.md
.changeset/*.md            (one minor changeset)
```

Modified:

```
src/index.ts                       new exports
src/tokens.css                     dark token block + color-scheme
src/tailwindPreset.js              darkMode selector
src/components/**/*.vue            targeted dark: variants
src/components/date-picker/DatePicker.vue  new props + i18n/time
src/components/tag/Tag.vue         consume lib/tones.ts
src/lib/tokens.spec.ts             dark-block parity guard
src/index.spec.ts                  EXPECTED exports
README.md                          components, entry points, theming/dark
DESIGN.md                          dark palette, theming rules, new components
```

## 13. Testing

TDD applies: write failing specs before implementation for each unit. Vitest, colocated specs,
jsdom where DOM is required. Concrete coverage:

- `lib/theme.spec.ts` (jsdom): system default resolution, stored override, `setMode`/`toggle`/
  `enable`/`disable`/`reset`, class + attribute application, storage writes/removals, SSR guard
  (no `window`).
- `lib/locale.spec.ts`: first-day-of-week for `en-US` (Sunday) and `en-GB`/`de-DE` (Monday),
  weekday label order and count, month/date/time formatting for `12` and `24`.
- `lib/tokens.spec.ts` (extended): the dark block defines the same `--myghf-*` set as `:root`.
- `toast.spec.ts` (jsdom): `useToast()` throws without a provider; `add` returns an id and defaults;
  severity convenience methods; `remove`/`clear`; `visible` respects `max` and overflow waits;
  duration forwarded to `ToastRoot` (`0` = persistent) — actual timers are browser-verified.
- `alert.spec.ts` (jsdom): tone classes present (incl. dark tint), `role` by tone, `closable`
  emits `close`, auto-dismiss with fake timers, pause-on-hover.
- `input-number.spec.ts` (jsdom): v-model reflects, empty → `null`, min/max clamp on blur, step via
  buttons/keys, `integer`, locale formatting and `'spinbutton'` aria.
- `drawer.spec.ts` (jsdom): `open` prop reflects, `update:open` emits, each position applies its
  classes, hidden title when none supplied, `closeOnEscape`/`closeOnOutside` toggles pass through.
  Pointer-driven dismissal stays browser-verified, documented as in `Checkbox.spec.ts`.
- `date-picker.spec.ts` (jsdom): hour select count for `1` vs `24` steps, `minuteStep` option
  count, `hourFormat="12"` adds AM/PM, locale changes month label, `weekStartsOn` reorders headers.
- `index.spec.ts` (extended): all new exports present.

## 14. Documentation

- `README.md`: add the new components to the tables, document dark mode (`darkMode` preset key,
  `.dark` / `data-theme="dark"`, `useTheme`, `ThemeToggle`), and add `useToast` usage.
- `DESIGN.md`: add a Dark Mode section under Color (dark semantic values, tint rules, `color-scheme`),
  document that brand scales do not change, add the new components to the applicable rules, and
  update the divergences/gaps section.

## 15. Release

- A single `minor` changeset: new components, new composables, new tokens, and a preset addition —
  all backward-compatible. Pre-1.0 `major`/`minor` are literal, so `minor` bumps `0.1.0 → 0.2.0`.
- No hand-editing of `version` or `CHANGELOG.md`.
- Gates before commit: `npm run typecheck && npm test`.

## 16. Risks & mitigations

| Risk | Mitigation |
| --- | --- |
| Tailwind comma `darkMode` selector silently breaks descendants | Resolved: use canonical `['class', '.dark']` (verified). `data-theme` is a token-block alias documented in the README. |
| Dark tint contrast fails WCAG AA | Choose `*-900/40` backgrounds with `*-200` text; verify contrast during implementation and document values. |
| `useToast()` called outside setup | Throw a clear error naming `<Toaster>`; document setup-only usage. |
| SSR access to `window` | Guard all DOM access in `theme.ts`; Toast queue is provider-scoped and empty on the server. |
| locale parsing/formatting differences in jsdom | Assert only stable, spec-defined outputs; keep locale-sensitive display assertions minimal. |
| Scope creep across ~20 components for dark audit | Token-first means most need no change; only tinted/edge cases are edited and logged in the audit table. |

## 17. Acceptance criteria

1. Importing `tokens.css` and adding `class="dark"` or `data-theme="dark"` on `<html>` renders the
   whole library in dark mode without per-component props.
2. Every component variant either adapts via tokens or has an explicit `dark:` value; the audit
   table is complete.
3. `useTheme()` follows the confirmed behavior and `ThemeToggle` toggles it.
4. `<Toaster>` + `useToast()` support add/remove/clear, severity, duration, position, stack/queue,
   and dismiss, with a11y roles.
5. `<Alert>`/`<Message>` reuse Tag tones and support icon, closable, and auto-dismiss.
6. `<InputNumber>` supports numeric v-model, min/max/step, integer, format, and locale.
7. `<Drawer>` supports four positions, backdrop, close-on-escape/outside, header/footer slots, and
   controlled `v-model:open`.
8. `DatePicker` supports `hourFormat`, `minuteStep`, `locale`, `labels`, and RTL.
9. `npm run typecheck && npm test` pass; README and DESIGN.md are updated; a `minor` changeset exists.
