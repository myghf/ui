import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue'

/**
 * Tailwind's default screen scale — the preset declares no custom `screens`,
 * so these values mirror what the `sm:`…`2xl:` variants match against.
 */
export const SCREENS = { sm: 640, md: 768, lg: 1024, xl: 1280, '2xl': 1536 } as const

/** Breakpoints a DataTable column can declare through `meta.hideBelow`. */
export type DataTableHideBelow = keyof typeof SCREENS

/**
 * True while `width` is narrower than `screen`.
 * `isBelow('md', 700)` is true; `isBelow('md', 768)` is not — matching how
 * `md:` variants behave at exactly 768px.
 */
export function isBelow(screen: DataTableHideBelow, width: number): boolean {
  return width < SCREENS[screen]
}

/**
 * Current viewport width in CSS pixels, or `null` until the first mount.
 *
 * `null` before mount keeps SSR and hydration rendering every column (no
 * mismatch); without a DOM or `resize` support it never resolves, so width-driven
 * behavior simply stays off — progressive enhancement. Read it through
 * `isBelow(screen, width)` only when non-null.
 */
export function useViewportWidth(): Ref<number | null> {
  const width = ref<number | null>(null)

  function update(): void {
    width.value = window.innerWidth
  }

  onMounted(() => {
    if (typeof window === 'undefined' || typeof window.addEventListener !== 'function') return
    update()
    window.addEventListener('resize', update, { passive: true })
  })

  onBeforeUnmount(() => {
    if (typeof window !== 'undefined' && typeof window.removeEventListener === 'function') {
      window.removeEventListener('resize', update)
    }
  })

  return width
}
