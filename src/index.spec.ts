import { describe, expect, it } from 'vitest'
import * as ui from './index'

// Every public export the app depends on. Guards the move against a dropped file.
const EXPECTED = [
  'cn', 'toNumberOrNull', 'mergeFormatOptions', 'toPascalCase', 'resolveIconName', 'toneClasses', 'Icon',
  'Button', 'Input', 'InputNumber', 'Textarea', 'Password', 'Checkbox', 'Tag',
  'Alert', 'Message',
  'Tabs', 'TabsList', 'TabsTrigger', 'TabsContent',
  'Select', 'SelectButton', 'DatePicker', 'Dialog',
  'Drawer',
  'DropdownMenu', 'DropdownMenuTrigger', 'DropdownMenuContent', 'DropdownMenuItem',
  'TransferList',
  'Table', 'TableHeader', 'TableBody', 'TableRow', 'TableHead', 'TableCell',
  'TableEmpty', 'TablePagination', 'DataTable', 'TreeTable', 'TreeSelect',
  'useTheme', 'createTheme', 'ThemeToggle',
  'Toaster', 'useToast', 'createToastStore',
]

describe('@myghf/ui barrel', () => {
  it('exports every documented component and helper', () => {
    for (const name of EXPECTED) expect(ui).toHaveProperty(name)
  })
})
