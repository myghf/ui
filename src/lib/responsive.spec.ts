// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent, h, type Ref } from 'vue'
import { SCREENS, isBelow, useViewportWidth } from './responsive'

const DEFAULT_INNER_WIDTH = 1024

function setInnerWidth(value: number): void {
  Object.defineProperty(window, 'innerWidth', { value, configurable: true, writable: true })
  window.dispatchEvent(new Event('resize'))
}

/** Mounts a host whose only state is the composable's ref. */
function mountViewport(): Ref<number | null> {
  let width: Ref<number | null> | undefined
  const Host = defineComponent({
    setup() {
      width = useViewportWidth()
      return () => h('div')
    },
  })
  mount(Host)
  if (!width) throw new Error('useViewportWidth() was not called during setup')
  return width
}

afterEach(() => {
  setInnerWidth(DEFAULT_INNER_WIDTH)
})

describe('isBelow', () => {
  it('matches Tailwind semantics: narrower than the screen, exclusive at the boundary', () => {
    expect(isBelow('md', 767)).toBe(true)
    expect(isBelow('md', 768)).toBe(false)
    expect(isBelow('sm', 639)).toBe(true)
    expect(isBelow('sm', 640)).toBe(false)
    expect(isBelow('2xl', 1535)).toBe(true)
    expect(isBelow('2xl', 1536)).toBe(false)
  })

  it('mirrors the Tailwind default scale', () => {
    expect(SCREENS).toEqual({ sm: 640, md: 768, lg: 1024, xl: 1280, '2xl': 1536 })
  })
})

describe('useViewportWidth', () => {
  it('is null before mount so SSR renders unhidden', () => {
    let width: Ref<number | null> | undefined
    const Host = defineComponent({
      setup() {
        width = useViewportWidth()
        expect(width.value).toBeNull()
        return () => h('div')
      },
    })
    mount(Host)
    expect(width!.value).toBe(DEFAULT_INNER_WIDTH)
  })

  it('follows resize events', () => {
    const width = mountViewport()
    expect(width.value).toBe(DEFAULT_INNER_WIDTH)
    setInnerWidth(500)
    expect(width.value).toBe(500)
  })

  it('stops listening once unmounted', () => {
    let width: Ref<number | null> | undefined
    const Host = defineComponent({
      setup() {
        width = useViewportWidth()
        return () => h('div')
      },
    })
    const wrapper = mount(Host)
    expect(width!.value).toBe(DEFAULT_INNER_WIDTH)
    wrapper.unmount()
    setInnerWidth(900)
    expect(width!.value).toBe(DEFAULT_INNER_WIDTH)
  })

  it('stays null when resize listening is unavailable (SSR guard)', () => {
    const original = window.addEventListener
    Object.defineProperty(window, 'addEventListener', {
      value: undefined,
      configurable: true,
      writable: true,
    })
    try {
      const width = mountViewport()
      expect(width.value).toBeNull()
    } finally {
      Object.defineProperty(window, 'addEventListener', { value: original, configurable: true })
    }
  })
})
