import DiveOpening from "./DiveOpening.astro";
import "../../styles/dive-ocean.css";

export default {
  title: "Dive/DiveOpening",
  component: DiveOpening,
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "shallow" },
  },
};

export const Surface = {
  args: { id: "surface" },
};
