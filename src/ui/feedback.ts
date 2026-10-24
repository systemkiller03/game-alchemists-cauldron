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
