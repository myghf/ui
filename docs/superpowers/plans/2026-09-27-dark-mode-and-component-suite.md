# Dark Mode + Component Suite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add dark theming, Toaster/useToast, Alert/Message, InputNumber, Drawer, and DatePicker i18n/time options to `@myghf/ui`.

**Architecture:** Hybrid theming — a dark token block overrides the semantic layer so neutral components adapt for free, while brand-tinted surfaces get targeted `dark:` classes through a shared `toneClasses` map. New components wrap reka-ui primitives (`Toast*`, `NumberField*`, `Dialog*`) and follow the existing `Dialog.vue` pattern; locale, time, number, and theme logic live in focused, unit-tested `src/lib/*` modules.

**Tech Stack:** Vue 3.5 (`script setup`), TypeScript, Tailwind CSS 3.4, tailwind-variants, reka-ui 2.10, lucide-vue-next, Vitest + jsdom.

**Spec:** `docs/superpowers/specs/2026-09-27-dark-mode-and-component-suite-design.md`

## Global Constraints

- Preset must set top-level `darkMode: ['class', '.dark']`. Comma-separated selectors break descendant matching (verified: Tailwind emits `:is(.dark, [data-theme="dark"], .dark, [data-theme="dark"] *)`, dropping `.dark *`).
- Dark token block selector is exactly `[data-theme='dark'], .dark`; it sets `color-scheme: dark` and overrides only the six semantic variables as a strict subset of `:root` (brand scales inherited, never re-declared).
- Dark semantic values (verbatim): `--myghf-background: 15 18 23`, `--myghf-foreground: 243 244 246`, `--myghf-surface: 26 30 37`, `--myghf-surface-muted: 39 44 53`, `--myghf-border: 55 61 71`, `--myghf-muted: 156 163 175`. Brand scales are unchanged.
- Never hard-code hex or inline colors in components; use `--myghf-*` tokens or preset Tailwind classes.
- Use logical utilities (`ps/pe/ms/me/start/end`, `text-start/end`) and `rtl:` variants; never physical left/right for direction.
- Tones are exactly `'info' | 'success' | 'warning' | 'danger' | 'secondary'`.
- Toast positions are exactly `top-start | top-center | top-end | bottom-start | bottom-center | bottom-end`; default `top-end`.
- `Toaster` defaults: `max` 4, `duration` 5000, `position` `top-end`, `gap` `0.5rem`.
- `useTheme` defaults: `storageKey` `myghf-theme`, `attribute` `both`, `defaultMode` `system`.
- `Drawer` defaults: `position` `right`, `size` `md`.
- `DatePicker` defaults: `hourFormat` `24`, `minuteStep` 1.
- Number formatting precedence: `currency` shorthand < explicit `formatOptions` < `integer` (`maximumFractionDigits: 0`).
- Every commit runs `npm run typecheck`; the final PR gate is `npm run typecheck && npm test`.
- One `minor` changeset for the whole change. Never edit `version` or `CHANGELOG.md` by hand.
- Update `README.md` and `DESIGN.md` in the same change; extend `DESIGN.md` rather than adding new docs.

## Review Focus

1. `useTheme()` on the server (no `window`/`document`) must not throw and must resolve to light. [Task 3]
2. `useToast()` in a component without an ancestor `<Toaster>` must throw an error naming `<Toaster>`. [Task 6]
3. `InputNumber` cleared to empty emits `null` (never `NaN`/`0`); `min > max` and `step <= 0` must not throw or loop. [Task 7]
4. `Drawer` opened with no `title`/`header` must still render an accessible `DialogTitle`. [Task 8]
5. `Alert` auto-dismiss must pause on hover and clear its timer on unmount (no leak). [Task 5]

---

## Task 1: Dark token set, preset, and parity guard

**Files:**
- Modify: `src/tokens.css`
- Modify: `src/tailwindPreset.js`
- Modify: `src/lib/tokens.spec.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: dark `--myghf-*` values under `[data-theme='dark'], .dark`; preset top-level `darkMode`.

- [ ] **Step 1: Add failing guards to `src/lib/tokens.spec.ts`**

Append below the existing test (keep the existing `root`/`definedVars`/`referencedVars` helpers):

```ts
function varsInBlock(css: string, selector: string): Set<string> {
  const start = css.indexOf(selector)
  if (start === -1) return new Set()
  const open = css.indexOf('{', start)
  const close = css.indexOf('}', open)
  return new Set(
    [...css.slice(open, close).matchAll(/--myghf-[\w-]+\s*:/g)].map((m) =>
      m[0].replace(/\s*:$/, ''),
    ),
  )
}

it('overrides only the semantic layer in the dark block', () => {
  const css = readFileSync(`${root}/src/tokens.css`, 'utf8')
  const light = varsInBlock(css, ':root')
  const dark = varsInBlock(css, "[data-theme='dark']")
  const required = [
    '--myghf-background',
    '--myghf-foreground',
    '--myghf-surface',
    '--myghf-surface-muted',
    '--myghf-border',
    '--myghf-muted',
  ]
  expect(light.size).toBeGreaterThan(0)
  for (const name of required) expect(dark.has(name)).toBe(true)
  // A strict subset: no variable is introduced, and brand scales are not re-declared.
  expect([...dark].filter((name) => !light.has(name))).toEqual([])
  expect(dark.size).toBeLessThan(light.size)
})

