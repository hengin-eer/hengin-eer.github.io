import ProfileTimeline from "./ProfileTimeline.astro";
import "../../styles/profile-ocean.css";

export default {
  title: "Profile/ProfileTimeline",
  component: ProfileTimeline,
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "deep" },
  },
};

export const OpenWater = {
  args: { id: "timeline" },
};
