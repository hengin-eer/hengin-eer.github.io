import { expect, waitFor, within } from "storybook/test";
import OceanScene from "./OceanScene";
import "./OceanScene.css";

export default {
  title: "React/OceanScene",
  component: OceanScene,
  parameters: {
    renderer: "react",
    backgrounds: { default: "deep" },
  },
  args: {
    depth: 0.25,
    motion: true,
    particleCount: 36,
  },
  argTypes: {
    depth: { control: { type: "range", min: 0, max: 1, step: 0.05 } },
    motion: { control: "boolean" },
    particleCount: { control: { type: "range", min: 0, max: 120, step: 4 } },
  },
};

export const Shallow = {
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("img", { name: "Ocean p5 canvas at 25% depth" }),
    ).toBeInTheDocument();
    await waitFor(
      () => expect(canvasElement.querySelector("canvas")).toBeTruthy(),
      {
        timeout: 5_000,
      },
    );
  },
};

export const Deep = {
  args: {
    depth: 0.9,
    motion: false,
    particleCount: 18,
  },
};
