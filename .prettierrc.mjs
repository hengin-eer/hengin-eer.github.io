const config = {
  endOfLine: "lf",
  plugins: ["prettier-plugin-astro"],
  printWidth: 80,
  tabWidth: 2,
  overrides: [
    {
      files: "*.astro",
      options: {
        parser: "astro",
      },
    },
  ],
};

export default config;
