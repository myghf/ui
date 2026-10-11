import { describe, expect, it } from 'vitest'
import * as ui from './index'

// Every public export the app depends on. Guards the move against a dropped file.
const EXPECTED = [
  'cn', 'toNumberOrNull', 'mergeFormatOptions', 'formatNumber', 'formatCurrency', 'formatPercent', 'toCsv', 'downloadCsv', 'toPascalCase', 'resolveIconName', 'toneClasses', 'Icon',
  'getFirstDayOfWeek', 'getWeekdayLabels', 'getMonthLabel', 'formatLocalizedDate', 'formatLocalizedTime',
  'addDays', 'hijriParts', 'startOfHijriMonth', 'hijriMonthLength', 'hijriMonthLabel', 'formatHijriDate',
  'Button', 'Input', 'InputNumber', 'Textarea', 'Password', 'FileUpload', 'Checkbox', 'Switch', 'RadioGroup', 'Combobox', 'Tag',
  'Label', 'FormField', 'FormDescription', 'FormMessage', 'FormErrors', 'useFormField', 'useFieldControl',
  'Alert', 'Message', 'Spinner', 'Skeleton', 'Progress', 'Avatar',
  'Tabs', 'TabsList', 'TabsTrigger', 'TabsContent',
  'Select', 'SelectButton', 'DatePicker', 'Dialog',
  'Drawer',
  'DropdownMenu', 'DropdownMenuTrigger', 'DropdownMenuContent', 'DropdownMenuItem',
  'DropdownMenuSeparator', 'DropdownMenuLabel', 'DropdownMenuGroup',
  'Tooltip', 'Popover', 'Accordion', 'AccordionItem',
  'TransferList',
  'Table', 'TableHeader', 'TableBody', 'TableRow', 'TableHead', 'TableCell',
  'TableEmpty', 'TablePagination', 'DataTable', 'TreeTable', 'TreeSelect',
  'useTheme', 'createTheme', 'ThemeToggle',
  'createConfig', 'provideMyGhfConfig', 'useMyGhfConfig', 'myghfConfigKey', 'defaultConfig',
  'Toaster', 'useToast', 'createToastStore',
  'Container', 'Stack', 'Inline', 'Grid', 'Breadcrumbs', 'PageHeader', 'PageContent',
  'AppShell', 'Sidebar', 'Topbar', 'Sparkline', 'BarChart',
  'StatCard', 'StatusBadge', 'Timeline', 'TimelineItem', 'Stepper',
]

describe('@myghf/ui barrel', () => {
  it('exports every documented component and helper', () => {
    for (const name of EXPECTED) expect(ui).toHaveProperty(name)
  })
})
