import partytown from "@astrojs/partytown";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";

// https://astro.build/config
export default defineConfig({
	prefetch: true,
	integrations: [
		tailwind(),
		partytown({
			config: {
				forward: ["dataLayer.push"],
			},
		}),
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
		optimizeDeps: {
			noDiscovery: true,
			include: [],
		},
	},
});
