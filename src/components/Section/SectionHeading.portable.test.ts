import { screen } from "@testing-library/dom";
import {
  composeStories,
  renderStory,
} from "@storybook-astro/framework/testing";
import { expect, test } from "vitest";
import * as stories from "./SectionHeading.stories";

const { Green, Blue } = composeStories(stories);

test("default slot content is rendered", async () => {
  await renderStory(Green);
  expect(screen.getByRole("heading", { name: "Profile" })).toBeInTheDocument();
});

test("boolean props select the blue Tailwind variant", async () => {
  await renderStory(Blue);
  expect(screen.getByRole("heading", { name: "About me" })).toHaveClass(
    "text-primary-blue",
  );
});
