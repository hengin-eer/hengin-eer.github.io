import type P5 from "p5";

/**
 * p5 2.3.x の package entry は Vite 上で CJS 依存を解決できないことがある。
 * Vite plugin が解決する、libtess 内包済みの ESM build を遅延読込する。
 */
export async function loadP5(): Promise<typeof P5> {
  const module = await import("p5-esm-build");
  return module.default as typeof P5;
}
