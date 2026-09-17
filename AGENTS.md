# Repository workflow

- Keep `package.json` scripts, the Makefile, CI, and the documented commands in sync when changing validation steps.
- Use `make test-stories` or `make test-storybook` for focused local iteration. Run the full `make verify` before updating a PR; CI must not skip either test suite.
- Install dependencies with `npm ci` and Chromium with `npx playwright install chromium` before running browser tests locally. The Storybook compatibility CI uses Node.js 24 LTS.
- `make verify` is the canonical validation sequence: Astro build, both Storybook test suites, static Storybook build, then a Chromium smoke check for the Astro Icon stories excluded from addon-vitest. The static build target also rejects the known silent `UnhandledRejection` failure.
- Do not migrate package managers as part of unrelated changes. Track the npm-to-pnpm decision in Issue #58.
