/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
	theme: {
		colors: {
			"primary-green": "#18ef95",
			"primary-dark-green": "#00b86b",
			"primary-emerald": "#34D399",
			"primary-blue": "#13aed0",
			"primary-red": "#f6444f",
			white: "#ffffff",
			"gray-base": "#9ebcca",
			"gray-light": "#edf0f7",
			"gray-dark": "#547B8D",
			black: "#000000",
		},
		extend: {},
	},
	plugins: [],
};
