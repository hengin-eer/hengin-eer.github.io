/// <reference types="@vitest/browser-playwright" />
import path from "node:path";
import { fileURLToPath } from "node:url";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

const directory = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    projects: [
      {
        extends: true,
        plugins: [
          storybookTest({
            configDir: path.join(directory, ".storybook"),
          }),
        ],
        test: {
          name: "storybook-browser",
          exclude: [
            "src/components/Section/Hero.stories.ts",
            "src/components/Tag/ProfileBadge.stories.ts",
          ],
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: "chromium" }],
          },
        },
      },
    ],
  },
});
