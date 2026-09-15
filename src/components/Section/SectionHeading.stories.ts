import SectionHeading from "./SectionHeading.astro";

export default {
  title: "Astro/Section/SectionHeading",
  component: SectionHeading,
  tags: ["autodocs"],
  args: {
    isBlue: false,
    slots: {
      default: "Profile",
    },
  },
  argTypes: {
    isBlue: { control: "boolean" },
  },
  parameters: {
    a11y: {
      test: "todo",
    },
  },
};

export const Green = {};

export const Blue = {
  args: {
    isBlue: true,
    slots: {
      default: "About me",
    },
  },
};
