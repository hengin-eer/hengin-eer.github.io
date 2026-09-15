import "@fontsource/zen-kaku-gothic-new";
import "@fontsource/shippori-antique-b1";
import "@fontsource/fira-code";
import "@fontsource-variable/comfortaa";
import "@fontsource/averia-serif-libre";
import "../src/styles/global.css";
import type { Preview } from "@storybook-astro/framework";

const preview: Preview = {
  parameters: {
    layout: "centered",
    controls: {
      expanded: true,
    },
    docs: {
      codePanel: true,
    },
    a11y: {
      test: "error",
    },
    backgrounds: {
      options: {
        light: { name: "Light", value: "#ffffff" },
        shallow: { name: "Shallow water", value: "#dffbf0" },
        deep: { name: "Deep water", value: "#071a3d" },
      },
    },
  },
};

export default preview;
