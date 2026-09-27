# number

Helpers for numeric form fields. `toNumberOrNull` normalises an optional value, and
`mergeFormatOptions` composes `Intl.NumberFormat` options with a predictable precedence.
Both are used by [InputNumber](/components/input-number).

## `toNumberOrNull(value)`

```ts
function toNumberOrNull(value: number | null | undefined): number | null
```

Normalises a numeric field value: empty and non-finite inputs collapse to `null`, while `0`
and every other finite number pass through unchanged.

### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `value` | `number \| null \| undefined` | The raw field value. |

### Return value

`number | null` — the original finite number, or `null` for `null`, `undefined`, `NaN`, and
`Infinity`.

### Example

```ts
import { toNumberOrNull } from '@myghf/ui'

toNumberOrNull(0) // → 0      (zero is kept, not treated as empty)
toNumberOrNull(2.5) // → 2.5
toNumberOrNull(null) // → null
toNumberOrNull(undefined) // → null
toNumberOrNull(Number.NaN) // → null

const amount = toNumberOrNull(rawInput) // null when the field is blank
const isValid = amount !== null
```

## `mergeFormatOptions(input)`

```ts
function mergeFormatOptions(input: {
  currency?: string
  formatOptions?: Intl.NumberFormatOptions
  integer?: boolean
}): Intl.NumberFormatOptions
```

Composes the `Intl.NumberFormatOptions` for a number field from three optional sources, with
a fixed precedence: **`currency` → `formatOptions` → `integer`**. Later sources win, so an
explicit `formatOptions` entry overrides the `currency` shorthand, and `integer` forces zero
fraction digits regardless of what came before.

### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `currency` | `string` | A currency code such as `'USD'`. Adds `style: 'currency'` and `currency`. |
| `formatOptions` | `Intl.NumberFormatOptions` | Explicit `Intl` options; merged over the currency shorthand. |
| `integer` | `boolean` | When `true`, sets `maximumFractionDigits: 0` last. |

### Return value

A fresh `Intl.NumberFormatOptions` object. Nothing is mutated, and omitted sources contribute
no keys.

### Example

```ts
import { mergeFormatOptions } from '@myghf/ui'

mergeFormatOptions({ currency: 'USD' })
// → { style: 'currency', currency: 'USD' }

// formatOptions overrides the shorthand:
mergeFormatOptions({ currency: 'USD', formatOptions: { maximumFractionDigits: 0 } })
// → { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }

// integer is applied last and wins over formatOptions:
mergeFormatOptions({ formatOptions: { maximumFractionDigits: 3 }, integer: true })
// → { maximumFractionDigits: 0 }

new Intl.NumberFormat('en-US', mergeFormatOptions({ currency: 'EUR' })).format(1234.5)
// → '€1,234.50'
```

Pass the result straight to `Intl.NumberFormat` or to the `:format-options` prop of
[InputNumber](/components/input-number).
