import { defineConfig } from "astro/config";
import { fileURLToPath } from "node:url";

import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

import partytown from "@astrojs/partytown";
import mdx from "@astrojs/mdx";

import react from "@astrojs/react";

import tailwindcss from "@tailwindcss/vite";

const optimizeDeps = {
  noDiscovery: true,
  include: [],
};

const p5EsmBuild = fileURLToPath(
  new URL("./node_modules/p5/lib/p5.esm.js", import.meta.url),
);

const resolveP5EsmBuild = {
  name: "resolve-p5-esm-build",
  enforce: "pre",
  resolveId(id) {
    return id === "p5-esm-build" ? p5EsmBuild : null;
  },
};

// storybook-astro's internal SSR server reuses raw Vite plugins, but not the
// top-level `vite.optimizeDeps` block. Re-applying the same setting here keeps
// unrelated Astro routes and Node-only utilities out of its browser scan.
const preserveOptimizeDeps = {
  name: "preserve-storybook-optimize-deps",
  config: () => ({
    optimizeDeps: {
      ...optimizeDeps,
      include: [...optimizeDeps.include],
    },
  }),
};

// https://astro.build/config
export default defineConfig({
  prefetch: true,
  integrations: [
    partytown({
      config: {
        forward: ["dataLayer.push"],
      },
    }),
    mdx(),
    react(),
  ],
  markdown: {
    shikiConfig: {
      theme: "github-dark",
      langs: [],
    },
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },
  site: "https://hengin-eer.github.io/",
  base: "/",
  vite: {
    optimizeDeps,

    plugins: [tailwindcss(), resolveP5EsmBuild, preserveOptimizeDeps],
  },
});
