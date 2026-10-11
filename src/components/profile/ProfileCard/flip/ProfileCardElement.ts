import { watchTilt } from "./orientationSensor";
import { holdScreenAwake } from "./screenWakeLock";
import { spin } from "./spin";
import { nextInverted } from "./tilt";

class ProfileCardElement extends HTMLElement {
  #isFlipped = false;
  #isInverted = false;
  #isManual = false;
  #stopSharing: (() => void) | null = null;
  #listeners: AbortController | null = null;

  connectedCallback() {
    this.#listeners = new AbortController();
    const { signal } = this.#listeners;
    this.addEventListener("click", this.#handleClick, { signal });
    document.addEventListener("keydown", this.#handleKeydown, { signal });
  }

  disconnectedCallback() {
    this.#listeners?.abort();
    this.#listeners = null;
    this.#stopSharing?.();
    this.#stopSharing = null;
  }

  #handleClick = (event: MouseEvent) => {
    if (!(event.target instanceof Element)) return;

    if (event.target.closest("[data-card-flip]")) {
      this.#setFlipped(!this.#isFlipped);
    } else if (event.target.closest("[data-card-invert]")) {
      this.#isManual = true;
      this.#setInverted(!this.#isInverted);
    }
  };

  #handleKeydown = (event: KeyboardEvent) => {
    if (event.key === "Escape" && this.#isFlipped) this.#setFlipped(false);
  };

  #handleTilt = (beta: number | null) => {
    if (this.#isManual) return;
    this.#setInverted(nextInverted(this.#isInverted, beta));
  };

  #setFlipped(flipped: boolean) {
    this.#isFlipped = flipped;

    if (flipped) {
      const stopTilt = watchTilt(this.#handleTilt);
      const releaseScreen = holdScreenAwake();
      this.#stopSharing = () => {
        stopTilt();
        releaseScreen();
      };
    } else {
      this.#stopSharing?.();
      this.#stopSharing = null;
      this.#isManual = false;
      this.#setInverted(false);
    }

    this.#renderFlipped();
  }

  #setInverted(inverted: boolean) {
    if (this.#isInverted === inverted) return;
    this.#isInverted = inverted;
    this.toggleAttribute("data-inverted", inverted);
    this.querySelector("[data-card-invert]")?.setAttribute(
      "aria-pressed",
      String(inverted),
    );
    spin(this, inverted);
  }

  #renderFlipped() {
    const front = this.querySelector<HTMLElement>("[data-card-front]");
    const back = this.querySelector<HTMLElement>("[data-card-back]");
    this.toggleAttribute("data-flipped", this.#isFlipped);
    front?.toggleAttribute("inert", this.#isFlipped);
    back?.toggleAttribute("inert", !this.#isFlipped);
    (this.#isFlipped ? back : front)
      ?.querySelector<HTMLElement>("[data-card-flip]")
      ?.focus({ preventScroll: true });
  }
}

if (!customElements.get("profile-card")) {
  customElements.define("profile-card", ProfileCardElement);
}
