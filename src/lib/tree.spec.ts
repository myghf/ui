import { describe, expect, it } from 'vitest'
import { checkedStateOf, filterTree, findNode, flattenVisible, leafKeys, type TreeNode } from './tree'

const tree: TreeNode[] = [
  {
    value: '1',
    label: 'Complaints',
    children: [
      { value: '1-1', label: 'Billing' },
      {
        value: '1-2',
        label: 'Clinical',
        children: [
          { value: '1-2-1', label: 'Wait time' },
          { value: '1-2-2', label: 'Staff' },
        ],
      },
    ],
  },
  { value: '2', label: 'Feedback' },
]

describe('flattenVisible', () => {
  it('hides children of collapsed nodes', () => {
    expect(flattenVisible(tree, []).map((r) => r.key)).toEqual(['1', '2'])
  })

  it('includes children with level and parent of expanded nodes', () => {
    const rows = flattenVisible(tree, ['1'])
    expect(rows.map((r) => [r.key, r.level])).toEqual([
      ['1', 1],
      ['1-1', 2],
      ['1-2', 2],
      ['2', 1],
    ])
    expect(rows[2].parentKey).toBe('1')
  })
})

describe('leafKeys', () => {
  it('collects leaves only', () => {
    expect(leafKeys(tree)).toEqual(['1-1', '1-2-1', '1-2-2', '2'])
  })
})

describe('checkedStateOf', () => {
  it('is unchecked with no selection', () => {
    expect(checkedStateOf(findNode(tree, '1')!, [])).toBe('unchecked')
  })

  it('is indeterminate when only some descendants are selected', () => {
    expect(checkedStateOf(findNode(tree, '1')!, ['1-1'])).toBe('indeterminate')
  })

  it('is checked when every leaf below is selected', () => {
    expect(checkedStateOf(findNode(tree, '1')!, ['1-1', '1-2-1', '1-2-2'])).toBe('checked')
  })

  it('treats a selected leaf as checked', () => {
    expect(checkedStateOf(findNode(tree, '1-1')!, ['1-1'])).toBe('checked')
  })
})

describe('filterTree', () => {
  it('keeps ancestors of matches', () => {
    expect(filterTree(tree, 'staff').map((n) => n.value)).toEqual(['1'])
    expect(filterTree(tree, 'staff')[0].children?.map((n) => n.value)).toEqual(['1-2'])
  })

  it('returns everything for an empty query', () => {
    expect(filterTree(tree, '')).toHaveLength(2)
  })
})
