import { chromium } from "playwright";
import { preview } from "vite";

// addon-vitest cannot import astro-iconify, so exercise these built Astro
// stories in a real browser without excluding them from the compatibility gate.
const server = await preview({
  configFile: false,
  build: { outDir: "storybook-static" },
  preview: { host: "127.0.0.1", port: 0 },
});

let browser;
try {
  const address = server.httpServer.address();
  if (!address || typeof address === "string") {
    throw new Error("Storybook preview did not provide a local port");
  }
  browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const base = `http://127.0.0.1:${address.port}`;

  await page.goto(`${base}/iframe.html?id=astro-tag-profilebadge--default&viewMode=story`);
  await page.getByText("Fish lover").waitFor();
  await page.locator("svg").first().waitFor();

  await page.goto(`${base}/iframe.html?id=astro-section-hero--default&viewMode=story`);
  await page.getByRole("heading", { level: 1 }).waitFor();
  await page.getByText("Fish lover").waitFor();
  const image = page.getByAltText("Timdaik's picture");
  await image.waitFor();
  if (!(await image.evaluate(async (element) => {
    await element.decode();
    return element.naturalWidth > 0;
  }))) {
    throw new Error("Hero image failed to load in the static Storybook");
  }

  if (errors.length) throw new Error(`Storybook page errors: ${errors.join("; ")}`);
  console.log("Static Astro Icon stories rendered in Chromium without page errors");
} finally {
  await browser?.close();
  await new Promise((resolve, reject) =>
    server.httpServer.close((error) => (error ? reject(error) : resolve())),
  );
}
