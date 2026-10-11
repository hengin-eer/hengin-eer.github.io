import { expect, test } from "vitest";
import { INVERT_BELOW_DEG, UPRIGHT_ABOVE_DEG, nextInverted } from "./tilt";

test("端末を寝かせると反転する", () => {
  expect(nextInverted(false, INVERT_BELOW_DEG - 1)).toBe(true);
  expect(nextInverted(false, 0)).toBe(true);
  expect(nextInverted(false, -30)).toBe(true);
});

test("端末を起こすと正立に戻る", () => {
  expect(nextInverted(true, UPRIGHT_ABOVE_DEG + 1)).toBe(false);
  expect(nextInverted(true, 90)).toBe(false);
});

test("閾値の間では直前の状態を保つ", () => {
  const between = (INVERT_BELOW_DEG + UPRIGHT_ABOVE_DEG) / 2;
  expect(nextInverted(true, between)).toBe(true);
  expect(nextInverted(false, between)).toBe(false);
  expect(nextInverted(true, INVERT_BELOW_DEG)).toBe(true);
  expect(nextInverted(false, UPRIGHT_ABOVE_DEG)).toBe(false);
});

test("センサー値が取れないときは状態を変えない", () => {
  expect(nextInverted(true, null)).toBe(true);
  expect(nextInverted(false, null)).toBe(false);
});
