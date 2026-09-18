import ProfileCard from "./ProfileCard.astro";
import "../../styles/profile-card.css";

export default {
  title: "Profile/ProfileCard",
  component: ProfileCard,
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "light" },
  },
};

export const DigitalCard = {};
