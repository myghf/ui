import { defineConfig, devices } from '@playwright/test'

/**
 * Browser-level accessibility tests. Unlike the jsdom catalog
 * (`src/a11y.spec.ts`), these run against real CSS in Chromium, covering the
 * light/dark × LTR/RTL matrix and computed contrast.
 */
export default defineConfig({
  testDir: './tests/browser',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  reporter: 'list',
  use: { baseURL: 'http://localhost:5199' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npx vite --config tests/browser/vite.config.ts',
    url: 'http://localhost:5199',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
