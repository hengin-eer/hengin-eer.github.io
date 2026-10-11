const SPIN_DURATION_MS = 800;
const SPIN_SCALE = 0.5;

const spin = (element: HTMLElement, inverted: boolean) => {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  element.animate(
    [
      { rotate: inverted ? "0deg" : "180deg", scale: 1 },
      { scale: SPIN_SCALE, offset: 0.25 },
      { scale: SPIN_SCALE, offset: 0.75 },
      { rotate: inverted ? "180deg" : "360deg", scale: 1 },
    ],
    { duration: SPIN_DURATION_MS, easing: "ease-in-out" },
  );
};

export { spin };
