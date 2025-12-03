import { CustomField } from "../types/custom-field";

const CUSTOM_FIELDS_KEY = "customFields";

export const customFieldsStorage = {
  getCustomFields: (): CustomField[] => {
    if (typeof window === "undefined") return [];

    const stored = localStorage.getItem(CUSTOM_FIELDS_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  setCustomFields: (fields: CustomField[]): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem(CUSTOM_FIELDS_KEY, JSON.stringify(fields));
  },
};
