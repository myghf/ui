<script setup lang="ts" generic="T = unknown">
import { computed, ref } from 'vue'
import { PopoverContent, PopoverRoot, PopoverTrigger, TreeItem, TreeRoot } from 'reka-ui'
import { Check, ChevronDown, Search, X } from 'lucide-vue-next'
import Tag from '../tag/Tag.vue'
import {
  checkedStateOf,
  filterTree,
  findNode,
  flattenVisible,
  leafKeys,
  type TreeNode,
} from '../../lib/tree'

const props = withDefaults(
  defineProps<{
    modelValue?: string[]
    nodes: TreeNode<T>[]
    placeholder?: string
    filterable?: boolean
    filterPlaceholder?: string
    disabled?: boolean
    /** Only leaf nodes are selectable (the classification case: parents are groups). */
    leafOnly?: boolean
    size?: 'sm' | 'default'
  }>(),
  {
    modelValue: () => [],
    placeholder: 'Select',
    filterable: true,
    filterPlaceholder: 'Search',
    leafOnly: true,
    size: 'default',
  },
)

const emit = defineEmits<{ 'update:modelValue': [value: string[]] }>()

const open = ref(false)
const query = ref('')
const expanded = ref<string[]>([])

const visibleNodes = computed(() => filterTree(props.nodes, query.value))
const rows = computed(() => flattenVisible(visibleNodes.value, expanded.value))
const leaves = computed(() => leafKeys(props.nodes))
const selectedItems = computed(() =>
  props.modelValue
    .map((key) => findNode(props.nodes, key))
    .filter((node): node is TreeNode<T> => Boolean(node)),
)

/** Derived from the selected leaf keys, so partially selected parents read correctly. */
function stateOf(node: TreeNode<T>) {
  return checkedStateOf(node, props.modelValue)
}

function onUpdateItems(value: unknown) {
  const items = Array.isArray(value) ? (value as TreeNode<T>[]) : []
  const keys = items.map((item) => item.value)
  emit('update:modelValue', props.leafOnly ? keys.filter((key) => leaves.value.includes(key)) : keys)
}
</script>

<template>
  <PopoverRoot v-model:open="open">
    <PopoverTrigger as-child :disabled="disabled">
      <button
        type="button"
        :disabled="disabled"
        :class="[
          'flex w-full items-center justify-between gap-2 rounded-md border border-border bg-surface px-3 text-start text-sm text-foreground shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50',
          size === 'sm' ? 'min-h-8 py-1 text-xs' : 'min-h-9 py-1.5',
        ]"
      >
        <span v-if="selectedItems.length === 0" class="truncate text-muted">{{ placeholder }}</span>
        <span v-else class="flex flex-wrap items-center gap-1">
          <Tag v-for="node in selectedItems" :key="node.value" tone="secondary">{{ node.label ?? node.value }}</Tag>
        </span>
        <ChevronDown class="size-4 shrink-0 opacity-50" />
      </button>
    </PopoverTrigger>

    <PopoverContent :side-offset="4" class="z-50 w-72 rounded-md border border-border bg-surface p-2 shadow-popover">
      <div v-if="filterable" class="relative mb-2">
        <Search class="pointer-events-none absolute start-2 top-1/2 size-3.5 -translate-y-1/2 text-muted" />
        <input
          v-model="query"
          :placeholder="filterPlaceholder"
          class="w-full rounded-md border border-border bg-surface py-1.5 pe-2 ps-7 text-sm placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
        />
      </div>

      <TreeRoot
        :model-value="selectedItems"
        :items="visibleNodes"
        :get-key="(node: TreeNode<T>) => node.value"
        :get-children="(node: TreeNode<T>) => node.children"
        v-model:expanded="expanded"
        multiple
        bubble-select
        @update:model-value="onUpdateItems"
      >
        <TreeItem
          v-for="row in rows"
          :key="row.key"
          :value="row.node"
          :level="row.level"
          as="div"
          class="flex items-center gap-2 rounded py-1.5 text-sm text-foreground data-[selected]:bg-surface-muted/50"
          :style="{ paddingInlineStart: `calc(0.5rem + ${(row.level - 1) * 1}rem)` }"
        >
          <span
            class="flex size-4 shrink-0 items-center justify-center rounded border border-border"
            :class="stateOf(row.node) !== 'unchecked' && 'border-primary-500 bg-primary-500 text-white'"
            aria-hidden="true"
          >
            <Check v-if="stateOf(row.node) === 'checked'" class="size-3" />
            <span v-else-if="stateOf(row.node) === 'indeterminate'" class="block h-0.5 w-2 rounded bg-white" />
          </span>
          <span class="truncate">{{ row.node.label ?? row.node.value }}</span>
        </TreeItem>
      </TreeRoot>

      <div v-if="modelValue.length" class="mt-2 flex justify-end border-t border-border pt-2">
        <button
          type="button"
          class="inline-flex items-center gap-1 rounded px-2 py-1 text-xs text-muted hover:bg-surface-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          @click="emit('update:modelValue', [])"
        >
          <X class="size-3" />Clear
        </button>
      </div>
    </PopoverContent>
  </PopoverRoot>
</template>
