/// <reference types="vitest" />
import { defineConfig } from "@storybook-astro/framework/vitest";
import { react } from "@storybook-astro/framework/integrations";

export default defineConfig({
  root: import.meta.dirname,
  test: {
    name: "astro-portable-stories",
    setupFiles: [".storybook/vitest.setup.ts"],
    include: ["src/**/*.portable.test.ts"],
  },
  integrations: [
    react({
      include: ["**/src/storybook/fixtures/react/**"],
    }),
  ],
});
