import type { APIRoute } from "astro";
import { generateDefaultOgpImage } from "src/utils/OgpImage";

export const GET: APIRoute = async () => {
  const png = await generateDefaultOgpImage();

  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
    },
  });
};
