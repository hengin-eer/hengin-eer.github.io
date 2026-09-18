import DiveConnections from "./DiveConnections.astro";
import "../../styles/dive-ocean.css";

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
