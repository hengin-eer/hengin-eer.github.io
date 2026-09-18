import DiveOrigins from "./DiveOrigins.astro";

export default {
  title: "Dive/DiveOrigins",
  component: DiveOrigins,
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "shallow" },
  },
};

export const Shallow = {
  args: { id: "origins" },
};
