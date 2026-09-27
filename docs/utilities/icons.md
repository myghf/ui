# icons

Helpers that normalise Lucide icon names. They power the [Icon](/components/icon) component
and know nothing about rendering themselves.

::: tip Three icon pages, three scopes
- **[Icon component](/components/icon)** — the `Icon` API (props, fallback, a11y).
- **[Icons guide](/guide/icons)** — usage guidance and Lucide naming conventions.
- **This page** — the `toPascalCase` and `resolveIconName` helper functions.
:::

## `toPascalCase(name)`

```ts
function toPascalCase(name: string): string
```

Converts a name to PascalCase by splitting on `-` and capitalising the first letter of each
part. This is the form `lucide-vue-next` uses for its component exports.

### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `name` | `string` | A kebab-case icon name, for example `'chevron-down'`. |

### Return value

The PascalCase name. An empty string returns an empty string; other separators are not
treated specially.

### Example

```ts
import { toPascalCase } from '@myghf/ui'

toPascalCase('chevron-down') // → 'ChevronDown'
toPascalCase('sort-amount-down-alt') // → 'SortAmountDownAlt'
toPascalCase('heart') // → 'Heart'
```

## `resolveIconName(name)`

```ts
function resolveIconName(name: string): string
```

Normalises a Lucide icon reference to a **kebab-case** name. It trims surrounding
whitespace, inserts a `-` at lower-to-upper boundaries, and lowercases everything. An empty
or whitespace-only name falls back to `'circle'` rather than returning an empty string, so a
missing icon shows a visible gap instead of rendering nothing.

### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `name` | `string` | Any accepted spelling: `'heart'`, `'chart-line'`, or `'ChevronDown'`. |

### Return value

The kebab-case name, or `'circle'` when the trimmed input is empty.

### Example

```ts
import { resolveIconName } from '@myghf/ui'

resolveIconName('heart') // → 'heart'
resolveIconName('chart-line') // → 'chart-line'
resolveIconName('ChevronDown') // → 'chevron-down'
resolveIconName('  Star  ') // → 'star'
resolveIconName('') // → 'circle'
```

## Combining the two

`Icon` runs `resolveIconName` first and `toPascalCase` second before indexing the
`lucide-vue-next` exports:

```ts
import { resolveIconName, toPascalCase } from '@myghf/ui'

const kebab = resolveIconName('ChevronDown') // → 'chevron-down'
const componentName = toPascalCase(kebab) // → 'ChevronDown'
```

So `name="chartLine"`, `name="chart-line"`, and `name="chart_line"` are not all equivalent:
the first two resolve to `chart-line`, while the underscore form is left untouched and
therefore does not match a Lucide export (it falls back to a circle). Prefer kebab-case.
