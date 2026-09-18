import { expect, waitFor, within } from "storybook/test";
import OceanBackdrop from "./OceanBackdrop";
import "./OceanExperience.css";

export default {
  title: "Profile/OceanBackdrop",
  component: OceanBackdrop,
  parameters: {
    renderer: "react",
    layout: "fullscreen",
    backgrounds: { default: "deep" },
  },
  args: {
    depth: 0.2,
    motion: false,
    quality: "low",
  },
  decorators: [
    (Story) => (
      <div style={{ position: "relative", height: "540px" }}>
        <Story />
      </div>
    ),
  ],
};

export const Shallow = {
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    await waitFor(
      () => expect(canvasElement.querySelector("canvas")).toBeTruthy(),
      {
        timeout: 10_000,
      },
    );
    await expect(canvas.queryByLabelText("潜水深度")).not.toBeInTheDocument();
  },
};

export const Abyss = {
  args: {
    depth: 0.95,
    quality: "high",
  },
};
