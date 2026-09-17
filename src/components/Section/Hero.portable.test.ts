import { screen } from "@testing-library/dom";
import {
  composeStories,
  renderStory,
} from "@storybook-astro/framework/testing";
import { expect, test } from "vitest";
import * as stories from "./Hero.stories";

const { Default } = composeStories(stories);

test("nested Astro components and optimized assets render together", async () => {
  await renderStory(Default);
  expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  expect(screen.getByAltText("Timdaik's picture")).toHaveAttribute("src");
  expect(screen.getByText("Fish lover")).toBeInTheDocument();
});
