import ProfileBadge from "./ProfileBadge.astro";

export default {
  title: "Astro/Tag/ProfileBadge",
  component: ProfileBadge,
  tags: ["autodocs", "!test"],
  args: {
    icon: "fluent-emoji-flat:fish",
    text: "Fish lover",
  },
  argTypes: {
    icon: { control: "text" as const },
    text: { control: "text" as const },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Excluded from addon-vitest browser runs because astro-iconify 1.2.0 emits a runtime import for a type-only Props export. Covered by portable SSR and a static Chromium smoke check instead.",
      },
    },
  },
};

export const Default = {};

export const Student = {
  args: {
    icon: "fluent-emoji-flat:student",
    text: "Kosen Student",
  },
};
