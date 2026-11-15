import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 30000,
  use: {
    baseURL: "http://localhost:3000",
    browserName: "chromium",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "Desktop HD (1920x1080)",
      use: { viewport: { width: 1920, height: 1080 } },
    },
    {
      name: "Laptop (1366x768)",
      use: { viewport: { width: 1366, height: 768 } },
    },
    {
      name: "Mobile (390x844)",
      use: {
        viewport: { width: 390, height: 844 },
        isMobile: true,
      },
    },
  ],
});
