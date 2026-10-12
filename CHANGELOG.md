# @myghf/ui

## 0.7.0

### Minor Changes

- b2689f3: Add browser-level accessibility tests and make the Accordion heading level configurable
  
  - New Playwright suite (`tests/browser/`, `npm run test:browser`) renders a component harness with
    real CSS and runs axe across the light/dark × LTR/RTL matrix, asserts body text meets WCAG AA
    against the computed colours, and checks the design tokens resolve. It runs in CI.
  - `AccordionItem` accepts `headingLevel` (2–6, default 3) so the trigger heading fits the page
    outline — the browser run caught that reka's default `h3` trips `heading-order` under an `h1`.
  - Documentation: the accessibility guide now reflects the shipped guards and documents the muted
    text contrast limitation (added to `DESIGN.md` §6).
- f25b844: Add controlled sorting to DataTable
  
  `DataTable` now accepts a `sorting` prop. Unbound, it sorts itself as before;
  bound with `v-model:sorting`, the component only emits `update:sorting` and
  sorts when the parent writes the prop back — the shape a server-side sort
  (`manual`) needs. Covers controlled and uncontrolled behaviour, plus
  combination tests (virtualized expansion, cross-page selection, sorting with
  pagination, manual mode with search).

### Patch Changes

- 5cc11fa: Ship type declarations that resolve under `node16`/`nodenext`
  
  The build emitted one declaration file per source file, leaving extensionless relative imports
  (`./lib/date`) in `dist/index.d.ts`. Those do not resolve under
  `moduleResolution: node16`/`nodenext`, so consumers on those settings got broken types (bundler
  resolution was unaffected). Declarations are now rolled up into a single `index.d.ts` (and
  `nuxt.d.ts`) per entry, which resolves under every mode.
  
  Also adds a `check:package` script (artifact assertions + `publint` + `attw`) and runs it, with the
  build, in CI.
- 2ec2b7b: Wire the Tailwind preset automatically in Nuxt
  
  The Nuxt module only wired the Tailwind preset and content glob when the
  consumer happened to write a `tailwindcss` block in `nuxt.config` — the
  documented `modules: ['@nuxtjs/tailwindcss', '@myghf/ui/nuxt']` setup got
  no preset and only a misleading "not detected" warning, because
  `@nuxtjs/tailwindcss` resolves its options at install time.
  
  The module now seeds `nuxt.options.tailwindcss` when the Tailwind module has
  not installed yet, so listing `@myghf/ui/nuxt` **before** `@nuxtjs/tailwindcss`
  wires everything with no extra config. When the Tailwind module has already
  installed, the module warns with the exact `tailwindcss` block that wires it.
  Detection uses Nuxt's installed-modules registry (new `hasInstalledTailwindModule`
  helper, unit-tested) so a merely *listed* module is not mistaken for an
  installed one.

## 0.6.0

### Minor Changes

- d42da81: Add the app shell: `AppShell`, `Sidebar`, `Topbar`
  
  `AppShell` arranges a topbar, sidebar, and main content. On large screens the sidebar is
  docked; below the `lg` breakpoint `collapsible` (default) turns it into an off-canvas panel
  that `Topbar` opens with a menu button. The three share an injection context, so the button
  carries `aria-expanded`/`aria-controls` targeting the sidebar's id, the backdrop and <kbd>Esc</kbd>
  close it, and the off-canvas offset mirrors under RTL. Exported from `@myghf/ui` and
  auto-imported by the Nuxt module.
- 9d6de12: Add chart components: `Sparkline` and `BarChart`
  
  - `Sparkline` draws a compact line or area trend; `BarChart` draws categorical bars and exposes
    the same values through a visually-hidden table. Both are accessible by default (`Sparkline` is
    `role="img"` with a `label`, or decorative without one).
  - Built on the new external dependencies `d3-scale` and `d3-shape` (externalised in the build, so
    a bundler only includes them for the pages that import a chart). Exported from `@myghf/ui` and
    auto-imported by the Nuxt module.
- 23643ae: Add the `Combobox` component
  
  A searchable select built on reka-ui's combobox: type to filter, pick one or several. Supports
  `multiple` (selections render as removable `Tag`s), `clearable`, size variants, and an
  `emptyLabel` for no-match states. The input is `role="combobox"` and wires `id`,
  `aria-describedby`, `aria-invalid`, and `aria-required` through the shared `useFieldControl`
  contract. Exported from `@myghf/ui` and auto-imported by the Nuxt module.
- 138529c: Add the CommandPalette component
  
  A keyboard-first command launcher built on the Dialog: type to filter a flat list of commands,
  move with the arrow keys, run with Enter, and close with Escape. Items carry an optional
  description, group label, keywords, and icon, and the palette matches against all of them.
  Exports the `CommandItem` type, is exported from `@myghf/ui`, and is auto-imported by the Nuxt
  module.
