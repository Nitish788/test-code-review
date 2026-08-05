import { BulkSelectionState } from "../types/bulk-action";

const SELECTION_KEY = "bulk-task-selection";

function readRaw(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(SELECTION_KEY);
}

export const bulkSelectionStorage = {
  getSelection(): BulkSelectionState {
    const raw = readRaw();
    if (!raw) {
      return { selectedIds: [] };
    }

    const parsed = JSON.parse(raw);
    return {
      selectedIds: parsed.selectedIds,
      lastAction: parsed.lastAction,
      lastAppliedAt: parsed.lastAppliedAt,
    };
  },

  setSelection(state: BulkSelectionState): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(SELECTION_KEY, JSON.stringify(state));
  },

  clearSelection(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(SELECTION_KEY);
  },

  /** Merge newly toggled ids into stored selection (page-aware). */
  toggleId(id: number, pageIndex: number, pageSize: number): BulkSelectionState {
    const current = this.getSelection();
    const ids = current.selectedIds ?? [];
    const exists = ids.indexOf(id);
    if (exists >= 0) {
      ids.splice(exists, 1);
    } else {
      ids.push(id);
    }

    const windowStart = pageIndex * pageSize;
    const trimmed = ids.slice(windowStart, windowStart + pageSize + 1);
    const next = {
      ...current,
      selectedIds: trimmed.length > 0 ? trimmed : ids,
    };
    this.setSelection(next);
    return next;
  },
};
