import { DEFAULT_DIFFICULTY } from "../data/difficulty";
import { Difficulty, ILeaderboardEntry } from "../types/types";
export type { ILeaderboardEntry };

export const LEADERBOARD_STORAGE_KEY = "alchemists_cauldron_leaderboard";
export const MAX_LEADERBOARD_ENTRIES = 10;
export const MIN_NAME_LENGTH = 2;
export const MAX_NAME_LENGTH = 15;

const VALID_CHAR_REGEX = /^[\p{L}0-9 _-]+$/u;

function getStorageKey(difficulty: Difficulty): string {
  return `${LEADERBOARD_STORAGE_KEY}_${difficulty}`;
}

export function validatePlayerName(name: string): boolean {
  if (typeof name !== "string") return false;
  if (name.length < MIN_NAME_LENGTH || name.length > MAX_NAME_LENGTH) {
    return false;
  }
  if (!VALID_CHAR_REGEX.test(name)) {
    return false;
  }
  if (name.trim().length === 0) {
    return false;
  }
  return true;
}

export function getNameValidationError(name: string): string | null {
  if (typeof name !== "string" || name.length === 0) {
    return "Please enter a name.";
  }
  if (name.length < MIN_NAME_LENGTH) {
    return `Name must be at least ${MIN_NAME_LENGTH} characters.`;
  }
  if (name.length > MAX_NAME_LENGTH) {
    return `Name must not exceed ${MAX_NAME_LENGTH} characters.`;
  }
  if (!VALID_CHAR_REGEX.test(name)) {
    return "Allowed: letters, digits, space, _ and -.";
  }
  if (name.trim().length === 0) {
    return "Name cannot be only spaces.";
  }
  return null;
}

export function formatDate(
  dateOrTimestamp: Date | number = Date.now(),
): string {
  const d =
    typeof dateOrTimestamp === "number"
      ? new Date(dateOrTimestamp)
      : dateOrTimestamp;
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = String(d.getFullYear());
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${day}.${month}.${year} ${hours}:${minutes}`;
}

export function sortLeaderboard(
  entries: ILeaderboardEntry[],
): ILeaderboardEntry[] {
  return [...entries].sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return a.timestamp - b.timestamp;
  });
}

export function getLeaderboard(
  difficulty: Difficulty = DEFAULT_DIFFICULTY,
): ILeaderboardEntry[] {
  try {
    const raw = localStorage.getItem(getStorageKey(difficulty));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    const validEntries: ILeaderboardEntry[] = [];
    for (const item of parsed) {
      if (
        item &&
        typeof item === "object" &&
        typeof item.name === "string" &&
        typeof item.score === "number" &&
        !Number.isNaN(item.score) &&
        typeof item.date === "string" &&
        typeof item.timestamp === "number" &&
        item.difficulty === difficulty
      ) {
        validEntries.push({
          name: item.name,
          score: item.score,
          date: item.date,
          timestamp: item.timestamp,
          difficulty,
        });
      }
    }

    return sortLeaderboard(validEntries).slice(0, MAX_LEADERBOARD_ENTRIES);
  } catch {
    return [];
  }
}

export function isScoreEligibleForTop10(
  score: number,
  difficulty: Difficulty = DEFAULT_DIFFICULTY,
): boolean {
  const entries = getLeaderboard(difficulty);
  if (entries.length < MAX_LEADERBOARD_ENTRIES) {
    return true;
  }
  const lowestScore = entries[MAX_LEADERBOARD_ENTRIES - 1].score;
  return score > lowestScore;
}

export function addLeaderboardEntry(
  name: string,
  score: number,
  timestamp: number = Date.now(),
  difficulty: Difficulty = DEFAULT_DIFFICULTY,
): ILeaderboardEntry[] {
  if (!validatePlayerName(name)) {
    return getLeaderboard(difficulty);
  }

  try {
    const entries = getLeaderboard(difficulty);
    const newEntry: ILeaderboardEntry = {
      name: name.trim(),
      score,
      date: formatDate(timestamp),
      timestamp,
      difficulty,
    };

    entries.push(newEntry);
    const sorted = sortLeaderboard(entries).slice(0, MAX_LEADERBOARD_ENTRIES);
    localStorage.setItem(getStorageKey(difficulty), JSON.stringify(sorted));
    return sorted;
  } catch {
    return getLeaderboard(difficulty);
  }
}

export function clearLeaderboard(
  difficulty: Difficulty = DEFAULT_DIFFICULTY,
): void {
  try {
    localStorage.removeItem(getStorageKey(difficulty));
  } catch {
    // Gracefully ignore localStorage errors
  }
}
