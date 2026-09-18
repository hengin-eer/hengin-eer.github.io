import ProfileValues from "./ProfileValues.astro";
import "../../styles/profile-ocean.css";

export default {
  title: "Profile/ProfileValues",
  component: ProfileValues,
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "deep" },
  },
};

export const Deep = {
  args: { id: "values" },
};
