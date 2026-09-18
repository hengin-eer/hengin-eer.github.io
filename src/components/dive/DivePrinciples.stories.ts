import DivePrinciples from "./DivePrinciples.astro";

export default {
  title: "Dive/DivePrinciples",
  component: DivePrinciples,
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "deep" },
  },
};

export const Deep = {
  args: { id: "principles" },
};
