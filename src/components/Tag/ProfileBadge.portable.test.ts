import { screen } from "@testing-library/dom";
import {
  composeStories,
  renderStory,
} from "@storybook-astro/framework/testing";
import { expect, test } from "vitest";
import * as stories from "./ProfileBadge.stories";

const { Default, Student } = composeStories(stories);

test("Astro props and astro-iconify render in the default story", async () => {
  await renderStory(Default);
  expect(screen.getByText("Fish lover")).toBeInTheDocument();
  expect(document.querySelector("svg")).not.toBeNull();
});

test("named stories provide deterministic static variants", async () => {
  await renderStory(Student);
  expect(screen.getByText("Kosen Student")).toBeInTheDocument();
});
