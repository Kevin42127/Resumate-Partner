import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  reporter: "list",
  use: { baseURL: "http://localhost:3100", trace: "retain-on-failure" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], locale: "zh-TW" } },
    { name: "mobile", use: { ...devices["Pixel 7"], locale: "zh-TW" } },
  ],
  webServer: {
    command: "npm run start -- -p 3100",
    url: "http://localhost:3100/zh-TW",
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
