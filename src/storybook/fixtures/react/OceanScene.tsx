import { useEffect, useRef } from "react";
import type p5 from "p5";

export interface OceanSceneProps {
  depth?: number;
  motion?: boolean;
  particleCount?: number;
}

const clamp = (value: number, minimum: number, maximum: number) =>
  Math.min(Math.max(value, minimum), maximum);

export default function OceanScene({
  depth = 0.25,
  motion = true,
  particleCount = 36,
}: OceanSceneProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<p5 | null>(null);
  const propsRef = useRef({ depth, motion, particleCount });

  useEffect(() => {
    propsRef.current = { depth, motion, particleCount };
    if (motion) {
      instanceRef.current?.loop();
    } else {
      instanceRef.current?.noLoop();
      instanceRef.current?.redraw();
    }
  }, [depth, motion, particleCount]);

  useEffect(() => {
    let cancelled = false;
    let instance: p5 | undefined;
    let resizeObserver: ResizeObserver | undefined;

    void import("p5").then(({ default: P5 }) => {
      if (cancelled || !hostRef.current) return;
      const host = hostRef.current;

      instance = new P5((canvas) => {
        canvas.setup = () => {
          const width = Math.max(1, Math.round(host.clientWidth));
          canvas.createCanvas(width, Math.round((width * 7) / 12));
          canvas.pixelDensity(1);
          canvas.randomSeed(29);
          resizeObserver = new ResizeObserver(([entry]) => {
            const nextWidth = Math.round(entry.contentRect.width);
            if (nextWidth > 0 && nextWidth !== canvas.width) {
              canvas.resizeCanvas(nextWidth, Math.round((nextWidth * 7) / 12));
            }
          });
          resizeObserver.observe(host);
        };

        canvas.draw = () => {
          const state = propsRef.current;
          const normalizedDepth = clamp(state.depth, 0, 1);
          const shallow = canvas.color("#18ef95");
          const middle = canvas.color("#13aed0");
          const deep = canvas.color("#071a3d");

          for (let y = 0; y < canvas.height; y += 2) {
            const verticalProgress = y / canvas.height;
            const localDepth = clamp(
              normalizedDepth + verticalProgress * 0.35,
              0,
              1,
            );
            const color =
              localDepth < 0.5
                ? canvas.lerpColor(shallow, middle, localDepth * 2)
                : canvas.lerpColor(middle, deep, (localDepth - 0.5) * 2);
            canvas.stroke(color);
            canvas.line(0, y, canvas.width, y);
          }

          canvas.noStroke();
          canvas.fill(255, 255, 255, 70);
          const particles = clamp(Math.round(state.particleCount), 0, 120);
          for (let index = 0; index < particles; index += 1) {
            const x =
              (index * 83 + canvas.frameCount * (state.motion ? 0.22 : 0)) %
              canvas.width;
            const y =
              (index * 47 +
                Math.sin(index + canvas.frameCount * 0.01) * 24 +
                canvas.height) %
              canvas.height;
            const radius = 2 + (index % 4);
            canvas.circle(x, y, radius);
          }

          canvas.noFill();
          canvas.stroke(255, 255, 255, 130);
          canvas.strokeWeight(2);
          canvas.beginShape();
          for (let x = 0; x <= canvas.width; x += 12) {
            const phase =
              x * 0.018 + canvas.frameCount * (state.motion ? 0.018 : 0);
            canvas.vertex(x, 54 + Math.sin(phase) * 8);
          }
          canvas.endShape();

          if (!state.motion) canvas.noLoop();
        };
      }, hostRef.current);
      instanceRef.current = instance;
    });

    return () => {
      cancelled = true;
      resizeObserver?.disconnect();
      instance?.remove();
      instanceRef.current = null;
    };
  }, []);

  const percentDepth = Math.round(clamp(depth, 0, 1) * 100);

  return (
    <div
      ref={hostRef}
      className="ocean-scene"
      role="img"
      aria-label={`Ocean p5 canvas at ${percentDepth}% depth`}
    />
  );
}
