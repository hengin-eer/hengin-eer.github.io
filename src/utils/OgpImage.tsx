import satori from "satori";
import AVERIA from "/public/fonts/averia-serif-libre_5.2.7_latin-400-normal.ttf";
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
				data: Buffer.from(AVERIA),
				weight: 400,
				style: "normal",
			},
		],
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
		<div>
			<img src={cover.src} alt={title} />
			<p>{tag}</p>
			<h1>{title}</h1>
			<p>{updatedAt}</p>
		</div>,
	);
}

export function generateDefaultOgpImage() {
	return GenerateOgpImage(
		<div>
			<h1>tomodaction</h1>
			<h2>my mode, action</h2>
			<p>Portfolio of Hiroki Tomoda (timdaik).</p>
		</div>,
	);
}
