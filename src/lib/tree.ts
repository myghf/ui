export interface TreeNode<T = unknown> {
  /** Stable key; also the value emitted by TreeSelect and TreeTable. */
  value: string
  label?: string
  disabled?: boolean
  children?: TreeNode<T>[]
  data?: T
}

export interface FlatTreeRow<T = unknown> {
  node: TreeNode<T>
  key: string
  level: number
  parentKey: string | null
  hasChildren: boolean
}

export function flattenVisible<T>(
  nodes: TreeNode<T>[],
  expanded: string[],
  level = 1,
  parentKey: string | null = null,
): FlatTreeRow<T>[] {
  return nodes.flatMap((node) => {
    const row: FlatTreeRow<T> = {
      node,
      key: node.value,
      level,
      parentKey,
      hasChildren: Boolean(node.children?.length),
    }
    if (!row.hasChildren || !expanded.includes(node.value)) return [row]
    return [row, ...flattenVisible(node.children!, expanded, level + 1, node.value)]
  })
}

export function findNode<T>(nodes: TreeNode<T>[], key: string): TreeNode<T> | undefined {
  for (const node of nodes) {
    if (node.value === key) return node
    const hit = node.children ? findNode(node.children, key) : undefined
    if (hit) return hit
  }
  return undefined
}

export function leafKeys<T>(nodes: TreeNode<T>[]): string[] {
  return nodes.flatMap((node) =>
    node.children?.length ? leafKeys(node.children) : [node.value],
  )
}

export type CheckedState = 'checked' | 'indeterminate' | 'unchecked'

/**
 * Replaces the app's `Record<key, { checked, partialChecked }>` store shape:
 * the package contract is the flat list of selected leaf keys, and this derives
 * per-node state from it.
 */
export function checkedStateOf<T>(node: TreeNode<T>, selectedLeafKeys: string[]): CheckedState {
  const leaves = node.children?.length ? leafKeys([node]) : [node.value]
  const selected = leaves.filter((key) => selectedLeafKeys.includes(key)).length
  if (selected === 0) return 'unchecked'
  return selected === leaves.length ? 'checked' : 'indeterminate'
}

/** Keeps a node when it matches or any descendant does; drops empty branches. */
export function filterTree<T>(
  nodes: TreeNode<T>[],
  query: string,
  labelOf: (node: TreeNode<T>) => string = (node) => node.label ?? '',
): TreeNode<T>[] {
  const needle = query.trim().toLowerCase()
  if (!needle) return nodes
  return nodes.reduce<TreeNode<T>[]>((acc, node) => {
    const children = node.children ? filterTree(node.children, query, labelOf) : undefined
    const matches = labelOf(node).toLowerCase().includes(needle)
    if (!matches && (!children || children.length === 0)) return acc
    acc.push({ ...node, children })
    return acc
  }, [])
}
