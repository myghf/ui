---
'@myghf/ui': patch
---

Wire the Tailwind preset automatically in Nuxt

The Nuxt module only wired the Tailwind preset and content glob when the
consumer happened to write a `tailwindcss` block in `nuxt.config` — the
documented `modules: ['@nuxtjs/tailwindcss', '@myghf/ui/nuxt']` setup got
no preset and only a misleading "not detected" warning, because
`@nuxtjs/tailwindcss` resolves its options at install time.

The module now seeds `nuxt.options.tailwindcss` when the Tailwind module has
not installed yet, so listing `@myghf/ui/nuxt` **before** `@nuxtjs/tailwindcss`
wires everything with no extra config. When the Tailwind module has already
installed, the module warns with the exact `tailwindcss` block that wires it.
Detection uses Nuxt's installed-modules registry (new `hasInstalledTailwindModule`
helper, unit-tested) so a merely *listed* module is not mistaken for an
installed one.
