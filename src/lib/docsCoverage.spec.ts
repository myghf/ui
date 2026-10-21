import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import * as ui from '../index'

/**
 * Explicit map from every public runtime export of `src/index.ts` to the
 * repo-relative docs page (under `docs/`) that documents it. Using an explicit
 * map keeps the guard precise: a new export fails until its page is added, and
 * a stale key fails because it no longer matches a real export.
 *
 * Type-only exports (`export type ...`) are erased at runtime and therefore
 * never appear in `Object.keys(ui)`; they are intentionally not listed here.
 */
const MAP: Record<string, string> = {
  // Utilities
  cn: 'utilities/cn.md',
  dateToValue: 'utilities/date.md',
  valueToDate: 'utilities/date.md',
  toMinutes: 'utilities/date.md',
  toTime: 'utilities/date.md',
  clampTime: 'utilities/date.md',
  sortRange: 'utilities/date.md',
  toISODate: 'utilities/date.md',
  buildHourOptions: 'utilities/date.md',
  buildMinuteOptions: 'utilities/date.md',
  to12Hour: 'utilities/date.md',
  from12Hour: 'utilities/date.md',
  browserLocale: 'utilities/locale.md',
  getFirstDayOfWeek: 'utilities/locale.md',
  getWeekdayLabels: 'utilities/locale.md',
  getMonthLabel: 'utilities/locale.md',
  formatLocalizedDate: 'utilities/locale.md',
  formatLocalizedTime: 'utilities/locale.md',
  addDays: 'utilities/hijri.md',
  hijriParts: 'utilities/hijri.md',
  startOfHijriMonth: 'utilities/hijri.md',
  hijriMonthLength: 'utilities/hijri.md',
  hijriMonthLabel: 'utilities/hijri.md',
  formatHijriDate: 'utilities/hijri.md',
  toNumberOrNull: 'utilities/number.md',
  mergeFormatOptions: 'utilities/number.md',
  formatNumber: 'utilities/number.md',
  formatCurrency: 'utilities/number.md',
  formatPercent: 'utilities/number.md',
  toCsv: 'utilities/csv.md',
  downloadCsv: 'utilities/csv.md',
  toPascalCase: 'utilities/icons.md',
  resolveIconName: 'utilities/icons.md',
  toneClasses: 'utilities/tones.md',

  // Composables
  useTheme: 'composables/use-theme.md',
  createTheme: 'composables/use-theme.md',
  createConfig: 'guide/i18n.md',
  provideMyGhfConfig: 'guide/i18n.md',
  useMyGhfConfig: 'guide/i18n.md',
  myghfConfigKey: 'guide/i18n.md',
  defaultConfig: 'guide/i18n.md',
  useToast: 'composables/use-toast.md',
  createToastStore: 'composables/use-toast.md',
  toastKey: 'composables/use-toast.md',

  // Components — sub-components share their parent page.
  Button: 'components/button.md',
  Tag: 'components/tag.md',
  Alert: 'components/alert.md',
  Message: 'components/alert.md',
  Spinner: 'components/spinner.md',
  Skeleton: 'components/skeleton.md',
  Progress: 'components/progress.md',
  Avatar: 'components/avatar.md',
  ThemeToggle: 'components/theme-toggle.md',
  Icon: 'components/icon.md',
  Input: 'components/input.md',
  InputNumber: 'components/input-number.md',
  Textarea: 'components/textarea.md',
  Password: 'components/password.md',
  FileUpload: 'components/file-upload.md',
  Label: 'components/form-field.md',
  FormField: 'components/form-field.md',
  FormDescription: 'components/form-field.md',
  FormMessage: 'components/form-field.md',
  FormErrors: 'components/form-errors.md',
  useFormField: 'components/form-field.md',
  useFieldControl: 'components/form-field.md',
  Checkbox: 'components/checkbox.md',
  Switch: 'components/switch.md',
  RadioGroup: 'components/radio-group.md',
  Combobox: 'components/combobox.md',
  Tabs: 'components/tabs.md',
  TabsList: 'components/tabs.md',
  TabsTrigger: 'components/tabs.md',
  TabsContent: 'components/tabs.md',
  Select: 'components/select.md',
  SelectButton: 'components/select-button.md',
  DatePicker: 'components/date-picker.md',
  TimePicker: 'components/time-picker.md',
  Dialog: 'components/dialog.md',
  Drawer: 'components/drawer.md',
  DropdownMenu: 'components/dropdown-menu.md',
  DropdownMenuTrigger: 'components/dropdown-menu.md',
  DropdownMenuContent: 'components/dropdown-menu.md',
  DropdownMenuItem: 'components/dropdown-menu.md',
  DropdownMenuSeparator: 'components/dropdown-menu.md',
  DropdownMenuLabel: 'components/dropdown-menu.md',
  DropdownMenuGroup: 'components/dropdown-menu.md',
  Tooltip: 'components/tooltip.md',
  Popover: 'components/popover.md',
  Accordion: 'components/accordion.md',
  AccordionItem: 'components/accordion.md',
  CommandPalette: 'components/command-palette.md',
  TransferList: 'components/transfer-list.md',
  Table: 'components/table.md',
  TableHeader: 'components/table.md',
  TableBody: 'components/table.md',
  TableRow: 'components/table.md',
  TableHead: 'components/table.md',
  TableCell: 'components/table.md',
  TableEmpty: 'components/table.md',
  TablePagination: 'components/table.md',
  DataTable: 'components/data-table.md',
  TreeTable: 'components/tree-table.md',
  TreeSelect: 'components/tree-select.md',
  Toaster: 'components/toast.md',
  Container: 'components/layout.md',
  Stack: 'components/layout.md',
  Inline: 'components/layout.md',
  Grid: 'components/layout.md',
  Breadcrumbs: 'components/page.md',
  PageHeader: 'components/page.md',
  PageContent: 'components/page.md',
  AppShell: 'components/app-shell.md',
  Sidebar: 'components/app-shell.md',
  Topbar: 'components/app-shell.md',
  Sparkline: 'components/charts.md',
  BarChart: 'components/charts.md',
  StatCard: 'components/dashboard.md',
  StatusBadge: 'components/dashboard.md',
  Timeline: 'components/timeline.md',
  TimelineItem: 'components/timeline.md',
  Stepper: 'components/dashboard.md',
}

const docsDir = fileURLToPath(new URL('../../docs', import.meta.url))

describe('docs coverage', () => {
  const exported = Object.keys(ui)

  it('maps every public runtime export to a docs page', () => {
    const unmapped = exported.filter((name) => !(name in MAP))
    expect(unmapped, `exports without a docs page mapping: ${unmapped.join(', ')}`).toEqual([])
  })

  it('does not map names that are not runtime exports', () => {
    const stale = Object.keys(MAP).filter((name) => !exported.includes(name))
    expect(stale, `mapped names that are not exported: ${stale.join(', ')}`).toEqual([])
  })

  it('maps every export to an existing docs file', () => {
    const missing = Object.entries(MAP)
      .filter(([, page]) => !existsSync(`${docsDir}/${page}`))
      .map(([name, page]) => `${name} -> ${page}`)
    expect(missing, `docs pages missing on disk: ${missing.join(', ')}`).toEqual([])
  })
})
