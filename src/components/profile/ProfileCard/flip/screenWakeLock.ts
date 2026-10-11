const holdScreenAwake = (): (() => void) => {
  let sentinel: WakeLockSentinel | null = null;
  let isReleased = false;

  const acquire = () => {
    if (isReleased || document.visibilityState !== "visible") return;
    navigator.wakeLock
      ?.request("screen")
      .then((acquired) => {
        if (isReleased) acquired.release().catch(() => {});
        else sentinel = acquired;
      })
      .catch(() => {});
  };

  document.addEventListener("visibilitychange", acquire);
  acquire();

  return () => {
    isReleased = true;
    document.removeEventListener("visibilitychange", acquire);
    sentinel?.release().catch(() => {});
    sentinel = null;
  };
};

export { holdScreenAwake };