- 1723e2f: Add dashboard primitives: StatCard, StatusBadge, Timeline, Stepper
  
  - `StatCard`: a metric card with a label, headline value, optional hint, and a signed `trend`
    (announced to screen readers as "up/down N percent").
  - `StatusBadge`: a toned pill with a decorative dot and an optional `pulse`.
  - `Timeline` + `TimelineItem`: a labelled activity list with `<time>` stamps.
  - `Stepper`: a step indicator that marks the current step with `aria-current="step"` and shows a
    check for completed steps, plus a `Step` type.
  
  All are exported from `@myghf/ui` and auto-imported by the Nuxt module.
- 9eb1946: Add the `FileUpload` component
  
  A drop zone over a native `<input type="file">`: the input stays focusable and is the actual
  control, so click, drag-and-drop, and keyboard all work without scripting. Selected files are
  listed with name, size, a remove button, and an optional per-file `Progress` bar via a
  `progressFor` callback. Supports `multiple`, `accept`, `disabled`, and the field contract
  (`id`, `aria-describedby`, `aria-invalid`, `required`) through the shared `useFieldControl`
  composable. Exported from `@myghf/ui` and auto-imported by the Nuxt module.
- dfe1094: Add the `FormErrors` component
  
  A form-level validation summary: a `role="alert"` box that lists each error, where every entry
  is a button that focuses the field it refers to. `focusFirst` moves focus to the first invalid
  field on submit. Exports the `FormError` type, is exported from `@myghf/ui`, and is
  auto-imported by the Nuxt module.
- a1d263c: Add layout primitives: `Container`, `Stack`, `Inline`, `Grid`
  
  Four small structural wrappers: a centred page column (`Container`, with size/padding), a
  vertical stack and a wrapping row with a shared spacing scale and optional alignment
  (`Stack`, `Inline`), and a grid with fixed `cols` or responsive auto-fit `minItemWidth`
  (`Grid`). Each takes an `as` prop to choose the element and passes attributes through. Exported
  from `@myghf/ui` and auto-imported by the Nuxt module.
- 806b27f: Add Tooltip, Popover, and Accordion
  
  - `Tooltip`: a short hover/focus label for a single trigger, built on reka-ui, with `text`/`side`/
    `align`/`sideOffset`/`delayDuration` and a `content` slot.
  - `Popover`: a floating panel anchored to a trigger, with `v-model:open` and positioning props.
  - `Accordion` + `AccordionItem`: collapsible sections with `single`/`multiple` types and
    `v-model` over the open value(s).
  
  All are exported from `@myghf/ui` and auto-imported by the Nuxt module.
- 986af2d: Add page chrome: `Breadcrumbs`, `PageHeader`, `PageContent`
  
  - `Breadcrumbs`: a labelled `nav` trail with `aria-current` on the last item, an `aria-hidden`
    RTL-aware separator, and an `item` slot for router links. Exports the `BreadcrumbItem` type.
  - `PageHeader`: an `<h1>` title with optional description, plus `breadcrumbs` and `actions`
    slots.
  - `PageContent`: the padded, width-capped page body (wraps `Container`).
  
  Exported from `@myghf/ui` and auto-imported by the Nuxt module.
- a69fa8c: Add the `Progress` component
  
  A horizontal progress bar built on reka-ui's progress primitive: determinate with
  `modelValue`/`max`, or indeterminate when the value is omitted. Supports `sm`/`default`/`lg`
  sizes, tones, and an accessible `label`. The fill is width-based so it mirrors correctly under
  RTL. Exported from `@myghf/ui` and auto-imported by the Nuxt module.
- bc37380: Add the `RadioGroup` component
  
  A single-choice control for a small, always-visible set of options, built on reka-ui's
  radio group. Options render a labelled `role="radio"` each (named via `<label for>`), with
  `vertical`/`horizontal` orientations, per-option `disabled`, and an optional `option` slot for
  custom label content. It wires `id`, `aria-describedby`, `aria-invalid`, and `aria-required`
  through the shared `useFieldControl` contract, and is exported from `@myghf/ui` (and
  auto-imported by the Nuxt module).
- c63df0f: Add the `Switch` component
  
  A boolean on/off toggle built on reka-ui with `sm`/`default` sizes, `disabled`, and
  `invalid`/`required` props. It wires `id`, `aria-describedby`, `aria-invalid`, and
  `aria-required` through the shared `useFieldControl` contract, animates its thumb with logical
  translation for RTL, and is exported from `@myghf/ui` (and auto-imported by the Nuxt module).
  Also corrects the stale `Checkbox` docs now that it consumes the form-field context.
