import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import type { ReactNode } from "react";
import type { CollectionEntry } from "astro:content";

async function GenerateOgpImage(children: ReactNode) {
	const svg = await satori(children, {
		width: 1200,
		height: 630,
		fonts: [
			{
				name: "Averia Serif Libre",
				data: await fetch(
					"https://cdn.jsdelivr.net/fontsource/fonts/averia-serif-libre@latest/latin-400-normal.ttf",
				).then((res) => res.arrayBuffer()),
				weight: 400,
				style: "normal",
			},
		],
		debug: true,
	});

	const resvg = new Resvg(svg, {
		fitTo: {
			mode: "width",
			value: 1200,
		},
	});

	const pngData = resvg.render().asPng();

	return pngData;
}

export function generateBlogOgpImage(blog: CollectionEntry<"blog">) {
	const { cover, title, tag, updatedAt } = blog.data;
	return GenerateOgpImage(
		<div
			style={{
				display: "flex",
				flexDirection: "column",
			}}
		>
			<img src={cover.src} alt={title} />
			<p>{tag}</p>
			<h1>{title}</h1>
			<p>{updatedAt}</p>
		</div>,
	);
}

export function generateDefaultOgpImage() {
	return GenerateOgpImage(
		<div
			style={{
				display: "flex",
				flexDirection: "column",
			}}
		>
			<h1>tomodaction</h1>
			<h2>my mode, action</h2>
			<p>Portfolio of Hiroki Tomoda (timdaik).</p>
		</div>,
	);
}
