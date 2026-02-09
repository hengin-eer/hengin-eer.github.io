import { defineConfig } from "astro/config";

import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

import partytown from "@astrojs/partytown";
import mdx from "@astrojs/mdx";

import react from "@astrojs/react";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
    prefetch: true,
    integrations: [partytown({
        config: {
            forward: ["dataLayer.push"],
        },
    }), mdx(), react()],
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
      optimizeDeps: {
          noDiscovery: true,
          include: [],
      },

      plugins: [tailwindcss()],
    },
});