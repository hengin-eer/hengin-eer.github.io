import Hero from "./Hero.astro";

export default {
  title: "Astro/Section/Hero",
  component: Hero,
  tags: ["autodocs", "!test"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Compatibility probe for nested Astro components, aliases, astro:assets, scoped CSS, Tailwind v4, Fontsource and astro-iconify. Covered by portable SSR tests because astro-iconify 1.2.0 cannot be imported by addon-vitest's browser transform.",
      },
    },
  },
};

export const Default = {};
