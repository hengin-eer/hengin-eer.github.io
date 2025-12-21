import { defineCollection, z } from "astro:content";

const blogCollection = defineCollection({
	type: "content",
	schema: ({ image }) =>
		z.object({
			cover: image(),
			title: z.string(),
			author: z.string(),
			updatedAt: z.string(),
			tag: z.array(
				z.enum([
					"ニュース",
					"日常",
					"ポエム",
					"振り返り",
					"イベント",
					"Tech",
					"教養",
				])
			),
			draft: z.boolean().default(false),
		}),
});

const workCollection = defineCollection({
	type: "content",
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			ruby: z.string(),
			summary: z.string(),
			thumbnail: image().optional(),
			worksLink: z.string().url().optional(),
			githubLink: z.string().url().optional(),
			worksCategory: z
				.array(
					z.enum([
						"ホームページ",
						"Webアプリ",
						"モバイルアプリ",
						"Web製作研究部",
						"課外研究",
						"ハッカソン",
						"その他",
					])
				)
				.default([]),
			termFrom: z.string(),
			termTo: z.string(),
			isPickup: z.boolean().default(false),
			techCategory: z
				.array(
					z.enum([
						"HTML",
						"CSS",
						"Tailwind CSS",
						"JavaScript",
						"TypeScript",
						"jQuery",
						"Three.js",
						"React",
						"Next.js",
						"Astro",
						"Recoil",
						"Jotai",
						"NextAuth.js",
						"Prisma",
						"Chakra UI",
						"shadcn/ui",
						"PWA",
						"Flutter",
						"Markdown",
						"Marp",
						"ESLint",
						"Web Push API",
						"OpenAI API",
						"Gemini API",
						"Google Apps Script",
						"Google Spreadsheet API",
						"Google Maps API",
						"Docker",
						"PostgreSQL",
						"Firebase",
						"Firestore",
						"Vercel",
						"Heroku",
						"GitHub",
						"Figma",
					])
				)
				.default([]),
			draft: z.boolean().default(false),
		}),
});

export const collections = {
	blog: blogCollection,
	work: workCollection,
};
