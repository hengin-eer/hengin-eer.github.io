import "@testing-library/jest-dom/vitest";
import { Element, Window } from "happy-dom";
import { setProjectAnnotations } from "@storybook-astro/framework";
import * as projectAnnotations from "./preview";

global.window = new Window({ url: "https://localhost:8080" }) as never;
global.document = global.window.document;
global.Element = Element as never;

setProjectAnnotations([projectAnnotations]);
