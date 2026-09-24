<script setup lang="ts" generic="T = unknown">
import { computed } from 'vue'
import { TreeItem, TreeRoot } from 'reka-ui'
import { ChevronRight } from 'lucide-vue-next'
import { flattenVisible, type TreeNode } from '../../lib/tree'

export interface TreeTableColumn {
  key: string
  header: string
  width?: string
  align?: 'start' | 'center' | 'end'
}

const props = withDefaults(
  defineProps<{
    nodes: TreeNode<T>[]
    columns: TreeTableColumn[]
    expanded?: string[]
    rowLabel?: (node: TreeNode<T>) => string
    rowColumnHeader?: string
  }>(),
  {
    expanded: () => [],
    rowLabel: (node: TreeNode<T>) => node.label ?? node.value,
    rowColumnHeader: 'Name',
  },
)

const emit = defineEmits<{ 'update:expanded': [value: string[]] }>()

const gridTemplate = computed(
  () => `minmax(12rem, 1fr) ${props.columns.map((column) => column.width ?? 'minmax(6rem, 1fr)').join(' ')}`,
)
const flat = computed(() => flattenVisible(props.nodes, props.expanded))
</script>

<template>
  <div class="overflow-hidden rounded-md border border-border bg-surface">
    <div
      class="grid border-b border-border bg-surface-muted/60 text-xs font-medium text-muted"
      :style="{ gridTemplateColumns: gridTemplate }"
    >
      <div class="px-3 py-2">
        <slot name="header">{{ rowColumnHeader }}</slot>
      </div>
      <div
        v-for="column in columns"
        :key="column.key"
        class="px-3 py-2"
        :class="[column.align === 'center' && 'text-center', column.align === 'end' && 'text-end']"
      >
        {{ column.header }}
      </div>
    </div>

    <TreeRoot
      :items="nodes"
      :get-key="(node: TreeNode<T>) => node.value"
      :get-children="(node: TreeNode<T>) => node.children"
      :expanded="expanded"
      @update:expanded="emit('update:expanded', $event as string[])"
    >
      <TreeItem
        v-for="row in flat"
        :key="row.key"
        v-slot="{ isExpanded, handleToggle }"
        :value="row.node"
        :level="row.level"
        as="div"
        class="grid items-center border-b border-border/60 text-sm last:border-b-0 data-[selected]:bg-surface-muted/30"
        :style="{ gridTemplateColumns: gridTemplate }"
      >
        <div class="flex items-center gap-1 px-3 py-2" :style="{ paddingInlineStart: `calc(0.75rem + ${(row.level - 1) * 1.25}rem)` }">
          <button
            v-if="row.hasChildren"
            type="button"
            :aria-label="rowLabel(row.node)"
            class="rounded p-0.5 text-muted transition-transform hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            :class="isExpanded && 'rotate-90'"
            @click.stop="handleToggle"
          >
            <ChevronRight class="size-3.5 rtl:rotate-180" />
          </button>
          <span v-else class="inline-block size-4" />
          <slot name="row-label" :node="row.node" :level="row.level">{{ rowLabel(row.node) }}</slot>
        </div>
        <div
          v-for="column in columns"
          :key="column.key"
          class="px-3 py-2"
          :class="[column.align === 'center' && 'text-center', column.align === 'end' && 'text-end']"
        >
          <slot
            :name="`cell-${column.key}`"
            :node="row.node"
            :row="row"
            :is-expanded="isExpanded"
            :has-children="row.hasChildren"
            :handle-toggle="handleToggle"
          />
        </div>
      </TreeItem>
    </TreeRoot>
  </div>
</template>
