import ProfileAbout from "./ProfileAbout.astro";
import "../../styles/profile-ocean.css";

export default {
  title: "Profile/ProfileAbout",
  component: ProfileAbout,
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "shallow" },
  },
};

export const Shallow = {
  args: { id: "about" },
};
