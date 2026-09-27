// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
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
