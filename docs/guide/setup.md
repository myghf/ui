<script setup lang="ts">
import MinimalForm from '../.vitepress/theme/demos/setup/minimal-form.vue'
</script>

# Setup

Wiring the library into an app takes three steps: import the tokens, load the Tailwind
preset, and make sure Tailwind can see the library's classes.

## 1. Import the tokens

Import the token stylesheet **once**, from your app entry stylesheet:

```css
/* app.css */
@import '@myghf/ui/tokens.css';
```

It defines the `--myghf-*` custom properties on `:root` and a dark block under both
`[data-theme='dark']` and `.dark`. Import it before your own rules so your overrides win by
source order.

## 2. Load the Tailwind preset

```js
// tailwind.config.js
import myghfPreset from '@myghf/ui/tailwind-preset'

export default {
  presets: [myghfPreset],
  content: [/* your globs */, './node_modules/@myghf/ui/dist/**/*.js'],
}
```

The preset provides:

- the brand scales — `primary`, `secondary`, `success`, `warning`, `error`, `info`
  (steps `50`–`900`);
- the semantic colours — `background`, `foreground`, `surface`, `surface-muted`, `border`,
  `muted` (plus the `grey` alias);
- the font families — `font-sans`, `font-serif`, `font-ar`;
- the `popover` and `dialog` shadows;
- `darkMode: ['class', '.dark']`.

## 3. Include the library in `content`

Tailwind generates only the classes it can find, and the package ships built JavaScript.
Add its output to `content`:

```js
content: [
  './index.html',
  './src/**/*.{vue,js,ts,jsx,tsx}',
  './node_modules/@myghf/ui/dist/**/*.js',
]
```

In a monorepo or workspace, point at the resolved path instead — for example
`'../../node_modules/@myghf/ui/dist/**/*.js'`.

## Minimal working example

Import components from `@myghf/ui` and use them with `v-model` as usual:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Button, Input } from '@myghf/ui'

const email = ref('')
</script>

<template>
  <form class="flex max-w-md flex-col gap-3" @submit.prevent>
    <label class="text-sm font-medium text-foreground" for="myghf-email">Email</label>
    <Input id="myghf-email" v-model="email" type="email" placeholder="you@example.com" />
    <Button type="submit" class="self-start">Continue</Button>
  </form>
</template>
```

The same example, rendered live:

<Demo>
  <MinimalForm />
</Demo>

<<< ../.vitepress/theme/demos/setup/minimal-form.vue

> **Tokens are not optional.** Without `tokens.css`, `rgb(var(--myghf-*))` has no value and
> the palette collapses. Import the stylesheet even if you only use a few components.
