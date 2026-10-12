import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  root,
  plugins: [vue()],
  resolve: {
    alias: {
      // The harness renders `src/` exactly like the docs do.
      '@myghf/ui': fileURLToPath(new URL('../../src/index.ts', import.meta.url)),
    },
  },
  server: { port: 5199, strictPort: true },
})
