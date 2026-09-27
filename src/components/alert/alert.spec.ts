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

  it('pauses auto-dismiss while focused and resumes on blur', async () => {
    const onClose = vi.fn()
    const wrapper = mount(Alert, { props: { duration: 1000, onClose } })
    await wrapper.trigger('focusin')
    vi.advanceTimersByTime(5000)
    expect(onClose).not.toHaveBeenCalled()
    await wrapper.trigger('focusout')
    vi.advanceTimersByTime(1000)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('stays paused until both hover and focus are released', async () => {
    const onClose = vi.fn()
    const wrapper = mount(Alert, { props: { duration: 1000, onClose } })
    await wrapper.trigger('mouseenter')
    await wrapper.trigger('focusin')
    // Releasing the pointer must not resume while the alert is still focused.
    await wrapper.trigger('mouseleave')
    vi.advanceTimersByTime(5000)
    expect(onClose).not.toHaveBeenCalled()
    await wrapper.trigger('focusout')
    vi.advanceTimersByTime(1000)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('dismisses immediately when paused at or past the deadline', async () => {
    const onClose = vi.fn()
    const wrapper = mount(Alert, { props: { duration: 1000, onClose } })
    // Advance the clock to the deadline without running the pending timer, so
    // the pause computes zero remaining time.
    vi.setSystemTime(Date.now() + 1000)
    await wrapper.trigger('mouseenter')
    await wrapper.trigger('mouseleave')
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('clears its timer on unmount', () => {
    const onClose = vi.fn()
    mount(Alert, { props: { duration: 1000, onClose } }).unmount()
    vi.advanceTimersByTime(5000)
    expect(onClose).not.toHaveBeenCalled()
  })
})
