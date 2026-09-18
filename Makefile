.SHELLFLAGS := -c
SHELL := /bin/bash

.PHONY: dev storybook build test-stories test-storybook test build-storybook format check-format lint check-astro quality verify

build:
	npm run build

dev:
	npm run dev

storybook:
	npm run storybook

test-stories:
	npm run test:stories

test-storybook:
	npm run test:storybook

test: test-stories test-storybook

build-storybook:
	@log=$$(mktemp); \
	trap 'rm -f "$$log"' EXIT; \
	npm run build-storybook 2>&1 | tee "$$log"; \
	status=$${PIPESTATUS[0]}; \
	if [ "$$status" -ne 0 ] || grep -Eq 'UnhandledRejection|ERROR:' "$$log"; then \
	  echo "Storybook build failed or emitted a hidden error" >&2; \
	  exit 1; \
	fi

format:
	npm run format

check-format:
	npm run format:check

lint:
	npm run lint

check-astro:
	npm run check:astro

quality: check-format lint check-astro

verify:
	$(MAKE) quality
	$(MAKE) build
	$(MAKE) test
	$(MAKE) build-storybook
	node scripts/smoke-storybook-static.mjs
