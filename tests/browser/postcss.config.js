import { fileURLToPath } from 'node:url'

// An absolute config path, so Tailwind resolves `content` globs relative to this
// file (PostCSS would otherwise look for `tailwind.config.js` in the cwd).
export default {
  plugins: {
    tailwindcss: { config: fileURLToPath(new URL('./tailwind.config.js', import.meta.url)) },
    autoprefixer: {},
  },
}
