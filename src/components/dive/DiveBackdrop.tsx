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
          const surface = canvas.color("#18ef95");
          const blue = canvas.color("#13aed0");
          const indigo = canvas.color("#123a75");
          const abyss = canvas.color("#06142f");

          for (let y = 0; y < canvas.height; y += 3) {
            const verticalProgress = y / canvas.height;
            const localDepth = clamp(
              normalizedDepth * 0.78 + verticalProgress * 0.34,
              0,
              1,
            );
            const color =
              localDepth < 0.36
                ? canvas.lerpColor(surface, blue, localDepth / 0.36)
                : localDepth < 0.72
                  ? canvas.lerpColor(blue, indigo, (localDepth - 0.36) / 0.36)
                  : canvas.lerpColor(indigo, abyss, (localDepth - 0.72) / 0.28);
            canvas.stroke(color);
            canvas.line(0, y, canvas.width, y);
          }

          const waves = normalizedDepth < 0.42 ? 3 : 1;
          canvas.noFill();
          canvas.stroke(255, 255, 255, normalizedDepth < 0.42 ? 42 : 16);
          canvas.strokeWeight(1.5);
          for (let line = 0; line < waves; line += 1) {
            canvas.beginShape();
            for (let x = -20; x <= canvas.width + 20; x += 18) {
              const phase =
                x * 0.012 +
                line * 1.8 +
                canvas.frameCount * (state.motion ? 0.012 : 0);
              canvas.vertex(
                x,
                52 + line * 28 + Math.sin(phase) * (8 - normalizedDepth * 4),
              );
            }
            canvas.endShape();
          }

          const particleCount = state.quality === "high" ? 74 : 38;
          canvas.noStroke();
          canvas.fill(255, 255, 255, normalizedDepth < 0.56 ? 64 : 28);
          for (let index = 0; index < particleCount; index += 1) {
            const x =
              (index * 83 + canvas.frameCount * (state.motion ? 0.18 : 0)) %
              canvas.width;
            const y =
              (index * 47 +
                Math.sin(index + canvas.frameCount * 0.01) * 24 +
                canvas.height) %
              canvas.height;
            canvas.circle(x, y, 1 + (index % 3));
          }

          if (normalizedDepth > 0.78) {
            canvas.fill(2, 12, 30, 128);
            canvas.rect(
              0,
              canvas.height * 0.76,
              canvas.width,
              canvas.height * 0.24,
            );
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
