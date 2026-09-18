import ProfileHero from "./ProfileHero.astro";
import "../../styles/profile-ocean.css";

export default {
  title: "Profile/ProfileHero",
  component: ProfileHero,
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "shallow" },
  },
};

export const Surface = {
  args: { id: "surface" },
};
