// @vitest-environment jsdom
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import Dialog from './Dialog.vue'

// The dialog content is portalled into `document.body`, outside the wrapper, so
// unmounting is what keeps one test's dialog out of the next test's queries.
enableAutoUnmount(afterEach)

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