- 4d70147: DataTable: column visibility, order, pinning, and resizing
  
  - Register TanStack's `columnVisibilityFeature`, `columnOrderingFeature`, `columnPinningFeature`,
    `columnSizingFeature`, and `columnResizingFeature`.
  - New `v-model` bindings: `column-visibility` (id → visible), `column-order` (ids), and
    `column-pinning` (`{ start, end }`). Pinning is logical, so pinned cells stick with
    `inset-inline-start`/`inset-inline-end` and mirror under RTL.
  - New `resizable` prop renders drag handles on each header (double-click resets a column's size).
- 0bfa4af: DataTable keyboard expansion + CSV export utilities
  
  - `DataTable` now renders a leading expander button per row when `expandable`, a real
    `<button>` with `aria-expanded` and an `aria-label` (`expandRowLabel`). Row expansion is no
    longer pointer-only.
  - Add `toCsv` and `downloadCsv` (with the `CsvColumn`/`CsvOptions` types): RFC 4180 CSV
    serialization with a UTF-8 BOM by default, and a browser download helper that is a no-op
    outside a DOM. Exported from `@myghf/ui` and auto-imported by the Nuxt module.
- 76f1220: DataTable: searching and column filters
  
  - Register TanStack's `columnFilteringFeature` + `globalFilteringFeature` (with the filtered row
    model and `filterFns`) in `DataTableFeatures`.
  - New `searchable` prop renders a global search input bound with `v-model:global-filter`.
  - New `filters` prop (`ColumnFiltersState`) bound with `v-model:filters`; active filters render as
    removable chips in the toolbar, with a **Clear filters** button (`clearFiltersLabel`).
  - New `noResultsLabel` distinguishes "no rows match your filters" from the empty state, and a
    `toolbar` slot lets consumers add their own controls.
- 50c84ef: DataTable: pagination and server-side mode
  
  - New `paginate` prop renders the pagination footer over the client-side rows, bound with
    `v-model:page-index` / `v-model:page-size` and a `pageSizeOptions` list.
  - New `manual` prop switches to server-side mode: TanStack skips client sorting, filtering, and
    pagination; `rowCount` supplies the server total, and the component emits `update:pageIndex` /
    `update:pageSize` (alongside the existing `update:sorting` / `update:filters`) for you to refetch.
  - A `pagination` slot can replace the default footer.
  - Fix: `DataTable` no longer caps the body at the default page size (10) — TanStack's paginated
    row model is now handed `pageSize: Infinity` unless `paginate`/`manual` is set.
- ddd6a13: DataTable: row selection, bulk actions, and an error state
  
  - Register TanStack's `rowSelectionFeature`, so `DataTableFeatures` now includes row selection.
  - New `selectable` prop adds a labelled checkbox column (header select-all + per-row), bound
    with `v-model:selection` (a map keyed by row id) and emitting `update:selection`.
  - New `bulk-actions` slot renders a bar with the selected count while rows are selected,
    receiving `{ rows, clear }`.
  - New `error` prop/slot replaces the body with an error message (unless `loading`).
- 635219b: DataTable: virtual scrolling
  
  Set `maxHeight` and `virtual` together and `DataTable` renders only the visible slice of rows
  (plus a small overscan), padding the rest with spacer rows so the DOM stays small for very large
  datasets. The windowing math lives in a new pure `src/lib/virtual.ts` (`virtualWindow`). It assumes
  a uniform `rowHeight` (configurable, default 40) and does not account for expansion rows.
- 40e075a: Unify the form-field error wiring across every control
  
  - Add `useFieldControl`, a shared composable that resolves a control's `id`,
    `aria-describedby`, `aria-invalid`, and `required` with one consistent precedence
    (explicit prop → `FormField` context → default). It is exported so custom controls can opt
    into the same contract.
  - `Input`, `Textarea`, `Select`, and `Password` now use it (no behavior change).
  - Wire the remaining controls into the `FormField` context: `Checkbox`, `InputNumber`,
    `SelectButton`, `DatePicker`, `TreeSelect`, and `TransferList` accept `invalid`/`required`
    (and `id` where missing) and associate their error text with `aria-describedby`.
  - Add specs for `TreeSelect` and `TransferList` (previously untested) and extend the a11y
    catalog to mount the field-wired controls.
- f65d7bd: Add Hijri (Umm al-Qura) calendar support to DatePicker
  
  - New `calendar` prop (`'gregory' | 'islamic-umalqura'`, default `'gregory'`) lays the grid out,
    labels the month, numbers the days, and formats the selected date in the chosen calendar. The
    emitted `modelValue` stays a Gregorian `Date`.
  - New hijri utilities — `addDays`, `hijriParts`, `startOfHijriMonth`, `hijriMonthLength`,
    `hijriMonthLabel`, `formatHijriDate` (and the `CalendarSystem` / `HijriParts` types) — backed by
    the platform's `Intl` Umm al-Qura data. Exported from `@myghf/ui` and auto-imported by the Nuxt
    module.
