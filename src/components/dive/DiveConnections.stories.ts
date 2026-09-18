import DiveConnections from "./DiveConnections.astro";

export default {
  title: "Dive/DiveConnections",
  component: DiveConnections,
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "deep" },
  },
};

export const Abyss = {
  args: { id: "connections" },
};
