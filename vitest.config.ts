import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    // Node by default: several specs use node built-ins. Component specs opt
    // into a DOM with a `// @vitest-environment jsdom` docblock.
    environment: 'node',
    include: ['src/**/*.spec.ts'],
  },
})
