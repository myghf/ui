// @vitest-environment jsdom
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import Dialog from './Dialog.vue'

// The dialog content is portalled into `document.body`, outside the wrapper, so
// unmounting is what keeps one test's dialog out of the next test's queries.
enableAutoUnmount(afterEach)

/** Captures `console.warn` output — reka-ui's a11y warnings go through it. */
function captureWarnings() {
  const seen: string[] = []
  const spy = vi.spyOn(console, 'warn').mockImplementation((...args: unknown[]) => {
    seen.push(args.map(String).join(' '))
  })
  return { seen, restore: () => spy.mockRestore() }
}

/**
 * jsdom performs no layout, so this file can only lock in the structure that
 * makes scrolling possible — the behaviour itself needs a real engine:
 *
 *   `overflow-hidden` clips the body, and the body only scrolls if it is
 *   height-constrained. That requires the content to be a flex column with the
 *   body as the flexible child; otherwise the body simply grows to its content
 *   height, `scrollHeight === clientHeight`, `overflow-y-auto` never engages,
 *   and the overflow is clipped rather than scrolled.
 */
async function open(slots?: Record<string, () => string>) {
  const wrapper = mount(Dialog, { props: { visible: true, title: 'Title' }, slots })
  await nextTick()
  return wrapper
}

/** The content is portalled into `document.body`. */
function content(): HTMLElement {
  const el = document.body.querySelector('[role="dialog"]')
  if (!el) throw new Error('dialog content not found')
  return el as HTMLElement
}

describe('Dialog', () => {
  it('lays the content out as a flex column', async () => {
    await open({ default: () => 'Body' })
    expect(content().className).toContain('flex-col')
  })

  it('makes the body the flexible scroll region', async () => {
    await open({ default: () => 'Body' })
    const body = content().querySelector('.overflow-y-auto')

    expect(body).not.toBeNull()
    expect((body as HTMLElement).className).toContain('flex-1')
  })

  it('keeps the header and footer from shrinking', async () => {
    await open({ default: () => 'Body', footer: () => 'OK' })
    const el = content()

    expect((el.firstElementChild as HTMLElement).className).toContain('shrink-0')
    expect((el.lastElementChild as HTMLElement).className).toContain('shrink-0')
  })
})

/**
 * reka-ui generates a title and a description id for every dialog and always
 * points `aria-labelledby` / `aria-describedby` at them. The attributes only
 * resolve if the matching `DialogTitle` / `DialogDescription` actually renders,
 * so an optional one that is skipped leaves a dangling reference — reka warns,
 * and screen readers get an id that resolves to nothing.
 *
 * A dialog must always be *named*, so a missing title gets a visually hidden
 * one. A description is genuinely optional, so the reference is dropped rather
 * than pointing at something that does not exist.
 */
describe('Dialog accessibility references', () => {
  it('resolves aria-labelledby when no title is given', async () => {
    const warn = captureWarnings()
    mount(Dialog, { props: { visible: true }, slots: { default: () => 'Body' } })
    await nextTick()

    expect(warn.seen.filter((w) => w.includes('requires a `DialogTitle`'))).toEqual([])
    expect(document.getElementById(content().getAttribute('aria-labelledby') ?? '')).not.toBeNull()
    warn.restore()
  })

  it('resolves aria-labelledby from the title prop', async () => {
    mount(Dialog, { props: { visible: true, title: 'Title' } })
    await nextTick()

    expect(document.getElementById(content().getAttribute('aria-labelledby') ?? '')).not.toBeNull()
  })

  it('drops aria-describedby when no description is given', async () => {
    const warn = captureWarnings()
    mount(Dialog, { props: { visible: true, title: 'Title' }, slots: { default: () => 'Body' } })
    await nextTick()

    expect(warn.seen.filter((w) => w.includes('Missing `Description`'))).toEqual([])
    expect(content().getAttribute('aria-describedby')).toBeNull()
  })

  it('resolves aria-describedby from the description prop', async () => {
    const warn = captureWarnings()
    mount(Dialog, { props: { visible: true, title: 'Title', description: 'Help' } })
    await nextTick()

    expect(warn.seen).toEqual([])
    expect(document.getElementById(content().getAttribute('aria-describedby') ?? '')).not.toBeNull()
  })

  it('resolves aria-describedby from the description slot', async () => {
    mount(Dialog, {
      props: { visible: true, title: 'Title' },
      slots: { default: () => 'Body', description: () => 'Slotted help' },
    })
    await nextTick()

    const describedBy = content().getAttribute('aria-describedby')
    expect(describedBy).not.toBeNull()
    expect(document.getElementById(describedBy ?? '')?.textContent).toBe('Slotted help')
  })
})