- 8cadb17: Add locale number formatting helpers and an RTL source guard
  
  - New `formatNumber`, `formatCurrency`, and `formatPercent` helpers: locale-aware `Intl` formatting
    that falls back to `String(value)` on an invalid locale. Exported from `@myghf/ui` and
    auto-imported by the Nuxt module.
  - Add `src/lib/rtlCoverage.spec.ts`, a guard that fails when a component uses a physical
    left/right utility (`pl-`, `pr-`, `ml-`, `mr-`, `text-left`, `text-right`, `border-l-`,
    `border-r-`, `rounded-l-`, `rounded-r-`) instead of its logical equivalent.
- 96f86e1: Add a localization layer (config provider + English/Arabic labels)
  
  - New `createConfig` / `provideMyGhfConfig` / `useMyGhfConfig` (plus `myghfConfigKey` and
    `defaultConfig`): provide a `{ locale, labels }` config at the app root to localize built-in
    control strings. Ships English and Arabic label sets, matching the locale's base language and
    falling back to English.
  - Migrate the previously hardcoded strings to the config: `Select`/`Combobox` "Clear selection",
    `Combobox` "Show options", `Password` "Toggle password visibility", `Toast`/`Dialog`/`Drawer`
    "Close", `Drawer`'s title, `TreeSelect` "Clear", `TransferList` "Empty" and its four move
    labels, and `FormErrors`' default title. Existing per-component label props still override.

### Patch Changes

- 40e075a: Add automated accessibility and contrast guards, and fix form-field wiring
  
  - New axe-core accessibility catalog (`src/a11y.spec.ts`) that mounts every public component and
    fails on missing names, unlabelled controls, nested interactive elements, and broken ARIA.
  - New token contrast guard (`src/lib/contrast.spec.ts`) asserting WCAG AA for body text and brand
    tints, and pinning the documented brand exceptions so they cannot regress.
  - `Password` now consumes the `FormField` context, wiring `id`, `required`, `aria-invalid`, and
    `aria-describedby` (the input previously had no associated label inside a `FormField`).
  - `TablePagination`'s page-size `<select>` now has an accessible name.
  - `TransferList` rows no longer nest interactive controls; the option checkbox has an accessible
    name and row labels use logical `text-start` so they follow the writing direction.
  - New PR-triggered CI workflow (`.github/workflows/ci.yml`) running typecheck, tests, and the docs
    build.

## 0.5.2

### Patch Changes

- 7932b4e: fix: stop Dialog and Drawer pointing aria-describedby at a description that was never rendered

## 0.5.1

### Patch Changes

- 8bfcb0d: fix: portal the DatePicker and Select popups so an ancestor with overflow (such as Dialog) no longer clips them
- 4096b53: fix: constrain the Dialog body so tall content scrolls instead of being clipped and unreachable

## 0.5.0

### Minor Changes

- 5115cb6: fix: explicit/optional/idempotent Nuxt Tailwind wiring, DataTable loading state, and composable/utility auto-imports

## 0.4.0

### Minor Changes

- 6f7ce97: feat: add Spinner, Skeleton, Avatar, form-field family, Button icons, DropdownMenu completion, Input/Textarea enhancements, and an optional Nuxt module

## 0.3.0

### Minor Changes

- 4c5b2e4: feat: dark mode, Toaster/useToast, Alert/Message, InputNumber, Drawer, DatePicker i18n
  
  The Tailwind preset now sets `darkMode: ['class', '.dark']`. Consumers who relied on Tailwind's default `media` strategy must add the `.dark` class (for example on `<html>`) for `dark:` utilities to take effect.

### Patch Changes

- 019abad: fix: render Toaster default slot so useToast() works for descendants

## 0.2.0

### Minor Changes

- 3e0f356: Align design tokens with the MYGHF brand manual. This is a **breaking change** for anyone
  overriding tokens or relying on the previous color values.
  
  - Rename every CSS custom property from `--ahc-*` to `--myghf-*` (e.g.
    `--ahc-primary-500` -> `--myghf-primary-500`).
  - Replace the error/danger scale with MYGHF Red (`#E9322B`); it was a pink PrimeVue "danger" hue.
  - Correct the success/teal scale to MYGHF Teal (`#0DA79E`).
  - Set text to MYGHF Black (`#000000`), borders to the brand light gray (`#E6E6E6`), and muted text
    to the brand gray (`#808080`).
  - Add brand font stacks: Helvetica Neue (sans), Trajan Pro (serif), and GE SS Two (Arabic).
  - Make `Select` RTL-safe (`pr-8` -> `pe-8`).
  - Add `DESIGN.md` as the in-repo design-system reference.
