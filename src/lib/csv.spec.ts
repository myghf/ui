// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest'
import { downloadCsv, toCsv } from './csv'

interface Row {
  name: string
  note: string
  count: number
}

const columns = [
  { id: 'name', header: 'Name' },
  { id: 'note' },
  { id: 'count', header: 'Count', value: (row: Row) => row.count },
]

describe('toCsv', () => {
  it('writes a header row and one row per record, with a BOM by default', () => {
    const csv = toCsv(columns, [{ name: 'Amina', note: 'ok', count: 2 }])
    expect(csv.startsWith('\uFEFF')).toBe(true)
    expect(csv).toBe('\uFEFFName,note,Count\r\nAmina,ok,2')
  })

  it('omits the BOM when asked', () => {
    expect(toCsv(columns, [], { bom: false })).toBe('Name,note,Count')
  })

  it('quotes fields containing a delimiter, quote, or newline and doubles quotes', () => {
    const csv = toCsv(columns, [{ name: 'Farouk, Amina', note: 'said "hi"\nnext', count: 1 }], {
      bom: false,
    })
    expect(csv).toContain('"Farouk, Amina"')
    expect(csv).toContain('"said ""hi""\nnext"')
  })

  it('renders null and undefined as empty fields', () => {
    const csv = toCsv<Row>(
      [
        { id: 'name' },
        { id: 'note', value: () => null },
        { id: 'count', value: () => undefined },
      ],
      [{ name: 'x', note: 'y', count: 0 }],
      { bom: false },
    )
    expect(csv).toBe('name,note,count\r\nx,,')
  })

  it('supports a custom delimiter', () => {
    expect(toCsv(columns, [{ name: 'A', note: 'b', count: 3 }], { delimiter: ';', bom: false })).toBe(
      'Name;note;Count\r\nA;b;3',
    )
  })
})

describe('downloadCsv', () => {
  it('does not throw when there is no DOM', () => {
    vi.stubGlobal('document', undefined)
    try {
      expect(() => downloadCsv('x.csv', 'a,b')).not.toThrow()
    } finally {
      vi.unstubAllGlobals()
    }
  })

  it('creates and clicks a download link in a DOM', () => {
    const createObjectURL = vi.fn(() => 'blob:x')
    const revokeObjectURL = vi.fn()
    vi.stubGlobal('URL', { createObjectURL, revokeObjectURL })
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
    try {
      downloadCsv('rows.csv', 'a,b')
      expect(createObjectURL).toHaveBeenCalled()
      expect(click).toHaveBeenCalled()
      expect(revokeObjectURL).toHaveBeenCalledWith('blob:x')
    } finally {
      click.mockRestore()
      vi.unstubAllGlobals()
    }
  })
})
