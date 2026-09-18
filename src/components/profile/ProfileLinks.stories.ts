import ProfileLinks from "./ProfileLinks.astro";
import "../../styles/profile-ocean.css";

export default {
  title: "Profile/ProfileLinks",
  component: ProfileLinks,
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "deep" },
  },
};

export const Abyss = {
  args: { id: "links" },
};
