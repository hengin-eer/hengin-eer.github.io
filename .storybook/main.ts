import path from "node:path";
import { fileURLToPath } from "node:url";
import type { StorybookConfig } from "@storybook-astro/framework";
import { react } from "@storybook-astro/framework/integrations";
import { mergeConfig } from "vite";

const rootDirectory = fileURLToPath(new URL("../", import.meta.url));

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
    "@storybook/addon-vitest",
  ],
  staticDirs: ["../public"],
  framework: {
    name: "@storybook-astro/framework",
    options: {
      renderMode: "static",
      // React is the project's only JSX renderer, so real profile components
      // and the spike fixture should pass through the same integration.
      integrations: [react()],
    },
  },
  viteFinal: async (viteConfig) =>
    mergeConfig(viteConfig, {
      resolve: {
        alias: {
          "@components": path.join(rootDirectory, "src/components"),
          "@assets": path.join(rootDirectory, "src/assets"),
          src: path.join(rootDirectory, "src"),
        },
      },
      optimizeDeps: {
        noDiscovery: true,
        include: ["react", "react-dom", "p5"],
      },
    }),
};

export default config;
