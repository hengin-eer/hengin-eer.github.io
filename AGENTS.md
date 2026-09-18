# Repository workflow

- `make dev` starts only the Astro site; `make storybook` starts only Storybook. Run both in separate terminals only when comparison is needed.
- Keep `package.json` scripts, the Makefile, CI, and the documented commands in sync when changing validation steps.
- Use `make test-stories` or `make test-storybook` for focused local iteration. Run the full `make verify` before updating a PR; CI must not skip either test suite.
- Install dependencies with `npm ci` and Chromium with `npx playwright install chromium` before running browser tests locally. All GitHub Actions workflows use Node.js 24 LTS; keep their Node version settings aligned when adding or updating CI.
- `make quality` is the focused formatter, linter, and Astro diagnostic check. `make verify` is the canonical PR validation sequence: quality checks, Astro build, both Storybook test suites, static Storybook build, then a Chromium smoke check for the Astro Icon stories excluded from addon-vitest. The static build target also rejects the known silent `UnhandledRejection` failure.
- Do not migrate package managers as part of unrelated changes. Track the npm-to-pnpm decision in Issue #58.