it('enables the .dark class variant in the preset', () => {
  const js = readFileSync(`${root}/src/tailwindPreset.js`, 'utf8')
  expect(js).toMatch(/darkMode\s*:\s*\[\s*['"]class['"]\s*,\s*['"]\.dark['"]\s*\]/)
})
```

- [ ] **Step 2: Run the guard and watch it fail**

Run: `npx vitest run src/lib/tokens.spec.ts`
Expected: FAIL — the dark set is empty (all six required names absent), and the preset has no `darkMode`.

- [ ] **Step 3: Add the dark block and preset key**

In `src/tokens.css`, immediately after the closing `}` of `:root`, add:

```css
[data-theme='dark'],
.dark {
  color-scheme: dark;

  --myghf-background: 15 18 23;
  --myghf-foreground: 243 244 246;
  --myghf-surface: 26 30 37;
  --myghf-surface-muted: 39 44 53;
  --myghf-border: 55 61 71;
  --myghf-muted: 156 163 175;
}
```

> The dark block intentionally declares only the six semantic variables. Do NOT re-declare the
> brand scales here: inheriting them from `:root` is what lets a consumer's `:root` brand-scale
> overrides survive into dark mode.

In `src/tailwindPreset.js`, add `darkMode: ['class', '.dark'],` as the first key of the exported object.

- [ ] **Step 4: Run the guard and the full suite**

Run: `npx vitest run src/lib/tokens.spec.ts && npm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/tokens.css src/tailwindPreset.js src/lib/tokens.spec.ts
git commit -m "feat: add dark token set and darkMode class variant"
```

---

## Task 2: Extract `toneClasses` and make Tag dark-aware

**Files:**
- Create: `src/lib/tones.ts`
- Test: `src/lib/tones.spec.ts`
- Create: `src/components/tag/tag.spec.ts`
- Modify: `src/components/tag/Tag.vue`
- Modify: `src/index.ts`

**Interfaces:**
- Produces: `Tone`, `ToneClasses`, `toneClasses`; `TagTone` remains exported from `Tag.vue` (now an alias of `Tone`). Consumed by Tasks 5 and 6.

- [ ] **Step 1: Write `src/lib/tones.spec.ts`**

```ts
import { describe, expect, it } from 'vitest'
import { toneClasses } from './tones'

const TONES = ['info', 'success', 'warning', 'danger', 'secondary'] as const

describe('toneClasses', () => {
  it('defines soft, outline, icon and role for every tone', () => {
    for (const tone of TONES) {
      expect(toneClasses[tone].soft).toBeTruthy()
      expect(toneClasses[tone].outline).toBeTruthy()
      expect(toneClasses[tone].icon).toBeTruthy()
      expect(['alert', 'status']).toContain(toneClasses[tone].role)
    }
  })

  it('maps warning and danger to the assertive role', () => {
    expect(toneClasses.warning.role).toBe('alert')
    expect(toneClasses.danger.role).toBe('alert')
    expect(toneClasses.info.role).toBe('status')
  })

  it('gives every tinted brand tone a dark variant', () => {
    for (const tone of ['info', 'success', 'warning', 'danger'] as const) {
      expect(toneClasses[tone].soft).toMatch(/dark:/)
      expect(toneClasses[tone].outline).toMatch(/dark:/)
      expect(toneClasses[tone].icon).toMatch(/dark:/)
    }
  })
})
```

- [ ] **Step 2: Run it and watch it fail**

Run: `npx vitest run src/lib/tones.spec.ts`
Expected: FAIL — `Cannot find module './tones'`.

- [ ] **Step 3: Create `src/lib/tones.ts` with these exact values**

```ts
export type Tone = 'info' | 'success' | 'warning' | 'danger' | 'secondary'

export interface ToneClasses {
  soft: string
  outline: string
  icon: string
  role: 'alert' | 'status'
}

export const toneClasses: Record<Tone, ToneClasses> = {
  info: {
    soft: 'bg-primary-100 text-primary-800 dark:bg-primary-900/40 dark:text-primary-200',
    outline: 'border border-primary-300 text-primary-800 dark:border-primary-700 dark:text-primary-200',
    icon: 'text-primary-500 dark:text-primary-300',
    role: 'status',
  },
  success: {
    soft: 'bg-success-100 text-success-800 dark:bg-success-900/40 dark:text-success-200',
    outline: 'border border-success-300 text-success-800 dark:border-success-700 dark:text-success-200',
    icon: 'text-success-500 dark:text-success-300',
    role: 'status',
  },
  warning: {
    soft: 'bg-warning-100 text-warning-800 dark:bg-warning-900/40 dark:text-warning-200',
    outline: 'border border-warning-300 text-warning-800 dark:border-warning-700 dark:text-warning-200',
    icon: 'text-warning-500 dark:text-warning-300',
    role: 'alert',
  },
  danger: {
    soft: 'bg-error-100 text-error-800 dark:bg-error-900/40 dark:text-error-200',
    outline: 'border border-error-300 text-error-800 dark:border-error-700 dark:text-error-200',
    icon: 'text-error-500 dark:text-error-300',
    role: 'alert',
  },
  secondary: {
    soft: 'bg-surface-muted text-foreground',
    outline: 'border border-border text-foreground',
    icon: 'text-muted',
    role: 'status',
  },
}
```

- [ ] **Step 4: Refactor `src/components/tag/Tag.vue` to consume the map**

Replace the `tv(...)` block with `import { toneClasses, type Tone } from '../../lib/tones'`, keep the
base class string, and bind `:class="['inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium', toneClasses[tone].soft]"`.
Change the `tone` prop type to `Tone` and `export type TagTone = Tone`. Add
`dark:hover:bg-white/10` beside the remove button's `hover:bg-black/10`.

- [ ] **Step 5: Write `src/components/tag/tag.spec.ts`**

```ts
// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Tag from './Tag.vue'

describe('Tag', () => {
  it('applies the soft tone classes including dark variants', () => {
    const wrapper = mount(Tag, { props: { tone: 'success' }, slots: { default: 'Done' } })
    const cls = wrapper.get('span').classes().join(' ')
    expect(cls).toContain('bg-success-100')
    expect(cls).toContain('dark:bg-success-900/40')
  })
})
```

- [ ] **Step 6: Run tests and typecheck**

Run: `npx vitest run src/lib/tones.spec.ts src/components/tag/tag.spec.ts && npm run typecheck`
Expected: PASS.

- [ ] **Step 7: Export from the barrel**

In `src/index.ts` add `export { toneClasses } from './lib/tones'` and
`export type { Tone, ToneClasses } from './lib/tones'`.

- [ ] **Step 8: Commit**

```bash
git add src/lib/tones.ts src/lib/tones.spec.ts src/components/tag src/index.ts
git commit -m "feat: extract shared tone map and add dark Tag values"
```

---

## Task 3: `useTheme` / `createTheme` and `ThemeToggle`

**Files:**
- Create: `src/lib/theme.ts`
- Test: `src/lib/theme.spec.ts`
- Create: `src/components/theme-toggle/ThemeToggle.vue`
- Create: `src/components/theme-toggle/theme-toggle.spec.ts`
- Modify: `src/index.ts`, `src/index.spec.ts`

**Interfaces:**
- Produces: `ThemeMode`, `UseThemeOptions`, `UseThemeReturn`, `createTheme(options?)`, `useTheme(options?)`, `ThemeToggle`.

- [ ] **Step 1: Write `src/lib/theme.spec.ts`**

```ts
// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createTheme } from './theme'

function stubMatchMedia(prefersDark: boolean) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockImplementation((query: string) => ({
      matches: query.includes('dark') ? prefersDark : false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  )
}

describe('createTheme', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.className = ''
    document.documentElement.removeAttribute('data-theme')
  })

  it('defaults to system and applies dark when the OS prefers dark', () => {
    stubMatchMedia(true)
    const theme = createTheme()
    expect(theme.mode.value).toBe('system')
    expect(theme.isDark.value).toBe(true)
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  })

  it('prefers a stored explicit mode over the OS preference', () => {
    stubMatchMedia(true)
    localStorage.setItem('myghf-theme', 'light')
    const theme = createTheme()
    expect(theme.isDark.value).toBe(false)
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('persists explicit modes and clears them on reset', () => {
    stubMatchMedia(false)
    const theme = createTheme()
    theme.setMode('dark')
    expect(localStorage.getItem('myghf-theme')).toBe('dark')
    expect(theme.isDark.value).toBe(true)
    theme.reset()
    expect(localStorage.getItem('myghf-theme')).toBeNull()
    expect(theme.mode.value).toBe('system')
  })

  it('writes only the requested attribute when configured', () => {
    stubMatchMedia(false)
    const theme = createTheme({ attribute: 'class' })
    theme.setMode('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(document.documentElement.getAttribute('data-theme')).toBeNull()
  })

  it('returns independent controllers', () => {
    stubMatchMedia(false)
    const a = createTheme()
    const b = createTheme()
    a.setMode('dark')
    expect(b.mode.value).toBe('system')
  })

  it('does not throw without a window and resolves to light', () => {
    const originalWindow = globalThis.window
    // @ts-expect-error simulate an SSR environment
    delete globalThis.window
    try {
      expect(createTheme().isDark.value).toBe(false)
    } finally {
      globalThis.window = originalWindow
    }
  })
})
```

- [ ] **Step 2: Run it and watch it fail**

Run: `npx vitest run src/lib/theme.spec.ts`
Expected: FAIL — `Cannot find module './theme'`.

- [ ] **Step 3: Implement `src/lib/theme.ts`**

```ts
export type ThemeMode = 'light' | 'dark' | 'system'
export type ThemeAttribute = 'both' | 'class' | 'data-theme'
export interface UseThemeOptions { storageKey?: string; attribute?: ThemeAttribute; defaultMode?: ThemeMode }
export interface UseThemeReturn {
  mode: import('vue').Ref<ThemeMode>
  resolved: import('vue').ComputedRef<'light' | 'dark'>
  isDark: import('vue').ComputedRef<boolean>
  setMode(mode: ThemeMode): void
  toggle(): void
  enable(): void
  disable(): void
  reset(): void
}
export function createTheme(options?: UseThemeOptions): UseThemeReturn
export function useTheme(options?: UseThemeOptions): UseThemeReturn
```

Implementation decisions: default `storageKey` `'myghf-theme'`, `attribute` `'both'`, `defaultMode`
`'system'`. Guard all DOM access with `typeof window === 'undefined' || typeof document === 'undefined'`
(return a no-op, light-resolving controller). `systemPreference()` reads
`window.matchMedia('(prefers-color-scheme: dark)').matches`. `apply()` writes/removes `.dark` and/or
`data-theme="dark"` on `document.documentElement` per `attribute`. `setMode` writes non-`system`
values to `localStorage`; `reset()` removes the key. `toggle()` flips `isDark.value`. Cache a single
instance for `useTheme()`; emit a `console.warn` in dev if a later call passes different options.

- [ ] **Step 4: Run the tests**

Run: `npx vitest run src/lib/theme.spec.ts`
Expected: PASS.

- [ ] **Step 5: Implement `ThemeToggle.vue` and its spec**

`src/components/theme-toggle/ThemeToggle.vue`: props `size?: 'sm' | 'default' | 'lg'` (default
`'default'`), `label?: string` (default `'Toggle theme'`); uses `useTheme()`; renders a `<button>`
with `aria-label="label"` and `aria-pressed="isDark"`, showing `Moon` when light and `Sun` when dark,
with the same size/hover/focus classes as `Button`'s `ghost` variant.

`src/components/theme-toggle/theme-toggle.spec.ts`:

```ts
// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ThemeToggle from './ThemeToggle.vue'

describe('ThemeToggle', () => {
  it('exposes an accessible toggle state', () => {
    const wrapper = mount(ThemeToggle)
    const button = wrapper.get('button')
    expect(button.attributes('aria-label')).toBe('Toggle theme')
    expect(['true', 'false']).toContain(button.attributes('aria-pressed'))
  })
})
```

- [ ] **Step 6: Export and guard the barrel**

In `src/index.ts` add `export { useTheme, createTheme } from './lib/theme'`,
`export type { ThemeMode, UseThemeOptions, UseThemeReturn, ThemeAttribute } from './lib/theme'`, and
`export { default as ThemeToggle } from './components/theme-toggle/ThemeToggle.vue'`.
Append `'useTheme', 'createTheme', 'ThemeToggle'` to `EXPECTED` in `src/index.spec.ts`.

- [ ] **Step 7: Run tests and typecheck, then commit**

Run: `npx vitest run src/lib/theme.spec.ts src/components/theme-toggle/theme-toggle.spec.ts src/index.spec.ts && npm run typecheck`

```bash
git add src/lib/theme.ts src/lib/theme.spec.ts src/components/theme-toggle src/index.ts src/index.spec.ts
git commit -m "feat: add useTheme, createTheme and ThemeToggle"
```

---

## Task 4: Dark audit of existing components

**Files:**
- Modify: `src/components/button/Button.vue`
- Modify: `src/components/checkbox/Checkbox.vue`
- Modify: `src/components/dialog/Dialog.vue`
- Modify: `src/components/date-picker/DatePicker.vue`
- Test: `src/lib/darkCoverage.spec.ts`

**Interfaces:**
- Consumes: dark tokens (Task 1), `toneClasses` (Task 2).
- Produces: dark values on remaining tinted/edge surfaces.

- [ ] **Step 1: Write `src/lib/darkCoverage.spec.ts`**

```ts
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const componentsDir = fileURLToPath(new URL('../components', import.meta.url))

function vueFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry)
    return statSync(full).isDirectory() ? vueFiles(full) : full.endsWith('.vue') ? [full] : []
  })
}

