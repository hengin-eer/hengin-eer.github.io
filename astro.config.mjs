import { defineConfig } from "astro/config";

import tailwind from "@astrojs/tailwind";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

// https://astro.build/config
export default defineConfig({
	integrations: [tailwind()],
	markdown: {
		shikiConfig: {
			theme: "github-dark",
			langs: [],
		},
		remarkPlugins: [remarkMath],
		rehypePlugins: [rehypeKatex],
	},
	site: "https://hengin-eer.github.io/",
	base: '/',
	vite: {
		optimizeDeps: {
			noDiscovery: true,
			include: [],
		},
	},
});
