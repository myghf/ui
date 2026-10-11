// @vitest-environment jsdom
import { mount, type VueWrapper } from '@vue/test-utils'
import { createColumnHelper } from '@tanstack/vue-table'
import { afterEach, describe, it } from 'vitest'
import { defineComponent, h, nextTick, type VNode } from 'vue'
import * as UI from './index'
import type { DataTableFeatures } from './lib/table'
import { expectNoA11yViolations } from './test-utils/a11y'

afterEach(() => {
  document.body.innerHTML = ''
})

/**
 * Mounts a generic component whose props collapse to `never` when cast. Only the
 * rendered DOM matters for an axe pass, so the loose options typing is localised here.
 */
const mountAny = mount as unknown as (
  component: unknown,
  options: Record<string, unknown>,
) => VueWrapper

/** Mounts `child` inside a `FormField` with the given props. */
function mountInField(fieldProps: Record<string, unknown>, child: () => VNode): VueWrapper {
  const Host = defineComponent({
    render: () => h(UI.FormField as never, fieldProps, { default: child }),
  })
  return mount(Host)
}

/** Mounts `child` inside a `FormField` so the control has a real accessible name. */
function mountWithLabel(child: () => VNode): VueWrapper {
  return mountInField({ label: 'Field' }, child)
}

/** Throws when axe finds a violation in a bare (non-teleported) component. */
async function expectClean(wrapper: VueWrapper): Promise<void> {
  await expectNoA11yViolations(wrapper)
}

describe('a11y: actions & display', () => {
  it('Button', async () => {
    await expectClean(mount(UI.Button, { slots: { default: () => 'Save' } }))
  })

  it('Button (icon only) has an accessible name', async () => {
    await expectClean(
      mount(UI.Button, {
        props: { size: 'icon', icon: 'plus' },
        attrs: { 'aria-label': 'Add patient' },
      }),
    )
  })

  it('Tag (removable)', async () => {
    await expectClean(
      mount(UI.Tag, { props: { removable: true }, slots: { default: () => 'Cardiology' } }),
    )
  })

  it('Alert', async () => {
    await expectClean(
      mount(UI.Alert, {
        props: { tone: 'warning', title: 'Heads up', description: 'Check the dosage', closable: true },
      }),
    )
  })

  it('Spinner', async () => {
    await expectClean(mount(UI.Spinner))
  })

  it('Skeleton', async () => {
    await expectClean(mount(UI.Skeleton, { props: { width: '8rem', height: '1rem' } }))
  })

  it('Progress', async () => {
    await expectClean(mount(UI.Progress, { props: { modelValue: 40, label: 'Uploading' } }))
  })

  it('FormErrors', async () => {
    await expectClean(
      mount(UI.FormErrors, {
        props: {
          errors: [
            { id: 'email', label: 'Email', message: 'Enter a valid email address' },
            { id: 'phone', message: 'Required' },
          ],
        },
      }),
    )
  })

  it('Avatar (initials)', async () => {
    await expectClean(mount(UI.Avatar, { props: { name: 'Amina Farouk' } }))
  })

  it('Icon (decorative)', async () => {
    await expectClean(mount(UI.Icon, { props: { name: 'heart' } }))
  })
})

