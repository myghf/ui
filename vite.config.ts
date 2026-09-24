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
      entry: resolve(import.meta.dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: () => 'index.js',
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
      ],
    },
    sourcemap: true,
    emptyOutDir: true,
  },
})