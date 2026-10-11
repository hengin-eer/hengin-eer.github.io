type PermissionRequester = {
  requestPermission?: () => Promise<"granted" | "denied">;
};

const watchTilt = (onTilt: (beta: number | null) => void): (() => void) => {
  if (typeof DeviceOrientationEvent === "undefined") return () => {};

  let isStopped = false;
  const handleOrientation = (event: DeviceOrientationEvent) =>
    onTilt(event.beta);
  const listen = () => {
    if (isStopped) return;
    window.addEventListener("deviceorientation", handleOrientation);
  };

  const { requestPermission } =
    DeviceOrientationEvent as unknown as PermissionRequester;
  if (requestPermission) {
    requestPermission()
      .then((state) => {
        if (state === "granted") listen();
      })
      .catch(() => {});
  } else {
    listen();
  }

  return () => {
    isStopped = true;
    window.removeEventListener("deviceorientation", handleOrientation);
  };
};

export { watchTilt };
