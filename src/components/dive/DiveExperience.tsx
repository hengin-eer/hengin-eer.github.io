import { useEffect, useState } from "react";
import { diveDepthStops } from "../../data/dive";
import DiveBackdrop from "./DiveBackdrop";
import "./DiveExperience.css";

const clamp = (value: number, minimum: number, maximum: number) =>
  Math.min(Math.max(value, minimum), maximum);

const getActiveStop = (progress: number) =>
  [...diveDepthStops].reverse().find((stop) => progress >= stop.progress) ??
  diveDepthStops[0];

export default function DiveExperience() {
  const [progress, setProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isStoryVisible, setIsStoryVisible] = useState(true);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReducedMotion(media.matches);
    updateMotion();
    media.addEventListener("change", updateMotion);

    let frame = 0;
    const updateDepth = () => {
      frame = 0;
      const story = document.querySelector<HTMLElement>(".dive-story-page");
      if (!story) return;

      const storyTop = story.offsetTop;
      const maximum = story.offsetHeight - window.innerHeight;
      const storyBottom = storyTop + story.offsetHeight - window.scrollY;

      setProgress(
        maximum > 0 ? clamp((window.scrollY - storyTop) / maximum, 0, 1) : 0,
      );
      setIsStoryVisible(storyBottom > window.innerHeight);
    };
    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateDepth);
    };
    updateDepth();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      media.removeEventListener("change", updateMotion);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const activeStop = getActiveStop(progress);

  return (
    <div
      className={
        isStoryVisible ? "dive-experience" : "dive-experience is-hidden"
      }
    >
      <DiveBackdrop
        depth={progress}
        motion={isStoryVisible && !reducedMotion}
        quality="low"
      />
      <aside className="depth-meter" aria-label="潜水深度">
        <p className="depth-meter__reading" aria-live="polite">
          <span>{activeStop.depth}</span>
          <small>{activeStop.label}</small>
        </p>
        <nav>
          <ol className="depth-meter__track">
            {diveDepthStops.map((stop) => (
              <li
                key={stop.id}
                className={progress >= stop.progress ? "is-passed" : ""}
              >
                <a
                  href={`#${stop.id}`}
                  aria-current={activeStop.id === stop.id ? "step" : undefined}
                >
                  <span className="depth-meter__dot" />
                  <span className="sr-only">
                    {stop.label} — {stop.depth}
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </aside>
    </div>
  );
}
