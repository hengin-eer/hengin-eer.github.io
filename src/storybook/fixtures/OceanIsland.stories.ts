import OceanIsland from "./OceanIsland.astro";
import { expect, waitFor } from "storybook/test";

export default {
  title: "Integration/AstroReactOceanIsland",
  component: OceanIsland,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Hydration probe for an Astro shell containing a React client island that owns a p5 canvas.",
      },
    },
  },
};

export const Default = {
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitFor(
      () => expect(canvasElement.querySelector("canvas")).toBeTruthy(),
      {
        timeout: 5_000,
      },
    );
  },
};
