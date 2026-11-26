// Playwright configuration for the SauceDemo tests.
//
// Beginner notes:
// - `testDir` is where the test files live.
// - `baseURL` is the live SauceDemo site. There is NO local webServer
//   here, unlike the PDF Editor project - this tests a real site on
//   the internet, so `npm test` needs internet to reach saucedemo.com.
// - `testIdAttribute: 'data-test'` is the important line. Playwright's
//   getByTestId() normally looks for `data-testid`, but SauceDemo puts
//   its test ids in `data-test` instead (e.g. data-test="username").
//   This one line tells Playwright to look at `data-test`, so
//   getByTestId('username') works.
// - Chromium only, to keep the first run fast. Add firefox/webkit later.
// - `trace: 'on-first-retry'` + screenshots on failure: when a test fails,
//   Playwright saves a screenshot and a trace you can open with
//   `npx playwright show-trace <file>` to see exactly what happened.
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'https://www.saucedemo.com',
    testIdAttribute: 'data-test',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
});
