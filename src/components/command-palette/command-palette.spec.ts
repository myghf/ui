// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import CommandPalette from './CommandPalette.vue'

const items = [
  { id: 'new-patient', label: 'New patient', description: 'Register an admission', group: 'Patients', icon: 'plus' },
  { id: 'settings', label: 'Settings', group: 'App' },
]

function openPalette(props: Record<string, unknown> = {}) {
  return mount(CommandPalette, { props: { open: true, items, ...props }, attachTo: document.body })
}

const input = () => document.body.querySelector('input') as HTMLInputElement
const firstResult = () => document.body.querySelector('li button') as HTMLButtonElement

afterEach(() => {
  document.body.innerHTML = ''
})

describe('CommandPalette', () => {
  it('renders nothing while closed', () => {
    mount(CommandPalette, { props: { open: false, items }, attachTo: document.body })
    expect(document.body.textContent).not.toContain('New patient')
  })

  it('lists the items when open', async () => {
    openPalette()
    await nextTick()
    expect(document.body.textContent).toContain('New patient')
    expect(document.body.textContent).toContain('Settings')
  })

  it('filters items by the query', async () => {
    openPalette()
    await nextTick()
    input().value = 'settings'
    input().dispatchEvent(new Event('input'))
    await nextTick()
    expect(document.body.textContent).toContain('Settings')
    expect(document.body.textContent).not.toContain('New patient')
  })

  it('shows the empty label when nothing matches', async () => {
    openPalette({ emptyLabel: 'Nothing here' })
    await nextTick()
    input().value = 'zzzz'
    input().dispatchEvent(new Event('input'))
    await nextTick()
    expect(document.body.textContent).toContain('Nothing here')
  })

  it('emits select and closes when an item is clicked', async () => {
    const onSelect = vi.fn()
    const onUpdate = vi.fn()
    openPalette({ onSelect, 'onUpdate:open': onUpdate })
    await nextTick()
    firstResult().click()
    await nextTick()
    expect(onSelect).toHaveBeenCalledWith(items[0])
    expect(onUpdate).toHaveBeenCalledWith(false)
  })

  it('moves focus to the first item on ArrowDown', async () => {
    openPalette()
    await nextTick()
    input().dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    await nextTick()
    await nextTick()
    expect(document.activeElement?.textContent).toContain('New patient')
  })
})
