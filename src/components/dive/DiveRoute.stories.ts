import DiveRoute from "./DiveRoute.astro";
import "../../styles/dive-ocean.css";

export default {
  title: "Dive/DiveRoute",
  component: DiveRoute,
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "deep" },
  },
};

export const OpenWater = {
  args: { id: "route" },
};
