import { getCollection } from "astro:content";
import type { APIRoute } from "astro";
import { generateBlogOgpImage } from "src/utils/OgpImage";

export const GET: APIRoute = async ({ props }) => {
	const { blog } = props;
	const png = await generateBlogOgpImage(blog);

	return new Response(png, {
		headers: {
			"Content-Type": "image/png",
		},
	});
};

export async function getStaticPaths() {
	const blogs = await getCollection("blogs");

	return blogs.map((blog) => ({
		params: { slug: blog.id },
		props: { blog },
	}));
}
