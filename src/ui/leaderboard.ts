import {
  clearLeaderboard,
  getLeaderboard,
  ILeaderboardEntry,
} from "../storage/leaderboard";
import { DEFAULT_DIFFICULTY } from "../data/difficulty";
import { Difficulty } from "../types/types";

function escapeHtml(str: string): string {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function renderTableRows(entries: ILeaderboardEntry[]): string {
  if (entries.length === 0) {
    return `
      <tr>
        <td colspan="5" class="leaderboard-empty-cell">
          No scores recorded yet. Brew potions and claim your rank!
        </td>
      </tr>
    `;
  }

  return entries
    .map(
      (entry, index) => `
      <tr class="leaderboard-row ${index < 3 ? `rank-top rank-${index + 1}` : ""}">
        <td class="col-rank">#${index + 1}</td>
        <td class="col-name">${escapeHtml(entry.name)}</td>
        <td class="col-score">${entry.score}</td>
        <td class="col-date">${escapeHtml(entry.date)}</td>
        <td class="col-difficulty">${entry.difficulty[0].toUpperCase()}${entry.difficulty.slice(1)}</td>
      </tr>
    `,
    )
    .join("");
}

export function openClearConfirmationDialog(onConfirm: () => void): void {
  const existingDialog = document.getElementById("confirm-clear-dialog");
  if (existingDialog) {
    existingDialog.remove();
  }

  const backdrop = document.createElement("div");
  backdrop.id = "confirm-clear-dialog";
  backdrop.className = "modal-backdrop confirm-backdrop";
  backdrop.setAttribute("role", "dialog");
  backdrop.setAttribute("aria-modal", "true");
  backdrop.setAttribute("aria-labelledby", "confirm-clear-title");

  backdrop.innerHTML = `
    <div class="modal-card confirm-card">
      <h3 id="confirm-clear-title" class="confirm-title">Clear Leaderboard?</h3>
      <p class="confirm-message">
        Are you sure you want to clear all high scores? This action cannot be undone.
      </p>
      <div class="confirm-actions">
        <button type="button" id="btn-confirm-cancel" class="btn-secondary">
          Cancel
        </button>
        <button type="button" id="btn-confirm-clear" class="btn-danger">
          Clear All
        </button>
      </div>
    </div>
  `;

  const closeDialog = (): void => {
    document.removeEventListener("keydown", handleKeydown);
    backdrop.remove();
  };

  const handleKeydown = (e: KeyboardEvent): void => {
    if (e.key === "Escape") {
      closeDialog();
    }
  };

  document.addEventListener("keydown", handleKeydown);

  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) {
      closeDialog();
    }
  });

  const cancelBtn = backdrop.querySelector<HTMLButtonElement>(
    "#btn-confirm-cancel",
  );
  const confirmBtn =
    backdrop.querySelector<HTMLButtonElement>("#btn-confirm-clear");

  cancelBtn?.addEventListener("click", closeDialog);
  confirmBtn?.addEventListener("click", () => {
    closeDialog();
    onConfirm();
  });

  document.body.appendChild(backdrop);
  cancelBtn?.focus();
}

export function openLeaderboardModal(
  difficulty: Difficulty = DEFAULT_DIFFICULTY,
): void {
  const existingModal = document.getElementById("leaderboard-modal");
  if (existingModal) {
    existingModal.remove();
  }

  const backdrop = document.createElement("div");
  backdrop.id = "leaderboard-modal";
  backdrop.className = "modal-backdrop leaderboard-backdrop";
  backdrop.setAttribute("role", "dialog");
  backdrop.setAttribute("aria-modal", "true");
  backdrop.setAttribute("aria-labelledby", "leaderboard-title");

  const entries = getLeaderboard(difficulty);

  backdrop.innerHTML = `
    <div class="modal-card leaderboard-card">
      <div class="modal-header">
        <h2 id="leaderboard-title" class="modal-title">🏆 Top 10 Alchemists</h2>
        <button type="button" class="btn-close-icon" id="btn-close-x" aria-label="Close leaderboard">&times;</button>
      </div>
      <div class="modal-body leaderboard-body" id="leaderboard-table-container">
        <table class="leaderboard-table" aria-label="Top 10 leaderboard">
          <thead>
            <tr>
              <th scope="col" class="col-rank">Rank</th>
              <th scope="col" class="col-name">Name</th>
              <th scope="col" class="col-score">Score</th>
              <th scope="col" class="col-date">Date</th>
              <th scope="col" class="col-difficulty">Difficulty</th>
            </tr>
          </thead>
          <tbody id="leaderboard-tbody">
            ${renderTableRows(entries)}
          </tbody>
        </table>
      </div>
      <div class="modal-footer leaderboard-footer">
        <button type="button" id="btn-clear-leaderboard" class="btn-danger btn-clear-leaderboard" ${
          entries.length === 0 ? "disabled" : ""
        }>
          Clear Leaderboard
        </button>
        <button type="button" id="btn-close-leaderboard" class="btn-secondary btn-close-modal">
          Close
        </button>
      </div>
    </div>
  `;

  const closeModal = (): void => {
    document.removeEventListener("keydown", handleKeydown);
    backdrop.remove();
  };

  const handleKeydown = (e: KeyboardEvent): void => {
    if (e.key === "Escape") {
      // If confirmation dialog is open, let that close first
      if (document.getElementById("confirm-clear-dialog")) return;
      closeModal();
    }
  };

  document.addEventListener("keydown", handleKeydown);

  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) {
      closeModal();
    }
  });

  const closeXBtn = backdrop.querySelector<HTMLButtonElement>("#btn-close-x");
  const closeBtn = backdrop.querySelector<HTMLButtonElement>(
    "#btn-close-leaderboard",
  );
  const clearBtn = backdrop.querySelector<HTMLButtonElement>(
    "#btn-clear-leaderboard",
  );

  closeXBtn?.addEventListener("click", closeModal);
  closeBtn?.addEventListener("click", closeModal);

  clearBtn?.addEventListener("click", () => {
    openClearConfirmationDialog(() => {
      clearLeaderboard(difficulty);
      const tbody = backdrop.querySelector("#leaderboard-tbody");
      if (tbody) {
        tbody.innerHTML = renderTableRows([]);
      }
      if (clearBtn) {
        clearBtn.disabled = true;
      }
    });
  });

  document.body.appendChild(backdrop);
  closeBtn?.focus();
}