describe('a11y: form controls', () => {
  it('Input', async () => {
    await expectClean(mountWithLabel(() => h(UI.Input, { modelValue: '' })))
  })

  it('Textarea', async () => {
    await expectClean(mountWithLabel(() => h(UI.Textarea, { modelValue: '' })))
  })

  it('Password', async () => {
    await expectClean(mountWithLabel(() => h(UI.Password, { modelValue: 'secret' })))
  })

  it('FileUpload', async () => {
    await expectClean(mountWithLabel(() => h(UI.FileUpload)))
  })

  it('Select', async () => {
    await expectClean(
      mountWithLabel(() =>
        h(UI.Select, { modelValue: null, options: [{ label: 'One', value: 1 }] }),
      ),
    )
  })

  it('Checkbox', async () => {
    await expectClean(mount(UI.Checkbox, { attrs: { 'aria-label': 'Accept terms' } }))
  })

  it('Switch', async () => {
    await expectClean(mount(UI.Switch, { attrs: { 'aria-label': 'Enable alerts' } }))
  })

  it('RadioGroup', async () => {
    await expectClean(
      mount(UI.RadioGroup, {
        props: {
          modelValue: 'a',
          options: [
            { label: 'Alpha', value: 'a' },
            { label: 'Beta', value: 'b' },
          ],
        },
      }),
    )
  })

  it('InputNumber', async () => {
    await expectClean(
      mount(UI.InputNumber, { props: { modelValue: 5 }, attrs: { 'aria-label': 'Amount' } }),
    )
  })

  it('SelectButton', async () => {
    await expectClean(
      mount(UI.SelectButton, {
        props: {
          modelValue: 'a',
          options: [
            { label: 'Alpha', value: 'a' },
            { label: 'Beta', value: 'b' },
          ],
        },
        attrs: { 'aria-label': 'Density' },
      }),
    )
  })

  it('DatePicker', async () => {
    await expectClean(mount(UI.DatePicker, { props: { placeholder: 'Select date' } }))
  })

  it('Combobox', async () => {
    await expectClean(
      mountWithLabel(() => h(UI.Combobox, { options: [{ label: 'Alpha', value: 'a' }] })),
    )
  })

  it('TreeSelect', async () => {
    await expectClean(
      mountAny(UI.TreeSelect, {
        props: {
          modelValue: [],
          nodes: [{ value: 'a', label: 'Alpha' }],
        },
        attrs: { 'aria-label': 'Diagnosis' },
      }),
    )
  })

  it('TransferList', async () => {
    await expectClean(
      mount(UI.TransferList, {
        props: {
          modelValue: [],
          options: [
            { value: 'a', label: 'Alpha' },
            { value: 'b', label: 'Beta' },
          ],
        },
      }),
    )
  })
})

describe('a11y: navigation & data', () => {
  it('Tabs', async () => {
    await expectClean(
      mount(UI.Tabs, {
        props: { modelValue: 'one' },
        slots: {
          default: () => [
            h(UI.TabsList as never, null, {
              default: () =>
                h(UI.TabsTrigger as never, { value: 'one' }, { default: () => 'One' }),
            }),
            h(UI.TabsContent as never, { value: 'one' }, { default: () => 'Panel' }),
          ],
        },
      }),
    )
  })

  it('Table primitives', async () => {
    await expectClean(
      mount(UI.Table, {
        slots: {
          default: () => [
            h(UI.TableHeader as never, null, {
              default: () =>
                h(UI.TableRow as never, null, {
                  default: () => h(UI.TableHead as never, null, { default: () => 'Patient' }),
                }),
            }),
            h(UI.TableBody as never, null, {
              default: () =>
                h(UI.TableRow as never, null, {
                  default: () => h(UI.TableCell as never, null, { default: () => 'Amina Farouk' }),
                }),
            }),
          ],
        },
      }),
    )
  })

  it('TablePagination', async () => {
    await expectClean(
      mount(UI.TablePagination, { props: { pageIndex: 0, pageSize: 10, total: 35 } }),
    )
  })

  it('DataTable', async () => {
    const columnHelper = createColumnHelper<DataTableFeatures, { id: string; patient: string }>()
    const columns = columnHelper.columns([columnHelper.accessor('patient', { header: 'Patient' })])
    const data = [{ id: 'r1', patient: 'Amina Farouk' }]
    await expectClean(
      mountAny(UI.DataTable, {
        props: { data, columns, getRowId: (row: { id: string }) => row.id },
      }),
    )
  })

  it('DataTable (loading)', async () => {
    const columnHelper = createColumnHelper<DataTableFeatures, { id: string; patient: string }>()
    const columns = columnHelper.columns([columnHelper.accessor('patient', { header: 'Patient' })])
    await expectClean(mountAny(UI.DataTable, { props: { data: [], columns, loading: true } }))
  })

  it('TreeTable', async () => {
    await expectClean(
      mountAny(UI.TreeTable, {
        props: {
          nodes: [{ value: 'a', label: 'Alpha', children: [{ value: 'b', label: 'Beta' }] }],
          columns: [{ key: 'status', header: 'Status' }],
          expanded: ['a'],
        },
      }),
    )
  })
})

