const HISTORY_KEY = "alam_ai_history";

// Tracks completed interview sessions locally so the Dashboard can list
// "previous interviews" without a dedicated backend endpoint.
export function addToHistory(sessionId, score) {
  const list = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
  const filtered = list.filter((h) => h.sessionId !== sessionId);
  filtered.unshift({
    sessionId,
    score,
    date: new Date().toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
  });
  localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered.slice(0, 20)));
}
