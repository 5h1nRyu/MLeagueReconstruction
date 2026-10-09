import { defineConfig } from '@playwright/test';

const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  workers: 2,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    viewport: { width: 1440, height: 1000 },
    launchOptions: executablePath ? { executablePath } : {},
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  webServer: [{
    command: 'npm run preview -- --host 127.0.0.1 --port 4173 --strictPort',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: false,
  }, {
    command: 'node scripts/serve-test-site.mjs --directory . --port 4174',
    url: 'http://127.0.0.1:4174/MLeagueReconstruction/',
    reuseExistingServer: false,
  }, {
    command: 'node scripts/serve-test-site.mjs --directory dist --port 4175',
    url: 'http://127.0.0.1:4175/MLeagueReconstruction/',
    reuseExistingServer: false,
  }],
});
