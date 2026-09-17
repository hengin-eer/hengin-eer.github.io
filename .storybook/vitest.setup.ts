import "@testing-library/jest-dom/vitest";
import { Element, Window } from "happy-dom";
import { setProjectAnnotations } from "@storybook-astro/framework";
import * as projectAnnotations from "./preview";

global.window = new Window({ url: "https://localhost:8080" }) as never;
global.document = global.window.document;
global.Element = Element as never;
// Node 24 exposes navigator through a getter without a setter. Portable Astro
// stories need happy-dom's navigator on both Node 20 and Node 24.
Object.defineProperty(globalThis, "navigator", {
  configurable: true,
  value: global.window.navigator,
});

setProjectAnnotations([projectAnnotations]);
