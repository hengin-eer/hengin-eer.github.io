import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import type { ReactNode } from "react";
import type { CollectionEntry } from "astro:content";
import { SITE_TITLE } from "src/constant/SITE";
import { readFileSync } from "node:fs";

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
		// debug: true,
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

function readImageAsDataURL(imagePath: string): string {
	const image_base64 = readFileSync(new URL(imagePath, import.meta.url), {
		encoding: "base64",
	});
	return `data:image/png;base64,${image_base64}`;
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
			<img src={readImageAsDataURL(cover.src)} alt={title} />
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
				padding: "60px 100px",
				width: "1200px",
				height: "630px",
				display: "flex",
				alignItems: "center",
				justifyContent: "space-between",
				backgroundColor: "white",
				// backgroundImage: "linear-gradient(to right, #13aed0, white)",
				backgroundImage: "linear-gradient(to right, white 50%, #13aed0)",
				color: "#1a2550",
			}}
		>
			<div
				style={{
					marginTop: 120,
					display: "flex",
					flexDirection: "column",
					gap: 64,
					fontFamily: "Averia Serif Libre",
				}}
			>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						gap: 12,
					}}
				>
					<span
						style={{
							fontSize: 88,
							color: "#13aed0",
						}}
					>
						{SITE_TITLE};
					</span>
					<span
						style={{
							fontSize: 64,
						}}
					>
						my mode, action
					</span>
				</div>

				<p
					style={{
						color: "#00b86b",
						fontSize: 40,
					}}
				>
					&copy; hiro-to.moda
				</p>
			</div>
			<img
				style={{
					height: 360,
					width: 360,
					borderRadius: "50%",
				}}
				src={readImageAsDataURL("../../public/favicon.png")}
				alt="Avatar"
			/>
		</div>,
	);
}
