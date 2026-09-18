import { useState } from "react";
import type { Meta } from "@storybook/react-vite";
import { expect, spyOn, userEvent, waitFor, within } from "storybook/test";
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
} satisfies Meta<typeof OceanScene>;

export const Shallow = {
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("img", { name: "Ocean p5 canvas at 25% depth" }),
    ).toBeInTheDocument();
    await waitFor(
      () => expect(canvasElement.querySelector("canvas")).toBeTruthy(),
      {
        timeout: 10_000,
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

function LifecycleHarness() {
  const [depth, setDepth] = useState(0.25);
  const [width, setWidth] = useState(320);
  const [mounted, setMounted] = useState(true);

  return (
    <section>
      <button onClick={() => setDepth(0.9)}>Dive</button>
      <button onClick={() => setWidth(520)}>Resize</button>
      <button onClick={() => setMounted(false)}>Unmount</button>
      <div style={{ width }}>
        {mounted && (
          <OceanScene depth={depth} motion={false} particleCount={18} />
        )}
      </div>
    </section>
  );
}

export const Lifecycle = {
  render: () => <LifecycleHarness />,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const view = within(canvasElement);
    const bitmap = await waitFor(
      () => {
        const element = canvasElement.querySelector("canvas");
        expect(element).toBeTruthy();
        return element as HTMLCanvasElement;
      },
      { timeout: 10_000 },
    );
    const context = bitmap.getContext("2d");
    const pixel = () =>
      Array.from(context!.getImageData(1, 0, 1, 1).data).join(",");
    await waitFor(() => expect(pixel()).not.toBe("0,0,0,0"));
    const shallowPixel = pixel();
    const shallowWidth = bitmap.width;

    await userEvent.click(view.getByRole("button", { name: "Dive" }));
    await expect(
      view.getByRole("img", { name: "Ocean p5 canvas at 90% depth" }),
    ).toBeInTheDocument();
    await waitFor(() => expect(pixel()).not.toBe(shallowPixel));

    await userEvent.click(view.getByRole("button", { name: "Resize" }));
    await waitFor(() => expect(bitmap.width).toBeGreaterThan(shallowWidth));

    const { default: P5 } = await import("p5");
    const remove = spyOn(P5.prototype, "remove");
    try {
      await userEvent.click(view.getByRole("button", { name: "Unmount" }));
      await waitFor(() => expect(remove).toHaveBeenCalledTimes(1));
      await expect(canvasElement.querySelector("canvas")).toBeNull();
    } finally {
      remove.mockRestore();
    }
  },
};
