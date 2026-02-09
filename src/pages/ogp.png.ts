import type { APIRoute } from "astro";
import { generateDefaultOgpImage } from "src/utils/OgpImage";

export const GET: APIRoute = async () => {
	const png = await generateDefaultOgpImage();

	return new Response(png, {
		headers: {
			"Content-Type": "image/png",
		},
	});
};