describe('dark coverage', () => {
  it('gives every light brand tint a dark variant in the same file', () => {
    const offenders = vueFiles(componentsDir).filter((file) => {
      const src = readFileSync(file, 'utf8')
      const tinted = /(bg-(primary|secondary|success|warning|error|info)-100)\b/.test(src)
      return tinted && !src.includes('dark:')
    })
    expect(offenders).toEqual([])
  })
})
```

- [ ] **Step 2: Run it and watch it fail**

Run: `npx vitest run src/lib/darkCoverage.spec.ts`
Expected: FAIL — `DatePicker.vue` uses `bg-primary-100` with no `dark:` (Tag is already covered by Task 2).

- [ ] **Step 3: Apply the audit changes**

- `Button.vue` base: add `dark:focus-visible:ring-offset-background`.
- `Checkbox.vue`: add `dark:focus-visible:ring-offset-background` to the root class string.
- `Dialog.vue`: change the overlay to `bg-black/50 dark:bg-black/70`.
- `DatePicker.vue`: change the in-range cell class to
  `bg-primary-100 text-primary-800 dark:bg-primary-900/40 dark:text-primary-200`.
- If the guard reports any other offender, add a `dark:` counterpart using the same
  `*-900/40` background + `*-200` text pattern; do not introduce new hues.

- [ ] **Step 4: Run the guard and the full suite**

Run: `npx vitest run src/lib/darkCoverage.spec.ts && npm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components src/lib/darkCoverage.spec.ts
git commit -m "feat: add dark values to tinted and overlay component surfaces"
```

---

## Task 5: Alert / Message

**Files:**
- Create: `src/components/alert/Alert.vue`
- Test: `src/components/alert/alert.spec.ts`
- Modify: `src/index.ts`, `src/index.spec.ts`

**Interfaces:**
- Consumes: `toneClasses`, `Tone` (Task 2), `Icon`.
- Produces: `Alert`, `Message` (alias), `AlertVariant`.

- [ ] **Step 1: Write `src/components/alert/alert.spec.ts`**

```ts
// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Alert from './Alert.vue'

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

