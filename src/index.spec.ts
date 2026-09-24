import { describe, expect, it } from 'vitest'
import * as ui from './index'

// Every public export the app depends on. Guards the move against a dropped file.
const EXPECTED = [
  'cn', 'toPascalCase', 'resolveIconName', 'Icon',
  'Button', 'Input', 'Textarea', 'Password', 'Checkbox', 'Tag',
  'Tabs', 'TabsList', 'TabsTrigger', 'TabsContent',
  'Select', 'SelectButton', 'DatePicker', 'Dialog',
  'DropdownMenu', 'DropdownMenuTrigger', 'DropdownMenuContent', 'DropdownMenuItem',
  'TransferList',
  'Table', 'TableHeader', 'TableBody', 'TableRow', 'TableHead', 'TableCell',
  'TableEmpty', 'TablePagination', 'DataTable', 'TreeTable', 'TreeSelect',
]

describe('@myghf/ui barrel', () => {
  it('exports every documented component and helper', () => {
    for (const name of EXPECTED) expect(ui).toHaveProperty(name)
  })
})
