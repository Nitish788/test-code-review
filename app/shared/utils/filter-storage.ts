import { FilterState } from "../types/filter";

const FILTER_STATE_KEY = "tableFilterState";

export const filterStorage = {
  getFilterState: (): FilterState => {
    if (typeof window === "undefined") return {};

    const stored = localStorage.getItem(FILTER_STATE_KEY);
    return stored ? JSON.parse(stored) : {};
  },

  setFilterState: (state: FilterState): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem(FILTER_STATE_KEY, JSON.stringify(state));
  },
};
