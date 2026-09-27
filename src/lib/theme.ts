import { computed, ref } from 'vue'
import type { ComputedRef, Ref } from 'vue'

export type ThemeMode = 'light' | 'dark' | 'system'
export type ThemeAttribute = 'both' | 'class' | 'data-theme'

export interface UseThemeOptions {
  /** localStorage key used to persist an explicit mode. Defaults to `'myghf-theme'`. */
  storageKey?: string
  /** Which attribute(s) to write on `<html>`. Defaults to `'both'`. */
  attribute?: ThemeAttribute
  /** Mode used when nothing is stored. Defaults to `'system'`. */
  defaultMode?: ThemeMode
}

export interface UseThemeReturn {
  /** The user's chosen mode (`'system'` follows the OS). */
  mode: Ref<ThemeMode>
  /** The effective mode after resolving `'system'` against the OS preference. */
  resolved: ComputedRef<'light' | 'dark'>
  /** Convenience flag: `resolved === 'dark'`. */
  isDark: ComputedRef<boolean>
  setMode(mode: ThemeMode): void
  toggle(): void
  enable(): void
  disable(): void
  reset(): void
}

const DEFAULT_STORAGE_KEY = 'myghf-theme'
const DEFAULT_ATTRIBUTE: ThemeAttribute = 'both'
const DEFAULT_MODE: ThemeMode = 'system'

/** SSR guard: every DOM access is behind this. */
function hasDom(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined'
}

function systemPreference(): 'light' | 'dark' {
  if (!hasDom() || typeof window.matchMedia !== 'function') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function readStoredMode(storageKey: string): ThemeMode | null {
  try {
    const stored = window.localStorage.getItem(storageKey)
    return stored === 'light' || stored === 'dark' || stored === 'system' ? stored : null
  } catch {
    // Storage can throw when disabled (private mode, blocked cookies); stay in memory.
    return null
  }
}

function normalize(options: UseThemeOptions): Required<UseThemeOptions> {
  return {
    storageKey: options.storageKey ?? DEFAULT_STORAGE_KEY,
    attribute: options.attribute ?? DEFAULT_ATTRIBUTE,
    defaultMode: options.defaultMode ?? DEFAULT_MODE,
  }
}

function optionsEqual(a: UseThemeOptions, b: UseThemeOptions): boolean {
  const left = normalize(a)
  const right = normalize(b)
  return (
    left.storageKey === right.storageKey &&
    left.attribute === right.attribute &&
    left.defaultMode === right.defaultMode
  )
}

/**
 * Builds an independent theme controller. Writes `.dark` and/or
 * `data-theme="dark"` on `<html>` so the CSS dark token block activates.
 * Safe to call during SSR: without a DOM it resolves to light and is a no-op.
 */
export function createTheme(options: UseThemeOptions = {}): UseThemeReturn {
  const { storageKey, attribute, defaultMode } = normalize(options)

  const initialMode = hasDom() ? (readStoredMode(storageKey) ?? defaultMode) : defaultMode
  const mode = ref<ThemeMode>(initialMode)

  const resolved = computed<'light' | 'dark'>(() =>
    mode.value === 'system' ? systemPreference() : mode.value,
  )
  const isDark = computed(() => resolved.value === 'dark')

  function apply(): void {
    if (!hasDom()) return
    const dark = isDark.value
    const root = document.documentElement

    if (attribute === 'both' || attribute === 'class') {
      root.classList.toggle('dark', dark)
    } else {
      root.classList.remove('dark')
    }

    if (attribute === 'both' || attribute === 'data-theme') {
      if (dark) root.setAttribute('data-theme', 'dark')
      else root.removeAttribute('data-theme')
    } else {
      root.removeAttribute('data-theme')
    }
  }

  function persist(value: ThemeMode): void {
    if (!hasDom()) return
    try {
      if (value === 'system') window.localStorage.removeItem(storageKey)
      else window.localStorage.setItem(storageKey, value)
    } catch {
      // Ignore storage failures; the applied theme still works for this session.
    }
  }

  function setMode(value: ThemeMode): void {
    mode.value = value
    persist(value)
    apply()
  }

  function toggle(): void {
    setMode(isDark.value ? 'light' : 'dark')
  }

  function enable(): void {
    setMode('dark')
  }

  function disable(): void {
    setMode('light')
  }

  function reset(): void {
    mode.value = defaultMode
    if (hasDom()) {
      try {
        window.localStorage.removeItem(storageKey)
      } catch {
        // Ignore storage failures.
      }
    }
    apply()
  }

  // Apply the initial stored/default preference on construction.
  apply()

  return { mode, resolved, isDark, setMode, toggle, enable, disable, reset }
}

let sharedTheme: UseThemeReturn | null = null
let sharedOptions: UseThemeOptions | null = null

/**
 * Returns a single shared theme controller, lazily created on first call.
 * Later calls reuse it; in dev a mismatched options object logs a warning.
 */
export function useTheme(options?: UseThemeOptions): UseThemeReturn {
  if (!sharedTheme) {
    sharedTheme = createTheme(options)
    sharedOptions = options ?? {}
    return sharedTheme
  }

  if (
    import.meta.env.DEV &&
    options !== undefined &&
    !optionsEqual(sharedOptions ?? {}, options)
  ) {
    console.warn(
      '[myghf/ui] useTheme() was called again with different options; reusing the first instance. ' +
        'Call createTheme() for an independent controller.',
    )
  }

  return sharedTheme
}
