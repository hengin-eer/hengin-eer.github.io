import { getCollection } from "astro:content";
import type { APIRoute } from "astro";
import { generateBlogOgpImage } from "src/utils/OgpImage";

export const GET: APIRoute = async ({ params }) => {
	const slug = params.slug;
	const blogs = await getCollection("blogs");
	const blog = blogs.find((blog) => blog.id === slug);
	const png = await generateBlogOgpImage(blog!);

	return new Response(png, {
		headers: {
			"Content-Type": "image/png",
		},
	});
};

export async function getStaticPaths() {
	const blogs = await getCollection("blog");
	return blogs.map((blog) => ({
		params: { slug: blog.id },
	}));
}
