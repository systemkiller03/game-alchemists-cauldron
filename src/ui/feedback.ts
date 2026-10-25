export function showFeedback(
  message: string,
  type: "success" | "failure",
): void {
  const container = document.getElementById("feedback-message");
  if (!container) return;

  container.className = `feedback-message feedback-${type}`;
  container.textContent = message;

  // Re-trigger CSS animation
  container.classList.remove("feedback-animate");
  void container.offsetWidth; // Force reflow for pure CSS animation restart
  container.classList.add("feedback-animate");
}

export function playBrewAnimation(success: boolean): void {
  const cauldron = document.getElementById("cauldron");
  const station = document.getElementById("brewing-station");
  if (!cauldron || !station) return;

  const restartAnimation = (target: HTMLElement, className: string): void => {
    target.classList.remove(className);
    void target.offsetWidth;
    target.classList.add(className);
    target.addEventListener(
      "animationend",
      (event: AnimationEvent): void => {
        if (event.target === target) target.classList.remove(className);
      },
      { once: true },
    );
  };

  if (success) {
    restartAnimation(cauldron, "cauldron--success");
    return;
  }

  restartAnimation(cauldron, "cauldron--failure");
  restartAnimation(station, "brewing-station--failure");
}
