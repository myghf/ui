// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { h } from 'vue'
import FormField from '../form-field/FormField.vue'
import FileUpload from './FileUpload.vue'

function makeFile(name = 'referral.pdf', bytes = 2048): File {
  return new File([new Uint8Array(bytes)], name, { type: 'application/pdf' })
}

/** jsdom has no file picker, so set `files` directly before triggering `change`. */
function setFiles(wrapper: ReturnType<typeof mount>, files: File[]) {
  const input = wrapper.get('input[type="file"]').element as HTMLInputElement
  Object.defineProperty(input, 'files', { value: files, configurable: true })
}

describe('FileUpload', () => {
  it('renders a file input and forwards accept/multiple', () => {
    const input = mount(FileUpload, { props: { accept: '.pdf', multiple: true } }).get('input[type="file"]')
    expect(input.attributes('accept')).toBe('.pdf')
    expect(input.attributes('multiple')).toBeDefined()
  })

  it('replaces the selection when not multiple', async () => {
    const onUpdate = vi.fn()
    const wrapper = mount(FileUpload, { props: { 'onUpdate:modelValue': onUpdate } })
    setFiles(wrapper, [makeFile('a.pdf')])
    await wrapper.get('input[type="file"]').trigger('change')
    expect(onUpdate).toHaveBeenCalledTimes(1)
    expect((onUpdate.mock.calls[0][0] as File[]).map((f) => f.name)).toEqual(['a.pdf'])
  })

  it('appends to the selection when multiple', async () => {
    const onUpdate = vi.fn()
    const wrapper = mount(FileUpload, {
      props: { multiple: true, modelValue: [makeFile('a.pdf')], 'onUpdate:modelValue': onUpdate },
    })
    setFiles(wrapper, [makeFile('b.pdf')])
    await wrapper.get('input[type="file"]').trigger('change')
    expect((onUpdate.mock.calls[0][0] as File[]).map((f) => f.name)).toEqual(['a.pdf', 'b.pdf'])
  })

  it('lists each file with its name and formatted size', () => {
    const wrapper = mount(FileUpload, { props: { modelValue: [makeFile('scan.pdf', 2048)] } })
    expect(wrapper.text()).toContain('scan.pdf')
    expect(wrapper.text()).toContain('2.0 KB')
  })

  it('emits remove and drops the file from the value', async () => {
    const file = makeFile('a.pdf')
    const onUpdate = vi.fn()
    const onRemove = vi.fn()
    const wrapper = mount(FileUpload, {
      props: { modelValue: [file], 'onUpdate:modelValue': onUpdate, onRemove },
    })
    await wrapper.get('button').trigger('click')
    expect(onRemove).toHaveBeenCalledWith(file)
    expect(onUpdate).toHaveBeenCalledWith([])
  })

  it('shows a progress bar only when progressFor returns a value', () => {
    const wrapper = mount(FileUpload, {
      props: { modelValue: [makeFile('a.pdf')], progressFor: () => null },
    })
    expect(wrapper.find('[role="progressbar"]').exists()).toBe(false)

    const withProgress = mount(FileUpload, {
      props: { modelValue: [makeFile('a.pdf')], progressFor: () => 60 },
    })
    expect(withProgress.get('[role="progressbar"]').attributes('aria-valuenow')).toBe('60')
  })

  it('disables the input', () => {
    expect(mount(FileUpload, { props: { disabled: true } }).get('input[type="file"]').attributes('disabled')).toBeDefined()
  })
})

describe('FileUpload form-field wiring', () => {
  it('wires id, describedby, invalid and required from a FormField', () => {
    const wrapper = mount(FormField, {
      props: { id: 'docs', description: 'Help', error: 'Required', required: true },
      slots: { default: () => h(FileUpload) },
    })
    const input = wrapper.get('input[type="file"]')
    expect(input.attributes('id')).toBe('docs')
    expect(input.attributes('aria-describedby')).toBe('docs-description docs-error')
    expect(input.attributes('aria-invalid')).toBe('true')
    expect(input.attributes('required')).toBeDefined()
  })

  it('renders without aria wiring when there is no FormField', () => {
    const input = mount(FileUpload).get('input[type="file"]')
    expect(input.attributes('aria-invalid')).toBeUndefined()
    expect(input.attributes('aria-describedby')).toBeUndefined()
  })
})
