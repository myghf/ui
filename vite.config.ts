import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [
    vue(),
    dts({ include: ['src'], outDir: 'dist', tsconfigPath: './tsconfig.build.json' }),
  ],
  build: {
    lib: {
      entry: {
        index: resolve(import.meta.dirname, 'src/index.ts'),
        nuxt: resolve(import.meta.dirname, 'src/nuxt.ts'),
      },
      formats: ['es'],
      fileName: (_format, entryName) => `${entryName}.js`,
    },
    rollupOptions: {
      external: [
        'vue',
        'reka-ui',
        'lucide-vue-next',
        '@internationalized/date',
        'clsx',
        'tailwind-merge',
        'tailwind-variants',
        /^@tanstack\//,
        '@nuxt/kit',
        '@myghf/ui/tailwind-preset',
      ],
    },
    sourcemap: true,
    emptyOutDir: true,
  },
})