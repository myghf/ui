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

  it('reset returns to system even when defaultMode is explicit', () => {
    stubMatchMedia(false)
    const theme = createTheme({ defaultMode: 'dark' })
    expect(theme.mode.value).toBe('dark')
    expect(theme.isDark.value).toBe(true)

    theme.reset()

    expect(theme.mode.value).toBe('system')
    expect(localStorage.getItem('myghf-theme')).toBeNull()
    // 'system' now follows the stubbed OS preference (light).
    expect(theme.isDark.value).toBe(false)
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
