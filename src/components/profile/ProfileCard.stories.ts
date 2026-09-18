import ProfileCard from "./ProfileCard.astro";

export default {
  title: "Profile/ProfileCard",
  component: ProfileCard,
  tags: ["autodocs", "!test"],
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "light" },
    docs: {
      description: {
        component:
          "`astro-iconify` の addon-vitest 互換性制約のため browser run から除外し、static Storybook の Chromium smoke で検証します。",
      },
    },
  },
};

export const DigitalCard = {};
