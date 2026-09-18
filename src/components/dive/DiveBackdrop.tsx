import { useEffect, useRef } from "react";
import type p5 from "p5";
import { loadP5 } from "../../lib/loadP5";

export interface DiveBackdropProps {
  depth?: number;
  motion?: boolean;
  quality?: "low" | "high";
}

const clamp = (value: number, minimum: number, maximum: number) =>
  Math.min(Math.max(value, minimum), maximum);

export default function DiveBackdrop({
  depth = 0,
  motion = true,
  quality = "low",
}: DiveBackdropProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<p5 | null>(null);
  const propsRef = useRef({ depth, motion, quality });

  useEffect(() => {
    propsRef.current = { depth, motion, quality };
    if (motion) {
      instanceRef.current?.loop();
    } else {
      instanceRef.current?.noLoop();
      instanceRef.current?.redraw();
    }
  }, [depth, motion, quality]);

  useEffect(() => {
    let cancelled = false;
    let instance: p5 | undefined;
    let resizeObserver: ResizeObserver | undefined;

    void loadP5().then((P5) => {
      if (cancelled || !hostRef.current) return;
      const host = hostRef.current;

      instance = new P5((canvas) => {
        const resize = () => {
          const width = Math.max(1, Math.round(host.clientWidth));
          const height = Math.max(1, Math.round(host.clientHeight));
          canvas.resizeCanvas(width, height, true);
        };

        canvas.setup = () => {
          canvas.createCanvas(
            Math.max(1, Math.round(host.clientWidth)),
            Math.max(1, Math.round(host.clientHeight)),
          );
          canvas.pixelDensity(1);
          canvas.randomSeed(55);
          resizeObserver = new ResizeObserver(resize);
          resizeObserver.observe(host);
        };

        canvas.draw = () => {
          const state = propsRef.current;
          const normalizedDepth = clamp(state.depth, 0, 1);
          const elapsed = canvas.millis() / 1000;
          const visibility = 1 - normalizedDepth * 0.6;
          const currentCount = normalizedDepth < 0.48 ? 2 : 1;

          canvas.clear();
          canvas.noFill();
          canvas.strokeWeight(0.75);
          for (let index = 0; index < currentCount; index += 1) {
            const phase = elapsed * 0.18 + index * 1.9;
            const y =
              canvas.height * (0.28 + index * 0.35) + Math.sin(phase) * 18;
            const x = canvas.width * (0.22 + index * 0.46);
            canvas.stroke(203, 246, 255, 16 * visibility);
            canvas.bezier(
              x - canvas.width * 0.13,
              y + 42,
              x - canvas.width * 0.04,
              y - 28 + Math.sin(phase) * 12,
              x + canvas.width * 0.1,
              y + 24 - Math.cos(phase) * 16,
              x + canvas.width * 0.2,
              y - 18,
            );
          }

          const bubbleCount = state.quality === "high" ? 28 : 16;
          for (let index = 0; index < bubbleCount; index += 1) {
            const radius = 1.4 + (index % 4) * 0.8;
            const travel =
              (elapsed * (10 + (index % 5) * 3) + index * 97) %
              (canvas.height + radius * 4);
            const y = canvas.height + radius * 2 - travel;
            const x =
              ((index * 137) % canvas.width) +
              Math.sin(elapsed * 0.42 + index * 2.1) * 14;
            canvas.stroke(225, 255, 250, (36 + (index % 3) * 9) * visibility);
            canvas.strokeWeight(0.8);
            canvas.circle(x, y, radius * 2);
          }

          if (!state.motion) canvas.noLoop();
        };
      }, host);
      instanceRef.current = instance;
    });

    return () => {
      cancelled = true;
      resizeObserver?.disconnect();
      instance?.remove();
      instanceRef.current = null;
    };
  }, []);

  return <div ref={hostRef} className="dive-backdrop" aria-hidden="true" />;
}
