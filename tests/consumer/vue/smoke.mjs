/**
 * Consumer smoke test for a plain Vue app: installs the packed
 * tarball as the only copy of `@myghf/ui` and renders components
 * server-side, so the ESM entry, its dependencies, and the
 * runtime exports are all exercised outside this repository.
 */
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import * as ui from '@myghf/ui'

const expected = [
  'Button',
  'Stack',
  'Inline',
  'Tag',
  'Alert',
  'FormField',
  'Input',
  'BarChart',
  'Sparkline',
  'StatCard',
  'Breadcrumbs',
  'DataTable',
  'useFieldControl',
  'toCsv',
  'formatNumber',
]
for (const name of expected) {
  if (!(name in ui)) throw new Error(`missing export: ${name}`)
}

const app = createSSRApp({
  render: () =>
    h('div', [
      h(ui.Button, { variant: 'secondary' }, 'Save'),
      h(ui.FormField, { label: 'Patient name' }, () =>
        h(ui.Input, { placeholder: 'Amina Farouk' }),
      ),
      h(ui.Stack, { gap: 'md' }, () => [
        h(ui.Tag, { tone: 'info' }, 'Info'),
        h(ui.Alert, { tone: 'warning', title: 'Heads up' }, 'Body text'),
      ]),
      h(ui.BarChart, {
        data: [
          { label: 'Cardiology', value: 42 },
          { label: 'Neurology', value: 28 },
        ],
        label: 'Referrals by unit',
        width: 260,
        height: 120,
      }),
      h(ui.Breadcrumbs, {
        items: [{ label: 'Patients', href: '#' }, { label: 'Amina' }],
      }),
    ]),
})

const html = await renderToString(app)
for (const needle of ['Save', 'Patient name', 'Info', 'Heads up', '<svg', 'Patients']) {
  if (!html.includes(needle)) throw new Error(`render is missing: ${needle}`)
}
console.log('vue consumer smoke passed')