describe('a11y: controls inside FormField', () => {
  const field = { label: 'Field', description: 'Help text', error: 'This field is required', required: true }

  it('Checkbox', async () => {
    await expectClean(mountInField(field, () => h(UI.Checkbox)))
  })

  it('Switch', async () => {
    await expectClean(mountInField(field, () => h(UI.Switch)))
  })

  it('FileUpload', async () => {
    await expectClean(mountInField(field, () => h(UI.FileUpload)))
  })

  it('RadioGroup', async () => {
    await expectClean(
      mountInField(field, () =>
        h(UI.RadioGroup, {
          modelValue: 'a',
          options: [
            { label: 'Alpha', value: 'a' },
            { label: 'Beta', value: 'b' },
          ],
        }),
      ),
    )
  })

  it('InputNumber', async () => {
    await expectClean(mountInField(field, () => h(UI.InputNumber, { modelValue: 5 })))
  })

  it('SelectButton', async () => {
    await expectClean(
      mountInField(field, () =>
        h(UI.SelectButton, {
          modelValue: 'a',
          options: [
            { label: 'Alpha', value: 'a' },
            { label: 'Beta', value: 'b' },
          ],
        }),
      ),
    )
  })

  it('DatePicker', async () => {
    await expectClean(mountInField(field, () => h(UI.DatePicker)))
  })

  it('Combobox', async () => {
    await expectClean(
      mountInField(field, () => h(UI.Combobox, { options: [{ label: 'Alpha', value: 'a' }] })),
    )
  })

  it('TreeSelect', async () => {
    await expectClean(
      mountInField(field, () => h(UI.TreeSelect as never, { nodes: [{ value: 'a', label: 'Alpha' }] })),
    )
  })

  it('TransferList', async () => {
    await expectClean(
      mountInField(field, () => h(UI.TransferList, { options: [{ value: 'a', label: 'Alpha' }] })),
    )
  })
})

describe('a11y: layout', () => {
  it('Container', async () => {
    await expectClean(mount(UI.Container, { slots: { default: () => 'Content' } }))
  })

  it('Stack', async () => {
    await expectClean(mount(UI.Stack, { slots: { default: () => [h('span', 'a'), h('span', 'b')] } }))
  })

  it('Inline', async () => {
    await expectClean(mount(UI.Inline, { slots: { default: () => [h('span', 'a'), h('span', 'b')] } }))
  })

  it('Grid', async () => {
    await expectClean(
      mount(UI.Grid, { props: { cols: 2 }, slots: { default: () => [h('span', 'a'), h('span', 'b')] } }),
    )
  })

  it('Breadcrumbs', async () => {
    await expectClean(
      mount(UI.Breadcrumbs, {
        props: { items: [{ label: 'Home', href: '/' }, { label: 'Patients' }] },
      }),
    )
  })

  it('PageHeader', async () => {
    await expectClean(
      mount(UI.PageHeader, { props: { title: 'Patients', description: 'All records' } }),
    )
  })

  it('PageContent', async () => {
    await expectClean(mount(UI.PageContent, { slots: { default: () => 'Body' } }))
  })
})

describe('a11y: overlays (teleported, asserted on document.body)', () => {
  async function expectBodyClean(): Promise<void> {
    await nextTick()
    await expectNoA11yViolations(document.body)
  }

  it('Dialog', async () => {
    mount(UI.Dialog, {
      props: { visible: true, title: 'Confirm', description: 'This cannot be undone' },
      slots: { default: () => 'Body' },
      attachTo: document.body,
    })
    await expectBodyClean()
  })

  it('Drawer', async () => {
    mount(UI.Drawer, {
      props: { open: true, title: 'Filters' },
      slots: { default: () => 'Body' },
      attachTo: document.body,
    })
    await expectBodyClean()
  })

  it('DropdownMenu', async () => {
    mount(UI.DropdownMenu, {
      props: { open: true },
      slots: {
        default: () => [
          h(UI.DropdownMenuTrigger as never, null, {
            default: () => h(UI.Button as never, null, { default: () => 'Actions' }),
          }),
          h(UI.DropdownMenuContent as never, null, {
            default: () => h(UI.DropdownMenuItem as never, null, { default: () => 'Edit' }),
          }),
        ],
      },
      attachTo: document.body,
    })
    await expectBodyClean()
  })

  it('Toaster (with a toast)', async () => {
    const store = UI.createToastStore()
    mount(UI.Toaster, { props: { store }, attachTo: document.body })
    store.add({ title: 'Saved', description: 'All good' })
    await expectBodyClean()
  })
})