describe('Alert', () => {
  it('uses the assertive role for warning and danger', () => {
    expect(mount(Alert, { props: { tone: 'danger' } }).attributes('role')).toBe('alert')
    expect(mount(Alert, { props: { tone: 'info' } }).attributes('role')).toBe('status')
  })

  it('emits close when the close button is clicked', async () => {
    const onClose = vi.fn()
    const wrapper = mount(Alert, { props: { closable: true, onClose } })
    await wrapper.get('button').trigger('click')
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('auto-dismisses after duration', () => {
    const onClose = vi.fn()
    mount(Alert, { props: { duration: 1000, onClose } })
    vi.advanceTimersByTime(1000)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('pauses auto-dismiss while hovered and resumes on leave', async () => {
    const onClose = vi.fn()
    const wrapper = mount(Alert, { props: { duration: 1000, onClose } })
    await wrapper.trigger('mouseenter')
    vi.advanceTimersByTime(5000)
    expect(onClose).not.toHaveBeenCalled()
    await wrapper.trigger('mouseleave')
    vi.advanceTimersByTime(1000)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('clears its timer on unmount', () => {
    const onClose = vi.fn()
    mount(Alert, { props: { duration: 1000, onClose } }).unmount()
    vi.advanceTimersByTime(5000)
    expect(onClose).not.toHaveBeenCalled()
  })
})
```

- [ ] **Step 2: Run it and watch it fail**

Run: `npx vitest run src/components/alert/alert.spec.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `Alert.vue`**

Props: `tone?: Tone` (default `'info'`), `title?`, `description?`, `icon?`, `showIcon?: boolean`
(default `false`), `closable?: boolean` (default `false`), `duration?: number`, `closeLabel?: string`
(default `'Close'`), `variant?: 'soft' | 'outline'` (default `'soft'`).
Slots: default, `title`, `description`, `icon`, `actions`, `close`. Emits: `close`.

Behavior: root is a `<div>` with `role="toneClasses[tone].role"` and base classes plus
`toneClasses[tone][variant]`; a leading `Icon` (`:name="icon"` falling back to the tone's default
lucide name) when `showIcon`; `closable` renders a close button. Auto-dismiss uses
`onMounted`/`onBeforeUnmount` with a `deadline`/`remaining` pattern and `mouseenter`/`mouseleave`
plus `focusin`/`focusout` to pause/resume; on fire or manual close, hide (`v-if="!dismissed"`) and
emit `close` once.

- [ ] **Step 4: Run the tests**

Run: `npx vitest run src/components/alert/alert.spec.ts`
Expected: PASS.

- [ ] **Step 5: Export and guard the barrel**

`src/index.ts`: `export { default as Alert } from './components/alert/Alert.vue'`,
`export { default as Message } from './components/alert/Alert.vue'`,
`export type { AlertVariant } from './components/alert/Alert.vue'`.
Append `'Alert', 'Message'` to `EXPECTED` in `src/index.spec.ts`.

- [ ] **Step 6: Run tests and typecheck, then commit**

Run: `npx vitest run src/components/alert/alert.spec.ts src/index.spec.ts && npm run typecheck`

```bash
git add src/components/alert src/index.ts src/index.spec.ts
git commit -m "feat: add Alert/Message reusing Tag tones"
```

---

## Task 6: Toaster, toast store, and useToast

**Files:**
- Create: `src/components/toast/useToast.ts`
- Create: `src/components/toast/Toast.vue`
- Create: `src/components/toast/Toaster.vue`
- Test: `src/components/toast/toast.spec.ts`
- Modify: `src/index.ts`, `src/index.spec.ts`

**Interfaces:**
- Consumes: `toneClasses`, `Tone` (Task 2), `Icon`.
- Produces: `ToastSeverity`, `ToastPosition`, `ToastOptions`, `ToastItem`, `ToastStore`, `ToastStoreOptions`, `createToastStore`, `toastKey`, `useToast`, `Toaster`.

- [ ] **Step 1: Write `src/components/toast/toast.spec.ts`**

```ts
// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, provide } from 'vue'
import { createToastStore, toastKey, useToast } from './useToast'
import Toaster from './Toaster.vue'

describe('createToastStore', () => {
  it('adds toasts with defaults and returns an id', () => {
    const store = createToastStore()
    const id = store.add({ title: 'Saved' })
    expect(id).toBeTruthy()
    expect(store.items.value[0]).toMatchObject({
      title: 'Saved', severity: 'info', position: 'top-end', duration: 5000,
    })
  })

  it('caps visible toasts at max and keeps overflow queued', () => {
    const store = createToastStore({ max: 2 })
    store.add({ title: 'a' }); store.add({ title: 'b' }); store.add({ title: 'c' })
    expect(store.visible.value.map((t) => t.title)).toEqual(['a', 'b'])
    store.remove(store.items.value[0].id)
    expect(store.visible.value.map((t) => t.title)).toEqual(['b', 'c'])
  })

  it('clamps a non-positive max to at least one', () => {
    const store = createToastStore({ max: 0 })
    store.add({ title: 'a' })
    expect(store.visible.value).toHaveLength(1)
  })

  it('sets severity through convenience methods', () => {
    const store = createToastStore()
    store.danger('Nope', 'failed')
    expect(store.items.value[0]).toMatchObject({ severity: 'danger', title: 'Nope', description: 'failed' })
  })

  it('clears all toasts', () => {
    const store = createToastStore()
    store.add({ title: 'a' })
    store.clear()
    expect(store.items.value).toEqual([])
  })
})

describe('useToast', () => {
  it('throws a clear error without a Toaster', () => {
    const Host = defineComponent({ setup() { useToast(); return () => h('div') } })
    expect(() => mount(Host)).toThrow(/<Toaster/)
  })

  it('returns the provided store', () => {
    const store = createToastStore()
    let seen: unknown
    const Child = defineComponent({ setup() { seen = useToast(); return () => h('div') } })
    const Parent = defineComponent({ setup() { provide(toastKey, store); return () => h(Child) } })
    mount(Parent)
    expect(seen).toBe(store)
  })
})

describe('Toaster', () => {
  it('renders the toast title and description', async () => {
    const store = createToastStore()
    const wrapper = mount(Toaster, { props: { store } })
    store.add({ title: 'Saved', description: 'All good' })
    await nextTick()
    expect(wrapper.text()).toContain('Saved')
    expect(wrapper.text()).toContain('All good')
  })

  it('forwards a persistent duration (0) to the toast root', async () => {
    const store = createToastStore()
    const wrapper = mount(Toaster, { props: { store } })
    store.add({ title: 'Stay', duration: 0 })
    await nextTick()
    expect(wrapper.find('[data-toast-root]').attributes('data-duration')).toBe('0')
  })
})
```

- [ ] **Step 2: Run it and watch it fail**

Run: `npx vitest run src/components/toast/toast.spec.ts`
Expected: FAIL — modules not found.

- [ ] **Step 3: Implement `src/components/toast/useToast.ts`**

Exports exactly:

```ts
export type ToastSeverity = 'info' | 'success' | 'warning' | 'danger' | 'secondary'
export type ToastPosition =
  | 'top-start' | 'top-center' | 'top-end'
  | 'bottom-start' | 'bottom-center' | 'bottom-end'
export interface ToastOptions {
  title?: string
  description?: string
  severity?: ToastSeverity
  duration?: number
  position?: ToastPosition
  closable?: boolean
  icon?: string
  action?: { label: string; onClick: () => void }
}
export interface ToastItem extends ToastOptions { id: string }
export interface ToastStoreOptions { max?: number; duration?: number; position?: ToastPosition }
export interface ToastStore { /* items, visible, add, remove, clear, + 5 convenience methods */ }
export const toastKey: InjectionKey<ToastStore>
export function createToastStore(options?: ToastStoreOptions): ToastStore
export function useToast(): ToastStore
```

`createToastStore`: `max = Math.max(1, options.max ?? 4)`, `duration = options.duration ?? 5000`,
`position = options.position ?? 'top-end'`; ids are `toast-${++seq}`; `add` merges defaults; `remove`
splices by id; `clear` empties; `visible = computed(() => items.value.slice(0, max))`. `useToast`
injects `toastKey` and throws `new Error('useToast() requires a <Toaster /> mounted above this component.')` when absent.

- [ ] **Step 4: Run the store tests**

Run: `npx vitest run src/components/toast/toast.spec.ts`
Expected: still FAIL on the `Toaster` cases (component not created), PASS on the store cases.

- [ ] **Step 5: Implement `Toast.vue` and `Toaster.vue`**

`Toast.vue` (internal, not exported) — props `{ item: ToastItem; duration: number }`, emits `close`.
Renders `ToastRoot` with `:default-open="true"`, `:duration="item.duration ?? duration"`,
`:type="item.severity === 'danger' || item.severity === 'warning' ? 'foreground' : 'background'"`,
a `data-toast-root` attribute, `:data-duration="item.duration ?? duration"`, and
`@update:open="(open) => !open && emit('close')"`. Inside: tone icon, `ToastTitle`/`ToastDescription`,
optional `ToastAction`, and a `ToastClose` (respecting `item.closable !== false`). Use
`toneClasses[item.severity ?? 'info']` for the icon and a `soft`-style surface.

`Toaster.vue` — props `position` (default `'top-end'`), `max` (default 4), `duration` (default 5000),
`gap` (default `'0.5rem'`), `label` (default `'Notifications'`), `store?: ToastStore`. Create
`const toastStore = props.store ?? createToastStore({ max, duration, position })`, `provide(toastKey, toastStore)`,
and render `ToastProvider` wrapping a `ToastViewport` per position with
`itemsFor(position) = toastStore.visible.value.filter((t) => (t.position ?? props.position) === position)`,
each rendering `Toast` with a `key="item.id"` and `@close="toastStore.remove(item.id)"`. Position
viewports use logical `start`/`end` classes (`top-start` → `top-0 start-0`, etc.) and
`mx-auto`/`inset-x-0` for `*-center`.

- [ ] **Step 6: Run the toast tests and typecheck**

Run: `npx vitest run src/components/toast/toast.spec.ts && npm run typecheck`
Expected: PASS.

- [ ] **Step 7: Export and guard the barrel**

`src/index.ts`: export `Toaster`, `useToast`, `createToastStore`, `toastKey`, and the toast types.
Append `'Toaster', 'useToast', 'createToastStore'` to `EXPECTED` in `src/index.spec.ts`.

- [ ] **Step 8: Commit**

```bash
git add src/components/toast src/index.ts src/index.spec.ts
git commit -m "feat: add Toaster and useToast"
```

---

## Task 7: InputNumber

**Files:**
- Create: `src/lib/number.ts`, `src/lib/number.spec.ts`
- Create: `src/components/input-number/InputNumber.vue`
- Test: `src/components/input-number/input-number.spec.ts`
- Modify: `src/index.ts`, `src/index.spec.ts`

**Interfaces:**
- Consumes: reka `NumberFieldRoot`/`NumberFieldInput`/`NumberFieldIncrement`/`NumberFieldDecrement`, `Icon`.
- Produces: `mergeFormatOptions`, `toNumberOrNull`, `InputNumber`.

- [ ] **Step 1: Write `src/lib/number.spec.ts`**

```ts
import { describe, expect, it } from 'vitest'
import { mergeFormatOptions, toNumberOrNull } from './number'

describe('toNumberOrNull', () => {
  it('returns null for empty or invalid input', () => {
    expect(toNumberOrNull(undefined)).toBeNull()
    expect(toNumberOrNull(null)).toBeNull()
    expect(toNumberOrNull(Number.NaN)).toBeNull()
  })

  it('keeps valid numbers including zero', () => {
    expect(toNumberOrNull(0)).toBe(0)
    expect(toNumberOrNull(2.5)).toBe(2.5)
  })
})

describe('mergeFormatOptions', () => {
  it('lets explicit format options override the currency shorthand', () => {
    expect(mergeFormatOptions({ currency: 'USD', formatOptions: { maximumFractionDigits: 0 } })).toMatchObject({
      style: 'currency', currency: 'USD', maximumFractionDigits: 0,
    })
  })

  it('forces integer formatting last', () => {
    expect(mergeFormatOptions({ integer: true, formatOptions: { maximumFractionDigits: 3 } })).toMatchObject({
      maximumFractionDigits: 0,
    })
  })
})
```

- [ ] **Step 2: Run it and watch it fail**

Run: `npx vitest run src/lib/number.spec.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `src/lib/number.ts`**

```ts
export function toNumberOrNull(value: number | null | undefined): number | null
export function mergeFormatOptions(input: {
  currency?: string
  formatOptions?: Intl.NumberFormatOptions
  integer?: boolean
}): Intl.NumberFormatOptions
```

`toNumberOrNull` returns `null` for `null`/`undefined`/non-finite. `mergeFormatOptions` spreads in
order: currency shorthand, then `formatOptions`, then `{ maximumFractionDigits: 0 }` when `integer`
is true.

- [ ] **Step 4: Run the tests**

Run: `npx vitest run src/lib/number.spec.ts`
Expected: PASS.

- [ ] **Step 5: Write `src/components/input-number/input-number.spec.ts`**

```ts
// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { NumberFieldRoot } from 'reka-ui'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import InputNumber from './InputNumber.vue'

describe('InputNumber', () => {
  it('emits null when the underlying field is cleared to an invalid value', async () => {
    const onUpdate = vi.fn()
    const wrapper = mount(InputNumber, { props: { modelValue: 5, 'onUpdate:modelValue': onUpdate } })
    wrapper.findComponent(NumberFieldRoot).vm.$emit('update:modelValue', Number.NaN)
    await nextTick()
    expect(onUpdate).toHaveBeenCalledWith(null)
  })

  it('exposes spinbutton semantics', () => {
    expect(mount(InputNumber, { props: { modelValue: 3 } }).get('input').attributes('role')).toBe('spinbutton')
  })

  it('renders prefix and suffix', () => {
    const wrapper = mount(InputNumber, { props: { modelValue: 10, prefix: '$', suffix: 'kg' } })
    expect(wrapper.text()).toContain('$')
    expect(wrapper.text()).toContain('kg')
  })
})
```

- [ ] **Step 6: Run it and watch it fail**

Run: `npx vitest run src/components/input-number/input-number.spec.ts`
Expected: FAIL — module not found.

- [ ] **Step 7: Implement `InputNumber.vue`**

Props: `modelValue?: number | null`, `min?`, `max?`, `step?` (default 1), `stepSnapping?`,
`integer?`, `locale?`, `formatOptions?`, `currency?`, `prefix?`, `suffix?`, `showButtons?`,
`placeholder?`, `disabled?`, `readonly?`, `invalid?`, `size?: 'sm' | 'default' | 'lg'`,
`id?`, `name?`. Emits `update:modelValue: [number | null]`.

Decisions: `safeStep = Number.isFinite(step) && step > 0 ? step : 1` (normalizes `0`, negatives, `NaN`,
and `±Infinity`); pass `min`/`max` straight through (reka handles
`min > max` without looping). Compute `:format-options="mergeFormatOptions({ currency, formatOptions, integer })"`
and `:locale`. Wrap `NumberFieldRoot` in a relative div with the same surface/border/size classes as
`Input`; render `prefix`/`suffix` spans and the `NumberFieldInput` (add `role="spinbutton"` if reka
does not set it) plus `NumberFieldIncrement`/`NumberFieldDecrement` when `showButtons`.
`@update:model-value="emit('update:modelValue', toNumberOrNull($event))"`.

- [ ] **Step 8: Run tests and typecheck, export, commit**

Run: `npx vitest run src/lib/number.spec.ts src/components/input-number/input-number.spec.ts && npm run typecheck`

Add `export { default as InputNumber } from './components/input-number/InputNumber.vue'`,
`export { toNumberOrNull, mergeFormatOptions } from './lib/number'`, and append `'InputNumber'` to
`EXPECTED` in `src/index.spec.ts`. Re-run the two specs plus `src/index.spec.ts`.

```bash
git add src/lib/number.ts src/lib/number.spec.ts src/components/input-number src/index.ts src/index.spec.ts
git commit -m "feat: add locale-aware InputNumber"
```

---

## Task 8: Drawer

**Files:**
- Create: `src/components/drawer/Drawer.vue`
- Test: `src/components/drawer/drawer.spec.ts`
- Modify: `src/index.ts`, `src/index.spec.ts`

**Interfaces:**
- Consumes: reka `DialogRoot`, `DialogTrigger`, `DialogPortal`, `DialogOverlay`, `DialogContent`, `DialogClose`, `DialogTitle`, `DialogDescription`, `VisuallyHidden`.
- Produces: `Drawer`, `DrawerPosition`, `DrawerSize`.

- [ ] **Step 1: Write `src/components/drawer/drawer.spec.ts`**

```ts
// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { DialogContent, DialogRoot, DialogTitle } from 'reka-ui'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import Drawer from './Drawer.vue'

describe('Drawer', () => {
  it('reflects the controlled open prop', async () => {
    const wrapper = mount(Drawer, { props: { open: false, title: 'Filters' }, slots: { default: 'body' } })
    expect(wrapper.findComponent(DialogContent).exists()).toBe(false)
    await wrapper.setProps({ open: true })
    expect(wrapper.findComponent(DialogContent).exists()).toBe(true)
  })

  it('renders a DialogTitle even when no title or header is given', () => {
    const wrapper = mount(Drawer, { props: { open: true } })
    expect(wrapper.findComponent(DialogTitle).exists()).toBe(true)
  })

  it.each(['left', 'right', 'top', 'bottom', 'start', 'end'])('places the panel for %s', (position) => {
    const wrapper = mount(Drawer, { props: { open: true, position } })
    const cls = wrapper.getComponent(DialogContent).classes().join(' ')
    expect(cls).toContain(position === 'top' || position === 'bottom' ? 'inset-x-0' : 'inset-y-0')
  })

  it('prevents escape-key dismissal when disabled', async () => {
    const wrapper = mount(Drawer, { props: { open: true, closeOnEscape: false } })
    const event = new KeyboardEvent('keydown', { key: 'Escape' })
    const preventDefault = vi.spyOn(event, 'preventDefault')
    wrapper.findComponent(DialogContent).vm.$emit('escapeKeyDown', event)
    await nextTick()
    expect(preventDefault).toHaveBeenCalled()
  })

  it('forwards update:open', async () => {
    const onUpdate = vi.fn()
    const wrapper = mount(Drawer, { props: { open: true, 'onUpdate:open': onUpdate } })
    wrapper.findComponent(DialogRoot).vm.$emit('update:open', false)
    await nextTick()
    expect(onUpdate).toHaveBeenCalledWith(false)
  })
})
```

- [ ] **Step 2: Run it and watch it fail**

Run: `npx vitest run src/components/drawer/drawer.spec.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `Drawer.vue`**

Props: `open?: boolean` (default `false`), `position?: DrawerPosition` (default `'right'`),
`size?: DrawerSize` (default `'md'`), `backdrop?: boolean` (default `true`), `closeOnEscape?: boolean`
(default `true`), `closeOnOutside?: boolean` (default `true`), `title?`, `description?`,
`showClose?: boolean` (default `true`), `preventScroll?: boolean` (default `true`).
Emits: `update:open: [boolean]`, `open: []`, `close: []`. Slots: `trigger`, `header`, `default`,
`footer`, `close`.

Decisions: `open` is a computed get/set emitting `update:open`; `onOpenChange(v)` also emits
`open`/`close`. `DialogContent` is fixed with a position class map:
`right`/`left`/`top`/`bottom` physical; `start`/`end` logical with `rtl:` transform flips.
`size` maps to `max-w-sm|max-w-md|max-w-lg|max-w-full` for horizontal and the `max-h-*` equivalents
for vertical. Render `DialogOverlay` when `backdrop || preventScroll`, with the dim classes
(`bg-black/50 dark:bg-black/70`) when `backdrop` and `bg-transparent` otherwise — reka owns body
scroll lock in `DialogOverlay`, so this is how `preventScroll` is honored; there is no
`prevent-scroll` prop on reka's `DialogContent`. `DialogContent` handles
`@escape-key-down` and `@pointer-down-outside`, calling `event.preventDefault()` when the matching
option is false. Always render a `DialogTitle`: visible when `title`/`header` slot exist, otherwise
`<VisuallyHidden><DialogTitle>Drawer</DialogTitle></VisuallyHidden>`.

- [ ] **Step 4: Run the tests and typecheck**

Run: `npx vitest run src/components/drawer/drawer.spec.ts && npm run typecheck`
Expected: PASS.

- [ ] **Step 5: Export and guard the barrel, then commit**

Add `export { default as Drawer } from './components/drawer/Drawer.vue'`,
`export type { DrawerPosition, DrawerSize } from './components/drawer/Drawer.vue'`, and append
`'Drawer'` to `EXPECTED` in `src/index.spec.ts`.

```bash
git add src/components/drawer src/index.ts src/index.spec.ts
git commit -m "feat: add Drawer"
```

---

## Task 9: Locale and time helpers

**Files:**
- Create: `src/lib/locale.ts`, `src/lib/locale.spec.ts`
- Modify: `src/lib/date.ts`, `src/lib/date.spec.ts`
- Modify: `src/index.ts`, `src/index.spec.ts`

**Interfaces:**
- Produces: `getFirstDayOfWeek(locale)`, `getWeekdayLabels(locale, weekStartsOn)`, `getMonthLabel(date, locale)`, `formatLocalizedDate(date, locale)`, `formatLocalizedTime(date, locale, hourFormat)`, `buildHourOptions(hourFormat)`, `buildMinuteOptions(minuteStep)`, `to12Hour(hour24)`, `from12Hour(hour, meridiem)`. Consumed by Task 10.

- [ ] **Step 1: Write `src/lib/locale.spec.ts`**

```ts
import { describe, expect, it } from 'vitest'
import { formatLocalizedDate, formatLocalizedTime, getFirstDayOfWeek, getMonthLabel, getWeekdayLabels } from './locale'

describe('getFirstDayOfWeek', () => {
  it('returns Sunday for en-US', () => expect(getFirstDayOfWeek('en-US')).toBe(0))
  it('returns Monday for en-GB and de-DE', () => {
    expect(getFirstDayOfWeek('en-GB')).toBe(1)
    expect(getFirstDayOfWeek('de-DE')).toBe(1)
  })
})

describe('getWeekdayLabels', () => {
  it('returns seven labels starting on the given day', () => {
    const sun = getWeekdayLabels('en-US', 0)
    const mon = getWeekdayLabels('en-US', 1)
    expect(sun).toHaveLength(7)
    expect(sun[0]).toMatch(/^Sun/i)
    expect(mon[0]).toMatch(/^Mon/i)
  })
})

describe('formatting', () => {
  it('localizes the month label', () => {
    expect(getMonthLabel(new Date(2026, 0, 15), 'en-US')).toMatch(/January/i)
    expect(getMonthLabel(new Date(2026, 0, 15), 'fr-FR')).not.toBe(getMonthLabel(new Date(2026, 0, 15), 'en-US'))
  })

  it('formats a localized date', () => {
    expect(formatLocalizedDate(new Date(2026, 0, 15), 'en-US')).toContain('2026')
  })

  it('formats 24-hour and 12-hour times', () => {
    expect(formatLocalizedTime(new Date(2026, 0, 1, 9, 30), 'en-GB', '24')).toMatch(/^\d{2}:\d{2}$/)
    expect(formatLocalizedTime(new Date(2026, 0, 1, 9, 30), 'en-US', '12')).toMatch(/[AP]M/)
  })
})
```

- [ ] **Step 2: Run it and watch it fail**

Run: `npx vitest run src/lib/locale.spec.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `src/lib/locale.ts`**

```ts
export function getFirstDayOfWeek(locale: string): number
export function getWeekdayLabels(locale: string, weekStartsOn: number): string[]
export function getMonthLabel(date: Date, locale: string): string
export function formatLocalizedDate(date: Date, locale: string): string
export function formatLocalizedTime(date: Date, locale: string, hourFormat: '12' | '24'): string
```

`getFirstDayOfWeek` reads `new Intl.Locale(locale).weekInfo ?? new Intl.Locale(locale).getWeekInfo?.()`
and maps CLDR's 1–7 (Mon–Sun) to `% 7`; fall back to `1` when unavailable. `getWeekdayLabels` uses
the reference week starting Sunday 2026-01-04 and `Intl.DateTimeFormat(locale, { weekday: 'short' })`.
`getMonthLabel` uses `{ month: 'long', year: 'numeric' }`. `formatLocalizedDate` uses
`{ dateStyle: 'medium' }`. `formatLocalizedTime` uses `{ hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }`
for `'24'` and `{ hour: 'numeric', minute: '2-digit', hour12: true }` for `'12'`.

- [ ] **Step 4: Run the locale tests**

Run: `npx vitest run src/lib/locale.spec.ts`
Expected: PASS.

- [ ] **Step 5: Add time-option tests to `src/lib/date.spec.ts`**

```ts
import { buildHourOptions, buildMinuteOptions, from12Hour, to12Hour } from './date'

it('builds 24- and 12-hour option lists', () => {
  expect(buildHourOptions('24')).toHaveLength(24)
  expect(buildHourOptions('12')).toHaveLength(12)
})

it('builds minute options from the step and never returns an empty list', () => {
  expect(buildMinuteOptions(15)).toEqual([0, 15, 30, 45])
  expect(buildMinuteOptions(7)).toHaveLength(9)
  expect(buildMinuteOptions(0).length).toBeGreaterThan(0)
})

it('converts between 12- and 24-hour representations', () => {
  expect(to12Hour(0)).toEqual({ hour: 12, meridiem: 'am' })
  expect(to12Hour(13)).toEqual({ hour: 1, meridiem: 'pm' })
  expect(from12Hour(12, 'am')).toBe(0)
  expect(from12Hour(1, 'pm')).toBe(13)
})
```

- [ ] **Step 6: Implement the helpers in `src/lib/date.ts`**

```ts
export function buildHourOptions(hourFormat: '12' | '24'): number[]
export function buildMinuteOptions(minuteStep: number): number[]
export function to12Hour(hour24: number): { hour: number; meridiem: 'am' | 'pm' }
export function from12Hour(hour: number, meridiem: 'am' | 'pm'): number
```

`buildHourOptions('24')` → `0..23`; `('12')` → `1..12`. `buildMinuteOptions(step)` normalizes a
non-positive/non-finite step to 1 and returns `0, step, 2*step, ... < 60`. `to12Hour`/`from12Hour`
convert hour 0–23.

- [ ] **Step 7: Run tests, export, commit**

Run: `npx vitest run src/lib/locale.spec.ts src/lib/date.spec.ts && npm run typecheck`

In `src/index.ts` add `export * from './lib/locale'` (keep `export * from './lib/date'`), and append
the five locale function names to `EXPECTED` in `src/index.spec.ts`.

```bash
git add src/lib/locale.ts src/lib/locale.spec.ts src/lib/date.ts src/lib/date.spec.ts src/index.ts src/index.spec.ts
git commit -m "feat: add locale and time helpers"
```

---

## Task 10: DatePicker hourFormat, minuteStep, locale, labels, RTL

**Files:**
- Modify: `src/components/date-picker/DatePicker.vue`
- Test: `src/components/date-picker/date-picker.spec.ts`

**Interfaces:**
- Consumes: Task 9 helpers and all existing `DatePicker` props/events.

- [ ] **Step 1: Write `src/components/date-picker/date-picker.spec.ts`**

```ts
// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import DatePicker from './DatePicker.vue'

function open(props: Record<string, unknown> = {}) {
  return mount(DatePicker, { props: { mode: 'datetime', defaultOpen: true, ...props } })
}

describe('DatePicker', () => {
  it('renders 24 hourly options in 24-hour format', () => {
    expect(open({ hourFormat: '24' }).get('[data-test="hours"]').findAll('option')).toHaveLength(24)
  })

  it('renders 12 hourly options plus a meridiem control in 12-hour format', () => {
    const wrapper = open({ hourFormat: '12' })
    expect(wrapper.get('[data-test="hours"]').findAll('option')).toHaveLength(12)
    expect(wrapper.find('[data-test="meridiem"]').exists()).toBe(true)
  })

  it('builds minute options from minuteStep', () => {
    expect(open({ minuteStep: 15 }).get('[data-test="minutes"]').findAll('option')).toHaveLength(4)
  })

  it('localizes the month heading', () => {
    const en = open({ locale: 'en-US' })
    const fr = open({ locale: 'fr-FR' })
    expect(en.get('[data-test="month-label"]').text()).not.toBe(fr.get('[data-test="month-label"]').text())
  })

  it('honors weekStartsOn', () => {
    const wrapper = open({ weekStartsOn: 0, locale: 'en-GB' })
    expect(wrapper.get('[data-test="weekdays"]').text()).toMatch(/^Sun/i)
  })

  it('flips navigation chevrons in RTL', () => {
    expect(open().get('[aria-label="Previous month"]').html()).toContain('rtl:rotate-180')
  })
})
```

- [ ] **Step 2: Run it and watch it fail**

Run: `npx vitest run src/components/date-picker/date-picker.spec.ts`
Expected: FAIL — the time `select`s, `data-test` hooks, `defaultOpen`, and RTL classes do not exist.

- [ ] **Step 3: Implement the DatePicker changes**

Add props `hourFormat?: '12' | '24'` (default `'24'`), `minuteStep?: number` (default 1),
`locale?: string`, `labels?: Partial<DatePickerLabels>`, `weekStartsOn?: number`,
`defaultOpen?: boolean`. Initialize `open = ref(props.defaultOpen ?? false)`.
Define and export `DatePickerLabels` with keys `placeholder`, `previousMonth`, `nextMonth`, `clear`,
`apply`, `today`, `time`, `hour`, `minute`, `am`, `pm`. Resolve effective labels as
`{ ...defaultLabels(locale), ...labels }` and let label slots override props.

Replace the hard-coded calendar: `grid` lead becomes `(first.getDay() - weekStartsOn + 7) % 7` where
`weekStartsOn = props.weekStartsOn ?? getFirstDayOfWeek(effectiveLocale)`; weekday headers come from
`getWeekdayLabels`; the heading uses `getMonthLabel` and carries `data-test="month-label"`; the
weekday row carries `data-test="weekdays"`. Replace `<input type="time">` with hour/minute selects
(`data-test="hours"`/`"minutes"`) built from `buildHourOptions`/`buildMinuteOptions`, plus a
`data-test="meridiem"` select in 12-hour mode; convert values with `to12Hour`/`from12Hour`. Change
`display` to use `formatLocalizedDate` and, when `mode === 'datetime'`, `formatLocalizedTime`. Keep
the existing dark in-range classes from Task 4. Add `rtl:rotate-180` to `ChevronLeft`/`ChevronRight`.

- [ ] **Step 4: Run the tests and typecheck**

Run: `npx vitest run src/components/date-picker/date-picker.spec.ts && npm run typecheck`
Expected: PASS. If reka's popover does not mount content under jsdom even with `defaultOpen`, add
`forceMount` on the `PopoverContent` as the minimal fix and re-run.

- [ ] **Step 5: Commit**

```bash
git add src/components/date-picker
git commit -m "feat: add hourFormat, minuteStep, locale and RTL to DatePicker"
```

---

## Task 11: Documentation and changeset

**Files:**
- Modify: `README.md`, `DESIGN.md`
- Create: `.changeset/*.md`

**Interfaces:**
- Consumes: everything above.

- [ ] **Step 1: Update `README.md`**

Add the new exports to the components table (`Alert`/`Message`, `InputNumber`, `Toaster`/`useToast`,
`Drawer`, `ThemeToggle`, `useTheme`), document the dark-mode setup (preset `darkMode`, the
`.dark`/`data-theme="dark"` selectors and the `data-theme`-only caveat that Tailwind `dark:`
utilities require `.dark`), add `useTheme`/`ThemeToggle` and `useToast` usage snippets, and note the
DatePicker `hourFormat`/`minuteStep`/`locale`/`labels` props.

- [ ] **Step 2: Update `DESIGN.md`**

Add a Dark Mode subsection under Color: the dark semantic values, that brand scales are unchanged,
that brand tints use `*-900/40` backgrounds with `*-200` text, and `color-scheme: dark`. Add the new
components to the applicable rules and extend the Divergences & Known Gaps section (no automated RTL
visual test; dark tint contrast verified per component).

- [ ] **Step 3: Add the changeset**

Run: `npx changeset --minor @myghf/ui -m "feat: dark mode, Toaster/useToast, Alert/Message, InputNumber, Drawer, DatePicker i18n"`
Expected: a new `.changeset/*.md` file.

- [ ] **Step 4: Run the full gate**

Run: `npm run typecheck && npm test`
Expected: PASS (all suites, including the extended `index.spec.ts`).

- [ ] **Step 5: Commit**

```bash
git add README.md DESIGN.md .changeset
git commit -m "docs: document dark mode and new components; add changeset"
```

---

## Self-review notes

- **Spec coverage:** Tasks 1–4 cover §6 (dark mode) including the per-component audit and the
  parity guard; Task 5 covers §8; Task 6 covers §7; Task 7 covers §9; Task 8 covers §10; Tasks 9–10
  cover §11; Task 11 covers §14 (docs) and §15 (changeset). §12 file list and §13 testing map 1:1 to
  task files.
- **Review Focus tests:** each of the five lines has a named test in its owning task (theme SSR,
  toast provider error, InputNumber null/robustness, Drawer hidden title, Alert pause/unmount).
- **Type consistency:** `Tone`/`toneClasses` (Task 2) are consumed verbatim by Tasks 5–6;
  `createToastStore`/`ToastStore` (Task 6) are used by `Toaster` and the spec's `store` prop;
  `buildHourOptions`/`buildMinuteOptions`/`to12Hour`/`from12Hour` (Task 9) are used by Task 10.
