import { createColumnHelper, useTable } from '@tanstack/vue-table'
import { effectScope } from 'vue'
import { describe, expect, it } from 'vitest'
import { dataTableFeatures } from './table'

type Person = { id: string; name: string; age: number }

const people: Person[] = [
  { id: 'a', name: 'Zoe', age: 30 },
  { id: 'b', name: 'Amir', age: 20 },
  { id: 'c', name: 'Bella', age: 40 },
]

function makeTable() {
  const columnHelper = createColumnHelper<typeof dataTableFeatures, Person>()
  const columns = columnHelper.columns([
    columnHelper.accessor('name', { header: 'Name' }),
    columnHelper.accessor('age', { header: 'Age' }),
  ])
  const scope = effectScope()
  const table = scope.run(() =>
    useTable({
      features: dataTableFeatures,
      columns,
      data: people,
      getRowId: (row: Person) => row.id,
      // v9 defaults this to "row has subRows"; our flat tables expand rows by id.
      getRowCanExpand: () => true,
    }),
  )!
  return { table, scope }
}

describe('dataTableFeatures', () => {
  it('sorts rows through the sorting row model', () => {
    const { table, scope } = makeTable()
    table.getColumn('name')!.toggleSorting(false)
    expect(table.getRowModel().rows.map((r) => r.original.name)).toEqual(['Amir', 'Bella', 'Zoe'])
    scope.stop()
  })

  it('paginates through the pagination row model', () => {
    const { table, scope } = makeTable()
    table.setPageSize(2)
    expect(table.getRowModel().rows).toHaveLength(2)
    expect(table.getPageCount()).toBe(2)
    table.nextPage()
    expect(table.getRowModel().rows).toHaveLength(1)
    scope.stop()
  })

  it('expands a row through the expanding row model', () => {
    const { table, scope } = makeTable()
    const row = table.getRowModel().rows[0]
    expect(row.getIsExpanded()).toBe(false)
    row.toggleExpanded()
    expect(table.getRowModel().rows[0].getIsExpanded()).toBe(true)
    scope.stop()
  })
})
