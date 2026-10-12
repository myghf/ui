// `@myghf/ui/nuxt` is listed before `@nuxtjs/tailwindcss` on
// purpose: that order wires the Tailwind preset and content glob
// automatically, with no `tailwindcss` config block.
export default defineNuxtConfig({
  modules: ['@myghf/ui/nuxt', '@nuxtjs/tailwindcss'],
})
