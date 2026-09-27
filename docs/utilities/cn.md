# cn

`cn` joins class names and resolves conflicting Tailwind classes. It is a thin wrapper
around [`clsx`](https://github.com/lukeed/clsx) (for conditional inputs) passed through
[`tailwind-merge`](https://github.com/dcastro/tailwind-merge) (for de-duplication).

Every `@myghf/ui` component runs its own class bindings through `cn`, which is why a
consumer's `class` attribute can override a component's internal utilities.

## Signature

```ts
function cn(...inputs: ClassValue[]): string
```

### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `...inputs` | `ClassValue[]` | Any number of class values: strings, arrays (nested), objects keyed by class name, and falsy values. `ClassValue` is re-exported by `clsx`. |

### Return value

A single, space-separated class string with falsy inputs removed and conflicting Tailwind
utilities collapsed to the **last** one.

## Example

```ts
import { cn } from '@myghf/ui'

cn('px-2 py-1', 'px-4')
// → 'py-1 px-4'  (later px-* wins)

cn('text-sm', isActive && 'font-semibold', { 'opacity-50': disabled })
// → 'text-sm font-semibold opacity-50' when active && !disabled

cn('bg-primary-500', 'bg-error-500')
// → 'bg-error-500'  (same property, last one wins)
```

Because `tailwind-merge` understands Tailwind's conflict groups, it is safe to pass a
default utility and an override together:

```vue
<script setup lang="ts">
import { Button, cn } from '@myghf/ui'

const className = cn('w-full', props.compact && 'w-auto')
</script>

<template>
  <Button :class="className">Save</Button>
</template>
```

Falsy inputs (`false`, `undefined`, `null`, `0`, `''`) are dropped, so conditional
expressions can be written inline without a ternary chain.

## Notes

- **Conflict resolution, not deduplication.** `cn('px-2', 'px-4')` yields `px-4`;
  `cn('p-2', 'px-4')` keeps both, because `px-*` is more specific than `p-*`.
- **Order matters.** Put the base classes first and the overrides after them.
- **Non-Tailwind classes pass through unchanged.** Custom classes and modifier variants are
  preserved.
